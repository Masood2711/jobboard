// app/advertise/page.tsx
"use client";

import { useState } from "react";
import { Users, Mail, CheckCircle2, Send, Sparkles, AlertCircle, ShieldCheck } from "lucide-react";
import { PRICING } from "@/config/pricing";
import { SITE } from "@/config/site";

export default function AdvertisePage() {
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [headline, setHeadline] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [bodyText, setBodyText] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/advertise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company,
          email,
          headline,
          linkUrl,
          bodyText,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit sponsor inquiry");
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          Newsletter Sponsorships
        </span>
        <h1 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white">
          Sponsor the {SITE.name} Weekly Digest
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Reach motivated job seekers, qualified professionals, and hiring leaders in our weekly email dispatch.
        </p>
      </div>

      {/* Value Pillars Grid (Honest, Real Launch Benefits) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        <div className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <Users className="mx-auto h-6 w-6 text-blue-600 mb-2" />
          <span className="text-base font-bold text-slate-900 dark:text-white">Targeted Audience</span>
          <p className="text-xs text-slate-500 mt-1">Direct access to active tech, remote & digital job seekers</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <Mail className="mx-auto h-6 w-6 text-emerald-600 mb-2" />
          <span className="text-base font-bold text-slate-900 dark:text-white">Direct Inbox Delivery</span>
          <p className="text-xs text-slate-500 mt-1">Top-placement dispatch every Tuesday morning</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <ShieldCheck className="mx-auto h-6 w-6 text-amber-500 mb-2" />
          <span className="text-base font-bold text-slate-900 dark:text-white">Exclusive Placement</span>
          <p className="text-xs text-slate-500 mt-1">1 single verified sponsor per issue — no competitor noise</p>
        </div>
      </div>

      {/* Pricing & What's Included */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            What is Included
          </h2>
          <div className="text-3xl font-extrabold text-blue-600 mb-4">
            ${PRICING.sponsorsSlot.amount}{" "}
            <span className="text-xs font-normal text-slate-500">/ single issue</span>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Prominent top placement in Tuesday morning weekly dispatch</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Company logo / badge + punchy 40-word copy</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Dedicated tracking link with custom UTM parameters</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Post-campaign delivery confirmation & click metrics</span>
            </li>
          </ul>
        </div>

        {/* Sponsor Inquiry Form */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            Reserve a Sponsor Slot
          </h2>

          {submitted ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center dark:border-emerald-900 dark:bg-emerald-950/40">
              <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600 mb-2" />
              <h3 className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
                Inquiry Received!
              </h3>
              <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-300">
                The {SITE.name} team will review your slot request and reply within 24 hours with upcoming available Tuesday dates and invoice details.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              {error && (
                <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Company / Organization *
                </label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. DevTools Inc or CareerAcademy"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Contact Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="marketing@company.com"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Ad Headline *
                </label>
                <input
                  type="text"
                  required
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Master Cloud Architecture: 30% Off This Week"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Website URL
                </label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://yourcompany.com/landing"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Short Description (Up to 40 words)
                </label>
                <textarea
                  rows={2}
                  value={bodyText}
                  onChange={(e) => setBodyText(e.target.value)}
                  placeholder="Briefly describe your product, course, or tool for tech professionals..."
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-98 transition-all disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
                {loading ? "Submitting Inquiry..." : "Submit Sponsor Booking Request"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
