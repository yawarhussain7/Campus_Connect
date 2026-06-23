// src/components/dashboard/ProjectCard.jsx
import React from 'react';
import { Heart, MessageSquare, Star, Eye } from 'lucide-react';

export default function ProjectCard({ proj, isLiked, onLike, onOpenReviews }) {
  return (
    <div 
      onClick={onOpenReviews}
      className="cursor-pointer bg-white border border-slate-200/80 rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-lg hover:border-indigo-200/50 transition-all duration-300 group"
    >
      <div className="relative h-40 bg-slate-100 overflow-hidden">
        <img 
          src={proj.img} 
          alt={proj.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <span className="absolute top-3 left-3 text-[10px] font-semibold bg-white/90 backdrop-blur-sm text-slate-700 px-2.5 py-1 rounded-lg border border-white/50 shadow-sm">
          {proj.dept}
        </span>
        <span className="absolute top-3 right-3 px-2 py-1 bg-indigo-600/90 backdrop-blur-sm text-white text-[10px] font-semibold rounded-lg shadow-sm">
          {proj.section}
        </span>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <h3 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-700 transition-colors">{proj.title}</h3>
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{proj.desc}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {proj.tags.slice(0, 3).map((tag, i) => (
            <span key={i} className="text-[9px] font-medium bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md border border-slate-200/60">
              {tag}
            </span>
          ))}
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[9px] text-white font-bold shadow-sm">
              {proj.author.charAt(0)}
            </div>
            <span className="font-medium text-slate-600 truncate max-w-[100px]">{proj.author}</span>
          </div>
          
          <div className="flex items-center gap-2.5">
            <button 
              onClick={(e) => {
                e.stopPropagation(); 
                onLike(proj.id);
              }} 
              className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all duration-200 ${
                isLiked 
                  ? 'text-rose-500 bg-rose-50 border border-rose-100' 
                  : 'text-slate-400 hover:text-rose-500 hover:bg-rose-50 border border-transparent'
              }`}
            >
              <Heart className={`h-3.5 w-3.5 transition-all duration-200 ${isLiked ? 'fill-rose-500 scale-110' : ''}`} />
              <span className="text-[11px] font-semibold">{isLiked ? proj.likes + 1 : proj.likes}</span>
            </button>
            
            <div className="flex items-center gap-1 text-slate-400">
              <MessageSquare className="h-3.5 w-3.5" />
              <span className="text-[11px] font-semibold">{proj.comments}</span>
            </div>
            
            <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-50 rounded-md border border-amber-100">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="text-[11px] font-bold text-amber-600">{proj.rating}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}