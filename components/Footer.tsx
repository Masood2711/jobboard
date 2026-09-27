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
          {/* Brand Info & Categories */}
          <div className="flex flex-col gap-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
                <Shield className="h-4 w-4" />
              </div>
              <span className="text-base font-bold text-slate-900 dark:text-white">
                {SITE.name}
              </span>
            </div>
            <p className="max-w-md text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              The modern job board connecting verified tech, remote, and digital professionals with hiring teams worldwide. Transparent salaries, verified roles, and direct company applications.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {NICHE.categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/?category=${encodeURIComponent(cat)}`}
                  className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 transition-colors"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          {/* Job Seekers */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Job Seekers</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Browse All Jobs
                </Link>
              </li>
              <li>
                <Link href="/companies" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Company Directory
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Employers */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Employers</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/post-a-job" className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 transition-colors">
                  Post a Job ($149)
                </Link>
              </li>
              <li>
                <Link href="/employers" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Pricing & Plans
                </Link>
              </li>
              <li>
                <Link href="/employers/login" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Employer Dashboard
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 border-t border-slate-100 pt-6 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/admin/login" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
