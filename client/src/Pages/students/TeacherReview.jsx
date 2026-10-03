// src/pages/TeacherReview.jsx
import { useCallback, useEffect, useState } from 'react';
import { Inbox, Loader2, PenLine, Users } from 'lucide-react';
import { toast } from 'react-toastify';

import Sidebar from '../../Components/common/Sidebar';
import Header from '../../Components/common/Header';
import TablePagination from '../../Components/common/TablePagination';
import TeacherFilterHeader from '../../Components/teachers/TeacherFilterHeader';
import TeacherReviewTable from '../../Components/teachers/TeacherReviewTable';
import ReviewDetailModal from '../../Components/teachers/ReviewDetailModal';
import ReviewSummaryCards from '../../Components/teachers/ReviewSummaryCards';
import WriteReviewModal from '../../Components/teachers/WriteReviewModal';
import { CreateReview, ShowReviews } from '../../api/review.js';
import { ShowAllTeachers } from '../../api/teacher.js';
import { currentTermLabel } from '../../utils/date.js';
import { fromReviewRecord, groupReviewsByTeacher } from '../../utils/review.js';
import {
  campusChoicesOf,
  campusOf,
  directoryByName,
  fromTeacherRecord,
  teacherDirectoryList,
  withDirectoryDetails,
} from '../../utils/teacher.js';

const PAGE_SIZE = 6;

const uniqueValues = (list, key) => [
  ...new Set(list.map((item) => item?.[key]).filter(Boolean)),
];

export default function TeacherReview() {
  // Both lists come from the backend: the reviews from /student/reviews and the
  // faculty directory from /cui-teachers.
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [page, setPage] = useState(1);

  const [teachers, setTeachers] = useState([]);
  const [teachersLoading, setTeachersLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [campusFilter, setCampusFilter] = useState('');
  const [teacherFilter, setTeacherFilter] = useState('');
  const [studentFilter, setStudentFilter] = useState('');

  const [writeTarget, setWriteTarget] = useState(null);
  const [isWriteOpen, setIsWriteOpen] = useState(false);
  const [detailReview, setDetailReview] = useState(null);

  // Reads the review list. The composer reuses it so a published review is
  // re-read from the server instead of being patched into local state.
  const loadReviewRows = useCallback(async () => {
    const response = await ShowReviews();

    // The client unwraps the JSON envelope, but a bare array is accepted too.
    const payload = response?.data ?? response;
    const records = Array.isArray(payload) ? payload : [];

    return records.map(fromReviewRecord);
  }, []);

  // Load the reviews once, ignoring the result if the page unmounts.
  useEffect(() => {
    let isActive = true;

    loadReviewRows()
      .then((rows) => {
        if (isActive) setReviews(rows);
      })
      .catch((error) => {
        console.error('Failed to load reviews:', error);

        if (isActive) {
          setLoadError(error?.message || 'Could not load the reviews');
        }
      })
      .finally(() => {
        if (isActive) setReviewsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [loadReviewRows]);

  // Load the faculty directory once, ignoring the result if the page unmounts.
  useEffect(() => {
    let isActive = true;

    ShowAllTeachers()
      .then((response) => {
        if (!isActive) return;

        const records = Array.isArray(response?.data) ? response.data : [];
        setTeachers(records.map(fromTeacherRecord));
      })
      .catch((error) => {
        // The page still works from the reviews it holds, so a directory that
        // cannot be reached only costs the extra teacher details.
        console.error('Failed to load the teacher directory:', error);
      })
      .finally(() => {
        if (isActive) setTeachersLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const teacherByName = directoryByName(teachers);

  // Each row borrows the directory's designation, department and photo whenever
  // its teacher is in the directory.
  const rowsWithTeachers = reviews.map((review) =>
    withDirectoryDetails(review, teacherByName)
  );

  // The teacher pickers offer the whole directory plus any teacher a review
  // mentions that the directory does not carry yet.
  const teacherDirectory = teacherDirectoryList(teachers, reviews);
  const teacherOptions = teacherDirectory.map((teacher) => teacher.name);

  // The campus list is the one the teacher directory is built from, widened with
  // the campuses the reviews carry; the courses and students come from reviews.
  const campusOptions = campusChoicesOf(teachers, reviews);
  const courseOptions = uniqueValues(reviews, 'courseName').sort();
  const studentOptions = uniqueValues(reviews, 'student').sort();

  const query = searchQuery.trim().toLowerCase();

  const filteredReviews = rowsWithTeachers.filter((review) => {
    const haystack = [
      review.courseCode,
      review.courseName,
      review.teacher,
      review.student,
      review.comment,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    const matchesSearch = !query || haystack.includes(query);
    const matchesCourse = !courseFilter || review.courseName === courseFilter;
    // Campus is the teacher's, taken from the directory, or - for a teacher the
    // directory does not carry - the campus picked in the composer.
    const matchesCampus = !campusFilter || campusOf(review) === campusFilter;
    const matchesTeacher = !teacherFilter || review.teacher === teacherFilter;
    const matchesStudent = !studentFilter || review.student === studentFilter;

    return (
      matchesSearch &&
      matchesCourse &&
      matchesCampus &&
      matchesTeacher &&
      matchesStudent
    );
  });

  // One row per teacher: the filtered reviews are folded into a single entry
  // per teacher, and the View all action opens every review that entry holds.
  const teacherGroups = groupReviewsByTeacher(filteredReviews);

  const totalPages = Math.max(1, Math.ceil(teacherGroups.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleGroups = teacherGroups.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Any filter change sends the reader back to the first page.
  const changeFilter = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const handleSearchChange = changeFilter(setSearchQuery);
  const handleCourseChange = changeFilter(setCourseFilter);
  const handleCampusChange = changeFilter(setCampusFilter);
  const handleTeacherChange = changeFilter(setTeacherFilter);
  const handleStudentChange = changeFilter(setStudentFilter);

  const clearFilters = () => {
    setSearchQuery('');
    setCourseFilter('');
    setCampusFilter('');
    setTeacherFilter('');
    setStudentFilter('');
    setPage(1);
  };

  // Opening from the page header lets the composer ask for a teacher; opening
  // from a row already knows which teacher is being reviewed.
  const openComposer = (review = null) => {
    setDetailReview(null);
    setWriteTarget(
      review
        ? {
            name: review.teacher,
            role: review.teacherRole,
            avatar: review.teacherAvatar,
          }
        : null
    );
    setIsWriteOpen(true);
  };

  const closeComposer = () => {
    setIsWriteOpen(false);
    setWriteTarget(null);
  };

  const handlePublish = async ({
    teacherName,
    course,
    campus,
    rating,
    comment,
  }) => {
    // The course is typed rather than picked. Something that reads as a code
    // ("CS305", "CSC-210") is stored in the code column, everything else in the
    // course column, so both stay meaningful.
    const typedCourse = course.trim();
    const looksLikeCode = /^[A-Za-z]{2,4}[\s-]?\d{2,4}$/.test(typedCourse);

    try {
      // The server signs the row with the reviewer's own name and fills the
      // teacher's designation and photo in from the directory.
      await CreateReview({
        teacher: teacherName,
        courseCode: looksLikeCode ? typedCourse.toUpperCase() : '',
        courseName: typedCourse,
        campus,
        rating,
        comment,
        semester: currentTermLabel(),
      });

      // Re-read the list so the published row arrives from the database, sorted
      // and enriched the same way as every other row.
      setReviews(await loadReviewRows());
      setLoadError('');
      setPage(1);
      closeComposer();
      toast.success('Your review was published');
    } catch (error) {
      console.error('Failed to publish the review:', error);
      toast.error(error?.message || 'Could not publish your review');
    }
  };

  const hasReviews = reviews.length > 0;

  // One line telling the reader which directory the pickers are built from.
  const directoryNote = teachersLoading
    ? 'Loading the teacher directory…'
    : teachers.length > 0
    ? `${teachers.length.toLocaleString()} teachers in the directory`
    : 'No teachers in the directory yet';

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-slate-800 flex font-sans antialiased">
      <Sidebar />

      <div className="flex-1 xl:pl-64 flex flex-col min-w-0">
        <Header hideSearch />

        <div className="flex-1 p-4 sm:p-6 max-w-[1500px] w-full mx-auto space-y-4">
          {/* Page header */}
          <section className="surface-card border-blue-100 bg-blue-50/70 p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] border border-blue-100 bg-white text-blue-600">
                  <Users className="h-5 w-5" />
                </span>

                <div>
                  <h1 className="text-[20px] font-semibold tracking-tight text-blue-700 sm:text-[24px]">
                    Teacher Reviews
                  </h1>

                  <p className="mt-1 text-[12.5px] text-slate-500">
                    One row per teacher — open a teacher to read every review
                    their students wrote.
                  </p>

                  <p className="mt-1.5 text-[11.5px] text-slate-400">
                    {directoryNote}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => openComposer()}
                className="inline-flex h-9 items-center gap-2 rounded-[10px] bg-blue-600 px-3.5 text-[12.5px] font-medium text-white transition hover:bg-blue-700"
              >
                <PenLine className="h-4 w-4" />
                Write a review
              </button>
            </div>
          </section>

          <ReviewSummaryCards reviews={reviews} />

          <TeacherFilterHeader
            searchQuery={searchQuery}
            setSearchQuery={handleSearchChange}
            courseFilter={courseFilter}
            setCourseFilter={handleCourseChange}
            campusFilter={campusFilter}
            setCampusFilter={handleCampusChange}
            teacherFilter={teacherFilter}
            setTeacherFilter={handleTeacherChange}
            studentFilter={studentFilter}
            setStudentFilter={handleStudentChange}
            courses={courseOptions}
            campuses={campusOptions}
            teachers={teacherOptions}
            students={studentOptions}
            onClearAll={clearFilters}
          />

          {/* Results */}
          {reviewsLoading ? (
            <div className="surface-card p-12 text-center">
              <Loader2 className="mx-auto h-5 w-5 animate-spin text-slate-300" />

              <p className="mt-3 text-[12.5px] font-medium text-slate-600">
                Loading reviews…
              </p>
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="surface-card p-12 text-center">
              <Inbox className="mx-auto h-5 w-5 text-slate-300" />

              <p className="mt-3 text-[12.5px] font-medium text-slate-600">
                {hasReviews
                  ? 'No teachers match your filters'
                  : loadError || 'No reviews have been written yet'}
              </p>

              <p className="mt-1 text-[11.5px] text-slate-400">
                {hasReviews
                  ? 'Try another course, campus, teacher or student.'
                  : 'Be the first to review a teacher from this term.'}
              </p>
            </div>
          ) : (
            <div className="surface-card overflow-hidden">
              <TeacherReviewTable
                teacherGroups={visibleGroups}
                onView={setDetailReview}
              />

              <TablePagination
                page={currentPage}
                totalPages={totalPages}
                pageSize={PAGE_SIZE}
                totalItems={teacherGroups.length}
                onPageChange={setPage}
                noun="teacher"
                ariaLabel="Teacher reviews pagination"
              />
            </div>
          )}
        </div>
      </div>

      <WriteReviewModal
        isOpen={isWriteOpen}
        onClose={closeComposer}
        teacher={writeTarget}
        teachers={teacherDirectory}
        campuses={campusOptions}
        onSubmitReview={handlePublish}
      />

      <ReviewDetailModal
        key={detailReview?.id || 'empty'}
        review={detailReview}
        reviews={rowsWithTeachers}
        onClose={() => setDetailReview(null)}
        onWriteReview={openComposer}
      />
    </div>
  );
}



