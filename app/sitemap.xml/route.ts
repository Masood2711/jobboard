// app/sitemap.xml/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { SITE } from "@/config/site";

export async function GET() {
  const baseUrl = SITE.url;

  const staticUrls = [
    "",
    "/companies",
    "/post-a-job",
    "/subscribe",
    "/about",
    "/terms",
    "/privacy",
    "/takedown",
  ];

  const categoryUrls = (await import("@/config/niche")).NICHE.categories.map(
    (c) => `/jobs/category/${c.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
  );

  const regionUrls = (await import("@/config/niche")).NICHE.regions.map(
    (r) => `/jobs/in/${r.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
  );

  let jobUrls: string[] = [];
  let companyUrls: string[] = [];

  try {
    const [liveJobs, companies] = await Promise.all([
      prisma.job.findMany({
        where: { status: "LIVE" },
        select: { slug: true },
      }),
      prisma.company.findMany({
        where: { blocklisted: false },
        select: { slug: true },
      }),
    ]);

    jobUrls = liveJobs.map((j) => `/jobs/${j.slug}`);
    companyUrls = companies.map((c) => `/companies/${c.slug}`);
  } catch (err) {
    console.error("Failed to query sitemap dynamic URLs:", err);
  }

  const allUrls = [...staticUrls, ...categoryUrls, ...regionUrls, ...jobUrls, ...companyUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (url) => `  <url>
    <loc>${baseUrl}${url}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>daily</changefreq>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
