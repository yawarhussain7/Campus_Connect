// src/components/Header.jsx
import React from 'react';
import { Search, Filter, Bell } from 'lucide-react';

export default function Header({ searchQuery, setSearchQuery, showFilters, setShowFilters }) {
  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm">
      <div className="relative w-full max-w-xl">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by department, course title, or instructor tags..." 
          className="w-full bg-slate-100/80 border border-slate-200/80 rounded-full pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all text-slate-700 placeholder:text-slate-400"
        />
      </div>

      <div className="flex items-center space-x-3">
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center space-x-1.5 text-xs border rounded-xl px-3.5 py-2.5 shadow-sm transition-all duration-200 ${
            showFilters 
              ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold' 
              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800 hover:shadow'
          }`}
        >
          <Filter className="h-3.5 w-3.5" />
          <span>Filters</span>
        </button>
        
        <button className="relative p-2.5 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-all duration-200">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-4.5 w-4.5 bg-gradient-to-br from-indigo-500 to-purple-600 text-[9px] font-bold text-white rounded-full flex items-center justify-center shadow-sm shadow-indigo-200">3</span>
        </button>
        
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px] shadow-md">
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80" 
            alt="Profile" 
            className="h-full w-full rounded-full border-2 border-white object-cover" 
          />
        </div>
      </div>
    </header>
  );
}