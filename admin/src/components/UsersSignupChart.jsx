import { useMemo } from "react";

import { useData } from "../store/dataContext";

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const WINDOW_MONTHS = 6;

/** The last `WINDOW_MONTHS` calendar months, oldest first, as { key, ... }. */
function buildWindow() {
  const months = [];
  const now = new Date();

  for (let offset = WINDOW_MONTHS - 1; offset >= 0; offset -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - offset, 1);

    months.push({
      key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
      label: MONTH_LABELS[date.getMonth()],
      year: date.getFullYear(),
    });
  }

  return months;
}

/**
 * Bar chart of signups: how many accounts joined in each of the last six
 * months, built from the live `users` list (pure Tailwind/CSS bars — the admin
 * panel ships no charting library). Reads the shared store directly so the
 * graph always shows every account, unaffected by the table's search/filters.
 */
export default function UsersSignupChart() {
  const { records, loading } = useData();
  // Degrade to the empty state rather than crashing the whole Overview if the
  // store ever loads without the accounts collection (memo keeps the fallback
  // reference stable so the month-bucketing memo below never re-runs).
  const users = useMemo(() => records.users ?? [], [records.users]);

  const monthWindow = useMemo(() => buildWindow(), []);

  const buckets = useMemo(() => {
    const counts = Object.fromEntries(monthWindow.map((month) => [month.key, 0]));

    for (const user of users) {
      const key = String(user.createdAt || "").slice(0, 7);

      if (key in counts) counts[key] += 1;
    }

    return monthWindow.map((month) => ({ ...month, value: counts[month.key] }));
  }, [monthWindow, users]);

  const total = users.length;
  const inWindow = buckets.reduce((sum, bucket) => sum + bucket.value, 0);
  const earlier = total - inWindow;
  const peak = Math.max(...buckets.map((bucket) => bucket.value));
  const thisMonth = buckets[buckets.length - 1]?.value ?? 0;

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-3.5">
        <div>
          <h2 className="text-[13.5px] font-semibold text-slate-900">
            User signups
          </h2>
          <p className="mt-0.5 text-[12px] text-slate-500">
            New accounts joined per month, last {WINDOW_MONTHS} months
          </p>
        </div>

        <div className="text-right">
          <p className="text-[19px] font-bold leading-tight text-slate-900">
            {loading && total === 0 ? "…" : total}
          </p>
          <p className="text-[11.5px] text-slate-500">
            {thisMonth} joined this month
          </p>
        </div>
      </header>

      <div className="px-5 py-4">
        {!loading && total === 0 ? (
          <p className="py-6 text-center text-[12.5px] text-slate-500">
            No accounts have joined yet.
          </p>
        ) : (
          <>
            <div className="flex items-end gap-2 sm:gap-4">
              {buckets.map((bucket) => (
                <div
                  key={bucket.key}
                  className="flex min-w-0 flex-1 flex-col items-center gap-1.5"
                  title={`${bucket.label} ${bucket.year}: ${bucket.value} joined`}
                >
                  <span className="text-[11px] font-semibold text-slate-600">
                    {bucket.value}
                  </span>

                  <div className="flex h-28 w-full items-end">
                    {bucket.value > 0 ? (
                      <div
                        className="w-full rounded-t-md bg-indigo-500 transition-all duration-500"
                        style={{
                          // Scale against the busiest month, but never let a
                          // real signup render as an invisible sliver.
                          height: `${Math.max((bucket.value / peak) * 100, 8)}%`,
                        }}
                      />
                    ) : (
                      <div className="h-[3px] w-full rounded bg-slate-100" />
                    )}
                  </div>

                  <span className="text-[10.5px] text-slate-400">
                    {bucket.label} &rsquo;{String(bucket.year).slice(2)}
                  </span>
                </div>
              ))}
            </div>

            {earlier > 0 ? (
              <p className="mt-2.5 text-[11.5px] text-slate-400">
                {earlier} account{earlier === 1 ? "" : "s"} joined before this{" "}
                {WINDOW_MONTHS}-month window.
              </p>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}