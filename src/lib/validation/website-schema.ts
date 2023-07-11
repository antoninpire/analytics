import { z } from "zod";

export const addWebsiteSchema = z.object({
  name: z.string().min(1).max(255),
  url: z.string().url(),
});

export const editWebsiteSchema = z.object({
  name: z.string().min(1).max(255),
  url: z.string().url(),
  id: z.string().min(1),
});

export const deleteWebsiteSchema = z.object({
  id: z.string().min(1),
});
