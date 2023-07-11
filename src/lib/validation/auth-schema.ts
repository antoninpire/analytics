import { z } from "zod";

export const authSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, "Must be at least 6 chars")
    .max(100, "Must be at most 100 chars"),
});
