// app/jobs/[slug]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getJobBySlug, getSimilarJobs } from "@/lib/data";
import JobCard from "@/components/JobCard";
import { SITE } from "@/config/site";
import {
  ArrowLeft,
  Building2,
  MapPin,
  DollarSign,
  Clock,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Mail,
  Share2,
} from "lucide-react";

interface JobDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: JobDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) {
    return { title: "Job Not Found" };
  }

  const locLabel = job.locationType === "ONSITE" ? "On-site" : job.locationType === "HYBRID" ? "Hybrid" : "Remote";
  return {
    title: `${job.title} at ${job.company.name} (${locLabel}) | ${SITE.name}`,
    description: `Apply for ${job.title} at ${job.company.name}. Verified job opening with direct application link.`,
    openGraph: {
      title: `${job.title} at ${job.company.name}`,
      description: `${locLabel} ${job.category} position. Transparent compensation and direct employer application.`,
      type: "article",
    },
  };
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) {
    notFound();
  }

  const similarJobs = await getSimilarJobs(job.id, job.category, 4);

  // Generate Google Jobs structured data (Section 12.1)
  const jsonLd: any = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.descriptionHtml,
    datePosted: job.publishedAt ? new Date(job.publishedAt).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    validThrough: job.expiresAt ? new Date(job.expiresAt).toISOString() : undefined,
    employmentType: job.employmentType,
    hiringOrganization: {
      "@type": "Organization",
      name: job.company.name,
      sameAs: job.company.websiteUrl,
      logo: job.company.logoUrl || undefined,
    },
    jobLocationType: "TELECOMMUTE",
    applicantLocationRequirements: job.eligibleRegions.map((region) => ({
      "@type": "Country",
      name: region,
    })),
    identifier: {
      "@type": "PropertyValue",
      name: SITE.name,
      value: job.id,
    },
    directApply: false,
  };

  if (job.salaryMin && job.salaryMax) {
    jsonLd.baseSalary = {
      "@type": "MonetaryAmount",
      currency: job.salaryCurrency || "USD",
      value: {
        "@type": "QuantitativeValue",
        minValue: job.salaryMin,
        maxValue: job.salaryMax,
        unitText: job.salaryPeriod || "YEAR",
      },
    };
  }

  const isExpired = job.status === "EXPIRED";

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* JSON-LD Script for Google Jobs structured data */}
      {job.status === "LIVE" && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      {/* Back to listings */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all jobs
        </Link>
      </div>

      {/* Expired banner if applicable */}
      {isExpired && (
        <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
          <strong>This role has expired.</strong> The employer is no longer accepting applications through this link. Browse below for open opportunities in {job.category}.
        </div>
      )}

      {/* Hero header card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 mb-8">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-800">
              {job.company.logoUrl ? (
                <Image
                  src={job.company.logoUrl}
                  alt={job.company.name}
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
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {job.isFeatured && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900 dark:bg-amber-900/60 dark:text-amber-200">
                    <Sparkles className="h-3.5 w-3.5 text-amber-600 fill-amber-600 dark:text-amber-300" />
                    Featured Role
                  </span>
                )}
                {job.origin === "DIRECT" && (
                  <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                    Direct Employer Listing
                  </span>
                )}
                {job.origin === "ATS" && (
                  <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
                    Direct from Company Career Page
                  </span>
                )}
                {job.origin === "FEED" && (
                  <span className="rounded-md bg-purple-50 px-2 py-0.5 text-xs font-semibold text-purple-800 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/60">
                    Sponsored Partner Job
                  </span>
                )}
                <span className="text-xs font-medium text-slate-500">
                  {job.category}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {job.title}
              </h1>

              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                <Link
                  href={`/companies/${job.company.slug}`}
                  className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
                >
                  {job.company.name}
                </Link>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  {job.locationType === "ONSITE" ? "On-site" : job.locationType === "HYBRID" ? "Hybrid" : "Remote"} ({job.eligibleRegions.join(", ")})
                </span>
                <span>•</span>
                <span className="capitalize">{job.employmentType.toLowerCase().replace("_", "-")}</span>
              </div>
            </div>
          </div>

          {/* Primary Apply Button */}
          <div className="flex w-full sm:w-auto shrink-0 flex-col gap-2">
            <a
              href={`/api/click/${job.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all text-center"
            >
              Apply on Company Site
              <ExternalLink className="h-4 w-4" />
            </a>
            <p className="text-center text-[11px] text-slate-400">
              No account required • Opens company application
            </p>
          </div>
        </div>

        {/* Highlights Bar */}
        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-6 sm:grid-cols-4 dark:border-slate-800">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Salary / Comp
            </span>
            <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
              {job.salaryMin && job.salaryMax
                ? `$${(job.salaryMin / 1000).toFixed(0)}k - $${(job.salaryMax / 1000).toFixed(0)}k / year`
                : "Not disclosed"}
            </p>
          </div>

          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Seniority
            </span>
            <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
              {job.seniority || "All levels"}
            </p>
          </div>

          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Location Type
            </span>
            <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
              100% Telecommute
            </p>
          </div>

          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Posted Date
            </span>
            <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
              {new Date(job.publishedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Description + Sidebar */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left column: Rich Description */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Job Description
            </h2>

            <div
              className="prose prose-slate max-w-none text-sm leading-relaxed dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: job.descriptionHtml }}
            />

            {/* Bottom Apply Action */}
            <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Interested in this opportunity?
                </p>
                <p className="text-xs text-slate-500">
                  Applications are submitted directly to {job.company.name}.
                </p>
              </div>

              <a
                href={`/api/click/${job.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-blue-600 px-6 py-3 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors w-full sm:w-auto text-center"
              >
                Apply for this Role
              </a>
            </div>
          </div>

          {/* Similar Jobs Section */}
          {similarJobs.length > 0 && (
            <div className="space-y-3 pt-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Similar {job.category} Roles
              </h3>
              <div className="space-y-2">
                {similarJobs.map((sim) => (
                  <JobCard key={sim.id} job={sim} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column: Company info + Affiliate Offer + Alert Signup */}
        <div className="space-y-6">
          {/* Company Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
              About {job.company.name}
            </h3>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              {job.company.description || "Leading innovator in autonomous security solutions."}
            </p>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <a
                href={job.company.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
              >
                Visit company website
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Candidate Affiliate Offer (Flow L & Monetization) */}
          <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-5 dark:border-blue-900 dark:bg-blue-950/30 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 block mb-1">
              Sponsored Resource
            </span>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              Applying for this role?
            </h4>
            <p className="mt-1.5 text-slate-600 dark:text-slate-300 leading-relaxed">
              Scan your CV against ATS filters with AI and get instant feedback to score 3x more recruiter callbacks.
            </p>
            <a
              href="/api/click/affiliate?offerId=aff_1&placement=JOB_PAGE"
              target="_blank"
              rel="sponsored nofollow"
              className="mt-3 inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
            >
              Optimize Resume For Free
              <ExternalLink className="h-3 w-3" />
            </a>
            <p className="mt-2 text-[10px] text-slate-400">
              *We may earn a commission if you purchase through this partner link.
            </p>
          </div>

          {/* Quick email alert box */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="h-4 w-4 text-blue-600" />
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Get jobs like this by email
              </h4>
            </div>
            <p className="text-[11px] text-slate-500 mb-3">
              Never miss a {job.category} opening. Unsubscribe anytime in one click.
            </p>
            <form action="/subscribe" method="GET" className="space-y-2">
              <input
                type="hidden"
                name="category"
                value={job.category}
              />
              <input
                type="email"
                name="email"
                required
                placeholder="your.email@work.com"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
              <button
                type="submit"
                className="w-full rounded-lg bg-slate-900 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                Send Me Similar Roles
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
