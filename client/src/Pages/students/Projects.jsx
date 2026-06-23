// src/pages/Projects.jsx
import React, { useState } from 'react';
import Sidebar from '../../Components/common/Sidebar'; 
import Header from '../../Components/common/Header';   
import ProjectsRegistryView from '../../components/projects/ProjectsRegistryView';
import UploadProjectModal from '../../components/projects/UploadProjectModal';
import ProjectReportModal from '../../Components/projects/ProjectReportModal'; // Preserved your exact case pathing

const DEPARTMENTS = ['Computer Science', 'Electrical Eng.', 'Mechanical Eng.', 'Business School'];

const INITIAL_PROJECTS = [
  {
    id: 1,
    title: 'AI-Powered Attendance System',
    desc: 'Face recognition attendance tracker using Python and OpenCV. Auto-marks roster grids seamlessly.',
    tags: ['Python', 'AI', 'OpenCV'],
    dept: 'Computer Science',
    subject: 'Machine Learning',
    teacher: 'Dr. Aris Thorne',
    section: 'A',
    author: 'Hamza Raza',
    uni: 'FAST NUCES',
    semester: 'Semester 5',
    likes: 48,
    comments: 12,
    rating: 4.5,
    img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80'
  }
];

export default function Projects() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // State pipeline handlers
  const [projectList, setProjectList] = useState(INITIAL_PROJECTS);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [likedProjects, setLikedProjects] = useState({});
  const [projectReviews, setProjectReviews] = useState({});
  
  // Track which project performance analytics scorecard is currently active
  const [activeReportTarget, setActiveReportTarget] = useState(null);

  const handleProjectLike = (id) => {
    setLikedProjects(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddReview = (projId, reviewObj) => {
    setProjectReviews(prev => ({
      ...prev,
      [projId]: [...(prev[projId] || []), reviewObj]
    }));
  };

  const handleUploadProject = (newProjectObj) => {
    setProjectList(prev => [newProjectObj, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex font-sans antialiased">
      
      {/* Sidebar triggers upload context view */}
      <Sidebar currentView="projects" onUploadClick={() => setIsUploadOpen(true)} />

      <div className="flex-1 xl:pl-64 flex flex-col min-w-0">
        <Header 
          searchQuery={searchQuery} setSearchQuery={setSearchQuery}
          showFilters={showFilters} setShowFilters={setShowFilters}
        />

        <div className="flex-1 p-6 max-w-[1600px] w-full mx-auto">
          {/* Action trigger shortcut panel */}
          <div className="mb-4 flex justify-end">
            <button 
              onClick={() => setIsUploadOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2 rounded-xl font-bold transition-all shadow-sm"
            >
              + Submit Local Build
            </button>
          </div>

          <ProjectsRegistryView 
            projects={projectList}
            likedProjects={likedProjects}
            onLikeProject={handleProjectLike}
            projectReviews={projectReviews}
            onAddReview={handleAddReview}
            onOpenReport={(projectData) => setActiveReportTarget(projectData)} // Bubbles up state to parent target portal
          />
        </div>
      </div>

      {/* Upload Dialog Injection Portal */}
      <UploadProjectModal 
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSubmit={handleUploadProject}
        departments={DEPARTMENTS}
      />

      {/* Performance Report Analytical Dashboard Modal */}
      <ProjectReportModal 
        isOpen={Boolean(activeReportTarget)}
        proj={activeReportTarget}
        reviews={projectReviews[activeReportTarget?.id] || []}
        onClose={() => setActiveReportTarget(null)}
      />

    </div>
  );
}