// config/pricing.ts
export const PRICING = {
  currency: "USD",
  currencySymbol: "$",
  standard: {
    cents: 14900,
    amount: 149,
    days: 30,
    title: "Standard Listing",
    features: [
      "Live for 30 days",
      "Direct apply link to your ATS or email",
      "Includes Google Jobs structured markup",
      "Stats tracking (views and apply clicks)",
      "Instant edit and renewal controls"
    ]
  },
  featured: {
    cents: 24900,
    amount: 249,
    days: 30,
    title: "Featured Listing",
    badge: "MOST POPULAR",
    features: [
      "Everything in Standard",
      "Pinned to the very top with highlighted badge",
      "Included in the weekly subscriber newsletter",
      "Prominent company logo and badge",
      "Over 3x higher click-through rate"
    ]
  },
  featureUpgrade: {
    cents: 9900,
    amount: 99,
    days: 30,
    title: "Feature Upgrade for Claimed Job"
  },
  monthlyPlan: {
    cents: 39900,
    amount: 399,
    title: "Employer Monthly Unlimited Plan"
  },
  sponsorsSlot: {
    cents: 25000,
    amount: 250,
    title: "Newsletter Sponsor Slot"
  }
} as const;

export type PricingPlan = typeof PRICING.standard | typeof PRICING.featured;
