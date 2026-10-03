// src/utils/teacher.js
// Display helpers for the COMSATS faculty directory behind the review surfaces.

/** Lower-cased name used to match a directory entry to a review row. */
const nameKey = (value) => String(value || '').trim().toLowerCase();

/** Distinct, non-empty values, A→Z. */
const uniqueSorted = (values = []) => [...new Set(values.filter(Boolean))].sort();

/**
 * Normalises a record from GET /cui-teachers. The directory carries the
 * designation, department and campus scraped from COMSATS, so `role` reads as
 * the real designation ("Professor") rather than the generic "Faculty" the
 * review rows fall back to on their own.
 */
export const fromTeacherRecord = (record = {}, index = 0) => ({
  id: record._id || `teacher-${index}`,
  uid: record.uid || '',
  name: record.name || 'Unnamed teacher',
  role: record.designation || record.department || 'Faculty',
  designation: record.designation || '',
  department: record.department || '',
  campus: record.campus || '',
  avatar: record.image || '',
  email: record.email || '',
  profileUrl: record.profileUrl || '',
});

/** "Computer Science, Lahore Campus", or "" when the directory has neither. */
export const affiliationOf = (teacher) =>
  [
    teacher?.department,
    teacher?.campus ? `${teacher.campus} Campus` : '',
  ]
    .filter(Boolean)
    .join(', ');

/**
 * The campus a review belongs to: the teacher's, taken from the directory, or -
 * for a teacher the directory does not carry - the campus the student picked in
 * the composer (or the one baked into the seed row).
 */
export const campusOf = (review) =>
  review?.teacherCampus || review?.campus || '';

/**
 * Campuses for the filter and the composer: the directory's, plus any campus a
 * review already carries. Falling back to the reviews keeps both pickers usable
 * when the directory cannot be reached (the composer's campus is required).
 */
export const campusChoicesOf = (teachers = [], reviews = []) =>
  uniqueSorted([
    ...teachers.map((teacher) => teacher.campus),
    ...reviews.map((review) => review.campus),
  ]);

/** The directory keyed by name, so a review row can borrow the teacher details. */
export const directoryByName = (teachers = []) =>
  new Map(teachers.map((teacher) => [nameKey(teacher.name), teacher]));

/**
 * Adds the directory's role, photo, department and profile link to a review row.
 * A row whose teacher is not in the directory keeps the details it came with.
 */
export const withDirectoryDetails = (review, directory = new Map()) => {
  const teacher = directory.get(nameKey(review?.teacher));

  if (!teacher) return review;

  return {
    ...review,
    teacherId: teacher.id,
    teacherRole: teacher.role || review.teacherRole,
    teacherAvatar: teacher.avatar || review.teacherAvatar,
    teacherDepartment: teacher.department || '',
    teacherCampus: teacher.campus || '',
    teacherProfileUrl: teacher.profileUrl || '',
  };
};

/**
 * Every teacher the pickers can be pointed at: the whole directory plus any
 * teacher a review mentions that the directory does not carry, de-duplicated by
 * name so both lists stay A→Z.
 */
export const teacherDirectoryList = (teachers = [], reviews = []) => {
  const byName = new Map(
    teachers.map((teacher) => [
      nameKey(teacher.name),
      { name: teacher.name, role: teacher.role, avatar: teacher.avatar },
    ])
  );

  for (const review of reviews) {
    const key = nameKey(review?.teacher);

    if (!key || byName.has(key)) continue;

    byName.set(key, {
      name: review.teacher,
      role: review.teacherRole || 'Faculty',
      avatar: review.teacherAvatar || '',
    });
  }

  return [...byName.values()].sort((a, b) => a.name.localeCompare(b.name));
};
