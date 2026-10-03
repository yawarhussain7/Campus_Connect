import { useState } from 'react';
import { ExternalLink, PenLine, Star, X } from 'lucide-react';

import { formatMediumDate } from '../../utils/date.js';
import { affiliationOf, campusOf } from '../../utils/teacher.js';
import {
  averageRating,
  courseLabelOf,
  initialsOf,
  ratingBreakdown,
  ratingLabel,
  sentimentOf,
  sentimentTone,
  starSlots,
  voteShare,
} from '../../utils/review.js';

/**
 * Every review a teacher has, opened from the View all button in the table.
 *
 * The table keeps a single row per teacher, so this modal is where the
 * individual reviews are read: the teacher's overall standing on top, then one
 * card per student review, newest first.
 */
export default function ReviewDetailModal({
  review,
  reviews = [],
  onClose,
  onWriteReview,
}) {
  const [imageFailed, setImageFailed] = useState(false);

  if (!review) return null;

  // The page hands in its whole list so the modal can show the teacher's full
  // standing; the reviews the folded row carried are the fallback. Filters
  // deliberately do not narrow it.
  const source = reviews.length ? reviews : review.reviews || [];
  const teacherKey = String(review.teacher || '').trim().toLowerCase();
  // Newest first, so the reviews inside the modal read in the order the table's
  // "Latest review" column promises.
  const teacherReviews = source
    .filter(
      (item) => String(item.teacher || '').trim().toLowerCase() === teacherKey
    )
    .sort(
      (a, b) => (Date.parse(b.createdAt) || 0) - (Date.parse(a.createdAt) || 0)
    );

  // The newest row fills in whatever the folded row did not carry itself.
  const latest = teacherReviews[0] || review.reviews?.[0] || review;

  const teacher = {
    name: review.teacher || latest.teacher || 'Unknown teacher',
    role: review.teacherRole || latest.teacherRole || 'Faculty',
    avatar: review.teacherAvatar || latest.teacherAvatar || '',
    profileUrl: review.teacherProfileUrl || latest.teacherProfileUrl || '',
  };

  const votes = teacherReviews.length;
  const average = averageRating(teacherReviews);
  const breakdown = ratingBreakdown(teacherReviews);
  const sentiment =
    votes === 1
      ? sentimentOf(teacherReviews[0])
      : review.sentiment || sentimentOf({ rating: average });

  const showPhoto = Boolean(teacher.avatar) && !imageFailed;
  // Department and campus arrive from the faculty directory when the teacher is
  // in it, otherwise from the campus the reviews themselves carry.
  const affiliation = affiliationOf({
    department: review.teacherDepartment || latest.teacherDepartment,
    campus: campusOf(review) || campusOf(latest),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-[14px] border border-slate-200 bg-white shadow-[0_12px_32px_rgba(15,23,42,0.10)]">
        {/* Header: the teacher, and how much feedback they hold */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            {showPhoto ? (
              <img
                src={teacher.avatar}
                alt={teacher.name}
                onError={() => setImageFailed(true)}
                className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-slate-200"
              />
            ) : (
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-[12px] font-semibold text-slate-500">
                {initialsOf(teacher.name)}
              </span>
            )}

            <div className="min-w-0">
              <h2 className="truncate text-[14px] font-semibold text-slate-900">
                {teacher.name}
              </h2>

              <p className="mt-0.5 text-[11.5px] text-slate-400">
                {teacher.role}
                {affiliation ? ` · ${affiliation}` : ''} · {votes}{' '}
                {votes === 1 ? 'review' : 'reviews'}
              </p>

              {teacher.profileUrl && (
                <a
                  href={teacher.profileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-flex items-center gap-1 text-[11.5px] font-medium text-blue-600 transition hover:text-blue-700"
                >
                  Faculty profile
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close reviews"
            className="rounded-[8px] p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body: the teacher's standing first, then every review they hold */}
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
          {/* Average rating and the overall verdict */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[10px] border border-slate-200 bg-slate-50/70 px-3.5 py-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-0.5">
                {starSlots(average).map((filled, index) => (
                  <Star
                    key={index}
                    aria-hidden="true"
                    className={`h-4 w-4 ${
                      filled ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                    }`}
                  />
                ))}
              </span>

              <span className="text-[12.5px] font-medium text-slate-700 tabular-nums">
                {ratingLabel(average)} / 5
              </span>
            </div>

            <span
              className={`inline-flex whitespace-nowrap rounded-md px-2 py-[3px] text-[11px] font-medium ${sentimentTone(
                { sentiment }
              )}`}
            >
              {sentiment}
            </span>
          </div>

          {/* Every vote this teacher has, one row per star. */}
          <div className="rounded-[10px] border border-slate-200 px-3.5 py-3">
            <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-2">
              <p className="text-[11px] font-medium text-slate-500">
                Rating breakdown
              </p>

              <p className="text-[11px] text-slate-400 tabular-nums">
                {votes} {votes === 1 ? 'vote' : 'votes'}
                {votes > 0 && ` · ${ratingLabel(average)} / 5`}
              </p>
            </div>

            <div className="space-y-1.5">
              {breakdown.map(({ stars, count }) => {
                const share = voteShare(count, votes);

                return (
                  <div key={stars} className="flex items-center gap-2">
                    <span className="flex w-7 shrink-0 items-center justify-end gap-0.5 text-[11px] font-medium text-slate-600 tabular-nums">
                      {stars}
                      <Star
                        aria-hidden="true"
                        className="h-2.5 w-2.5 fill-amber-400 text-amber-400"
                      />
                    </span>

                    <span className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <span
                        className="block h-full rounded-full bg-amber-400"
                        style={{ width: `${share}%` }}
                      />
                    </span>

                    <span className="w-6 shrink-0 text-right text-[11px] text-slate-600 tabular-nums">
                      {count}
                    </span>

                    <span className="w-9 shrink-0 text-right text-[11px] text-slate-400 tabular-nums">
                      {share}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Every student's review, so the whole row reads in one place. */}
          <div className="space-y-2.5">
            <p className="text-[11px] font-medium text-slate-500">
              {votes === 1 ? '1 student review' : `${votes} student reviews`}
            </p>

            {teacherReviews.length === 0 ? (
              <p className="rounded-[10px] border border-slate-200 px-3.5 py-3 text-[12.5px] text-slate-400">
                No reviews have been written for this teacher yet.
              </p>
            ) : (
              teacherReviews.map((item) => (
                <ReviewCard key={item.id} review={item} />
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-5 py-3.5">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 items-center rounded-[10px] border border-slate-200 px-3.5 text-[12.5px] font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            Close
          </button>

          <button
            type="button"
            onClick={() => onWriteReview?.(review)}
            className="inline-flex h-9 items-center gap-2 rounded-[10px] bg-blue-600 px-3.5 text-[12.5px] font-medium text-white transition hover:bg-blue-700"
          >
            <PenLine className="h-4 w-4" />
            Write a review
          </button>
        </div>
      </div>
    </div>
  );
}

/** One student's review: who wrote it, for which course, and what they said. */
function ReviewCard({ review }) {
  return (
    <article className="rounded-[10px] border border-slate-200 px-3.5 py-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[12.5px] font-medium text-slate-800">
            {review.student || 'Anonymous'}
          </p>

          <p className="mt-0.5 text-[11px] text-slate-400 tabular-nums">
            {formatMediumDate(review.createdAt)}
            {review.semester ? ` · ${review.semester}` : ''}
            {` · ${courseLabelOf(review)}`}
          </p>
        </div>

        <span
          className={`inline-flex whitespace-nowrap rounded-md px-2 py-[3px] text-[11px] font-medium ${sentimentTone(
            review
          )}`}
        >
          {sentimentOf(review)}
        </span>
      </div>

      {/* Each student's own rating, right above the comment they wrote. */}
      <div
        className="mt-2 flex items-center gap-2"
        title={`${ratingLabel(review.rating)} out of 5`}
      >
        <span className="flex items-center gap-0.5">
          {starSlots(review.rating).map((filled, index) => (
            <Star
              key={index}
              aria-hidden="true"
              className={`h-4 w-4 ${
                filled ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
              }`}
            />
          ))}
        </span>

        <span className="text-[11.5px] font-medium text-slate-700 tabular-nums">
          {ratingLabel(review.rating)} / 5
        </span>
      </div>

      <p className="mt-1.5 text-[12.5px] leading-6 text-slate-600">
        {review.comment || 'No written feedback'}
      </p>
    </article>
  );
}
