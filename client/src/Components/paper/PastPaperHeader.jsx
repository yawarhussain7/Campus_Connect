import React from 'react';
import {
  BookOpen,
  Building2,
  Calendar,
  CalendarDays,
  FileText,
  Search,
  X,
} from 'lucide-react';

import ModernSelect from '../common/ModernSelect.jsx';

// Plain strings use `labelOf` for their label; ready-made `{ value, label }`
// options are passed through untouched.
const withAllOption = (items, allLabel, labelOf) => [
  { value: '', label: allLabel },
  ...items.map((item) =>
    item && typeof item === 'object'
      ? item
      : { value: item, label: labelOf ? labelOf(item) : item }
  ),
];

/**
 * Filter bar for the past-paper table: one search field followed by the five
 * dropdowns, all on a single row when there is room.
 */
export default function PastPaperHeader({
  searchQuery,
  setSearchQuery,
  departmentFilter,
  setDepartmentFilter,
  courseFilter,
  setCourseFilter,
  semesterFilter,
  setSemesterFilter,
  yearFilter,
  setYearFilter,
  examTypeFilter,
  setExamTypeFilter,
  departments = [],
  courses = [],
  semesters = [],
  years = [],
  examTypes = [],
  examLabelOf,
  onClearAll,
}) {
  const hasActiveFilters = Boolean(
    searchQuery ||
      departmentFilter ||
      courseFilter ||
      semesterFilter ||
      yearFilter ||
      examTypeFilter
  );

  return (
    <section className="surface-card p-3">
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by course code, course name or topic..."
            aria-label="Search papers"
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
          stacked
          icon={Building2}
          label="Department"
          className="w-full sm:w-[172px]"
          value={departmentFilter}
          onChange={setDepartmentFilter}
          options={withAllOption(departments, 'All departments')}
          placeholder="All departments"
        />

        <ModernSelect
          stacked
          icon={BookOpen}
          label="Course"
          className="w-full sm:w-[172px]"
          value={courseFilter}
          onChange={setCourseFilter}
          options={withAllOption(courses, 'All courses')}
          placeholder="All courses"
        />

        <ModernSelect
          stacked
          icon={CalendarDays}
          label="Semester"
          className="w-full sm:w-[164px]"
          value={semesterFilter}
          onChange={setSemesterFilter}
          options={withAllOption(semesters, 'All semesters')}
          placeholder="All semesters"
        />

        <ModernSelect
          stacked
          icon={Calendar}
          label="Year"
          className="w-full sm:w-[132px]"
          value={yearFilter}
          onChange={setYearFilter}
          options={withAllOption(years, 'All years')}
          placeholder="All years"
        />

        <ModernSelect
          stacked
          icon={FileText}
          label="Exam type"
          className="w-full sm:w-[150px]"
          value={examTypeFilter}
          onChange={setExamTypeFilter}
          options={withAllOption(examTypes, 'All types', examLabelOf)}
          placeholder="All types"
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
