// src/Components/common/Sidebar.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Folder, FileText, Users, Trophy, Info, Settings, LogOut, GraduationCap } from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/student/dashboard', name: 'Home', icon: Home },
    { path: '/student/projects', name: 'Projects Registry', icon: Folder },
    { path: '/student/past-papers', name: 'Past Paper', icon: FileText },
    { path: '/student/teachers-review', name: 'Teacher Reviews', icon: Users },
    { path: '/student/assignments', name: 'Assignments', icon: Trophy },
    { path: '/student/about', name: 'About', icon: Info },
    { path: '/student/settings', name: 'Settings', icon: Settings },
  ];

  const handleLogout = () => {
    alert('Logging out of your session...');
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-100 p-5 flex flex-col justify-between fixed h-full z-10 hidden xl:flex shadow-sm">
      <div className="space-y-8">
        {/* Brand Header */}
        <div 
          onClick={() => navigate('/student/dashboard')} 
          className="flex items-center space-x-3 px-2 cursor-pointer group"
        >
          <div className="h-10 w-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-200 group-hover:shadow-indigo-300 transition-all duration-300 group-hover:scale-105">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">CampusConnect</span>
            <p className="text-[9px] font-medium text-slate-400 tracking-wider uppercase -mt-0.5">Student Portal</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          <p className="px-4 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Main Navigation</p>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 font-semibold shadow-sm border border-indigo-100' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-200 border border-transparent'
                }`}
              >
                <div className={`p-1 rounded-lg transition-all duration-200 ${
                  isActive ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400'
                }`}>
                  <item.icon className="h-4 w-4" />
                </div>
                <span>{item.name}</span>
                {isActive && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulseGlow" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="space-y-2 pt-4 border-t border-slate-100">
        <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-4 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-200 transition-all duration-200 flex items-center justify-center space-x-2 hover:shadow-xl hover:shadow-indigo-200 active:scale-[0.98]">
          <span className="text-lg leading-none">+</span>
          <span>Upload Academic Asset</span>
        </button>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-all duration-200 cursor-pointer group"
        >
          <div className="p-1 rounded-lg text-rose-500 group-hover:bg-rose-100 transition-colors duration-200">
            <LogOut className="h-4 w-4" />
          </div>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}