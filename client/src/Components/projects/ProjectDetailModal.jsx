import { BookOpen, CalendarDays, FileText, Tag, X } from 'lucide-react';

import GithubMark from '../common/GithubMark.jsx';
import { formatPaddedDate } from '../../utils/date.js';
import { statusTone } from '../../utils/project.js';

const Meta = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-2.5 rounded-[10px] border border-slate-200 bg-white px-3 py-2.5">
    <Icon className="h-4 w-4 shrink-0 text-slate-400" />

    <div className="min-w-0">
      <p className="text-[10.5px] leading-4 text-slate-400">{label}</p>

      <p className="truncate text-[12.5px] font-medium text-slate-700 tabular-nums">
        {value}
      </p>
    </div>
  </div>
);

/** Full copy of a single project, opened from the View button in the table. */
export default function ProjectDetailModal({ project, onClose }) {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="flex max-h-[calc(100dvh-2rem)] w-full max-w-lg flex-col overflow-hidden rounded-[14px] border border-slate-200 bg-white shadow-[0_12px_32px_rgba(15,23,42,0.10)]">
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-blue-100 bg-blue-50 text-blue-600">
              <FileText className="h-5 w-5" />
            </span>

            <div className="min-w-0">
              <h2 className="text-[14px] font-semibold text-slate-900">
                {project.title}
              </h2>

              <p className="mt-0.5 text-[11.5px] text-slate-400 tabular-nums">
                {project.course || '—'} · {project.subject || 'Subject not listed'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close project"
            className="rounded-[8px] p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {/* Status + deadline */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span
              className={`inline-flex whitespace-nowrap rounded-md px-2 py-[3px] text-[11px] font-medium ${statusTone(
                project.status
              )}`}
            >
              {project.status}
            </span>

            <span className="flex items-center gap-2 text-[12px] text-slate-600">
              <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" />

              <span className="tabular-nums">
                Due {formatPaddedDate(project.dueDate)}
              </span>
            </span>
          </div>

          {/* Course + subject */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Meta icon={BookOpen} label="Course" value={project.course} />
            <Meta icon={Tag} label="Subject" value={project.subject} />
          </div>

          {/* Brief */}
          <div>
            <p className="mb-1.5 text-[11px] font-medium text-slate-500">
              Description
            </p>

            <p className="rounded-[10px] border border-slate-200 bg-white px-3.5 py-3 text-[12.5px] leading-6 text-slate-600">
              {project.desc || 'No description has been added for this project.'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-end gap-2 border-t border-slate-100 px-5 py-3.5">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 items-center rounded-[10px] border border-slate-200 px-3.5 text-[12.5px] font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            Close
          </button>

          <a
            href={project.repo}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 items-center gap-2 rounded-[10px] bg-blue-600 px-3.5 text-[12.5px] font-medium text-white transition hover:bg-blue-700"
          >
            <GithubMark className="h-4 w-4" />
            Visit GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
