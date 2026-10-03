// src/utils/date.js
// Small, dependency-free date helpers shared by the dashboard surfaces.

const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const DAYS_LONG = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday',
  'Thursday', 'Friday', 'Saturday',
];

// "2025-05-05" carries no time zone, so it is read as a local calendar day.
// Parsing it as UTC midnight would shift the day for anyone west of Greenwich.
const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

const toDate = (value) => {
  if (!value) return null;

  if (typeof value === 'string') {
    const parts = value.match(DATE_ONLY);

    if (parts) {
      const year = Number(parts[1]);
      const month = Number(parts[2]) - 1;
      const day = Number(parts[3]);
      const date = new Date(year, month, day);
      const isRealDay =
        date.getFullYear() === year &&
        date.getMonth() === month &&
        date.getDate() === day;

      // "2025-02-30" rolls over, so it is treated as unusable instead.
      return isRealDay ? date : null;
    }
  }

  const date = value instanceof Date ? value : new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
};

const startOfDay = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

/** "12 Oct" */
export const formatDayMonth = (value) => {
  const date = toDate(value);
  if (!date) return '—';

  return `${date.getDate()} ${MONTHS_SHORT[date.getMonth()]}`;
};

/** "Monday, 26 September 2026" */
export const formatLongDate = (value = new Date()) => {
  const date = toDate(value);
  if (!date) return '';

  return `${DAYS_LONG[date.getDay()]}, ${date.getDate()} ${MONTHS_SHORT[date.getMonth()]} ${date.getFullYear()}`;
};

/** "Sep 2026" */
export const formatMonthYear = (value = new Date()) => {
  const date = toDate(value);
  if (!date) return '';

  return `${MONTHS_SHORT[date.getMonth()]} ${date.getFullYear()}`;
};

/** "Apr 28, 2025" */
export const formatMediumDate = (value) => {
  const date = toDate(value);
  if (!date) return '—';

  return `${MONTHS_SHORT[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

/** "May 05, 2025" — as formatMediumDate, with a zero-padded day. */
export const formatPaddedDate = (value) => {
  const date = toDate(value);
  if (!date) return '—';

  return `${MONTHS_SHORT[date.getMonth()]} ${String(date.getDate()).padStart(
    2,
    '0'
  )}, ${date.getFullYear()}`;
};

/** Whole days between now and the given date (negative when overdue). */
export const daysUntil = (value) => {
  const date = toDate(value);
  if (!date) return null;

  const MS_PER_DAY = 86400000;

  return Math.round((startOfDay(date) - startOfDay(new Date())) / MS_PER_DAY);
};

/** "in 3 days" / "due today" / "2 days overdue" */
export const formatCountdown = (value) => {
  const date = toDate(value);
  if (!date) return '';

  const days = daysUntil(date);

  if (days === 0) return 'due today';
  if (days === 1) return 'due tomorrow';
  if (days > 1) return `in ${days} days`;
  if (days === -1) return '1 day overdue';

  return `${Math.abs(days)} days overdue`;
};

/** "just now" / "18m ago" / "4h ago" / "Yesterday" / "12 Sep" */
export const formatRelativeTime = (value) => {
  const date = toDate(value);
  if (!date) return '';

  const minutes = Math.round((Date.now() - date.getTime()) / 60000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = daysUntil(date);
  if (days === -1) return 'Yesterday';
  if (days > -7) return `${Math.abs(days)}d ago`;

  return formatDayMonth(date);
};

/** Current academic term label, e.g. "Spring 2026". */
export const currentTermLabel = (value = new Date()) => {
  const date = toDate(value) || new Date();
  const term = date.getMonth() < 6 ? 'Spring' : 'Fall';

  return `${term} ${date.getFullYear()}`;
};

/** "Good morning" / "Good afternoon" / "Good evening" */
export const greetingForNow = (value = new Date()) => {
  const date = toDate(value) || new Date();
  const hour = date.getHours();

  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';

  return 'Good evening';
};

export const firstNameOf = (fullName, fallback = 'there') => {
  if (!fullName || typeof fullName !== 'string') return fallback;

  return fullName.trim().split(/\s+/)[0] || fallback;
};
