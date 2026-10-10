import { useState } from "react";
import {
  Ban,
  GraduationCap,
  MailCheck,
  MailWarning,
  ShieldCheck,
  UserCheck,
  UserPlus,
  Users as UsersIcon,
} from "lucide-react";

import ResourcePage from "../components/crud/ResourcePage";
import Avatar from "../components/ui/Avatar";
import { Badge } from "../components/ui/Badge";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { useToast } from "../components/ui/toastContext";
import { apiErrorMessage, setUserBlockRequest, verifyUserEmailRequest } from "../lib/api";
import { EMAIL_PATTERN } from "../lib/authStyles";
import { formatDate, relativeTime } from "../lib/format";
import { readSession } from "../lib/session";
import { useData } from "../store/dataContext";

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
    key: "status",
    label: "Status",
    headerClassName: "w-[170px]",
    // The two flags the moderation actions maintain: email verification and
    // the block. Missing fields (older accounts) read as Unverified / active.
    render: (record) => (
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge tone={record.isEmailVerified ? "success" : "warning"}>
          {record.isEmailVerified ? "Verified" : "Unverified"}
        </Badge>

        {record.isblock ? <Badge tone="danger">Blocked</Badge> : null}
      </div>
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
    name: "isEmailVerified",
    label: "Email status",
    format: (value) => (value ? "Verified" : "Not verified"),
  },
  {
    name: "isblock",
    label: "Account status",
    format: (value) => (value ? "Blocked" : "Active"),
  },
  {
    name: "createdAt",
    label: "Joined",
    format: (value) => (value ? `${formatDate(value)} · ${relativeTime(value)}` : ""),
  },
];

const FILTERS = [
  { key: "role", label: "Role", variant: "tabs", options: ROLES },
  // Boolean columns filter as the strings String(true)/String(false) produce.
  {
    key: "isEmailVerified",
    label: "Email",
    variant: "menu",
    options: [
      { value: "true", label: "Verified" },
      { value: "false", label: "Unverified" },
    ],
  },
  {
    key: "isblock",
    label: "Access",
    variant: "menu",
    options: [
      { value: "true", label: "Blocked" },
      { value: "false", label: "Active" },
    ],
  },
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
    label: "Unverified",
    value: rows.filter((record) => !record.isEmailVerified).length,
    icon: MailWarning,
    tone: "amber",
    filter: { key: "isEmailVerified", value: "false" },
  },
  {
    label: "Blocked",
    value: rows.filter((record) => record.isblock).length,
    icon: Ban,
    tone: "rose",
    filter: { key: "isblock", value: "true" },
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
 * On top of the shared CRUD, the row menu carries the two moderation actions:
 * verify an address by hand (so the student can sign in without the emailed
 * link) and block / unblock the account (the server refuses blocking your own
 * account, and a block cuts off live sessions immediately).
 * The signup graph lives on the Dashboard (Overview), not here.
 */
export default function Users() {
  const toast = useToast();
  const { patch } = useData();
  // Saved at sign-in; the signed-in admin's own row never offers "Block".
  const session = readSession();

  // Row id with a moderation request in flight, so a double click cannot fire
  // the same action twice.
  const [busy, setBusy] = useState(null);
  // The record awaiting "Block" in the confirmation dialog (unblock is direct).
  const [pendingBlock, setPendingBlock] = useState(null);

  /** PUT …/verify-email, then folds the updated account into the table. */
  const verifyEmail = async (record) => {
    if (busy) return;

    setBusy(record.id);

    try {
      const payload = await verifyUserEmailRequest(record.id);

      patch("users", record.id, payload.data);
      toast.success(`Email verified for ${record.name}`);
    } catch (error) {
      toast.error(apiErrorMessage(error));
    } finally {
      setBusy(null);
    }
  };

  /** Sends the opposite of the row's current flag to …/block. */
  const toggleBlock = async (record) => {
    const blocked = !record.isblock;

    if (busy) return;

    setBusy(record.id);

    try {
      const payload = await setUserBlockRequest(record.id, blocked);

      patch("users", record.id, payload.data);
      toast.success(
        blocked ? `${record.name} has been blocked` : `${record.name} has been unblocked`
      );
    } catch (error) {
      toast.error(apiErrorMessage(error));
    } finally {
      setBusy(null);
    }
  };

  /** Verify / Block / Unblock entries spliced into the shared row menu. */
  const rowActions = (record) => {
    const isSelf = Boolean(session?.email) && session.email === record.email;
    const actions = [];

    if (!record.isEmailVerified) {
      actions.push({
        key: "verify",
        label: "Verify email",
        icon: MailCheck,
        onSelect: () => verifyEmail(record),
      });
    }

    // The server refuses a self-block too; hiding it just avoids the toast.
    if (!isSelf) {
      actions.push(
        record.isblock
          ? {
              key: "unblock",
              label: "Unblock",
              icon: UserCheck,
              onSelect: () => toggleBlock(record),
            }
          : {
              key: "block",
              label: "Block user",
              icon: Ban,
              danger: true,
              onSelect: () => setPendingBlock(record),
            }
      );
    }

    return actions;
  };

  const confirmBlock = () => {
    const target = pendingBlock;

    setPendingBlock(null);

    if (target) toggleBlock(target);
  };

  return (
    <>
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
        rowActions={rowActions}
      />

      <ConfirmDialog
        open={Boolean(pendingBlock)}
        title="Block this user?"
        message={`${pendingBlock?.name ?? "This user"} will be signed out immediately and cannot sign in until unblocked. Their uploads and reviews stay in the catalogue.`}
        confirmLabel="Block user"
        onConfirm={confirmBlock}
        onCancel={() => setPendingBlock(null)}
      />
    </>
  );
}