// src/pages/Projects.jsx
import { useEffect, useState } from 'react';
import { Inbox, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

import Sidebar from '../../Components/common/Sidebar';
import Header from '../../Components/common/Header';
import TablePagination from '../../Components/common/TablePagination';
import ProjectHero from '../../Components/projects/ProjectHero';
import ProjectFilterHeader from '../../Components/projects/ProjectFilterHeader';
import ProjectTable from '../../Components/projects/ProjectTable';
import ProjectDetailModal from '../../Components/projects/ProjectDetailModal';
import { ShowProjects, downloadProject } from '../../api/project';
import {
  courseCodesOf,
  fromProjectRecord,
  matchesProject,
  sortByDueDate,
} from '../../utils/project.js';

const PAGE_SIZE = 6;

export default function Projects() {
  // Everything the table shows comes from GET /student/projects.
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [page, setPage] = useState(1);

  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('');

  const [detailProject, setDetailProject] = useState(null);

  // Load every project once; the table shows exactly what the API returns.
  useEffect(() => {
    let isActive = true;

    ShowProjects()
      .then((response) => {
        if (!isActive) return;

        // The client unwraps the JSON envelope, but a bare array is accepted too.
        const payload = response?.data ?? response;
        const records = Array.isArray(payload) ? payload : [];

        setProjects(records.map(fromProjectRecord));
      })
      .catch((error) => {
        console.error('Failed to load projects:', error);

        if (isActive) {
          setLoadError(error?.message || 'Could not load projects');
        }
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  // Dropdown options come from the projects we actually have.
  const courses = courseCodesOf(projects);

  const filteredProjects = sortByDueDate(projects).filter((project) =>
    matchesProject(project, { query: searchQuery, course: courseFilter })
  );

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleProjects = filteredProjects.slice(
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

  const clearFilters = () => {
    setSearchQuery('');
    setCourseFilter('');
    setPage(1);
  };

  const handleDownload = async (project) => {
    if (!project.fileUrl) {
      toast.info('This project has no file attached.');
      return;
    }

    try {
      const response = await downloadProject(project.id);
      const payload = response?.data instanceof Blob ? response.data : response;
      const blob =
        payload instanceof Blob
          ? payload
          : new Blob([payload], { type: 'application/octet-stream' });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', project.fileName || 'project');
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

  const hasProjects = projects.length > 0;

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-slate-800 flex font-sans antialiased">
      <Sidebar />

      <div className="flex-1 xl:pl-64 flex flex-col min-w-0">
        <Header />

        <div className="flex-1 p-4 sm:p-6 max-w-[1500px] w-full mx-auto space-y-4">
          <ProjectHero />

          <ProjectFilterHeader
            searchQuery={searchQuery}
            setSearchQuery={handleSearchChange}
            courseFilter={courseFilter}
            setCourseFilter={handleCourseChange}
            courses={courses}
            onClearAll={clearFilters}
          />

          {/* Results */}
          {isLoading ? (
            <div className="surface-card p-12 text-center">
              <Loader2 className="mx-auto h-5 w-5 animate-spin text-slate-300" />

              <p className="mt-3 text-[12.5px] font-medium text-slate-600">
                Loading projects…
              </p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="surface-card p-12 text-center">
              <Inbox className="mx-auto h-5 w-5 text-slate-300" />

              <p className="mt-3 text-[12.5px] font-medium text-slate-600">
                {hasProjects
                  ? 'No projects match your filters'
                  : loadError || 'No projects have been shared yet'}
              </p>

              <p className="mt-1 text-[11.5px] text-slate-400">
                {hasProjects
                  ? 'Try another course or search term.'
                  : 'Projects assigned by your teachers will appear here.'}
              </p>
            </div>
          ) : (
            <div className="surface-card overflow-hidden">
              <ProjectTable
                projects={visibleProjects}
                startIndex={(currentPage - 1) * PAGE_SIZE}
                onView={setDetailProject}
                onDownload={handleDownload}
              />

              <TablePagination
                page={currentPage}
                totalPages={totalPages}
                pageSize={PAGE_SIZE}
                totalItems={filteredProjects.length}
                onPageChange={setPage}
                noun="project"
                ariaLabel="Projects pagination"
              />
            </div>
          )}
        </div>
      </div>

      <ProjectDetailModal
        key={detailProject?.id || 'empty'}
        project={detailProject}
        onClose={() => setDetailProject(null)}
      />
    </div>
  );
}
