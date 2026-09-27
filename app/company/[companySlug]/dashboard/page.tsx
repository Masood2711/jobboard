// app/company/[companySlug]/dashboard/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/db";
import { SITE } from "@/config/site";
import {
  Building2,
  Briefcase,
  Eye,
  MousePointerClick,
  PlusCircle,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  Clock,
  ArrowRight,
} from "lucide-react";

interface CompanyDashboardProps {
  params: Promise<{
    companySlug: string;
  }>;
}

export default async function CompanyDashboardPage({ params }: CompanyDashboardProps) {
  const { companySlug } = await params;

  let company: any = null;
  let jobs: any[] = [];
  let totalClicks = 0;

  try {
    company = await prisma.company.findUnique({
      where: { slug: companySlug },
      include: {
        claims: true,
      },
    });

    if (company) {
      jobs = await prisma.job.findMany({
        where: { companyId: company.id },
        orderBy: { createdAt: "desc" },
      });

      // Query total apply clicks for these jobs
      const jobIds = jobs.map((j) => j.id);
      if (jobIds.length > 0) {
        totalClicks = await prisma.jobClick.count({
          where: { jobId: { in: jobIds } },
        });
      }
    }
  } catch (err) {
    console.error("Failed to fetch company dashboard data:", err);
  }

  // Fallback demo state if database not initialized
  if (!company) {
    company = {
      name: companySlug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      slug: companySlug,
      websiteUrl: `https://${companySlug}.com`,
      domain: `${companySlug}.com`,
      logoUrl: null,
      description: "Verified Employer on " + SITE.name,
    };
  }

  const liveJobs = jobs.filter((j) => j.status === "LIVE");
  const pendingJobs = jobs.filter((j) => j.status === "PENDING_REVIEW" || j.status === "PENDING_PAYMENT");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-16">
      {/* Header Bar */}
      <div className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-800">
                {company.logoUrl ? (
                  <Image
                    src={company.logoUrl}
                    alt={company.name}
                    width={56}
                    height={56}
                    unoptimized
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Building2 className="h-7 w-7 text-slate-400" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    {company.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/50">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    Verified Employer Portal
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                  <a
                    href={company.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 flex items-center gap-1"
                  >
                    {company.domain}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <span>•</span>
                  <span>{jobs.length} Total Postings</span>
                </div>
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="flex items-center gap-2">
              <Link
                href={`/post-a-job`}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-all"
              >
                <PlusCircle className="h-4 w-4" />
                Post New Role
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Top Status & Plan Overview Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Active Plan Card */}
          <div className="rounded-2xl border border-blue-200/80 bg-gradient-to-br from-blue-50 to-white p-5 shadow-sm dark:border-blue-900/60 dark:from-slate-900 dark:to-slate-900/50">
            <div className="flex items-center justify-between text-xs font-semibold text-blue-700 dark:text-blue-300 mb-2">
              <span>Subscription Status</span>
              <Sparkles className="h-4 w-4 text-amber-500" />
            </div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">
              Monthly Active
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Unlimited postings enabled via Lemon Squeezy.
            </p>
          </div>

          {/* Live Postings */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
              <span>Live Postings</span>
              <Briefcase className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {liveJobs.length}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {pendingJobs.length > 0 ? `${pendingJobs.length} in moderation review` : "Active in candidate search"}
            </p>
          </div>

          {/* Candidate Apply Clicks */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
              <span>Candidate Clicks</span>
              <MousePointerClick className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {totalClicks}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Direct application click-throughs
            </p>
          </div>

          {/* Invoices & Billing */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
                <span>Receipts & Invoices</span>
                <CreditCard className="h-4 w-4 text-purple-600" />
              </div>
              <div className="text-sm font-semibold text-slate-900 dark:text-white">
                Lemon Squeezy Billing
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                Itemized PDF tax invoices & receipts
              </p>
            </div>
            <a
              href="https://app.lemonsqueezy.com/my-orders"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
            >
              Customer Billing Portal <ArrowRight className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* All Job Postings List */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
          <div className="border-b border-slate-100 p-5 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Your Job Postings ({jobs.length})
              </h2>
              <p className="text-xs text-slate-500">
                Manage, edit, or upgrade individual roles posted under {company.name}.
              </p>
            </div>
          </div>

          {jobs.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500">
              <p className="text-slate-600 dark:text-slate-300 font-medium mb-2">No postings found yet</p>
              <p className="mb-4">Click below to publish your first role on {SITE.name}.</p>
              <Link
                href="/post-a-job"
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
              >
                <PlusCircle className="h-4 w-4" />
                Post Your First Role
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800/50 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-3.5 font-semibold">Job Title</th>
                    <th className="px-6 py-3.5 font-semibold">Workplace</th>
                    <th className="px-6 py-3.5 font-semibold">Status</th>
                    <th className="px-6 py-3.5 font-semibold">Featured</th>
                    <th className="px-6 py-3.5 font-semibold">Posted Date</th>
                    <th className="px-6 py-3.5 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="px-6 py-4">
                        <Link
                          href={`/jobs/${job.slug}`}
                          className="font-bold text-slate-900 hover:text-blue-600 dark:text-white block truncate max-w-xs"
                        >
                          {job.title}
                        </Link>
                        <span className="text-[11px] text-slate-400">{job.category}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        <span className="capitalize">{job.locationType.toLowerCase()}</span> (
                        {job.eligibleRegions[0] || "Worldwide"})
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded px-2 py-0.5 font-semibold text-[11px] ${
                            job.status === "LIVE"
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                              : job.status === "PENDING_REVIEW"
                              ? "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {job.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {job.isFeatured ? (
                          <span className="inline-flex items-center gap-1 font-bold text-amber-600 text-[11px]">
                            <Sparkles className="h-3 w-3 fill-amber-500" /> Pinned
                          </span>
                        ) : (
                          <span className="text-slate-400">Standard</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          {job.editToken ? (
                            <Link
                              href={`/manage/${job.editToken}`}
                              className="text-blue-600 hover:underline font-semibold"
                            >
                              Manage & Stats
                            </Link>
                          ) : (
                            <Link
                              href={`/jobs/${job.slug}`}
                              className="text-slate-500 hover:text-blue-600"
                            >
                              View
                            </Link>
                          )}
                        </div>
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
