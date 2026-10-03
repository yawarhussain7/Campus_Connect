// Small, dependency-free formatters shared by every admin surface.

/** Joins conditional class names, dropping anything falsy. */
export function cx(...values) {
  return values.filter(Boolean).join(" ");
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/**
 * "2025-05-05" -> "5 May 2025".
 *
 * The API stores deadlines as plain calendar days, so the string is parsed by
 * hand: running it through `new Date()` would shift the day for anyone west of
 * Greenwich.
 */
export function formatDay(value) {
  if (!value) return "—";

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value));

  if (!match) return String(value);

  const [, year, month, day] = match;

  return `${Number(day)} ${MONTHS[Number(month) - 1] ?? month} ${year}`;
}

/** A plain calendar day or an ISO timestamp -> "5 May 2025". */
export function formatDate(value) {
  if (!value) return "—";

  return formatDay(String(value).slice(0, 10));
}


/** ISO timestamp -> "5 May 2025, 14:03". */
export function formatTimestamp(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  const day = `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
  const time = `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes()
  ).padStart(2, "0")}`;

  return `${day}, ${time}`;
}

/** "just now" / "3 h ago" / "2 d ago", falling back to the plain date. */
export function relativeTime(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  const seconds = Math.round((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} d ago`;

  return formatDay(date.toISOString().slice(0, 10));
}

/** Mean of the numeric values in `list`, rounded to one decimal place. */
export function averageRating(list) {
  const values = list
    .map((item) => Number(item))
    .filter((value) => Number.isFinite(value));

  if (values.length === 0) return 0;

  const total = values.reduce((sum, value) => sum + value, 0);

  return Math.round((total / values.length) * 10) / 10;
}
