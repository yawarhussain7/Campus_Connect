import { useState } from 'react';
import { Send, ShieldAlert, Star, X } from 'lucide-react';
import { toast } from 'react-toastify';

import ModernSelect from '../common/ModernSelect.jsx';
import { initialsOf } from '../../utils/review.js';

/**
 * Review composer. Opened from the page header (the teacher is picked inside the
 * form) or from a review row (the teacher arrives preselected).
 */
export default function WriteReviewModal({
  isOpen,
  onClose,
  teacher,
  teachers = [],
  campuses = [],
  onSubmitReview,
}) {
  if (!isOpen) return null;

  // Mounted only while open, so the form below always starts from a clean sheet.
  return (
    <ComposerForm
      teacher={teacher}
      teachers={teachers}
      campuses={campuses}
      onClose={onClose}
      onSubmitReview={onSubmitReview}
    />
  );
}

function ComposerForm({
  teacher,
  teachers,
  campuses,
  onClose,
  onSubmitReview,
}) {
  const [teacherName, setTeacherName] = useState(teacher?.name || '');
  const [course, setCourse] = useState('');
  const [campus, setCampus] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!teacherName) {
      toast.error('Pick the teacher you are reviewing');
      return;
    }

    if (!course.trim()) {
      toast.error('Add the course you took with them');
      return;
    }

    if (!campus) {
      toast.error('Pick the campus the course ran at');
      return;
    }

    if (!comment.trim()) {
      toast.error('Add a few words about the course');
      return;
    }

    onSubmitReview({
      teacherName,
      course: course.trim(),
      campus,
      rating,
      comment: comment.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-[14px] border border-slate-200 bg-white shadow-[0_12px_32px_rgba(15,23,42,0.10)]">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-[14px] font-semibold text-slate-900">
              Write a review
            </h2>

            <p className="mt-0.5 text-[11.5px] text-slate-400">
              {teacherName
                ? `Reviewing ${teacherName}`
                : 'Choose a teacher, the course and the campus.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close composer"
            className="rounded-[8px] p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* What the review is posted with, so the wording matches the Student
            column and the Student filter. */}
        <div className="flex items-center gap-2 border-b border-amber-100 bg-amber-50 px-5 py-2.5 text-[11.5px] text-amber-800">
          <ShieldAlert className="h-3.5 w-3.5 shrink-0 text-amber-600" />
          Posted under your name — your email is never shown.
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          {/* Rating */}
          <div className="rounded-[10px] border border-slate-200 bg-slate-50/70 py-3 text-center">
            <label className="mb-2 block text-[11px] font-medium text-slate-500">
              Rating
            </label>

            <div className="flex items-center justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  aria-label={`${star} ${star === 1 ? 'star' : 'stars'}`}
                  className="transition focus:outline-none"
                >
                  <Star
                    className={`h-6 w-6 transition-transform ${
                      star <= (hoverRating || rating)
                        ? 'scale-110 fill-amber-400 text-amber-400'
                        : 'text-slate-300 hover:text-slate-400'
                    }`}
                  />
                </button>
              ))}

              <span className="ml-1.5 text-[12.5px] font-medium text-amber-600 tabular-nums">
                {hoverRating || rating}/5
              </span>
            </div>
          </div>

          {/* Teacher */}
          <div>
            <label className="mb-1.5 block text-[11px] font-medium text-slate-500">
              Teacher <span className="text-rose-500">*</span>
            </label>

            {teacher ? (
              <div className="flex items-center gap-2.5 rounded-[10px] border border-slate-200 bg-slate-50/70 px-3 py-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-[11px] font-semibold text-slate-500">
                  {initialsOf(teacherName)}
                </span>

                <div>
                  <p className="text-[12.5px] font-medium text-slate-800">
                    {teacherName}
                  </p>

                  <p className="text-[11px] text-slate-400">
                    {teacher.role || 'Faculty'}
                  </p>
                </div>
              </div>
            ) : (
              /* Searchable: the picker lists the whole faculty directory. */
              <ModernSelect
                hideLabel
                searchable
                label="Teacher"
                value={teacherName}
                onChange={setTeacherName}
                options={teachers.map((item) => ({
                  value: item.name,
                  label: item.name,
                }))}
                placeholder="Select a teacher"
              />
            )}
          </div>

          {/* Course: typed rather than picked, so a course the reviews do not
              list yet can still be reviewed. */}
          <div>
            <label className="mb-1.5 block text-[11px] font-medium text-slate-500">
              Course <span className="text-rose-500">*</span>
            </label>

            <input
              type="text"
              value={course}
              onChange={(event) => setCourse(event.target.value)}
              maxLength={60}
              autoComplete="off"
              placeholder="Course code or name, e.g. CS305"
              className="h-10 w-full rounded-[10px] border border-slate-200 bg-slate-50/80 px-3.5 text-[12.5px] text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/15"
            />
          </div>

          {/* Campus */}
          <div>
            <label className="mb-1.5 block text-[11px] font-medium text-slate-500">
              Campus <span className="text-rose-500">*</span>
            </label>

            <ModernSelect
              hideLabel
              label="Campus"
              value={campus}
              onChange={setCampus}
              options={campuses.map((item) => ({ value: item, label: item }))}
              placeholder="Select a campus"
            />
          </div>

          {/* Feedback */}
          <div>
            <label className="mb-1.5 block text-[11px] font-medium text-slate-500">
              Feedback <span className="text-rose-500">*</span>
            </label>

            <textarea
              rows="3"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Say what helped and what you would change about the course..."
              className="w-full resize-none rounded-[10px] border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-[12.5px] text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/15"
            />
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 items-center rounded-[10px] border border-slate-200 px-3.5 text-[12.5px] font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex h-9 items-center gap-2 rounded-[10px] bg-blue-600 px-3.5 text-[12.5px] font-medium text-white transition hover:bg-blue-700"
            >
              <Send className="h-3.5 w-3.5" />
              Publish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

