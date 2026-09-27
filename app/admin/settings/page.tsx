// app/admin/settings/page.tsx
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import AdminNav from "@/components/AdminNav";
import { NICHE } from "@/config/niche";
import { PRICING } from "@/config/pricing";
import { SITE } from "@/config/site";
import { Sliders, Shield, Tag, DollarSign } from "lucide-react";

export default async function AdminSettingsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-16">
      <AdminNav adminEmail={session.email} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="h-6 w-6 text-blue-600" />
            Config & Niche Settings (Read-Only in MVP)
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            All values loaded from config/site.ts, config/niche.ts, and config/pricing.ts without hard-coding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Site & Niche Details */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-600" />
              Niche Target Definition
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-semibold text-slate-500">Niche Name:</span>
                <p className="font-mono text-slate-800 dark:text-slate-200">{NICHE.name}</p>
              </div>
              <div>
                <span className="font-semibold text-slate-500">Headline:</span>
                <p className="text-slate-800 dark:text-slate-200">{NICHE.headline}</p>
              </div>
              <div>
                <span className="font-semibold text-slate-500">Authorized Admin Emails:</span>
                <p className="font-mono text-slate-800 dark:text-slate-200">{SITE.adminEmails.join(", ")}</p>
              </div>
              <div>
                <span className="font-semibold text-slate-500">Categories ({NICHE.categories.length}):</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {NICHE.categories.map((c) => (
                    <span key={c} className="rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Config */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-600" />
              Pricing Engine Defaults
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Standard Direct Listing (30d):</span>
                <span className="font-bold text-slate-900 dark:text-white">${PRICING.standard.amount}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Featured Direct Listing (30d):</span>
                <span className="font-bold text-slate-900 dark:text-white">${PRICING.featured.amount}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Feature Upgrade (Imported ATS Job):</span>
                <span className="font-bold text-slate-900 dark:text-white">${PRICING.featureUpgrade.amount}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Newsletter Sponsor Slot:</span>
                <span className="font-bold text-slate-900 dark:text-white">${PRICING.sponsorsSlot.amount}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Employer Monthly Plan (After MVP):</span>
                <span className="font-bold text-slate-900 dark:text-white">${PRICING.monthlyPlan.amount}/mo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
