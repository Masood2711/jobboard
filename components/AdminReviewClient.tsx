// components/AdminReviewClient.tsx
"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, ShieldAlert, Check } from "lucide-react";

interface PendingJobItem {
  id: string;
  title: string;
  category: string;
  employerEmail?: string | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryCurrency?: string | null;
  salaryPeriod?: string | null;
  createdAt: string;
  company: {
    name: string;
    websiteUrl: string;
    domain: string;
  };
}

export default function AdminReviewClient({ initialJobs }: { initialJobs: PendingJobItem[] }) {
  const [jobs, setJobs] = useState<PendingJobItem[]>(initialJobs);
  const [notification, setNotification] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleAction = async (jobId: string, action: "approve" | "reject") => {
    setProcessingId(jobId);
    try {
      const res = await fetch(`/api/admin/jobs/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (data.success) {
        setJobs((prev) => prev.filter((j) => j.id !== jobId));
        setNotification(
          action === "approve"
            ? "Job approved and published LIVE! Google indexing ping scheduled."
            : "Job rejected. Status updated."
        );
      } else {
        setNotification(data.error || "Action failed.");
      }
    } catch {
      setNotification("Failed to execute review action.");
    } finally {
      setProcessingId(null);
      setTimeout(() => setNotification(""), 5000);
    }
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldAlert className="h-6 w-6 text-amber-500" />
          Moderation Review Queue ({jobs.length})
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Verify new employer submissions for fraud, candidate safety, and niche compliance before publishing live.
        </p>
      </div>

      {notification && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-xs font-semibold text-emerald-900 shadow-sm dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{notification}</span>
        </div>
      )}

      {jobs.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <Check className="mx-auto h-10 w-10 text-emerald-500 mb-3" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Queue is Empty
          </h2>
          <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
            All recent employer postings have been processed. New employer direct submissions requiring manual moderation will appear here instantly.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex flex-col lg:flex-row items-start justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="rounded-md bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 px-2 py-0.5 text-xs font-semibold">
                      PENDING_REVIEW
                    </span>
                    <span className="text-xs text-slate-400">
                      Submitted {new Date(job.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {job.title}
                  </h2>

                  <div className="mt-1 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
                    <span>{job.company.name}</span>
                    <span>•</span>
                    <span>{job.category}</span>
                    {job.salaryMin && (
                      <>
                        <span>•</span>
                        <span>
                          ${job.salaryMin.toLocaleString()}{" "}
                          {job.salaryMax ? `- $${job.salaryMax.toLocaleString()}` : ""} / {job.salaryPeriod?.toLowerCase() || "yr"}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="mt-2 text-xs text-slate-500">
                    Contact: <code className="text-slate-700 dark:text-slate-300">{job.employerEmail || "Direct Post"}</code>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    disabled={processingId === job.id}
                    onClick={() => handleAction(job.id, "approve")}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors disabled:opacity-50"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Approve & Publish Live
                  </button>

                  <button
                    disabled={processingId === job.id}
                    onClick={() => handleAction(job.id, "reject")}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-white px-4 py-2 text-xs font-semibold text-red-600 shadow-sm hover:bg-red-50 dark:border-red-900 dark:bg-slate-800 dark:text-red-400 transition-colors disabled:opacity-50"
                  >
                    <XCircle className="h-4 w-4" />
                    Reject
                  </button>
                </div>
              </div>

              {/* Safety Checklist */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                    Safety Checklist:
                  </h3>
                  <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Verify company website: <a href={job.company.websiteUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{job.company.websiteUrl}</a></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Check that email matches domain: @{job.company.domain}</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                    Auto-Approval:
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    Once approved, future postings from this employer email will bypass manual queue and go live immediately.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
