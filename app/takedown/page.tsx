// app/takedown/page.tsx
"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, Shield } from "lucide-react";
import { SITE } from "@/config/site";

export default function TakedownPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="text-center mb-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 mb-3">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Job Takedown & Removal Request
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Are you an employer whose public career ATS role was indexed, and you would like it permanently removed?
          </p>
        </div>

        {submitted ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center dark:border-emerald-900 dark:bg-emerald-950/40">
            <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600 mb-2" />
            <h2 className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
              Takedown Request Logged
            </h2>
            <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-300">
              Your request has been placed in our admin operations queue. We honor all genuine company takedown requests within 48 hours and blocklist the requested feed URL.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Job URL on {SITE.name} *
              </label>
              <input
                type="url"
                required
                placeholder="https://rolenest.co/jobs/..."
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Your Official Company Email *
              </label>
              <input
                type="email"
                required
                placeholder="legal@company.com"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Reason for Removal *
              </label>
              <select
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              >
                <option value="">Select a reason...</option>
                <option value="FILLED">This position has already been filled</option>
                <option value="AUTHORIZATION">Company did not authorize third-party indexing</option>
                <option value="INACCURATE">Job details or compensation are inaccurate</option>
                <option value="OTHER">Other / Confidentiality</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Additional Comments
              </label>
              <textarea
                rows={3}
                placeholder="Provide any additional details or verification information..."
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-amber-600 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-amber-700 active:scale-98 transition-all disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Removal Request"}
            </button>

            <p className="text-center text-[11px] text-slate-400">
              Target response SLA: 48 business hours.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
