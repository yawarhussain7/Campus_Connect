import { CircleAlert, CircleCheck, Star, TrendingUp } from "lucide-react";

import ResourcePage from "../components/crud/ResourcePage";
import Avatar from "../components/ui/Avatar";
import { Badge, Tag } from "../components/ui/Badge";
import { averageRating, relativeTime } from "../lib/format";

const RATINGS = [
  { value: "5", label: "5★" },
  { value: "4", label: "4★" },
  { value: "3", label: "3★" },
  { value: "2", label: "2★" },
  { value: "1", label: "1★" },
];

const COLUMNS = [
  {
    key: "teacher",
    label: "Teacher",
    render: (record) => (
      <div className="flex min-w-0 items-center gap-3">
        <Avatar name={record.teacher} seed={record.teacher} size="sm" />

        <div className="min-w-0">
          <p className="truncate font-semibold text-slate-900">{record.teacher}</p>

          <p className="mt-0.5 truncate text-[12px] text-slate-500">
            {record.teacherRole || "Role not set"}
            {record.campus ? ` · ${record.campus}` : ""}
          </p>
        </div>
      </div>
    ),
  },
  {
    key: "student",
    label: "Student",
    headerClassName: "w-[180px]",
    render: (record) => (
      <span className="flex min-w-0 items-center gap-2.5">
        <Avatar name={record.student} seed={record.student} size="sm" />

        <span className="truncate">{record.student}</span>
      </span>
    ),
  },
  {
    key: "courseName",
    label: "Course",
    headerClassName: "w-[190px]",
    render: (record) => <Tag>{record.courseName || record.courseCode}</Tag>,
  },
  {
    key: "rating",
    label: "Rating",
    headerClassName: "w-[110px]",
    render: (record) => (
      <Badge
        tone={record.rating >= 4 ? "success" : record.rating >= 3 ? "warning" : "danger"}
      >
        <Star size={11} className="shrink-0" fill="currentColor" />
        {record.rating}/5
      </Badge>
    ),
  },
  {
    key: "comment",
    label: "Review",
    render: (record) => (
      <p className="line-clamp-1 max-w-[320px] text-slate-600">
        {record.comment || "No comment."}
      </p>
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
  { name: "teacher", label: "Teacher", required: true, placeholder: "Dr. Ayesha Khan" },
  { name: "teacherRole", label: "Designation", placeholder: "Assistant Professor" },
  { name: "student", label: "Student", required: true, placeholder: "Yawar Hussain" },
  { name: "campus", label: "Campus", placeholder: "Islamabad" },
  { name: "courseName", label: "Course name", required: true, placeholder: "Operating Systems" },
  { name: "courseCode", label: "Course code", placeholder: "CS305" },
  {
    name: "rating",
    label: "Rating",
    required: true,
    type: "number",
    min: 1,
    max: 5,
    step: 1,
    defaultValue: "5",
    hint: "A whole number from 1 to 5",
    check: (value) => {
      const rating = Number(value);

      if (!Number.isInteger(rating)) return "Rating must be a whole number";
      if (rating < 1 || rating > 5) return "Rating must be between 1 and 5";

      return null;
    },
  },
  { name: "semester", label: "Term", placeholder: "Spring 2026" },
  {
    name: "comment",
    label: "Comment",
    required: true,
    wide: true,
    type: "textarea",
    rows: 4,
    placeholder: "What did the student say?",
    check: (value) =>
      value.length < 3
        ? "Comment must be at least 3 characters"
        : value.length > 1000
          ? "Comment cannot exceed 1000 characters"
          : null,
  },
];

const FILTERS = [{ key: "rating", label: "Rating", variant: "tabs", options: RATINGS }];

const STATS = (rows) => [
  { label: "Total Reviews", value: rows.length, icon: Star, tone: "indigo" },
  {
    label: "Average Rating",
    value: averageRating(rows.map((record) => record.rating)).toFixed(1),
    icon: TrendingUp,
    tone: "violet",
    meta: "out of 5",
  },
  {
    label: "5-Star Reviews",
    value: rows.filter((record) => Number(record.rating) === 5).length,
    icon: CircleCheck,
    tone: "emerald",
    filter: { key: "rating", value: "5" },
  },
  {
    label: "Needs Attention",
    value: rows.filter((record) => Number(record.rating) <= 3).length,
    icon: CircleAlert,
    tone: "amber",
    meta: "3 stars or lower",
  },
];

export default function TeacherReviews() {
  return (
    <ResourcePage
      title="Teacher Reviews"
      description="Read and moderate the feedback students leave for teaching staff."
      icon={Star}
      tone="violet"
      collection="reviews"
      singular="Review"
      searchKeys={["teacher", "student", "courseName", "courseCode", "comment"]}
      emptyTitle="No reviews yet"
      emptyMessage="Reviews will appear here once students start leaving feedback."
      filters={FILTERS}
      stats={STATS}
      columns={COLUMNS}
      fields={FIELDS}
    />
  );
}
