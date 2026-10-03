import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Check,
  ChevronDown,
  ExternalLink,
  LogOut,
  RefreshCw,
  Search,
  Settings,
} from "lucide-react";

import { cx } from "../../lib/format";
import { readProfile } from "../../lib/profile";
import { useData } from "../../store/dataContext";

import Avatar from "../ui/Avatar";
import ConfirmDialog from "../ui/ConfirmDialog";
import Menu, { MenuItem, MenuLabel } from "../ui/Menu";
import { useToast } from "../ui/toastContext";

const NOTIFICATIONS = [
  { id: 1, text: "3 assignments are marked overdue", to: "/assignments" },
  { id: 2, text: "A new past paper was added for CS305", to: "/past-papers" },
  { id: 3, text: "A student left a 5-star review", to: "/teacher-reviews" },
];

const STUDENT_APP_URL = "http://localhost:5174";

/** Everything the global search box can reach, with the label it shows. */
const SEARCH_SOURCES = [
  {
    key: "projects",
    to: "/projects",
    type: "Project",
    title: (record) => record.title,
    sub: (record) => record.student || record.subject,
  },
  {
    key: "assignments",
    to: "/assignments",
    type: "Assignment",
    title: (record) => record.title,
    sub: (record) => record.instructor || record.subject,
  },
  {
    key: "papers",
    to: "/past-papers",
    type: "Past Paper",
    title: (record) => record.subject,
    sub: (record) => `${record.instructor} · ${record.year}`,
  },
  {
    key: "reviews",
    to: "/teacher-reviews",
    type: "Review",
    title: (record) => record.teacher,
    sub: (record) => record.courseName || record.courseCode,
  },
];

export default function Topbar() {
  const { records, reset } = useData();
  const toast = useToast();
  const navigate = useNavigate();

  const [isResetting, setIsResetting] = useState(false);
  const [unread, setUnread] = useState(NOTIFICATIONS.length);
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const searchRef = useRef(null);

  // Settings persists the profile to localStorage, so it is re-read on every
  // render of the bar (which is cheap, and fresh after leaving /settings).
  const profile = readProfile();

  useEffect(() => {
    if (!isSearching) return undefined;

    const handleDown = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearching(false);
      }
    };

    const handleKey = (event) => {
      if (event.key === "Escape") setIsSearching(false);
    };

    document.addEventListener("mousedown", handleDown);
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("mousedown", handleDown);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isSearching]);

  const needle = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (needle.length < 2) return [];

    return SEARCH_SOURCES.flatMap((source) =>
      records[source.key].map((record) => ({
        id: `${source.key}-${record.id}`,
        type: source.type,
        to: source.to,
        title: String(source.title(record) ?? ""),
        sub: String(source.sub?.(record) ?? ""),
      }))
    )
      .filter((item) => `${item.title} ${item.sub}`.toLowerCase().includes(needle))
      .slice(0, 6);
  }, [records, needle]);

  const go = (to, term) => {
    setQuery("");
    setIsSearching(false);
    navigate(
      term ? { pathname: to, search: `?q=${encodeURIComponent(term)}` } : to
    );
  };

  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center gap-3 border-b border-slate-200 bg-white px-3 sm:px-5">
      <div ref={searchRef} className="relative w-full min-w-0 max-w-xl">
        <Search
          size={16}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="search"
          value={query}
          aria-label="Search records"
          placeholder="Search projects, papers, assignments, or reviews..."
          onFocus={() => setIsSearching(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsSearching(true);
          }}
          className="h-11 w-full rounded-full border border-slate-200 bg-slate-50 pl-10 pr-4 text-[13.5px] text-slate-800 transition-colors placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
        />

        {isSearching && needle.length >= 2 ? (
          <div className="absolute left-0 right-0 top-full z-40 mt-2 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg shadow-slate-900/5">
            {results.length === 0 ? (
              <p className="px-3 py-4 text-center text-[12.5px] text-slate-500">
                Nothing matches "{query.trim()}".
              </p>
            ) : (
              results.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => go(item.to, query.trim())}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-slate-50"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-medium text-slate-800">
                      {item.title || "Untitled"}
                    </span>

                    <span className="block truncate text-[11.5px] text-slate-500">
                      {item.sub}
                    </span>
                  </span>

                  <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-[10.5px] font-medium text-slate-600">
                    {item.type}
                  </span>
                </button>
              ))
            )}
          </div>
        ) : null}
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <Menu
          panelClassName="w-[calc(100vw-2rem)] max-w-[290px] sm:w-[290px]"
          trigger={({ open, toggle }) => (
            <button
              type="button"
              onClick={toggle}
              aria-label="Notifications"
              className={cx(
                "relative flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900",
                open && "bg-slate-100 text-slate-900"
              )}
            >
              <Bell size={18} strokeWidth={1.9} />

              {unread > 0 ? (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
              ) : null}
            </button>
          )}
        >
          <MenuLabel>Notifications</MenuLabel>

          {NOTIFICATIONS.map((item) => (
            <MenuItem key={item.id} onClick={() => go(item.to)}>
              {item.text}
            </MenuItem>
          ))}

          {unread > 0 ? (
            <MenuItem
              icon={Check}
              onClick={() => {
                setUnread(0);
                toast.success("All caught up");
              }}
            >
              Mark all as read
            </MenuItem>
          ) : null}
        </Menu>

        <Menu
          panelClassName="w-[230px]"
          trigger={({ open, toggle }) => (
            <button
              type="button"
              onClick={toggle}
              className={cx(
                "flex items-center gap-2 rounded-full py-1 pl-1 pr-2.5 transition-colors hover:bg-slate-100",
                open && "bg-slate-100"
              )}
            >
              <Avatar name={profile.name} seed="admin-user" size="sm" />

              <span className="hidden max-w-[110px] truncate text-[13px] font-medium text-slate-700 sm:block">
                {profile.name.split(" ")[0]}
              </span>

              <ChevronDown size={14} className="text-slate-400" />
            </button>
          )}
        >
          <MenuLabel>{profile.email}</MenuLabel>

          <MenuItem icon={Settings} onClick={() => navigate("/settings")}>
            Settings
          </MenuItem>

          <MenuItem
            icon={ExternalLink}
            onClick={() => window.open(STUDENT_APP_URL, "_blank", "noopener,noreferrer")}
          >
            View student site
          </MenuItem>

          <MenuItem icon={RefreshCw} onClick={() => setIsResetting(true)}>
            Reset demo data
          </MenuItem>

          <MenuItem danger icon={LogOut} onClick={() => toast.success("Signed out (demo only)")}>
            Sign out
          </MenuItem>
        </Menu>
      </div>

      <ConfirmDialog
        open={isResetting}
        title="Reset demo data?"
        confirmLabel="Reset"
        message="Every record you added or edited will be discarded and the original sample data restored."
        onConfirm={() => {
          reset();
          setIsResetting(false);
          toast.success("Sample data restored");
        }}
        onCancel={() => setIsResetting(false)}
      />
    </header>
  );
}
