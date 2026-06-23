// src/components/registry/ProjectRowItem.jsx
import React from 'react';
import { Heart, MessageSquare, ExternalLink, ShieldAlert } from 'lucide-react';

export default function ProjectRowItem({ proj, isLiked, onLike, onOpenReviews }) {
  return (
    <div 
      onClick={onOpenReviews}
      className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer transition-all shadow-sm"
    >
      <div className="flex items-start sm:items-center space-x-4 min-w-0 flex-1">
        <img src={proj.img} alt={proj.title} className="h-14 w-14 rounded-lg object-cover border border-slate-100 shrink-0 hidden sm:block" />
        <div className="min-w-0 space-y-1">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <h3 className="text-sm font-bold text-slate-900 truncate pr-1">{proj.title}</h3>
            <span className="text-[9px] font-mono bg-slate-100 border text-slate-500 px-1.5 py-0.5 rounded">
              {proj.dept}
            </span>
          </div>
          <p className="text-xs text-slate-500 line-clamp-1">{proj.desc}</p>
          <div className="flex items-center space-x-2 flex-wrap gap-1">
            {proj.tags.map((tag, i) => (
              <span key={i} className="text-[10px] text-blue-600 bg-blue-50/50 px-1.5 rounded font-medium">#{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end space-x-4 border-t sm:border-t-0 pt-2 sm:pt-0 shrink-0 text-xs text-slate-400">
        <div className="text-left sm:text-right">
          <span className="font-medium text-slate-700 block text-xs">By {proj.author}</span>
          <span className="text-[9px] font-mono block">{proj.uni} · {proj.semester}</span>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={(e) => { e.stopPropagation(); onLike(proj.id); }}
            className={`flex items-center space-x-0.5 ${isLiked ? 'text-rose-500 font-bold' : 'hover:text-rose-500'}`}
          >
            <Heart className={`h-3.5 w-3.5 ${isLiked ? 'fill-rose-500' : ''}`} />
            <span>{isLiked ? proj.likes + 1 : proj.likes}</span>
          </button>
          
          <div className="flex items-center space-x-0.5">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>{proj.comments}</span>
          </div>
          
          <span className="text-amber-500 font-bold">★ {proj.rating}</span>
        </div>
      </div>
    </div>
  );
}