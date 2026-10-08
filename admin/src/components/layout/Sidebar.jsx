import { Link, NavLink } from "react-router-dom";
import {
  ClipboardList,
  FileText,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  Settings,
  Star,
  Users,
} from "lucide-react";

import { cx } from "../../lib/format";

const NAV = [
  { to: "/overview", label: "Dashboard", icon: LayoutDashboard },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/assignments", label: "Assignments", icon: ClipboardList },
  { to: "/past-papers", label: "Past Papers", icon: FileText },
  { to: "/teacher-reviews", label: "Teacher Reviews", icon: Star },
  { to: "/users", label: "Users", icon: Users },
  { to: "/settings", label: "Settings", icon: Settings },
];

function linkClasses({ isActive }) {
  return cx(
    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] transition-colors",
    isActive
      ? "bg-indigo-50 font-semibold text-indigo-600"
      : "font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  );
}

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
      <Link to="/overview" className="flex h-[72px] shrink-0 items-center gap-3 px-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white">
          <GraduationCap size={22} strokeWidth={2} />
        </span>

        <span className="min-w-0 leading-tight">
          <span className="block truncate text-[14.5px] font-bold tracking-tight text-slate-900">
            CampusConnect
          </span>

          <span className="block text-[11.5px] text-slate-500">Admin Panel</span>
        </span>
      </Link>

      <nav className="flex-1 overflow-y-auto px-3 py-2">
        <ul className="space-y-1">
          {NAV.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink to={to} className={linkClasses}>
                {({ isActive }) => (
                  <>
                    <Icon size={18} strokeWidth={isActive ? 2.2 : 1.9} />
                    {label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="shrink-0 p-3">
        <div className="rounded-2xl bg-indigo-50/80 p-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm">
            <GraduationCap size={18} strokeWidth={2} />
          </span>

          <p className="mt-3 text-[13px] font-semibold leading-5 text-indigo-950">
            Keep Learning
            <br />
            Keep Growing
          </p>

          <p className="mt-1 text-[11.5px] leading-4 text-indigo-500">
            Better education for a brighter future.
          </p>
        </div>
      </div>
    </aside>
  );
}
