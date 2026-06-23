// src/components/MaterialCard.jsx
import React from 'react';
import { ShieldCheck, Download, FileText, Users, ArrowDown } from 'lucide-react';

export default function MaterialCard({ note, downloadCount, onDownload }) {
  return (
    <div className="group bg-white border border-slate-200/80 rounded-2xl p-4 flex justify-between items-start shadow-sm hover:shadow-lg hover:border-indigo-200/50 transition-all duration-300">
      <div className="space-y-2.5 min-w-0 flex-1 pr-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg border ${
            note.type === 'Past Paper' 
              ? 'bg-amber-50 text-amber-700 border-amber-200' 
              : note.type === 'Assignment'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-blue-50 text-blue-700 border-blue-200'
          }`}>
            {note.type}
          </span>
          
          <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 font-medium bg-slate-100 border border-slate-200/60 px-2 py-0.5 rounded-md">
            <ShieldCheck className="h-3 w-3 text-emerald-500" />
            {note.integrityStatus}
          </span>
        </div>

        <h3 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-700 transition-colors">{note.title}</h3>
        
        <p className="text-[11px] text-slate-400">
          {note.dept} · Sec {note.section} · <span className="text-slate-700 font-semibold">{note.teacher}</span>
        </p>

        <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span className="font-medium text-slate-500">{note.author}</span>
          </span>
          <span className="flex items-center gap-1">
            <ArrowDown className="h-3 w-3" />
            <span className="font-semibold text-slate-500">{note.downloads + downloadCount}</span>
          </span>
          <span className="text-slate-300">·</span>
          <span>💬 {note.comments}</span>
          <span className="text-slate-300">·</span>
          <span className="text-slate-500">{note.pages}</span>
        </div>
      </div>

      <button 
        onClick={() => onDownload(note.id)}
        className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200/60 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md shrink-0 group/btn"
      >
        <Download className="h-4 w-4 transition-transform duration-200 group-hover/btn:scale-110" />
      </button>
    </div>
  );
}