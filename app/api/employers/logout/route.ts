// app/api/employers/logout/route.ts
import { NextResponse } from "next/server";
import { EMPLOYER_SESSION_COOKIE } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(EMPLOYER_SESSION_COOKIE);
  return response;
}
