import { useState } from "react";

import { cx } from "../../lib/format";

/** Deterministic cover image per record id, with a flat fallback. */
export default function Cover({ seed, className }) {
  const [broken, setBroken] = useState(false);

  if (broken) {
    return (
      <div
        className={cx(
          "bg-gradient-to-br from-indigo-100 via-slate-100 to-slate-200",
          className
        )}
      />
    );
  }

  return (
    <img
      src={`https://picsum.photos/seed/${encodeURIComponent(seed)}/640/360`}
      alt=""
      loading="lazy"
      onError={() => setBroken(true)}
      className={cx("object-cover", className)}
    />
  );
}
