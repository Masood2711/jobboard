// app/terms/page.tsx
import { SITE } from "@/config/site";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
        Terms of Service
      </h1>
      <p className="text-xs text-slate-400 mb-8">
        Last updated: September 2026. Note: This template must be reviewed by qualified legal counsel in your operating jurisdiction.
      </p>

      <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed dark:prose-invert space-y-6">
        <section>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Real Listings & Employer Rules</h2>
          <p className="text-slate-600 dark:text-slate-300">
            {SITE.name} is a curated platform for legitimate employment opportunities. Employers posting roles warrant that all listings represent genuine, open, non-discriminatory employment opportunities.
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-600 dark:text-slate-300">
            <li>No candidate fees: Employers may never charge candidates fees for application, training, or equipment.</li>
            <li>No pyramid, MLM, or crypto bounty recruitment schemes.</li>
            <li>Accurate compensation: Posted salary figures must represent realistic base or OTE remuneration.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">2. Moderation & Editorial Discretion</h2>
          <p className="text-slate-600 dark:text-slate-300">
            We reserve the right to review, edit formatting, or decline any listing that violates quality guidelines or safety standards.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">3. Refund Policy (Section 5.5)</h2>
          <p className="text-slate-600 dark:text-slate-300">
            If our review team rejects a paid submission during moderation or cannot publish it due to site incompatibility, the employer receives an immediate, automated 100% full refund. Once a listing is approved and published live for the public, sales are final except at the owner's discretion.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">4. Takedowns & Automated ATS Indexing</h2>
          <p className="text-slate-600 dark:text-slate-300">
            We index publicly visible career feeds (Greenhouse, Lever, Ashby) to connect candidates directly with employer career portals. If you represent an employer and wish to have an indexed role permanently removed, submit our Takedown Form. Requests are honored within 48 hours.
          </p>
        </section>
      </div>
    </div>
  );
}
