import { CalendarDays, Download, Eye, FileText } from 'lucide-react';

import GithubMark from '../common/GithubMark.jsx';
import { formatPaddedDate } from '../../utils/date.js';
import { statusTone } from '../../utils/project.js';

const COLUMNS = ['#', 'Title', 'Course', 'Subject', 'Due Date', 'Status', 'Action'];

/**
 * Assigned projects, one row each. `startIndex` keeps the running number going
 * across pages (page two starts at 7 when the page size is six). Rows that came
 * from an upload link to their repository, or download the attached file.
 */
export default function ProjectTable({
  projects = [],
  startIndex = 0,
  onView,
  onDownload,
}) {
  return (
    <>
      {/* Desk layout: the full table, scrollable if the columns ever exceed it. */}
      <div className="scroll-x hidden md:block">
        <table className="w-full min-w-[1020px] border-collapse text-left">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/70">
            {COLUMNS.map((column) => (
              <th
                key={column}
                scope="col"
                className="whitespace-nowrap px-4 py-3 text-[11.5px] font-medium text-slate-500"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {projects.map((project, index) => (
            <tr
              key={project.id}
              className="border-b border-slate-100 transition-colors last:border-b-0 hover:bg-slate-50/60"
            >
              {/* Row number */}
              <td className="px-4 py-3 align-middle text-[12.5px] text-slate-500 tabular-nums">
                {startIndex + index + 1}
              </td>

              {/* Title */}
              <td className="px-4 py-3 align-middle">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] border border-blue-100 bg-blue-50 text-blue-600">
                    <FileText className="h-4 w-4" />
                  </span>

                  <span className="text-[12.5px] font-medium text-slate-800">
                    {project.title}
                  </span>
                </div>
              </td>

              {/* Course */}
              <td className="whitespace-nowrap px-4 py-3 align-middle text-[12.5px] text-slate-600 tabular-nums">
                {project.course}
              </td>

              {/* Subject */}
              <td className="px-4 py-3 align-middle text-[12.5px] text-slate-600">
                {project.subject}
              </td>

              {/* Due date */}
              <td className="whitespace-nowrap px-4 py-3 align-middle">
                <span className="flex items-center gap-2 text-[12px] text-slate-600">
                  <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" />

                  <span className="tabular-nums">
                    {formatPaddedDate(project.dueDate)}
                  </span>
                </span>
              </td>

              {/* Status */}
              <td className="px-4 py-3 align-middle">
                <span
                  className={`inline-flex whitespace-nowrap rounded-md px-2 py-[3px] text-[11px] font-medium ${statusTone(
                    project.status
                  )}`}
                >
                  {project.status}
                </span>
              </td>

              {/* Actions */}
              <td className="px-4 py-3 align-middle">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onView?.(project)}
                    className="inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-[8px] border border-slate-200 bg-white px-3 text-[12px] font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View
                  </button>

                  {project.repo ? (
                    <a
                      href={project.repo}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-[8px] bg-blue-600 px-3 text-[12px] font-medium text-white transition hover:bg-blue-700"
                    >
                      <GithubMark className="h-3.5 w-3.5" />
                      Visit GitHub
                    </a>
                  ) : project.fileUrl ? (
                    <button
                      type="button"
                      onClick={() => onDownload?.(project)}
                      className="inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-[8px] bg-blue-600 px-3 text-[12px] font-medium text-white transition hover:bg-blue-700"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </button>
                  ) : (
                    <span className="text-[11.5px] text-slate-400">
                      No link
                    </span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>

      {/* Phone layout: one card per project, so nothing needs sideways scrolling. */}
      <ul className="divide-y divide-slate-100 md:hidden">
        {projects.map((project) => (
          <li key={project.id} className="space-y-3 p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] border border-blue-100 bg-blue-50 text-blue-600">
                <FileText className="h-4 w-4" />
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium text-slate-800">
                  {project.title}
                </p>

                <p className="mt-0.5 text-[11.5px] text-slate-400">
                  {project.course || '—'} · {project.subject || 'Subject not listed'}
                </p>
              </div>

              <span
                className={`inline-flex shrink-0 whitespace-nowrap rounded-md px-2 py-[3px] text-[11px] font-medium ${statusTone(
                  project.status
                )}`}
              >
                {project.status}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-[12px] text-slate-600">
                <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" />

                <span className="tabular-nums">
                  {formatPaddedDate(project.dueDate)}
                </span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onView?.(project)}
                  className="inline-flex h-8 items-center gap-1.5 rounded-[8px] border border-slate-200 bg-white px-3 text-[12px] font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                >
                  <Eye className="h-3.5 w-3.5" />
                  View
                </button>

                {project.repo ? (
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-8 items-center gap-1.5 rounded-[8px] bg-blue-600 px-3 text-[12px] font-medium text-white transition hover:bg-blue-700"
                  >
                    <GithubMark className="h-3.5 w-3.5" />
                    GitHub
                  </a>
                ) : project.fileUrl ? (
                  <button
                    type="button"
                    onClick={() => onDownload?.(project)}
                    className="inline-flex h-8 items-center gap-1.5 rounded-[8px] bg-blue-600 px-3 text-[12px] font-medium text-white transition hover:bg-blue-700"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </button>
                ) : (
                  <span className="text-[11.5px] text-slate-400">No link</span>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
