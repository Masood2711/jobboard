// components/AdminNewsletterClient.tsx
"use client";

import { useState } from "react";
import { Mail, Send, CheckCircle2, Eye } from "lucide-react";

interface NewsletterJob {
  id: string;
  title: string;
  category: string;
  isFeatured: boolean;
  salaryMin?: number | null;
  salaryMax?: number | null;
  companyName: string;
}

export default function AdminNewsletterClient({ jobs }: { jobs: NewsletterJob[] }) {
  const [introSentence, setIntroSentence] = useState(
    "Welcome to this week's curated dispatch featuring hand-verified remote roles from top hiring teams."
  );
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const featured = jobs.filter((j) => j.isFeatured);
  const regular = jobs.filter((j) => !j.isFeatured).slice(0, 8);

  const handleSend = async () => {
    setSending(true);
    try {
      const res = await fetch("/api/cron/newsletter?secret=dev-cron-secret-secure-token-123&frequency=WEEKLY");
      const data = await res.json();
      if (data.success) {
        setSent(true);
      }
    } catch {
      // fallback
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Mail className="h-6 w-6 text-blue-600" />
            Weekly Newsletter Dispatch (Flow F)
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Auto-generated weekly digest containing live jobs with tracking parameters.
          </p>
        </div>

        <button
          onClick={handleSend}
          disabled={sending || sent || jobs.length === 0}
          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          {sending ? "Sending..." : sent ? "Dispatched" : "Send Newsletter Issue"}
        </button>
      </div>

      {sent && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-xs font-semibold text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>Newsletter sent to active subscribers!</span>
        </div>
      )}

      {/* Editor & Preview */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Introductory Editorial Sentence (Editable by Owner)
          </label>
          <textarea
            rows={3}
            value={introSentence}
            onChange={(e) => setIntroSentence(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </div>

        {/* Rendered Preview */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950 text-xs">
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-400 mb-4">
            <Eye className="h-4 w-4 text-blue-600" />
            Email Rendered Preview
          </div>

          <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
            {introSentence}
          </p>

          {jobs.length === 0 ? (
            <p className="text-slate-500 italic">No live jobs currently in database to preview.</p>
          ) : (
            <div className="space-y-4">
              {featured.length > 0 && (
                <>
                  <h3 className="font-bold text-amber-600 text-xs uppercase tracking-wider">
                    ⭐ Featured Roles This Week
                  </h3>
                  <div className="space-y-2">
                    {featured.map((j) => (
                      <div key={j.id} className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-amber-200/60 flex justify-between">
                        <div>
                          <strong className="text-slate-900 dark:text-white">{j.title}</strong> at {j.companyName}
                          <p className="text-[11px] text-slate-500">{j.category}</p>
                        </div>
                        <span className="text-blue-600 font-semibold text-xs">Apply →</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {regular.length > 0 && (
                <>
                  <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider pt-2">
                    💼 Top New Openings
                  </h3>
                  <div className="space-y-2">
                    {regular.map((j) => (
                      <div key={j.id} className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 flex justify-between">
                        <div>
                          <strong className="text-slate-900 dark:text-white">{j.title}</strong> at {j.companyName}
                          <p className="text-[11px] text-slate-500">{j.category} • Remote</p>
                        </div>
                        <span className="text-blue-600 font-semibold text-xs">Apply →</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
