// app/jobs/category/[category]/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getJobs } from "@/lib/data";
import JobCard from "@/components/JobCard";
import { NICHE } from "@/config/niche";
import { SITE } from "@/config/site";
import { Sparkles, ArrowLeft, Briefcase, Filter } from "lucide-react";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

function resolveCategoryName(slug: string): string | null {
  const normalized = slug.toLowerCase().replace(/[^a-z0-9]+/g, "");
  for (const cat of NICHE.categories) {
    if (cat.toLowerCase().replace(/[^a-z0-9]+/g, "") === normalized) {
      return cat;
    }
  }
  return null;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: rawCategory } = await params;
  const category = resolveCategoryName(rawCategory);

  if (!category) {
    return { title: "Category Not Found" };
  }

  const title = `Remote ${category} Jobs | ${SITE.name}`;
  const description = `Find hand-curated remote and tech ${category} jobs from high-growth companies. Filter by salary, region, and seniority on ${SITE.name}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE.url}/jobs/category/${rawCategory}`,
      siteName: SITE.name,
    },
    alternates: {
      canonical: `${SITE.url}/jobs/category/${rawCategory}`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: rawCategory } = await params;
  const category = resolveCategoryName(rawCategory);

  if (!category) {
    notFound();
  }

  const { jobs, total } = await getJobs({ category, limit: 30 });

  // Schema.org JSON-LD Breadcrumbs and ItemList
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
            "name": `${category} Jobs`,
            "item": `${SITE.url}/jobs/category/${rawCategory}`,
          },
        ],
      },
      {
        "@type": "ItemList",
        "name": `Remote ${category} Jobs`,
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

      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all jobs
        </Link>
      </div>

      {/* Header section */}
      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300 mb-2">
              <Briefcase className="h-3.5 w-3.5" />
              Category Directory
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Remote {category} Jobs
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
              Explore {total} curated open {category.toLowerCase()} roles. Direct openings from venture-backed startups and established engineering teams worldwide.
            </p>
          </div>

          <Link
            href="/post-a-job"
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-all shrink-0"
          >
            Post a {category} Job
          </Link>
        </div>
      </div>

      {/* Other Categories Bar */}
      <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs font-semibold text-slate-400 shrink-0">Other Disciplines:</span>
        {NICHE.categories
          .filter((c) => c !== category)
          .slice(0, 6)
          .map((cat) => {
            const slug = cat.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            return (
              <Link
                key={cat}
                href={`/jobs/category/${slug}`}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:border-blue-600 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 shrink-0 transition-colors"
              >
                {cat}
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
              No active {category} jobs right now
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Check back soon or explore other disciplines to discover verified openings.
            </p>
            <div className="mt-4">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
              >
                Browse All Openings
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
