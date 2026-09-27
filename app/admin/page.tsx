// app/admin/page.tsx
import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminSession } from "@/lib/auth";
import AdminNav from "@/components/AdminNav";
import prisma from "@/lib/db";
import {
  TrendingUp,
  Briefcase,
  Users,
  MousePointerClick,
  Sparkles,
  DollarSign,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  // Real-time live stats from PostgreSQL
  let totalJobs = 0;
  let directJobs = 0;
  let atsJobs = 0;
  let featuredJobs = 0;
  let pendingReviewCount = 0;
  let totalApplyClicks = 0;
  let estimatedRevenue = 0;
  let totalCompaniesCount = 0;
  let atsSourcesList: any[] = [];

  try {
    const [
      totalLive,
      direct,
      ats,
      featured,
      pending,
      clicks,
      orders,
      companiesCount,
      sources,
    ] = await Promise.all([
      prisma.job.count({ where: { status: "LIVE" } }),
      prisma.job.count({ where: { status: "LIVE", origin: "DIRECT" } }),
      prisma.job.count({ where: { status: "LIVE", origin: "ATS" } }),
      prisma.job.count({ where: { status: "LIVE", isFeatured: true } }),
      prisma.job.count({ where: { status: "PENDING_REVIEW" } }),
      prisma.jobClick.count(),
      prisma.order.findMany({ where: { status: "PAID" }, select: { amountCents: true } }),
      prisma.company.count({ where: { blocklisted: false } }),
      prisma.atsSource.findMany({
        include: { company: true },
        take: 5,
        orderBy: { lastSyncAt: "desc" },
      }),
    ]);

    totalJobs = totalLive;
    directJobs = direct;
    atsJobs = ats;
    featuredJobs = featured;
    pendingReviewCount = pending;
    totalApplyClicks = clicks;
    estimatedRevenue = Math.round(orders.reduce((acc, o) => acc + o.amountCents, 0) / 100);
    totalCompaniesCount = companiesCount;
    atsSourcesList = sources;
  } catch (err) {
    console.error("Failed to query admin stats:", err);
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-16">
      <AdminNav adminEmail={session.email} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Welcome & Overview Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Operations & Revenue Dashboard
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Live metrics across job feeds, candidate engagement, and multi-stream revenue channels.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/review"
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-amber-600 transition-colors"
            >
              <ShieldAlert className="h-4 w-4" />
              Review Queue ({pendingReviewCount} pending)
            </Link>
            <Link
              href="/admin/sources"
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Sync Feeds Now
            </Link>
          </div>
        </div>

        {/* Top KPIs Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Monthly Gross Revenue
              </span>
              <DollarSign className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                ${estimatedRevenue.toLocaleString()}
              </span>
              <span className="text-xs font-medium text-emerald-600 flex items-center">
                <TrendingUp className="h-3.5 w-3.5 mr-0.5" /> Real-time
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              {directJobs} direct listings + {featuredJobs} featured slots
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Live Jobs
              </span>
              <Briefcase className="h-5 w-5 text-blue-600" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {totalJobs}
              </span>
              <span className="text-xs text-slate-500">
                ({directJobs} direct / {atsJobs} ATS)
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              {totalCompaniesCount} company career sources active
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Live Companies
              </span>
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {totalCompaniesCount}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Verified tech & security organizations hiring
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Apply Clicks (Proof)
              </span>
              <MousePointerClick className="h-5 w-5 text-amber-600" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {totalApplyClicks.toLocaleString()}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Logged in JobClick table for employer renewals
            </p>
          </div>
        </div>

        {/* Multi-Stream Revenue Breakdown Table (Section 5) */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 mb-8">
          <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Revenue Ladder Streams (Section 5)
              </h2>
              <p className="text-xs text-slate-500">
                Status of all 5 active monetization streams defined in the revenue plan.
              </p>
            </div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
              Active Phase: Live Operations
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800/50 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-3 font-semibold">Stream</th>
                  <th className="px-6 py-3 font-semibold">Who Pays</th>
                  <th className="px-6 py-3 font-semibold">Default Price</th>
                  <th className="px-6 py-3 font-semibold">Current Status</th>
                  <th className="px-6 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr>
                  <td className="px-6 py-3.5 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    1. Direct Paid Job Listings
                  </td>
                  <td className="px-6 py-3.5 text-slate-600 dark:text-slate-300">Hiring Employers</td>
                  <td className="px-6 py-3.5 font-semibold text-slate-900 dark:text-white">$149 / 30 days</td>
                  <td className="px-6 py-3.5">
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5" /> LIVE
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <Link href="/post-a-job" className="text-blue-600 hover:underline">
                      Post Job Flow
                    </Link>
                  </td>
                </tr>

                <tr>
                  <td className="px-6 py-3.5 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    2. Featured Placement Upgrade
                  </td>
                  <td className="px-6 py-3.5 text-slate-600 dark:text-slate-300">Employers / Claimants</td>
                  <td className="px-6 py-3.5 font-semibold text-slate-900 dark:text-white">$99 / $249 bundle</td>
                  <td className="px-6 py-3.5">
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5" /> LIVE
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <Link href="/admin/companies" className="text-blue-600 hover:underline">
                      Outreach helper
                    </Link>
                  </td>
                </tr>

                <tr>
                  <td className="px-6 py-3.5 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    3. Partner-feed Backfill (Pay Per Click)
                  </td>
                  <td className="px-6 py-3.5 text-slate-600 dark:text-slate-300">Jooble, Adzuna, Appcast</td>
                  <td className="px-6 py-3.5 font-semibold text-slate-900 dark:text-white">~$0.25 / apply click</td>
                  <td className="px-6 py-3.5">
                    <span className="text-slate-500">Live Integration Ready</span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <Link href="/admin/partners" className="text-blue-600 hover:underline">
                      Feed Settings
                    </Link>
                  </td>
                </tr>

                <tr>
                  <td className="px-6 py-3.5 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-600" />
                    4. Candidate Affiliate Offers
                  </td>
                  <td className="px-6 py-3.5 text-slate-600 dark:text-slate-300">Courses, Certifications</td>
                  <td className="px-6 py-3.5 font-semibold text-slate-900 dark:text-white">10-30% commission</td>
                  <td className="px-6 py-3.5">
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Configured
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <Link href="/admin/affiliates" className="text-blue-600 hover:underline">
                      Manage Offers
                    </Link>
                  </td>
                </tr>

                <tr>
                  <td className="px-6 py-3.5 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-600" />
                    5. Newsletter Sponsor Slot
                  </td>
                  <td className="px-6 py-3.5 text-slate-600 dark:text-slate-300">Tool vendors, Bootcamps</td>
                  <td className="px-6 py-3.5 font-semibold text-slate-900 dark:text-white">$250 / issue</td>
                  <td className="px-6 py-3.5">
                    <span className="text-slate-500">Inquiry Form Active</span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <Link href="/advertise" className="text-blue-600 hover:underline">
                      View Page
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ATS Sources Quick Sync Check (Section 11) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
              ATS Feed Sources (Section 11)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Autonomous nighttime fetchers keeping board populated with zero manual job posting.
            </p>

            <div className="space-y-3">
              {atsSourcesList.length === 0 ? (
                <div className="p-4 rounded-lg border border-dashed border-slate-200 text-center text-xs text-slate-500">
                  No ATS sources registered yet. Add Greenhouse, Lever, or Ashby tokens in Sources.
                </div>
              ) : (
                atsSourcesList.map((src) => (
                  <div
                    key={src.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50 text-xs"
                  >
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {src.company?.name || "Company"}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {src.provider} • token: {src.boardToken}
                      </p>
                    </div>
                    <span
                      className={`rounded px-2 py-0.5 text-[11px] font-semibold ${
                        src.active
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {src.active ? "Active" : "Paused"}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4">
              <Link
                href="/admin/sources"
                className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                Manage all ATS sources
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
              Next Operator Steps
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              15-minute daily routine specified in Section 16 of the job plan.
            </p>

            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                  1
                </span>
                <span>Check pending paid submissions in <strong>Review Queue</strong> and approve valid listings.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                  2
                </span>
                <span>Review ATS sync logs to ensure zero missing employer feeds.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                  3
                </span>
                <span>Use <strong>Company Outreach Helper</strong> to email hiring managers whose imported jobs already received 50+ views.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                  4
                </span>
                <span>Review takedown requests (must resolve within 48h as per policy).</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
