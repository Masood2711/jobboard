// app/api/admin/jobs/[id]/route.ts
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import prisma from "@/lib/db";
import { notifyGoogleIndexing } from "@/lib/indexing";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { action } = body;

  try {
    if (action === "approve") {
      const updated = await prisma.job.update({
        where: { id },
        data: {
          status: "LIVE",
          publishedAt: new Date(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });
      // Notify Google that this job is now live
      if (updated.slug) {
        await notifyGoogleIndexing(updated.slug, "URL_UPDATED");
      }
      return NextResponse.json({ success: true, job: updated });
    } else if (action === "reject") {
      const updated = await prisma.job.update({
        where: { id },
        data: {
          status: "REJECTED",
        },
      });
      if (updated.slug) {
        await notifyGoogleIndexing(updated.slug, "URL_DELETED");
      }
      return NextResponse.json({ success: true, job: updated });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update job" }, { status: 500 });
  }
}
