import { cx } from "../../lib/format";

const TONES = {
  indigo: "bg-indigo-50 text-indigo-600",
  info: "bg-sky-50 text-sky-600",
  emerald: "bg-emerald-50 text-emerald-600",
  violet: "bg-violet-50 text-violet-600",
  amber: "bg-amber-50 text-amber-600",
  rose: "bg-rose-50 text-rose-600",
};

/**
 * The head of every page: a tinted icon tile, the title and one line of context,
 * with the primary action pinned to the right.
 */
export default function PageHeader({ icon: Icon, title, description, action, tone = "indigo" }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-4">
        {Icon ? (
          <span
            className={cx(
              "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl",
              TONES[tone] ?? TONES.indigo
            )}
          >
            <Icon size={24} strokeWidth={1.9} />
          </span>
        ) : null}

        <div className="min-w-0">
          <h1 className="truncate text-[26px] font-semibold leading-tight tracking-tight text-slate-900">
            {title}
          </h1>

          {description ? (
            <p className="mt-1 text-[13.5px] text-slate-500">{description}</p>
          ) : null}
        </div>
      </div>

      {action ? (
        <div className="flex flex-wrap items-center gap-2">{action}</div>
      ) : null}
    </div>
  );
}
