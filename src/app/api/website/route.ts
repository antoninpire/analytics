import { db } from "@/lib/db";
import { websitesTable } from "@/lib/db/schema";
import { auth } from "@/lib/lucia";
import {
  addWebsiteSchema,
  deleteWebsiteSchema,
  editWebsiteSchema,
} from "@/lib/validation/website-schema";
import { createId } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const parsedData = addWebsiteSchema.safeParse(await request.json());
  if (!parsedData.success)
    return NextResponse.json(
      {
        error: "Invalid input",
      },
      {
        status: 400,
      }
    );

  const { name, url } = parsedData.data;
  try {
    const authRequest = auth.handleRequest({ cookies });
    const { user } = await authRequest.validateUser();
    if (!user?.userId)
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 403,
        }
      );

    const trimmedUrl = url.includes("https://")
      ? "https://" + new URL(url).hostname
      : "http://" + new URL(url).hostname;

    const previousWebsite = await db.query.websitesTable.findFirst({
      where: (table, { eq, and }) =>
        and(eq(table.user_id, user.userId), eq(table.url, trimmedUrl)),
    });

    if (previousWebsite !== undefined)
      return NextResponse.json(
        {
          error: "Website already exists",
        },
        {
          status: 409,
        }
      );

    const websiteId = createId();
    await db.insert(websitesTable).values({
      id: websiteId,
      name,
      url: trimmedUrl,
      created_at: new Date(),
      user_id: user.userId,
    });
    return NextResponse.json({
      websiteId,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(null, {
      status: 400,
    });
  }
}

export async function PATCH(request: Request) {
  const parsedData = editWebsiteSchema.safeParse(await request.json());
  if (!parsedData.success)
    return NextResponse.json(
      {
        error: "Invalid input",
      },
      {
        status: 400,
      }
    );

  const { name, url, id } = parsedData.data;
  try {
    const authRequest = auth.handleRequest({ cookies });
    const { user } = await authRequest.validateUser();
    if (!user?.userId)
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 403,
        }
      );

    const previousWebsite = await db.query.websitesTable.findFirst({
      where: (table, { eq, and }) =>
        and(eq(table.user_id, user.userId), eq(table.id, id)),
    });

    if (previousWebsite === undefined)
      return NextResponse.json({
        error: "Website not found",
      });

    const trimmedUrl = url.includes("https://")
      ? "https://" + new URL(url).hostname
      : "http://" + new URL(url).hostname;

    await db
      .update(websitesTable)
      .set({
        name,
        url: trimmedUrl,
      })
      .where(eq(websitesTable.id, id));
    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(null, {
      status: 400,
    });
  }
}

export async function DELETE(request: Request) {
  const parsedData = deleteWebsiteSchema.safeParse(await request.json());
  if (!parsedData.success)
    return NextResponse.json(
      {
        error: "Invalid input",
      },
      {
        status: 400,
      }
    );

  const { id } = parsedData.data;
  try {
    const authRequest = auth.handleRequest({ cookies });
    const { user } = await authRequest.validateUser();
    if (!user?.userId)
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 403,
        }
      );

    const previousWebsite = await db.query.websitesTable.findFirst({
      where: (table, { eq, and }) =>
        and(eq(table.user_id, user.userId), eq(table.id, id)),
    });

    if (previousWebsite === undefined)
      return NextResponse.json({
        error: "Website not found",
      });

    await db.delete(websitesTable).where(eq(websitesTable.id, id));
    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(null, {
      status: 400,
    });
  }
}
