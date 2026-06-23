import React, { useState } from 'react';
import { X, Star } from 'lucide-react';

export const ReviewModal = ({ isOpen, onClose, projectTitle, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Review {projectTitle}</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        
        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} size={28} className={star <= rating ? "text-amber-400 fill-amber-400" : "text-gray-300"} 
                  onClick={() => setRating(star)} />
          ))}
        </div>
        
        <textarea 
          className="w-full border rounded-lg p-3 mb-4 text-sm" 
          placeholder="Share your thoughts..." 
          onChange={(e) => setComment(e.target.value)}
        />
        
        <button 
          onClick={() => onSubmit({ rating, comment })}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
        >
          Submit Review
        </button>
      </div>
    </div>
  );
};