// app/api/click/affiliate/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { FALLBACK_AFFILIATE_OFFERS } from "@/lib/affiliate";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const offerId = searchParams.get("offerId");
  const placement = searchParams.get("placement") || "JOB_PAGE";

  if (!offerId) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  let targetUrl = "https://nichejobs.work";

  try {
    const offer = await prisma.affiliateOffer.findUnique({
      where: { id: offerId },
    });

    if (offer) {
      targetUrl = offer.url;

      // Track click asynchronously
      await prisma.affiliateClick.create({
        data: {
          offerId: offer.id,
          placement,
        },
      });
    } else {
      const fallback = FALLBACK_AFFILIATE_OFFERS.find((o) => o.id === offerId);
      if (fallback) {
        targetUrl = fallback.url;
      }
    }
  } catch {
    const fallback = FALLBACK_AFFILIATE_OFFERS.find((o) => o.id === offerId);
    if (fallback) {
      targetUrl = fallback.url;
    }
  }

  // 302 temporary redirect to affiliate partner URL
  return NextResponse.redirect(targetUrl, 302);
}
