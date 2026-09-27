// app/page.tsx
import { Suspense } from "react";
import Link from "next/link";
import FilterBar from "@/components/FilterBar";
import JobCard from "@/components/JobCard";
import { getJobs } from "@/lib/data";
import { NICHE } from "@/config/niche";
import { SITE } from "@/config/site";
import { ShieldCheck, Sparkles, Mail, Briefcase, Building, ChevronLeft, ChevronRight } from "lucide-react";

interface HomePageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    region?: string;
    type?: string;
    seniority?: string;
    salary?: string;
    page?: string;
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || "1", 10);

  const { jobs, total, totalPages } = await getJobs({
    q: resolvedParams.q,
    category: resolvedParams.category,
    region: resolvedParams.region,
    type: resolvedParams.type,
    seniority: resolvedParams.seniority,
    hasSalary: resolvedParams.salary === "true",
    page,
    limit: 20,
  });

  const featuredCount = jobs.filter((j) => j.isFeatured).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Hero Section */}
      <section className="mb-8 rounded-2xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-50/60 p-6 sm:p-10 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:to-slate-900/60">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/80 px-3.5 py-1 text-xs font-semibold text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            100% Genuine Jobs — Direct from Verified Companies (Zero Fake Roles)
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-white">
            {NICHE.headline}
          </h1>

          <p className="mt-3 text-base text-slate-600 sm:text-lg dark:text-slate-300">
            {NICHE.subheadline} No agency spam. Transparent compensation.
          </p>

          {/* Quick value badges */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <Briefcase className="h-4 w-4 text-blue-600" />
              {total} Active Opportunities
            </span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="flex items-center gap-1.5">
              <Building className="h-4 w-4 text-blue-600" />
              Direct ATS & Employer Feeds
            </span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
              <Sparkles className="h-4 w-4" />
              {featuredCount} Pinned Roles
            </span>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="mb-6">
        <Suspense fallback={<div className="h-12 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />}>
          <FilterBar />
        </Suspense>
      </section>

      {/* Main Job Listing Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1 pb-1">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {resolvedParams.q || resolvedParams.category || resolvedParams.region
              ? `Search Results (${total} roles)`
              : `All Verified Jobs (${total})`}
          </h2>
          <span className="text-xs text-slate-500">
            Page {page} of {Math.max(totalPages, 1)}
          </span>
        </div>

        {jobs.length === 0 ? (
          /* Empty state */
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900/50">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
              <Briefcase className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
              No positions match your filters
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Try adjusting your search terms or clearing your filters to see more active openings.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link
                href="/"
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                Clear all filters
              </Link>
              <Link
                href="/companies"
                className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
              >
                Browse Companies
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800">
            {page > 1 ? (
              <Link
                href={`/?${new URLSearchParams({ ...resolvedParams, page: String(page - 1) })}`}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous Page
              </Link>
            ) : (
              <div />
            )}

            <div className="text-xs text-slate-500">
              Showing {(page - 1) * 20 + 1} - {Math.min(page * 20, total)} of {total} jobs
            </div>

            {page < totalPages ? (
              <Link
                href={`/?${new URLSearchParams({ ...resolvedParams, page: String(page + 1) })}`}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                Next Page
                <ChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <div />
            )}
          </div>
        )}
      </section>

      {/* Employer Hiring CTA Banner */}
      <section className="mt-14 rounded-2xl border border-blue-200/80 bg-gradient-to-r from-blue-50/80 to-indigo-50/40 p-6 sm:p-8 dark:border-blue-900/60 dark:from-slate-900 dark:to-slate-900/50">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <Briefcase className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Hiring qualified tech or remote talent?
              </h3>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                Reach thousands of verified software engineers, product managers, designers, and tech professionals.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              href="/post-a-job"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-5 py-3 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all"
            >
              Post a Job ($149)
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
