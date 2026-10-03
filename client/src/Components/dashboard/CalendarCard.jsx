import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';

import { formatCountdown, formatDayMonth, formatMonthYear } from '../../utils/date';

const WEEK_DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

const buildCalendarCells = (year, month) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Sunday-first index converted into a Monday-first grid offset.
  const startOffset = (new Date(year, month, 1).getDay() + 6) % 7;

  const cells = [];

  for (let i = startOffset; i > 0; i -= 1) {
    cells.push({ day: daysInPrevMonth - i + 1, muted: true });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({ day, muted: false });
  }

  let nextMonthDay = 1;

  while (cells.length % 7 !== 0) {
    cells.push({ day: nextMonthDay, muted: true });
    nextMonthDay += 1;
  }

  return cells;
};

const startOfToday = () => {
  const now = new Date();

  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

const normalizeEvent = (event) => {
  if (event instanceof Date) return { date: event, title: '' };
  if (event?.date) return { date: new Date(event.date), title: event.title || '' };

  return { date: new Date(event), title: '' };
};

/**
 * Month grid with deadline markers plus a short agenda for what is next.
 * Accepts either raw dates or { date, title } pairs.
 */
export default function CalendarCard({ events = [] }) {
  const navigate = useNavigate();

  const today = new Date();
  const [viewDate, setViewDate] = React.useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const cells = buildCalendarCells(year, month);

  const normalized = events
    .map(normalizeEvent)
    .filter((event) => !Number.isNaN(event.date.getTime()));

  const hasEventOn = (day) =>
    normalized.some(
      (event) =>
        event.date.getFullYear() === year &&
        event.date.getMonth() === month &&
        event.date.getDate() === day
    );

  const monthEvents = normalized.filter(
    (event) =>
      event.date.getFullYear() === year && event.date.getMonth() === month
  );

  const agenda = normalized
    .filter((event) => event.title && event.date >= startOfToday())
    .sort((a, b) => a.date - b.date)
    .slice(0, 2);

  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() === month;

  const shiftMonth = (delta, resetToToday = false) => {
    if (resetToToday) {
      setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
      return;
    }

    setViewDate(new Date(year, month + delta, 1));
  };

  return (
    <section className="surface-card">
      <div className="surface-card-header">
        <div className="flex items-center gap-2.5">
          <CalendarDays className="h-4 w-4 text-slate-400" />

          <div>
            <h2 className="text-[13px] font-semibold text-slate-900">
              Calendar
            </h2>

            <p className="mt-0.5 text-[11.5px] text-slate-400">
              {monthEvents.length === 0
                ? 'No deadlines this month'
                : `${monthEvents.length} ${
                    monthEvents.length === 1 ? 'deadline' : 'deadlines'
                  } this month`}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/student/calendar')}
          className="text-[11.5px] font-medium text-blue-600 transition hover:text-blue-700"
        >
          Open
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            aria-label="Previous month"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => shiftMonth(0, true)}
            title="Jump to the current month"
            className="rounded-md px-2 py-1 text-[12px] font-semibold text-slate-800 tabular-nums transition hover:bg-slate-100"
          >
            {formatMonthYear(viewDate)}
          </button>

          <button
            type="button"
            onClick={() => shiftMonth(1)}
            aria-label="Next month"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 grid grid-cols-7">
          {WEEK_DAYS.map((day) => (
            <span
              key={day}
              className="py-1 text-center text-[10px] font-medium uppercase tracking-[0.06em] text-slate-400"
            >
              {day}
            </span>
          ))}
        </div>

        <div className="mt-0.5 grid grid-cols-7 gap-y-0.5">
          {cells.map((cell, index) => {
            const isToday =
              !cell.muted && isCurrentMonth && cell.day === today.getDate();
            const hasEvent = !cell.muted && hasEventOn(cell.day);

            return (
              <div
                key={`${cell.day}-${index}`}
                className="relative flex h-8 items-center justify-center"
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-lg text-[11.5px] tabular-nums transition ${
                    isToday
                      ? 'bg-blue-600 font-semibold text-white'
                      : cell.muted
                      ? 'text-slate-300'
                      : 'font-medium text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cell.day}
                </span>

                {hasEvent && !isToday && (
                  <span className="absolute bottom-0 h-1 w-1 rounded-full bg-blue-500" />
                )}
              </div>
            );
          })}
        </div>

        {agenda.length > 0 && (
          <ul className="mt-4 space-y-2.5 border-t border-slate-100 pt-3.5">
            {agenda.map((event) => (
              <li
                key={`${event.title}-${event.date.toISOString()}`}
                className="flex items-start gap-2.5"
              >
                <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[11.5px] font-medium text-slate-700">
                    {event.title}
                  </span>

                  <span className="mt-0.5 block text-[10.5px] text-slate-400">
                    {formatDayMonth(event.date)} · {formatCountdown(event.date)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
