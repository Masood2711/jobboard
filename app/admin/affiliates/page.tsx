// app/admin/affiliates/page.tsx
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import AdminNav from "@/components/AdminNav";
import prisma from "@/lib/db";
import { Percent } from "lucide-react";

export default async function AdminAffiliatesPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  let offers: any[] = [];
  try {
    offers = await prisma.affiliateOffer.findMany({
      include: {
        _count: {
          select: { clicks: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.error("Failed to query affiliate offers:", err);
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-16">
      <AdminNav adminEmail={session.email} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Percent className="h-6 w-6 text-emerald-600" />
              Affiliate Programs & Offers (Flow L)
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Stream 2: Candidate tools, certifications, and resume review partnerships with rel=&quot;sponsored nofollow&quot;.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
          {offers.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500">
              No affiliate offers configured yet. Add relevant certification vouchers, resume review, or course affiliate links to display on job pages.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800/50 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-3.5 font-semibold">Offer Name</th>
                  <th className="px-6 py-3.5 font-semibold">Category</th>
                  <th className="px-6 py-3.5 font-semibold">Headline</th>
                  <th className="px-6 py-3.5 font-semibold">Clicks Tracked</th>
                  <th className="px-6 py-3.5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {offers.map((offer) => (
                  <tr key={offer.id}>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{offer.name}</td>
                    <td className="px-6 py-4">
                      <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[11px] text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {offer.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300 truncate max-w-xs">{offer.headline}</td>
                    <td className="px-6 py-4 text-blue-600 font-semibold">{offer._count.clicks}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded px-2 py-0.5 font-semibold ${
                          offer.active
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {offer.active ? "Active" : "Paused"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
