// src/utils/departments.js
// Single source of truth for every department dropdown in the student app.

/** Every department, in the order the dropdowns list them. */
export const DEPARTMENTS = [
  'Computer Science',
  'Computer Engineering',
  'Software Engineering',
  'Artificial Intelligence',
  'Electrical Engineering',
  'Civil Engineering',
  'Biotechnology',
  'Environmental Sciences',
  'Pharmacy',
  'Medical Laboratory Technology',
  'Management Sciences',
  'Business Data Analytics',
  'Economics',
  'Development Studies',
  'English',
  'Psychology',
  'Mathematics',
  'Geology',
  'Chemistry',
  'Physics',
];

/** The { value, label } shape ModernSelect consumes. */
export const departmentOptions = DEPARTMENTS.map((name) => ({
  value: name,
  label: name,
}));

/**
 * The canonical list plus any extra value already stored on loaded rows, so
 * legacy names (e.g. "Mechanical Eng.") stay selectable in filter menus.
 */
export const mergeDepartments = (extras = []) => {
  const extra = extras
    .filter((name) => name && !DEPARTMENTS.includes(name))
    .sort();

  return [...DEPARTMENTS, ...extra];
};
