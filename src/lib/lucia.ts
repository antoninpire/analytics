import { mySqlClient } from "@/lib/db";
import { mysql2 } from "@lucia-auth/adapter-mysql";
import { github } from "@lucia-auth/oauth/providers";
import lucia from "lucia-auth";
import { nextjs } from "lucia-auth/middleware";

export const auth = lucia({
  adapter: mysql2(mySqlClient),
  env: process.env.NODE_ENV === "production" ? "PROD" : "DEV",
  middleware: nextjs(),
  transformDatabaseUser: (userData) => {
    return {
      userId: userData.id,
      email: userData.email,
    };
  },
  sessionExpiresIn: {
    activePeriod: 1000 * 60 * 60 * 24 * 30, // 1 month
    idlePeriod: 0, // disable session renewal
  },
});

export const githubAuth = github(auth, {
  clientId: process.env.GITHUB_CLIENT_ID ?? "",
  clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
});
