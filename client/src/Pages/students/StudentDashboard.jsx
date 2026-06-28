// src/CampConnectorElite.jsx
import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../../api/dashboard';
import { useAppContext } from '../../context/AppContext';

// Subcomponent Imports
import Sidebar from '../../Components/common/Sidebar';
import Header from '../../Components/common/Header';
import AnalyticsSummary from '../../Components/dashboard/AnalyticsSummary';
import MatrixFilters from '../../Components/dashboard/MatrixFilters';
import ProjectCard from '../../Components/dashboard/ProjectCard';
import Leaderboard from '../../Components/dashboard/Leaderboard';
import ProjectReviewModal from '../../Components/dashboard/ProjectReviewModal';

// Unified Static Dataset Matrices
const DEPARTMENTS = ['Computer Science', 'Electrical Eng.', 'Mechanical Eng.', 'Business School'];
const SECTIONS = ['A', 'B', 'C', 'D'];
const TEACHERS = ['Dr. Aris Thorne', 'Prof. Clara Vance', 'Dr. Alan Turing', 'Sarah Jenkins'];

const INITIAL_PROJECTS = [
  {
    id: 1,
    title: 'AI-Powered Attendance System',
    desc: 'Face recognition attendance tracker using Python and OpenCV. Auto-marks roster grids seamlessly.',
    tags: ['Python', 'AI', 'OpenCV'],
    dept: 'Computer Science',
    teacher: 'Dr. Aris Thorne',
    section: 'A',
    author: 'Hamza Raza',
    uni: 'FAST NUCES',
    semester: 'Semester 5',
    likes: 48,
    comments: 12,
    rating: 4.5,
    img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80'
  },
  {
    id: 2,
    title: 'E-Commerce App – React + Firebase',
    desc: 'Full-stack online store with cart modules, secure checkout, and real-time inventory hooks.',
    tags: ['React', 'Firebase', 'Node.js'],
    dept: 'Computer Science',
    teacher: 'Prof. Clara Vance',
    section: 'B',
    author: 'Sara Malik',
    uni: 'LUMS',
    semester: 'Semester 5',
    likes: 61,
    comments: 19,
    rating: 4.8,
    img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80'
  },
  {
    id: 3,
    title: 'Hospital Management System',
    desc: 'Desktop application for managing patient routing, appointments, and database billing engines.',
    tags: ['Java', 'MySQL', 'Desktop'],
    dept: 'Software Engineering',
    teacher: 'Sarah Jenkins',
    section: 'C',
    author: 'Usman Tariq',
    uni: 'COMSATS',
    semester: 'Semester 6',
    likes: 34,
    comments: 8,
    rating: 4.2,
    img: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=400&q=80'
  }
];

export default function CampConnectorElite() {
  const { user } = useAppContext();
  
  // Dashboard Data State
  const [dashboardData, setDashboardData] = useState({
    totalAssignments: 0,
    totalUsers: 0,
    projectCount: 0,
    pastPaperCount: 0
  });
  const [dashboardLoading, setDashboardLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await getDashboardStats();
        if (response.success) {
          setDashboardData({
            totalAssignments: response.data.totalAssignments,
            totalUsers: response.data.totalUsers || 0,
            projectCount: response.data.projectCount || 0,
            pastPaperCount: response.data.totalPaper || 0
          });
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setDashboardLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  // Advanced Matrix Filtering States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterTeacher, setFilterTeacher] = useState('');
  const [filterSection, setFilterSection] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Social Engagement State Arrays
  const [likedProjects, setLikedProjects] = useState({});
  
  // Interactive Modal Review Pipeline States
  const [activeProjectModal, setActiveProjectModal] = useState(null);
  const [projectReviews, setProjectReviews] = useState({
    1: [
      { id: 101, author: 'Sara Malik', rating: 5, text: 'Awesome OpenCV logic! Works flawlessly on my local camera rigs.', date: '2 hours ago' },
      { id: 102, author: 'Ali Hassan', rating: 4, text: 'Clean structural setup, drops some frames during rendering blocks.', date: 'Yesterday' }
    ]
  });

  const handleProjectLike = (id) => {
    setLikedProjects(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddReview = (projId, reviewObj) => {
    setProjectReviews(prev => ({
      ...prev,
      [projId]: [...(prev[projId] || []), reviewObj]
    }));
  };

  // Filter Computation Logic
  const filteredProjects = INITIAL_PROJECTS.filter(proj => {
    return (
      proj.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (!filterDept || proj.dept === filterDept) &&
      (!filterTeacher || proj.teacher === filterTeacher) &&
      (!filterSection || proj.section === filterSection)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex font-sans antialiased">
      
      {/* 1. SIDEBAR */}
      <Sidebar />

      {/* MAIN VIEW STREAM CONTROLLER */}
      <div className="flex-1 xl:pl-64 flex flex-col min-w-0">
        
        {/* 2. HEADER */}
        <header>
          <Header 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
          />
        </header>

        {/* COMPONENT GRID WORKSPACE */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 p-6 gap-6 max-w-[1600px] w-full mx-auto">
          
          {/* PRIMARY VIEW PANEL CONTENT LINK */}
          <main className="lg:col-span-2 space-y-6">
            
            {/* 3. ANALYTICS TELEMETRY CHIPS */}
            <AnalyticsSummary 
              userName={user?.name || 'User'}
              totalUsers={dashboardData.totalUsers}
              assignmentCount={dashboardData.totalAssignments}
              projectCount={dashboardData.projectCount}
              pastPaperCount={dashboardData.pastPaperCount}
            />

            {/* 4. DYNAMIC CONDITIONAL DROP DOWN FILTERS PANEL */}
            {showFilters && (
              <MatrixFilters 
                departments={DEPARTMENTS}
                teachers={TEACHERS}
                sections={SECTIONS}
                filterDept={filterDept}
                setFilterDept={setFilterDept}
                filterTeacher={filterTeacher}
                setFilterTeacher={setFilterTeacher}
                filterSection={filterSection}
                setFilterSection={setFilterSection}
              />
            )}

            {/* 5. TRENDING PROJECTS SECTION */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-900">Trending Cross-Department Projects</h2>
                <span className="text-xs font-semibold text-blue-600 cursor-pointer hover:underline">View All Repositories</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filteredProjects.map((proj) => (
                  <ProjectCard 
                    key={proj.id}
                    proj={proj}
                    isLiked={!!likedProjects[proj.id]}
                    onLike={handleProjectLike}
                    onOpenReviews={() => setActiveProjectModal(proj)}
                  />
                ))}
              </div>
            </section>

          </main>

          {/* 7. RIGHT SIDEBAR METRICS PANEL */}
          <Leaderboard />

        </div>
      </div>

      {/* 8. GLOBAL REVIEW DIALOG PORTAL */}
      {activeProjectModal && (
        <ProjectReviewModal 
          proj={activeProjectModal}
          reviews={projectReviews[activeProjectModal.id] || []}
          onClose={() => setActiveProjectModal(null)}
          onAddReview={handleAddReview}
        />
      )}

    </div>
  );
}