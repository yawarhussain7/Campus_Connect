// src/components/teachers/TeacherReviewCard.jsx
import React, { useState } from 'react';
import { Star, MessageSquare, GraduationCap, Quote } from 'lucide-react';

export default function TeacherReviewCard({ teacher, onOpenReviews }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="group bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:shadow-lg hover:border-indigo-200/50 transition-all duration-300">
      <div className="space-y-4">
        
        {/* Card Header Profile */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            
            {teacher.avatar && !imageError ? (
              <div className="relative">
                <img 
                  src={teacher.avatar} 
                  alt={teacher.name} 
                  crossOrigin="anonymous"
                  onError={() => setImageError(true)}
                  className="h-12 w-12 rounded-xl object-cover border-2 border-slate-100 shadow-sm"
                />
                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-emerald-500 border-2 border-white rounded-full" />
              </div>
            ) : (
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-black shadow-sm">
                {teacher.name.split(' ').pop().charAt(0)}
              </div>
            )}

            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                {teacher.name}
              </h3>
              <p className="flex items-center gap-1 text-[10px] text-slate-400 font-medium mt-0.5">
                <GraduationCap className="h-3 w-3" />
                {teacher.dept}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-lg border border-amber-200 text-[10px] font-bold shadow-sm">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span>{teacher.overallRating.toFixed(1)}</span>
          </div>
        </div>

        {/* Subjects tags */}
        <div className="flex flex-wrap gap-1">
          {teacher.subjects.map((sub, idx) => (
            <span key={idx} className="text-[9px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200/60">
              {sub}
            </span>
          ))}
        </div>

        {/* Latest Comment */}
        {teacher.latestComment && (
          <div className="relative bg-slate-50/80 p-3 rounded-xl border border-slate-200/60">
            <Quote className="h-3 w-3 text-indigo-400 absolute top-2 left-2 opacity-50" />
            <p className="text-[11px] text-slate-500 italic line-clamp-2 leading-relaxed pl-5">
              {teacher.latestComment}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[10px] text-slate-400 font-medium">
          <span className="font-bold text-slate-500">{teacher.reviewCount}</span> reviews
        </span>

        <button
          onClick={() => onOpenReviews && onOpenReviews(teacher)}
          className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-1.5 rounded-xl transition-all duration-200 flex items-center gap-1.5 border border-indigo-100 hover:border-indigo-200"
        >
          <MessageSquare className="h-3 w-3" />
          <span>Review</span>
        </button>
      </div>
    </div>
  );
}