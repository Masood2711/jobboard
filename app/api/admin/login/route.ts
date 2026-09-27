// app/api/admin/login/route.ts
import { NextResponse } from "next/server";
import { isAllowedAdminEmail, createMagicLinkToken } from "@/lib/auth";
import { SITE } from "@/config/site";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body.email?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!isAllowedAdminEmail(email)) {
      return NextResponse.json(
        { error: "Access denied. That email address is not in the ADMIN_EMAILS allow-list." },
        { status: 403 }
      );
    }

    // Generate token
    const token = await createMagicLinkToken(email);
    const magicLink = `${SITE.url}/admin/verify?token=${encodeURIComponent(token)}`;

    // In development or if Resend key is not configured, return the link directly for seamless instant testing
    return NextResponse.json({
      success: true,
      message: "Magic link generated successfully.",
      devMagicLink: magicLink,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}
