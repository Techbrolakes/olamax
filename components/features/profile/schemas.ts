import { z } from "zod";

export const profileSchema = z.object({
  username: z
    .string()
    .trim()
    .min(2, "At least 2 characters")
    .max(32, "Keep it under 32 characters")
    .regex(/^[a-z0-9_.-]+$/i, "Letters, numbers, dot, dash, underscore only")
    .or(z.literal("")),
  fullName: z.string().trim().max(80, "Keep it under 80 characters").or(z.literal("")),
  bio: z.string().trim().max(500, "Keep it under 500 characters").or(z.literal("")),
});

export type ProfileValues = z.infer<typeof profileSchema>;
