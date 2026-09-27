// app/api/cron/sync-feeds/route.ts
import { NextRequest, NextResponse } from "next/server";
import { syncAllPartnerFeeds } from "@/lib/feeds/partnerSync";

export async function GET(request: NextRequest) {
  return handleSyncFeeds(request);
}

export async function POST(request: NextRequest) {
  return handleSyncFeeds(request);
}

async function handleSyncFeeds(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET || "dev-cron-secret-secure-token-123";

  if (authHeader !== `Bearer ${cronSecret}` && request.nextUrl.searchParams.get("secret") !== cronSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = await syncAllPartnerFeeds();

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    results,
  });
}
