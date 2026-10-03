import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, ChevronRight, Inbox, X } from 'lucide-react';

import { formatPaddedDate } from '../../utils/date';
import { statusTone } from '../../utils/project.js';

const initialsOf = (title = '') =>
  title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

/**
 * Project queue. Uses monogram tiles instead of cover art so the list stays
 * dense and scannable, and exposes the active filter set inline. Every column
 * reads a stored field, so the rows are exactly what GET /student/projects
 * returned.
 */
export default function ProjectList({
  projects = [],
  totalCount = 0,
  activeFilters = [],
  onClearFilters,
  onOpenProject,
  viewAllTo = '/student/projects',
}) {
  const navigate = useNavigate();

  const hasFilters = activeFilters.length > 0;

  return (
    <section className="surface-card overflow-hidden">
      <div className="surface-card-header">
        <div className="min-w-0">
          <h2 className="text-[13px] font-semibold text-slate-900">
            Recent projects
          </h2>

          <p className="mt-0.5 text-[11.5px] text-slate-400">
            {totalCount > 0
              ? `${projects.length} of ${totalCount} in the registry`
              : 'Registry is empty'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate(viewAllTo)}
          className="inline-flex items-center gap-1 text-[11.5px] font-medium text-blue-600 transition hover:text-blue-700"
        >
          Open registry
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {hasFilters && (
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 bg-slate-50/50 px-4 py-2.5">
          <span className="text-[11px] font-medium text-slate-400">
            Filtered by
          </span>

          {activeFilters.map((filter) => {
            const label = typeof filter === 'string' ? filter : filter.label;

            return (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 py-[3px] text-[11px] font-medium text-slate-600"
              >
                {label}
              </span>
            );
          })}

          <button
            type="button"
            onClick={onClearFilters}
            className="ml-auto inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 transition hover:text-blue-700"
          >
            <X className="h-3 w-3" />
            Clear
          </button>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="flex flex-col items-center px-6 py-10 text-center">
          <Inbox className="h-5 w-5 text-slate-300" />

          <p className="mt-3 text-[12.5px] font-medium text-slate-600">
            No projects found
          </p>

          <p className="mt-1 text-[11.5px] text-slate-400">
            Try a different keyword or reset the filters.
          </p>

          {hasFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="mt-3 rounded-[10px] border border-slate-200 px-3 py-1.5 text-[11.5px] font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
            >
              Reset filters
            </button>
          )}
        </div>
      ) : (
        <ul>
          {projects.map((project) => {
            return (
              <li
                key={project.id}
                className="grid grid-cols-1 items-center gap-x-4 gap-y-2 border-t border-slate-100 px-4 py-3.5 transition first:border-t-0 hover:bg-slate-50/60 md:grid-cols-[minmax(0,1fr)_132px_148px_92px_32px]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-500">
                    {initialsOf(project.title)}
                  </span>

                  <div className="min-w-0">
                    <p className="truncate text-[12.5px] font-medium text-slate-800">
                      {project.title}
                    </p>

                    <p className="mt-0.5 truncate text-[11px] text-slate-400">
                      {project.subject} · {project.semester}
                    </p>
                  </div>
                </div>

                <div className="hidden min-w-0 md:block">
                  <p className="truncate text-[11.5px] text-slate-600">
                    {project.course || '—'}
                  </p>

                  <p className="mt-0.5 truncate text-[11px] text-slate-400">
                    {project.department || 'Department not listed'}
                  </p>
                </div>

                <div className="hidden items-center gap-2 md:flex">
                  <CalendarDays className="h-3.5 w-3.5 shrink-0 text-slate-400" />

                  <span className="text-[11.5px] text-slate-600 tabular-nums">
                    {formatPaddedDate(project.dueDate)}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 md:justify-end">
                  <span
                    className={`inline-flex whitespace-nowrap rounded-md px-2 py-[3px] text-[11px] font-medium ${statusTone(
                      project.status
                    )}`}
                  >
                    {project.status}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenProject?.(project)}
                  aria-label={`Open ${project.title} in the project registry`}
                  className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-slate-200 text-slate-400 transition hover:border-blue-200 hover:text-blue-600 md:justify-self-end"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
