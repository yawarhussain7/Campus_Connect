import { useNavigate, useLocation } from 'react-router-dom';
import {
  ClipboardList,
  FileText,
  FolderKanban,
  GraduationCap,
  Info,
  LayoutDashboard,
  LogOut,
  Star,
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

  const { user, logoutUserState } = useAppContext();

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

  const initials = (user?.name || 'Student')
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-slate-200/80 bg-white xl:flex">

      {/* Brand */}
      <div className="flex h-16 shrink-0 items-center border-b border-slate-100 px-5">
        <button
          type="button"
          onClick={() => navigate('/student/dashboard')}
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
                    onClick={() => navigate(item.path)}
                    className={`relative flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2 text-[12.5px] transition-colors ${
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
            onClick={() => navigate('/student/about')}
            className={`flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2 text-[12.5px] font-medium transition-colors ${
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
          className="mt-0.5 flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2 text-[12.5px] font-medium text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600"
        >
          <LogOut className="h-[17px] w-[17px] text-slate-400" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
