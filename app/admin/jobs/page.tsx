// app/admin/jobs/page.tsx
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import AdminNav from "@/components/AdminNav";
import prisma from "@/lib/db";
import { Briefcase, Sparkles, ExternalLink } from "lucide-react";
import Link from "next/link";

export default async function AdminJobsPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  let jobs: any[] = [];
  try {
    jobs = await prisma.job.findMany({
      include: { company: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.error("Failed to query admin jobs:", err);
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-16">
      <AdminNav adminEmail={session.email} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-blue-600" />
            All Jobs ({jobs.length})
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Search, filter, feature, unfeature, or modify status across all imported and directly posted positions.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
          {jobs.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500">
              No jobs in database yet. Live jobs will appear here as they are synced from ATS feeds or posted by employers.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800/50 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-3.5 font-semibold">Title & Role</th>
                    <th className="px-6 py-3.5 font-semibold">Company</th>
                    <th className="px-6 py-3.5 font-semibold">Origin</th>
                    <th className="px-6 py-3.5 font-semibold">Category</th>
                    <th className="px-6 py-3.5 font-semibold">Status</th>
                    <th className="px-6 py-3.5 font-semibold">Featured</th>
                    <th className="px-6 py-3.5 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {jobs.map((job) => (
                    <tr key={job.id}>
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                        <Link href={`/jobs/${job.slug}`} className="hover:text-blue-600 truncate block max-w-xs">
                          {job.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        {job.company?.name || "Unknown Company"}
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {job.origin}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {job.category}
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                          {job.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {job.isFeatured ? (
                          <span className="inline-flex items-center gap-1 text-amber-600 font-bold">
                            <Sparkles className="h-3 w-3" /> Yes
                          </span>
                        ) : (
                          <span className="text-slate-400">No</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/jobs/${job.slug}`} className="text-blue-600 hover:underline">
                          View
                        </Link>
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
