// app/robots.txt/route.ts
import { NextResponse } from "next/server";
import { SITE } from "@/config/site";

export async function GET() {
  const content = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /manage
Disallow: /api/

Sitemap: ${SITE.url}/sitemap.xml
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
