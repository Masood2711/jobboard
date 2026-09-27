// lib/payments/types.ts

export type PaymentEvent = {
  eventId: string;
  type: "PAID" | "FAILED" | "REFUNDED";
  providerSessionId: string;
  amountCents: number;
  currency: string;
  feeCents?: number;
  receiptUrl?: string;
  orderId?: string;
  payerEmail?: string;
};

export interface CreateCheckoutInput {
  orderId: string;
  jobId: string;
  plan: "STANDARD" | "FEATURED" | "FEATURE_UPGRADE";
  amountCents: number;
  currency: string;
  payerEmail: string;
  successUrl: string;
  cancelUrl: string;
  jobTitle?: string;
}

export interface PaymentProvider {
  createCheckout(input: CreateCheckoutInput): Promise<{ url: string; providerSessionId: string }>;
  verifyWebhook(req: Request): Promise<PaymentEvent | null>;
  refund(providerSessionId: string): Promise<void>;
}
