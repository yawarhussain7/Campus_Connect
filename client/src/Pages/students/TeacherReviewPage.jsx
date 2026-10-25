import { useEffect, useMemo, useState } from 'react';
import {
  BadgeCheck,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Eye,
  GraduationCap,
  LoaderCircle,
  MessageSquareText,
  Search,
  Send,
  Star,
  UsersRound,
  UserRound,
} from 'lucide-react';
import { toast } from 'react-toastify';

import Sidebar from '../../Components/common/Sidebar';
import Header from '../../Components/common/Header';
import { CreateReview, ShowReviews } from '../../api/review.js';
import { ShowAllTeachers } from '../../api/teacher.js';
import { useAppContext } from '../../context/AppContext';
import { currentTermLabel, formatMediumDate } from '../../utils/date.js';
import { fromReviewRecord, averageRating } from '../../utils/review.js';
import {
  directoryByName,
  fromTeacherRecord,
  withDirectoryDetails,
} from '../../utils/teacher.js';

const StarRating = ({ value, size = 13, interactive = false, onChange }) => (
  <span className="inline-flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((star) => {
      const Icon = Star;
      const active = star <= value;

      return interactive ? (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          aria-label={`Rate ${star} ${star === 1 ? 'star' : 'stars'}`}
          className="rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
        >
          <Icon
            size={size}
            className={active ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
          />
        </button>
      ) : (
        <Icon
          key={star}
          size={size}
          aria-hidden="true"
          className={active ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
        />
      );
    })}
  </span>
);

function PersonAvatar({ name, image, className = '' }) {
  const [failedImage, setFailedImage] = useState('');

  return image && failedImage !== image ? (
    <img
      src={image}
      alt={name}
      onError={() => setFailedImage(image)}
      className={`rounded-full bg-slate-100 object-cover ${className}`}
    />
  ) : (
    <span
      aria-label={name}
      className={`flex shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400 ${className}`}
    >
      <UserRound className="h-1/2 w-1/2" aria-hidden="true" />
    </span>
  );
}

function relativeReviewDate(value) {
  if (!value) return 'Just now';

  const elapsed = Date.now() - new Date(value).getTime();
  if (!Number.isFinite(elapsed) || elapsed < 60_000) return 'Just now';
  if (elapsed < 3_600_000) return `${Math.floor(elapsed / 60_000)}m ago`;
  if (elapsed < 86_400_000) return `${Math.floor(elapsed / 3_600_000)}h ago`;
  if (elapsed < 604_800_000) return `${Math.floor(elapsed / 86_400_000)}d ago`;

  return formatMediumDate(value);
}

export default function TeacherReviewPage() {
  const { user } = useAppContext();
  const [teachers, setTeachers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [teacherError, setTeacherError] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [query, setQuery] = useState('');
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [course, setCourse] = useState('');
  const [customCourse, setCustomCourse] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [publishing, setPublishing] = useState(false);

  const reloadReviews = async () => {
    const response = await ShowReviews();
    const payload = response?.data ?? response;

    return (Array.isArray(payload) ? payload : []).map(fromReviewRecord);
  };

  useEffect(() => {
    let active = true;

    ShowAllTeachers()
      .then((response) => {
        if (!active) return;
        const records = Array.isArray(response?.data) ? response.data : [];
        setTeachers(records.map(fromTeacherRecord));
      })
      .catch((error) => {
        console.error('Failed to load the teacher directory:', error);
        if (active) setTeacherError(error?.message || 'Could not load the teacher directory.');
      })
      .finally(() => {
        if (active) setLoadingTeachers(false);
      });

    reloadReviews()
      .then((rows) => {
        if (active) setReviews(rows);
      })
      .catch((error) => {
        console.error('Failed to load teacher reviews:', error);
        if (active) setReviewError(error?.message || 'Could not load reviews.');
      })
      .finally(() => {
        if (active) setLoadingReviews(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const teacherByName = useMemo(() => directoryByName(teachers), [teachers]);
  const reviewsWithTeachers = useMemo(
    () => reviews.map((review) => withDirectoryDetails(review, teacherByName)),
    [reviews, teacherByName]
  );

  const directory = useMemo(() => {
    const knownNames = new Set(teachers.map((teacher) => teacher.name.trim().toLowerCase()));
    const reviewedTeachers = reviewsWithTeachers
      .filter((review) => !knownNames.has(review.teacher.trim().toLowerCase()))
      .map((review, index) => ({
        id: review.teacherId || `review-teacher-${index}`,
        name: review.teacher,
        role: review.teacherRole || 'Faculty',
        designation: review.teacherRole || '',
        department: review.teacherDepartment || '',
        campus: review.teacherCampus || review.campus || '',
        avatar: review.teacherAvatar || '',
      }));

    return [...teachers, ...reviewedTeachers];
  }, [teachers, reviewsWithTeachers]);

  const filteredTeachers = useMemo(() => {
    const term = query.trim().toLowerCase();

    if (!term) return directory;

    return directory.filter((teacher) =>
      [teacher.name, teacher.role, teacher.department, teacher.campus]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(term)
    );
  }, [directory, query]);

  const selectedTeacher =
    directory.find((teacher) => teacher.id === selectedTeacherId) || directory[0] || null;

  const selectedReviews = selectedTeacher
    ? reviewsWithTeachers.filter(
        (review) =>
          review.teacher.trim().toLowerCase() === selectedTeacher.name.trim().toLowerCase()
      )
    : [];
  const average = averageRating(selectedReviews);
  const courses = [
    ...new Set(
      selectedReviews
        .map((review) => review.courseName || review.courseCode)
        .filter(Boolean)
    ),
  ];
  const campus = selectedTeacher?.campus || selectedReviews[0]?.campus || '';
  const selectedCourse = course === '__custom__' ? customCourse.trim() : course;

  const publishReview = async (event) => {
    event.preventDefault();

    if (!selectedTeacher) {
      toast.error('Choose a teacher to review.');
      return;
    }
    if (!selectedCourse) {
      toast.error('Choose or enter the subject you took with this teacher.');
      return;
    }
    if (!campus) {
      toast.error('This teacher does not have a campus listed yet.');
      return;
    }
    if (comment.trim().length < 3) {
      toast.error('Your comment must be at least 3 characters.');
      return;
    }

    const looksLikeCode = /^[A-Za-z]{2,4}[\s-]?\d{2,4}$/.test(selectedCourse);

    setPublishing(true);
    try {
      await CreateReview({
        teacher: selectedTeacher.name,
        teacherRole: selectedTeacher.designation || selectedTeacher.role,
        teacherAvatar: selectedTeacher.avatar,
        campus,
        courseCode: looksLikeCode ? selectedCourse.toUpperCase() : '',
        courseName: selectedCourse,
        rating,
        comment: comment.trim(),
        semester: currentTermLabel(),
      });

      setReviews(await reloadReviews());
      setCourse('');
      setCustomCourse('');
      setComment('');
      setRating(5);
      setReviewError('');
      toast.success('Your review was published');
    } catch (error) {
      console.error('Failed to publish teacher review:', error);
      toast.error(error?.message || 'Could not publish your review.');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f9fd] text-slate-800">
      <Sidebar />
      <div className="min-h-screen xl:pl-64">
        <Header />

        <main className="mx-auto max-w-[1500px] px-4 pb-8 pt-5 sm:px-6 lg:px-7">
          <section className="mb-5 flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
              <Star className="h-5 w-5 fill-current" />
            </span>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                Review a Teacher
              </h1>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Share your experience and help other students by reviewing your teacher.
                <span className="block">Your feedback makes a difference!</span>
              </p>
            </div>
          </section>

          <div className="grid items-stretch gap-4 lg:grid-cols-[minmax(320px,0.92fr)_minmax(360px,1.08fr)] xl:gap-5">
            <section className="min-w-0 overflow-hidden rounded-xl border border-blue-100 bg-white">
              <div className="p-3 sm:p-4">
                <div className="mb-2.5 flex items-center justify-between">
                  <h2 className="text-[13px] font-semibold text-slate-800">Select a Teacher</h2>
                  {directory.length > 0 && (
                    <span className="text-[10px] text-slate-400">
                      {directory.length} listed
                    </span>
                  )}
                </div>

                <label className="relative block">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search by name, subject or department..."
                    aria-label="Search teachers"
                    className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-[11px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                </label>
              </div>

              <div className="max-h-[310px] space-y-1.5 overflow-y-auto px-3 pb-3 sm:px-4">
                {loadingTeachers ? (
                  <div className="flex items-center justify-center gap-2 py-8 text-xs text-slate-400">
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Loading scraped teachers...
                  </div>
                ) : filteredTeachers.length ? (
                  filteredTeachers.map((teacher) => {
                    const teacherReviews = reviewsWithTeachers.filter(
                      (review) =>
                        review.teacher.trim().toLowerCase() === teacher.name.trim().toLowerCase()
                    );
                    const teacherAverage = averageRating(teacherReviews);
                    const isSelected = teacher.id === selectedTeacher?.id;

                    return (
                      <button
                        key={teacher.id}
                        type="button"
                        onClick={() => setSelectedTeacherId(teacher.id)}
                        aria-pressed={isSelected}
                        className={`flex w-full items-center gap-2.5 rounded-lg border px-2.5 py-2 text-left transition ${
                          isSelected
                            ? 'border-blue-400 bg-blue-50/80'
                            : 'border-slate-100 bg-white hover:border-blue-200 hover:bg-blue-50/40'
                        }`}
                      >
                        <PersonAvatar
                          name={teacher.name}
                          image={teacher.avatar}
                          className="h-10 w-10 border border-slate-200"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[11.5px] font-semibold text-slate-800">
                            {teacher.name}
                          </span>
                          <span className="mt-0.5 block truncate text-[10px] leading-4 text-slate-500">
                            {teacher.department || teacher.role || 'Faculty'}
                          </span>
                          <span className="block truncate text-[10px] text-slate-500">
                            {teacher.campus ? `${teacher.campus} · ` : ''}
                            {teacherAverage > 0 ? (
                              <>
                                <Star className="mr-0.5 inline h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                                {teacherAverage.toFixed(1)}
                              </>
                            ) : (
                              'No ratings'
                            )}
                            <span className="text-slate-400">
                              {' '}({teacherReviews.length} reviews)
                            </span>
                          </span>
                        </span>
                        <ChevronRight className="h-4 w-4 shrink-0 text-blue-500" />
                      </button>
                    );
                  })
                ) : (
                  <p className="py-7 text-center text-xs text-slate-500">
                    {teacherError || 'No teachers match that search.'}
                  </p>
                )}
              </div>

              <form onSubmit={publishReview} className="border-t border-slate-100 p-3 sm:p-4">
                <h2 className="mb-3 text-[13px] font-semibold text-slate-800">
                  Write Your Review
                </h2>

                {!selectedTeacher && !loadingTeachers && (
                  <p className="mb-3 rounded-lg bg-amber-50 p-2.5 text-[11px] leading-4 text-amber-700">
                    {teacherError || 'No teacher is available. Try again after the faculty directory is populated.'}
                  </p>
                )}

                <label className="mb-1.5 block text-[10.5px] font-medium text-slate-700">
                  Select Subject <span className="text-rose-500">*</span>
                </label>
                <div className="relative mb-3">
                  <BookOpen className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <select
                    value={course}
                    onChange={(event) => setCourse(event.target.value)}
                    required
                    className="h-9 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-8 pr-8 text-[10.5px] text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="" disabled>Choose a subject</option>
                    {courses.map((subject) => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                    <option value="__custom__">Other subject...</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                </div>
                {course === '__custom__' && (
                  <input
                    type="text"
                    value={customCourse}
                    onChange={(event) => setCustomCourse(event.target.value)}
                    maxLength={120}
                    placeholder="Enter a subject or course code"
                    className="mb-3 h-9 w-full rounded-lg border border-slate-200 px-3 text-[11px] outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                )}

                <div className="mb-3">
                  <div className="mb-1 flex items-center justify-between">
                    <label className="text-[10.5px] font-medium text-slate-700">
                      Your Rating <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] text-slate-400">{rating}.0 / 5</span>
                  </div>
                  <StarRating value={rating} size={19} interactive onChange={setRating} />
                </div>

                <label className="mb-1.5 block text-[10.5px] font-medium text-slate-700">
                  Your Comment <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  maxLength={1000}
                  rows={3}
                  required
                  placeholder="Share what you enjoyed about this teacher..."
                  className="block w-full resize-y rounded-lg border border-slate-200 px-2.5 py-2 text-[10.5px] leading-4 text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
                <div className="mt-1 text-right text-[9px] text-slate-400">
                  {comment.length}/1000
                </div>

                <button
                  type="submit"
                  disabled={publishing || !selectedTeacher || !campus}
                  className="mt-2 flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-[11px] font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {publishing ? (
                    <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Send className="h-3.5 w-3.5" />
                  )}
                  {publishing ? 'Publishing...' : 'Submit Review'}
                </button>
                <p className="mt-2 text-center text-[9px] text-slate-400">
                  Posted as {user?.name || 'Student'} · Be kind and constructive
                </p>
              </form>
            </section>

            <section className="min-w-0 overflow-hidden rounded-xl border border-blue-100 bg-white">
              <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
                <Eye className="h-5 w-5 text-blue-500" />
                <div>
                  <h2 className="text-[13px] font-semibold text-slate-800">Live Preview</h2>
                  <p className="mt-0.5 text-[9.5px] text-slate-400">
                    This is how your review will appear.
                  </p>
                </div>
              </div>

              <div className="min-h-[590px] bg-gradient-to-b from-blue-50/80 via-white to-white p-3 sm:p-4">
                {selectedTeacher ? (
                  <div className="overflow-hidden rounded-xl border border-blue-100 bg-white">
                    <div className="flex items-center gap-3 border-b border-slate-100 p-3 sm:p-4">
                      <PersonAvatar
                        name={selectedTeacher.name}
                        image={selectedTeacher.avatar}
                        className="h-[70px] w-[70px] shrink-0 rounded-xl border border-slate-200 sm:h-[82px] sm:w-[82px]"
                      />
                      <div className="min-w-0">
                        <h3 className="flex items-center gap-1 truncate text-[14px] font-bold text-slate-900">
                          {selectedTeacher.name}
                          <BadgeCheck className="h-3.5 w-3.5 shrink-0 fill-blue-500 text-white" />
                        </h3>
                        <p className="mt-1 text-[10px] leading-4 text-slate-600">
                          {selectedTeacher.department || selectedTeacher.role || 'Faculty'}
                        </p>
                        {selectedTeacher.campus && (
                          <p className="text-[10px] leading-4 text-slate-500">
                            {selectedTeacher.campus}
                          </p>
                        )}
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <StarRating value={average} />
                          <span className="text-[10px] font-semibold text-slate-700">
                            {average ? average.toFixed(1) : '—'}
                          </span>
                          <span className="text-[9px] text-slate-400">
                            ({selectedReviews.length} reviews)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 divide-x divide-blue-100 bg-blue-50/50 px-2 py-3">
                      <PreviewStat icon={GraduationCap} label="Department" value={selectedTeacher.department || 'Faculty'} />
                      <PreviewStat icon={BookOpen} label="Subject" value={courses[0] || 'No subject yet'} />
                      <PreviewStat icon={UsersRound} label="Total Reviews" value={String(selectedReviews.length)} />
                    </div>

                    <div className="p-3 sm:p-4">
                      <div className="mb-2.5 flex items-center justify-between">
                        <h3 className="text-[11.5px] font-semibold text-slate-800">Student Reviews</h3>
                        {selectedReviews.length > 3 && (
                          <span className="text-[9px] text-blue-600">
                            Latest 3 of {selectedReviews.length}
                          </span>
                        )}
                      </div>

                      {loadingReviews ? (
                        <div className="flex items-center justify-center gap-2 rounded-lg border border-slate-100 py-8 text-[10px] text-slate-400">
                          <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                          Loading student reviews...
                        </div>
                      ) : selectedReviews.length ? (
                        <div className="space-y-2">
                          {selectedReviews.slice(0, 3).map((review) => (
                            <article key={review.id} className="rounded-lg border border-blue-100 bg-white p-2.5 sm:p-3">
                              <div className="flex items-start gap-2">
                                <PersonAvatar
                                  name={review.student}
                                  className="h-7 w-7 text-[9px]"
                                />
                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-wrap items-center justify-between gap-x-2">
                                    <span className="truncate text-[10px] font-semibold text-slate-800">
                                      {review.student || 'Student'}
                                    </span>
                                    <span className="text-[8.5px] text-slate-400">
                                      {relativeReviewDate(review.createdAt)}
                                    </span>
                                  </div>
                                  <div className="mt-0.5">
                                    <StarRating value={review.rating} size={11} />
                                  </div>
                                  <p className="mt-1 text-[9.5px] leading-4 text-slate-600">
                                    {review.comment}
                                  </p>
                                  {(review.courseName || review.courseCode) && (
                                    <p className="mt-1 text-[8.5px] text-slate-400">
                                      {review.courseName || review.courseCode}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </article>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-lg border border-dashed border-blue-200 bg-blue-50/40 px-4 py-8 text-center">
                          <MessageSquareText className="mx-auto h-5 w-5 text-blue-300" />
                          <p className="mt-2 text-[10px] font-medium text-slate-600">
                            {reviewError || 'No student reviews yet'}
                          </p>
                          <p className="mt-1 text-[9px] text-slate-400">
                            Be the first to share feedback for {selectedTeacher.name}.
                          </p>
                        </div>
                      )}

                      <div className="mt-3 flex items-center gap-2 rounded-lg bg-blue-50 px-2.5 py-2 text-[9px] text-blue-700">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100">
                          <UsersRound className="h-3.5 w-3.5" />
                        </span>
                        Help other students by sharing your experience!
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex min-h-[520px] flex-col items-center justify-center px-6 text-center">
                    <Search className="h-7 w-7 text-blue-300" />
                    <p className="mt-3 text-sm font-semibold text-slate-700">
                      {teacherError || 'Choose a teacher to preview reviews'}
                    </p>
                    <p className="mt-1 max-w-xs text-xs leading-5 text-slate-400">
                      Scraped teacher profiles and student feedback will appear here.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

function PreviewStat({ icon: Icon, label, value }) {
  return (
    <div className="flex min-w-0 items-start gap-1.5 px-2 first:pl-1">
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-500" />
      <div className="min-w-0">
        <p className="truncate text-[8px] text-slate-400">{label}</p>
        <p className="mt-0.5 line-clamp-2 text-[8.5px] font-medium leading-3.5 text-slate-700">
          {value}
        </p>
      </div>
    </div>
  );
}
