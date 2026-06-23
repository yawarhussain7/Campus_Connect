// src/pages/TeacherReview.jsx
import React, { useState } from 'react';
import Sidebar from '../../Components/common/Sidebar'; 
import Header from '../../Components/common/Header';   
import TeacherFilterHeader from '../../components/teachers/TeacherFilterHeader';
import TeacherReviewCard from '../../components/teachers/TeacherReviewCard';
import WriteReviewModal from '../../components/teachers/WriteReviewModal';
import { MessageSquarePlus, Users } from 'lucide-react';

const INITIAL_TEACHERS = [
  {
    id: 1,
    name: 'Dr. Aris Thorne',
    dept: 'Computer Science',
    subjects: ['Machine Learning', 'Data Structures', 'Artificial Intelligence'],
    overallRating: 4.8,
    reviewCount: 24,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    latestComment: 'Excellent layout mapping. Explains complex algorithms with incredible precision and grades fairly.'
  },
  {
    id: 2,
    name: 'Prof. Sarah Jenkins',
    dept: 'Computer Science',
    subjects: ['Database Systems', 'Distributed Systems'],
    overallRating: 4.2,
    reviewCount: 18,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    latestComment: 'Very structured slides, but midterms can be highly challenging. Be sure to study past sessional papers.'
  },
  {
    id: 3,
    name: 'Dr. Clara Vance',
    dept: 'Electrical Eng.',
    subjects: ['Signal Processing', 'Circuit Analysis'],
    overallRating: 4.5,
    reviewCount: 15,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    latestComment: 'Super engaging labs. Always stays after class to help explain complex waveforms.'
  }
];

export default function TeacherReview() {
  const [teachersList, setTeachersList] = useState(INITIAL_TEACHERS);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');

  const departmentsList = [...new Set(teachersList.map(t => t.dept))];
  const subjectsList = [...new Set(teachersList.flatMap(t => t.subjects))].sort();

  const filteredTeachers = teachersList.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = !deptFilter || teacher.dept === deptFilter;
    const matchesSubject = !subjectFilter || teacher.subjects.includes(subjectFilter);
    return matchesSearch && matchesDept && matchesSubject;
  });

  const handleOpenReviewModal = (teacher) => {
    setSelectedTeacher(teacher);
    setIsReviewOpen(true);
  };

  const handlePublishReview = (reviewObj) => {
    setTeachersList(prev => prev.map(t => {
      if (t.id === selectedTeacher.id) {
        const updatedCount = t.reviewCount + 1;
        const updatedRating = ((t.overallRating * t.reviewCount) + reviewObj.rating) / updatedCount;
        return {
          ...t,
          reviewCount: updatedCount,
          overallRating: Number(updatedRating.toFixed(1)),
          latestComment: reviewObj.comment
        };
      }
      return t;
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex font-sans antialiased">
      <Sidebar />

      <div className="flex-1 xl:pl-64 flex flex-col min-w-0">
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <div className="flex-1 p-6 max-w-[1600px] w-full mx-auto space-y-6">
          
          {/* Section Header */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl shadow-sm">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Faculty Performance Audit</h1>
              <p className="text-xs text-slate-500 mt-0.5">Anonymous crowd-sourced feedback on instruction quality and course grading.</p>
            </div>
          </div>

          {/* Filters */}
          <TeacherFilterHeader 
            searchQuery={searchQuery} setSearchQuery={setSearchQuery}
            deptFilter={deptFilter} setDeptFilter={setDeptFilter}
            subjectFilter={subjectFilter} setSubjectFilter={setSubjectFilter}
            departments={departmentsList}
            subjects={subjectsList}
          />

          {/* Teacher Cards Grid */}
          {filteredTeachers.length === 0 ? (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-16 text-center shadow-sm">
              <Users className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-400 font-medium">No instructors match your criteria.</p>
              <p className="text-xs text-slate-300 mt-1">Try adjusting the filters above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredTeachers.map(teacher => (
                <TeacherReviewCard 
                  key={teacher.id}
                  teacher={teacher}
                  onOpenReviews={handleOpenReviewModal}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Write Review Modal */}
      <WriteReviewModal 
        isOpen={isReviewOpen}
        onClose={() => {
          setIsReviewOpen(false);
          setSelectedTeacher(null);
        }}
        teacher={selectedTeacher}
        onSubmitReview={handlePublishReview}
      />
    </div>
  );
}