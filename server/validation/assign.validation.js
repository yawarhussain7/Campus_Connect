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

  fileUrl: z.string().url().optional().nullable(),
});