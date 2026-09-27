// app/about/page.tsx
import { SITE } from "@/config/site";
import { NICHE } from "@/config/niche";
import { Shield, Target, Users, Zap } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          About {SITE.name}
        </span>
        <h1 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white">
          Dedicated Exclusively to High-Impact Tech & Remote Careers
        </h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          Why build a curated board? General job sites are flooded with low-quality listings, misleading remote tags, and thousands of unqualified applicants.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-3 dark:bg-blue-950">
            <Target className="h-5 w-5" />
          </div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
            Strict Quality Filter
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every role must strictly match verified tech disciplines (Engineering, AI, Product, Design, DevOps). Spam listings, physical security, and misleading titles are filtered out.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-3 dark:bg-emerald-950">
            <Zap className="h-5 w-5" />
          </div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
            Direct Career Feeds
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            We pull positions directly from verified Greenhouse, Lever, and Ashby career portals. Candidates always apply directly on the employer's official site.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 mb-3 dark:bg-purple-950">
            <Users className="h-5 w-5" />
          </div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
            Free for Candidates
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Candidates never pay to search, browse, or set up job alerts. Employers and sponsors pay for targeted reach to high-demand talent.
          </p>
        </div>
      </div>

      <div className="text-center">
        <Link
          href="/post-a-job"
          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-6 py-3 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          Post a Job Role ($149)
        </Link>
      </div>
    </div>
  );
}
