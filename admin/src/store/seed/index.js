import { assignmentSeed } from "./assignments";
import { paperSeed } from "./papers";
import { projectSeed } from "./projects";
import { reviewSeed } from "./reviews";

/**
 * A fresh copy of the sample catalogue, keyed by collection.
 *
 * Ids are stable ("asg-1", "pap-3", …) rather than random so a reset produces a
 * predictable dataset.
 */
export function seedRecords() {
  const withIds = (rows, prefix) =>
    rows.map((row, index) => ({ ...row, id: `${prefix}-${index + 1}` }));

  return {
    assignments: withIds(assignmentSeed, "asg"),
    papers: withIds(paperSeed, "pap"),
    projects: withIds(projectSeed, "prj"),
    reviews: withIds(reviewSeed, "rev"),
  };
}
