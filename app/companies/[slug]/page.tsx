// app/companies/[slug]/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getCompanyBySlug } from "@/lib/data";
import JobCard from "@/components/JobCard";
import { SITE } from "@/config/site";
import { Building2, ExternalLink, ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";

interface CompanyPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CompanyDetailPage({ params }: CompanyPageProps) {
  const { slug } = await params;
  const company = await getCompanyBySlug(slug);

  if (!company) {
    notFound();
  }

  const jobs = company.jobs || [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all jobs
        </Link>
      </div>

      {/* Company Header Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 mb-8">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-800">
              {company.logoUrl ? (
                <Image
                  src={company.logoUrl}
                  alt={company.name}
                  width={64}
                  height={64}
                  unoptimized
                  className="h-full w-full object-cover"
                />
              ) : (
                <Building2 className="h-8 w-8 text-slate-400" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  {company.name}
                </h1>
                <span className="rounded-full bg-blue-50 p-1 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
                  <ShieldCheck className="h-4 w-4" />
                </span>
              </div>

              <p className="text-xs text-slate-500 max-w-xl">
                {company.description || "Active verified employer."}
              </p>

              <div className="mt-3 flex items-center gap-4 text-xs font-medium">
                <a
                  href={company.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:underline dark:text-blue-400"
                >
                  Visit official website
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500">{jobs.length} open remote positions</span>
              </div>
            </div>
          </div>

          {/* Employer Claim Callout (Flow E) */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs dark:border-slate-800 dark:bg-slate-800/50 sm:max-w-xs">
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              Do you hire for {company.name}?
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              Verify your company work email to upgrade listings, access analytics, and post directly.
            </p>
            <Link
              href={`/claim/${company.slug}`}
              className="mt-3 inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
            >
              <Sparkles className="h-3 w-3" />
              Claim Company Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Active Jobs List */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
          Open Positions at {company.name} ({jobs.length})
        </h2>

        {jobs.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900">
            No active jobs listed at this time. Check back soon!
          </div>
        ) : (
          <div className="space-y-2.5">
            {jobs.map((job: any) => (
              <JobCard
                key={job.id}
                job={{
                  ...job,
                  company: {
                    name: company.name,
                    slug: company.slug,
                    logoUrl: company.logoUrl,
                  },
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
