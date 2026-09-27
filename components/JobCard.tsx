// components/JobCard.tsx
import Link from "next/link";
import Image from "next/image";
import { Sparkles, Building2, MapPin, DollarSign, Clock, ArrowUpRight } from "lucide-react";

export interface JobCardProps {
  job: {
    id: string;
    title: string;
    slug: string;
    origin?: string;
    category: string;
    seniority?: string | null;
    employmentType: string;
    locationType: string;
    eligibleRegions: string[];
    salaryMin?: number | null;
    salaryMax?: number | null;
    salaryCurrency?: string | null;
    salaryPeriod?: string | null;
    isFeatured: boolean;
    publishedAt: string;
    applyUrl?: string | null;
    company: {
      name: string;
      slug: string;
      logoUrl?: string | null;
    };
  };
}

function formatSalary(min?: number | null, max?: number | null, currency = "USD", period = "YEAR") {
  if (!min && !max) return null;
  const symbol = currency === "USD" ? "$" : `${currency} `;
  const periodStr = period ? `/${period.toLowerCase()}` : "/yr";

  if (min && max) {
    if (min >= 1000) {
      return `${symbol}${Math.round(min / 1000)}k - ${symbol}${Math.round(max / 1000)}k${periodStr}`;
    }
    return `${symbol}${min} - ${symbol}${max}${periodStr}`;
  }
  const val = min || max;
  if (!val) return null;
  return `${symbol}${val >= 1000 ? `${Math.round(val / 1000)}k` : val}${periodStr}`;
}

function timeAgo(dateStr: string) {
  const diffDays = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "1d ago";
  if (diffDays < 30) return `${diffDays}d ago`;
  return `${Math.floor(diffDays / 30)}mo ago`;
}

export default function JobCard({ job }: JobCardProps) {
  const salaryText = formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency || "USD", job.salaryPeriod || "YEAR");
  const isDirect = job.origin === "DIRECT";
  const regionsSummary = job.eligibleRegions.slice(0, 2).join(", ");
  const moreRegionsCount = job.eligibleRegions.length > 2 ? `+${job.eligibleRegions.length - 2}` : "";

  return (
    <div
      className={`group relative rounded-xl border p-4 sm:p-5 transition-all duration-150 ${
        job.isFeatured
          ? "border-amber-300 bg-amber-50/60 dark:border-amber-700/60 dark:bg-amber-950/20 shadow-sm"
          : "border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Company Avatar / Logo */}
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-800">
          {job.company.logoUrl ? (
            <Image
              src={job.company.logoUrl}
              alt={`${job.company.name} logo`}
              width={48}
              height={48}
              unoptimized
              className="h-full w-full object-cover"
            />
          ) : (
            <Building2 className="h-6 w-6 text-slate-400" />
          )}
        </div>

        {/* Content details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            {job.isFeatured && (
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-900 dark:bg-amber-900/60 dark:text-amber-200">
                <Sparkles className="h-3 w-3 text-amber-600 fill-amber-600 dark:text-amber-300" />
                Featured
              </span>
            )}
            {job.origin === "DIRECT" && (
              <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                Direct Employer
              </span>
            )}
            {job.origin === "ATS" && (
              <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
                Company Portal
              </span>
            )}
            {job.origin === "FEED" && (
              <span className="rounded-md bg-purple-50 px-2 py-0.5 text-[11px] font-semibold text-purple-800 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/60">
                Partner
              </span>
            )}
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {job.company.name}
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {timeAgo(job.publishedAt)}
            </span>
          </div>

          {/* Job Title */}
          <Link
            href={`/jobs/${job.slug}`}
            className="block text-base font-semibold text-slate-900 group-hover:text-blue-600 dark:text-slate-50 dark:group-hover:text-blue-400 transition-colors truncate"
          >
            {job.title}
          </Link>

          {/* Chips */}
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <MapPin className="h-3 w-3 text-slate-400" />
              {job.locationType === "ONSITE" ? "On-site" : job.locationType === "HYBRID" ? "Hybrid" : "Remote"} ({regionsSummary}{moreRegionsCount && ` ${moreRegionsCount}`})
            </span>

            {salaryText && (
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50/80 px-2.5 py-1 font-medium text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/40">
                <DollarSign className="h-3 w-3 text-emerald-600" />
                {salaryText}
              </span>
            )}

            <span className="rounded-md bg-slate-100 px-2.5 py-1 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              {job.category}
            </span>

            {job.seniority && (
              <span className="rounded-md bg-slate-100 px-2.5 py-1 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                {job.seniority}
              </span>
            )}
          </div>
        </div>

        {/* Action button */}
        <div className="hidden sm:flex shrink-0 self-center">
          <Link
            href={`/jobs/${job.slug}`}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            View Role
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
