import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FolderKanban, Upload } from 'lucide-react';
import { toast } from 'react-toastify';

import Sidebar from '../../Components/common/Sidebar';
import Header from '../../Components/common/Header';
import ModernSelect from '../../Components/common/ModernSelect';
import { uploadProject } from '../../api/project.js';

const DEPARTMENTS = [
  'Computer Science',
  'Electrical Eng.',
  'Management Sciences',
  'Mechanical Eng.',
  'Business School',
];

const SEMESTERS = Array.from(
  { length: 8 },
  (_, index) => `Semester ${index + 1}`
);

const labelClass =
  'block text-[10px] font-semibold text-slate-400 uppercase tracking-[0.07em] mb-1.5';

const fieldClass =
  'w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 placeholder:text-slate-400';

/**
 * Upload a project: the file itself is optional, but a project has to point
 * somewhere, so either a file or a repository link is required.
 */
export default function ProjectUpload() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [course, setCourse] = useState('');
  const [subject, setSubject] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [repo, setRepo] = useState('');
  const [semester, setSemester] = useState('Semester 1');
  const [department, setDepartment] = useState('Computer Science');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim() || !subject.trim()) {
      toast.error('Please fill all required fields');
      return;
    }

    if (!file && !repo.trim()) {
      toast.error('Attach a project file or add a repository link');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('desc', desc.trim());
      formData.append('course', course.trim());
      formData.append('subject', subject.trim());
      formData.append('dueDate', dueDate);
      formData.append('repo', repo.trim());
      formData.append('semester', semester);
      formData.append('department', department);
      if (file) {
        formData.append('file', file);
      }

      await uploadProject(formData);
      toast.success('Project uploaded successfully');
      navigate('/student/projects');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(
        error?.message || 'Failed to upload project. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-slate-800 flex font-sans antialiased">
      <Sidebar />

      <div className="flex-1 xl:pl-64 flex flex-col min-w-0">
        <Header />

        <div className="flex-1 p-4 sm:p-6 max-w-[1500px] w-full mx-auto space-y-4">
          {/* Header */}
          <div className="flex justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-blue-600 text-white">
                <FolderKanban className="h-5 w-5 text-white" />
              </div>

              <div>
                <h1 className="text-[20px] font-semibold tracking-tight text-slate-900">
                  Upload Project
                </h1>

                <p className="text-xs text-slate-500 mt-0.5">
                  Share your project work, report or repository with your
                  teachers.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/student/projects')}
              className="bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-600 text-xs px-4 py-2.5 rounded-xl font-semibold flex items-center gap-1.5 shrink-0 transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Projects</span>
            </button>
          </div>

          {/* Upload form */}
          <form
            onSubmit={handleSubmit}
            className="surface-card max-w-3xl p-6 space-y-5"
          >
            <div>
              <label className={labelClass}>Project Title *</label>

              <input
                type="text"
                required
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g., E-Commerce Website Project"
                className={fieldClass}
              />
            </div>

            <div>
              <label className={labelClass}>Description</label>

              <textarea
                value={desc}
                onChange={(event) => setDesc(event.target.value)}
                placeholder="What does the project do, which stack it uses and what is included in the submission."
                rows="3"
                className={`${fieldClass} resize-none`}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Course Code</label>

                <input
                  type="text"
                  value={course}
                  onChange={(event) => setCourse(event.target.value)}
                  placeholder="e.g., CS305"
                  className={fieldClass}
                />
              </div>

              <div>
                <label className={labelClass}>Subject *</label>

                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  placeholder="e.g., Web Development"
                  className={fieldClass}
                />
              </div>

              <div>
                <label className={labelClass}>Due Date</label>

                <input
                  type="date"
                  value={dueDate}
                  onChange={(event) => setDueDate(event.target.value)}
                  className={fieldClass}
                />
              </div>

              <div>
                <label className={labelClass}>Repository Link</label>

                <input
                  type="url"
                  value={repo}
                  onChange={(event) => setRepo(event.target.value)}
                  placeholder="https://github.com/you/project"
                  className={fieldClass}
                />
              </div>

              <ModernSelect
                label="Department"
                value={department}
                onChange={setDepartment}
                options={DEPARTMENTS.map((item) => ({
                  value: item,
                  label: item,
                }))}
                placeholder="Select department"
              />

              <ModernSelect
                label="Semester"
                value={semester}
                onChange={setSemester}
                options={SEMESTERS.map((item) => ({ value: item, label: item }))}
                placeholder="Select semester"
              />
            </div>

            <div>
              <label className={labelClass}>Project File</label>

              <input
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.rar,.jpg,.jpeg,.png"
                onChange={(event) => setFile(event.target.files[0])}
                className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[11px] file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />

              <p className="mt-1.5 text-[11px] text-slate-400">
                {file
                  ? `Selected: ${file.name}`
                  : 'PDF, DOCX, PPT, ZIP, RAR or an image — up to 15 MB. Attach a file or add a repository link.'}
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => navigate('/student/projects')}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md transition-all duration-200 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="h-3.5 w-3.5" />
                {loading ? 'Uploading...' : 'Upload Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
