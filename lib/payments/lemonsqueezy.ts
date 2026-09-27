// lib/payments/lemonsqueezy.ts
import crypto from "crypto";
import { PaymentProvider, CreateCheckoutInput, PaymentEvent } from "./types";

export class LemonSqueezyProvider implements PaymentProvider {
  private apiKey: string;
  private storeId: string;
  private webhookSecret: string;

  constructor() {
    this.apiKey = process.env.LEMONSQUEEZY_API_KEY || "";
    this.storeId = process.env.LEMONSQUEEZY_STORE_ID || "";
    this.webhookSecret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET || "";
  }

  async createCheckout(input: CreateCheckoutInput): Promise<{ url: string; providerSessionId: string }> {
    // Development fallback simulation
    if (!this.apiKey || !this.storeId) {
      const mockSessionId = `ls_test_mock_${Date.now()}`;
      return {
        url: `${input.successUrl}?session_id=${mockSessionId}&orderId=${input.orderId}`,
        providerSessionId: mockSessionId,
      };
    }

    const payload = {
      data: {
        type: "checkouts",
        attributes: {
          checkout_data: {
            email: input.payerEmail,
            custom: {
              orderId: input.orderId,
              jobId: input.jobId,
              plan: input.plan,
            },
          },
          custom_price: input.amountCents,
          product_options: {
            name: `${input.plan} Listing - ${input.jobTitle || "Job Listing"}`,
            redirect_url: `${input.successUrl}?orderId=${input.orderId}`,
          },
        },
        relationships: {
          store: {
            data: {
              type: "stores",
              id: this.storeId,
            },
          },
        },
      },
    };

    const res = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Lemon Squeezy API error (${res.status}): ${errText}`);
    }

    const json = await res.json();
    const checkoutUrl = json.data?.attributes?.url;
    const checkoutId = json.data?.id;

    return {
      url: checkoutUrl,
      providerSessionId: checkoutId,
    };
  }

  async verifyWebhook(req: Request): Promise<PaymentEvent | null> {
    const signature = req.headers.get("x-signature");
    if (!signature || !this.webhookSecret) return null;

    const rawBody = await req.text();
    const hmac = crypto.createHmac("sha256", this.webhookSecret);
    const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
    const signatureBuffer = Buffer.from(signature, "utf8");

    if (!crypto.timingSafeEqual(digest, signatureBuffer)) {
      return null;
    }

    const event = JSON.parse(rawBody);
    const eventName = event.meta?.event_name;
    const customData = event.meta?.custom_data || {};
    const attributes = event.data?.attributes || {};

    if (eventName === "order_created") {
      return {
        eventId: String(event.data?.id),
        type: "PAID",
        providerSessionId: String(event.data?.id),
        amountCents: attributes.total || 0,
        currency: (attributes.currency || "USD").toUpperCase(),
        feeCents: attributes.tax || 0,
        orderId: customData.orderId,
        payerEmail: attributes.user_email,
        receiptUrl: attributes.urls?.receipt,
      };
    }

    if (eventName === "order_refunded") {
      return {
        eventId: String(event.data?.id),
        type: "REFUNDED",
        providerSessionId: String(event.data?.id),
        amountCents: attributes.total || 0,
        currency: (attributes.currency || "USD").toUpperCase(),
        orderId: customData.orderId,
      };
    }

    return null;
  }

  async refund(providerSessionId: string): Promise<void> {
    // In Lemon Squeezy API, refunds can be initiated via API or merchant dashboard
    // https://docs.lemonsqueezy.com/api/orders#refund-an-order
    if (!this.apiKey) return;

    await fetch(`https://api.lemonsqueezy.com/v1/orders/${providerSessionId}/refund`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        Accept: "application/vnd.api+json",
      },
    });
  }
}
