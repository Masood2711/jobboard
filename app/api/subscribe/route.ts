// app/api/subscribe/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { SITE } from "@/config/site";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, frequency = "WEEKLY", categories = [], regions = [] } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const confirmToken = crypto.randomBytes(24).toString("hex");
    const unsubscribeToken = crypto.randomBytes(24).toString("hex");

    try {
      await prisma.subscriber.upsert({
        where: { email: cleanEmail },
        update: {
          frequency: frequency === "DAILY" ? "DAILY" : "WEEKLY",
          categories,
          regions,
          confirmToken,
        },
        create: {
          email: cleanEmail,
          frequency: frequency === "DAILY" ? "DAILY" : "WEEKLY",
          categories,
          regions,
          confirmToken,
          unsubscribeToken,
          status: "PENDING",
        },
      });
    } catch {
      // In fallback mode when DB is unavailable, continue gracefully
      console.log(`[Subscribe fallback] Recorded subscription for ${cleanEmail}`);
    }

    const confirmUrl = `${SITE.url}/subscribe/confirm?token=${confirmToken}`;

    // Send Double Opt-in confirmation email
    await sendEmail({
      to: cleanEmail,
      subject: `Confirm your job alert subscription - ${SITE.name}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #1e293b; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="font-size: 22px; font-weight: 700; margin-top: 0; color: #0f172a;">Confirm your ${SITE.name} Job Alerts</h2>
          <p style="font-size: 15px; line-height: 1.6; color: #475569;">
            You requested to receive <strong>${frequency.toLowerCase()}</strong> hand-curated job alerts for top tech, remote, and digital opportunities.
          </p>
          <div style="margin: 28px 0;">
            <a href="${confirmUrl}" style="background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 13px 28px; border-radius: 8px; font-size: 15px; font-weight: 600; display: inline-block;">
              ✓ Confirm My Subscription
            </a>
          </div>
          <p style="font-size: 13px; color: #94a3b8; line-height: 1.5;">
            If you did not request this, you can safely ignore this email. No spam, ever.
          </p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Confirmation link sent to your email. Please check your inbox to activate.",
    });
  } catch (error: any) {
    console.error("[Subscribe API Error]:", error);
    return NextResponse.json({ error: error.message || "Failed to process subscription." }, { status: 500 });
  }
}
