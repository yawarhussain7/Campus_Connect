// src/components/registry/ProjectReportModal.jsx
import React from 'react';
import { X, BarChart3, Heart, MessageSquare, Eye, Star, ThumbsUp, TrendingUp } from 'lucide-react';

export default function ProjectReportModal({ isOpen, onClose, proj, reviews = [] }) {
  if (!isOpen || !proj) return null;

  // Calculate dynamic review metrics
  const totalReviews = reviews.length;
  const avgRating = totalReviews 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : proj.rating;

  // Mock secondary analytical data metrics
  const mockViews = proj.likes * 12 + (proj.comments * 4) + 42; 
  const completionRate = "94%";
  
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-100 animate-fadeIn">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-blue-600" />
            <span>Project Performance Report</span>
          </h2>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Analytics Body Canvas */}
        <div className="p-6 space-y-6">
          
          {/* Project Header Summary Card */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/50 flex items-center space-x-4">
            <img src={proj.img} alt={proj.title} className="h-12 w-12 rounded-lg object-cover" />
            <div className="min-w-0">
              <h3 className="text-xs font-bold text-slate-900 truncate">{proj.title}</h3>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">{proj.dept} · {proj.semester}</p>
            </div>
          </div>

          {/* Core Analytics Grid Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            <div className="bg-white border border-slate-200 rounded-xl p-3 text-center space-y-1 shadow-sm">
              <Eye className="h-4 w-4 text-slate-400 mx-auto" />
              <span className="text-[10px] text-slate-400 font-medium block">Total Views</span>
              <span className="text-sm font-mono font-bold text-slate-800 block">{mockViews}</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-3 text-center space-y-1 shadow-sm">
              <Heart className="h-4 w-4 text-rose-500 mx-auto fill-rose-50" />
              <span className="text-[10px] text-slate-400 font-medium block">Total Likes</span>
              <span className="text-sm font-mono font-bold text-slate-800 block">{proj.likes}</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-3 text-center space-y-1 shadow-sm">
              <MessageSquare className="h-4 w-4 text-blue-500 mx-auto" />
              <span className="text-[10px] text-slate-400 font-medium block">Comments</span>
              <span className="text-sm font-mono font-bold text-slate-800 block">{proj.comments + totalReviews}</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-3 text-center space-y-1 shadow-sm">
              <Star className="h-4 w-4 text-amber-500 mx-auto fill-amber-50" />
              <span className="text-[10px] text-slate-400 font-medium block">Peer Rating</span>
              <span className="text-sm font-mono font-bold text-slate-800 block">★ {avgRating}</span>
            </div>

          </div>

          {/* Deep Insight Engagement Blocks */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Platform Peer Insights</span>
            </h4>
            
            <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden text-xs">
              <div className="p-3 flex justify-between items-center bg-white">
                <span className="text-slate-600 font-medium">Review Submission Density</span>
                <span className="font-mono font-semibold text-slate-800">{totalReviews} direct peer audits</span>
              </div>
              <div className="p-3 flex justify-between items-center bg-white">
                <span className="text-slate-600 font-medium">Build Quality Verification</span>
                <span className="font-mono font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                  {parseFloat(avgRating) >= 4.0 ? 'Highly Recommended' : 'Under Review'}
                </span>
              </div>
              <div className="p-3 flex justify-between items-center bg-white">
                <span className="text-slate-600 font-medium">Estimated Asset Conversion</span>
                <span className="font-mono font-semibold text-slate-800">{completionRate} Engagement</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Dismiss Button */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            type="button" onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-all shadow-sm"
          >
            Close Report
          </button>
        </div>

      </div>
    </div>
  );
}