import { CalendarDays, Download, GraduationCap } from 'lucide-react';

import ResourceAvatar from './ResourceAvatar';
import { RESOURCE_TYPES, formatDownloads } from './resourceData';

/**
 * One compact catalogue entry. Sized so three fit across the middle column
 * (between the filter rail and the sidebar) exactly like the design, with the
 * summary clamped so every card in a row stays the same height.
 */
export default function ResourceCard({ resource, onDownload, onOpen }) {
  const type = RESOURCE_TYPES[resource.type] ?? RESOURCE_TYPES.notes;
  const Icon = type.icon;

  return (
    <article className="surface-card hover-lift flex h-full flex-col p-3.5">
      <div className="flex items-start justify-between gap-2.5">
        <div className="min-w-0 flex-1">
          <span
            className={`inline-flex items-center rounded-full border px-1.5 py-[2px] text-[10px] font-semibold ${type.badge}`}
          >
            {type.label}
          </span>

          <h3 className="mt-1.5 text-[12.5px] font-bold leading-snug text-slate-900">
            <button
              type="button"
              onClick={() => onOpen?.(resource)}
              className="line-clamp-2 text-left transition hover:text-blue-700"
            >
              {resource.title}
            </button>
          </h3>

          <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-slate-500">
            {resource.description}
          </p>
        </div>

        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border ${type.tile}`}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>

      <div className="mb-2.5 mt-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10.5px] text-slate-500">
        <span className="inline-flex min-w-0 items-center gap-1">
          <GraduationCap className="h-3 w-3 shrink-0 text-slate-400" />
          <span className="truncate">{resource.department}</span>
        </span>

        <span className="inline-flex items-center gap-1">
          <CalendarDays className="h-3 w-3 shrink-0 text-slate-400" />
          <span className="whitespace-nowrap">{resource.semester}</span>
        </span>
      </div>

      {/* Wraps instead of squashing when the card is narrow (three per row). */}
      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2.5">
        <span className="flex min-w-0 items-center gap-1.5">
          <ResourceAvatar name={resource.uploader.name} src={resource.uploader.avatar} size={24} />

          <span className="min-w-0">
            <span className="block truncate text-[11px] font-semibold text-slate-700">
              {resource.uploader.name}
            </span>

            <span className="block truncate text-[10px] text-slate-400">
              {resource.posted} · {formatDownloads(resource.downloads)} downloads
            </span>
          </span>
        </span>

        <button
          type="button"
          onClick={() => onDownload?.(resource)}
          className="inline-flex h-7 shrink-0 items-center gap-1 rounded-[8px] bg-blue-600 px-2.5 text-[11px] font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
        >
          <Download className="h-3 w-3" />
          Download
        </button>
      </div>
    </article>
  );
}
