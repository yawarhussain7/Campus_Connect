import { useState } from "react";

import { cx } from "../../lib/format";

const SIZES = {
  sm: "h-7 w-7 text-[10px]",
  md: "h-9 w-9 text-[11px]",
  lg: "h-11 w-11 text-[13px]",
};

/** Deterministic 1..70 so a record always gets the same portrait. */
function portraitIndex(seed) {
  let hash = 0;

  for (const char of String(seed)) {
    hash = (hash * 31 + char.charCodeAt(0)) % 70;
  }

  return hash + 1;
}

function portraitUrl(seed) {
  return `https://i.pravatar.cc/120?img=${portraitIndex(seed)}`;
}

/** Remote portrait with an initials fallback if the CDN is unreachable. */
export default function Avatar({ name, seed, size = "md", className }) {
  const [broken, setBroken] = useState(false);

  const initials = String(name || "?")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  if (broken) {
    return (
      <span
        className={cx(
          "inline-flex shrink-0 items-center justify-center rounded-full bg-slate-200 font-semibold text-slate-600",
          SIZES[size] ?? SIZES.md,
          className
        )}
      >
        {initials}
      </span>
    );
  }

  return (
    <img
      src={portraitUrl(seed || name)}
      alt={name || "Portrait"}
      loading="lazy"
      onError={() => setBroken(true)}
      className={cx(
        "shrink-0 rounded-full object-cover ring-1 ring-slate-200/80",
        SIZES[size] ?? SIZES.md,
        className
      )}
    />
  );
}
