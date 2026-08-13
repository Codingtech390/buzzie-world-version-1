import { z } from "zod";

export const idSchema = z.string().min(1);

export const emailSchema = z.string().trim().email("Please enter a valid email address");

export const passwordSchema = z.string().min(8, "Password must be at least 8 characters");

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

export const slugSchema = z
  .string()
  .trim()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format");
