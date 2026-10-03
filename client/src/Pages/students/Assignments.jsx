// src/Pages/students/Assignments.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Inbox, Loader2, Share2 } from 'lucide-react';
import { toast } from 'react-toastify';

import Sidebar from '../../Components/common/Sidebar';
import Header from '../../Components/common/Header';
import TablePagination from '../../Components/common/TablePagination';
import AssignmentHero from '../../Components/assignments/AssignmentHero';
import AssignmentSummaryCards from '../../Components/assignments/AssignmentSummaryCards';
import AssignmentFilterHeader from '../../Components/assignments/AssignmentFilterHeader';
import AssignmentTable from '../../Components/assignments/AssignmentTable';
import AssignmentDetailModal from '../../Components/assignments/AssignmentDetailModal';
import { ShowAllassignment, downloadAssignment } from '../../api/assignment';
import {
  courseCodesOf,
  dueMonthsOf,
  fromAssignmentRecord,
  matchesAssignment,
} from '../../utils/assignment.js';

const PAGE_SIZE = 8;

export default function Assignments() {
  const navigate = useNavigate();

  // Everything the table shows comes from GET /student/assignments.
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [dueMonthFilter, setDueMonthFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const [detailAssignment, setDetailAssignment] = useState(null);

  // Load every assignment once; the table shows exactly what the API returns.
  useEffect(() => {
    let isActive = true;

    ShowAllassignment()
      .then((response) => {
        if (!isActive) return;

        // The client unwraps the JSON envelope, but a bare array is accepted too.
        const payload = response?.data ?? response;
        const records = Array.isArray(payload) ? payload : [];

        setAssignments(records.map(fromAssignmentRecord));
      })
      .catch((error) => {
        console.error('Failed to load assignments:', error);

        if (isActive) {
          setLoadError(error?.message || 'Could not load assignments');
        }
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  // Dropdown options come from the assignments we actually have.
  const courses = courseCodesOf(assignments);
  const dueMonths = dueMonthsOf(assignments);

  const filteredAssignments = assignments.filter((assignment) =>
    matchesAssignment(assignment, {
      query: searchQuery,
      course: courseFilter,
      dueMonth: dueMonthFilter,
      status: statusFilter,
    })
  );

  const totalPages = Math.max(1, Math.ceil(filteredAssignments.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleAssignments = filteredAssignments.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Any filter change sends the reader back to the first page.
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleCourseChange = (value) => {
    setCourseFilter(value);
    setPage(1);
  };

  const handleDueMonthChange = (value) => {
    setDueMonthFilter(value);
    setPage(1);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setCourseFilter('');
    setDueMonthFilter('');
    setStatusFilter('');
    setPage(1);
  };

  const handleDownload = async (assignment) => {
    if (!assignment.fileUrl) {
      toast.info('This assignment has no file attached.');
      return;
    }

    try {
      const response = await downloadAssignment(assignment.id);
      const payload = response?.data instanceof Blob ? response.data : response;
      const blob =
        payload instanceof Blob
          ? payload
          : new Blob([payload], { type: 'application/octet-stream' });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', assignment.fileName || 'assignment');
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      toast.success('File downloaded successfully!');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error(`Download failed: ${error?.message || 'Unknown error'}`);
    }
  };

  const hasAssignments = assignments.length > 0;

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-slate-800 flex font-sans antialiased">
      <Sidebar />

      <div className="flex-1 xl:pl-64 flex flex-col min-w-0">
        <Header />

        <div className="flex-1 p-4 sm:p-6 max-w-[1500px] w-full mx-auto space-y-4">
          <AssignmentHero />

          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            <AssignmentSummaryCards assignments={assignments} />

            <button
              type="button"
              onClick={() => navigate('/student/assignment/upload')}
              className="inline-flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-[10px] bg-blue-600 px-4 text-[12.5px] font-medium text-white transition hover:bg-blue-700 xl:w-auto"
            >
              <Share2 className="h-4 w-4" />
              Share Assignment
            </button>
          </div>

          <AssignmentFilterHeader
            searchQuery={searchQuery}
            setSearchQuery={handleSearchChange}
            courseFilter={courseFilter}
            setCourseFilter={handleCourseChange}
            dueMonthFilter={dueMonthFilter}
            setDueMonthFilter={handleDueMonthChange}
            statusFilter={statusFilter}
            setStatusFilter={handleStatusChange}
            courses={courses}
            dueMonths={dueMonths}
            onClearAll={clearFilters}
          />

          {/* Results */}
          {isLoading ? (
            <div className="surface-card p-12 text-center">
              <Loader2 className="mx-auto h-5 w-5 animate-spin text-slate-300" />

              <p className="mt-3 text-[12.5px] font-medium text-slate-600">
                Loading assignments…
              </p>
            </div>
          ) : filteredAssignments.length === 0 ? (
            <div className="surface-card p-12 text-center">
              <Inbox className="mx-auto h-5 w-5 text-slate-300" />

              <p className="mt-3 text-[12.5px] font-medium text-slate-600">
                {hasAssignments
                  ? 'No assignments match your filters'
                  : loadError || 'No assignments have been shared yet'}
              </p>

              <p className="mt-1 text-[11.5px] text-slate-400">
                {hasAssignments
                  ? 'Try another course, due date or status.'
                  : 'Assignments shared by your teachers will appear here.'}
              </p>
            </div>
          ) : (
            <div className="surface-card overflow-hidden">
              <AssignmentTable
                assignments={visibleAssignments}
                startIndex={(currentPage - 1) * PAGE_SIZE}
                onView={setDetailAssignment}
                onDownload={handleDownload}
              />

              <TablePagination
                page={currentPage}
                totalPages={totalPages}
                pageSize={PAGE_SIZE}
                totalItems={filteredAssignments.length}
                onPageChange={setPage}
                noun="assignment"
                ariaLabel="Assignments pagination"
              />
            </div>
          )}
        </div>
      </div>

      <AssignmentDetailModal
        key={detailAssignment?.id || 'empty'}
        assignment={detailAssignment}
        onDownload={handleDownload}
        onClose={() => setDetailAssignment(null)}
      />
    </div>
  );
}
