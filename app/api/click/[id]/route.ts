// app/api/click/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const referrer = request.headers.get("referer") || undefined;

  let targetUrl: string | null = null;

  try {
    const job = await prisma.job.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      select: { id: true, applyUrl: true },
    });

    if (job?.applyUrl) {
      targetUrl = job.applyUrl;

      // Log click asynchronously in JobClick table
      await prisma.jobClick.create({
        data: {
          jobId: job.id,
          referrer,
        },
      });
    }
  } catch (err) {
    console.error("Failed to log job click:", err);
  }

  if (!targetUrl) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Append utm_source=nichejobs as per Section 6 Flow A
  const destination = new URL(targetUrl);
  destination.searchParams.set("utm_source", "nichejobs");

  return NextResponse.redirect(destination.toString(), { status: 302 });
}
