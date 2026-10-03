
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GraduationCap, Menu, Search, X } from 'lucide-react';

/**
 * Marketing navigation, shared by the public landing page and the resource
 * library. Most items are anchors into the landing page (written as `/#id` so
 * they resolve from any route) while "Resources" is a route of its own.
 * "Search" focuses whichever hero search field is currently on screen.
 */

const NAV_LINKS = [
  { id: 'home', label: 'Home', to: '/#home' },
  { id: 'features', label: 'Features', to: '/#features' },
  { id: 'resources', label: 'Resources', to: '/resources' },
  { id: 'community', label: 'Community', to: '/#community' },
  { id: 'about', label: 'About', to: '/#about' },
];

const linkClass = (isActive) =>
  [
    'border-b-2 pb-1 text-[14px] font-medium transition-colors',
    isActive
      ? 'border-blue-600 text-blue-600'
      : 'border-transparent text-slate-600 hover:text-blue-600',
  ].join(' ');

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const onResourcesPage = location.pathname.startsWith('/resources');
  const currentHash = location.hash.replace('#', '');

  // Land on `/#features` from another route and the browser will not scroll for
  // us, so do it once the landing page has had a chance to render.
  useEffect(() => {
    if (location.pathname !== '/' || !location.hash) return undefined;

    const id = location.hash.slice(1);
    const timer = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);

    return () => window.clearTimeout(timer);
  }, [location.pathname, location.hash, location.key]);

  const isActive = (link) => {
    if (link.id === 'resources') return onResourcesPage;
    if (onResourcesPage) return false;

    return currentHash ? currentHash === link.id : link.id === 'home';
  };

  const focusSearchField = () => {
    setMenuOpen(false);

    const field =
      document.getElementById('landing-search') ||
      document.getElementById('resources-search');

    if (!field) {
      navigate('/resources');
      return;
    }

    field.scrollIntoView({ behavior: 'smooth', block: 'center' });
    field.focus();
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center gap-8 px-5 sm:px-8">
        {/* Logo */}
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          className="flex shrink-0 items-center gap-2.5"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-blue-600 text-white shadow-sm">
            <GraduationCap className="h-5 w-5" />
          </span>

          <span className="text-[21px] font-bold tracking-tight text-slate-900">
            CUI<span className="text-blue-600">Hub</span>
          </span>
        </Link>

        {/* Anchors + the resource library route */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.id} to={link.to} className={linkClass(isActive(link))}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={focusSearchField}
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
              <Link
                key={link.id}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-[14px] font-medium transition ${
                  isActive(link)
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={focusSearchField}
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
