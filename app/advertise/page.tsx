// app/advertise/page.tsx
"use client";

import { useState } from "react";
import { Megaphone, Users, Mail, CheckCircle2, Send, Sparkles } from "lucide-react";
import { PRICING } from "@/config/pricing";
import { SITE } from "@/config/site";

export default function AdvertisePage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
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
          Reach active job seekers, qualified professionals, and hiring leaders every Tuesday morning.
        </p>
      </div>

      {/* Audience Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        <div className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <Mail className="mx-auto h-6 w-6 text-blue-600 mb-2" />
          <span className="text-2xl font-bold text-slate-900 dark:text-white">2,450+</span>
          <p className="text-xs text-slate-500 mt-1">Confirmed Subscribers</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <Users className="mx-auto h-6 w-6 text-emerald-600 mb-2" />
          <span className="text-2xl font-bold text-slate-900 dark:text-white">18,500+</span>
          <p className="text-xs text-slate-500 mt-1">Monthly Active Views</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <Sparkles className="mx-auto h-6 w-6 text-amber-500 mb-2" />
          <span className="text-2xl font-bold text-slate-900 dark:text-white">46.8%</span>
          <p className="text-xs text-slate-500 mt-1">Average Open Rate</p>
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
              <span>Company logo (200x200) + punchy 40-word copy</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Dedicated tracking link with custom UTM parameters</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Post-campaign metrics: confirmed delivery, opens & clicks</span>
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
                The {SITE.name} operator will review your slot request and reply within 24 hours with upcoming available Tuesday dates and invoice details.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Company / Organization *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Acme Academy"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Work Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="marketing@partner.com"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Headline / Link Target *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Cloud Threat Hunting: Enroll Today (https://...)"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Short Copy (Up to 40 words)
                </label>
                <textarea
                  rows={2}
                  placeholder="Briefly describe your offering or training program..."
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-98 transition-all disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
                {loading ? "Submitting..." : "Submit Sponsor Booking Request"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
