// app/subscribe/page.tsx
"use client";

import { useState } from "react";
import { Mail, CheckCircle2, ShieldCheck } from "lucide-react";
import { NICHE } from "@/config/niche";
import { SITE } from "@/config/site";

export default function SubscribePage() {
  const [email, setEmail] = useState("");
  const [frequency, setFrequency] = useState("WEEKLY");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([...NICHE.categories]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          frequency,
          categories: selectedCategories,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to subscribe");
      }

      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="text-center mb-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm mb-3">
            <Mail className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {NICHE.name} Job Alerts
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Targeted notifications tailored to your specific field. No recruiter spam.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
            {errorMsg}
          </div>
        )}

        {submitted ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center dark:border-emerald-900 dark:bg-emerald-950/40">
            <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600 mb-2" />
            <h2 className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
              Check your inbox to confirm
            </h2>
            <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-300">
              We dispatched a confirmation email to <strong>{email}</strong>. Click the confirmation link to activate your job alerts.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Your Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Alert Frequency
              </label>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setFrequency("WEEKLY")}
                  className={`rounded-lg border py-2 font-medium transition-colors ${
                    frequency === "WEEKLY"
                      ? "border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                      : "border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-400"
                  }`}
                >
                  Weekly Digest (Tuesdays)
                </button>
                <button
                  type="button"
                  onClick={() => setFrequency("DAILY")}
                  className={`rounded-lg border py-2 font-medium transition-colors ${
                    frequency === "DAILY"
                      ? "border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                      : "border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-400"
                  }`}
                >
                  Daily Instant Alerts
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Select Your Categories
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {NICHE.categories.map((cat) => {
                  const checked = selectedCategories.includes(cat);
                  return (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left transition-colors ${
                        checked
                          ? "border-blue-600 bg-blue-50/50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 font-medium"
                          : "border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-400"
                      }`}
                    >
                      <span
                        className={`h-3 w-3 rounded-full border flex items-center justify-center ${
                          checked ? "border-blue-600 bg-blue-600" : "border-slate-300"
                        }`}
                      >
                        {checked && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </span>
                      <span className="truncate">{cat}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-98 transition-all disabled:opacity-50"
            >
              {loading ? "Activating..." : "Create Free Job Alert"}
            </button>

            <p className="text-center text-[11px] text-slate-400">
              One-click unsubscribe link provided in every single email. We respect your privacy.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
