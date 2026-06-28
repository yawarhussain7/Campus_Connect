import { z } from "zod";

const currentYear = new Date().getFullYear();

export const PastPaperSchemaZod = z.object({
  subject: z
    .string({
      required_error: "Subject is required",
    })
    .trim()
    .min(3, "Subject must be at least 3 characters")
    .max(100, "Subject cannot exceed 100 characters"),

  instructor: z
    .string({
      required_error: "Instructor is required",
    })
    .trim()
    .min(2, "Instructor name is required"),

  semester: z.enum(
    ["Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6", "Semester 7", "Semester 8"],
    {
      required_error: "Semester is required",
    }
  ),

  exam: z.enum(
    ["Mid", "Final"],
    {
      required_error: "Exam type is required",
    }
  ),

  year: z
    .number({
      required_error: "Year is required",
      invalid_type_error: "Year must be a number",
    })
    .min(2000, "Year cannot be before 2000")
    .max(currentYear + 1, `Year cannot exceed ${currentYear + 1}`),

  hasSolution: z.boolean().optional().default(false),

  batch: z
    .string()
    .trim()
    .min(1, "Batch is required"),

  department: z
    .string()
    .trim()
    .default("Computer Science"),
});
