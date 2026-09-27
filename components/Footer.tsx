// components/Footer.tsx
import Link from "next/link";
import { Shield } from "lucide-react";
import { SITE } from "@/config/site";
import { NICHE } from "@/config/niche";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/50 mt-20 text-xs text-slate-500 dark:text-slate-400">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="text-base font-bold text-slate-900 dark:text-white">
                {SITE.name}
              </span>
            </div>
            <p className="max-w-md text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              The dedicated job board for verified tech, AI, remote, and digital professionals. Direct company career feeds, verified remote roles, and transparent compensation data.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {NICHE.categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/?category=${encodeURIComponent(cat)}`}
                  className="rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3">For Candidates</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">
                  Browse All Jobs
                </Link>
              </li>
              <li>
                <Link href="/subscribe" className="hover:text-blue-600 dark:hover:text-blue-400">
                  Get Job Alerts (Free)
                </Link>
              </li>
              <li>
                <Link href="/companies" className="hover:text-blue-600 dark:hover:text-blue-400">
                  Company Directory
                </Link>
              </li>
              <li>
                <Link href="/sitemap.xml" className="hover:text-blue-600 dark:hover:text-blue-400">
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Employers & Trust</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/post-a-job" className="hover:text-blue-600 dark:hover:text-blue-400">
                  Post a Job ($149)
                </Link>
              </li>
              <li>
                <Link href="/employers" className="hover:text-blue-600 dark:hover:text-blue-400">
                  Pricing & FAQ
                </Link>
              </li>
              <li>
                <Link href="/advertise" className="hover:text-blue-600 dark:hover:text-blue-400">
                  Advertise in Newsletter
                </Link>
              </li>
              <li>
                <Link href="/takedown" className="hover:text-blue-600 dark:hover:text-blue-400">
                  Takedown / Removal Form
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-100 pt-6 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved. Vetted jobs directly from employer systems.</p>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/admin" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              Admin Access
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
