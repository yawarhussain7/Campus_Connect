// src/components/teachers/WriteReviewModal.jsx
import React, { useState } from 'react';
import { X, Star, ShieldAlert, Send } from 'lucide-react';

export default function WriteReviewModal({ isOpen, onClose, teacher, onSubmitReview }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [courseTaken, setCourseTaken] = useState('');

  if (!isOpen || !teacher) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment || !courseTaken) {
      alert('Please fill out all auditing constraints.');
      return;
    }

    onSubmitReview({
      id: Date.now(),
      rating,
      comment,
      courseTaken,
      date: new Date().toLocaleDateString()
    });

    setComment('');
    setCourseTaken('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-scaleIn">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Write Review</h2>
            <p className="text-[10px] text-slate-400 mt-0.5">Rate: <span className="font-semibold text-slate-600">{teacher.name}</span></p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Anonymous Disclaimer */}
        <div className="bg-amber-50 border-b border-amber-100 px-4 py-2.5 flex items-center gap-2 text-amber-800 text-[10px] font-medium">
          <ShieldAlert className="h-3.5 w-3.5 text-amber-600 shrink-0" />
          <span>Your review is anonymous and will be shared across the student hub.</span>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          {/* Rating */}
          <div className="text-center py-3 bg-slate-50/80 border border-slate-200/60 rounded-xl">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Rating</label>
            <div className="flex items-center justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button" key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-all active:scale-90 focus:outline-none"
                >
                  <Star 
                    className={`h-7 w-7 transition-all duration-150 ${
                      star <= (hoverRating || rating) 
                        ? 'fill-amber-400 text-amber-400 scale-110' 
                        : 'text-slate-300 hover:text-slate-400'
                    }`} 
                  />
                </button>
              ))}
              <span className="ml-1 text-xs font-bold text-amber-500">{hoverRating || rating}/5</span>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Course *</label>
            <input 
              type="text" required value={courseTaken} onChange={(e) => setCourseTaken(e.target.value)}
              placeholder="e.g., Machine Learning Lab"
              className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Feedback *</label>
            <textarea 
              rows="3" required value={comment} onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with grading, teaching style, and course material..."
              className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 placeholder:text-slate-400 resize-none"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button" onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-200 transition-all duration-200 flex items-center gap-1.5"
            >
              <Send className="h-3 w-3" />
              Publish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}