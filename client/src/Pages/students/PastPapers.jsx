// src/pages/PastPapers.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../Components/common/Sidebar'; 
import Header from '../../Components/common/Header';   
import PastPaperHeader from '../../components/paper/PastPaperHeader';
import PastPaperCard from '../../components/paper/PastPaperCard';
import { Upload, Archive } from 'lucide-react';
import {ShowPapers} from '../../api/paper.js'

const INITIAL_PAPERS = [
  { id: 1, subject: 'Machine Learning', teacher: 'Aris Thorne', semester: 'Semester 5', year: '2025', examType: 'Midterm', hasSolution: true },
  { id: 2, subject: 'Database Systems', teacher: 'Sarah Jenkins', semester: 'Semester 3', year: '2024', examType: 'Final Exam', hasSolution: false }
];

export default function PastPapers() {
  const navigate = useNavigate();
  const [papersList, setPapersList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [teacherFilter, setTeacherFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');
  const [examTypeFilter, setExamTypeFilter] = useState('');
  
  useEffect(() => {
    fetchPapers();
  }, []);
  
  const fetchPapers = async () => {
    try {
      const response = await ShowPapers();
      console.log('API Response:', response);
      if (response && response.success) {
        console.log('Papers data:', response.data);
        setPapersList(response.data);
      } else {
        console.log('Response not successful:', response);
      }
    } catch (error) {
      console.error('Error fetching papers:', error);
      setPapersList(INITIAL_PAPERS);
    } finally {
      setLoading(false);
    }
  };

  const teachersList = [...new Set(papersList.map(p => p.instructor))];
  const subjectsList = [...new Set(papersList.map(p => p.subject))];
  const semestersList = [...new Set(papersList.map(p => p.semester))].sort();

  const filteredPapers = papersList.filter(paper => {
    const matchesSearch = paper.subject.toLowerCase().includes(searchQuery.toLowerCase()) || paper.year.toString().includes(searchQuery);
    const matchesTeacher = !teacherFilter || paper.instructor === teacherFilter;
    const matchesSubject = !subjectFilter || paper.subject === subjectFilter;
    const matchesSemester = !semesterFilter || paper.semester === semesterFilter;
    const matchesExamType = !examTypeFilter || paper.exam === examTypeFilter;
    return matchesSearch && matchesTeacher && matchesSubject && matchesSemester && matchesExamType;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex font-sans antialiased">
        <Sidebar />
        <div className="flex-1 xl:pl-64 flex flex-col min-w-0">
          <Header />
          <div className="flex-1 p-6 max-w-[1600px] w-full mx-auto flex items-center justify-center">
            <p className="text-sm text-slate-500">Loading papers...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex font-sans antialiased">
      <Sidebar />

      <div className="flex-1 xl:pl-64 flex flex-col min-w-0">
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <div className="flex-1 p-6 max-w-[1600px] w-full mx-auto space-y-6">
          <div className="flex justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-sm">
                <Archive className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Past Examination Vaults</h1>
                <p className="text-xs text-slate-500 mt-0.5">Crowd-sourced historical test paper variants with solutions.</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/student/past-paper/upload')}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs px-4 py-2.5 rounded-xl font-bold flex items-center gap-1.5 shrink-0 transition-all duration-200 shadow-md shadow-indigo-200 active:scale-95"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Contribute Paper</span>
            </button>
          </div>

          <PastPaperHeader 
            searchQuery={searchQuery} setSearchQuery={setSearchQuery}
            teacherFilter={teacherFilter} setTeacherFilter={setTeacherFilter}
            subjectFilter={subjectFilter} setSubjectFilter={setSubjectFilter}
            semesterFilter={semesterFilter} setSemesterFilter={setSemesterFilter}
            examTypeFilter={examTypeFilter} setExamTypeFilter={setExamTypeFilter}
            teachers={teachersList} subjects={subjectsList} semesters={semestersList}
          />

          {filteredPapers.length === 0 ? (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-16 text-center shadow-sm">
              <Archive className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-400 font-medium">No papers matched your criteria.</p>
              <p className="text-xs text-slate-300 mt-1">Try adjusting the filters above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredPapers.map(paper => (
                <PastPaperCard 
                  key={paper._id || paper.id} 
                  paper={{
                    ...paper,
                    id: paper._id || paper.id,
                    teacher: paper.instructor,
                    examType: paper.exam
                  }} 
                  onDownload={(id) => alert(`Downloading paper ${id}`)} 
                />
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}