// src/pages/Assignments.jsx
import React, { useState } from 'react';
import Sidebar from '../../Components/common/Sidebar'; 
import Header from '../../Components/common/Header';   
import AssignmentFileCard from '../../components/assignments/AssignmentFileCard';
import { Plus, Search, BookOpen } from 'lucide-react';

const INITIAL_SHAREDBOX = [
  {
    id: 1,
    title: 'Database Systems Midterm Solved Assignment',
    description: 'Contains complete relational schema drawings and full normalization tables matching question 3 perfectly.',
    subject: 'Database Systems',
    teacher: 'Sarah Jenkins',
    semester: 'Semester 3',
    department: 'Computer Science',
    uploadedDate: '2026-06-20',
    fileSize: '2.4 MB',
    rating: 4.8
  },
  {
    id: 2,
    title: 'CNN Image Classifier Project Code & Report',
    description: 'Python notebook source code with full markdown explanations. Verified and accepted by the TA.',
    subject: 'Machine Learning',
    teacher: 'Aris Thorne',
    semester: 'Semester 5',
    department: 'Computer Science',
    uploadedDate: '2026-06-18',
    fileSize: '4.1 MB',
    rating: 4.9
  }
];

export default function Assignments() {
  const [sharedFiles, setSharedFiles] = useState(INITIAL_SHAREDBOX);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newTeacher, setNewTeacher] = useState('');
  const [newSemester, setNewSemester] = useState('Semester 1');
  const [newDept, setNewDept] = useState('Computer Science');

  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');
  const [teacherFilter, setTeacherFilter] = useState('');

  const departmentsList = [...new Set(sharedFiles.map(f => f.department))].sort();
  const subjectsList = [...new Set(sharedFiles.map(f => f.subject))].sort();
  const semestersList = [...new Set(sharedFiles.map(f => f.semester))].sort();
  const teachersList = [...new Set(sharedFiles.map(f => f.teacher))].sort();

  const filteredFiles = sharedFiles.filter(file => {
    const matchesSearch = 
      file.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      file.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.department.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesDept = !deptFilter || file.department === deptFilter;
    const matchesSubject = !subjectFilter || file.subject === subjectFilter;
    const matchesSemester = !semesterFilter || file.semester === semesterFilter;
    const matchesTeacher = !teacherFilter || file.teacher === teacherFilter;

    return matchesSearch && matchesDept && matchesSubject && matchesSemester && matchesTeacher;
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!newTitle || !newDesc || !newSubject || !newTeacher) {
      alert('Please fill out all identification flags.');
      return;
    }

    const newSharedFile = {
      id: Date.now(),
      title: newTitle,
      description: newDesc,
      subject: newSubject,
      teacher: newTeacher,
      semester: newSemester,
      department: newDept,
      uploadedDate: new Date().toISOString().split('T')[0],
      fileSize: '1.5 MB',
      rating: 5.0
    };

    setSharedFiles(prev => [newSharedFile, ...prev]);
    setNewTitle('');
    setNewDesc('');
    setNewSubject('');
    setNewTeacher('');
    setIsUploadOpen(false);
  };

  const handleDownload = (file) => {
    alert(`Downloading archive package: ${file.title}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex font-sans antialiased">
      <Sidebar />

      <div className="flex-1 xl:pl-64 flex flex-col min-w-0">
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <div className="flex-1 p-6 max-w-[1600px] w-full mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-sm">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Assignment Sharing Exchange</h1>
                <p className="text-xs text-slate-500 mt-0.5">Crowd-sourced repository to download and swap completed course work.</p>
              </div>
            </div>
            
            <button
              onClick={() => setIsUploadOpen(!isUploadOpen)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs px-4 py-2.5 rounded-xl font-bold flex items-center gap-1.5 shrink-0 transition-all duration-200 shadow-md shadow-indigo-200 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Upload Assignment</span>
            </button>
          </div>

          {/* Upload Form */}
          {isUploadOpen && (
            <form onSubmit={handleFormSubmit} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 animate-fadeIn">
              <div className="md:col-span-3">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Assignment Title</label>
                <input type="text" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g., Solved Lab Exercise 5: Advanced Indexing Structures" 
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 placeholder:text-slate-400" />
              </div>
              <div className="md:col-span-3">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Description</label>
                <textarea required value={newDesc} onChange={(e) => setNewDesc(e.target.value)} 
                  placeholder="Provide specific hints or warnings (e.g., Code runs fully; contains specific diagrams for Variant B queries)." 
                  rows="2" 
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 placeholder:text-slate-400 resize-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Subject</label>
                <input type="text" required value={newSubject} onChange={(e) => setNewSubject(e.target.value)} placeholder="e.g., Operating Systems" 
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 placeholder:text-slate-400" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Instructor</label>
                <input type="text" required value={newTeacher} onChange={(e) => setNewTeacher(e.target.value)} placeholder="e.g., Dr. Faisal" 
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 placeholder:text-slate-400" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Department</label>
                <select value={newDept} onChange={(e) => setNewDept(e.target.value)} 
                  className="w-full bg-slate-50 border border-slate-200/80 text-xs rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 font-medium">
                  <option value="Computer Science">Computer Science</option>
                  <option value="Electrical Eng.">Electrical Eng.</option>
                  <option value="Management Sciences">Management Sciences</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Semester</label>
                <select value={newSemester} onChange={(e) => setNewSemester(e.target.value)} 
                  className="w-full bg-slate-50 border border-slate-200/80 text-xs rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 font-medium">
                  <option value="Semester 1">Semester 1</option>
                  <option value="Semester 2">Semester 2</option>
                  <option value="Semester 3">Semester 3</option>
                  <option value="Semester 4">Semester 4</option>
                  <option value="Semester 5">Semester 5</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">File</label>
                <input type="file" required 
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[11px] file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer" />
              </div>
              <div className="md:col-span-3 flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button type="button" onClick={() => setIsUploadOpen(false)} 
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200">Cancel</button>
                <button type="submit" 
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-200 transition-all duration-200">Publish</button>
              </div>
            </form>
          )}

          {/* Filters */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by keyword, descriptions, tags, files, or departments..." 
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all text-slate-700 placeholder:text-slate-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} 
                className="bg-slate-50 border border-slate-200/80 text-xs rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 font-medium transition-all">
                <option value="">All Departments</option>
                {departmentsList.map((d, i) => <option key={i} value={d}>{d}</option>)}
              </select>
              <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} 
                className="bg-slate-50 border border-slate-200/80 text-xs rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 font-medium transition-all">
                <option value="">All Subjects</option>
                {subjectsList.map((s, i) => <option key={i} value={s}>{s}</option>)}
              </select>
              <select value={semesterFilter} onChange={(e) => setSemesterFilter(e.target.value)} 
                className="bg-slate-50 border border-slate-200/80 text-xs rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 font-medium transition-all">
                <option value="">All Semesters</option>
                {semestersList.map((sem, i) => <option key={i} value={sem}>{sem}</option>)}
              </select>
              <select value={teacherFilter} onChange={(e) => setTeacherFilter(e.target.value)} 
                className="bg-slate-50 border border-slate-200/80 text-xs rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 font-medium transition-all">
                <option value="">All Instructors</option>
                {teachersList.map((t, i) => <option key={i} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Cards */}
          {filteredFiles.length === 0 ? (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-16 text-center shadow-sm">
              <BookOpen className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-400 font-medium">No files match your search.</p>
              <p className="text-xs text-slate-300 mt-1">Try adjusting filters or search terms.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFiles.map((file) => (
                <AssignmentFileCard 
                  key={file.id} 
                  file={file} 
                  onDownload={handleDownload} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}