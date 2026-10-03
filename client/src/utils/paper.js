// src/utils/paper.js
// Display helpers shared by the past-paper surfaces.

// File sizes are formatted the same way on every table, so the helper lives in
// the shared formatter module and is re-exported here for the paper surfaces.
export { formatFileSize } from './format.js';

export const EXAM_LABELS = {
  Mid: 'Midterm',
  Final: 'Final',
};

/** Display label for the stored exam value ("Mid" -> "Midterm"). */
export const examLabel = (exam) => EXAM_LABELS[exam] || exam || 'Exam';

/** Pill colours for the exam-type column. */
export const examTone = (exam) => {
  const label = examLabel(exam);

  if (label === 'Final') return 'bg-emerald-50 text-emerald-700';
  if (label === 'Midterm') return 'bg-blue-50 text-blue-700';

  return 'bg-slate-100 text-slate-600';
};

/** Course code when the record carries one, otherwise the batch (e.g. "SP23"). */
export const courseCode = (paper = {}) => paper.courseCode || paper.batch || '—';
