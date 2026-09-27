// app/admin/orders/page.tsx
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import AdminNav from "@/components/AdminNav";
import prisma from "@/lib/db";
import { CreditCard } from "lucide-react";

export default async function AdminOrdersPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  let orders: any[] = [];
  try {
    orders = await prisma.order.findMany({
      include: { job: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.error("Failed to query orders:", err);
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-16">
      <AdminNav adminEmail={session.email} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard className="h-6 w-6 text-blue-600" />
              Orders & Transaction Ledger
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Flow H: Webhook-verified employer transactions, provider processor fees, and net payouts.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
          {orders.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500">
              No orders recorded yet. When employers post or feature listings, verified payments will appear here in real time.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800/50 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-3.5 font-semibold">Order ID</th>
                    <th className="px-6 py-3.5 font-semibold">Job Listing</th>
                    <th className="px-6 py-3.5 font-semibold">Payer Email</th>
                    <th className="px-6 py-3.5 font-semibold">Plan</th>
                    <th className="px-6 py-3.5 font-semibold">Provider</th>
                    <th className="px-6 py-3.5 font-semibold">Gross</th>
                    <th className="px-6 py-3.5 font-semibold">Status</th>
                    <th className="px-6 py-3.5 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white">{o.id}</td>
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{o.job?.title || "Direct Listing"}</td>
                      <td className="px-6 py-4 text-slate-500">{o.payerEmail}</td>
                      <td className="px-6 py-4">
                        <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[10px] text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {o.plan}
                        </span>
                      </td>
                      <td className="px-6 py-4 capitalize text-slate-600 dark:text-slate-400">{o.provider}</td>
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                        ${(o.amountCents / 100).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded px-2 py-0.5 font-semibold ${
                            o.status === "PAID"
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {new Date(o.createdAt).toLocaleDateString()}
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
