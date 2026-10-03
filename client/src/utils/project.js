// src/utils/project.js
// Display helpers shared by the projects table and its detail modal.

/** Statuses a project can carry, in the order the pills appear. */
export const PROJECT_STATUSES = ['Pending', 'Submitted', 'Overdue'];

const STATUS_TONES = {
  Pending: 'bg-amber-50 text-amber-700',
  Submitted: 'bg-emerald-50 text-emerald-700',
  Overdue: 'bg-rose-50 text-rose-600',
};

/** Pill classes for a status; anything unexpected falls back to neutral. */
export const statusTone = (status) =>
  STATUS_TONES[status] || 'bg-slate-100 text-slate-600';

/** Course codes present in the list, sorted so the dropdown reads naturally. */
export const courseCodesOf = (projects = []) =>
  [...new Set(projects.map((project) => project?.course).filter(Boolean))].sort();

const dueTime = (project) => {
  const time = new Date(project?.dueDate || '').getTime();

  // Projects without a usable date sort to the end instead of the front.
  return Number.isNaN(time) ? Number.POSITIVE_INFINITY : time;
};

/** Earliest deadline first, so the table reads as a work queue. */
export const sortByDueDate = (projects = []) =>
  [...projects].sort((a, b) => dueTime(a) - dueTime(b));

/** Free-text and course filter used by the projects table. */
export const matchesProject = (project, { query = '', course = '' } = {}) => {
  if (course && project?.course !== course) return false;

  const needle = String(query).trim().toLowerCase();
  if (!needle) return true;

  return [project?.title, project?.course, project?.subject]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .includes(needle);
};

/**
 * Normalises a record from GET /student/projects. The server already stores the
 * columns the table shows, so this only maps the row id and the file metadata.
 */
export const fromProjectRecord = (record = {}, index = 0) => ({
  id: record._id || `project-${index}`,
  title: record.title || 'Untitled project',
  course: record.course || '',
  subject: record.subject || 'Subject not listed',
  dueDate: record.dueDate || '',
  status: record.status || 'Pending',
  repo: record.repo || '',
  desc: record.desc || record.description || '',
  department: record.department || '',
  semester: record.semester || '',
  fileName: record.originalName || record.fileName || '',
  fileSize: record.fileSize,
  fileUrl: record.fileUrl || '',
  uploaded: true,
  addedOn: record.createdAt || '',
});

