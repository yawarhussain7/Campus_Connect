import { cx } from "../../lib/format";

const CONTROL =
  "w-full rounded-md border bg-white px-3 text-[13px] text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2";

function controlClasses(invalid) {
  return invalid
    ? "border-red-300 focus:border-red-400 focus:ring-red-100"
    : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100";
}

export function Field({ label, htmlFor, error, hint, required, className, children }) {
  return (
    <div className={cx("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-[12.5px] font-medium text-slate-700">
        {label}
        {required ? <span className="ml-0.5 text-red-500">*</span> : null}
      </label>

      {children}

      {error ? (
        <p className="text-[11.5px] leading-4 text-red-600">{error}</p>
      ) : hint ? (
        <p className="text-[11.5px] leading-4 text-slate-400">{hint}</p>
      ) : null}
    </div>
  );
}

export function Input({ invalid, className, ...props }) {
  return (
    <input
      className={cx(CONTROL, "h-9", controlClasses(invalid), className)}
      {...props}
    />
  );
}

export function Select({ invalid, className, children, ...props }) {
  return (
    <select
      className={cx(CONTROL, "h-9 cursor-pointer pr-8", controlClasses(invalid), className)}
      {...props}
    >
      {children}
    </select>
  );
}

export function Textarea({ invalid, className, rows = 3, ...props }) {
  return (
    <textarea
      rows={rows}
      className={cx(CONTROL, "py-2 leading-5", controlClasses(invalid), className)}
      {...props}
    />
  );
}

/** A checkbox with the label to its right, for the boolean fields. */
export function Checkbox({ label, id, className, ...props }) {
  return (
    <label
      htmlFor={id}
      className={cx(
        "inline-flex cursor-pointer items-center gap-2 text-[13px] text-slate-700",
        className
      )}
    >
      <input
        id={id}
        type="checkbox"
        className="h-4 w-4 cursor-pointer rounded border-slate-300 text-indigo-600 focus:ring-2 focus:ring-indigo-100"
        {...props}
      />
      {label}
    </label>
  );
}
