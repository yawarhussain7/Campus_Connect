import { z } from "zod";

/**
 * Review composer payload. The student's name is taken from the session on the
 * server, so it is not part of the request body.
 */
export const ReviewSchemaZod = z
  .object({
    teacher: z
      .string({ required_error: "Teacher is required" })
      .trim()
      .min(2, "Teacher name is required")
      .max(100, "Teacher name cannot exceed 100 characters"),

    teacherRole: z.string().trim().max(100).optional().default(""),

    teacherAvatar: z
      .string()
      .trim()
      .max(500, "Avatar link is too long")
      .optional()
      .default(""),

    campus: z.string().trim().max(100).optional().default(""),

    courseCode: z
      .string()
      .trim()
      .max(20, "Course code cannot exceed 20 characters")
      .optional()
      .default(""),

    courseName: z
      .string()
      .trim()
      .max(120, "Course name cannot exceed 120 characters")
      .optional()
      .default(""),

    rating: z.coerce
      .number({ invalid_type_error: "Rating must be a number" })
      .int("Rating must be a whole number")
      .min(1, "Rating cannot be below 1")
      .max(5, "Rating cannot be above 5"),

    comment: z
      .string({ required_error: "Feedback is required" })
      .trim()
      .min(3, "Feedback must be at least 3 characters")
      .max(1000, "Feedback cannot exceed 1000 characters"),

    semester: z.string().trim().max(40).optional().default(""),
  })
  // A review has to be about a course: a code, a name, or both.
  .refine(
    (value) => Boolean(value.courseCode || value.courseName),
    { message: "Course is required", path: ["courseName"] }
  );
