import { ArrowUpRight, Frown, MessageSquare, Smile, Star, ThumbsUp } from 'lucide-react';

import {
  averageRating,
  latestSemester,
  ratingLabel,
  sentimentCounts,
  shareOf,
} from '../../utils/review.js';

/**
 * The five headline numbers above the review table. Every figure is worked out
 * from the reviews the page holds, so the tiles never disagree with the table.
 */
export default function ReviewSummaryCards({ reviews = [] }) {
  const total = reviews.length;
  const average = averageRating(reviews);
  const counts = sentimentCounts(reviews);

  // "This semester" means the most recent term present in the list.
  const term = latestSemester(reviews);
  const addedThisTerm = reviews.filter((review) => review.semester === term).length;

  const tiles = [
    {
      key: 'total',
      label: 'Total Reviews',
      value: total,
      icon: MessageSquare,
      iconTone: 'border-emerald-100 bg-emerald-50 text-emerald-600',
      note: addedThisTerm
        ? `+${addedThisTerm} this semester`
        : 'No new reviews this semester',
      noteTone: addedThisTerm ? 'text-emerald-600' : 'text-slate-400',
      trend: addedThisTerm > 0,
    },
    {
      key: 'average',
      label: 'Average Rating',
      value: `${ratingLabel(average)} / 5`,
      icon: Star,
      iconTone: 'border-blue-100 bg-blue-50 text-blue-600',
      note: `Based on ${total} ${total === 1 ? 'review' : 'reviews'}`,
      noteTone: 'text-slate-500',
    },
    {
      key: 'positive',
      label: 'Positive Reviews',
      value: counts.Positive,
      icon: ThumbsUp,
      iconTone: 'border-emerald-100 bg-emerald-50 text-emerald-600',
      note: shareOf(counts.Positive, total),
      noteTone: 'text-slate-500',
    },
    {
      key: 'neutral',
      label: 'Neutral Reviews',
      value: counts.Neutral,
      icon: Smile,
      iconTone: 'border-amber-100 bg-amber-50 text-amber-600',
      note: shareOf(counts.Neutral, total),
      noteTone: 'text-slate-500',
    },
    {
      key: 'negative',
      label: 'Negative Reviews',
      value: counts.Negative,
      icon: Frown,
      iconTone: 'border-rose-100 bg-rose-50 text-rose-600',
      note: shareOf(counts.Negative, total),
      noteTone: 'text-slate-500',
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {tiles.map((tile) => {
        const Icon = tile.icon;

        return (
          <div key={tile.key} className="surface-card flex items-center gap-3 p-4">
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border ${tile.iconTone}`}
            >
              <Icon className="h-5 w-5" />
            </span>

            <div className="min-w-0">
              <p className="truncate text-[12px] text-slate-500">{tile.label}</p>

              <p className="text-[20px] font-semibold tracking-tight text-slate-900 tabular-nums">
                {tile.value}
              </p>

              <p
                className={`mt-0.5 flex items-center gap-1 text-[11.5px] ${tile.noteTone}`}
              >
                {tile.trend && <ArrowUpRight className="h-3 w-3 shrink-0" />}
                {tile.note}
              </p>
            </div>
          </div>
        );
      })}
    </section>
  );
}
