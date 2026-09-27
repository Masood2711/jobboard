// app/admin/sources/page.tsx
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import AdminNav from "@/components/AdminNav";
import AdminSourcesClient from "@/components/AdminSourcesClient";
import prisma from "@/lib/db";

export default async function AdminSourcesPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  let sources: any[] = [];
  try {
    const dbSources = await prisma.atsSource.findMany({
      include: { company: true },
      orderBy: { lastSyncAt: "desc" },
    });

    sources = dbSources.map((s) => ({
      id: s.id,
      provider: s.provider,
      boardToken: s.boardToken,
      active: s.active,
      lastSyncAt: s.lastSyncAt?.toISOString() || null,
      companyName: s.company?.name || "Unlinked Company",
    }));
  } catch (err) {
    console.error("Failed to query ATS sources:", err);
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-16">
      <AdminNav adminEmail={session.email} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <AdminSourcesClient initialSources={sources} />
      </div>
    </div>
  );
}
