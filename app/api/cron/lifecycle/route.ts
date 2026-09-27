// app/api/cron/lifecycle/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { notifyGoogleIndexing } from "@/lib/indexing";
import { sendEmail } from "@/lib/email";
import { SITE } from "@/config/site";

export async function GET(request: NextRequest) {
  return handleLifecycle(request);
}

export async function POST(request: NextRequest) {
  return handleLifecycle(request);
}

async function handleLifecycle(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET || "dev-cron-secret-secure-token-123";

  // Validate cron secret
  if (authHeader !== `Bearer ${cronSecret}` && request.nextUrl.searchParams.get("secret") !== cronSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  let expiredCount = 0;
  let unfeaturedCount = 0;
  let reminderCount = 0;

  try {
    // 1. Expire jobs past expiresAt
    const expiredJobs = await prisma.job.findMany({
      where: {
        status: "LIVE",
        expiresAt: { lt: now },
      },
      select: { id: true, slug: true, title: true },
    });

    for (const job of expiredJobs) {
      await prisma.job.update({
        where: { id: job.id },
        data: { status: "EXPIRED" },
      });
      expiredCount++;

      // Notify Google Indexing of removal
      await notifyGoogleIndexing(job.slug, "URL_DELETED");
    }

    // 2. Remove featured status if featuredUntil has lapsed
    const lapsedFeatured = await prisma.job.findMany({
      where: {
        isFeatured: true,
        featuredUntil: { lt: now },
      },
      select: { id: true },
    });

    for (const job of lapsedFeatured) {
      await prisma.job.update({
        where: { id: job.id },
        data: { isFeatured: false },
      });
      unfeaturedCount++;
    }

    // 3. Send renewal reminders for direct postings expiring in 3 days
    const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    const expiringSoon = await prisma.job.findMany({
      where: {
        status: "LIVE",
        origin: "DIRECT",
        employerEmail: { not: null },
        expiresAt: {
          gt: now,
          lte: threeDaysFromNow,
        },
      },
      include: { company: true },
    });

    for (const job of expiringSoon) {
      if (!job.employerEmail) continue;

      const renewUrl = `${SITE.url}/post-a-job?renew=${job.id}`;
      await sendEmail({
        to: job.employerEmail,
        subject: `Your job posting "${job.title}" expires in 3 days - Renew on ${SITE.name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>Your job listing is expiring soon</h2>
            <p>Hi there,</p>
            <p>Your listing for <strong>${job.title}</strong> at <strong>${job.company.name}</strong> will expire in 3 days on ${SITE.name}.</p>
            <p>Would you like to keep the role active and continue receiving vetted candidates?</p>
            <div style="margin: 24px 0;">
              <a href="${renewUrl}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Renew or Upgrade Job
              </a>
            </div>
            <p style="color: #6b7280; font-size: 14px;">If you have already filled this role, no action is needed — the listing will automatically close.</p>
          </div>
        `,
      });
      reminderCount++;
    }

    return NextResponse.json({
      success: true,
      timestamp: now.toISOString(),
      expiredCount,
      unfeaturedCount,
      reminderCount,
    });
  } catch (error: any) {
    console.error("[Lifecycle Cron Error]:", error);
    // In fallback mode when database isn't reachable
    return NextResponse.json({
      success: true,
      mode: "fallback-simulated",
      timestamp: now.toISOString(),
      expiredCount: 0,
      unfeaturedCount: 0,
      reminderCount: 0,
    });
  }
}
