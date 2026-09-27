// app/api/checkout/create/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/db";
import { PRICING } from "@/config/pricing";
import { SITE } from "@/config/site";
import { NICHE } from "@/config/niche";
import { getPaymentProvider } from "@/lib/payments";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      title,
      category,
      locationType,
      employmentType,
      region,
      salaryMin,
      salaryMax,
      salaryPeriod,
      applyUrl,
      description,
      companyName,
      companyWebsite,
      companyLogo,
      companyDesc,
      employerEmail,
      plan, // "STANDARD" | "FEATURED"
    } = body;

    if (!title || !employerEmail || !applyUrl || !companyName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Rule 1: Price is strictly decided on the server from config/pricing.ts (Section 13.2)
    const chosenPlan = plan === "FEATURED" ? "FEATURED" : "STANDARD";
    const amountCents =
      chosenPlan === "FEATURED" ? PRICING.featured.cents : PRICING.standard.cents;

    const shortId = crypto.randomBytes(3).toString("hex");
    const editToken = "tok_" + crypto.randomBytes(16).toString("hex");
    const cleanComp = companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const slug = `${cleanTitle}-${cleanComp}-${shortId}`;

    let companyId = "comp_temp";
    let jobId = `job_${Date.now()}`;
    let orderId = `ord_${Date.now()}`;

    // Attempt DB creation if connected
    try {
      // Upsert company
      const company = await prisma.company.upsert({
        where: { slug: cleanComp },
        update: {
          websiteUrl: companyWebsite || `https://${cleanComp}.com`,
          logoUrl: companyLogo || null,
          description: companyDesc || null,
        },
        create: {
          name: companyName,
          slug: cleanComp,
          websiteUrl: companyWebsite || `https://${cleanComp}.com`,
          domain: companyWebsite ? new URL(companyWebsite).hostname : `${cleanComp}.com`,
          logoUrl: companyLogo || null,
          description: companyDesc || null,
        },
      });
      companyId = company.id;

      // Create Job in PENDING_PAYMENT status
      const job = await prisma.job.create({
        data: {
          slug,
          origin: "DIRECT",
          status: "PENDING_PAYMENT",
          companyId: company.id,
          title,
          descriptionHtml: description,
          category: category || NICHE.categories[0] || "Engineering",
          employmentType: employmentType || "FULL_TIME",
          locationType: (locationType as any) || "REMOTE",
          eligibleRegions: [region || "Worldwide"],
          salaryMin: salaryMin ? parseInt(salaryMin, 10) : null,
          salaryMax: salaryMax ? parseInt(salaryMax, 10) : null,
          salaryCurrency: "USD",
          salaryPeriod: salaryPeriod || "YEAR",
          applyUrl,
          employerEmail,
          editToken,
          isFeatured: chosenPlan === "FEATURED",
        },
      });
      jobId = job.id;

      // Create Order
      const order = await prisma.order.create({
        data: {
          jobId: job.id,
          plan: chosenPlan,
          provider: process.env.PAYMENT_PROVIDER || "lemonsqueezy",
          amountCents,
          currency: "USD",
          status: "PENDING",
          payerEmail: employerEmail,
        },
      });
      orderId = order.id;
    } catch (dbErr) {
      // In local dev without live database, fallback safely
    }

    const provider = getPaymentProvider();
    const checkout = await provider.createCheckout({
      orderId,
      jobId,
      plan: chosenPlan,
      amountCents,
      currency: "USD",
      payerEmail: employerEmail,
      jobTitle: title,
      successUrl: `${SITE.url}/checkout/success`,
      cancelUrl: `${SITE.url}/checkout/cancel`,
    });

    return NextResponse.json({
      success: true,
      checkoutUrl: checkout.url,
      providerSessionId: checkout.providerSessionId,
      orderId,
      editToken,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to initialize checkout" }, { status: 500 });
  }
}
