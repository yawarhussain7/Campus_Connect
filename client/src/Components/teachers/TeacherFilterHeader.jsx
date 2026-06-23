// src/components/teachers/TeacherFilterHeader.jsx
import React from 'react';
import { Search, GraduationCap, Filter } from 'lucide-react';

export default function TeacherFilterHeader({
  searchQuery, setSearchQuery,
  deptFilter, setDeptFilter,
  subjectFilter, setSubjectFilter,
  departments = [],
  subjects = []
}) {
  return (
    <div className="bg-white border border-indigo-100/80 rounded-2xl p-4 shadow-sm space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
        
        {/* Name Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search teacher names..." 
            className="w-full bg-slate-50 border border-slate-200/80 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all text-slate-700 placeholder:text-slate-400"
          />
        </div>

        {/* Department Filter */}
        <div className="space-y-1">
          <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider px-1">Department</span>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200/80 text-xs rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 font-medium cursor-pointer transition-all"
          >
            <option value="">All Departments</option>
            {departments.map((d, i) => <option key={i} value={d}>{d}</option>)}
          </select>
        </div>

        {/* Subject Filter */}
        <div className="space-y-1">
          <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider px-1">Subject</span>
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200/80 text-xs rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 font-medium cursor-pointer transition-all"
          >
            <option value="">All Subjects</option>
            {subjects.map((s, i) => <option key={i} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}