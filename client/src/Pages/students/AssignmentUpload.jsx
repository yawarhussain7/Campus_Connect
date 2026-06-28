import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../Components/common/Sidebar';
import Header from '../../Components/common/Header';
import ModernSelect from '../../Components/common/ModernSelect';
import { ArrowLeft, Upload, BookOpen } from 'lucide-react';
import { Uploadassignment,ShowAllassignment } from '../../api/assignment';
import { ClipLoader } from 'react-spinners';

export default function AssignmentUpload() {
  const navigate = useNavigate();

  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newTeacher, setNewTeacher] = useState('');
  const [newSemester, setNewSemester] = useState('Semester 1');
  const [newDept, setNewDept] = useState('Computer Science');
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!newTitle || !newDesc || !newSubject || !newTeacher) {
      alert('Please fill out all required fields.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', newTitle);
      formData.append('description', newDesc);
      formData.append('subject', newSubject);
      formData.append('instructor', newTeacher);
      formData.append('semester', newSemester);
      formData.append('department', newDept);
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      await Uploadassignment(formData);
      alert('Assignment uploaded successfully!');
      navigate('/student/assignments');
    } catch (error) {
      alert(error.message || 'Failed to upload assignment. Please try again.');
    } finally {
      setLoading(false);
    }
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
                <h1 className="text-xl font-bold text-slate-900">Upload Assignment</h1>
                <p className="text-xs text-slate-500 mt-0.5">Share your completed coursework with the community.</p>
              </div>
            </div>

            <button
              onClick={() => navigate('/student/assignments')}
              className="bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-600 text-xs px-4 py-2.5 rounded-xl font-bold flex items-center gap-1.5 shrink-0 transition-all duration-200 active:scale-95"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Assignments</span>
            </button>
          </div>

          {/* Upload Form */}
          <form onSubmit={handleFormSubmit} className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-5 max-w-3xl">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Assignment Title</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g., Solved Lab Exercise 5: Advanced Indexing Structures"
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Description</label>
              <textarea
                required
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Provide specific hints or warnings (e.g., Code runs fully; contains specific diagrams for Variant B queries)."
                rows="3"
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 placeholder:text-slate-400 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Subject</label>
                <input
                  type="text"
                  required
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="e.g., Operating Systems"
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Instructor</label>
                <input
                  type="text"
                  required
                  value={newTeacher}
                  onChange={(e) => setNewTeacher(e.target.value)}
                  placeholder="e.g., Dr. Faisal"
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 placeholder:text-slate-400"
                />
              </div>
              <div>
                <ModernSelect
                  label="Department"
                  value={newDept}
                  onChange={setNewDept}
                  options={[
                    { value: 'Computer Science', label: 'Computer Science' },
                    { value: 'Electrical Eng.', label: 'Electrical Eng.' },
                    { value: 'Management Sciences', label: 'Management Sciences' }
                  ]}
                  placeholder="Select department"
                />
              </div>
              <div>
                <ModernSelect
                  label="Semester"
                  value={newSemester}
                  onChange={setNewSemester}
                  options={[
                    { value: 'Semester 1', label: 'Semester 1' },
                    { value: 'Semester 2', label: 'Semester 2' },
                    { value: 'Semester 3', label: 'Semester 3' },
                    { value: 'Semester 4', label: 'Semester 4' },
                    { value: 'Semester 5', label: 'Semester 5' },
                    { value: 'Semester 6', label: 'Semester 6' },
                    { value: 'Semester 7', label: 'Semester 7' },
                    { value: 'Semester 8', label: 'Semester 8' }
                  ]}
                  placeholder="Select semester"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">File</label>
              <input
                type="file"
                required
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[11px] file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => navigate('/student/assignments')}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-200 transition-all duration-200 flex items-center gap-1.5"
              >
                <Upload className="h-3.5 w-3.5" />
                Publish Assignment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}