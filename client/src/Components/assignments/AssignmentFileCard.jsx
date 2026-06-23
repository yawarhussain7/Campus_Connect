// src/components/assignments/AssignmentFileCard.jsx
import React from 'react';
import { Download, GraduationCap, BookOpen, User, FileText, Star, Calendar, BadgeCheck } from 'lucide-react';

export default function AssignmentFileCard({ file, onDownload }) {
  return (
    <div className="group bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:shadow-lg hover:border-indigo-200/50 transition-all duration-300">
      <div className="space-y-3.5">
        
        {/* Top Header Badges */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-1 text-[10px] font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-2.5 py-1 rounded-lg shadow-sm">
              <GraduationCap className="h-3 w-3" /> {file.department}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-lg border border-amber-200 text-[10px] font-bold">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {file.rating.toFixed(1)}
            </span>
            <span className="text-[10px] font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
              {file.fileSize}
            </span>
          </div>
        </div>

        {/* File Content */}
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-indigo-50 rounded-xl border border-indigo-100 shrink-0 shadow-sm">
            <FileText className="h-5 w-5 text-indigo-600" />
          </div>
          <div className="space-y-1.5 min-w-0">
            <h3 className="text-xs font-bold text-slate-900 group-hover:text-indigo-700 transition-colors leading-tight">
              {file.title}
            </h3>
            <p className="text-[11px] text-slate-500 leading-relaxed bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/60 italic">
              "{file.description}"
            </p>
            <div className="flex flex-wrap gap-2 text-[10px] font-medium text-slate-400">
              <span className="flex items-center gap-1 text-slate-500">
                <BookOpen className="h-3 w-3" /> {file.subject}
              </span>
              <span className="text-slate-300">·</span>
              <span>{file.semester}</span>
            </div>
          </div>
        </div>

        {/* Teacher */}
        <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/60">
          <User className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-[11px] font-medium">
            Course Teacher: <strong className="text-slate-700">Prof. {file.teacher}</strong>
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3.5 mt-3.5 border-t border-slate-100 flex items-center justify-between">
        <span className="flex items-center gap-1 text-slate-400 font-mono text-[10px]">
          <Calendar className="h-3 w-3" /> Shared: {file.uploadedDate}
        </span>
        
        <button
          onClick={() => onDownload && onDownload(file)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-[11px] px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 shadow-sm shadow-indigo-200 transition-all duration-200 active:scale-95"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Download</span>
        </button>
      </div>
    </div>
  );
}