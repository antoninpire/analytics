import { db } from "@/lib/db";
import { auth, githubAuth } from "@/lib/lucia";
import { LuciaOAuthRequestError } from "@lucia-auth/oauth";
import { cookies } from "next/headers";

import type { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  const authRequest = auth.handleRequest({ request, cookies });
  const session = await authRequest.validate();
  if (session) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  }
  const cookieStore = cookies();
  const storedState = cookieStore.get("github_oauth_state")?.value;
  const url = new URL(request.url);
  const state = url.searchParams.get("state");
  const code = url.searchParams.get("code");
  // validate state
  if (!storedState || !state || storedState !== state || !code) {
    return new Response(null, {
      status: 400,
    });
  }
  try {
    let { existingUser, createUser, providerUser, tokens } =
      await githubAuth.validateCallback(code);

    if (providerUser.email === null) {
      const res = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `token ${tokens.accessToken}`,
        },
      });
      const emails = await res.json();
      if (!emails || emails.length === 0 || !emails[0].email) {
        return new Response(null, {
          status: 400,
        });
      }
      providerUser.email = emails[0].email;

      const currentUser = await db.query.usersTable.findFirst({
        where: (table, { eq }) => eq(table.email, providerUser.email!),
      });

      existingUser = currentUser ? { userId: currentUser.id } : null;
    }

    const getUser = async () => {
      if (existingUser) return existingUser;
      const user = await createUser({
        email: providerUser.email!,
      });
      return user;
    };

    const user = await getUser();
    const session = await auth.createSession(user.userId);
    authRequest.setSession(session);
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  } catch (e) {
    if (e instanceof LuciaOAuthRequestError) {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
};
