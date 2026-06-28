// src/components/MatrixFilters.jsx
import React from 'react';
import ModernSelect from '../common/ModernSelect';
import { Filter, X } from 'lucide-react';

export default function MatrixFilters({ 
  departments, teachers, sections,
  filterDept, setFilterDept,
  filterTeacher, setFilterTeacher,
  filterSection, setFilterSection 
}) {
  const hasActiveFilters = filterDept || filterTeacher || filterSection;

  const clearFilters = () => {
    setFilterDept('');
    setFilterTeacher('');
    setFilterSection('');
  };

  return (
    <div className="bg-white border border-indigo-100/80 rounded-2xl p-5 shadow-sm animate-fadeIn space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-50 rounded-lg border border-indigo-100">
            <Filter className="h-4 w-4 text-indigo-600" />
          </div>
          <span className="text-sm font-semibold text-slate-800">Advanced Filters</span>
          {hasActiveFilters && (
            <span className="text-[10px] font-semibold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
              Active
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <button 
            onClick={clearFilters}
            className="flex items-center gap-1 text-[11px] font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition-all"
          >
            <X className="h-3 w-3" />
            Clear
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <ModernSelect
            label="Department"
            value={filterDept}
            onChange={setFilterDept}
            options={[
              { value: '', label: 'All Departments' },
              ...departments.map(d => ({ value: d, label: d }))
            ]}
            placeholder="All Departments"
          />
        </div>

        <div className="space-y-1.5">
          <ModernSelect
            label="Instructor"
            value={filterTeacher}
            onChange={setFilterTeacher}
            options={[
              { value: '', label: 'All Teachers' },
              ...teachers.map(t => ({ value: t, label: t }))
            ]}
            placeholder="All Teachers"
          />
        </div>

        <div className="space-y-1.5">
          <ModernSelect
            label="Section"
            value={filterSection}
            onChange={setFilterSection}
            options={[
              { value: '', label: 'All Sections' },
              ...sections.map(s => ({ value: s, label: `Section ${s}` }))
            ]}
            placeholder="All Sections"
          />
        </div>
      </div>
    </div>
  );
}