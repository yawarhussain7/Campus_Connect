import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CloudUpload, FileSearch } from 'lucide-react';

import {
  currentTermLabel,
  firstNameOf,
  formatLongDate,
  greetingForNow,
} from '../../utils/date';

/**
 * Page title block: greeting, academic context and the two actions a student
 * actually opens the portal for. Intentionally flat - no banner artwork.
 */
export default function PageHeading({
  userName = 'Student',
  department = 'Computer Science',
  semester,
  dueCount = 0,
}) {
  const navigate = useNavigate();

  const termLabel =
    semester === undefined || semester === null || semester === ''
      ? currentTermLabel()
      : /^\d+$/.test(String(semester).trim())
      ? `Semester ${String(semester).trim()}`
      : semester;

  const meta = [
    department,
    termLabel,
    dueCount > 0
      ? `${dueCount} ${dueCount === 1 ? 'task' : 'tasks'} due this week`
      : 'nothing due this week',
  ];

  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-slate-400">
          {formatLongDate()}
        </p>

        <h1 className="mt-1.5 truncate text-[20px] font-semibold tracking-tight text-slate-900 sm:text-[22px]">
          {greetingForNow()}, {firstNameOf(userName)}
        </h1>

        <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px] text-slate-500">
          {meta.map((entry, index) => (
            <React.Fragment key={entry}>
              {index > 0 && (
                <span aria-hidden="true" className="text-slate-300">
                  ·
                </span>
              )}
              <span>{entry}</span>
            </React.Fragment>
          ))}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => navigate('/student/past-papers')}
          className="inline-flex h-9 items-center gap-2 rounded-[10px] border border-slate-200 bg-white px-3.5 text-[12.5px] font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
        >
          <FileSearch className="h-4 w-4 text-slate-400" />
          Past papers
        </button>

        <button
          type="button"
          onClick={() => navigate('/student/assignment/upload')}
          className="inline-flex h-9 items-center gap-2 rounded-[10px] bg-blue-600 px-3.5 text-[12.5px] font-medium text-white transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <CloudUpload className="h-4 w-4" />
          Upload assignment
        </button>
      </div>
    </div>
  );
}
