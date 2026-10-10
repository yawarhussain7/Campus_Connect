import { z } from "zod";

const emailField = z
  .string()
  .trim()
  .regex(/^\S+@\S+\.\S+$/, "Enter a valid email address")
  .max(150, "Email cannot exceed 150 characters");

const nameField = z
  .string()
  .trim()
  .min(3, "Name must be at least 3 characters")
  .max(100, "Name cannot exceed 100 characters");

const roleField = z.enum(["user", "admin"], {
  required_error: "Role is required",
});

export const AdminUserCreateZod = z.object({
  name: nameField,
  email: emailField,
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password cannot exceed 100 characters"),
  role: roleField.optional().default("user"),
  avatar: z.string().trim().max(500, "Avatar link is too long").optional().default(""),
});

export const AdminUserUpdateZod = z.object({
  name: nameField,
  email: emailField,
  role: roleField,
  // "" = leave the existing password untouched.
  password: z
    .union([z.literal(""), z.string().min(6, "Password must be at least 6 characters")])
    .optional()
    .default(""),
  avatar: z.string().trim().max(500, "Avatar link is too long").optional().default(""),
});

/**
 * Body for PUT /admin/users/:id/block — the console sends the target state
 * (true = block, false = unblock) rather than a blind toggle, so a double
 * click can never flip the flag twice.
 */
export const AdminUserBlockZod = z.object({
  isblock: z.boolean({
    required_error: "isblock is required",
    invalid_type_error: "isblock must be true or false",
  }),
});