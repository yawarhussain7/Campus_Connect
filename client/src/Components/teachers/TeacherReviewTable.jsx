import { useState } from 'react';
import { Eye, Star } from 'lucide-react';

import { formatMediumDate } from '../../utils/date.js';
import {
  initialsOf,
  ratingLabel,
  sentimentTone,
  starSlots,
} from '../../utils/review.js';

/**
 * One row per teacher: every review a teacher has is folded into a single line,
 * so a teacher with five reviews still reads as one entry. The columns describe
 * the whole group — who reviewed them, on which courses, the average rating and
 * the latest feedback — and Actions opens the individual reviews.
 *
 * The table is laid out fixed, so it is exactly as wide as the card it sits in
 * and never scrolls sideways: each column carries its own share of the width,
 * and the secondary columns drop out on narrow viewports rather than pushing the
 * row past the edge.
 */
const TEACHER_CELL = 'w-[40%] sm:w-[34%] md:w-[22%] lg:w-[19%]';
const STUDENTS_CELL = 'hidden md:table-cell md:w-[13%] lg:w-[12%]';
const COURSES_CELL = 'hidden lg:table-cell lg:w-[15%]';
const REVIEWS_CELL = 'w-[16%] md:w-[10%] lg:w-[8%]';
const RATING_CELL = 'w-[24%] sm:w-[20%] md:w-[13%] lg:w-[11%]';
const LATEST_CELL = 'hidden md:table-cell md:w-[24%] lg:w-[17%]';
const STATUS_CELL = 'hidden sm:table-cell sm:w-[12%] md:w-[8%]';
const ACTIONS_CELL = 'w-[20%] sm:w-[18%] md:w-[10%]';

const COLUMNS = [
  { label: 'Teacher', cell: TEACHER_CELL },
  { label: 'Students', cell: STUDENTS_CELL },
  { label: 'Courses', cell: COURSES_CELL },
  { label: 'Reviews', cell: REVIEWS_CELL },
  { label: 'Rating', cell: RATING_CELL },
  { label: 'Latest Review', cell: LATEST_CELL },
  { label: 'Status', cell: STATUS_CELL },
  { label: 'Actions', cell: ACTIONS_CELL },
];

export default function TeacherReviewTable({ teacherGroups = [], onView }) {
  return (
    <div className="w-full">
      <table className="w-full table-fixed border-collapse text-left">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/70">
            {COLUMNS.map((column) => (
              <th
                key={column.label}
                scope="col"
                className={`px-3 py-3 text-left text-[11.5px] font-medium text-slate-500 ${column.cell}`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {teacherGroups.map((group) => (
            <tr
              key={group.id}
              className="border-b border-slate-100 transition-colors last:border-b-0 hover:bg-slate-50/60"
            >
              {/* Teacher */}
              <td className={`px-3 py-3 align-middle ${TEACHER_CELL}`}>
                <TeacherCell teacher={group} />
              </td>

              {/* Everyone who has reviewed them */}
              <td className={`px-3 py-3 align-middle ${STUDENTS_CELL}`}>
                <NameList names={group.students} emptyLabel="No students yet" />
              </td>

              {/* The courses those reviews cover */}
              <td className={`px-3 py-3 align-middle ${COURSES_CELL}`}>
                <NameList names={group.courses} emptyLabel="Course not listed" />
              </td>

              {/* How many reviews this row folds together */}
              <td
                className={`px-3 py-3 align-middle tabular-nums ${REVIEWS_CELL}`}
              >
                <p className="text-[12.5px] font-medium text-slate-800">
                  {group.votes} {group.votes === 1 ? 'review' : 'reviews'}
                </p>

                <p className="text-[11px] text-slate-400">
                  {group.students.length}{' '}
                  {group.students.length === 1 ? 'student' : 'students'}
                </p>
              </td>

              {/* Rating: the teacher's average, not a single vote */}
              <td className={`px-3 py-3 align-middle ${RATING_CELL}`}>
                <div
                  className="flex items-center gap-1.5"
                  title={`Average of ${group.votes} ${
                    group.votes === 1 ? 'review' : 'reviews'
                  }`}
                >
                  <span className="flex items-center gap-0.5">
                    {starSlots(group.average).map((filled, index) => (
                      <Star
                        key={index}
                        aria-hidden="true"
                        className={`h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5 ${
                          filled
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </span>

                  {/* The number returns as soon as the column has room for it. */}
                  <span className="hidden text-[12px] text-slate-600 tabular-nums sm:inline">
                    {ratingLabel(group.average)}
                  </span>
                </div>
              </td>

              {/* Latest review: the newest feedback, with the date it landed */}
              <td className={`px-3 py-3 align-middle ${LATEST_CELL}`}>
                <p
                  className="line-clamp-2 text-[12px] leading-5 text-slate-600"
                  title={group.latestComment}
                >
                  {group.latestComment || 'No written feedback'}
                </p>

                <p className="mt-0.5 text-[11px] text-slate-400 tabular-nums">
                  {formatMediumDate(group.latestAt)}
                </p>
              </td>

              {/* Status */}
              <td className={`px-3 py-3 align-middle ${STATUS_CELL}`}>
                <span
                  className={`inline-flex whitespace-nowrap rounded-md px-2 py-[3px] text-[11px] font-medium ${sentimentTone(
                    { sentiment: group.sentiment }
                  )}`}
                >
                  {group.sentiment}
                </span>
              </td>

              {/* Actions */}
              <td className={`px-3 py-3 align-middle ${ACTIONS_CELL}`}>
                <button
                  type="button"
                  onClick={() => onView?.(group)}
                  title={`Open all ${group.votes} review${
                    group.votes === 1 ? '' : 's'
                  } for ${group.teacher}`}
                  className="inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-[8px] border border-blue-100 bg-blue-50 px-2.5 text-[11.5px] font-medium text-blue-700 transition hover:bg-blue-100"
                >
                  <Eye className="h-3.5 w-3.5 shrink-0" />
                  View all
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * A short list — students or courses — with the full list on hover, so a teacher
 * reviewed by eight students still fits one row.
 */
function NameList({ names = [], emptyLabel = '—' }) {
  if (!names.length) {
    return <span className="text-[12.5px] text-slate-400">{emptyLabel}</span>;
  }

  const shown = names.slice(0, 2);
  const extra = names.length - shown.length;

  return (
    <div className="min-w-0" title={names.join(', ')}>
      <p className="truncate text-[12.5px] text-slate-700">
        {shown.join(', ')}
      </p>

      {extra > 0 && (
        <p className="text-[11px] text-slate-400 tabular-nums">+{extra} more</p>
      )}
    </div>
  );
}

/** Teacher photo with the initials tile as a fallback, so a broken URL still reads. */
function TeacherCell({ teacher }) {
  const [imageFailed, setImageFailed] = useState(false);
  const showPhoto = Boolean(teacher.teacherAvatar) && !imageFailed;

  return (
    <div className="flex items-center gap-2.5">
      {showPhoto ? (
        <img
          src={teacher.teacherAvatar}
          alt={teacher.teacher}
          loading="lazy"
          onError={() => setImageFailed(true)}
          className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-slate-200"
        />
      ) : (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-500">
          {initialsOf(teacher.teacher)}
        </span>
      )}

      <div className="min-w-0">
        <p className="truncate text-[12.5px] font-medium text-slate-800">
          {teacher.teacher}
        </p>

        <p className="truncate text-[11px] text-slate-400">
          {teacher.teacherRole || 'Faculty'}
        </p>
      </div>
    </div>
  );
}
