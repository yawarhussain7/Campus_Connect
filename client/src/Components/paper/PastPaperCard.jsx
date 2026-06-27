// src/components/paper/PastPaperCard.jsx
import React from 'react';
import { Download, CheckCircle, HelpCircle, Calendar, User, Eye, BookOpen, Tag } from 'lucide-react';

export default function PastPaperCard({ paper, onDownload, onOpenPreview }) {
  return (
    <div 
      onClick={() => onOpenPreview && onOpenPreview(paper)}
      className="group bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:shadow-lg hover:border-indigo-200/50 transition-all duration-300 relative"
    >
      <div className="space-y-3">
        {/* Header Badges */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-1.5">
            <div className="px-2.5 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[10px] font-semibold rounded-lg shadow-sm">
              {paper.examType}
            </div>
          </div>
          <span className="flex items-center gap-1 text-[10px] font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-200/60">
            <Calendar className="h-3 w-3" /> {paper.year}
          </span>
        </div>

        {/* Paper Info */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-700 transition-colors line-clamp-1">
            {paper.subject}
          </h3>
          <p className="flex items-center gap-1 text-[11px] text-slate-500 font-medium mt-1">
            <BookOpen className="h-3.5 w-3.5 text-slate-400" />
            {paper.semester}
          </p>
          {paper.batch && (
            <p className="flex items-center gap-1 text-[11px] text-indigo-600 font-semibold mt-1.5">
              <Tag className="h-3 w-3" />
              {paper.batch}
            </p>
          )}
        </div>

        {/* Teacher Label */}
        <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/60">
          <User className="h-3.5 w-3.5 text-slate-400" />
          <span className="truncate font-medium">Prof. {paper.teacher}</span>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between">
        {/* Solution Status Badge */}
        <div>
          {paper.hasSolution ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              <CheckCircle className="h-3 w-3 text-emerald-500" /> Solved
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
              <HelpCircle className="h-3 w-3 text-amber-500" /> Unsolved
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <span className="p-1.5 text-slate-400 group-hover:text-indigo-500 transition-colors cursor-pointer" title="Click card to preview">
            <Eye className="h-3.5 w-3.5" />
          </span>
          
          <button
            onClick={(e) => {
              e.stopPropagation(); 
              onDownload && onDownload(paper.id);
            }}
            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 border border-transparent hover:border-indigo-100 flex items-center gap-1 font-bold text-[10px]"
            title="Download PDF"
          >
            <span className="text-[10px] font-semibold">PDF</span>
            <Download className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}