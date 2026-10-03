import { BookOpen, Building2, GraduationCap, Search, UserRound, X } from 'lucide-react';

import ModernSelect from '../common/ModernSelect.jsx';

const withAllOption = (items, allLabel, labelOf) => [
  { value: '', label: allLabel },
  ...items.map((item) => ({
    value: String(item),
    label: labelOf ? labelOf(item) : String(item),
  })),
];

/**
 * Filter bar for the review table: the search field followed by the course,
 * campus, teacher and student dropdowns, wrapping when the viewport cannot hold
 * them all on one row.
 */
export default function TeacherFilterHeader({
  searchQuery,
  setSearchQuery,
  courseFilter,
  setCourseFilter,
  campusFilter,
  setCampusFilter,
  teacherFilter,
  setTeacherFilter,
  studentFilter,
  setStudentFilter,
  courses = [],
  campuses = [],
  teachers = [],
  students = [],
  onClearAll,
}) {
  const hasActiveFilters = Boolean(
    searchQuery || courseFilter || campusFilter || teacherFilter || studentFilter
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
            placeholder="Search by course, teacher, student or feedback..."
            aria-label="Search reviews"
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
          icon={BookOpen}
          label="Course"
          className="w-full sm:w-[176px]"
          value={courseFilter}
          onChange={setCourseFilter}
          options={withAllOption(courses, 'All courses')}
          placeholder="All courses"
        />

        {/* The campus list is the one the teacher directory is built from. */}
        <ModernSelect
          stacked
          icon={Building2}
          label="Campus"
          className="w-full sm:w-[168px]"
          value={campusFilter}
          onChange={setCampusFilter}
          options={withAllOption(campuses, 'All campuses')}
          placeholder="All campuses"
        />

        {/* Searchable: the teacher list is the whole faculty directory. */}
        <ModernSelect
          stacked
          searchable
          icon={UserRound}
          label="Teacher"
          className="w-full sm:w-[176px]"
          value={teacherFilter}
          onChange={setTeacherFilter}
          options={withAllOption(teachers, 'All teachers')}
          placeholder="All teachers"
        />

        <ModernSelect
          stacked
          icon={GraduationCap}
          label="Student"
          className="w-full sm:w-[176px]"
          value={studentFilter}
          onChange={setStudentFilter}
          options={withAllOption(students, 'All students')}
          placeholder="All students"
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
