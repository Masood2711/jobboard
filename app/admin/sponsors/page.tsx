// app/admin/sponsors/page.tsx
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import AdminNav from "@/components/AdminNav";
import prisma from "@/lib/db";
import { Megaphone } from "lucide-react";

export default async function AdminSponsorsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  let bookings: any[] = [];
  try {
    bookings = await prisma.sponsorBooking.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.error("Failed to query sponsor bookings:", err);
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-16">
      <AdminNav adminEmail={session.email} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Megaphone className="h-6 w-6 text-indigo-600" />
            Newsletter Sponsor Bookings (Flow K)
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Stream 5: Manage incoming advertiser inquiries ($250 per slot) and assign bookings to newsletter issues.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
          {bookings.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500">
              No sponsor inquiries yet. Submissions through the /advertise form will appear here in real time.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800/50 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-3.5 font-semibold">Sponsor Company</th>
                  <th className="px-6 py-3.5 font-semibold">Contact Email</th>
                  <th className="px-6 py-3.5 font-semibold">Slot Price</th>
                  <th className="px-6 py-3.5 font-semibold">Headline</th>
                  <th className="px-6 py-3.5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{b.company}</td>
                    <td className="px-6 py-4 text-slate-500">{b.email}</td>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                      ${(b.priceCents / 100).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300 truncate max-w-xs">{b.headline}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded px-2 py-0.5 font-semibold ${
                          b.status === "PAID"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                        }`}
                      >
                        {b.status}
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
