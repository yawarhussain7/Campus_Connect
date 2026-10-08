// src/pages/PastPapers.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Inbox, Upload } from 'lucide-react';
import { toast } from 'react-toastify';

import Sidebar from '../../Components/common/Sidebar';
import Header from '../../Components/common/Header';
import PastPaperHeader from '../../Components/paper/PastPaperHeader';
import PastPaperTable from '../../Components/paper/PastPaperTable';
import TablePagination from '../../Components/common/TablePagination';
import { ShowPapers, downloadPaper, paperFileUrl } from '../../api/paper.js';
import { examLabel } from '../../utils/paper.js';
import { mergeDepartments } from '../../utils/departments.js';

const PAGE_SIZE = 6;

// Stand-in list used only when the papers API cannot be reached.
const INITIAL_PAPERS = [
  {
    id: 1,
    subject: 'Machine Learning',
    instructor: 'Aris Thorne',
    semester: 'Semester 5',
    year: 2025,
    exam: 'Mid',
    batch: 'SP23',
    department: 'Computer Science',
    hasSolution: true,
    fileSize: 2516582,
    createdAt: '2025-04-28T09:00:00.000Z',
  },
  {
    id: 2,
    subject: 'Database Systems',
    instructor: 'Sarah Jenkins',
    semester: 'Semester 3',
    year: 2024,
    exam: 'Final',
    batch: 'FA22',
    department: 'Computer Science',
    hasSolution: false,
    fileSize: 3250586,
    createdAt: '2025-03-15T09:00:00.000Z',
  },
];

const uniqueValues = (list, key) => [
  ...new Set(list.map((item) => item?.[key]).filter(Boolean)),
];

export default function PastPapers() {
  const navigate = useNavigate();

  const [papersList, setPapersList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [examTypeFilter, setExamTypeFilter] = useState('');
  const [page, setPage] = useState(1);

  // Load the papers once, ignoring the result if the page unmounts first.
  useEffect(() => {
    let isActive = true;

    ShowPapers()
      .then((response) => {
        if (!isActive) return;

        setPapersList(response && response.success ? response.data : INITIAL_PAPERS);
      })
      .catch((error) => {
        console.error('Failed to load past papers:', error);

        if (isActive) setPapersList(INITIAL_PAPERS);
      })
      .finally(() => {
        if (isActive) setLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  // The canonical department list plus any value stored on the papers we have.
  const departmentOptions = mergeDepartments(
    uniqueValues(papersList, 'department')
  );
  const courseOptions = uniqueValues(papersList, 'subject').sort();
  const semesterOptions = uniqueValues(papersList, 'semester').sort();
  const yearOptions = uniqueValues(papersList, 'year').sort(
    (a, b) => Number(b) - Number(a)
  );
  const examTypeOptions = uniqueValues(papersList, 'exam');

  const query = searchQuery.trim().toLowerCase();

  const filteredPapers = papersList.filter((paper) => {
    const haystack = [
      paper.subject,
      paper.courseCode,
      paper.batch,
      paper.department,
      paper.instructor,
      paper.year,
      examLabel(paper.exam),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    const matchesSearch = !query || haystack.includes(query);
    const matchesDepartment =
      !departmentFilter || paper.department === departmentFilter;
    const matchesCourse = !courseFilter || paper.subject === courseFilter;
    const matchesSemester =
      !semesterFilter || paper.semester === semesterFilter;
    const matchesYear =
      !yearFilter || String(paper.year) === String(yearFilter);
    const matchesExamType = !examTypeFilter || paper.exam === examTypeFilter;

    return (
      matchesSearch &&
      matchesDepartment &&
      matchesCourse &&
      matchesSemester &&
      matchesYear &&
      matchesExamType
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredPapers.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visiblePapers = filteredPapers
    .slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
    .map((paper) => ({ ...paper, id: paper._id || paper.id }));

  // Any filter change sends the reader back to the first page.
  const changeFilter = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const handleSearchChange = changeFilter(setSearchQuery);
  const handleDepartmentChange = changeFilter(setDepartmentFilter);
  const handleCourseChange = changeFilter(setCourseFilter);
  const handleSemesterChange = changeFilter(setSemesterFilter);
  const handleYearChange = changeFilter(setYearFilter);
  const handleExamTypeChange = changeFilter(setExamTypeFilter);

  const clearFilters = () => {
    setSearchQuery('');
    setDepartmentFilter('');
    setCourseFilter('');
    setSemesterFilter('');
    setYearFilter('');
    setExamTypeFilter('');
    setPage(1);
  };

  const handleDownload = async (paper) => {
    try {
      const response = await downloadPaper(paper.id);
      const blob =
        response.data instanceof Blob
          ? response.data
          : new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.setAttribute(
        'download',
        paper.originalName || paper.fileName || `${paper.subject}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Could not download this paper. Please try again.');
    }
  };

  const handlePreview = (paper) => {
    const url = paperFileUrl(paper.fileUrl);

    if (!url) {
      toast.error('No file is attached to this paper');
      return;
    }

    window.open(url, '_blank', 'noopener');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f9fc] text-slate-800 flex font-sans antialiased">
        <Sidebar />

        <div className="flex-1 xl:pl-64 flex flex-col min-w-0">
          <Header hideSearch />

          <div className="flex-1 p-4 sm:p-6 max-w-[1500px] w-full mx-auto">
            <div className="surface-card p-12 text-center">
              <p className="text-[12.5px] text-slate-500">Loading papers...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const hasPapers = papersList.length > 0;

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-slate-800 flex font-sans antialiased">
      <Sidebar />

      <div className="flex-1 xl:pl-64 flex flex-col min-w-0">
        <Header hideSearch />

        <div className="flex-1 p-4 sm:p-6 max-w-[1500px] w-full mx-auto space-y-4">
          {/* Page header */}
          <section className="surface-card border-blue-100 bg-blue-50/70 p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] border border-blue-100 bg-white text-blue-600">
                  <FileText className="h-5 w-5" />
                </span>

                <div>
                  <h1 className="text-[20px] font-semibold tracking-tight text-blue-700 sm:text-[24px]">
                    Past Papers
                  </h1>

                  <p className="mt-1 text-[12.5px] text-slate-500">
                    Find and practice previous examination papers.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/student/past-paper/upload')}
                className="inline-flex h-9 items-center gap-2 rounded-[10px] bg-blue-600 px-3.5 text-[12.5px] font-medium text-white transition hover:bg-blue-700"
              >
                <Upload className="h-4 w-4" />
                Upload paper
              </button>
            </div>
          </section>

          <PastPaperHeader
            searchQuery={searchQuery}
            setSearchQuery={handleSearchChange}
            departmentFilter={departmentFilter}
            setDepartmentFilter={handleDepartmentChange}
            courseFilter={courseFilter}
            setCourseFilter={handleCourseChange}
            semesterFilter={semesterFilter}
            setSemesterFilter={handleSemesterChange}
            yearFilter={yearFilter}
            setYearFilter={handleYearChange}
            examTypeFilter={examTypeFilter}
            setExamTypeFilter={handleExamTypeChange}
            departments={departmentOptions}
            courses={courseOptions}
            semesters={semesterOptions}
            years={yearOptions}
            examTypes={examTypeOptions}
            examLabelOf={examLabel}
            onClearAll={clearFilters}
          />

          {/* Results */}
          {filteredPapers.length === 0 ? (
            <div className="surface-card p-12 text-center">
              <Inbox className="mx-auto h-5 w-5 text-slate-300" />

              <p className="mt-3 text-[12.5px] font-medium text-slate-600">
                {hasPapers ? 'No papers match your filters' : 'No papers have been shared yet'}
              </p>

              <p className="mt-1 text-[11.5px] text-slate-400">
                {hasPapers
                  ? 'Try another course, semester or exam type.'
                  : 'Upload the first paper to get the library started.'}
              </p>
            </div>
          ) : (
            <div className="surface-card overflow-hidden">
              <PastPaperTable
                papers={visiblePapers}
                onDownload={handleDownload}
                onPreview={handlePreview}
              />

              <TablePagination
                noun="paper"
                ariaLabel="Papers pagination"
                page={currentPage}
                totalPages={totalPages}
                pageSize={PAGE_SIZE}
                totalItems={filteredPapers.length}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
