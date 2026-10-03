import { Check, ChevronDown, SlidersHorizontal } from 'lucide-react';

import { RESOURCE_TYPES } from './resourceData';

/** Shared look for both dropdowns so they stay in step. */
const SELECT_CLASS =
  'w-full appearance-none rounded-[10px] border border-slate-200 bg-white py-2 pl-3 pr-8 text-[12.5px] font-medium text-slate-700 outline-none transition hover:border-slate-300 focus:border-blue-300 focus:ring-4 focus:ring-blue-100';

const LABEL_CLASS = 'text-[11px] font-semibold uppercase tracking-wide text-slate-400';

/**
 * Left rail of the library: multi-select resource types, plus semester and
 * subject dropdowns. Purely controlled - the page owns the filter state.
 */
export default function ResourceFilters({
  typeCounts,
  selectedTypes,
  onToggleType,
  semester,
  onSemesterChange,
  subject,
  onSubjectChange,
  semesters,
  subjects,
  onReset,
}) {
  const hasFilters = selectedTypes.length > 0 || Boolean(semester) || Boolean(subject);

  return (
    <aside className="surface-card h-fit p-4 lg:sticky lg:top-24">
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-[13px] font-bold text-slate-900">
          <SlidersHorizontal className="h-4 w-4 text-blue-600" />
          Filters
        </span>

        {hasFilters && (
          <button
            type="button"
            onClick={onReset}
            className="text-[11.5px] font-semibold text-blue-600 transition hover:text-blue-700"
          >
            Clear
          </button>
        )}
      </div>

      {/* Resource type */}
      <div className="mt-4 border-t border-slate-100 pt-4">
        <p className={LABEL_CLASS}>Resource Type</p>

        <div className="mt-2 space-y-0.5">
          {Object.entries(RESOURCE_TYPES).map(([id, type]) => {
            const checked = selectedTypes.includes(id);

            return (
              <button
                key={id}
                type="button"
                onClick={() => onToggleType(id)}
                aria-pressed={checked}
                className={`flex w-full items-center gap-2 rounded-[9px] px-2 py-1.5 text-left text-[12.5px] font-medium transition ${
                  checked
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border transition ${
                    checked
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {checked && <Check className="h-2.5 w-2.5" strokeWidth={3.5} />}
                </span>

                <span className="flex-1 truncate">{type.label}</span>

                <span className="shrink-0 text-[10.5px] tabular-nums text-slate-400">
                  {typeCounts[id] || 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Semester */}
      <div className="mt-4 border-t border-slate-100 pt-4">
        <label htmlFor="filter-semester" className={LABEL_CLASS}>
          Semester
        </label>

        <div className="relative mt-2">
          <select
            id="filter-semester"
            value={semester}
            onChange={(event) => onSemesterChange(event.target.value)}
            className={SELECT_CLASS}
          >
            <option value="">All semesters</option>

            {semesters.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      {/* Subject */}
      <div className="mt-4 border-t border-slate-100 pt-4">
        <label htmlFor="filter-subject" className={LABEL_CLASS}>
          Subject
        </label>

        <div className="relative mt-2">
          <select
            id="filter-subject"
            value={subject}
            onChange={(event) => onSubjectChange(event.target.value)}
            className={SELECT_CLASS}
          >
            <option value="">All subjects</option>

            {subjects.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        </div>
      </div>
    </aside>
  );
}
