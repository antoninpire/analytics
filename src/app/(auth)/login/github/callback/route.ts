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
    const { existingUser, createUser, providerUser } =
      await githubAuth.validateCallback(code);

    if (providerUser.email === null)
      return new Response(null, {
        status: 400,
      });

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
