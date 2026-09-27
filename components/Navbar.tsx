// components/Navbar.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { Shield, Menu, X, PlusCircle, Building2 } from "lucide-react";
import { SITE } from "@/config/site";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/85">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm transition-transform group-hover:scale-105">
            <Shield className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              {SITE.name}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {SITE.badgeText}
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Jobs
          </Link>
          <Link href="/employers" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Pricing
          </Link>
          <Link href="/advertise" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Advertise
          </Link>
          <Link href="/subscribe" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Alerts
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-2.5">
          <Link
            href="/employers/login"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:border-blue-500 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-colors shadow-sm"
          >
            <Building2 className="h-3.5 w-3.5 text-slate-400" />
            Employer Login
          </Link>
          <Link
            href="/post-a-job"
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            Post a Job ($149)
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <Link
            href="/employers/login"
            className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
          >
            Login
          </Link>
          <Link
            href="/post-a-job"
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white"
          >
            Post
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white px-4 py-4 md:hidden dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-3 text-sm font-medium">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-slate-800 dark:text-slate-100"
            >
              Browse Jobs
            </Link>
            <Link
              href="/employers"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-slate-800 dark:text-slate-100"
            >
              Pricing & Employers
            </Link>
            <Link
              href="/employers/login"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1.5"
            >
              <Building2 className="h-4 w-4" />
              Employer Login / Dashboard
            </Link>
            <Link
              href="/advertise"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-slate-800 dark:text-slate-100"
            >
              Newsletter Sponsorship
            </Link>
            <Link
              href="/subscribe"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-slate-800 dark:text-slate-100"
            >
              Email Alerts
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-slate-500 dark:text-slate-400"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
