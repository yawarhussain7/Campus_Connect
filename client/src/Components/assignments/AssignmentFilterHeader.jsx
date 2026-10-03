import { BookOpen, CalendarDays, Filter, Search, X } from 'lucide-react';

import ModernSelect from '../common/ModernSelect.jsx';
import { ASSIGNMENT_STATUSES, dueMonthLabel } from '../../utils/assignment.js';

// Plain strings use `labelOf` for their label; ready-made `{ value, label }`
// options (the course filter) are passed through untouched.
const withAllOption = (items, allLabel, labelOf) => [
  { value: '', label: allLabel },
  ...items.map((item) =>
    item && typeof item === 'object'
      ? item
      : { value: item, label: labelOf ? labelOf(item) : item }
  ),
];

/**
 * Filter bar for the assignment table: one search field followed by the course,
 * due-date and status dropdowns, all on a single row when there is room.
 */
export default function AssignmentFilterHeader({
  searchQuery,
  setSearchQuery,
  courseFilter,
  setCourseFilter,
  dueMonthFilter,
  setDueMonthFilter,
  statusFilter,
  setStatusFilter,
  courses = [],
  dueMonths = [],
  onClearAll,
}) {
  const hasActiveFilters = Boolean(
    searchQuery || courseFilter || dueMonthFilter || statusFilter
  );

  return (
    <section className="surface-card p-3">
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative min-w-[240px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search assignments by title, course, or subject..."
            aria-label="Search assignments"
            className="h-11 w-full rounded-[10px] border border-slate-200 bg-slate-50/80 pl-9 pr-9 text-[12.5px] text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/15"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <ModernSelect
          hideLabel
          icon={BookOpen}
          label="Course"
          className="w-full sm:w-[200px]"
          value={courseFilter}
          onChange={setCourseFilter}
          options={withAllOption(courses, 'All Courses')}
          placeholder="All Courses"
        />

        <ModernSelect
          hideLabel
          icon={CalendarDays}
          label="Due date"
          className="w-full sm:w-[210px]"
          value={dueMonthFilter}
          onChange={setDueMonthFilter}
          options={withAllOption(dueMonths, 'All Due Dates', dueMonthLabel)}
          placeholder="All Due Dates"
        />

        <ModernSelect
          hideLabel
          icon={Filter}
          label="Status"
          className="w-full sm:w-[190px]"
          value={statusFilter}
          onChange={setStatusFilter}
          options={withAllOption(ASSIGNMENT_STATUSES, 'All Status')}
          placeholder="All Status"
        />
      </div>

      {hasActiveFilters && (
        <div className="mt-2.5 flex justify-end border-t border-slate-100 pt-2.5">
          <button
            type="button"
            onClick={onClearAll}
            className="inline-flex items-center gap-1 text-[11.5px] font-medium text-slate-500 transition hover:text-slate-900"
          >
            <X className="h-3.5 w-3.5" />
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}
