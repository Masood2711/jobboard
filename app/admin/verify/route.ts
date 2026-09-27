// app/admin/verify/route.ts
import { NextResponse } from "next/server";
import { verifyMagicLinkToken, createAdminSessionToken } from "@/lib/auth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/admin/login?error=Missing+token", request.url));
  }

  const email = await verifyMagicLinkToken(token);
  if (!email) {
    return NextResponse.redirect(new URL("/admin/login?error=Invalid+or+expired+token", request.url));
  }

  const sessionToken = await createAdminSessionToken(email);
  const response = NextResponse.redirect(new URL("/admin", request.url));

  response.cookies.set("niche_admin_session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: "/",
  });

  return response;
}
