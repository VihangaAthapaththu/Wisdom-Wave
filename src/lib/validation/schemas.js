import { z } from "zod";

// Shared field rules
const email = z
  .string()
  .trim()
  .min(1, "Email is required")
  .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address");

const objectId = z.string().trim().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

// ── Auth ────────────────────────────────────────────────────────────────────
export const signInSchema = z.object({
  email,
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signUpSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name must be at most 50 characters"),
    email,
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Include at least one uppercase letter")
      .regex(/[0-9]/, "Include at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms to continue" }),
    }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

// ── Contact ──────────────────────────────────────────────────────────────────
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100, "Name is too long"),
  email,
  subject: z.string().trim().min(3, "Subject must be at least 3 characters").max(150, "Subject is too long"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000, "Message is too long"),
});

// ── Course ───────────────────────────────────────────────────────────────────
export const courseSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(200, "Title is too long"),
  description: z.string().trim().max(2000, "Description is too long").optional().or(z.literal("")),
  duration: z
    .union([z.string(), z.number()])
    .optional()
    .refine((v) => v === "" || v == null || Number(v) >= 0, "Duration must be a positive number"),
  fee: z
    .union([z.string(), z.number()])
    .optional()
    .refine((v) => v === "" || v == null || Number(v) >= 0, "Fee must be a positive number"),
});

// ── Lecturer registration (admin) ────────────────────────────────────────────
export const lecturerSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters").max(50, "Name is too long"),
  email,
  password: z.string().min(6, "Password must be at least 6 characters"),
  specialization: z.string().trim().max(120, "Specialization is too long").optional().or(z.literal("")),
});

// ── Admin manual enroll ──────────────────────────────────────────────────────
export const adminEnrollSchema = z.object({
  studentId: objectId,
  courseId: objectId,
});

// ── Blog editor ──────────────────────────────────────────────────────────────
export const blogSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(200, "Title is too long"),
  contentHtml: z.string().trim().min(1, "Content is required"),
  category: z.string().trim().optional().or(z.literal("")),
});
