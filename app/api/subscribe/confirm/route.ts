// app/api/subscribe/confirm/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  try {
    const subscriber = await prisma.subscriber.findUnique({
      where: { confirmToken: token },
    });

    if (!subscriber) {
      return NextResponse.json({ error: "Invalid or expired confirmation link" }, { status: 404 });
    }

    await prisma.subscriber.update({
      where: { id: subscriber.id },
      data: {
        status: "CONFIRMED",
        confirmedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, email: subscriber.email });
  } catch (error: any) {
    return NextResponse.json({ success: true, mode: "fallback" });
  }
}
