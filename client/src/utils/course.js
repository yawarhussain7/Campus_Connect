// src/utils/course.js
// Course filter options.
//
// A record stores the course twice: a code (`course`, e.g. "CS305") and the
// human name (`subject`, e.g. "Operating Systems"). The filter dropdowns show
// the name, while the code stays the option value so the existing matching
// logic (which compares against the stored code) keeps working.

// The list pages fall back to this text when a record carries no subject; it
// should never be offered as a course name.
const MISSING_SUBJECT = 'Subject not listed';

const labelFor = (name, code) =>
  name && name !== MISSING_SUBJECT ? name : code;

/**
 * `[{ value: <course code>, label: <course name> }]` for the courses present in
 * `records`, sorted by the shown name.
 */
export const courseOptionsOf = (records = []) => {
  const namesByCode = new Map();

  records.forEach((record) => {
    const code = record?.course;
    if (!code) return;

    // First real name wins; a later blank never overwrites it.
    if (!namesByCode.get(code)) {
      namesByCode.set(code, record?.subject || '');
    }
  });

  return [...namesByCode.entries()]
    .map(([value, name]) => ({ value, label: labelFor(name, value) }))
    .sort((a, b) => a.label.localeCompare(b.label));
};