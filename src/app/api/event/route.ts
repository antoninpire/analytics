import { db } from "@/lib/db";
import { insertLogSchema, logsTable } from "@/lib/db/schema";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const res = await request.json();

  const result = insertLogSchema.safeParse(res);

  if (result.success) {
    console.log(result.data);
    await db.insert(logsTable).values(result.data);
  } else {
    return NextResponse.json({
      success: false,
    });
  }

  return NextResponse.json({ hello: "world" });
}
