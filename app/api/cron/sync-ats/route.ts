// app/api/cron/sync-ats/route.ts
import { NextResponse } from "next/server";
import { syncAllAtsSources } from "@/lib/ats/sync";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const secretHeader = request.headers.get("authorization")?.replace("Bearer ", "");
  const secretQuery = url.searchParams.get("secret");

  const expectedSecret = process.env.CRON_SECRET || "dev-cron-secret-secure-token-123";

  // Verify cron secret authorization
  if (secretHeader !== expectedSecret && secretQuery !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized cron execution" }, { status: 401 });
  }

  const results = await syncAllAtsSources();

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    results,
  });
}
