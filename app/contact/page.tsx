// app/contact/page.tsx
import { SITE } from "@/config/site";
import { Mail, MessageSquare } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm mb-4">
          <MessageSquare className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Contact {SITE.name}
        </h1>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Questions about job postings, partnerships, sponsorships, or candidate alerts? Reach out directly to our team.
        </p>

        <div className="mt-8 rounded-xl border border-slate-100 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-800/50">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Email Support
          </span>
          <p className="mt-1 text-base font-bold text-blue-600 dark:text-blue-400">
            <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a>
          </p>
          <p className="mt-2 text-xs text-slate-500">
            We typically respond within 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
}
