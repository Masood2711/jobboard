// app/privacy/page.tsx
import { SITE } from "@/config/site";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
        Privacy Policy
      </h1>
      <p className="text-xs text-slate-400 mb-8">
        Last updated: September 2026.
      </p>

      <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed dark:prose-invert space-y-6">
        <section>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Candidate Privacy (Zero-Friction & No CV Storing)</h2>
          <p className="text-slate-600 dark:text-slate-300">
            {SITE.name} does not collect, store, or process candidate resumes or curriculum vitae. When you click "Apply", you are redirected directly to the hiring employer's application portal or ATS.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">2. Job Alert Subscribers</h2>
          <p className="text-slate-600 dark:text-slate-300">
            If you subscribe to job alerts, we store only your email address and chosen alert categories. You can unsubscribe at any time with the one-click unsubscribe link at the footer of every email.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">3. Analytics & Cookies</h2>
          <p className="text-slate-600 dark:text-slate-300">
            We use privacy-friendly, cookieless aggregate analytics. We track total job views and outbound apply clicks to demonstrate hiring demand to employers.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">4. Data Deletion Requests</h2>
          <p className="text-slate-600 dark:text-slate-300">
            To request full data deletion, email our privacy team at <code className="text-blue-600">{SITE.supportEmail}</code>. All requests are processed within 30 days.
          </p>
        </section>
      </div>
    </div>
  );
}
