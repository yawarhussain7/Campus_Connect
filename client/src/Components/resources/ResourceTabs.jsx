import { ChevronDown, LayoutGrid } from 'lucide-react';

import { RESOURCE_TABS, SORT_OPTIONS } from './resourceData';

/**
 * Tab strip + sort control above the results. Horizontally scrollable on small
 * screens so all six tabs stay reachable without wrapping.
 */
export default function ResourceTabs({ activeTab, onTabChange, counts, sort, onSortChange }) {
  return (
    <div className="mb-3 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
      <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 sm:pb-0">
        {RESOURCE_TABS.map((tab) => {
          const isActive = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              aria-pressed={isActive}
              className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-[12px] font-semibold transition ${
                isActive
                  ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900'
              }`}
            >
              {tab.label}

              <span
                className={`tabular-nums text-[10.5px] ${
                  isActive ? 'text-blue-100' : 'text-slate-400'
                }`}
              >
                {counts[tab.id] || 0}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <LayoutGrid className="hidden h-3.5 w-3.5 text-slate-400 sm:block" />

        <label htmlFor="resource-sort" className="sr-only">
          Sort resources
        </label>

        <div className="relative">
          <select
            id="resource-sort"
            value={sort}
            onChange={(event) => onSortChange(event.target.value)}
            className="appearance-none rounded-[10px] border border-slate-200 bg-white py-1.5 pl-3 pr-8 text-[12px] font-semibold text-slate-700 outline-none transition hover:border-slate-300 focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>

          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        </div>
      </div>
    </div>
  );
}
