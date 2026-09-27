// lib/payments/index.ts
import { PaymentProvider } from "./types";
import { StripeProvider } from "./stripe";
import { LemonSqueezyProvider } from "./lemonsqueezy";

export * from "./types";

let currentProvider: PaymentProvider | null = null;

export function getPaymentProvider(): PaymentProvider {
  if (currentProvider) return currentProvider;

  const providerName = (process.env.PAYMENT_PROVIDER || "lemonsqueezy").toLowerCase().trim();

  if (providerName === "stripe") {
    currentProvider = new StripeProvider();
  } else {
    currentProvider = new LemonSqueezyProvider();
  }

  return currentProvider;
}
