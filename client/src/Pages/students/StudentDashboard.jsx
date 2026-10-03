// src/Pages/students/StudentDashboard.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  FolderKanban,
  Loader2,
  ScrollText,
  Star,
} from 'lucide-react';

import { getDashboardStats } from '../../api/dashboard';
import { ShowAllassignment } from '../../api/assignment';
import { ShowProjects } from '../../api/project';
import { ShowReviews } from '../../api/review';
import { markAsRead } from '../../api/notifications';
import { useAppContext } from '../../context/AppContext';
import { currentTermLabel, daysUntil } from '../../utils/date';
import { fromAssignmentRecord, sortByDueDate as sortByDueDateAsc } from '../../utils/assignment.js';
import { courseOptionsOf, fromProjectRecord } from '../../utils/project.js';
import { averageRating, fromReviewRecord } from '../../utils/review.js';

import Sidebar from '../../Components/common/Sidebar';
import Header from '../../Components/common/Header';
import PageHeading from '../../Components/dashboard/PageHeading';
import StatTiles from '../../Components/dashboard/StatTiles';
import DeadlineTable from '../../Components/dashboard/DeadlineTable';
import ProjectList from '../../Components/dashboard/ProjectList';
import ProgressBars from '../../Components/dashboard/ProgressBars';
import ActivityFeed from '../../Components/dashboard/ActivityFeed';
import CalendarCard from '../../Components/dashboard/CalendarCard';
import MatrixFilters from '../../Components/dashboard/MatrixFilters';

export default function StudentDashboard() {
  const navigate = useNavigate();

  const { user, notifications } = useAppContext();

  const [stats, setStats] = useState({
    totalAssignments: 0,
    pastPaperCount: 0,
  });
  const [assignments, setAssignments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // The page is read from the API in one pass. A surface whose request fails
  // simply stays empty instead of falling back to sample rows.
  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      const [statsResult, assignmentResult, projectResult, reviewResult] =
        await Promise.allSettled([
          getDashboardStats(),
          ShowAllassignment(),
          ShowProjects(),
          ShowReviews(),
        ]);

      if (!isMounted) return;

      // The client unwraps the JSON envelope, but a bare array is accepted too.
      const recordsOf = (result) => {
        if (result.status !== 'fulfilled') {
          console.error('Dashboard request failed:', result.reason);
          return [];
        }

        const payload = result.value?.data ?? result.value;

        return Array.isArray(payload) ? payload : [];
      };

      if (statsResult.status === 'fulfilled') {
        const data = statsResult.value?.data || {};

        setStats({
          totalAssignments: data.totalAssignments || 0,
          pastPaperCount: data.totalPaper || 0,
        });
      } else {
        console.error('Dashboard request failed:', statsResult.reason);
      }

      setAssignments(recordsOf(assignmentResult).map(fromAssignmentRecord));
      setProjects(recordsOf(projectResult).map(fromProjectRecord));
      setReviews(recordsOf(reviewResult).map(fromReviewRecord));
      setIsLoading(false);
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  // Search + filter state (driven from the header controls)
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    department: '',
    course: '',
    status: '',
  });

  const clearFilters = () => {
    setFilters({ department: '', course: '', status: '' });
  };

  const handleFilterChange = (key, value) => {
    setFilters((previous) => ({ ...previous, [key]: value }));
  };

  // Each filter offers the values the loaded projects actually carry.
  const filterGroups = useMemo(() => {
    const valuesOf = (key) =>
      [...new Set(projects.map((project) => project[key]).filter(Boolean))].sort();

    return [
      {
        key: 'department',
        label: 'Department',
        placeholder: 'All Departments',
        options: valuesOf('department'),
      },
      {
        key: 'course',
        label: 'Course',
        placeholder: 'All Courses',
        // The dropdown shows the course name; the stored code is the value.
        options: courseOptionsOf(projects),
      },
      {
        key: 'status',
        label: 'Status',
        placeholder: 'All Statuses',
        options: valuesOf('status'),
      },
    ];
  }, [projects]);

  const query = searchQuery.trim().toLowerCase();

  const filteredProjects = projects.filter((project) => {
    const matchesQuery =
      !query ||
      [project.title, project.subject, project.course, project.department]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query));

    return (
      matchesQuery &&
      (!filters.department || project.department === filters.department) &&
      (!filters.course || project.course === filters.course) &&
      (!filters.status || project.status === filters.status)
    );
  });

  const activeFilters = filterGroups
    .filter((group) => filters[group.key])
    .map((group) => `${group.label}: ${filters[group.key]}`);

  // Live counters: the totals endpoint for the shelf counts, the loaded rows for
  // everything that has to be counted by status.
  const assignmentTotal = stats.totalAssignments;
  const projectTotal = projects.length;
  const paperTotal = stats.pastPaperCount;
  const reviewTotal = reviews.length;
  const averageScore = averageRating(reviews);

  const percentOf = (value, total) =>
    total > 0 ? Math.round((value / total) * 100) : 0;

  const assignmentsDone = assignments.filter(
    (assignment) => assignment.status === 'Submitted'
  ).length;
  const projectsDone = projects.filter(
    (project) => project.status === 'Submitted'
  ).length;
  const assignmentsPending = Math.max(0, assignmentTotal - assignmentsDone);
  const projectsPending = Math.max(0, projectTotal - projectsDone);

  const assignmentPercent = percentOf(assignmentsDone, assignmentTotal);
  const projectPercent = percentOf(projectsDone, projectTotal);

  const trackedPercents = [
    assignmentTotal > 0 ? assignmentPercent : null,
    projectTotal > 0 ? projectPercent : null,
  ].filter((value) => value !== null);

  const overallPercent = trackedPercents.length
    ? Math.round(
        trackedPercents.reduce((sum, value) => sum + value, 0) /
          trackedPercents.length
      )
    : 0;

  // Priority is derived from the stored due date, so the queue needs no priority
  // column of its own.
  const priorityOf = (dueDate) => {
    const days = daysUntil(dueDate) ?? 99;

    if (days <= 2) return 'High';
    if (days <= 7) return 'Medium';

    return 'Low';
  };

  // Deadlines are the real due dates the assignments and projects carry.
  const allDeadlines = sortByDueDateAsc([
    ...assignments
      .filter((assignment) => assignment.dueDate)
      .map((assignment) => ({
        id: `assignment-${assignment.id}`,
        title: assignment.title,
        code: assignment.course,
        course: assignment.subject,
        type: 'Assignment',
        priority: priorityOf(assignment.dueDate),
        due: assignment.dueDate,
      })),
    ...projects
      .filter((project) => project.dueDate)
      .map((project) => ({
        id: `project-${project.id}`,
        title: project.title,
        code: project.course,
        course: project.subject,
        type: 'Project',
        priority: priorityOf(project.dueDate),
        due: project.dueDate,
      })),
  ]);

  const dueThisWeek = allDeadlines.filter(
    (deadline) => (daysUntil(deadline.due) ?? 99) <= 7
  ).length;

  const deadlines = allDeadlines.slice(0, 6);

  const statTiles = [
    {
      key: 'assignments',
      label: 'Assignments',
      value: assignmentTotal,
      icon: ClipboardList,
      to: '/student/assignments',
      hint: assignmentsPending
        ? `${assignmentsPending} awaiting submission`
        : 'Nothing pending',
      tone: assignmentsPending ? 'accent' : 'positive',
    },
    {
      key: 'projects',
      label: 'Projects',
      value: projectTotal,
      icon: FolderKanban,
      to: '/student/projects',
      hint: projectsPending
        ? `${projectsPending} still pending`
        : 'Nothing pending',
    },
    {
      key: 'papers',
      label: 'Past papers',
      value: paperTotal,
      icon: ScrollText,
      to: '/student/past-papers',
      hint: paperTotal ? 'From the shared library' : 'Nothing shared yet',
      tone: 'positive',
    },
    {
      key: 'reviews',
      label: 'Teacher reviews',
      value: reviewTotal,
      icon: Star,
      to: '/student/teachers-review',
      hint: reviewTotal ? `Average ${averageScore} rating` : 'No reviews yet',
    },
  ];

  const progressItems = [
    {
      label: 'Assignments',
      value: assignmentPercent,
      caption: `${assignmentsDone}/${assignmentTotal}`,
    },
    {
      label: 'Projects',
      value: projectPercent,
      caption: `${projectsDone}/${projectTotal}`,
    },
  ];

  const calendarEvents = allDeadlines.map((deadline) => ({
    date: deadline.due,
    title: `${deadline.course || deadline.code} · ${deadline.title}`,
  }));

  const handleActivitySelect = async (notification) => {
    const id = notification._id || notification.id;

    if (!notification.isRead && id) {
      try {
        await markAsRead(id);
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }

    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc] font-sans text-slate-800 antialiased">
      <Sidebar />

      <div className="flex min-h-screen min-w-0 flex-col xl:pl-64">
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />

        <div className="mx-auto w-full max-w-[1500px] flex-1 space-y-4 p-4 sm:p-6">
          <PageHeading
            userName={user?.name || 'Student'}
            department={user?.department || 'Computer Science'}
            semester={user?.semester || currentTermLabel()}
            dueCount={dueThisWeek}
          />

          <StatTiles items={statTiles} />

          {showFilters && (
            <MatrixFilters
              groups={filterGroups}
              values={filters}
              onChange={handleFilterChange}
            />
          )}

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <main className="space-y-4 lg:col-span-8 xl:col-span-9">
              {isLoading ? (
                <div className="surface-card p-12 text-center">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin text-slate-300" />

                  <p className="mt-3 text-[12.5px] font-medium text-slate-600">
                    Loading your dashboard…
                  </p>
                </div>
              ) : (
                <>
                  <DeadlineTable items={deadlines} />

                  <ProjectList
                    projects={filteredProjects}
                    totalCount={projectTotal}
                    activeFilters={activeFilters}
                    onClearFilters={clearFilters}
                    onOpenProject={() => navigate('/student/projects')}
                  />
                </>
              )}
            </main>

            <aside className="space-y-4 lg:col-span-4 xl:col-span-3">
              <CalendarCard events={calendarEvents} />

              <ProgressBars
                items={progressItems}
                overall={overallPercent}
                term={currentTermLabel()}
              />

              <ActivityFeed
                items={notifications}
                onSelect={handleActivitySelect}
              />
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
