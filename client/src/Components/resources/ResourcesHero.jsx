import { BookOpen, CloudUpload, Layers, Search, Sparkles } from 'lucide-react';
import resourceHero from '../../assets/resource-hero.svg';

const QUICK_FILTERS = [
  'Data Structures',
  'Object Oriented Programming',
  'Final Exam Papers',
  'Operating Systems',
  'Calculus',
];

export default function ResourcesHero({ query, onQueryChange, onSubmit, total }) {
  return (
    <section className="relative overflow-hidden border-b border-slate-200/80 bg-[#f8fafc]">
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:px-8">
        <div className="space-y-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-700 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Verified Campus Repository
          </span>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl leading-tight">
            Explore. Download. <span className="text-blue-600">Succeed.</span>
          </h1>

          <p className="max-w-xl text-sm sm:text-base leading-relaxed text-slate-600">
            Notes, terminal past papers, assignments, and projects shared by students across
            every department. Search the library and grab exactly what your semester needs.
          </p>

          {/* Search bar */}
          <form
            onSubmit={(event) => {
              event.preventDefault();
              onSubmit?.();
            }}
            className="flex w-full max-w-xl items-center gap-2 rounded-2xl border border-slate-300 bg-white p-2 shadow-sm focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100 transition"
          >
            <Search className="ml-2 h-5 w-5 shrink-0 text-slate-400" />

            <input
              id="resources-search"
              type="search"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Search by course, title, semester, or subject..."
              className="min-w-0 flex-1 bg-transparent py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400"
            />

            <button
              type="submit"
              className="shrink-0 rounded-xl bg-blue-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
            >
              Search
            </button>
          </form>

          {/* Quick topic tags */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium">Popular searches:</span>
            {QUICK_FILTERS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  onQueryChange(tag);
                  onSubmit?.();
                }}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition"
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs text-slate-500 font-medium">
            <span className="inline-flex items-center gap-2">
              <Layers className="h-4 w-4 text-blue-600" />
              {total}+ resources catalogued
            </span>

            <span className="inline-flex items-center gap-2">
              <CloudUpload className="h-4 w-4 text-emerald-600" />
              Free student downloads
            </span>

            <span className="inline-flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-amber-500" />
              Updated every semester session
            </span>
          </div>
        </div>

        {/* Right Illustration */}
        <div className="relative mx-auto w-full max-w-[380px]">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md">
            <img
              src={resourceHero}
              alt="Stack of study books topped with a graduation cap"
              className="w-full select-none"
              draggable="false"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
