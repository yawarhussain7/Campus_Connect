import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Users } from 'lucide-react';

import heroImage from '../../assets/bg.png';
import { useAppContext } from '../../context/AppContext';

/** Quick-search shortcuts shown under the search field. */
const POPULAR_SEARCHES = ['Past Papers', 'Notes', 'Assignments', 'Projects'];

/**
 * Landing hero: pill badge, two-tone headline, resource search and the
 * illustration. The library sits behind the student portal, so the search
 * doubles as the sign-in gate for guests.
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
    <section id="home" className="scroll-mt-20 bg-[#f6f9ff]">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-14 pt-12 sm:px-8 lg:grid-cols-2 lg:gap-6 lg:pb-16 lg:pt-16">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/80 px-3.5 py-1.5 text-[12.5px] font-semibold text-blue-700">
            <Users className="h-4 w-4" />
            Built for Students, by Students
          </span>

          <h1 className="mt-6 text-[40px] font-extrabold leading-[1.06] tracking-tight text-slate-900 sm:text-[52px]">
            Share. Learn. Grow.
            <span className="block text-blue-600">Together.</span>
          </h1>

          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-slate-500">
            Join our student community to access and share notes, projects, past papers and
            assignments. Make your study journey easier, faster and more productive.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 pl-4 shadow-sm transition focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/10"
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
        </div>

        <div className="relative">
          <img
            src={heroImage}
            alt=""
            aria-hidden="true"
            className="pointer-events-none mx-auto w-full max-w-[560px] select-none"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
