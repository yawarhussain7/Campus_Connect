import { BookOpenCheck } from 'lucide-react';

export default function ContentCheckLoader({ title }) {
  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/35 p-4 backdrop-blur-sm"
      role="status"
      aria-live="polite"
      aria-label={title}
    >
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white px-7 py-8 text-center shadow-2xl shadow-slate-950/20">
        <div className="relative mx-auto grid h-20 w-20 place-items-center">
          <span className="absolute inset-0 rounded-full border border-blue-100" />
          <span className="absolute inset-1 rounded-full border-[3px] border-transparent border-t-blue-600 animate-spin" />
          <span className="absolute inset-3 rounded-full border-2 border-transparent border-b-emerald-500 animate-[spin_1.4s_linear_infinite_reverse]" />
          <BookOpenCheck className="h-7 w-7 text-slate-700" strokeWidth={1.8} />
        </div>

        <h2 className="mt-5 text-base font-semibold text-slate-900">{title}</h2>
        <p className="mt-1.5 text-sm leading-5 text-slate-500">
          Checking the file content and subject relevance.
        </p>

        <div className="mt-5 flex justify-center gap-1.5" aria-hidden="true">
          <span className="h-1 w-8 rounded-full bg-blue-600 animate-pulse" />
          <span className="h-1 w-8 rounded-full bg-emerald-500 animate-pulse [animation-delay:150ms]" />
          <span className="h-1 w-8 rounded-full bg-slate-300 animate-pulse [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}