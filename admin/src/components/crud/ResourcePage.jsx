import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ArrowUpDown,
  CircleAlert,
  Ellipsis,
  Eye,
  Inbox,
  Loader2,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  SearchX,
  Trash,
  X,
} from "lucide-react";

import { cx } from "../../lib/format";
import { apiErrorMessage } from "../../lib/api";
import { useData } from "../../store/dataContext";

import Button, { IconButton } from "../ui/Button";
import ConfirmDialog from "../ui/ConfirmDialog";
import Drawer from "../ui/Drawer";
import EmptyState from "../ui/EmptyState";
import { Input } from "../ui/Field";
import FilterMenu from "../ui/FilterMenu";
import FilterTabs from "../ui/FilterTabs";
import Menu, { MenuItem } from "../ui/Menu";
import PageHeader from "../ui/PageHeader";
import Pagination from "../ui/Pagination";
import StatCard from "../ui/StatCard";
import { useToast } from "../ui/toastContext";
import RecordForm from "./RecordForm";

/** Five rows per page, so the numbered pager is always meaningful. */
const PAGE_SIZE = 5;
const ALL = "all";

function matches(record, query, keys) {
  if (!query) return true;

  const needle = query.trim().toLowerCase();

  return keys.some((key) => String(record?.[key] ?? "").toLowerCase().includes(needle));
}

/** A filter may list plain strings or { value, label } pairs. */
function normaliseOptions(options = []) {
  return options.map((option) =>
    typeof option === "string" ? { value: option, label: option } : option
  );
}

function matchesFilters(record, filters, values) {
  return filters.every((filter) => {
    const selected = values[filter.key];

    return selected === ALL || String(record[filter.key] ?? "") === selected;
  });
}

/** { value: count } for one field across a list of records. */
function countValues(records, key) {
  const counts = {};

  for (const record of records) {
    const value = String(record[key] ?? "");

    counts[value] = (counts[value] ?? 0) + 1;
  }

  return counts;
}

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
];

function byCreatedAt(order) {
  return (a, b) =>
    order === "oldest"
      ? String(a.createdAt ?? "").localeCompare(String(b.createdAt ?? ""))
      : String(b.createdAt ?? "").localeCompare(String(a.createdAt ?? ""));
}

/** The detail view reuses the form config, so there is nothing extra to map. */
function detailValue(field, record) {
  const value = record[field.name];

  if (field.type === "checkbox") return value ? "Yes" : "No";

  // Optional display hook, e.g. mapping a role code to its label.
  if (field.format) {
    const formatted = field.format(value);

    return formatted === null || formatted === undefined || formatted === ""
      ? "—"
      : String(formatted);
  }

  return value === null || value === undefined || value === "" ? "—" : String(value);
}

export default function ResourcePage({
  title,
  description,
  icon,
  tone = "indigo",
  singular,
  collection,
  columns,
  fields,
  searchKeys,
  filters = [],
  stats,
  emptyTitle,
  emptyMessage,
  // Read-only tables (e.g. pre-integration) hide every create/edit/delete
  // affordance and keep just the detail view.
  readOnly = false,
  // Optional node — or (rows) => node — rendered between the stat cards and
  // the table, e.g. the signup graph.
  insights = null,
  // Rows for the detail drawer; defaults to the form config. Lets a page add
  // read-only facts (like a join date) that must never appear as inputs.
  detailFields = fields,
  // Optional — (record) => [{ key, label, icon, danger, onSelect }] splices
  // page-specific entries into the row menu between Edit and Delete (the Users
  // screen's verify-email / block actions live here).
  rowActions = null,
}) {
  const { records, create, update, remove, loading, error, reload } = useData();
  const toast = useToast();

  const [params, setParams] = useSearchParams();
  const [filterValues, setFilterValues] = useState(() =>
    Object.fromEntries(filters.map((filter) => [filter.key, ALL]))
  );
  const [order, setOrder] = useState("newest");
  const [page, setPage] = useState(1);
  // True while a create / update / delete is in flight, so a second click
  // cannot fire a duplicate request.
  const [saving, setSaving] = useState(false);

  /** The term lives in the URL so the topbar search can pre-filter this table. */
  const query = params.get("q") ?? "";

  const [form, setForm] = useState(null);
  const [details, setDetails] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const rows = records[collection];

  const setQuery = (value) => {
    setParams(
      (current) => {
        const next = new URLSearchParams(current);

        if (value) next.set("q", value);
        else next.delete("q");

        return next;
      },
      { replace: true }
    );

    setPage(1);
  };

  /** Filters gain normalised options plus the control that suits their length. */
  const filterConfig = useMemo(
    () =>
      filters.map((filter) => {
        const options = normaliseOptions(filter.options);

        return {
          ...filter,
          options,
          variant: filter.variant ?? (options.length <= 4 ? "tabs" : "menu"),
        };
      }),
    [filters]
  );

  const searchMatched = useMemo(
    () => rows.filter((record) => matches(record, query, searchKeys)),
    [rows, query, searchKeys]
  );

  const visible = useMemo(
    () =>
      searchMatched
        .filter((record) => matchesFilters(record, filterConfig, filterValues))
        .sort(byCreatedAt(order)),
    [searchMatched, filterConfig, filterValues, order]
  );

  /**
   * Option counts for every filter, worked out with the *other* filters (and the
   * search box) still applied, so each number predicts what clicking it shows.
   */
  const filterCounts = useMemo(
    () =>
      Object.fromEntries(
        filterConfig.map((filter) => {
          const rest = filterConfig.filter((other) => other.key !== filter.key);

          const basis = searchMatched.filter((record) =>
            matchesFilters(record, rest, filterValues)
          );

          return [filter.key, { [ALL]: basis.length, ...countValues(basis, filter.key) }];
        })
      ),
    [filterConfig, filterValues, searchMatched]
  );

  const tabFilters = filterConfig.filter((filter) => filter.variant === "tabs");
  const menuFilters = filterConfig.filter((filter) => filter.variant === "menu");

  const pageCount = Math.max(Math.ceil(visible.length / PAGE_SIZE), 1);
  const safePage = Math.min(page, pageCount);
  const start = (safePage - 1) * PAGE_SIZE;
  const pageRows = visible.slice(start, start + PAGE_SIZE);

  const isFiltered =
    Boolean(query) || Object.values(filterValues).some((value) => value !== ALL);

  /** A page passes either a ready-made list or a function of its own rows. */
  const statCards = typeof stats === "function" ? stats(rows) : stats ?? [];
  const insightsNode = typeof insights === "function" ? insights(rows) : insights;

  const openCreate = () => setForm({ record: null });

  const setFilter = (key, value) => {
    setFilterValues((current) => ({ ...current, [key]: value }));
    setPage(1);
  };

  /** Clicking a stat card applies the filter it stands for, or clears it. */
  const toggleStat = (filter) => {
    setFilterValues((current) => ({
      ...current,
      [filter.key]: current[filter.key] === filter.value ? ALL : filter.value,
    }));

    setPage(1);
  };

  const isStatActive = (filter) =>
    Boolean(filter) && filterValues[filter.key] === filter.value;

  const resetFilters = () => {
    setQuery("");
    setOrder("newest");
    setFilterValues(Object.fromEntries(filters.map((filter) => [filter.key, ALL])));
    setPage(1);
  };

  /**
   * Writes go to the API; the drawer only closes once the server confirms, so
   * a validation error (400 with field messages) or a down server surfaces as a
   * toast instead of silently losing the edit.
   */
  const submit = async (values) => {
    if (saving) return;

    setSaving(true);

    try {
      if (form?.record) {
        await update(collection, form.record.id, values);
        toast.success(`${singular} updated`);
      } else {
        await create(collection, values);
        toast.success(`${singular} created`);
      }

      setForm(null);
      setPage(1);
    } catch (saveError) {
      toast.error(apiErrorMessage(saveError));
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete || saving) return;

    const target = pendingDelete;

    setSaving(true);
    setPendingDelete(null);

    try {
      await remove(collection, target.id);
      toast.success(`${singular} deleted`);
    } catch (deleteError) {
      toast.error(apiErrorMessage(deleteError));
    } finally {
      setSaving(false);
    }
  };

  /** Shared by every row: view (and, unless read-only, edit + delete). */
  const rowMenu = (record) =>
    readOnly ? (
      <IconButton
        icon={Eye}
        onClick={() => setDetails(record)}
        label={`View ${record[columns[0].key] ?? singular}`}
      />
    ) : (
      <Menu
        panelClassName="w-[168px]"
        trigger={({ toggle }) => (
          <IconButton
            icon={Ellipsis}
            onClick={toggle}
            label={`Actions for ${record[columns[0].key] ?? singular}`}
          />
        )}
      >
        <MenuItem icon={Eye} onClick={() => setDetails(record)}>
          View details
        </MenuItem>

        <MenuItem icon={Pencil} onClick={() => setForm({ record })}>
          Edit
        </MenuItem>

        {/* Page-specific moderation entries (verify email, block/unblock). */}
        {(rowActions ? rowActions(record) : []).map(
          ({ key, label, icon, danger, onSelect }) => (
            <MenuItem key={key} icon={icon} danger={danger} onClick={onSelect}>
              {label}
            </MenuItem>
          )
        )}

        <MenuItem danger icon={Trash} onClick={() => setPendingDelete(record)}>
          Delete
        </MenuItem>
      </Menu>
    );

  return (
    <>
      <div className="px-6 py-6">
        <PageHeader
          icon={icon}
          tone={tone}
          title={title}
          description={description}
          action={
            readOnly ? null : (
              <Button icon={Plus} onClick={openCreate}>
                Add New {singular}
              </Button>
            )
          }
        />

        {statCards.length > 0 ? (
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map(({ filter, ...card }) => (
              <StatCard
                key={card.label}
                {...card}
                active={isStatActive(filter)}
                onClick={filter ? () => toggleStat(filter) : undefined}
              />
            ))}
          </div>
        ) : null}

        {insightsNode ? <div className="mt-5">{insightsNode}</div> : null}

        <section className="mt-5 rounded-xl border border-slate-200 bg-white">
          <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 px-4 py-3.5">
            <div className="relative w-full sm:w-[280px]">
              <Search
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <Input
                type="text"
                value={query}
                className="pl-9 pr-9"
                placeholder={`Search ${title.toLowerCase()}...`}
                onChange={(event) => setQuery(event.target.value)}
              />

              {query ? (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={14} strokeWidth={2.2} />
                </button>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
              {menuFilters.map((filter) => (
                <FilterMenu
                  key={filter.key}
                  label={filter.label}
                  icon={filter.icon}
                  options={filter.options}
                  value={filterValues[filter.key]}
                  counts={filterCounts[filter.key]}
                  onChange={(value) => setFilter(filter.key, value)}
                />
              ))}

              {menuFilters.length > 0 ? (
                <span className="hidden h-6 w-px bg-slate-200 sm:block" />
              ) : null}

              <FilterMenu
                accent={false}
                includeAll={false}
                label="Sort"
                icon={ArrowUpDown}
                options={SORT_OPTIONS}
                value={order}
                onChange={(value) => {
                  setOrder(value);
                  setPage(1);
                }}
              />

              {isFiltered ? (
                <Button variant="ghost" size="sm" icon={RotateCcw} onClick={resetFilters}>
                  Reset
                </Button>
              ) : null}
            </div>
          </div>

          {tabFilters.map((filter) => (
            <FilterTabs
              key={filter.key}
              options={filter.options}
              value={filterValues[filter.key]}
              counts={filterCounts[filter.key]}
              onChange={(value) => setFilter(filter.key, value)}
            />
          ))}

          {loading && rows.length === 0 ? (
            /* First load: the API is the source of truth, so wait for it. */
            <div className="flex flex-col items-center justify-center gap-3 py-14">
              <Loader2 className="h-6 w-6 animate-spin text-slate-400" />

              <p className="text-[13px] text-slate-500">
                Loading {title.toLowerCase()} from the server…
              </p>
            </div>
          ) : error && rows.length === 0 ? (
            /* The API is unreachable (or refused the session) — offer a retry
               instead of showing an empty catalogue. */
            <EmptyState
              icon={CircleAlert}
              title="Could not load data"
              message={error}
              action={<Button onClick={() => reload()}>Try again</Button>}
            />
          ) : pageRows.length === 0 ? (
            <EmptyState
              icon={isFiltered ? SearchX : Inbox}
              title={isFiltered ? "No matching records" : emptyTitle}
              message={
                isFiltered
                  ? "Nothing matches the current search or filters."
                  : emptyMessage
              }
              action={
                isFiltered ? (
                  <Button variant="secondary" onClick={resetFilters}>
                    Clear filters
                  </Button>
                ) : readOnly ? null : (
                  <Button icon={Plus} onClick={openCreate}>
                    Add New {singular}
                  </Button>
                )
              }
            />
          ) : (
            <>
              <div className="scroll-x">
                <table className="w-full min-w-[900px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/70">
                      <th className="w-[56px] px-4 py-3 text-[12.5px] font-semibold text-slate-500">
                        #
                      </th>

                      {columns.map((column) => (
                        <th
                          key={column.key}
                          className={cx(
                            "px-4 py-3 text-[12.5px] font-semibold text-slate-500",
                            column.headerClassName
                          )}
                        >
                          {column.label}
                        </th>
                      ))}

                      <th className="px-4 py-3 text-right text-[12.5px] font-semibold text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {pageRows.map((record, index) => (
                      <tr
                        key={record.id}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
                      >
                        <td className="px-4 py-3.5 align-middle text-[13px] text-slate-400">
                          {start + index + 1}
                        </td>

                        {columns.map((column) => (
                          <td
                            key={column.key}
                            className={cx(
                              "px-4 py-3.5 align-middle text-[13px] text-slate-700",
                              column.cellClassName
                            )}
                          >
                            {column.render
                              ? column.render(record)
                              : record[column.key] || "—"}
                          </td>
                        ))}

                        <td className="px-4 py-3.5 align-middle text-right">
                          {rowMenu(record)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Pagination
                page={safePage}
                pageCount={pageCount}
                from={start + 1}
                to={start + pageRows.length}
                total={visible.length}
                itemLabel={title.toLowerCase()}
                onChange={setPage}
              />
            </>
          )}
        </section>
      </div>

      {form ? (
        <RecordForm
          fields={fields}
          record={form.record}
          title={form.record ? `Edit ${singular}` : `New ${singular}`}
          description={
            form.record
              ? "Change the details below, then save."
              : `Add a ${singular.toLowerCase()} to the catalogue.`
          }
          submitLabel={
            saving
              ? form.record
                ? "Saving…"
                : "Creating…"
              : form.record
                ? "Save changes"
                : `Create ${singular}`
          }
          onSubmit={submit}
          onClose={() => setForm(null)}
        />
      ) : null}

      {details ? (
        <Drawer
          open
          width="md"
          onClose={() => setDetails(null)}
          title={String(details[columns[0].key] ?? singular)}
          description="Read-only view of this record."
          footer={
            <div className="flex items-center justify-end gap-2">
              <Button variant="secondary" onClick={() => setDetails(null)}>
                Close
              </Button>

              {readOnly ? null : (
                <Button
                  icon={Pencil}
                  onClick={() => {
                    const record = details;

                    setDetails(null);
                    setForm({ record });
                  }}
                >
                  Edit
                </Button>
              )}
            </div>
          }
        >
          <dl className="space-y-3">
            {detailFields.map((field) => (
              <div
                key={field.name}
                className="flex gap-4 border-b border-slate-100 pb-3 last:border-0"
              >
                <dt className="w-[130px] shrink-0 text-[12.5px] font-medium text-slate-500">
                  {field.label}
                </dt>

                <dd className="min-w-0 flex-1 break-words text-[13px] text-slate-800">
                  {detailValue(field, details)}
                </dd>
              </div>
            ))}
          </dl>
        </Drawer>
      ) : null}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={`Delete ${singular.toLowerCase()}?`}
        message="This record will be removed from the list. This cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  );
}

