
import React from 'react';
import {
  ShieldCheck,
  Download,
  Users,
  MessageCircle,
} from 'lucide-react';

export default function MaterialCard({
  note,
  downloadCount,
  onDownload,
}) {
  const totalDownloads = note.downloads + downloadCount;

  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* Content */}
      <div className="min-w-0 flex-1">
        {/* Type + Status */}
        <div className="mb-2.5 flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600">
            {note.type}
          </span>

          <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-600">
            <ShieldCheck className="h-3 w-3" />
            {note.integrityStatus}
          </span>
        </div>

        {/* Title */}
        <h3 className="truncate text-sm font-semibold text-slate-900">
          {note.title}
        </h3>

        {/* Course Information */}
        <p className="mt-1 text-[11px] text-slate-400">
          {note.dept} · Sec {note.section} ·{' '}
          <span className="font-medium text-slate-600">
            {note.teacher}
          </span>
        </p>

        {/* Metadata */}
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span className="text-slate-500">{note.author}</span>
          </span>

          <span className="flex items-center gap-1">
            <Download className="h-3 w-3" />
            <span className="text-slate-500">
              {totalDownloads}
            </span>
          </span>

          <span className="flex items-center gap-1">
            <MessageCircle className="h-3 w-3" />
            <span>{note.comments}</span>
          </span>

          <span>{note.pages}</span>
        </div>
      </div>

      {/* Download */}
      <button
        type="button"
        onClick={() => onDownload(note.id)}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50 hover:text-blue-600"
        aria-label={`Download ${note.title}`}
      >
        <Download className="h-4 w-4" />
      </button>
    </div>
  );
}

