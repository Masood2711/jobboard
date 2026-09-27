// app/employers/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  Mail,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  MousePointerClick,
  FileText,
} from "lucide-react";
import { SITE } from "@/config/site";

export default function EmployerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successData, setSuccessData] = useState<{
    companySlug: string;
    companyName: string;
    redirectUrl: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/employers/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to locate employer workspace");
      }

      setSuccessData(data);

      // Automatically redirect after brief visual confirmation
      setTimeout(() => {
        router.push(data.redirectUrl);
      }, 1200);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm mb-4">
              <Building2 className="h-6 w-6" />
            </div>
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 mb-2">
              Employer Portal
            </span>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Sign In to Your Dashboard
            </h1>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Enter your work email to view your job postings, candidate analytics, and plan status on {SITE.name}.
            </p>
          </div>

          {successData ? (
            <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50/70 p-6 text-center dark:border-emerald-900 dark:bg-emerald-950/40">
              <CheckCircle2 className="mx-auto h-9 w-9 text-emerald-600 dark:text-emerald-400 mb-2" />
              <h2 className="text-sm font-bold text-emerald-950 dark:text-emerald-200">
                Welcome, {successData.companyName}!
              </h2>
              <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-300">
                Employer identity verified. Opening your company status dashboard now...
              </p>

              <div className="mt-4">
                <Link
                  href={successData.redirectUrl}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors w-full justify-center shadow-sm"
                >
                  Enter {successData.companyName} Dashboard
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {error && (
                <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Work Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@yourcompany.com"
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 shadow-sm focus:border-blue-600 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-slate-400">
                  Use the email address you used when posting jobs or purchasing your plan.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-98 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? "Accessing Workspace..." : "Access Employer Dashboard"}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>
          )}

          {/* Quick value highlights */}
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-2.5 text-[11px] text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>No password needed — instant access with your work email</span>
            </div>
            <div className="flex items-center gap-2">
              <MousePointerClick className="h-3.5 w-3.5 text-blue-600 shrink-0" />
              <span>Real-time views and candidate apply click tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 text-purple-600 shrink-0" />
              <span>Check Lemon Squeezy subscription status & tax receipts</span>
            </div>
          </div>
        </div>

        {/* Footer Navigation helpers */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <Link
            href="/post-a-job"
            className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 font-medium"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            Need to post a new role?
          </Link>
          <Link
            href="/admin/login"
            className="hover:text-slate-800 dark:hover:text-slate-300 text-[11px]"
          >
            Admin Sign In →
          </Link>
        </div>
      </div>
    </div>
  );
}
