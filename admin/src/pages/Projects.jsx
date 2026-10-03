import { ArrowUpRight, CircleAlert, CircleCheck, Clock, FolderKanban } from "lucide-react";

import ResourcePage from "../components/crud/ResourcePage";
import Avatar from "../components/ui/Avatar";
import { StatusBadge, Tag } from "../components/ui/Badge";
import { formatDate } from "../lib/format";

const SEMESTERS = [
  "Semester 1", "Semester 2", "Semester 3", "Semester 4",
  "Semester 5", "Semester 6", "Semester 7", "Semester 8",
];

const STATUSES = ["Pending", "Submitted", "Overdue"];

const COLUMNS = [
  {
    key: "title",
    label: "Project Name",
    render: (record) => (
      <div className="min-w-0">
        <p className="flex items-center gap-1.5">
          <span className="truncate font-semibold text-slate-900">{record.title}</span>

          {record.repo ? (
            <a
              href={record.repo}
              target="_blank"
              rel="noreferrer"
              title="Open repository"
              aria-label={`Open the repository for ${record.title}`}
              className="shrink-0 rounded text-indigo-500 transition-colors hover:text-indigo-700"
            >
              <ArrowUpRight size={14} strokeWidth={2.2} />
            </a>
          ) : null}
        </p>

        <p className="mt-0.5 line-clamp-1 text-[12px] text-slate-500">
          {record.desc || "No description yet."}
        </p>
      </div>
    ),
  },
  {
    key: "subject",
    label: "Course",
    headerClassName: "w-[180px]",
    render: (record) => <Tag>{record.subject}</Tag>,
  },
  {
    key: "student",
    label: "Assigned To",
    headerClassName: "w-[190px]",
    render: (record) => (
      <span className="flex min-w-0 items-center gap-2.5">
        <Avatar
          name={record.student || "Unassigned"}
          seed={record.student || record.id}
          size="sm"
        />

        <span className="truncate">{record.student || "Unassigned"}</span>
      </span>
    ),
  },
  {
    key: "createdAt",
    label: "Start Date",
    headerClassName: "w-[130px]",
    cellClassName: "text-slate-500",
    render: (record) => formatDate(record.createdAt),
  },
  {
    key: "dueDate",
    label: "Deadline",
    headerClassName: "w-[130px]",
    cellClassName: "text-slate-500",
    render: (record) => formatDate(record.dueDate),
  },
  {
    key: "status",
    label: "Status",
    headerClassName: "w-[130px]",
    render: (record) => <StatusBadge status={record.status} />,
  },
];

const FIELDS = [
  {
    name: "title",
    label: "Title",
    required: true,
    wide: true,
    placeholder: "e.g. Campus Connect Portal",
    check: (value) =>
      value.length < 3
        ? "Title must be at least 3 characters"
        : value.length > 120
          ? "Title cannot exceed 120 characters"
          : null,
  },
  {
    name: "desc",
    label: "Description",
    wide: true,
    type: "textarea",
    rows: 3,
    placeholder: "One or two lines about the project.",
  },
  { name: "subject", label: "Course name", required: true, placeholder: "Software Engineering" },
  { name: "student", label: "Assigned to", placeholder: "Usman Raza" },
  { name: "course", label: "Course code", placeholder: "CS405" },
  {
    name: "semester",
    label: "Semester",
    type: "select",
    options: SEMESTERS,
    defaultValue: "Semester 1",
  },
  { name: "dueDate", label: "Deadline", type: "date", hint: "Plain calendar day" },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: STATUSES,
    defaultValue: "Submitted",
  },
  {
    name: "repo",
    label: "Repository URL",
    placeholder: "https://github.com/…",
    hint: "Must start with http:// or https://",
    pattern: /^https?:\/\/\S+$/i,
    patternMessage: "Repository link must start with http:// or https://",
  },
  { name: "department", label: "Department", defaultValue: "Computer Science" },
  {
    name: "originalName",
    label: "Attached file",
    wide: true,
    placeholder: "Library System.zip",
    hint: "File name only — this demo does not store uploads.",
  },
];

const FILTERS = [{ key: "status", label: "Status", variant: "tabs", options: STATUSES }];

const STATS = (rows) => [
  { label: "Total Projects", value: rows.length, icon: FolderKanban, tone: "indigo" },
  {
    label: "Submitted",
    value: rows.filter((record) => record.status === "Submitted").length,
    icon: CircleCheck,
    tone: "emerald",
    filter: { key: "status", value: "Submitted" },
  },
  {
    label: "Pending",
    value: rows.filter((record) => record.status === "Pending").length,
    icon: Clock,
    tone: "amber",
    filter: { key: "status", value: "Pending" },
  },
  {
    label: "Overdue",
    value: rows.filter((record) => record.status === "Overdue").length,
    icon: CircleAlert,
    tone: "rose",
    filter: { key: "status", value: "Overdue" },
  },
];

export default function Projects() {
  return (
    <ResourcePage
      title="Projects"
      description="Manage and track all projects here."
      icon={FolderKanban}
      tone="indigo"
      collection="projects"
      singular="Project"
      searchKeys={["title", "subject", "course", "desc", "student", "repo"]}
      emptyTitle="No projects yet"
      emptyMessage="Add the first project to start the showcase."
      filters={FILTERS}
      stats={STATS}
      columns={COLUMNS}
      fields={FIELDS}
    />
  );
}
