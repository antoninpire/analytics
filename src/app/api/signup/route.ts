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
    const user = await auth.createUser({
      primaryKey: {
        providerId: "email",
        providerUserId: email,
        password,
      },
      attributes: {
        email,
      },
    });
    const session = await auth.createSession(user.userId);
    const authRequest = auth.handleRequest({ request, cookies });
    authRequest.setSession(session);
    // using redirect() ignores cookie
    return NextResponse.json({ success: true });
  } catch (error) {
    // email taken
    return NextResponse.json(
      {
        error: "Email already exists",
      },
      {
        status: 400,
      }
    );
  }
};
