import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';


export default function ModernSelect({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  icon,
  hideLabel = false,
  // Keeps the label inside the trigger, next to the icon. Used by the filter
  // bars, where a compact control that still names itself reads better.
  stacked = false,
  required = false,
  // Adds a search box to the open panel. The teacher directory runs to a few
  // thousand names, which is only usable when the list can be filtered as you
  // type. Off by default, so the short dropdowns are unchanged.
  searchable = false,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [query, setQuery] = useState('');
  const containerRef = useRef(null);
  const searchRef = useRef(null);

  /**
   * Closing always clears the search, so the panel reopens with the full list
   * instead of the filter left behind last time.
   */
  const closePanel = () => {
    setIsOpen(false);
    setQuery('');
    setHighlightedIndex(-1);
  };

  const selectOption = (option) => {
    onChange(option.value);
    closePanel();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setQuery('');
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // The search box is the first thing the reader needs when the panel opens.
  useEffect(() => {
    if (isOpen && searchable) searchRef.current?.focus();
  }, [isOpen, searchable]);

  const searchTerm = query.trim().toLowerCase();
  // Keyboard navigation and the list itself both work off the filtered options.
  const visibleOptions =
    searchable && searchTerm
      ? options.filter((option) =>
          String(option.label).toLowerCase().includes(searchTerm)
        )
      : options;

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();

      if (isOpen) closePanel();
      else setIsOpen(true);

      return;
    }

    if (event.key === 'Escape') {
      closePanel();
      return;
    }

    if (!isOpen) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightedIndex((previous) =>
        previous < visibleOptions.length - 1 ? previous + 1 : 0
      );
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightedIndex((previous) =>
        previous > 0 ? previous - 1 : visibleOptions.length - 1
      );
      return;
    }

    if (event.key === 'Enter' && highlightedIndex >= 0) {
      event.preventDefault();
      selectOption(visibleOptions[highlightedIndex]);
    }
  };

  /**
   * The search field owns the typing, so only the navigation keys are caught
   * here: Space would otherwise close the panel and Enter jump to an option.
   */
  const handleSearchKeyDown = (event) => {
    if (event.key === 'Escape') {
      closePanel();
      return;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();

      setHighlightedIndex((previous) => {
        if (event.key === 'ArrowUp') {
          return previous > 0 ? previous - 1 : visibleOptions.length - 1;
        }

        return previous < visibleOptions.length - 1 ? previous + 1 : 0;
      });
      return;
    }

    if (
      event.key === 'Enter' &&
      highlightedIndex >= 0 &&
      visibleOptions[highlightedIndex]
    ) {
      event.preventDefault();
      selectOption(visibleOptions[highlightedIndex]);
    }
  };

  const selectedOption = options.find((option) => option.value === value);
  // Icons arrive as forwardRef objects (lucide) rather than plain functions, so
  // both shapes are accepted as a renderable component.
  const TriggerIcon =
    icon && (typeof icon === 'function' || typeof icon === 'object') ? icon : null;
  // Non-stacked selects are used as bare inputs with no visible label, so the
  // icon gives them the anchor the stacked variant gets from its label line.
  const showInlineIcon = Boolean(TriggerIcon) && (hideLabel || !label);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && hideLabel && <span className="sr-only">{label}</span>}

      {label && !hideLabel && !stacked && (
        <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.07em] text-slate-500">
          {icon && <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />}

          {label}

          {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <button
        type="button"
        onClick={() => (isOpen ? closePanel() : setIsOpen(true))}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={stacked || hideLabel ? label : undefined}
        className={`flex w-full items-center justify-between rounded-[10px] border border-slate-200 bg-white px-3 text-left transition hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/15 ${
          stacked ? 'h-11 gap-2.5' : 'h-10 gap-2'
        }`}
      >
        {stacked ? (
          <>
            {TriggerIcon && (
              <TriggerIcon className="h-4 w-4 shrink-0 text-slate-400" />
            )}

            <span className="min-w-0 flex-1">
              <span className="block truncate text-[10.5px] leading-4 text-slate-400">
                {label}
              </span>

              <span
                className={`block truncate text-[12.5px] leading-4 ${
                  selectedOption
                    ? 'font-medium text-slate-800'
                    : 'text-slate-400'
                }`}
              >
                {selectedOption ? selectedOption.label : placeholder}
              </span>
            </span>
          </>
        ) : (
          <>
            {showInlineIcon && (
              <TriggerIcon className="h-4 w-4 shrink-0 text-slate-400" />
            )}

            <span
              className={`min-w-0 flex-1 truncate ${
                selectedOption ? 'font-medium text-slate-800' : 'text-slate-400'
              }`}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </>
        )}

        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute z-50 mt-1.5 max-h-[280px] w-full overflow-y-auto rounded-[10px] border border-slate-200 bg-white p-1 shadow-[0_12px_32px_rgba(15,23,42,0.10)]"
        >
          {/* Sticky so the search box stays reachable while the list scrolls. */}
          {searchable && (
            <div className="sticky top-0 z-10 bg-white pb-1">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />

                <input
                  ref={searchRef}
                  type="text"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setHighlightedIndex(0);
                  }}
                  onKeyDown={handleSearchKeyDown}
                  placeholder={`Search ${label ? label.toLowerCase() : 'options'}...`}
                  aria-label={`Search ${label || 'options'}`}
                  className="h-9 w-full rounded-[8px] border border-slate-200 bg-slate-50/80 pl-8 pr-2.5 text-[12.5px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white"
                />
              </div>
            </div>
          )}

          {visibleOptions.length === 0 && (
            <p className="px-2.5 py-2 text-[12px] text-slate-400">
              No options available
            </p>
          )}

          {visibleOptions.map((option, index) => {
            const isSelected = value === option.value;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => selectOption(option)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-2 text-left text-[12.5px] transition ${
                  isSelected
                    ? 'bg-blue-50 font-medium text-blue-700'
                    : highlightedIndex === index
                    ? 'bg-slate-50 text-slate-900'
                    : 'text-slate-600'
                }`}
              >
                <span className="truncate">{option.label}</span>

                {isSelected && (
                  <Check className="h-3.5 w-3.5 shrink-0 text-blue-600" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
