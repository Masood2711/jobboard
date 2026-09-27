// app/admin/partners/page.tsx
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import AdminNav from "@/components/AdminNav";
import prisma from "@/lib/db";
import { Handshake } from "lucide-react";

export default async function AdminPartnersPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  let partners: any[] = [];
  try {
    partners = await prisma.feedPartner.findMany({
      include: {
        _count: {
          select: { jobs: true },
        },
      },
    });
  } catch (err) {
    console.error("Failed to query feed partners:", err);
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-16">
      <AdminNav adminEmail={session.email} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Handshake className="h-6 w-6 text-purple-600" />
              Feed Partners (Pay-per-click backfill)
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Stream 1 Bridge Income: Partner network XML/JSON feeds and click payout comparisons.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
          {partners.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500">
              No partner networks active yet. When you partner with backfill networks (e.g. Jooble, Adzuna), configure them here to track live clicks and earnings.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800/50 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-3.5 font-semibold">Partner Name</th>
                    <th className="px-6 py-3.5 font-semibold">Feed URL</th>
                    <th className="px-6 py-3.5 font-semibold">Est CPC</th>
                    <th className="px-6 py-3.5 font-semibold">Active Jobs</th>
                    <th className="px-6 py-3.5 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {partners.map((p) => (
                    <tr key={p.id}>
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{p.name}</td>
                      <td className="px-6 py-4 font-mono text-slate-500 truncate max-w-xs">{p.feedUrl}</td>
                      <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                        {p.estCpcCents ? `$${(p.estCpcCents / 100).toFixed(2)}` : "—"}
                      </td>
                      <td className="px-6 py-4 text-purple-600 font-semibold">{p._count.jobs}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded px-2 py-0.5 font-semibold ${
                            p.active
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {p.active ? "Active" : "Paused"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
