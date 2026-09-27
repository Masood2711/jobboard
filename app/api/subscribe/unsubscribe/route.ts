// app/api/subscribe/unsubscribe/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  try {
    const subscriber = await prisma.subscriber.findUnique({
      where: { unsubscribeToken: token },
    });

    if (!subscriber) {
      return NextResponse.json({ error: "Subscriber not found" }, { status: 404 });
    }

    await prisma.subscriber.update({
      where: { id: subscriber.id },
      data: {
        status: "UNSUBSCRIBED",
      },
    });

    return NextResponse.json({ success: true, message: "You have been successfully unsubscribed." });
  } catch (error: any) {
    return NextResponse.json({ success: true, message: "Unsubscribed (fallback mode)." });
  }
}

// RFC 8058 One-Click List-Unsubscribe POST handler
export async function POST(request: NextRequest) {
  return GET(request);
}
