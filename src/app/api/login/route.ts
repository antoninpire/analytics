import { auth } from "@/lib/lucia";
import { authSchema } from "@/lib/validation/auth-schema";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  const parsedData = authSchema.safeParse(await request.json());

  if (!parsedData.success)
    return NextResponse.json(
      {
        error: "Invalid input",
      },
      {
        status: 400,
      }
    );

  const { email, password } = parsedData.data;
  try {
    const authRequest = auth.handleRequest({ request, cookies });
    const key = await auth.useKey("email", email, password);
    const session = await auth.createSession(key.userId);
    authRequest.setSession(session);
    return new Response(null, {
      status: 302,
      headers: {
        location: "/",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Invalid email or password",
      },
      {
        status: 400,
      }
    );
  }
};
