// lib/payments/stripe.ts
import Stripe from "stripe";
import { PaymentProvider, CreateCheckoutInput, PaymentEvent } from "./types";

export class StripeProvider implements PaymentProvider {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
      apiVersion: "2025-02-24.acacia" as any,
    });
  }

  async createCheckout(input: CreateCheckoutInput): Promise<{ url: string; providerSessionId: string }> {
    // If running in development with placeholder key, simulate checkout url
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes("placeholder")) {
      const mockSessionId = `cs_test_mock_${Date.now()}`;
      return {
        url: `${input.successUrl}?session_id=${mockSessionId}&orderId=${input.orderId}`,
        providerSessionId: mockSessionId,
      };
    }

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: input.currency.toLowerCase(),
            product_data: {
              name: `${input.plan} Listing - ${input.jobTitle || "Job Listing"}`,
              description: "30-day listing on NicheJobs with structured data and direct apply link",
            },
            unit_amount: input.amountCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: input.payerEmail,
      metadata: {
        orderId: input.orderId,
        jobId: input.jobId,
        plan: input.plan,
      },
      success_url: `${input.successUrl}?session_id={CHECKOUT_SESSION_ID}&orderId=${input.orderId}`,
      cancel_url: input.cancelUrl,
    });

    if (!session.url) {
      throw new Error("Stripe failed to return a checkout URL.");
    }

    return {
      url: session.url,
      providerSessionId: session.id,
    };
  }

  async verifyWebhook(req: Request): Promise<PaymentEvent | null> {
    const signature = req.headers.get("stripe-signature");
    const secret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!signature || !secret) {
      return null;
    }

    const rawBody = await req.text();
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(rawBody, signature, secret);
    } catch (err) {
      return null;
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      return {
        eventId: event.id,
        type: "PAID",
        providerSessionId: session.id,
        amountCents: session.amount_total || 0,
        currency: (session.currency || "USD").toUpperCase(),
        orderId: session.metadata?.orderId,
        payerEmail: session.customer_details?.email || undefined,
      };
    }

    if (event.type === "charge.refunded") {
      const charge = event.data.object as Stripe.Charge;
      return {
        eventId: event.id,
        type: "REFUNDED",
        providerSessionId: charge.id,
        amountCents: charge.amount_refunded || 0,
        currency: charge.currency.toUpperCase(),
        orderId: charge.metadata?.orderId,
      };
    }

    return null;
  }

  async refund(providerSessionId: string): Promise<void> {
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes("placeholder")) {
      return; // mock mode
    }

    // Retrieve session to get payment_intent
    const session = await this.stripe.checkout.sessions.retrieve(providerSessionId);
    if (session.payment_intent) {
      await this.stripe.refunds.create({
        payment_intent: String(session.payment_intent),
      });
    }
  }
}
