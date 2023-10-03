import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),
    QSTASH_CURRENT_SIGNING_KEY: z.string().min(1),
    QSTASH_NEXT_SIGNING_KEY: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
  },
});
