import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  CalendarDays,
  ClipboardList,
  FileText,
  FolderKanban,
  LayoutDashboard,
  RefreshCw,
  Star,
} from "lucide-react";

import { cx, formatDay, relativeTime } from "../lib/format";
import { useData } from "../store/dataContext";

import Avatar from "../components/ui/Avatar";
import Button from "../components/ui/Button";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import Cover from "../components/ui/Cover";
import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";
import { useToast } from "../components/ui/toastContext";

const FEEDS = [
  ["assignments", "Assignment", (item) => item.title],
  ["papers", "Past paper", (item) => `${item.subject} · ${item.year}`],
  ["projects", "Project", (item) => item.title],
  ["reviews", "Review", (item) => `${item.teacher} — ${item.student}`],
];

const STATUS_TONES = {
  Pending: "bg-amber-500",
  Submitted: "bg-emerald-500",
  Overdue: "bg-red-500",
};

function Panel({ title, action, children }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <header className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-3.5">
        <h2 className="text-[13.5px] font-semibold text-slate-900">{title}</h2>

        {action}
      </header>

      <div className="px-5 py-4">{children}</div>
    </section>
  );
}

function Bars({ items }) {
  const max = Math.max(...items.map((item) => item.value), 1);

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.label}>
          <div className="flex items-center justify-between text-[12.5px]">
            <span className="text-slate-600">{item.label}</span>
            <span className="font-medium text-slate-900">{item.value}</span>
          </div>

          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className={cx("h-full rounded-full", item.tone)}
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function Overview() {
  const { records, reset } = useData();
  const toast = useToast();

  const [isResetting, setIsResetting] = useState(false);

  const status = useMemo(
    () =>
      Object.keys(STATUS_TONES).map((each) => ({
        label: each,
        value: records.assignments.filter((item) => item.status === each).length,
        tone: STATUS_TONES[each],
      })),
    [records.assignments]
  );

  const recent = useMemo(
    () =>
      FEEDS.flatMap(([key, type, describe]) =>
        records[key].map((item) => ({
          id: `${key}-${item.id}`,
          type,
          label: describe(item),
          at: item.createdAt,
        }))
      )
        .sort((a, b) => String(b.at).localeCompare(String(a.at)))
        .slice(0, 5),
    [records]
  );

  const deadlines = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);

    const from = (list, describe) =>
      list
        .filter((item) => item.dueDate && item.dueDate >= today)
        .map((item) => ({
          id: item.id,
          title: item.title,
          who: describe(item),
          due: item.dueDate,
        }));

    return [
      ...from(records.assignments, (item) => `${item.subject} · ${item.instructor}`),
      ...from(records.projects, (item) => `${item.subject} · ${item.course || "No code"}`),
    ]
      .sort((a, b) => a.due.localeCompare(b.due))
      .slice(0, 5);
  }, [records]);

  const featured = records.projects.find((item) => item.repo) ?? records.projects[0];
  const overdue = records.assignments.filter((item) => item.status === "Overdue").length;
  const scores = records.reviews.map((item) => item.rating);
  const average = scores.length
    ? (scores.reduce((sum, value) => sum + value, 0) / scores.length).toFixed(1)
    : "—";

  return (
    <>
      <div className="px-6 pt-6">
        <PageHeader
          icon={LayoutDashboard}
          tone="indigo"
          title="Dashboard"
          description="Everything in the CampusConnect catalogue, at a glance."
          action={
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                icon={RefreshCw}
                onClick={() => setIsResetting(true)}
              >
                Reset data
              </Button>

              <Link
                to="/assignments"
                className="inline-flex h-10 items-center rounded-lg bg-indigo-600 px-4 text-[13.5px] font-medium text-white transition-colors hover:bg-indigo-700"
              >
                Manage catalogue
              </Link>
            </div>
          }
        />
      </div>

      <div className="space-y-5 px-6 py-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Assignments"
            value={records.assignments.length}
            icon={ClipboardList}
            tone="indigo"
            meta={`${overdue} overdue`}
          />
          <StatCard
            label="Past papers"
            value={records.papers.length}
            icon={FileText}
            tone="emerald"
            meta={`${records.papers.filter((item) => item.hasSolution).length} with a solution key`}
          />
          <StatCard
            label="Projects"
            value={records.projects.length}
            icon={FolderKanban}
            tone="violet"
            meta={`${records.projects.filter((item) => item.repo).length} with a repo link`}
          />
          <StatCard
            label="Teacher reviews"
            value={records.reviews.length}
            icon={Star}
            tone="amber"
            meta={`Average rating ${average} / 5`}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Panel
              title="Upcoming deadlines"
              action={
                <Link
                  to="/assignments"
                  className="text-[12.5px] font-medium text-indigo-600 hover:underline"
                >
                  View all
                </Link>
              }
            >
              {deadlines.length === 0 ? (
                <p className="py-6 text-center text-[12.5px] text-slate-500">
                  Nothing due right now.
                </p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {deadlines.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                        <CalendarDays size={16} strokeWidth={1.9} />
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-medium text-slate-800">
                          {item.title}
                        </p>

                        <p className="truncate text-[12px] text-slate-500">{item.who}</p>
                      </div>

                      <span className="shrink-0 text-[12px] text-slate-500">
                        {formatDay(item.due)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </div>

          <Panel title="Assignments by status">
            <Bars items={status} />
          </Panel>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Panel title="Recent activity">
              <ul className="divide-y divide-slate-100">
                {recent.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0"
                  >
                    <Avatar name={item.label} seed={item.id} size="sm" />

                    <p className="min-w-0 flex-1 truncate text-[13px] text-slate-700">
                      {item.label}
                    </p>

                    <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-600">
                      {item.type}
                    </span>

                    <span className="w-[64px] shrink-0 text-right text-[12px] text-slate-400">
                      {relativeTime(item.at)}
                    </span>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>

          <Panel
            title="Featured project"
            action={
              <Link
                to="/projects"
                className="text-[12.5px] font-medium text-indigo-600 hover:underline"
              >
                All projects
              </Link>
            }
          >
            {featured ? (
              <div className="space-y-3">
                <Cover seed={featured.id} className="h-32 w-full rounded-lg" />

                <div>
                  <p className="text-[13.5px] font-semibold text-slate-900">
                    {featured.title}
                  </p>

                  <p className="mt-1 text-[12.5px] leading-5 text-slate-500">
                    {featured.desc || featured.subject}
                  </p>
                </div>

                {featured.repo ? (
                  <a
                    href={featured.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-indigo-600 hover:underline"
                  >
                    Open repository
                    <ArrowUpRight size={14} />
                  </a>
                ) : null}
              </div>
            ) : (
              <p className="py-6 text-center text-[12.5px] text-slate-500">
                No projects yet.
              </p>
            )}
          </Panel>
        </div>
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
    </>
  );
}

