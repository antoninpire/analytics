import { NextResponse } from "next/server";

export async function GET(request: Request) {
  let ip = request.headers.get("x-real-ip") as string;

  const forwardedFor = request.headers.get("x-forwarded-for") as string;
  if (!ip && forwardedFor) {
    ip = forwardedFor?.split(",").at(0) ?? "Unknown";
  }

  return NextResponse.json({
    ip_adress: ip,
  });
}

export async function POST(request: Request) {
  console.log(await request.json());

  let ip = request.headers.get("x-real-ip") as string;

  const forwardedFor = request.headers.get("x-forwarded-for") as string;
  if (!ip && forwardedFor) {
    ip = forwardedFor?.split(",").at(0) ?? "Unknown";
  }

  return NextResponse.json({
    ip_adress: ip,
  });
}
