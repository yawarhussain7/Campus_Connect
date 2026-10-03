import { CircleAlert, CircleCheck, ClipboardList, Clock } from "lucide-react";

import ResourcePage from "../components/crud/ResourcePage";
import Avatar from "../components/ui/Avatar";
import { StatusBadge, Tag } from "../components/ui/Badge";
import { formatDate, relativeTime } from "../lib/format";

const SEMESTERS = ["1", "2", "3", "4", "5", "6", "7", "8"];
const STATUSES = ["Pending", "Submitted", "Overdue"];

const COLUMNS = [
  {
    key: "title",
    label: "Assignment",
    render: (record) => (
      <div className="min-w-0">
        <p className="truncate font-semibold text-slate-900">{record.title}</p>

        <p className="mt-0.5 line-clamp-1 text-[12px] text-slate-500">
          {record.course ? `${record.course} · ` : ""}
          {record.description || "No description yet."}
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
    key: "instructor",
    label: "Instructor",
    headerClassName: "w-[190px]",
    render: (record) => (
      <span className="flex min-w-0 items-center gap-2.5">
        <Avatar name={record.instructor} seed={record.instructor} size="sm" />

        <span className="truncate">{record.instructor}</span>
      </span>
    ),
  },
  {
    key: "dueDate",
    label: "Due Date",
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
  {
    key: "createdAt",
    label: "Added",
    headerClassName: "w-[130px]",
    cellClassName: "text-slate-500",
    render: (record) => relativeTime(record.createdAt),
  },
];

const FIELDS = [
  {
    name: "title",
    label: "Title",
    required: true,
    wide: true,
    placeholder: "e.g. Process Scheduling Simulation",
    check: (value) =>
      value.length < 3
        ? "Title must be at least 3 characters"
        : value.length > 100
          ? "Title cannot exceed 100 characters"
          : null,
  },
  {
    name: "description",
    label: "Description",
    required: true,
    wide: true,
    type: "textarea",
    rows: 3,
    placeholder: "What does the assignment ask for?",
    check: (value) =>
      value.length < 10 ? "Description must be at least 10 characters" : null,
  },
  { name: "subject", label: "Course name", required: true, placeholder: "Operating Systems" },
  { name: "instructor", label: "Instructor", required: true, placeholder: "Dr. Ayesha Khan" },
  { name: "course", label: "Course code", placeholder: "CS305" },
  {
    name: "semester",
    label: "Semester",
    type: "select",
    options: SEMESTERS,
    defaultValue: "1",
  },
  { name: "dueDate", label: "Due date", type: "date", hint: "Plain calendar day" },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: STATUSES,
    defaultValue: "Pending",
  },
  { name: "department", label: "Department", defaultValue: "Computer Science" },
  {
    name: "originalName",
    label: "Attached file",
    placeholder: "Assignment 02.pdf",
    hint: "File name only — this demo does not store uploads.",
  },
];

const FILTERS = [{ key: "status", label: "Status", variant: "tabs", options: STATUSES }];

const STATS = (rows) => [
  { label: "Total Assignments", value: rows.length, icon: ClipboardList, tone: "indigo" },
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

export default function Assignments() {
  return (
    <ResourcePage
      title="Assignments"
      description="Create, assign and track every piece of coursework."
      icon={ClipboardList}
      tone="info"
      collection="assignments"
      singular="Assignment"
      searchKeys={["title", "subject", "course", "instructor", "description"]}
      emptyTitle="No assignments yet"
      emptyMessage="Create the first assignment to start building the catalogue."
      filters={FILTERS}
      stats={STATS}
      columns={COLUMNS}
      fields={FIELDS}
    />
  );
}
