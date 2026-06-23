// src/components/pastpapers/PastPaperHeader.jsx
import React from 'react';
import { Search, SlidersHorizontal, Filter } from 'lucide-react';

export default function PastPaperHeader({
  searchQuery, setSearchQuery,
  teacherFilter, setTeacherFilter,
  subjectFilter, setSubjectFilter,
  semesterFilter, setSemesterFilter,
  examTypeFilter, setExamTypeFilter,
  teachers = [],
  subjects = [],
  semesters = []
}) {
  const examTypes = ['Midterm', 'Final Exam', 'Quiz Rack', 'Sessional'];

  return (
    <div className="bg-white border border-indigo-100/80 rounded-2xl p-4 shadow-sm space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
        
        {/* Keyword Lookup */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search papers, years..." 
            className="w-full bg-slate-50 border border-slate-200/80 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all text-slate-700 placeholder:text-slate-400"
          />
        </div>

        {/* Instructor Filter */}
        <div className="space-y-1">
          <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider px-1">Instructor</span>
          <select
            value={teacherFilter}
            onChange={(e) => setTeacherFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200/80 text-xs rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 font-medium transition-all"
          >
            <option value="">All Instructors</option>
            {teachers.map((t, i) => <option key={i} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Course Filter */}
        <div className="space-y-1">
          <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider px-1">Subject</span>
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200/80 text-xs rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 font-medium transition-all"
          >
            <option value="">All Subjects</option>
            {subjects.map((s, i) => <option key={i} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Semester Step Filter */}
        <div className="space-y-1">
          <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider px-1">Semester</span>
          <select
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200/80 text-xs rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 font-medium transition-all"
          >
            <option value="">All Semesters</option>
            {semesters.map((sem, i) => <option key={i} value={sem}>{sem}</option>)}
          </select>
        </div>
      </div>

      {/* Quick Filter Badges */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
        <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 uppercase mr-1">
          <Filter className="h-3 w-3" /> Exam Type:
        </span>
        <button 
          onClick={() => setExamTypeFilter('')}
          className={`px-3 py-1 rounded-full border text-[11px] font-semibold transition-all duration-200 ${
            !examTypeFilter 
              ? 'bg-slate-900 border-slate-900 text-white shadow-sm' 
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
          }`}
        >
          All
        </button>
        {examTypes.map((type) => (
          <button 
            key={type}
            onClick={() => setExamTypeFilter(type)}
            className={`px-3 py-1 rounded-full border text-[11px] font-semibold transition-all duration-200 ${
              examTypeFilter === type 
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' 
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
}