import { cx } from "../../lib/format";

const VARIANTS = {
  primary: "bg-indigo-600 text-white hover:bg-indigo-700",
  secondary: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
  danger: "bg-red-600 text-white hover:bg-red-700",
  ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
};

const SIZES = {
  sm: "h-8 gap-1.5 px-2.5 text-[12.5px]",
  md: "h-10 gap-2 px-4 text-[13.5px]",
};

export default function Button({
  variant = "primary",
  size = "md",
  icon: Icon,
  className,
  children,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={cx(
        "inline-flex shrink-0 items-center justify-center rounded-lg font-medium",
        "transition-colors focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-indigo-500/40 focus-visible:ring-offset-1",
        "disabled:cursor-not-allowed disabled:opacity-60",
        VARIANTS[variant] ?? VARIANTS.primary,
        SIZES[size] ?? SIZES.md,
        className
      )}
      {...props}
    >
      {Icon ? <Icon size={size === "sm" ? 14 : 15} strokeWidth={2} /> : null}

      {children}
    </button>
  );
}

/** Square, icon-only button used for the table row actions. */
export function IconButton({ label, tone = "neutral", icon: Icon, className, ...props }) {
  const tones = {
    neutral: "text-slate-500 hover:bg-slate-100 hover:text-slate-800",
    danger: "text-slate-500 hover:bg-red-50 hover:text-red-600",
  };

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cx(
        "inline-flex h-7 w-7 items-center justify-center rounded-lg",
        "transition-colors focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-indigo-500/40",
        tones[tone] ?? tones.neutral,
        className
      )}
      {...props}
    >
      <Icon size={15} strokeWidth={1.9} />
    </button>
  );
}
