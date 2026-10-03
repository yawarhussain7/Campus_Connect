import { NavLink, Outlet } from "react-router-dom";
import {
  ClipboardList,
  FileText,
  FolderKanban,
  LayoutDashboard,
  Settings,
  Star,
} from "lucide-react";

import { cx } from "../../lib/format";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

/** Shown below `lg`, where the fixed sidebar is hidden. */
const MOBILE_LINKS = [
  { to: "/overview", label: "Dashboard", icon: LayoutDashboard },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/assignments", label: "Assignments", icon: ClipboardList },
  { to: "/past-papers", label: "Past Papers", icon: FileText },
  { to: "/teacher-reviews", label: "Teacher Reviews", icon: Star },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function AppShell() {
  return (
    <div className="min-h-screen bg-slate-100/70">
      <Sidebar />

      <div className="flex min-h-screen flex-col lg:pl-64">
        <Topbar />

        <nav className="scroll-x flex gap-1 border-b border-slate-200 bg-white px-3 py-2 lg:hidden">
          {MOBILE_LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cx(
                  "flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12.5px] font-medium transition-colors",
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-100"
                )
              }
            >
              <Icon size={14} strokeWidth={2} />
              {label}
            </NavLink>
          ))}
        </nav>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
