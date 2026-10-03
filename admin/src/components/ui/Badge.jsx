import { cx } from "../../lib/format";

/** Tinted pills without a dot — the shape used by every table in the console. */
const TONES = {
  neutral: "bg-slate-100 text-slate-600",
  info: "bg-sky-50 text-sky-700",
  indigo: "bg-indigo-50 text-indigo-700",
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-red-50 text-red-600",
  violet: "bg-violet-50 text-violet-700",
  teal: "bg-teal-50 text-teal-700",
  rose: "bg-rose-50 text-rose-600",
};

export function Badge({ tone = "neutral", className, children }) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11.5px] font-medium",
        TONES[tone] ?? TONES.neutral,
        className
      )}
    >
      {children}
    </span>
  );
}

/** The statuses the API stores map straight onto a tone. */
const STATUS_TONES = {
  Pending: "warning",
  Submitted: "success",
  Overdue: "danger",
};

export function StatusBadge({ status }) {
  return <Badge tone={STATUS_TONES[status] ?? "neutral"}>{status || "—"}</Badge>;
}

/** Course / subject pills, kept tidy in a narrow table column. */
const TAG_TONES = ["info", "violet", "teal", "indigo", "rose", "warning"];

/**
 * Picks a tone from the label itself, so "MERN Stack" is always the same colour
 * on every screen without anyone having to curate a mapping.
 */
function tagTone(value) {
  let hash = 0;

  for (const char of String(value)) {
    hash = (hash * 31 + char.charCodeAt(0)) % 997;
  }

  return TAG_TONES[hash % TAG_TONES.length];
}

export function Tag({ children, className }) {
  const label = String(children ?? "").trim();

  if (!label) return <span className="text-slate-400">—</span>;

  return (
    <Badge tone={tagTone(label)} className={className}>
      {label}
    </Badge>
  );
}
