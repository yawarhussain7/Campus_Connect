import { GraduationCap, ShieldCheck, UserPlus, Users as UsersIcon } from "lucide-react";

import ResourcePage from "../components/crud/ResourcePage";
import Avatar from "../components/ui/Avatar";
import { Badge } from "../components/ui/Badge";
import { EMAIL_PATTERN } from "../lib/authStyles";
import { formatDate, relativeTime } from "../lib/format";

/** The roles the accounts collection carries, labelled the way the console talks. */
const ROLES = [
  { value: "user", label: "Student" },
  { value: "admin", label: "Admin" },
];

const roleLabel = (role) =>
  role === "admin" ? "Admin" : role === "user" ? "Student" : String(role ?? "—");

const COLUMNS = [
  {
    key: "name",
    label: "User",
    render: (record) => (
      <div className="flex min-w-0 items-center gap-3">
        <Avatar name={record.name} seed={record.email || record.name} size="sm" />

        <div className="min-w-0">
          <p className="truncate font-semibold text-slate-900">{record.name}</p>

          <p className="mt-0.5 truncate text-[12px] text-slate-500">
            {record.email}
          </p>
        </div>
      </div>
    ),
  },
  {
    key: "role",
    label: "Role",
    headerClassName: "w-[130px]",
    render: (record) => (
      <Badge tone={record.role === "admin" ? "violet" : "info"}>
        {roleLabel(record.role)}
      </Badge>
    ),
  },
  {
    key: "createdAt",
    label: "Joined",
    headerClassName: "w-[150px]",
    cellClassName: "text-slate-500",
    render: (record) => (
      <span title={formatDate(record.createdAt)}>
        {relativeTime(record.createdAt)}
      </span>
    ),
  },
];

const FIELDS = [
  {
    name: "name",
    label: "Name",
    required: true,
    placeholder: "e.g. Yawar Hussain",
    check: (value) =>
      value.length < 3
        ? "Name must be at least 3 characters"
        : value.length > 100
          ? "Name cannot exceed 100 characters"
          : null,
  },
  {
    name: "email",
    label: "Email",
    required: true,
    placeholder: "student@example.com",
    pattern: EMAIL_PATTERN,
    patternMessage: "Enter a valid email address",
  },
  {
    name: "role",
    label: "Role",
    type: "select",
    options: ROLES,
    defaultValue: "user",
    // Used by the detail drawer only; the select renders its own options.
    format: (value) => roleLabel(value),
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "At least 6 characters",
    hint: "Required when creating — leave blank while editing to keep the current password.",
    check: (value) =>
      value && value.length < 6 ? "Password must be at least 6 characters" : null,
  },
  {
    name: "avatar",
    label: "Avatar URL",
    wide: true,
    placeholder: "https://…/photo.jpg",
    hint: "Optional — the table falls back to a generated portrait.",
  },
];

/** Extra read-only rows shown in the detail drawer (never in the form). */
const DETAIL_FIELDS = [
  ...FIELDS,
  {
    name: "createdAt",
    label: "Joined",
    format: (value) => (value ? `${formatDate(value)} · ${relativeTime(value)}` : ""),
  },
];

const FILTERS = [
  { key: "role", label: "Role", variant: "tabs", options: ROLES },
];

const currentMonth = () => new Date().toISOString().slice(0, 7);

const STATS = (rows) => [
  {
    label: "Total Users",
    value: rows.length,
    icon: UsersIcon,
    tone: "indigo",
  },
  {
    label: "Admins",
    value: rows.filter((record) => record.role === "admin").length,
    icon: ShieldCheck,
    tone: "violet",
    filter: { key: "role", value: "admin" },
  },
  {
    label: "Students",
    value: rows.filter((record) => record.role === "user").length,
    icon: GraduationCap,
    tone: "emerald",
    filter: { key: "role", value: "user" },
  },
  {
    label: "Joined This Month",
    value: rows.filter((record) =>
      String(record.createdAt || "").startsWith(currentMonth())
    ).length,
    icon: UserPlus,
    tone: "amber",
  },
];

/**
 * The Users screen: full CRUD over registered accounts — the API hashes
 * passwords, enforces unique emails and refuses deleting your own account.
 * The signup graph lives on the Dashboard (Overview), not here.
 */
export default function Users() {
  return (
    <ResourcePage
      title="Users"
      description="Every student and administrator registered on CampusConnect."
      icon={UsersIcon}
      tone="info"
      collection="users"
      singular="User"
      searchKeys={["name", "email", "role"]}
      emptyTitle="No users yet"
      emptyMessage="Registered students and admins will appear here as soon as they sign up."
      filters={FILTERS}
      stats={STATS}
      columns={COLUMNS}
      fields={FIELDS}
      detailFields={DETAIL_FIELDS}
    />
  );
}