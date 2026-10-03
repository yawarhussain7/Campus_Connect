import { z } from "zod";

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;
const HTTP_URL = /^https?:\/\/\S+$/i;

/**
 * Multipart bodies arrive as strings, so every optional field normalises to
 * either its value or an empty string before it reaches the model.
 */
export const ProjectSchemaZod = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(120, "Title cannot exceed 120 characters"),

  desc: z
    .string()
    .trim()
    .max(2000, "Description cannot exceed 2000 characters")
    .optional()
    .default(""),

  course: z
    .string()
    .trim()
    .max(20, "Course code cannot exceed 20 characters")
    .optional()
    .default("")
    .transform((value) => value.toUpperCase()),

  subject: z
    .string()
    .trim()
    .min(2, "Subject is required")
    .max(100, "Subject cannot exceed 100 characters"),

  dueDate: z
    .string()
    .trim()
    .optional()
    .default("")
    .refine(
      (value) => value === "" || DATE_ONLY.test(value),
      "Due date must look like 2025-05-05"
    ),

  status: z
    .enum(["Pending", "Submitted", "Overdue"])
    .optional()
    .default("Submitted"),

  repo: z
    .string()
    .trim()
    .optional()
    .default("")
    .refine(
      (value) => value === "" || HTTP_URL.test(value),
      "Repository link must start with http:// or https://"
    ),

  semester: z
    .enum([
      "Semester 1",
      "Semester 2",
      "Semester 3",
      "Semester 4",
      "Semester 5",
      "Semester 6",
      "Semester 7",
      "Semester 8",
    ])
    .optional()
    .default("Semester 1"),

  department: z
    .string()
    .trim()
    .optional()
    .default("Computer Science"),
});
