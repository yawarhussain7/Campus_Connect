// src/components/pastpapers/PastPaperHeader.jsx
import React from 'react';
import ModernSelect from '../common/ModernSelect';
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
          <ModernSelect
            label="Instructor"
            value={teacherFilter}
            onChange={setTeacherFilter}
            options={[
              { value: '', label: 'All Instructors' },
              ...teachers.map(t => ({ value: t, label: t }))
            ]}
            placeholder="All Instructors"
          />
        </div>

        {/* Course Filter */}
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

        {/* Semester Step Filter */}
        <div className="space-y-1">
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