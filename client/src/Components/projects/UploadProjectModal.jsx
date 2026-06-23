// src/components/registry/UploadProjectModal.jsx
import React, { useState } from 'react';
import { X, Upload, Code, BookOpen, Layers } from 'lucide-react';

export default function UploadProjectModal({ isOpen, onClose, onUploadSubmit, departments = [] }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [img, setImg] = useState('');
  const [tags, setTags] = useState('');
  const [dept, setDept] = useState('');
  const [subject, setSubject] = useState('');
  const [semester, setSemester] = useState('Semester 1');
  const [author, setAuthor] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !desc || !dept || !subject || !author) {
      alert('Please fill out all mandatory structural fields.');
      return;
    }

    // Transform comma-separated string into arrays for the tag system
    const processedTags = tags
      ? tags.split(',').map(t => t.trim()).filter(Boolean)
      : ['General'];

    const fallbackImg = img.trim() || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80';

    onUploadSubmit({
      id: Date.now(),
      title,
      desc,
      img: fallbackImg,
      tags: processedTags,
      dept,
      subject,
      semester,
      author,
      uni: 'CAMPUS CORPS', // Mock baseline
      likes: 0,
      comments: 0,
      rating: 5.0
    });

    // Reset parameters
    setTitle('');
    setDesc('');
    setImg('');
    setTags('');
    setDept('');
    setSubject('');
    setAuthor('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-100 animate-fadeIn">
        
        {/* Header Block */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Upload className="h-4 w-4 text-blue-600" />
            <span>Index New Build Artifact</span>
          </h2>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Input Form Layer */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Project Title *</label>
              <input 
                type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Core Mesh Routing Node"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 transition-all text-slate-700"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Lead Developer / Author *</label>
              <input 
                type="text" required value={author} onChange={(e) => setAuthor(e.target.value)}
                placeholder="Your Name"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 transition-all text-slate-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Abstract Description *</label>
            <textarea 
              required rows={3} value={desc} onChange={(e) => setDesc(e.target.value)}
              placeholder="Provide clean technical runtime scope summaries..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 transition-all text-slate-700"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Department *</label>
              <select
                value={dept} required onChange={(e) => setDept(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2 focus:outline-none focus:border-blue-500 text-slate-600 font-medium"
              >
                <option value="">Select Dept</option>
                {departments.map((d, i) => <option key={i} value={d}>{d}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Subject Track *</label>
              <input 
                type="text" required value={subject} onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Computer Networks"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 transition-all text-slate-700"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Semester</label>
              <select
                value={semester} onChange={(e) => setSemester(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2 focus:outline-none focus:border-blue-500 text-slate-600 font-medium"
              >
                {[...Array(8)].map((_, i) => (
                  <option key={i} value={`Semester ${i + 1}`}>Semester {i + 1}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Technology Stack (Comma Separated)</label>
            <input 
              type="text" value={tags} onChange={(e) => setTags(e.target.value)}
              placeholder="React, TailwindCSS, WebSockets"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 transition-all text-slate-700"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Thumbnail Image Asset URL</label>
            <input 
              type="url" value={img} onChange={(e) => setImg(e.target.value)}
              placeholder="https://images.unsplash.com/... or blank for fallback"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 transition-all text-slate-700"
            />
          </div>

          {/* Form Action Buttons */}
          <div className="pt-4 flex items-center justify-end space-x-2 border-t border-slate-100">
            <button
              type="button" onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-600/10 transition-all"
            >
              Publish Build
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}