import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  LayoutDashboard,
  Library,
  Menu,
  Search,
  Sparkles,
  X,
} from 'lucide-react';

import { useAppContext } from '../../context/AppContext';

const NAV_LINKS = [
  { id: 'home', label: 'Home', to: '/', isRoute: true },
  { id: 'about', label: 'About', to: '/about', isRoute: true },
  { id: 'services', label: 'Services', to: '/services', isRoute: true },
];

export default function SiteNavbar({ resourceCount = 0 }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAppContext();

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(location.hash ? location.hash.slice(1) : 'home');
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const currentPath = location.pathname;

  // Smooth scroll to hash anchor on navigation
  useEffect(() => {
    if (location.pathname !== '/' || !location.hash) return undefined;

    const id = location.hash.slice(1);
    const timer = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);

    return () => window.clearTimeout(timer);
  }, [location.pathname, location.hash, location.key]);

  // Close the mobile menu on outside click / Escape and lock body scroll while open
  useEffect(() => {
    if (!menuOpen) return undefined;

    const handlePointerDown = (event) => {
      if (
        menuRef.current?.contains(event.target) ||
        buttonRef.current?.contains(event.target)
      ) {
        return;
      }
      setMenuOpen(false);
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  // Highlight the nav link for the section currently in view on the home page
  useEffect(() => {
    if (currentPath !== '/') return undefined;

    const sectionIds = ['home', 'about', 'features'];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (elements.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [currentPath]);

  const isLinkActive = (link) => {
    if (link.isRoute) {
      return currentPath === link.to;
    }
    if (currentPath === '/') {
      return link.id === activeSection;
    }
    return false;
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

  const openPortal = () => {
    setMenuOpen(false);
    navigate(user ? '/student/dashboard' : '/auth/signIn');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/90 bg-white transition-all">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          className="group flex shrink-0 items-center gap-2.5 transition"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white  transition group-hover:bg-blue-700">
            <GraduationCap className="h-5 w-5" />
          </span>

          <span className="text-left">
            <span className="block text-[18px] font-bold leading-none tracking-tight text-slate-900">
              Campus<span className="text-blue-600">Connect</span>
            </span>
            <span className="block text-[10.5px] font-medium leading-tight text-slate-400">
              Student portal
            </span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden items-center gap-1.5 md:flex lg:gap-2">
          {NAV_LINKS.map((link) => {
            const active = isLinkActive(link);
            return (
              <Link
                key={link.id}
                to={link.to}
                className={`relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13.5px] font-medium transition ${
                  active
                    ? 'bg-blue-50 font-semibold text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-blue-700">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="ml-auto flex items-center gap-2 sm:gap-2.5">
          {user ? (
            <button
              type="button"
              onClick={openPortal}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-blue-600 px-4 text-[13px] font-semibold text-white  transition hover:bg-blue-700 "
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </button>
          ) : (
            <>
              <Link
                to="/auth/signIn"
                className="hidden h-9 items-center rounded-xl border border-slate-200 bg-white px-4 text-[13px] font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50  sm:inline-flex"
              >
                Sign in
              </Link>
              <Link
                to="/auth/signUp"
                className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-blue-600 px-4 text-[13px] font-semibold text-white  transition hover:bg-blue-700 "
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Get Started</span>
              </Link>
            </>
          )}

          {/* Mobile hamburger button */}
          <button
            ref={buttonRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 md:hidden"
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          ref={menuRef}
          className="border-t border-slate-200 bg-white px-4 py-4 md:hidden"
        >
          <div className="space-y-1">
            {NAV_LINKS.map((link) => {
              const active = isLinkActive(link);
              return (
                <Link
                  key={link.id}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-[14px] font-medium transition ${
                    active
                      ? 'bg-blue-50 font-semibold text-blue-700'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase text-blue-700">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="mt-4 border-t border-slate-100 pt-4 flex flex-col gap-2">
            {user ? (
              <button
                type="button"
                onClick={openPortal}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-[13.5px] font-semibold text-white transition hover:bg-blue-700"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Go to Dashboard</span>
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/auth/signIn"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center rounded-xl border border-slate-200 py-2.5 text-[13.5px] font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Sign in
                </Link>
                <Link
                  to="/auth/signUp"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center rounded-xl bg-blue-600 py-2.5 text-[13.5px] font-semibold text-white transition hover:bg-blue-700"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
