
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Menu, Search, X } from 'lucide-react';

/**
 * Marketing navigation for the public landing page. The links are same-page
 * anchors, so the active item is tracked from the URL hash instead of the
 * router. "Search" simply focuses the hero field, which keeps the header free
 * of a second, competing search input.
 */

const NAV_LINKS = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'resources', label: 'Resources', href: '#resources' },
  { id: 'community', label: 'Community', href: '#community' },
  { id: 'about', label: 'About', href: '#about' },
];

const linkClass = (isActive) =>
  [
    'border-b-2 pb-1 text-[14px] font-medium transition-colors',
    isActive
      ? 'border-blue-600 text-blue-600'
      : 'border-transparent text-slate-600 hover:text-blue-600',
  ].join(' ');

const Navbar = () => {
  const [activeId, setActiveId] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);

  // Keep the underline in sync when the visitor jumps between anchors.
  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.replace('#', '');
      const match = NAV_LINKS.find((link) => link.id === hash);
      setActiveId(match ? match.id : 'home');
    };

    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);

    return () => window.removeEventListener('hashchange', syncFromHash);
  }, []);

  const focusHeroSearch = () => {
    setMenuOpen(false);

    const field = document.getElementById('landing-search');
    if (!field) return;

    field.scrollIntoView({ behavior: 'smooth', block: 'center' });
    field.focus();
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center gap-8 px-5 sm:px-8">
        {/* Logo */}
        <Link
          to="/"
          onClick={() => {
            setActiveId('home');
            setMenuOpen(false);
          }}
          className="flex shrink-0 items-center gap-2.5"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-blue-600 text-white shadow-sm">
            <GraduationCap className="h-5 w-5" />
          </span>

          <span className="text-[21px] font-bold tracking-tight text-slate-900">
            CUI<span className="text-blue-600">Hub</span>
          </span>
        </Link>

        {/* Anchors */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={() => setActiveId(link.id)}
              className={linkClass(activeId === link.id)}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={focusHeroSearch}
            aria-label="Search resources"
            className="hidden rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 sm:inline-flex"
          >
            <Search className="h-[18px] w-[18px]" />
          </button>

          <Link
            to="/auth/signIn"
            className="hidden rounded-xl border border-slate-200 px-4 py-2.5 text-[13.5px] font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 sm:inline-flex"
          >
            Login
          </Link>

          <Link
            to="/auth/signUp"
            className="inline-flex rounded-xl bg-blue-600 px-4 py-2.5 text-[13.5px] font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
          >
            Sign Up
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="inline-flex rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 md:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-slate-100 bg-white px-5 pb-5 pt-3 md:hidden">
          <div className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => {
                  setActiveId(link.id);
                  setMenuOpen(false);
                }}
                className={`rounded-lg px-3 py-2.5 text-[14px] font-medium transition ${
                  activeId === link.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={focusHeroSearch}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-[13.5px] font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <Search className="h-4 w-4" />
              Search
            </button>

            <Link
              to="/auth/signIn"
              className="inline-flex rounded-xl border border-slate-200 px-4 py-2.5 text-[13.5px] font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
