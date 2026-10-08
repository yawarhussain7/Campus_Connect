import { CircleCheck, FileStack, FileText, ScrollText } from "lucide-react";

import ResourcePage from "../components/crud/ResourcePage";
import Avatar from "../components/ui/Avatar";
import { Badge } from "../components/ui/Badge";
import { relativeTime } from "../lib/format";
import { DEPARTMENTS } from "../lib/departments";

const SEMESTERS = [
  "Semester 1", "Semester 2", "Semester 3", "Semester 4",
  "Semester 5", "Semester 6", "Semester 7", "Semester 8",
];

const EXAMS = ["Mid", "Final"];
const CURRENT_YEAR = new Date().getFullYear();

const COLUMNS = [
  {
    key: "subject",
    label: "Paper",
    render: (record) => (
      <div className="flex min-w-0 items-center gap-3">
        <Avatar name={record.instructor} seed={record.instructor} size="sm" />

        <div className="min-w-0">
          <p className="truncate font-semibold text-slate-900">{record.subject}</p>

          <p className="mt-0.5 truncate text-[12px] text-slate-500">
            {record.instructor}
            {record.batch ? ` · ${record.batch}` : ""}
          </p>
        </div>
      </div>
    ),
  },
  {
    key: "semester",
    label: "Semester",
    headerClassName: "w-[140px]",
    cellClassName: "text-slate-500",
  },
  {
    key: "year",
    label: "Year",
    headerClassName: "w-[90px]",
    cellClassName: "text-slate-500",
  },
  {
    key: "exam",
    label: "Exam",
    headerClassName: "w-[110px]",
    render: (record) => (
      <Badge tone={record.exam === "Final" ? "violet" : "info"}>{record.exam}</Badge>
    ),
  },
  {
    key: "hasSolution",
    label: "Answer Key",
    headerClassName: "w-[130px]",
    render: (record) => (
      <Badge tone={record.hasSolution ? "success" : "neutral"}>
        {record.hasSolution ? "Included" : "None"}
      </Badge>
    ),
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
  { name: "subject", label: "Subject", required: true, placeholder: "Operating Systems" },
  { name: "instructor", label: "Instructor", required: true, placeholder: "Dr. Ayesha Khan" },
  {
    name: "semester",
    label: "Semester",
    type: "select",
    options: SEMESTERS,
    defaultValue: "Semester 1",
  },
  {
    name: "year",
    label: "Year",
    required: true,
    type: "number",
    min: 2000,
    max: CURRENT_YEAR + 1,
    defaultValue: String(CURRENT_YEAR),
    check: (value) => {
      const year = Number(value);

      if (!Number.isInteger(year)) return "Year must be a whole number";
      if (year < 2000) return "Year cannot be before 2000";
      if (year > CURRENT_YEAR + 1) return `Year cannot exceed ${CURRENT_YEAR + 1}`;

      return null;
    },
  },
  { name: "exam", label: "Exam", type: "select", options: EXAMS, defaultValue: "Mid" },
  { name: "batch", label: "Batch", required: true, placeholder: "BCS-2024" },
  {
    name: "department",
    label: "Department",
    type: "select",
    options: DEPARTMENTS,
    defaultValue: "Computer Science",
  },
  {
    name: "hasSolution",
    label: "Answer key",
    type: "checkbox",
    checkboxLabel: "This paper includes a solution key",
    wide: true,
  },
  {
    name: "originalName",
    label: "Attached file",
    wide: true,
    placeholder: "OS Final 2024.pdf",
    hint: "File name reference — students upload the actual file from the student app.",
  },
];

const FILTERS = [
  { key: "semester", label: "Semester", options: SEMESTERS },
  { key: "exam", label: "Exam", variant: "tabs", options: EXAMS },
  {
    key: "hasSolution",
    label: "Answer Key",
    variant: "menu",
    options: [
      { value: "true", label: "Included" },
      { value: "false", label: "Missing" },
    ],
  },
];

const STATS = (rows) => [
  { label: "Total Papers", value: rows.length, icon: FileText, tone: "indigo" },
  {
    label: "Final Papers",
    value: rows.filter((record) => record.exam === "Final").length,
    icon: ScrollText,
    tone: "violet",
    filter: { key: "exam", value: "Final" },
  },
  {
    label: "Mid Papers",
    value: rows.filter((record) => record.exam === "Mid").length,
    icon: FileStack,
    tone: "info",
    filter: { key: "exam", value: "Mid" },
  },
  {
    label: "With Answer Key",
    value: rows.filter((record) => record.hasSolution).length,
    icon: CircleCheck,
    tone: "emerald",
    filter: { key: "hasSolution", value: "true" },
  },
];

export default function PastPapers() {
  return (
    <ResourcePage
      title="Past Papers"
      description="Archive and manage every exam paper students can revise from."
      icon={FileText}
      tone="emerald"
      collection="papers"
      singular="Past Paper"
      searchKeys={["subject", "instructor", "batch", "semester"]}
      emptyTitle="No past papers yet"
      emptyMessage="Add the first paper so students have something to revise from."
      filters={FILTERS}
      stats={STATS}
      columns={COLUMNS}
      fields={FIELDS}
    />
  );
}
