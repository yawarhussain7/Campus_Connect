import { useState } from 'react';

/**
 * Face images are pulled from the internet (pravatar). If the request fails -
 * offline, blocked network, slow connection - we fall back to the uploader's
 * initials on a tinted disc, so a card never shows a broken image.
 */
const TINTS = [
  'bg-blue-100 text-blue-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-violet-100 text-violet-700',
];

const initialsOf = (name) =>
  String(name || '?')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

const tintOf = (name) =>
  TINTS[
    [...String(name || '')].reduce((total, char) => total + char.charCodeAt(0), 0) %
      TINTS.length
  ];

export default function ResourceAvatar({ name, src, size = 32, className = '' }) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;

  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size }}
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full ring-2 ring-white ${
        showImage ? 'bg-slate-100' : tintOf(name)
      } ${className}`}
    >
      {showImage ? (
        <img
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="text-[10.5px] font-bold leading-none">{initialsOf(name)}</span>
      )}
    </span>
  );
}
