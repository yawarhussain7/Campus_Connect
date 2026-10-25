import { useEffect, useState } from 'react';
import {
  ClipboardList,
  FileText,
  LayoutDashboard,
  Menu,
  Star,
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';

import { useAppContext } from '../../context/AppContext';

const TABS = [
  { to: '/student/dashboard', label: 'Home', icon: LayoutDashboard },
  { to: '/student/assignments', label: 'Tasks', icon: ClipboardList },
  { to: '/student/past-papers', label: 'Papers', icon: FileText },
  { to: '/student/teachers-review', label: 'Reviews', icon: Star },
];

export default function MobileBottomNav() {
  const location = useLocation();
  const { openSidebar } = useAppContext();
  const [installPrompt, setInstallPrompt] = useState(null);

  useEffect(() => {
    const captureInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };

    window.addEventListener('beforeinstallprompt', captureInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', captureInstallPrompt);
  }, []);

  const installApp = async () => {
    if (!installPrompt) return;

    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };

  return (
    <>
      {installPrompt && (
        <div className="fixed inset-x-3 bottom-[calc(76px+env(safe-area-inset-bottom))] z-[34] mx-auto flex max-w-sm items-center gap-3 rounded-2xl border border-blue-100 bg-white p-3 shadow-[0_12px_32px_rgba(15,23,42,0.14)] xl:hidden">
          <img src="/unimate-icon.svg" alt="" className="h-9 w-9 rounded-xl" />
          <p className="min-w-0 flex-1 text-[11px] font-medium leading-4 text-slate-700">
            Add UniMate to your home screen for an app-like experience.
          </p>
          <button
            type="button"
            onClick={installApp}
            className="min-h-10 rounded-xl bg-blue-600 px-3 text-xs font-semibold text-white hover:bg-blue-700"
          >
            Install
          </button>
          <button
            type="button"
            onClick={() => setInstallPrompt(null)}
            aria-label="Dismiss install prompt"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
      )}

      <nav
        aria-label="Student app navigation"
        className="fixed inset-x-0 bottom-0 z-[35] border-t border-slate-200/90 bg-white/95 px-1 pt-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))] shadow-[0_-6px_24px_rgba(15,23,42,0.06)] backdrop-blur-xl xl:hidden"
      >
        <div className="mx-auto grid max-w-lg grid-cols-5">
          {TABS.map(({ to, label, icon: Icon }) => {
            const isActive =
              location.pathname === to || location.pathname.startsWith(`${to}/`);

            return (
              <NavLink
                key={to}
                to={to}
                aria-label={label}
                aria-current={isActive ? 'page' : undefined}
                className={`flex min-h-12 items-center justify-center rounded-xl px-1 ${
                  isActive
                    ? 'text-blue-700'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <Icon
                  className={`h-[19px] w-[19px] ${isActive ? 'stroke-[2.3]' : ''}`}
                  aria-hidden="true"
                />
              </NavLink>
            );
          })}

          <button
            type="button"
            onClick={openSidebar}
            aria-label="Open more navigation"
            className={`flex min-h-12 items-center justify-center rounded-xl px-1 ${
              location.pathname === '/student/projects' ||
              location.pathname.startsWith('/student/project/') ||
              location.pathname === '/student/settings'
                ? 'text-blue-700'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <Menu className="h-[19px] w-[19px]" aria-hidden="true" />
          </button>
        </div>
      </nav>
    </>
  );
}
