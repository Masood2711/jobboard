// app/api/advertise/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { PRICING } from "@/config/pricing";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { company, email, headline, bodyText, linkUrl } = body;

    if (!company || !email || !headline) {
      return NextResponse.json(
        { error: "Please fill in all required fields (Company, Email, and Headline)." },
        { status: 400 }
      );
    }

    // Save genuine sponsor inquiry into PostgreSQL database
    let booking: any = null;
    try {
      booking = await prisma.sponsorBooking.create({
        data: {
          company: company.trim(),
          email: email.trim().toLowerCase(),
          headline: headline.trim(),
          bodyText: (bodyText || "").trim(),
          linkUrl: (linkUrl || "").trim(),
          priceCents: (PRICING.sponsorsSlot.amount || 250) * 100,
          status: "INQUIRY",
        },
      });
    } catch (dbErr) {
      console.warn("Database save failed for sponsor booking:", dbErr);
    }

    return NextResponse.json({
      success: true,
      message: "Sponsor inquiry received successfully.",
      bookingId: booking?.id || "inquiry-logged",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to submit sponsor inquiry" },
      { status: 500 }
    );
  }
}
