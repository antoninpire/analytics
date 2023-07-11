import { auth } from "@/lib/lucia";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  const authRequest = auth.handleRequest({ request, cookies });
  const { session } = await authRequest.validateUser();
  if (!session) {
    return NextResponse.json(null, {
      status: 401,
    });
  }
  await auth.invalidateSession(session.sessionId);
  authRequest.setSession(null); // delete session cookie
  return new Response(null, {
    status: 302,
    headers: {
      location: "/login",
    },
  });
};
