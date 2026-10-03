import { Check, ChevronDown } from "lucide-react";

import { cx } from "../../lib/format";

import Menu, { MenuItem } from "./Menu";

/**
 * Pill-shaped dropdown used for long option lists (and the sort order). Turns
 * indigo while it is narrowing the table, so active filters are visible without
 * opening anything.
 */
export default function FilterMenu({
  label,
  icon: Icon,
  options,
  value,
  counts = {},
  onChange,
  includeAll = true,
  allLabel = "All",
  accent = true,
  panelClassName = "w-[230px]",
}) {
  const items = includeAll ? [{ value: "all", label: allLabel }, ...options] : options;
  const selected = items.find((item) => item.value === value) ?? items[0];
  const isActive = accent && selected && selected.value !== "all";

  return (
    <Menu
      panelClassName={panelClassName}
      trigger={({ open, toggle }) => (
        <button
          type="button"
          onClick={toggle}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label={label}
          className={cx(
            "inline-flex h-9 shrink-0 items-center gap-2 rounded-lg border px-3 text-[12.5px] transition-colors",
            isActive || open
              ? "border-indigo-200 bg-indigo-50"
              : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
          )}
        >
          {Icon ? (
            <Icon
              size={14}
              strokeWidth={2}
              className={isActive || open ? "text-indigo-500" : "text-slate-400"}
            />
          ) : null}

          <span className={cx("font-medium", isActive || open ? "text-indigo-500" : "text-slate-400")}>
            {label}
          </span>

          <span
            className={cx(
              "max-w-[140px] truncate font-semibold",
              isActive || open ? "text-indigo-700" : "text-slate-700"
            )}
          >
            {selected?.label ?? allLabel}
          </span>

          <ChevronDown
            size={14}
            strokeWidth={2}
            className={isActive || open ? "text-indigo-400" : "text-slate-400"}
          />
        </button>
      )}
    >
      {items.map((item) => {
        const isSelected = item.value === value;

        return (
          <MenuItem
            key={item.value}
            role="menuitemradio"
            aria-checked={isSelected}
            onClick={() => onChange(item.value)}
          >
            <span className="flex-1 truncate">{item.label}</span>

            {counts[item.value] === undefined ? null : (
              <span className="text-[11.5px] text-slate-400">{counts[item.value]}</span>
            )}

            <Check
              size={14}
              strokeWidth={2.4}
              className={isSelected ? "text-indigo-600" : "opacity-0"}
            />
          </MenuItem>
        );
      })}
    </Menu>
  );
}
