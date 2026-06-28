import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../Components/common/Sidebar'
import Header from '../../Components/common/Header.jsx'
import ModernSelect from '../../Components/common/ModernSelect';
import { ArrowLeft, Upload, FileText } from 'lucide-react';
import { toast } from "react-toastify";
import {PaperUpload} from '../../api/paper.js'

export default function PastPaperUpload() {
  const navigate = useNavigate();

  const [subject, setSubject] = useState('');
  const [instructor, setInstructor] = useState('');
  const [semester, setSemester] = useState('Semester 1');
  const [year, setYear] = useState('2026');
  const [exam, setExam] = useState('Mid');
  const [hasSolution, setHasSolution] = useState(false);
  const [batch, setBatch] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subject || !instructor || !batch || !file) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('subject', subject);
      formData.append('instructor', instructor);
      formData.append('semester', semester);
      formData.append('year', parseInt(year));
      formData.append('exam', exam);
      formData.append('hasSolution', hasSolution);
      formData.append('batch', batch);
      formData.append('department', department);
      formData.append('file', file);

      const upload = await PaperUpload(formData)
      toast.success("Paper uploaded successfully")
      navigate('/student/past-papers');
    } catch (error) {
      console.error('Upload error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      const errorMessage = error?.message || error?.data?.message || 'Failed to upload past paper. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex font-sans antialiased">
      <Sidebar />

      <div className="flex-1 xl:pl-64 flex flex-col min-w-0">
        <Header />

        <div className="flex-1 p-6 max-w-[1600px] w-full mx-auto space-y-6">

          {/* Header */}
          <div className="flex justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-sm">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Upload Past Paper</h1>
                <p className="text-xs text-slate-500 mt-0.5">Share past examination papers with the community.</p>
              </div>
            </div>

            <button
              onClick={() => navigate('/student/past-papers')}
              className="bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-600 text-xs px-4 py-2.5 rounded-xl font-bold flex items-center gap-1.5 shrink-0 transition-all duration-200 active:scale-95"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Past Papers</span>
            </button>
          </div>

          {/* Upload Form */}
          <form onSubmit={handleSubmit} className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-5 max-w-3xl">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Subject *</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Machine Learning"
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Instructor *</label>
              <input
                type="text"
                required
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
                placeholder="e.g., Dr. Smith"
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 placeholder:text-slate-400"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <ModernSelect
                  label="Semester"
                  value={semester}
                  onChange={setSemester}
                  options={[...Array(8)].map((_, i) => ({
                    value: `Semester ${i + 1}`,
                    label: `Semester ${i + 1}`
                  }))}
                  placeholder="Select semester"
                />
              </div>

              <div>
                <ModernSelect
                  label="Year"
                  value={year}
                  onChange={setYear}
                  options={[2026, 2025, 2024, 2023, 2022].map(y => ({
                    value: y,
                    label: y.toString()
                  }))}
                  placeholder="Select year"
                />
              </div>

              <div>
                <ModernSelect
                  label="Exam Type"
                  value={exam}
                  onChange={setExam}
                  options={[
                    { value: 'Mid', label: 'Mid' },
                    { value: 'Final', label: 'Final' }
                  ]}
                  placeholder="Select exam type"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Batch *</label>
                <input
                  type="text"
                  required
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  placeholder="e.g., SP23"
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 placeholder:text-slate-400"
                />
              </div>

              <div>
                <ModernSelect
                  label="Department"
                  value={department}
                  onChange={setDepartment}
                  options={[
                    { value: 'Computer Science', label: 'Computer Science' },
                    { value: 'Electrical Eng.', label: 'Electrical Eng.' },
                    { value: 'Management Sciences', label: 'Management Sciences' },
                    { value: 'Mechanical Eng.', label: 'Mechanical Eng.' },
                    { value: 'Business School', label: 'Business School' }
                  ]}
                  placeholder="Select department"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">PDF File *</label>
              <input
                type="file"
                accept="application/pdf"
                required
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[11px] file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
              />
              {file && (
                <p className="text-xs text-slate-500 mt-1.5">
                  Selected: {file.name}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="hasSolution"
                checked={hasSolution}
                onChange={(e) => setHasSolution(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="hasSolution" className="text-xs text-slate-600 cursor-pointer">
                Includes Solutions
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => navigate('/student/past-papers')}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-200 transition-all duration-200 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="h-3.5 w-3.5" />
                {loading ? 'Uploading...' : 'Upload Paper'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}