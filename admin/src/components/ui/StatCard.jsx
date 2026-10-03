import { cx } from "../../lib/format";

const TONES = {
  neutral: "bg-slate-100 text-slate-600",
  indigo: "bg-indigo-50 text-indigo-600",
  info: "bg-sky-50 text-sky-600",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  violet: "bg-violet-50 text-violet-600",
  rose: "bg-rose-50 text-rose-600",
};

/**
 * Circular tinted icon on the left, label over the value on the right.
 *
 * Passing `onClick` turns the card into a filter shortcut: it lifts on hover and
 * keeps an indigo ring while it is the active filter.
 */
export default function StatCard({
  label,
  value,
  meta,
  icon: Icon,
  tone = "indigo",
  active = false,
  onClick,
}) {
  const Wrapper = onClick ? "button" : "div";

  return (
    <Wrapper
      type={onClick ? "button" : undefined}
      onClick={onClick}
      aria-pressed={onClick ? active : undefined}
      title={onClick ? `Show ${label.toLowerCase()}` : undefined}
      className={cx(
        "flex w-full items-center gap-4 rounded-xl border bg-white p-5 text-left transition",
        onClick
          ? "cursor-pointer hover:-translate-y-px hover:shadow-md hover:shadow-slate-900/5"
          : "hover:shadow-sm",
        active ? "border-indigo-300 ring-2 ring-indigo-100" : "border-slate-200"
      )}
    >
      {Icon ? (
        <span
          className={cx(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
            TONES[tone] ?? TONES.indigo
          )}
        >
          <Icon size={21} strokeWidth={2} />
        </span>
      ) : null}

      <div className="min-w-0">
        <p className="truncate text-[13px] font-medium text-slate-500">{label}</p>

        <p className="mt-0.5 text-[26px] font-semibold leading-tight tracking-tight text-slate-900">
          {value}
        </p>

        {meta ? (
          <p className="mt-0.5 truncate text-[12px] text-slate-400">{meta}</p>
        ) : null}
      </div>
    </Wrapper>
  );
}

