// src/components/MatrixFilters.jsx
import React from 'react';
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
          <label className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            Department
          </label>
          <select 
            value={filterDept} 
            onChange={(e) => setFilterDept(e.target.value)} 
            className="w-full bg-slate-50 border border-slate-200/80 text-xs rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 font-medium transition-all"
          >
            <option value="">All Departments</option>
            {departments.map((d, i) => <option key={i} value={d}>{d}</option>)}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
            Instructor
          </label>
          <select 
            value={filterTeacher} 
            onChange={(e) => setFilterTeacher(e.target.value)} 
            className="w-full bg-slate-50 border border-slate-200/80 text-xs rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 font-medium transition-all"
          >
            <option value="">All Teachers</option>
            {teachers.map((t, i) => <option key={i} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
            Section
          </label>
          <select 
            value={filterSection} 
            onChange={(e) => setFilterSection(e.target.value)} 
            className="w-full bg-slate-50 border border-slate-200/80 text-xs rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 font-medium transition-all"
          >
            <option value="">All Sections</option>
            {sections.map((s, i) => <option key={i} value={s}>Section {s}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}