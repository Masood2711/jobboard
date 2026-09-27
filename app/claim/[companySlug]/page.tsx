// app/claim/[companySlug]/page.tsx
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Building2, Mail, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SITE } from "@/config/site";

export default function ClaimCompanyPage() {
  const params = useParams();
  const slug = params?.companySlug as string;

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate domain verification
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <div className="mb-4">
        <Link
          href={`/companies/${slug}`}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to company
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="text-center mb-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm mb-3">
            <Building2 className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Claim Company Profile
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Verify employment at <strong className="text-slate-700 dark:text-slate-300">{slug}</strong> to access company analytics and upgrade jobs.
          </p>
        </div>

        {submitted ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center dark:border-emerald-900 dark:bg-emerald-950/40">
            <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600 mb-2" />
            <h2 className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
              Verification Link Dispatched
            </h2>
            <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-300">
              We sent a domain-verified magic link to <strong>{email}</strong>. Open the link to access your company dashboard.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Your Company Work Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>
              <p className="mt-1.5 text-[11px] text-slate-400">
                *Must match the verified company web domain. Free email providers (Gmail, Yahoo) are not accepted for company verification.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-98 transition-all disabled:opacity-50"
            >
              {loading ? "Checking Domain..." : "Send Verification Magic Link"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
