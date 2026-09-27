// app/api/webhooks/payments/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getPaymentProvider } from "@/lib/payments";

export async function POST(request: Request) {
  try {
    const provider = getPaymentProvider();

    // Verify webhook signature
    const paymentEvent = await provider.verifyWebhook(request);
    if (!paymentEvent) {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
    }

    const { eventId, type, providerSessionId, amountCents, currency, orderId, feeCents, receiptUrl } = paymentEvent;

    // Idempotency check: store in WebhookEvent table (Section 13.2 Rule 3)
    try {
      const existingEvent = await prisma.webhookEvent.findUnique({
        where: {
          provider_eventId: {
            provider: process.env.PAYMENT_PROVIDER || "lemonsqueezy",
            eventId,
          },
        },
      });

      if (existingEvent) {
        // Duplicate webhook: harmlessly return 200 OK
        return NextResponse.json({ received: true, note: "Duplicate webhook event ignored" });
      }

      await prisma.webhookEvent.create({
        data: {
          provider: process.env.PAYMENT_PROVIDER || "lemonsqueezy",
          eventId,
        },
      });
    } catch {
      // In local dev without live database, continue
    }

    if (!orderId) {
      return NextResponse.json({ received: true, note: "No orderId associated with event" });
    }

    // Process payment success (PAID)
    if (type === "PAID") {
      try {
        const order = await prisma.order.findUnique({
          where: { id: orderId },
          include: { job: true },
        });

        if (order) {
          // Verify amount and currency match (Section 13.2 Rule 3)
          if (order.amountCents === amountCents && order.currency === currency) {
            await prisma.order.update({
              where: { id: order.id },
              data: {
                status: "PAID",
                paidAt: new Date(),
                feeCents: feeCents || null,
                receiptUrl: receiptUrl || null,
                providerSessionId,
              },
            });

            // Check if employer email has an approved listing before (Flow C step 6)
            const hasPriorApprovedJob = await prisma.job.findFirst({
              where: {
                employerEmail: order.payerEmail,
                status: "LIVE",
                id: { not: order.jobId },
              },
            });

            const newJobStatus = hasPriorApprovedJob ? "LIVE" : "PENDING_REVIEW";
            const now = new Date();

            const updatedJob = await prisma.job.update({
              where: { id: order.jobId },
              data: {
                status: newJobStatus,
                publishedAt: newJobStatus === "LIVE" ? now : undefined,
                expiresAt:
                  newJobStatus === "LIVE"
                    ? new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
                    : undefined,
              },
            });

            if (newJobStatus === "LIVE" && updatedJob?.slug) {
              const { notifyGoogleIndexing } = await import("@/lib/indexing");
              await notifyGoogleIndexing(updatedJob.slug, "URL_UPDATED");
            }
          }
        }
      } catch (err) {
        // database error handling
      }
    }

    // Process refund (REFUNDED)
    if (type === "REFUNDED") {
      try {
        const order = await prisma.order.findUnique({
          where: { id: orderId },
        });

        if (order) {
          await prisma.order.update({
            where: { id: order.id },
            data: { status: "REFUNDED" },
          });

          await prisma.job.update({
            where: { id: order.jobId },
            data: { status: "REMOVED" },
          });
        }
      } catch {
        // fallback
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Webhook processing error" }, { status: 500 });
  }
}
