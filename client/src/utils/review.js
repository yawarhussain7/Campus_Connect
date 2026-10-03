// src/utils/review.js
// Display helpers shared by the teacher-review surfaces.

const STAR_MAX = 5;

/** Verdicts a review can carry, in the order the summary tiles show them. */
export const SENTIMENTS = ['Positive', 'Neutral', 'Negative'];

/** Titles that should not end up in a teacher's initials. */
const HONORIFICS = /^(dr|prof|professor|mr|mrs|ms|miss|sir|engr)\.?$/i;

const TERM_ORDER = { Spring: 1, Summer: 2, Fall: 3 };

/**
 * Stored verdict when the record carries one, otherwise derived from its stars.
 * The stored value wins because a 4.0 can be logged as either positive or neutral.
 */
export const sentimentOf = (review = {}) => {
  if (SENTIMENTS.includes(review.sentiment)) return review.sentiment;

  const rating = Number(review.rating) || 0;

  if (rating >= 4) return 'Positive';
  if (rating >= 3) return 'Neutral';

  return 'Negative';
};

/** Pill colours for the status column. */
export const sentimentTone = (review) => {
  const sentiment = sentimentOf(review);

  if (sentiment === 'Positive') return 'bg-emerald-50 text-emerald-700';
  if (sentiment === 'Neutral') return 'bg-amber-50 text-amber-700';

  return 'bg-rose-50 text-rose-700';
};

/** Rating as it reads in the table: 4 -> "4.0". */
export const ratingLabel = (rating) => (Number(rating) || 0).toFixed(1);

/** Star slots for a rating: 4 -> [true, true, true, true, false]. */
export const starSlots = (rating) => {
  const filled = Math.round(Number(rating) || 0);

  return Array.from({ length: STAR_MAX }, (_, index) => index < filled);
};

/** Mean of the ratings to one decimal place. 0 when there is nothing to average. */
export const averageRating = (reviews = []) => {
  const ratings = reviews
    .map((review) => Number(review.rating))
    .filter((rating) => !Number.isNaN(rating));

  if (!ratings.length) return 0;

  const total = ratings.reduce((sum, rating) => sum + rating, 0);

  return Number((total / ratings.length).toFixed(1));
};

/** How many votes each star holds, best rating first: 5 → 1. */
export const ratingBreakdown = (reviews = []) =>
  [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter(
      (review) => Math.round(Number(review?.rating) || 0) === stars
    ).length,
  }));

/**
 * Share of the votes one star count holds, as a number, so it can size a bar.
 * (`shareOf` below is the same idea, formatted for display.)
 */
export const voteShare = (count, total) =>
  total > 0 ? Math.round((count / total) * 100) : 0;

/** { Positive: 21, Neutral: 2, Negative: 1 } */
export const sentimentCounts = (reviews = []) =>
  reviews.reduce(
    (counts, review) => {
      const sentiment = sentimentOf(review);

      return { ...counts, [sentiment]: counts[sentiment] + 1 };
    },
    { Positive: 0, Neutral: 0, Negative: 0 }
  );

/** "87.5%" */
export const shareOf = (value, total) =>
  total > 0 ? `${((value / total) * 100).toFixed(1)}%` : '0%';

/** Sortable weight for a term label such as "Spring 2025". */
export const semesterRank = (semester = '') => {
  const [term, year] = String(semester).trim().split(/\s+/);

  return (Number(year) || 0) * 10 + (TERM_ORDER[term] || 0);
};

/** Most recent term the reviews cover, e.g. "Fall 2025". */
export const latestSemester = (reviews = []) =>
  reviews.reduce(
    (latest, review) =>
      semesterRank(review.semester) > semesterRank(latest)
        ? review.semester
        : latest,
    ''
  );

/** "Dr. Ahmed Khan" -> "AK". The title is dropped so the initials read as a name. */
export const initialsOf = (name = '') => {
  const parts = String(name)
    .split(/\s+/)
    .filter((part) => part && !HONORIFICS.test(part));

  if (!parts.length) return '?';

  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
};

/**
 * Normalises a record from GET /student/reviews. The stored row already carries
 * the teacher's name, designation and photo, so the table, the detail modal and
 * the summary tiles read the same fields whether or not the teacher is in the
 * scraped directory.
 */
export const fromReviewRecord = (record = {}, index = 0) => ({
  id: record._id || `review-${index}`,
  student: record.student || 'Anonymous',
  teacher: record.teacher || 'Unknown teacher',
  teacherRole: record.teacherRole || '',
  teacherAvatar: record.teacherAvatar || '',
  campus: record.campus || '',
  courseCode: record.courseCode || '',
  courseName: record.courseName || '',
  rating: Number(record.rating) || 0,
  comment: record.comment || '',
  semester: record.semester || '',
  createdAt: record.createdAt || '',
});

/** "CS305 · Data Structures" — or whichever half of the course the review carries. */
export const courseLabelOf = (review = {}) => {
  const code = String(review.courseCode || '').trim();
  const name = String(review.courseName || '').trim();

  // The composer stores a typed code in both columns, so the two halves are
  // only worth repeating when they actually differ.
  if (code && name && code.toLowerCase() !== name.toLowerCase()) {
    return `${code} · ${name}`;
  }

  return code || name || 'Course not listed';
};

/** Distinct, non-empty values, in the order they first appear. */
const uniqueInOrder = (values = []) => [...new Set(values.filter(Boolean))];

/**
 * One teacher's verdict: a single vote keeps its own verdict, while a teacher
 * with several votes is judged on the average the summary column shows.
 */
const groupSentiment = (reviews, average) =>
  reviews.length === 1
    ? sentimentOf(reviews[0])
    : sentimentOf({ rating: average });

/**
 * The review a group leads with: the newest one, whichever order the rows came
 * in. The API sorts them newest first, but the group is built from whatever the
 * page filtered, so the date is checked rather than assumed.
 */
const latestReviewOf = (reviews = []) =>
  reviews.reduce(
    (newest, review) =>
      (Date.parse(review.createdAt) || 0) > (Date.parse(newest.createdAt) || 0)
        ? review
        : newest,
    reviews[0] || null
  );

/**
 * Collapses the review rows into one row per teacher, so the table shows a
 * single line per teacher and the View action opens every review they have.
 *
 * Teachers are matched on name, case-insensitively, because reviews are written
 * by name. Each group keeps every review it folded together in `reviews`, and
 * leads with the newest one through the `latest*` fields.
 */
export const groupReviewsByTeacher = (reviews = []) => {
  const groups = new Map();

  for (const review of reviews) {
    const key = String(review?.teacher || '').trim().toLowerCase();

    if (!key) continue;

    const group = groups.get(key);

    if (group) {
      group.reviews.push(review);

      // The directory details ride along on every row, so the first row that
      // carries one fills the group's copy in.
      if (!group.teacherRole) group.teacherRole = review.teacherRole || '';
      if (!group.teacherAvatar) group.teacherAvatar = review.teacherAvatar || '';
      if (!group.teacherDepartment) {
        group.teacherDepartment = review.teacherDepartment || '';
      }
      if (!group.teacherCampus) group.teacherCampus = review.teacherCampus || '';
      if (!group.teacherProfileUrl) {
        group.teacherProfileUrl = review.teacherProfileUrl || '';
      }
      if (!group.campus) group.campus = review.campus || '';

      continue;
    }

    groups.set(key, {
      // The name itself doubles as the key, so a row is stable across reloads.
      id: key,
      teacher: review.teacher,
      teacherRole: review.teacherRole || '',
      teacherAvatar: review.teacherAvatar || '',
      teacherDepartment: review.teacherDepartment || '',
      teacherCampus: review.teacherCampus || '',
      teacherProfileUrl: review.teacherProfileUrl || '',
      campus: review.campus || '',
      reviews: [review],
    });
  }

  return [...groups.values()]
    .map((group) => {
      const latest = latestReviewOf(group.reviews);
      const average = averageRating(group.reviews);

      return {
        ...group,
        votes: group.reviews.length,
        average,
        // Everyone who has reviewed this teacher, newest review first.
        students: uniqueInOrder(
          group.reviews.map((item) => item.student || 'Anonymous')
        ),
        // The courses the reviews cover, as "CS305 · Data Structures".
        courses: uniqueInOrder(group.reviews.map(courseLabelOf)),
        sentiment: groupSentiment(group.reviews, average),
        latestAt: latest?.createdAt || '',
        latestComment: latest?.comment || '',
      };
    })
    // Whichever teacher was reviewed most recently leads, matching the
    // newest-first order the reviews arrive in.
    .sort(
      (a, b) => (Date.parse(b.latestAt) || 0) - (Date.parse(a.latestAt) || 0)
    );
};

