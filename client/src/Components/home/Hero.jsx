import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Search, Sparkles, Star, Users } from 'lucide-react';

import heroImage from '../../assets/bg.png';
import { useAppContext } from '../../context/AppContext';

/** Quick-search shortcuts shown under the search field. */
const POPULAR_SEARCHES = ['Past Papers', 'Notes', 'Assignments', 'Projects'];

/** Small trust figures pinned to the illustration. */
const HERO_STATS = [
  { icon: BookOpen, value: '12k+', label: 'Resources' },
  { icon: Users, value: '3.5k+', label: 'Students' },
];

const RATING_STARS = [0, 1, 2, 3, 4];

/**
 * Landing hero: gradient blooms, a two-tone headline, the resource search that
 * doubles as the guest sign-in gate, primary calls to action, and the study
 * illustration with two floating trust cards.
 */
const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAppContext();

  const [query, setQuery] = useState('');

  const openLibrary = () => {
    navigate(user ? '/student/dashboard' : '/auth/signIn');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    openLibrary();
  };

  const handleShortcut = (term) => {
    setQuery(term);
    openLibrary();
  };

  return (
    <section id="home" className="relative scroll-mt-20 overflow-hidden bg-[#f6f9ff]">
      {/* Soft gradient blooms behind the content. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-[380px] w-[380px] rounded-full bg-blue-200/40 blur-[110px]" />
        <div className="absolute -right-16 top-8 h-[360px] w-[360px] rounded-full bg-indigo-200/40 blur-[110px]" />
        <div className="absolute bottom-0 left-1/3 h-[280px] w-[280px] rounded-full bg-sky-200/30 blur-[110px]" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-14 sm:px-8 lg:grid-cols-2 lg:gap-8 lg:pb-20 lg:pt-20">
        <div className="max-w-xl animate-fadeInUp">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-3.5 py-1.5 text-[12.5px] font-semibold text-blue-700 shadow-sm backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            Built for Students, by Students
          </span>

          <h1 className="mt-6 text-[40px] font-extrabold leading-[1.05] tracking-tight text-slate-900 sm:text-[54px]">
            Share. Learn. Grow.
            <span className="gradient-text block">Together.</span>
          </h1>

          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-slate-500">
            Join our student community to access and share notes, projects, past papers and
            assignments. Make your study journey easier, faster and more productive.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 pl-4 shadow-[0_18px_40px_-24px_rgba(37,99,235,0.55)] transition focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/10"
          >
            <Search className="h-[18px] w-[18px] shrink-0 text-slate-400" />

            <input
              id="landing-search"
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search notes, projects, past papers, assignments..."
              aria-label="Search notes, projects, past papers and assignments"
              className="h-11 min-w-0 flex-1 border-0 bg-transparent text-[14px] text-slate-700 outline-none placeholder:text-slate-400"
            />

            <button
              type="submit"
              className="h-11 shrink-0 rounded-xl bg-blue-600 px-5 text-[13.5px] font-semibold text-white transition hover:bg-blue-700 sm:px-7"
            >
              Search
            </button>
          </form>

          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <span className="text-[13px] text-slate-500">Popular now:</span>

            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => handleShortcut(term)}
                className="rounded-full bg-blue-50 px-3.5 py-1.5 text-[12.5px] font-semibold text-blue-700 transition hover:bg-blue-100"
              >
                {term}
              </button>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(user ? '/student/dashboard' : '/auth/signUp')}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-[13.5px] font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
            >
              Get started free
              <ArrowRight className="h-4 w-4" />
            </button>

            <a
              href="#resources"
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-[13.5px] font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Browse resources
            </a>
          </div>
        </div>

        <div className="relative animate-fadeInUp lg:pl-6">
          <img
            src={heroImage}
            alt=""
            aria-hidden="true"
            className="pointer-events-none mx-auto w-full max-w-[560px] select-none drop-shadow-[0_30px_60px_rgba(37,99,235,0.18)]"
          />

          {/* Floating trust card: figures */}
          <div className="animate-float absolute -left-1 top-4 hidden rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-xl backdrop-blur sm:block">
            <div className="flex items-center gap-5">
              {HERO_STATS.map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon className="h-4 w-4" />
                  </span>

                  <span className="leading-tight">
                    <span className="block text-[15px] font-bold text-slate-900">{value}</span>
                    <span className="block text-[11px] font-medium text-slate-500">{label}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Floating trust card: rating */}
          <div
            className="animate-float absolute -bottom-1 right-0 hidden rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-xl backdrop-blur sm:block"
            style={{ animationDelay: '1.2s' }}
          >
            <div className="flex items-center gap-2">
              <span className="flex gap-0.5" aria-hidden="true">
                {RATING_STARS.map((star) => (
                  <Star key={star} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </span>

              <span className="text-[12.5px] font-bold text-slate-800">4.9/5</span>
            </div>

            <p className="mt-0.5 text-[11px] font-medium text-slate-500">Loved by students</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
