// src/components/teachers/TeacherFilterHeader.jsx
import React from 'react';
import ModernSelect from '../common/ModernSelect';
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
          <ModernSelect
            label="Department"
            value={deptFilter}
            onChange={setDeptFilter}
            options={[
              { value: '', label: 'All Departments' },
              ...departments.map(d => ({ value: d, label: d }))
            ]}
            placeholder="All Departments"
          />
        </div>

        {/* Subject Filter */}
        <div className="space-y-1">
          <ModernSelect
            label="Subject"
            value={subjectFilter}
            onChange={setSubjectFilter}
            options={[
              { value: '', label: 'All Subjects' },
              ...subjects.map(s => ({ value: s, label: s }))
            ]}
            placeholder="All Subjects"
          />
        </div>
      </div>
    </div>
  );
}