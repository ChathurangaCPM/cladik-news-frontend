import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters long"),
});

export type LoginInput = z.input<typeof loginSchema>;

export const signupSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters")
    .trim(),
  lastName: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((val) => val?.trim()),
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Please enter a valid email address")
    .trim(),
  contactNumber: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((val) => val?.trim())
    .refine((val) => {
      if (!val) return true;
      // Accept digits, spaces, dashes, parentheses, and leading plus sign
      return /^\+?[0-9\s\-()]{7,20}$/.test(val);
    }, {
      message: "Please enter a valid phone number",
    }),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters long"),
});

export type SignupInput = z.input<typeof signupSchema>;
