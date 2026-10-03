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
    <div className="overflow-x-auto">
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
  );
}
