import { env } from "@/env.mjs";
import { connection } from "@/lib/db";
import { planetscale } from "@lucia-auth/adapter-mysql";
import { github } from "@lucia-auth/oauth/providers";
import { lucia } from "lucia";
import { nextjs_future } from "lucia/middleware";

export const auth = lucia({
  adapter: planetscale(connection, {
    user: "analytics_auth_user",
    session: "analytics_auth_session",
    key: "analytics_auth_key",
  }),
  env: process.env.NODE_ENV === "production" ? "PROD" : "DEV",
  middleware: nextjs_future(),
  getUserAttributes: (userData) => {
    return {
      userId: userData.id,
      email: userData.email,
    };
  },
  sessionCookie: {
    expires: false,
  },
});

export const githubAuth = github(auth, {
  clientId: env.GITHUB_CLIENT_ID,
  clientSecret: env.GITHUB_CLIENT_SECRET,
  scope: ["user:email"],
});

export type Auth = typeof auth;
