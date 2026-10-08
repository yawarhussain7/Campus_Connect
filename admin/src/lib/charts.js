// Dependency-free maths shared by the dashboard's SVG charts — the admin panel
// ships no charting library, so every graph is hand-built from these helpers.

export const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/**
 * The last `count` calendar months, oldest first, as
 * `{ key: "2026-10", label: "Oct", year: 2026 }` — the same bucket shape the
 * signup chart builds inline, so every monthly graph on the dashboard lines up.
 */
export function monthWindow(count = 6) {
  const months = [];
  const now = new Date();

  for (let offset = count - 1; offset >= 0; offset -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - offset, 1);

    months.push({
      key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
      label: MONTH_LABELS[date.getMonth()],
      year: date.getFullYear(),
    });
  }

  return months;
}

/** An ISO timestamp or "YYYY-MM-DD" -> "YYYY-MM", the month it belongs to. */
export function monthKeyOf(value) {
  return String(value || "").slice(0, 7);
}

/**
 * Whole-number Y-axis bounds for a dataset whose largest value is `max`:
 * the smallest "nice" step (1, 2, 5, 10, 20, ...) that keeps the scale at
 * roughly four ticks, so gridline labels never show fractions of a record.
 *
 * Returns `{ ceiling, ticks }` where `ticks` always starts at 0 and ends at
 * `ceiling`.
 */
export function niceScale(max) {
  const top = Math.max(Math.ceil(max), 1);
  const raw = top / 4;
  const step = raw <= 1 ? 1 : raw <= 2 ? 2 : raw <= 5 ? 5 : raw <= 10 ? 10 : Math.ceil(raw);
  const ceiling = Math.max(Math.ceil(top / step) * step, step * 2);

  const ticks = [];
  for (let value = 0; value <= ceiling; value += step) ticks.push(value);

  return { ceiling, ticks };
}

/**
 * A smooth line through `points` using horizontal-midpoint control points.
 * The curve is monotone in x (control points sit between the two endpoints),
 * so it never overshoots a month's actual value the way a plain bezier can.
 */
export function smoothPath(points) {
  if (points.length === 0) return "";
  if (points.length === 1) return `M${points[0].x},${points[0].y}`;

  let path = `M${points[0].x},${points[0].y}`;

  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    const mid = (previous.x + current.x) / 2;

    path += ` C${mid},${previous.y} ${mid},${current.y} ${current.x},${current.y}`;
  }

  return path;
}

/** The same curve closed down to `baseline` — the gradient fill under a line. */
export function areaPath(points, baseline) {
  if (points.length === 0) return "";

  const first = points[0];
  const last = points[points.length - 1];

  return `${smoothPath(points)} L${last.x},${baseline} L${first.x},${baseline} Z`;
}
