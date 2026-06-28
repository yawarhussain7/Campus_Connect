// src/components/registry/RegistryHeader.jsx
import React from 'react';
import ModernSelect from '../common/ModernSelect';
import { Search, SlidersHorizontal, LayoutGrid, List } from 'lucide-react';

export default function RegistryHeader({ 
  searchQuery, setSearchQuery, 
  techFilter, setTechFilter,
  deptFilter, setDeptFilter,         // Added
  subjectFilter, setSubjectFilter,
  semesterFilter, setSemesterFilter,
  viewMode, setViewMode,
  departments = [],                 // Added
  subjects = [],
  semesters = []
}) {
  const techStacks = ['React', 'Python', 'Node.js', 'Java', 'OpenCV', 'Firebase'];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
      {/* Search and Dropdown Filter Control Row */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
        
        {/* Keyword Search Input */}
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search code bases, build titles, authors..." 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-700"
          />
        </div>

        {/* Dynamic Department Dropdown */}
        <div>
          <ModernSelect
            label="Department"
            value={deptFilter}
            onChange={setDeptFilter}
            options={[
              { value: '', label: 'All Departments' },
              ...departments.map(dept => ({ value: dept, label: dept }))
            ]}
            placeholder="All Departments"
          />
        </div>

        {/* Dynamic Subject Dropdown */}
        <div>
          <ModernSelect
            label="Subject"
            value={subjectFilter}
            onChange={setSubjectFilter}
            options={[
              { value: '', label: 'All Subjects' },
              ...subjects.map(sub => ({ value: sub, label: sub }))
            ]}
            placeholder="All Subjects"
          />
        </div>

        {/* Dynamic Semester Dropdown & Grid Controls */}
        <div className="flex items-center space-x-2">
          <ModernSelect
            label="Semester"
            value={semesterFilter}
            onChange={setSemesterFilter}
            options={[
              { value: '', label: 'All Semesters' },
              ...semesters.map(sem => ({ value: sem, label: sem }))
            ]}
            placeholder="All Semesters"
          />

          {/* View Mode Grid/List Buttons */}
          <div className="flex items-center space-x-1 border border-slate-200 rounded-xl p-0.5 bg-slate-50/50 shrink-0">
            <button 
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button 
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <List className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Language Stack Filters */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
        <span className="text-[10px] font-mono text-slate-400 uppercase font-bold flex items-center mr-1">
          <SlidersHorizontal className="h-3 w-3 mr-1" /> Core Engine:
        </span>
        <button 
          onClick={() => setTechFilter('')}
          className={`px-2.5 py-0.5 rounded-full border text-[11px] font-medium transition-all ${!techFilter ? 'bg-slate-900 border-slate-900 text-white' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
        >
          All Tech
        </button>
        {techStacks.map((tech) => (
          <button 
            key={tech}
            onClick={() => setTechFilter(tech)}
            className={`px-2.5 py-0.5 rounded-full border text-[11px] font-medium transition-all ${techFilter === tech ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
          >
            {tech}
          </button>
        ))}
      </div>
    </div>
  );
}