
import React from 'react';
import {
  Heart,
  MessageSquare,
  Star,
  ArrowUpRight,
} from 'lucide-react';

export default function ProjectCard({
  proj,
  isLiked,
  onLike,
  onOpenReviews,
}) {
  const likeCount = (proj.likes || 0) + (isLiked ? 1 : 0);

  return (
    <article
      onClick={onOpenReviews}
      className="group cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:border-slate-300 hover:shadow-sm"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-slate-100">
        <img
          src={proj.img}
          alt={proj.title}
          className="h-full w-full object-cover transition duration-200"
        />

        <div className="absolute inset-x-0 bottom-0 bg-blue-50 p-3">
          <span className="text-xs font-medium text-white">
            {proj.dept}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 text-base font-semibold text-slate-900">
            {proj.title}
          </h3>

          <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-blue-600" />
        </div>

        {/* Description */}
        <p className="mt-1.5 line-clamp-2 text-sm leading-5 text-slate-500">
          {proj.desc}
        </p>

        {/* Tags */}
        {proj.tags?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {proj.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600"
              >
                {tag}
              </span>
            ))}

            {proj.tags.length > 3 && (
              <span className="px-1 py-1 text-xs text-slate-400">
                +{proj.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          {/* Author */}
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-600">
              {proj.author?.charAt(0)?.toUpperCase()}
            </div>

            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-slate-700">
                {proj.author}
              </p>

              <p className="truncate text-[11px] text-slate-400">
                {proj.semester}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onLike?.(proj.id);
              }}
              className={`flex items-center gap-1.5 text-xs transition ${
                isLiked
                  ? 'text-rose-500'
                  : 'text-slate-400 hover:text-rose-500'
              }`}
              aria-label={isLiked ? 'Unlike project' : 'Like project'}
            >
              <Heart
                className="h-4 w-4"
                fill={isLiked ? 'currentColor' : 'none'}
              />
              {likeCount}
            </button>

            <span className="flex items-center gap-1.5 text-xs text-slate-400">
              <MessageSquare className="h-4 w-4" />
              {proj.comments || 0}
            </span>

            <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
              <Star
                className="h-4 w-4 fill-amber-400 text-amber-400"
              />
              {proj.rating || 0}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

