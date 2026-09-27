// app/admin/takedowns/page.tsx
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import AdminNav from "@/components/AdminNav";
import prisma from "@/lib/db";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

export default async function AdminTakedownsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  let takedowns: any[] = [];
  try {
    takedowns = await prisma.takedown.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.error("Failed to query takedowns:", err);
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-16">
      <AdminNav adminEmail={session.email} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
            Takedown & Removal Requests
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Honor company requests to remove public ATS feeds within 48h. Sets job status to REMOVED and blocklists feed source.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
          {takedowns.length === 0 ? (
            <div className="p-12 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500 mb-3" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Zero Pending Takedown Requests
              </h2>
              <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
                All removal requests have been reviewed and resolved. New submissions via /takedown will appear here in real time.
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800/50 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-3.5 font-semibold">Job URL</th>
                  <th className="px-6 py-3.5 font-semibold">Requester Email</th>
                  <th className="px-6 py-3.5 font-semibold">Reason</th>
                  <th className="px-6 py-3.5 font-semibold">Status</th>
                  <th className="px-6 py-3.5 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {takedowns.map((t) => (
                  <tr key={t.id}>
                    <td className="px-6 py-4 font-mono text-slate-900 dark:text-white truncate max-w-xs">{t.url}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{t.requesterEmail}</td>
                    <td className="px-6 py-4 text-slate-500 truncate max-w-xs">{t.reason}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded px-2 py-0.5 font-semibold ${
                          t.status === "OPEN"
                            ? "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{new Date(t.createdAt).toLocaleDateString()}</td>
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
