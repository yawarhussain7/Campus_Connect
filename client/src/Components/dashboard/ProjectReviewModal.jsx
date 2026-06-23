// src/components/ProjectReviewModal.jsx
import React, { useState } from 'react';
import { X, Star, MessageSquare, Send, User, Calendar } from 'lucide-react';

export default function ProjectReviewModal({ proj, onClose, onAddReview, reviews = [] }) {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);

  if (!proj) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    onAddReview(proj.id, {
      id: Date.now(),
      author: 'Current Student',
      rating,
      text: comment,
      date: 'Just now'
    });
    setComment('');
    setRating(5);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-scaleIn overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-2">
            <div className="px-2.5 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[10px] font-semibold rounded-lg shadow-sm">
              {proj.dept}
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Registry</span>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Project Details */}
          <div className="flex flex-col sm:flex-row gap-5">
            <div className="relative w-full sm:w-48 h-36 shrink-0 rounded-xl overflow-hidden border border-slate-200/60 shadow-sm">
              <img 
                src={proj.img} 
                alt={proj.title} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 leading-snug">{proj.title}</h2>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{proj.desc}</p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1 text-[11px] font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md border border-slate-200/60">
                  <User className="h-3 w-3" />
                  {proj.author}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">{proj.uni} · {proj.semester}</span>
              </div>
              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {proj.tags?.map((tag, i) => (
                  <span key={i} className="text-[9px] font-medium bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md border border-indigo-100">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Reviews */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <div className="p-1 bg-slate-100 rounded-lg">
                <MessageSquare className="h-4 w-4 text-slate-500" />
              </div>
              <span>Peer Reviews ({reviews.length})</span>
            </h3>
            
            {reviews.length === 0 ? (
              <div className="text-center py-8 bg-slate-50/80 rounded-xl border border-dashed border-slate-200">
                <MessageSquare className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-400">No peer evaluations submitted yet.</p>
                <p className="text-[11px] text-slate-300 mt-0.5">Be the first to verify this asset!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div key={rev.id} className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/60 space-y-2 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[9px] text-white font-bold">
                          {rev.author.charAt(0)}
                        </div>
                        <span className="font-bold text-xs text-slate-800">{rev.author}</span>
                      </div>
                      <span className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                        <Calendar className="h-3 w-3" />
                        {rev.date}
                      </span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                      ))}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{rev.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Review Form */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-slate-100 bg-gradient-to-r from-slate-50 to-white space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">Your Rating:</span>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => {
                const starVal = i + 1;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRating(starVal)}
                    onMouseEnter={() => setHoverRating(starVal)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-0.5 transition-transform active:scale-90 focus:outline-none"
                  >
                    <Star 
                      className={`h-5 w-5 transition-all duration-150 ${
                        starVal <= (hoverRating || rating) 
                          ? 'fill-amber-400 text-amber-400 scale-110' 
                          : 'text-slate-300 hover:text-slate-400'
                      }`} 
                    />
                  </button>
                );
              })}
              <span className="ml-1 text-xs font-bold text-amber-500">{hoverRating || rating}/5</span>
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your feedback on this project..."
              className="w-full bg-white border border-slate-200/80 rounded-xl pl-4 pr-14 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm text-slate-700 placeholder:text-slate-400 transition-all"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 active:scale-95 transition-all duration-200 shadow-sm"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}