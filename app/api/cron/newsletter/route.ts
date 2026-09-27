// app/api/cron/newsletter/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { SITE } from "@/config/site";
import { NICHE } from "@/config/niche";

export async function GET(request: NextRequest) {
  return handleNewsletterCron(request);
}

export async function POST(request: NextRequest) {
  return handleNewsletterCron(request);
}

async function handleNewsletterCron(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET || "dev-cron-secret-secure-token-123";

  if (authHeader !== `Bearer ${cronSecret}` && request.nextUrl.searchParams.get("secret") !== cronSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const freqParam = request.nextUrl.searchParams.get("frequency")?.toUpperCase() || "WEEKLY";
  const frequency = freqParam === "DAILY" ? "DAILY" : "WEEKLY";
  const daysBack = frequency === "DAILY" ? 1 : 7;
  const sinceDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);

  let sentCount = 0;
  let activeJobs: any[] = [];

  try {
    // 1. Fetch recent live jobs
    activeJobs = await prisma.job.findMany({
      where: {
        status: "LIVE",
        publishedAt: { gte: sinceDate },
      },
      include: { company: true },
      orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
      take: 15,
    });
  } catch (err) {
    console.error("Failed to query live jobs for newsletter:", err);
    activeJobs = [];
  }

  if (activeJobs.length === 0) {
    return NextResponse.json({
      success: true,
      message: "No new live jobs found for digest window",
      subscribersDispatched: 0,
    });
  }

  // 2. Fetch confirmed subscribers
  let subscribers: any[] = [];
  try {
    subscribers = await prisma.subscriber.findMany({
      where: {
        status: "CONFIRMED",
        frequency: frequency as any,
      },
    });
  } catch {
    // If db down, mock dispatch
    subscribers = [];
  }

  // 3. Format email body
  const featuredJobs = activeJobs.filter((j) => j.isFeatured);
  const regularJobs = activeJobs.filter((j) => !j.isFeatured);

  const formatJobRow = (job: any) => `
    <div style="padding: 16px; margin-bottom: 12px; border: 1px solid #e2e8f0; border-radius: 8px; background: #ffffff;">
      <div style="font-size: 16px; font-weight: bold; margin-bottom: 4px;">
        <a href="${SITE.url}/jobs/${job.slug}" style="color: #2563eb; text-decoration: none;">
          ${job.title}
        </a>
        ${job.isFeatured ? '<span style="background: #fef08a; color: #854d0e; font-size: 11px; padding: 2px 6px; border-radius: 4px; margin-left: 6px; font-weight: 600;">FEATURED</span>' : ''}
      </div>
      <div style="color: #475569; font-size: 13px; margin-bottom: 6px;">
        <strong>${job.company?.name || "Company"}</strong> &bull; ${job.category} &bull; ${job.locationType || "REMOTE"}
      </div>
      ${job.salaryMin ? `<div style="color: #15803d; font-size: 13px; font-weight: 600;">$${job.salaryMin.toLocaleString()} - $${(job.salaryMax || job.salaryMin).toLocaleString()} / year</div>` : ''}
    </div>
  `;

  const issueSubject = `${frequency === "DAILY" ? "Daily Job Alert" : "Weekly Digest"}: ${activeJobs.length} new ${NICHE.name} roles on ${SITE.name}`;

  // 4. Send to all matching subscribers
  for (const sub of subscribers) {
    const unsubUrl = `${SITE.url}/subscribe/unsubscribe?token=${sub.unsubscribeToken}`;

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1e293b; background: #f8fafc;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="font-size: 24px; font-weight: 800; color: #0f172a; margin: 0;">${SITE.name}</h1>
          <p style="color: #64748b; font-size: 14px; margin: 4px 0 0 0;">Curated ${NICHE.name} Opportunities</p>
        </div>

        <div style="background: #ffffff; border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0; margin-bottom: 24px;">
          <h2 style="font-size: 18px; font-weight: 700; margin-top: 0; color: #0f172a;">🔥 Top Roles This ${frequency === "DAILY" ? "Day" : "Week"}</h2>
          <p style="font-size: 13px; color: #64748b; margin-bottom: 20px;">Here are hand-verified opportunities open for immediate application.</p>
          
          ${activeJobs.map(formatJobRow).join("")}

          <!-- Monetization Sponsor / Affiliate Block -->
          <div style="margin-top: 24px; padding: 16px; background: #eff6ff; border-radius: 8px; border: 1px solid #bfdbfe;">
            <div style="font-size: 11px; font-weight: 700; color: #1d4ed8; text-transform: uppercase; margin-bottom: 4px;">Partner Recommendation</div>
            <div style="font-size: 14px; font-weight: 700; color: #1e3a8a;">⚡ Optimize your Resume for ATS filters with AI</div>
            <p style="font-size: 12px; color: #3b82f6; margin: 4px 0 10px 0;">Land 3x more interviews by scoring your CV against target job descriptions.</p>
            <a href="${SITE.url}/about" style="display: inline-block; background: #2563eb; color: #ffffff; font-size: 12px; font-weight: 600; padding: 8px 16px; border-radius: 6px; text-decoration: none;">Try Resume Optimizer &rarr;</a>
          </div>
        </div>

        <div style="text-align: center; font-size: 12px; color: #94a3b8; line-height: 1.6;">
          <p>You received this email because you subscribed to alerts on <a href="${SITE.url}" style="color: #64748b;">${SITE.name}</a>.</p>
          <p><a href="${unsubUrl}" style="color: #64748b; text-decoration: underline;">Unsubscribe from alerts</a></p>
        </div>
      </div>
    `;

    await sendEmail({
      to: sub.email,
      subject: issueSubject,
      html,
    });
    sentCount++;
  }

  // Record issue in database
  try {
    await prisma.newsletterIssue.create({
      data: {
        subject: issueSubject,
        bodyHtml: `<p>Dispatched ${frequency} digest with ${activeJobs.length} jobs to ${sentCount} subscribers.</p>`,
        status: "SENT",
        sentAt: new Date(),
      },
    });
  } catch {
    // fallback
  }

  return NextResponse.json({
    success: true,
    frequency,
    jobsIncluded: activeJobs.length,
    subscribersDispatched: sentCount,
    timestamp: new Date().toISOString(),
  });
}
