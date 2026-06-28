// src/pages/Assignments.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../../Components/common/Sidebar'; 
import Header from '../../Components/common/Header';   
import ModernSelect from '../../Components/common/ModernSelect';
import AssignmentFileCard from '../../components/assignments/AssignmentFileCard';
import { Plus, Search, BookOpen } from 'lucide-react';
import { ShowAllassignment, downloadAssignment } from '../../api/assignment';
import { toast } from 'react-toastify';

export default function Assignments() {
  const navigate = useNavigate();
  const [sharedFiles, setSharedFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');
  const [teacherFilter, setTeacherFilter] = useState('');

  const location = useLocation();

  useEffect(() => {
    fetchAssignments();
  }, [location.key]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await ShowAllassignment();
      const assignments = response.data.map((assignment, index) => ({
        ...assignment,
        id: assignment._id || index + 1,
        teacher: assignment.instructor,
        uploadedDate: assignment.createdAt ? new Date(assignment.createdAt).toISOString().split('T')[0] : 'N/A',
        fileSize: 'N/A',
        rating: 0
      }));
      setSharedFiles(assignments);
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
      toast.error('Failed to load assignments. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const departmentsList = [...new Set(sharedFiles.map(f => f.department))].sort();
  const subjectsList = [...new Set(sharedFiles.map(f => f.subject))].sort();
  const semestersList = [...new Set(sharedFiles.map(f => f.semester))].sort();
  const teachersList = [...new Set(sharedFiles.map(f => f.teacher))].sort();

  const filteredFiles = sharedFiles.filter(file => {
    const title = file.title?.toLowerCase() || '';
    const description = file.description?.toLowerCase() || '';
    const department = file.department?.toLowerCase() || '';
    
    const matchesSearch = 
      title.includes(searchQuery.toLowerCase()) || 
      description.includes(searchQuery.toLowerCase()) ||
      department.includes(searchQuery.toLowerCase());
      
    const matchesDept = !deptFilter || file.department === deptFilter;
    const matchesSubject = !subjectFilter || file.subject === subjectFilter;
    const matchesSemester = !semesterFilter || file.semester === semesterFilter;
    const matchesTeacher = !teacherFilter || file.teacher === teacherFilter;

    return matchesSearch && matchesDept && matchesSubject && matchesSemester && matchesTeacher;
  });

  const handleDownload = async (file) => {
    try {
      if (!file.fileUrl) {
        toast.error('File URL not found');
        return;
      }
      
      const filename = file.fileUrl.split('/').pop();
      console.log('Downloading file:', filename);
      console.log('Full file object:', file);
      
      const response = await downloadAssignment(file.id);
      const blob = response.data instanceof Blob ? response.data : new Blob([response.data], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      console.log('File downloaded successfully');
      toast.success('File downloaded successfully!');
      
    } catch (error) {
      console.error('Download failed:', error);
      toast.error(`Download failed: ${error?.message || 'Unknown error'}`);
    }
  };

  const getFileExtension = (fileUrl) => {
    const extension = fileUrl.split('.').pop();
    return extension ? `.${extension}` : '';
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
              onClick={() => navigate('/student/assignment/upload')}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs px-4 py-2.5 rounded-xl font-bold flex items-center gap-1.5 shrink-0 transition-all duration-200 shadow-md shadow-indigo-200 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Upload Assignment</span>
            </button>
          </div>

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
              <ModernSelect
                label="Department"
                value={deptFilter}
                onChange={setDeptFilter}
                options={[
                  { value: '', label: 'All Departments' },
                  ...departmentsList.map(d => ({ value: d, label: d }))
                ]}
                placeholder="All Departments"
              />
              <ModernSelect
                label="Subject"
                value={subjectFilter}
                onChange={setSubjectFilter}
                options={[
                  { value: '', label: 'All Subjects' },
                  ...subjectsList.map(s => ({ value: s, label: s }))
                ]}
                placeholder="All Subjects"
              />
              <ModernSelect
                label="Semester"
                value={semesterFilter}
                onChange={setSemesterFilter}
                options={[
                  { value: '', label: 'All Semesters' },
                  ...semestersList.map(sem => ({ value: sem, label: sem }))
                ]}
                placeholder="All Semesters"
              />
              <ModernSelect
                label="Instructor"
                value={teacherFilter}
                onChange={setTeacherFilter}
                options={[
                  { value: '', label: 'All Instructors' },
                  ...teachersList.map(t => ({ value: t, label: t }))
                ]}
                placeholder="All Instructors"
              />
            </div>
          </div>

          {/* Cards */}
          {loading ? (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-16 text-center shadow-sm">
              <BookOpen className="h-10 w-10 text-slate-300 mx-auto mb-3 animate-pulse" />
              <p className="text-sm text-slate-400 font-medium">Loading assignments...</p>
            </div>
          ) : filteredFiles.length === 0 ? (
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