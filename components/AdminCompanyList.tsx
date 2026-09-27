// components/AdminCompanyList.tsx
"use client";

import { useState } from "react";
import { SITE } from "@/config/site";
import { Copy, Check, ExternalLink } from "lucide-react";

interface CompanyItem {
  id: string;
  name: string;
  slug: string;
  domain: string;
  description?: string | null;
  jobs: {
    id: string;
    title: string;
  }[];
  views: number;
  clicks: number;
}

export default function AdminCompanyList({ companies }: { companies: CompanyItem[] }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyOutreachTemplate = (company: CompanyItem) => {
    const rolesList = company.jobs.map((j) => j.title).slice(0, 2).join(", ");
    const claimLink = `${SITE.url}/claim/${company.slug}`;

    const text = `Subject: Your ${company.jobs.length} roles got ${company.clicks} apply clicks on ${SITE.name}

Hi Hiring Team,

I run ${SITE.name}, a curated job board.

Your open positions (${rolesList || "technical roles"}) are already indexed on our board for free and generated ${company.views} views and ${company.clicks} direct apply clicks over the last 30 days.

If you would like to pin your roles at the very top of our listings and feature them in our weekly newsletter, Featured placement is just $99 for 30 days.

You can claim your verified company profile here: ${claimLink}

If you would rather not have your public career feeds indexed, simply reply "remove" and I will remove your listings today.

Best regards,
Operations Team, ${SITE.name}
${SITE.url}`;

    navigator.clipboard.writeText(text);
    setCopiedId(company.id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  if (companies.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900">
        No companies currently recorded in the database. Companies are automatically created when jobs are imported from ATS sources or posted directly.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {companies.map((company) => {
        const isCopied = copiedId === company.id;

        return (
          <div
            key={company.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {company.name}
                </h2>
                <span className="text-xs text-slate-400">({company.domain})</span>
              </div>

              <p className="text-xs text-slate-500 max-w-xl">
                {company.description || "Verified company with active postings."}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-300">
                  {company.jobs.length} Active Roles
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-purple-600">
                  {company.views} Views
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-amber-600">
                  {company.clicks} Apply Clicks
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => copyOutreachTemplate(company)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-colors"
              >
                {isCopied ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span className="text-emerald-600">Email Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy Outreach Email (Template 1)
                  </>
                )}
              </button>

              <a
                href={`/companies/${company.slug}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}
