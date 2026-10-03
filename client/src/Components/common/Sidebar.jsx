import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ClipboardList,
  FileText,
  FolderKanban,
  GraduationCap,
  Info,
  LayoutDashboard,
  LogOut,
  Settings,
  Star,
  X,
} from 'lucide-react';

import { useAppContext } from '../../context/AppContext';
import { logoutUser } from '../../api/profile';
import { toast } from 'react-toastify';

const NAV_GROUPS = [
  {
    items: [
      { path: '/student/dashboard', name: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Academics',
    items: [
      { path: '/student/projects', name: 'Projects', icon: FolderKanban },
      { path: '/student/past-papers', name: 'Past papers', icon: FileText },
      { path: '/student/assignments', name: 'Assignments', icon: ClipboardList },
      { path: '/student/teachers-review', name: 'Teacher reviews', icon: Star },
    ],
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logoutUserState, isSidebarOpen, closeSidebar } = useAppContext();

  // Navigating anywhere closes the drawer (below `xl` it would otherwise stay
  // open over the new page).
  useEffect(() => {
    closeSidebar();
  }, [location.pathname, closeSidebar]);

  // While the drawer covers the page on mobile: Escape closes it and the page
  // underneath stops scrolling.
  useEffect(() => {
    if (!isSidebarOpen) return undefined;

    const handleKey = (event) => {
      if (event.key === 'Escape') closeSidebar();
    };

    document.addEventListener('keydown', handleKey);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [isSidebarOpen, closeSidebar]);

  // If the window grows past the drawer breakpoint the fixed sidebar takes over,
  // so drop the drawer (and its scroll lock) instead of leaving it open behind it.
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) closeSidebar();
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [closeSidebar]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success('Signed out');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      logoutUserState();
      navigate('/auth/signIn');
    }
  };

  const goTo = (path) => {
    closeSidebar();
    navigate(path);
  };

  const initials = (user?.name || 'Student')
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  return (
    <>
      {/* Mobile backdrop: tapping it dismisses the drawer. Desktop never shows it. */}
      {isSidebarOpen && (
        <div
          aria-hidden="true"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[2px] xl:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-slate-200/80 bg-white transition-transform duration-300 ease-out xl:w-64 xl:max-w-none xl:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >

      {/* Brand */}
      <div className="flex h-16 shrink-0 items-center border-b border-slate-100 px-5">
        <button
          type="button"
          onClick={() => goTo('/student/dashboard')}
          className="flex items-center gap-2.5"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-blue-600 text-white">
            <GraduationCap className="h-4 w-4" />
          </span>

          <span className="text-left">
            <span className="block text-[13.5px] font-semibold leading-5 tracking-tight text-slate-900">
              CampusConnect
            </span>

            <span className="block text-[10.5px] leading-4 text-slate-400">
              Student portal
            </span>
          </span>
        </button>

        <button
          type="button"
          onClick={closeSidebar}
          aria-label="Close navigation menu"
          className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 xl:hidden"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-4">
        {NAV_GROUPS.map((group, index) => (
          <div key={group.label || 'main'} className={index > 0 ? 'mt-5' : ''}>
            {group.label && (
              <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.09em] text-slate-400">
                {group.label}
              </p>
            )}

            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => goTo(item.path)}
                    className={`relative flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-[13px] transition-colors xl:py-2 xl:text-[12.5px] ${
                      isActive
                        ? 'bg-blue-50 font-semibold text-blue-700'
                        : 'font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 h-4 w-[2.5px] -translate-y-1/2 rounded-r-full bg-blue-600" />
                    )}

                    <Icon
                      className={`h-[17px] w-[17px] shrink-0 ${
                        isActive ? 'text-blue-600' : 'text-slate-400'
                      }`}
                    />

                    <span className="flex-1 truncate text-left">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <div className="mt-5 border-t border-slate-100 pt-3">
          <button
            type="button"
            onClick={() => goTo('/student/settings')}
            className={`flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-[13px] font-medium transition-colors xl:py-2 xl:text-[12.5px] ${
              location.pathname === '/student/settings'
                ? 'bg-blue-50 font-semibold text-blue-700'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Settings
              className={`h-[17px] w-[17px] shrink-0 ${
                location.pathname === '/student/settings'
                  ? 'text-blue-600'
                  : 'text-slate-400'
              }`}
            />
            Settings
          </button>

          <button
            type="button"
            onClick={() => goTo('/student/about')}
            className={`flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-[13px] font-medium transition-colors xl:py-2 xl:text-[12.5px] ${
              location.pathname === '/student/about'
                ? 'bg-blue-50 font-semibold text-blue-700'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Info
              className={`h-[17px] w-[17px] shrink-0 ${
                location.pathname === '/student/about'
                  ? 'text-blue-600'
                  : 'text-slate-400'
              }`}
            />
            About
          </button>
        </div>
      </nav>

      {/* Account */}
      <div className="shrink-0 border-t border-slate-100 p-2.5">
        <div className="flex items-center gap-2.5 rounded-[10px] px-2.5 py-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11.5px] font-semibold text-slate-500">
            {initials}
          </span>

          <span className="min-w-0 flex-1">
            <span className="block truncate text-[12px] font-medium text-slate-800">
              {user?.name || 'Student'}
            </span>

            <span className="block truncate text-[10.5px] text-slate-400">
              {user?.email || 'student account'}
            </span>
          </span>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-0.5 flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-[13px] font-medium text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600 xl:py-2 xl:text-[12.5px]"
        >
          <LogOut className="h-[17px] w-[17px] text-slate-400" />
          Sign out
        </button>
      </div>
    </aside>
    </>
  );
}
