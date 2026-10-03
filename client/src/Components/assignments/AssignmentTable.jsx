import { CalendarDays, Download, Eye, FileText } from 'lucide-react';

import { assignmentStatusTone } from '../../utils/assignment.js';
import { formatPaddedDate } from '../../utils/date.js';

const COLUMNS = ['#', 'Title', 'Course', 'Subject', 'Due Date', 'Status', 'Actions'];

/**
 * Course assignments, one row each. `startIndex` keeps the running number going
 * across pages (page two starts at 9 when the page size is eight).
 */
export default function AssignmentTable({
  assignments = [],
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
          {assignments.map((assignment, index) => (
            <tr
              key={assignment.id}
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
                    {assignment.title}
                  </span>
                </div>
              </td>

              {/* Course */}
              <td className="whitespace-nowrap px-4 py-3 align-middle text-[12.5px] text-slate-600 tabular-nums">
                {assignment.course || '—'}
              </td>

              {/* Subject */}
              <td className="px-4 py-3 align-middle text-[12.5px] text-slate-600">
                {assignment.subject}
              </td>

              {/* Due date */}
              <td className="whitespace-nowrap px-4 py-3 align-middle">
                <span className="flex items-center gap-2 text-[12px] text-slate-600">
                  <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" />

                  <span className="tabular-nums">
                    {formatPaddedDate(assignment.dueDate)}
                  </span>
                </span>
              </td>

              {/* Status */}
              <td className="px-4 py-3 align-middle">
                <span
                  className={`inline-flex whitespace-nowrap rounded-md px-2 py-[3px] text-[11px] font-medium ${assignmentStatusTone(
                    assignment.status
                  )}`}
                >
                  {assignment.status}
                </span>
              </td>

              {/* Actions */}
              <td className="px-4 py-3 align-middle">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onView?.(assignment)}
                    className="inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-[8px] border border-blue-100 bg-blue-50 px-3 text-[12px] font-medium text-blue-700 transition hover:bg-blue-100"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View
                  </button>

                  <button
                    type="button"
                    onClick={() => onDownload?.(assignment)}
                    className="inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-[8px] border border-blue-100 bg-blue-50 px-3 text-[12px] font-medium text-blue-700 transition hover:bg-blue-100"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>

      {/* Phone layout: one card per assignment, so nothing needs sideways scrolling. */}
      <ul className="divide-y divide-slate-100 md:hidden">
        {assignments.map((assignment) => (
          <li key={assignment.id} className="space-y-3 p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] border border-blue-100 bg-blue-50 text-blue-600">
                <FileText className="h-4 w-4" />
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium text-slate-800">
                  {assignment.title}
                </p>

                <p className="mt-0.5 text-[11.5px] text-slate-400">
                  {assignment.course || '—'} ·{' '}
                  {assignment.subject || 'Subject not listed'}
                </p>
              </div>

              <span
                className={`inline-flex shrink-0 whitespace-nowrap rounded-md px-2 py-[3px] text-[11px] font-medium ${assignmentStatusTone(
                  assignment.status
                )}`}
              >
                {assignment.status}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-[12px] text-slate-600">
                <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" />

                <span className="tabular-nums">
                  {formatPaddedDate(assignment.dueDate)}
                </span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onView?.(assignment)}
                  className="inline-flex h-8 items-center gap-1.5 rounded-[8px] border border-blue-100 bg-blue-50 px-3 text-[12px] font-medium text-blue-700 transition hover:bg-blue-100"
                >
                  <Eye className="h-3.5 w-3.5" />
                  View
                </button>

                <button
                  type="button"
                  onClick={() => onDownload?.(assignment)}
                  className="inline-flex h-8 items-center gap-1.5 rounded-[8px] border border-blue-100 bg-blue-50 px-3 text-[12px] font-medium text-blue-700 transition hover:bg-blue-100"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
