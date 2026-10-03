// src/utils/assignment.js
// Display helpers shared by the assignments table and its detail modal.
import { formatMonthYear } from './date.js';

/** Statuses an assignment can carry, in the order the pills appear. */
export const ASSIGNMENT_STATUSES = ['Pending', 'Submitted', 'Overdue'];

const STATUS_TONES = {
  Pending: 'bg-amber-50 text-amber-700',
  Submitted: 'bg-emerald-50 text-emerald-700',
  Overdue: 'bg-rose-50 text-rose-600',
};

/** Pill classes for a status; anything unexpected falls back to neutral. */
export const assignmentStatusTone = (status) =>
  STATUS_TONES[status] || 'bg-slate-100 text-slate-600';

// The course dropdown shows the course name while matching on the stored code.
export { courseOptionsOf } from './course.js';

/** "2025-05-15" -> "2025-05", the bucket the due-date filter works in. */
export const dueMonthOf = (assignment) => {
  const match = String(assignment?.dueDate || '').match(/^(\d{4})-(\d{2})/);

  return match ? match[0] : '';
};

/** Due months present in the list, oldest first ("2025-04", "2025-05"). */
export const dueMonthsOf = (assignments = []) =>
  [...new Set(assignments.map(dueMonthOf).filter(Boolean))].sort();

/** "2025-05" -> "May 2025" for the dropdown. */
export const dueMonthLabel = (month) =>
  /^\d{4}-\d{2}$/.test(String(month)) ? formatMonthYear(`${month}-01`) : '';

const dueTime = (assignment) => {
  const time = new Date(assignment?.dueDate || '').getTime();

  // Rows without a usable deadline sort to the end instead of the front.
  return Number.isNaN(time) ? Number.POSITIVE_INFINITY : time;
};

/** Earliest deadline first, so the table reads as a work queue. */
export const sortByDueDate = (assignments = []) =>
  [...assignments].sort((a, b) => dueTime(a) - dueTime(b));

/** Free-text, course, due-month and status filters used by the table. */
export const matchesAssignment = (
  assignment,
  { query = '', course = '', dueMonth = '', status = '' } = {}
) => {
  if (course && assignment?.course !== course) return false;
  if (dueMonth && dueMonthOf(assignment) !== dueMonth) return false;
  if (status && assignment?.status !== status) return false;

  const needle = String(query).trim().toLowerCase();
  if (!needle) return true;

  return [
    assignment?.title,
    assignment?.course,
    assignment?.subject,
    assignment?.instructor,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .includes(needle);
};

/** How many rows were added in the current calendar month. */
export const addedThisMonth = (assignments = []) => {
  const thisMonth = formatMonthYear();

  return assignments.filter(
    (assignment) =>
      assignment?.addedOn && formatMonthYear(assignment.addedOn) === thisMonth
  ).length;
};

/** "62.5%" — the share of the list a status accounts for. */
export const sharePercent = (count, total) =>
  total > 0 ? `${((count / total) * 100).toFixed(1)}%` : '0.0%';

/** How many rows carry each status, e.g. { Pending: 5, Submitted: 2, Overdue: 1 }. */
export const statusCounts = (assignments = []) =>
  ASSIGNMENT_STATUSES.reduce((counts, status) => {
    counts[status] = assignments.filter(
      (assignment) => assignment?.status === status
    ).length;

    return counts;
  }, {});

/**
 * Normalises a record from GET /student/assignments. Deadline, course code and
 * status are stored with the row, so nothing is inferred or filled in here.
 */
export const fromAssignmentRecord = (record = {}, index = 0) => ({
  id: record._id || `assignment-${index}`,
  title: record.title || 'Untitled assignment',
  course: record.course || '',
  subject: record.subject || 'Subject not listed',
  dueDate: record.dueDate || '',
  status: record.status || 'Pending',
  instructor: record.instructor || 'Instructor not listed',
  department: record.department || '',
  semester: record.semester || '',
  desc: record.description || '',
  fileName: record.originalName || record.fileName || '',
  fileSize: record.fileSize,
  fileUrl: record.fileUrl || '',
  uploaded: true,
  addedOn: record.createdAt || '',
});

