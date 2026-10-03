import { BookOpen, CloudUpload, Layers, Search, Sparkles } from 'lucide-react';

import resourceHero from '../../assets/resource-hero.svg';

/**
 * Hero for the public resource library: headline, the one prominent search
 * field of the page (`#resources-search`, which the navbar focuses), and the
 * study illustration taken from `src/assets` with a few floating accents.
 */
export default function ResourcesHero({ query, onQueryChange, onSubmit, total }) {
  return (
    <section className="relative overflow-hidden border-b border-slate-100 bg-[#f6f9ff]">
      {/* Soft gradient blooms behind the content. */}
      <div className="pointer-events-none absolute -left-24 -top-28 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)]">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3.5 py-1.5 text-[12px] font-semibold text-blue-700 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Study Smarter
          </span>

          <h1 className="mt-5 text-[32px] font-extrabold leading-[1.12] tracking-tight text-slate-900 sm:text-[44px]">
            Explore. Download.{' '}
            <span className="gradient-text">Succeed.</span>
          </h1>

          <p className="mt-4 max-w-xl text-[14.5px] leading-relaxed text-slate-500">
            Notes, past papers, assignments and projects shared by students across
            every department. Search the library and grab exactly what your semester
            needs.
          </p>

          {/* The page's primary search. Also the target of the navbar search icon. */}
          <form
            onSubmit={(event) => {
              event.preventDefault();
              onSubmit?.();
            }}
            className="mt-7 flex w-full max-w-xl items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-100"
          >
            <Search className="ml-2 h-[18px] w-[18px] shrink-0 text-slate-400" />

            <label htmlFor="resources-search" className="sr-only">
              Search resources
            </label>

            <input
              id="resources-search"
              type="search"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Search notes, past papers, subjects..."
              className="min-w-0 flex-1 bg-transparent py-2 text-[14px] text-slate-800 outline-none placeholder:text-slate-400"
            />

            <button
              type="submit"
              className="shrink-0 rounded-xl bg-blue-600 px-5 py-2.5 text-[13.5px] font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              Search
            </button>
          </form>

          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-[12.5px] text-slate-500">
            <span className="inline-flex items-center gap-2">
              <Layers className="h-4 w-4 text-blue-500" />
              {total}+ resources
            </span>

            <span className="inline-flex items-center gap-2">
              <CloudUpload className="h-4 w-4 text-emerald-500" />
              Free to download
            </span>

            <span className="inline-flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-amber-500" />
              Updated every semester
            </span>
          </div>
        </div>

        {/* Illustration from the assets folder, with floating accents around it. */}
        <div className="relative mx-auto w-full max-w-[420px]">
          <img
            src={resourceHero}
            alt="Stack of study books topped with a graduation cap"
            className="w-full select-none"
            draggable="false"
          />

          <span className="animate-float absolute -left-2 top-4 flex h-11 w-11 items-center justify-center rounded-[13px] border border-blue-100 bg-white text-blue-600 shadow-md">
            <BookOpen className="h-5 w-5" />
          </span>

          <span
            className="animate-float absolute right-0 top-16 flex h-11 w-11 items-center justify-center rounded-[13px] border border-amber-100 bg-white text-amber-500 shadow-md"
            style={{ animationDelay: '0.6s' }}
          >
            <Layers className="h-5 w-5" />
          </span>

          <span
            className="animate-float absolute bottom-10 left-6 flex h-11 w-11 items-center justify-center rounded-[13px] border border-emerald-100 bg-white text-emerald-600 shadow-md"
            style={{ animationDelay: '1.2s' }}
          >
            <CloudUpload className="h-5 w-5" />
          </span>
        </div>
      </div>
    </section>
  );
}
