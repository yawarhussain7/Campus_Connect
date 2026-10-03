import { z } from "zod";

export const assignmentSchemaZod = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(150, "Title is too long"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters"),

  subject: z.string().min(2),

  instructor: z.string().min(2),

  department: z.string().optional(),

  semester: z.string().min(1),

  course: z
    .string()
    .trim()
    .max(20, "Course code cannot exceed 20 characters")
    .optional()
    .default("")
    .transform((value) => value.toUpperCase()),

  // Multipart bodies arrive as strings, so the deadline is kept as a plain day.
  dueDate: z
    .string()
    .trim()
    .optional()
    .default("")
    .refine(
      (value) => value === "" || /^\d{4}-\d{2}-\d{2}$/.test(value),
      "Due date must look like 2025-05-05"
    ),

  status: z
    .enum(["Pending", "Submitted", "Overdue"])
    .optional()
    .default("Pending"),

  fileUrl: z.string().url().optional().nullable(),
});