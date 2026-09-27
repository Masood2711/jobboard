// app/api/employers/login/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { SITE } from "@/config/site";
import { createEmployerSessionToken, EMPLOYER_SESSION_COOKIE } from "@/lib/auth";

const GENERIC_EMAIL_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "icloud.com",
  "proton.me",
  "protonmail.com",
  "aol.com",
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body.email?.trim().toLowerCase();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please enter a valid work email address" },
        { status: 400 }
      );
    }

    const domain = email.split("@")[1] || "";
    let company: any = null;

    try {
      // 1. Look for existing job posted with this employerEmail
      const existingJob = await prisma.job.findFirst({
        where: { employerEmail: email },
        include: { company: true },
        orderBy: { createdAt: "desc" },
      });

      if (existingJob?.company) {
        company = existingJob.company;
      }

      // 2. If not found via jobs, look up company by domain
      if (!company && domain && !GENERIC_EMAIL_DOMAINS.includes(domain)) {
        company = await prisma.company.findFirst({
          where: {
            OR: [
              { domain: { equals: domain, mode: "insensitive" } },
              { websiteUrl: { contains: domain, mode: "insensitive" } },
            ],
          },
        });
      }

      // 3. If not found, look up via company claim
      if (!company) {
        const claim = await prisma.companyClaim.findFirst({
          where: { email },
          include: { company: true },
        });
        if (claim?.company) {
          company = claim.company;
        }
      }

      // 4. If still not found, automatically register/provision company profile for this employer
      if (!company) {
        const rawName = !GENERIC_EMAIL_DOMAINS.includes(domain) && domain.includes(".")
          ? domain.split(".")[0]
          : email.split("@")[0];

        const slug = rawName.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
        const formattedName = rawName
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, (c: string) => c.toUpperCase());

        company = await prisma.company.upsert({
          where: { slug },
          update: {},
          create: {
            slug,
            name: formattedName,
            domain: domain || `${slug}.com`,
            websiteUrl: `https://${domain || `${slug}.com`}`,
            description: `Verified Employer on ${SITE.name}`,
          },
        });
      }
    } catch (dbErr) {
      console.warn("Database lookup fallback during employer login:", dbErr);
      // Graceful fallback for environments with pending migrations
      const rawName = domain && !GENERIC_EMAIL_DOMAINS.includes(domain)
        ? domain.split(".")[0]
        : email.split("@")[0];
      const slug = rawName.toLowerCase().replace(/[^a-z0-9]/g, "-");
      company = {
        slug,
        name: rawName.replace(/\b\w/g, (c: string) => c.toUpperCase()),
      };
    }

    if (!company) {
      return NextResponse.json(
        { error: "Could not locate or initialize employer profile." },
        { status: 500 }
      );
    }

    // Generate employer session token (valid for 30 days)
    const token = await createEmployerSessionToken(email, company.slug);

    const response = NextResponse.json({
      success: true,
      message: `Welcome back! Redirecting to ${company.name} dashboard...`,
      companySlug: company.slug,
      companyName: company.name,
      redirectUrl: `/company/${company.slug}/dashboard`,
    });

    response.cookies.set(EMPLOYER_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
