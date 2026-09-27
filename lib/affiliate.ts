// lib/affiliate.ts
import prisma from "@/lib/db";

export interface AffiliateOfferItem {
  id: string;
  name: string;
  url: string;
  category: "RESUME" | "COURSE" | "CERTIFICATION" | "TOOL";
  headline: string;
  body: string;
  placements: string[];
  active: boolean;
  ctaText: string;
  badge?: string;
}

export const FALLBACK_AFFILIATE_OFFERS: AffiliateOfferItem[] = [
  {
    id: "aff_1",
    name: "Resume Worded AI",
    url: "https://resumeworded.com",
    category: "RESUME",
    headline: "Boost your interview callbacks by 3.5x",
    body: "Scan your resume against target job descriptions and get instant bullet-point improvements tailored to ATS keyword scanners.",
    placements: ["JOB_PAGE", "SIDEBAR", "ALERT_EMAIL"],
    active: true,
    ctaText: "Review Resume For Free",
    badge: "Recommended",
  },
  {
    id: "aff_2",
    name: "LeetCode Premium",
    url: "https://leetcode.com",
    category: "COURSE",
    headline: "Ace Technical Coding & System Design",
    body: "Comprehensive problem sets, mock interviews, and company-specific interview question breakdowns.",
    placements: ["JOB_PAGE", "SIDEBAR"],
    active: true,
    ctaText: "Explore Interview Guide",
    badge: "Popular",
  },
  {
    id: "aff_3",
    name: "NordVPN for Remote Work",
    url: "https://nordvpn.com",
    category: "TOOL",
    headline: "Secure your remote work connection",
    body: "Military-grade encryption and dedicated IPs for remote engineering teams traveling or working from anywhere.",
    placements: ["SIDEBAR", "NEWSLETTER"],
    active: true,
    ctaText: "Get Secure VPN",
    badge: "Security",
  },
];

export async function getAffiliateOffers(placement: string = "JOB_PAGE", limit = 2): Promise<AffiliateOfferItem[]> {
  try {
    const dbOffers = await prisma.affiliateOffer.findMany({
      where: {
        active: true,
        placements: { has: placement },
      },
      take: limit,
    });

    if (dbOffers && dbOffers.length > 0) {
      return dbOffers.map((o) => ({
        ...o,
        category: o.category as any,
        ctaText: "Learn More",
      }));
    }
  } catch {
    // db fallback
  }

  return FALLBACK_AFFILIATE_OFFERS.filter((o) => o.placements.includes(placement)).slice(0, limit);
}
