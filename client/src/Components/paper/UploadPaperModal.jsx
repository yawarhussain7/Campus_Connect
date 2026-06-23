// src/components/pastpapers/UploadPaperModal.jsx
import React, { useState } from 'react';
import { X, FileText, Upload } from 'lucide-react';

export default function UploadPaperModal({ isOpen, onClose, onUploadSubmit }) {
  const [subject, setSubject] = useState('');
  const [teacher, setTeacher] = useState('');
  const [semester, setSemester] = useState('Semester 1');
  const [year, setYear] = useState('2026');
  const [examType, setExamType] = useState('Midterm');
  const [hasSolution, setHasSolution] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject || !teacher) {
      alert('Please fill out all required fields.');
      return;
    }

    onUploadSubmit({
      id: Date.now(),
      subject,
      teacher,
      semester,
      year,
      examType,
      hasSolution
    });

    setSubject('');
    setTeacher('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-scaleIn">
        
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <div className="p-1.5 bg-indigo-50 rounded-lg border border-indigo-100">
              <FileText className="h-4 w-4 text-indigo-600" />
            </div>
            <span>Upload Past Paper</span>
          </h2>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Subject Title *</label>
            <input 
              type="text" required value={subject} onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Database Systems"
              className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Course Instructor *</label>
            <input 
              type="text" required value={teacher} onChange={(e) => setTeacher(e.target.value)}
              placeholder="e.g., Dr. Thorne"
              className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 placeholder:text-slate-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Semester</label>
              <select 
                value={semester} onChange={(e) => setSemester(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/80 text-xs rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 font-medium transition-all"
              >
                {[...Array(8)].map((_, i) => (
                  <option key={i} value={`Semester ${i + 1}`}>Semester {i + 1}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Exam Type</label>
              <select 
                value={examType} onChange={(e) => setExamType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/80 text-xs rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 font-medium transition-all"
              >
                <option value="Midterm">Midterm</option>
                <option value="Final Exam">Final Exam</option>
                <option value="Quiz Rack">Quiz Rack</option>
                <option value="Sessional">Sessional</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 items-center pt-1">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Academic Year</label>
              <input 
                type="number" min="2015" max="2027" value={year} onChange={(e) => setYear(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 transition-all"
              />
            </div>
            <div className="flex items-center gap-3 mt-5 pl-1">
              <div className="relative">
                <input 
                  type="checkbox" id="solToggle" checked={hasSolution} onChange={(e) => setHasSolution(e.target.checked)}
                  className="sr-only peer"
                />
                <label htmlFor="solToggle" className="w-9 h-5 bg-slate-200 rounded-full cursor-pointer peer-checked:bg-indigo-600 transition-colors duration-200 flex items-center px-0.5 after:content-[''] after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow-sm after:transition-transform after:duration-200 peer-checked:after:translate-x-4" />
              </div>
              <label htmlFor="solToggle" className="text-xs font-semibold text-slate-600 cursor-pointer select-none">Includes Solutions</label>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button" onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-200 transition-all duration-200"
            >
              Index Paper
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}