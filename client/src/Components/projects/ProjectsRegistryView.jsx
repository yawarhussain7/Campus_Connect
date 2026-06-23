// src/components/registry/ProjectsRegistryView.jsx
import React, { useState } from 'react';
import RegistryHeader from './RegistryHeader';
import ProjectMetricsBar from './ProjectMetricsBar';
import ProjectCard from '../dashboard/ProjectCard';
import ProjectRowItem from './ProjectRowItem';
import ProjectReviewModal from '../dashboard/ProjectReviewModal';

export default function ProjectsRegistryView({ 
  projects = [], 
  likedProjects = {}, 
  onLikeProject, 
  projectReviews = {}, 
  onAddReview 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [techFilter, setTechFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState(''); // Added
  const [subjectFilter, setSubjectFilter] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [activeProjectModal, setActiveProjectModal] = useState(null);

  // Derive unique selection options dynamically from raw project schema properties
  const dynamicDepartments = [...new Set(projects.map(p => p.dept).filter(Boolean))];
  const dynamicSubjects = [...new Set(projects.map(p => p.subject).filter(Boolean))];
  const dynamicSemesters = [...new Set(projects.map(p => p.semester).filter(Boolean))].sort();

  // Multi-Variable Matrix Matching Engine
  const filteredProjects = projects.filter(proj => {
    const matchesSearch = proj.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          proj.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTech = !techFilter || proj.tags.includes(techFilter);
    const matchesDept = !deptFilter || proj.dept === deptFilter; // Added
    const matchesSubject = !subjectFilter || proj.subject === subjectFilter;
    const matchesSemester = !semesterFilter || proj.semester === semesterFilter;

    return matchesSearch && matchesTech && matchesDept && matchesSubject && matchesSemester;
  });

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto p-1">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Academic Projects Registry</h1>
        <p className="text-xs text-slate-500 mt-0.5">Filter open-source builds across tracking dimensions.</p>
      </div>

      <ProjectMetricsBar totalCount={filteredProjects.length} />

      <RegistryHeader 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery}
        techFilter={techFilter}
        setTechFilter={setTechFilter}
        deptFilter={deptFilter}
        setDeptFilter={setDeptFilter}
        subjectFilter={subjectFilter}
        setSubjectFilter={setSubjectFilter}
        semesterFilter={semesterFilter}
        setSemesterFilter={setSemesterFilter}
        viewMode={viewMode}
        setViewMode={setViewMode}
        departments={dynamicDepartments}
        subjects={dynamicSubjects}
        semesters={dynamicSemesters}
      />

      {filteredProjects.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
          <p className="text-sm text-slate-400 italic">No matching project builds found for your parameter choices.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredProjects.map((proj) => (
            <ProjectCard 
              key={proj.id}
              proj={proj}
              isLiked={!!likedProjects[proj.id]}
              onLike={onLikeProject}
              onOpenReviews={() => setActiveProjectModal(proj)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProjects.map((proj) => (
            <ProjectRowItem 
              key={proj.id}
              proj={proj}
              isLiked={!!likedProjects[proj.id]}
              onLike={onLikeProject}
              onOpenReviews={() => setActiveProjectModal(proj)}
            />
          ))}
        </div>
      )}

      {activeProjectModal && (
        <ProjectReviewModal 
          proj={activeProjectModal}
          reviews={projectReviews[activeProjectModal.id] || []}
          onClose={() => setActiveProjectModal(null)}
          onAddReview={onAddReview}
        />
      )}
    </div>
  );
}