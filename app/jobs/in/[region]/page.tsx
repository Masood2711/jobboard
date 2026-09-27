// app/jobs/in/[region]/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getJobs } from "@/lib/data";
import JobCard from "@/components/JobCard";
import { NICHE } from "@/config/niche";
import { SITE } from "@/config/site";
import { Globe, ArrowLeft } from "lucide-react";

interface RegionPageProps {
  params: Promise<{ region: string }>;
}

function resolveRegion(slug: string) {
  const normalized = slug.toLowerCase().replace(/[^a-z0-9]+/g, "");
  for (const reg of NICHE.regions) {
    const regNorm = reg.label.toLowerCase().replace(/[^a-z0-9]+/g, "");
    const codeNorm = reg.code.toLowerCase();
    if (regNorm.includes(normalized) || codeNorm === normalized || normalized.includes(codeNorm)) {
      return reg;
    }
  }
  return null;
}

export async function generateMetadata({ params }: RegionPageProps): Promise<Metadata> {
  const { region: rawRegion } = await params;
  const reg = resolveRegion(rawRegion);

  if (!reg) {
    return { title: "Region Not Found" };
  }

  const title = `Remote Jobs in ${reg.label} | ${SITE.name}`;
  const description = `Find verified tech and remote jobs hiring in ${reg.label}. Explore software engineering, AI, design, marketing, and product positions on ${SITE.name}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE.url}/jobs/in/${rawRegion}`,
      siteName: SITE.name,
    },
    alternates: {
      canonical: `${SITE.url}/jobs/in/${rawRegion}`,
    },
  };
}

export default async function RegionPage({ params }: RegionPageProps) {
  const { region: rawRegion } = await params;
  const reg = resolveRegion(rawRegion);

  if (!reg) {
    notFound();
  }

  const { jobs, total } = await getJobs({ region: reg.code, limit: 30 });

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": SITE.url,
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": `Jobs in ${reg.label}`,
            "item": `${SITE.url}/jobs/in/${rawRegion}`,
          },
        ],
      },
      {
        "@type": "ItemList",
        "name": `Remote Jobs in ${reg.label}`,
        "numberOfItems": jobs.length,
        "itemListElement": jobs.map((j, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": j.title,
          "url": `${SITE.url}/jobs/${j.slug}`,
        })),
      },
    ],
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all jobs
        </Link>
      </div>

      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 mb-2">
              <Globe className="h-3.5 w-3.5" />
              Regional Directory
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Remote Jobs in {reg.label}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
              {total} verified opportunities accepting candidates in {reg.label}. High-paying roles with competitive benefits and flexible remote arrangements.
            </p>
          </div>

          <Link
            href="/post-a-job"
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-all shrink-0"
          >
            Post a Job in {reg.label}
          </Link>
        </div>
      </div>

      {/* Other Regions Bar */}
      <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs font-semibold text-slate-400 shrink-0">Other Locations:</span>
        {NICHE.regions
          .filter((r) => r.code !== reg.code)
          .map((r) => {
            const slug = r.label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            return (
              <Link
                key={r.code}
                href={`/jobs/in/${slug}`}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:border-blue-600 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 shrink-0 transition-colors"
              >
                {r.label}
              </Link>
            );
          })}
      </div>

      {/* Jobs List */}
      <div className="space-y-3">
        {jobs.length > 0 ? (
          jobs.map((job) => <JobCard key={job.id} job={job} />)
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              No active jobs in {reg.label} right now
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Subscribe to get alerts the moment new roles for {reg.label} are published.
            </p>
            <div className="mt-4">
              <Link
                href="/subscribe"
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
              >
                Get Job Alerts
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
