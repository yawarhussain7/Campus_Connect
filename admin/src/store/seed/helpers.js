// The sample rows are dated relative to "today" so the demo data never reads as
// stale (an "Overdue" row with last year's deadline looks broken).

const DAY = 24 * 60 * 60 * 1000;

/** A plain calendar day, `offset` days from today, as "2025-05-05". */
export function day(offset) {
  return new Date(Date.now() + offset * DAY).toISOString().slice(0, 10);
}

/** An ISO timestamp `days` (and optional `hours`) in the past. */
export function stamp(days, hours = 0) {
  return new Date(Date.now() - days * DAY - hours * 60 * 60 * 1000).toISOString();
}
