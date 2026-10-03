import { ArrowRight, CloudUpload, Flame, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

import { RESOURCE_TYPES, formatDownloads } from './resourceData';

/** Rank discs cycle through the palette so the top five read as a podium. */
const RANK_TONES = [
  'bg-blue-600 text-white',
  'bg-emerald-500 text-white',
  'bg-amber-500 text-white',
  'bg-violet-500 text-white',
  'bg-rose-500 text-white',
];

/**
 * Share call-to-action plus a ranked preview of the most downloaded uploads.
 * Sits as a two-up band under the results from `lg` up, and stacks below it on
 * smaller screens.
 */
export default function ResourceSidebar({ popular = [] }) {
  return (
    <aside className="flex h-fit flex-col gap-4 lg:col-span-2 lg:grid lg:grid-cols-2 xl:col-span-1 xl:sticky xl:top-24 xl:flex xl:flex-col">
      {/* Upload CTA */}
      <div className="rounded-[13px] border border-dashed border-blue-200 bg-blue-50/50 p-4 text-center">
        <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm">
          <CloudUpload className="h-5 w-5" />
        </span>

        <h3 className="mt-2.5 text-[13.5px] font-bold text-slate-900">Share Your Resources</h3>

        <p className="mx-auto mt-1.5 max-w-[210px] text-[12px] leading-relaxed text-slate-500 lg:max-w-[240px]">
          Upload your notes and projects to help thousands of students - and build
          your own study portfolio.
        </p>

        <Link
          to="/auth/signUp"
          className="mt-3.5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-[12.5px] font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md lg:mx-auto lg:max-w-[260px]"
        >
          Upload Resource
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Popular list */}
      <div className="surface-card p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 text-[13.5px] font-bold text-slate-900">
            <Flame className="h-4 w-4 text-orange-500" />
            Popular Resources
          </span>

          <TrendingUp className="h-4 w-4 text-slate-300" />
        </div>

        <ol className="mt-3.5 space-y-2.5">
          {popular.map((resource, index) => {
            const type = RESOURCE_TYPES[resource.type] ?? RESOURCE_TYPES.notes;
            const Icon = type.icon;

            return (
              <li key={resource.id} className="flex items-center gap-2.5">
                {/* Tinted by resource type, matching the card badges. */}
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] border ${type.tile}`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12px] font-semibold text-slate-800">
                    {resource.title}
                  </span>

                  <span className="mt-0.5 flex items-center gap-1.5 text-[10.5px] text-slate-400">
                    <span className={`font-semibold ${type.text}`}>{type.label}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">
                      {formatDownloads(resource.downloads)} downloads
                    </span>
                  </span>
                </span>

                <span
                  className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full text-[10px] font-bold tabular-nums ${
                    RANK_TONES[index % RANK_TONES.length]
                  }`}
                >
                  {index + 1}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </aside>
  );
}
