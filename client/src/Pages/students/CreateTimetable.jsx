import { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  Link2,
  Copy,
  Check,
  Plus,
  Trash2,
  RotateCcw,
  Maximize2,
  X,
  Printer,
  CheckCircle2,
  Sparkles,
  BookOpen,
  User,
  MapPin,
  LayoutGrid,
  Table as TableIcon,
} from 'lucide-react';
import { toast } from 'react-toastify';
import Sidebar from '../../Components/common/Sidebar';
import Header from '../../Components/common/Header';

// Standard 1.5 hour class slots matching the university portal format
const TIME_SLOTS = [
  '09:00 To 10:30',
  '10:30 To 12:00',
  '12:00 To 13:30',
  '13:30 To 15:00',
  '15:00 To 16:30',
  '16:30 To 18:00',
  '18:00 To 19:30',
  '19:30 To 21:00',
];

const WEEK_DAYS = [
  { key: 'Monday', label: 'Monday' },
  { key: 'Tuesday', label: 'Tuesday' },
  { key: 'Wednesday', label: 'Wednesday' },
  { key: 'Thursday', label: 'Thursday' },
  { key: 'Friday', label: 'Friday' },
  { key: 'Saturday', label: 'Saturday' },
  { key: 'Sunday', label: 'Sunday' },
];

// Initial schedule accurately matching user's uploaded CUOnline format
const INITIAL_SCHEDULE = {
  Monday: {
    '12:00 To 13:30': {
      subject: 'Web Technologies',
      room: 'S105 (52M)',
      teacher: 'Bushra Mushtaq',
    },
  },
  Tuesday: {
    '12:00 To 13:30': {
      subject: 'Introduction to Psychology',
      room: 'S207 (56M)',
      teacher: 'Mina Shah (VF)',
    },
    '13:30 To 15:00': {
      subject: 'Business Process Engineering',
      room: 'S313 (40M)',
      teacher: 'Mukhtiar Zamin',
    },
    '15:00 To 16:30': {
      subject: 'Information Security',
      room: 'S206 (56M)',
      teacher: 'Muhammad Ahmed Mustafa',
    },
  },
  Wednesday: {
    '10:30 To 12:00': {
      subject: 'Information Security',
      room: 'S101(45M)',
      teacher: 'Muhammad Ahmed Mustafa',
    },
    '12:00 To 13:30': {
      subject: 'Machine Learning',
      room: 'C106 (50M)',
      teacher: 'Sara Shafique',
    },
    '13:30 To 15:00': {
      subject: 'Web Technologies',
      room: 'Computer LAB 06 (C-103)[50M]',
      teacher: 'Bushra Mushtaq',
    },
    '15:00 To 16:30': {
      subject: 'Web Technologies',
      room: 'Computer LAB 06 (C-103)[50M]',
      teacher: 'Bushra Mushtaq',
    },
  },
  Thursday: {
    '09:00 To 10:30': {
      subject: 'Introduction to Psychology',
      room: 'S205 (80M)',
      teacher: 'Mina Shah (VF)',
    },
    '10:30 To 12:00': {
      subject: 'Machine Learning',
      room: 'S206 (56M)',
      teacher: 'Sara Shafique',
    },
    '12:00 To 13:30': {
      subject: 'Business Process Engineering',
      room: 'S107(45M)',
      teacher: 'Mukhtiar Zamin',
    },
    '13:30 To 15:00': {
      subject: 'Web Technologies',
      room: 'S203(60M)',
      teacher: 'Bushra Mushtaq',
    },
  },
  Friday: {
    '10:30 To 12:00': {
      subject: 'Communication Skills',
      room: 'S107(45M)',
      teacher: 'Muneeba Sehr (VF)',
    },
    '12:00 To 13:30': {
      subject: 'Communication Skills',
      room: 'S205 (80M)',
      teacher: 'Muneeba Sehr (VF)',
    },
  },
  Saturday: {},
  Sunday: {},
};

const DEFAULT_SUBJECTS = [
  { id: '1', name: 'Web Technologies', room: 'S105 (52M)', teacher: 'Bushra Mushtaq' },
  { id: '2', name: 'Introduction to Psychology', room: 'S207 (56M)', teacher: 'Mina Shah (VF)' },
  { id: '3', name: 'Business Process Engineering', room: 'S313 (40M)', teacher: 'Mukhtiar Zamin' },
  { id: '4', name: 'Information Security', room: 'S206 (56M)', teacher: 'Muhammad Ahmed Mustafa' },
  { id: '5', name: 'Machine Learning', room: 'C106 (50M)', teacher: 'Sara Shafique' },
  { id: '6', name: 'Communication Skills', room: 'S107(45M)', teacher: 'Muneeba Sehr (VF)' },
];

export default function CreateTimetable() {
  const [timetableUrl, setTimetableUrl] = useState(
    'https://campusconnect.app/timetable/7f3a9e2c'
  );
  const [copied, setCopied] = useState(false);
  const [daysOff, setDaysOff] = useState(['Sunday']);
  const [subjects, setSubjects] = useState(DEFAULT_SUBJECTS);
  const [schedule, setSchedule] = useState(INITIAL_SCHEDULE);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingCell, setEditingCell] = useState(null); // { day, slot }

  // Days visible in the timetable
  const activeDays = useMemo(() => {
    return WEEK_DAYS.filter((d) => !daysOff.includes(d.key));
  }, [daysOff]);

  const handleCopy = async () => {
    if (!timetableUrl || !timetableUrl.trim()) {
      toast.warning('Please enter a timetable URL first.');
      return;
    }
    try {
      await navigator.clipboard.writeText(timetableUrl);
      setCopied(true);
      toast.success('Timetable link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const toggleDayOff = (dayKey) => {
    setDaysOff((prev) => {
      if (prev.includes(dayKey)) {
        return prev.filter((d) => d !== dayKey);
      } else {
        if (prev.length >= 6) {
          toast.warning('At least one day must be active.');
          return prev;
        }
        return [...prev, dayKey];
      }
    });
  };

  const handleSubjectChange = (id, field, value) => {
    setSubjects((prev) =>
      prev.map((sub) => {
        if (sub.id === id) {
          const updated = { ...sub, [field]: value };
          // Also sync in schedule if subject name changed
          if (field === 'name') {
            setSchedule((currSched) => {
              const next = { ...currSched };
              Object.keys(next).forEach((d) => {
                Object.keys(next[d]).forEach((s) => {
                  if (next[d][s]?.subject === sub.name) {
                    next[d][s] = { ...next[d][s], subject: value };
                  }
                });
              });
              return next;
            });
          }
          return updated;
        }
        return sub;
      })
    );
  };

  const handleAddSubject = () => {
    const newId = String(Date.now());
    setSubjects((prev) => [
      ...prev,
      {
        id: newId,
        name: `New Subject ${prev.length + 1}`,
        room: 'Room 101',
        teacher: 'Instructor Name',
      },
    ]);
  };

  const handleDeleteSubject = (id) => {
    if (subjects.length <= 1) {
      toast.warning('You must keep at least one subject.');
      return;
    }
    const target = subjects.find((s) => s.id === id);
    setSubjects((prev) => prev.filter((sub) => sub.id !== id));
    // Remove from schedule
    if (target) {
      setSchedule((currSched) => {
        const next = { ...currSched };
        Object.keys(next).forEach((d) => {
          Object.keys(next[d]).forEach((s) => {
            if (next[d][s]?.subject === target.name) {
              delete next[d][s];
            }
          });
        });
        return next;
      });
    }
  };

  const handleReset = () => {
    setTimetableUrl('https://campusconnect.app/timetable/7f3a9e2c');
    setSubjects(DEFAULT_SUBJECTS);
    setSchedule(INITIAL_SCHEDULE);
    setDaysOff(['Sunday']);
    toast.info('Timetable reset to university portal defaults.');
  };

  const handleCreateTimetable = () => {
    setIsCreating(true);
    setTimeout(() => {
      setIsCreating(false);
      toast.success('Timetable saved successfully! Share your URL with students.');
    }, 600);
  };

  // Quick slot assignment modal or inline edit
  const assignSubjectToSlot = (day, slot, subject) => {
    setSchedule((prev) => {
      const next = { ...prev };
      if (!next[day]) next[day] = {};
      if (subject) {
        next[day][slot] = {
          subject: subject.name,
          room: subject.room,
          teacher: subject.teacher,
        };
      } else {
        delete next[day][slot];
      }
      return next;
    });
    setEditingCell(null);
  };

  // Render the official university timetable grid
  const renderOfficialTimetable = () => (
    <div className="w-full overflow-x-auto scroll-x rounded-lg border border-slate-300 bg-white shadow-sm">
      <table className="w-full border-collapse text-left font-sans text-xs min-w-[980px]">
        <thead>
          <tr className="bg-[#f2f4f7] border-b border-slate-300">
            <th className="border-r border-slate-300 px-3.5 py-3 text-left font-bold text-slate-800 text-[12px] w-28 bg-[#edf0f4]">
              Day\Title
            </th>
            {TIME_SLOTS.map((slot) => (
              <th
                key={slot}
                className="border-r border-slate-300 px-2 py-3 text-center font-bold text-slate-700 text-[11.5px] whitespace-nowrap last:border-r-0"
              >
                {slot}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {activeDays.map((day) => {
            const daySchedule = schedule[day.key] || {};
            return (
              <tr
                key={day.key}
                className="border-b border-slate-300 hover:bg-slate-50/50 transition-colors"
              >
                {/* Day title cell */}
                <td className="border-r border-slate-300 bg-[#f9fafb] px-3.5 py-3 font-bold text-slate-800 text-[12px] whitespace-nowrap align-middle">
                  {day.label}
                </td>

                {/* Time slot cells */}
                {TIME_SLOTS.map((slot) => {
                  const entry = daySchedule[slot];
                  return (
                    <td
                      key={slot}
                      onClick={() => setEditingCell({ day: day.key, slot })}
                      title={entry ? 'Click to change or clear class' : 'Click to schedule a class'}
                      className="border-r border-slate-300 p-2 align-top last:border-r-0 min-w-[125px] max-w-[160px] h-[78px] hover:bg-blue-50/30 cursor-pointer transition-colors relative group"
                    >
                      {entry ? (
                        <div className="flex flex-col text-left leading-tight">
                          <span className="font-semibold text-slate-900 text-[11.5px] leading-tight">
                            {entry.subject}
                          </span>
                          <span className="text-[11px] text-slate-600 leading-tight mt-0.5">
                            {entry.room}
                          </span>
                          <span className="text-[11.5px] font-semibold text-[#0033cc] leading-tight mt-0.5 hover:underline">
                            {entry.teacher}
                          </span>
                        </div>
                      ) : (
                        <div className="h-full w-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                            + Add
                          </span>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f7f9fc] font-sans text-slate-800 antialiased">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col xl:pl-64">
        <Header hideSearch />

        <main className="mx-auto w-full max-w-[1550px] flex-1 space-y-5 p-4 sm:p-6 lg:p-8">
          {/* Page Heading */}
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm ring-4 ring-blue-100">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Create Timetable
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Official university portal format with custom timings, room assignments, and shareable link.
              </p>
            </div>
          </div>

          {/* Your Timetable URL Banner Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                    <Link2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-semibold text-slate-900">
                      Your Timetable URL
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Share this link with your students. They can add their subjects and get their timetable.
                    </p>
                  </div>
                </div>

                <div className="relative max-w-xl">
                  <input
                    type="text"
                    value={timetableUrl}
                    onChange={(e) => setTimetableUrl(e.target.value)}
                    placeholder="Enter or paste your timetable link"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 pr-10 text-xs sm:text-sm text-slate-800 font-mono tracking-tight transition hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center self-start lg:self-center">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition active:scale-95"
                >
                  <Copy className="h-4 w-4" />
                  <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Grid: Left Controls (Subjects & Days Off) + Right Preview */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 items-start">
            {/* Left Column: Manage Subjects & Days Off */}
            <div className="space-y-5 lg:col-span-4">
              {/* Day Off Selector */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Day Off <span className="font-normal text-slate-400">(Optional)</span>
                    </h3>
                    <p className="text-[11.5px] text-slate-500">
                      Select days you don't have classes.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {WEEK_DAYS.map((day) => {
                    const isOff = daysOff.includes(day.key);
                    return (
                      <button
                        key={day.key}
                        type="button"
                        onClick={() => toggleDayOff(day.key)}
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition active:scale-95 ${
                          isOff
                            ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-600'
                            : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {isOff ? (
                          <Check className="h-3 w-3 stroke-[3]" />
                        ) : (
                          <span className="h-2 w-2 rounded-full border border-slate-300" />
                        )}
                        <span>{day.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Subject, Room & Teacher Configuration Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        Course & Faculty Directory
                      </h3>
                      <p className="text-[11.5px] text-slate-500">
                        Edit subjects, room codes, and instructors.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-2 max-h-[460px] overflow-y-auto pr-1">
                  {subjects.map((sub, idx) => (
                    <div
                      key={sub.id}
                      className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 space-y-2 hover:border-slate-300 transition"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500 uppercase">
                          Course #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteSubject(sub.id)}
                          className="text-slate-400 hover:text-rose-600 transition"
                          title="Remove subject"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Course Title */}
                      <input
                        type="text"
                        value={sub.name}
                        onChange={(e) => handleSubjectChange(sub.id, 'name', e.target.value)}
                        placeholder="Course title"
                        className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-900 outline-none focus:border-blue-500"
                      />

                      {/* Room & Teacher Inputs */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="relative">
                          <input
                            type="text"
                            value={sub.room}
                            onChange={(e) => handleSubjectChange(sub.id, 'room', e.target.value)}
                            placeholder="Room (e.g. S105)"
                            className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 outline-none focus:border-blue-500"
                          />
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            value={sub.teacher}
                            onChange={(e) => handleSubjectChange(sub.id, 'teacher', e.target.value)}
                            placeholder="Teacher name"
                            className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] text-blue-700 font-medium outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleAddSubject}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white py-2.5 text-xs font-semibold text-blue-600 hover:bg-blue-50/50 transition active:scale-[0.99]"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Another Course</span>
                </button>
              </div>
            </div>

            {/* Right Column: Official Timetable Preview */}
            <div className="space-y-4 lg:col-span-8">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                      <TableIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Timetable Preview
                      </h3>
                      <p className="text-xs text-slate-500">
                        University portal format (Day\Title rows & 1.5-hour time slot columns).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setIsFullScreen(true)}
                      className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50/50 hover:border-blue-200 transition"
                    >
                      <Maximize2 className="h-3.5 w-3.5" />
                      <span>View Full Screen</span>
                    </button>
                  </div>
                </div>

                {/* The Timetable Grid */}
                <div className="pt-1">
                  {renderOfficialTimetable()}
                </div>

                {/* Notice Pill */}
                <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/80 p-3 text-xs font-medium text-emerald-800">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span>
                    Click any cell to assign or edit a class. Format matches the official COMSATS CUOnline timetable view.
                  </span>
                </div>
              </div>

              {/* Bottom Action Bar */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition active:scale-95"
                >
                  <RotateCcw className="h-4 w-4 text-slate-500" />
                  <span>Reset to Sample</span>
                </button>

                <button
                  type="button"
                  onClick={handleCreateTimetable}
                  disabled={isCreating}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition active:scale-95 disabled:opacity-70"
                >
                  {isCreating ? (
                    <Sparkles className="h-4 w-4 animate-spin" />
                  ) : (
                    <Calendar className="h-4 w-4" />
                  )}
                  <span>{isCreating ? 'Saving…' : 'Save Timetable'}</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Edit Slot Cell Modal */}
      {editingCell && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Schedule Class: {editingCell.day}
                </h3>
                <p className="text-xs text-slate-500">{editingCell.slot}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingCell(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 font-medium">
              Choose a course to place into this time slot:
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {subjects.map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => assignSubjectToSlot(editingCell.day, editingCell.slot, sub)}
                  className="flex w-full items-center justify-between rounded-xl border border-slate-200 p-3 text-left hover:border-blue-500 hover:bg-blue-50/50 transition"
                >
                  <div>
                    <span className="block text-xs font-bold text-slate-900">{sub.name}</span>
                    <span className="block text-[11px] text-slate-500">{sub.room}</span>
                  </div>
                  <span className="text-xs font-semibold text-blue-700">{sub.teacher}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => assignSubjectToSlot(editingCell.day, editingCell.slot, null)}
                className="text-xs font-semibold text-rose-600 hover:underline"
              >
                Clear this slot
              </button>

              <button
                type="button"
                onClick={() => setEditingCell(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Screen View Modal */}
      {isFullScreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="flex max-h-[95vh] w-full max-w-6xl flex-col rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-[#f8fafc]">
              <div className="flex items-center gap-2.5">
                <Calendar className="h-5 w-5 text-blue-600" />
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Timetable Full View (Official Format)
                  </h2>
                  <p className="text-xs text-slate-500">
                    CUOnline Style Timetable Layout
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print Timetable</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsFullScreen(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-6">
              {renderOfficialTimetable()}
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-3 text-xs text-slate-500">
              <span>{activeDays.length} active days · {TIME_SLOTS.length} time slots</span>
              <button
                type="button"
                onClick={() => setIsFullScreen(false)}
                className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
