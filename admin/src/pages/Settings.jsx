import { useState } from "react";
import { RotateCcw, Save } from "lucide-react";

import Avatar from "../components/ui/Avatar";
import Button from "../components/ui/Button";
import { Field, Input, Select } from "../components/ui/Field";
import { useToast } from "../components/ui/toastContext";
import { cx } from "../lib/format";

const STORAGE_KEY = "campus-connect-admin:settings:v1";

const ROLES = ["Administrator", "Editor", "Reviewer"];

const DEFAULTS = {
  name: "Yawar Hussain",
  email: "yawarhussain793@gmail.com",
  department: "Computer Science",
  role: "Administrator",
  emailNotifications: true,
  weeklyDigest: false,
  overdueAlerts: true,
};

function readStored() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

function Row({ label, description, checked, onChange }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 py-3.5 first:pt-0 last:border-0 last:pb-0">
      <div>
        <p className="text-[13px] font-medium text-slate-800">{label}</p>

        <p className="mt-0.5 text-[12px] leading-4 text-slate-500">{description}</p>
      </div>

      <button
        type="button"
        role="switch"
        aria-label={label}
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cx(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-indigo-600" : "bg-slate-300"
        )}
      >
        <span
          className={cx(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
            checked ? "left-[22px]" : "left-0.5"
          )}
        />
      </button>
    </div>
  );
}

export default function Settings() {
  const toast = useToast();

  const [values, setValues] = useState(readStored);

  const set = (key, value) =>
    setValues((current) => ({ ...current, [key]: value }));

  const save = (event) => {
    event.preventDefault();

    if (values.name.trim().length < 3) {
      toast.error("Name must be at least 3 characters");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) {
      toast.error("Enter a valid email address");
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    toast.success("Settings saved");
  };

  return (
    <>
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 bg-white px-6 py-5">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">
            Settings
          </h1>

          <p className="mt-1 text-[13px] text-slate-500">
            Your profile and notification preferences.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            icon={RotateCcw}
            onClick={() => {
              setValues(DEFAULTS);
              window.localStorage.removeItem(STORAGE_KEY);
              toast.success("Preferences reset");
            }}
          >
            Reset
          </Button>

          <Button icon={Save} type="submit" form="settings-form">
            Save changes
          </Button>
        </div>
      </header>

      <div className="px-6 py-5">
        <form
          id="settings-form"
          noValidate
          onSubmit={save}
          className="grid grid-cols-1 gap-5 lg:grid-cols-3"
        >
          <section className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-2">
            <h2 className="text-[13.5px] font-semibold text-slate-900">Profile</h2>

            <p className="mt-0.5 text-[12px] text-slate-500">
              Shown next to records you add.
            </p>

            <div className="mt-4 flex items-center gap-4">
              <Avatar name={values.name} seed={values.email} size="lg" />

              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium text-slate-800">
                  {values.name || "Unnamed"}
                </p>

                <p className="text-[12px] text-slate-500">{values.role}</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Full name" htmlFor="settings-name" required>
                <Input
                  id="settings-name"
                  value={values.name}
                  onChange={(event) => set("name", event.target.value)}
                />
              </Field>

              <Field label="Email" htmlFor="settings-email">
                <Input
                  id="settings-email"
                  type="email"
                  value={values.email}
                  onChange={(event) => set("email", event.target.value)}
                />
              </Field>

              <Field label="Department" htmlFor="settings-department">
                <Input
                  id="settings-department"
                  value={values.department}
                  onChange={(event) => set("department", event.target.value)}
                />
              </Field>

              <Field label="Role" htmlFor="settings-role">
                <Select
                  id="settings-role"
                  value={values.role}
                  onChange={(event) => set("role", event.target.value)}
                >
                  {ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="text-[13.5px] font-semibold text-slate-900">
              Notifications
            </h2>

            <p className="mt-0.5 text-[12px] text-slate-500">
              How this console keeps you posted.
            </p>

            <div className="mt-4">
              <Row
                label="Email notifications"
                description="Send a summary when records change."
                checked={values.emailNotifications}
                onChange={(value) => set("emailNotifications", value)}
              />

              <Row
                label="Weekly digest"
                description="One round-up every Monday morning."
                checked={values.weeklyDigest}
                onChange={(value) => set("weeklyDigest", value)}
              />

              <Row
                label="Overdue alerts"
                description="Flag assignments past their due date."
                checked={values.overdueAlerts}
                onChange={(value) => set("overdueAlerts", value)}
              />
            </div>
          </section>
        </form>
      </div>
    </>
  );
}

