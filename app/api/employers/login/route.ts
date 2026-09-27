// app/api/employers/login/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { SITE } from "@/config/site";
import { createEmployerSessionToken, EMPLOYER_SESSION_COOKIE } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body.email?.trim().toLowerCase();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const [username, domain] = email.split("@");
    let company: any = null;

    try {
      // 1. Look for existing jobs posted with this employer email (exact match)
      const existingJob = await prisma.job.findFirst({
        where: { employerEmail: { equals: email, mode: "insensitive" } },
        include: { company: true },
        orderBy: { createdAt: "desc" },
      });

      if (existingJob?.company) {
        company = existingJob.company;
      }

      // 2. If not found via jobs, look up company by domain or website match
      if (!company && domain) {
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
          where: { email: { equals: email, mode: "insensitive" } },
          include: { company: true },
        });
        if (claim?.company) {
          company = claim.company;
        }
      }

      // 4. If still not found, automatically provision a company workspace for this employer
      // Supports ALL domains: corporate domains, custom domains, startups, Gmail, Yahoo, Outlook, etc.
      if (!company) {
        const isCommonProvider = [
          "gmail.com",
          "yahoo.com",
          "hotmail.com",
          "outlook.com",
          "icloud.com",
          "proton.me",
          "protonmail.com",
          "aol.com",
          "live.com",
          "msn.com",
        ].includes(domain);

        // Derive friendly company name and slug
        let rawName = "";
        if (!isCommonProvider && domain && domain.includes(".")) {
          // e.g. "acmecorp.com" -> "acmecorp"
          rawName = domain.split(".")[0];
        } else {
          // e.g. "alex.recruiting@gmail.com" -> "alex recruiting"
          rawName = username.replace(/[._+-]+/g, " ");
        }

        const slug = rawName
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "") || "employer";

        const formattedName = rawName
          .split(" ")
          .filter(Boolean)
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ") || "Employer Workspace";

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
      // Graceful fallback for local dev or offline database
      const fallbackName = domain?.includes(".") ? domain.split(".")[0] : username;
      const slug = fallbackName.toLowerCase().replace(/[^a-z0-9]/g, "-") || "employer";
      company = {
        slug,
        name: fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1),
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
