// app/companies/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/db";
import { SITE } from "@/config/site";
import { Building2, ArrowRight, Briefcase } from "lucide-react";

export const metadata: Metadata = {
  title: `Top Tech & Remote Companies Hiring | ${SITE.name}`,
  description: `Browse verified companies actively hiring software engineers, AI developers, designers, and growth professionals on ${SITE.name}.`,
};

export default async function CompaniesDirectoryPage() {
  let companiesWithCounts: any[] = [];

  try {
    const dbCompanies = await prisma.company.findMany({
      where: { blocklisted: false },
      include: {
        _count: {
          select: { jobs: { where: { status: "LIVE" } } },
        },
      },
      orderBy: { name: "asc" },
    });

    if (dbCompanies && dbCompanies.length > 0) {
      companiesWithCounts = dbCompanies.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        logoUrl: c.logoUrl,
        description: c.description,
        jobCount: c._count.jobs,
      }));
    }
  } catch (err) {
    console.error("Failed to query companies:", err);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300 mb-3">
          <Building2 className="h-3.5 w-3.5" />
          Employer Directory
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
          Top Tech Companies Hiring Now
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Explore organizations building the future of software, artificial intelligence, and cloud infrastructure.
        </p>
      </div>

      {companiesWithCounts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900/50">
          <Building2 className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700 mb-3" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            No companies indexed yet
          </h3>
          <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
            Companies will appear here in real time as jobs are synced from employer career boards or posted directly.
          </p>
        </div>
      ) : (
        /* Grid */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {companiesWithCounts.map((comp) => (
            <Link
              key={comp.id}
              href={`/companies/${comp.slug}`}
              className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-blue-600 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500 transition-all"
            >
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-800">
                    {comp.logoUrl ? (
                      <Image
                        src={comp.logoUrl}
                        alt={comp.name}
                        width={56}
                        height={56}
                        unoptimized
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Building2 className="h-6 w-6 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {comp.name}
                    </h2>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      <Briefcase className="h-3 w-3" />
                      {comp.jobCount} {comp.jobCount === 1 ? "open role" : "open roles"}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {comp.description || "Verified company hiring across key technical domains."}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3 text-xs font-semibold text-blue-600 dark:text-blue-400">
                <span>View Openings</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
