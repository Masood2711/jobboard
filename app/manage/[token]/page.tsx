// app/manage/[token]/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Briefcase,
  CheckCircle2,
  TrendingUp,
  MousePointerClick,
  Eye,
  Calendar,
  Sparkles,
  Edit3,
  XCircle,
  RefreshCw,
  FileText,
  ExternalLink,
} from "lucide-react";

export default function EmployerManagePage() {
  const params = useParams();
  const token = params?.token as string;

  const [status, setStatus] = useState("LIVE");
  const [isFeatured, setIsFeatured] = useState(false);
  const [views, setViews] = useState(842);
  const [applyClicks, setApplyClicks] = useState(61);
  const [isEditing, setIsEditing] = useState(false);
  const [jobTitle, setJobTitle] = useState("Senior Software Engineer (Remote)");
  const [notification, setNotification] = useState("");

  const handleUpgradeToFeatured = () => {
    setIsFeatured(true);
    setNotification("Successfully upgraded to Featured! Your role is now pinned to the top of listings.");
    setTimeout(() => setNotification(""), 4000);
  };

  const handleRenew = () => {
    setNotification("Listing successfully renewed for an additional 30 days!");
    setTimeout(() => setNotification(""), 4000);
  };

  const handleCloseJob = () => {
    setStatus("CLOSED");
    setNotification("Listing closed. It is now hidden from candidate search results.");
    setTimeout(() => setNotification(""), 4000);
  };

  // 14-day sample view activity for the daily stats chart
  const sampleDays = [
    { day: "Sep 12", views: 42, clicks: 3 },
    { day: "Sep 13", views: 58, clicks: 5 },
    { day: "Sep 14", views: 65, clicks: 4 },
    { day: "Sep 15", views: 71, clicks: 6 },
    { day: "Sep 16", views: 54, clicks: 3 },
    { day: "Sep 17", views: 80, clicks: 7 },
    { day: "Sep 18", views: 92, clicks: 8 },
    { day: "Sep 19", views: 88, clicks: 6 },
    { day: "Sep 20", views: 74, clicks: 5 },
    { day: "Sep 21", views: 60, clicks: 4 },
    { day: "Sep 22", views: 55, clicks: 3 },
    { day: "Sep 23", views: 49, clicks: 2 },
    { day: "Sep 24", views: 32, clicks: 3 },
    { day: "Sep 25", views: 22, clicks: 2 },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      {/* Toast Notification */}
      {notification && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-xs font-semibold text-emerald-900 shadow-sm dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header Overview Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 mb-8">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`rounded-md px-2 py-0.5 text-xs font-bold ${
                  status === "LIVE"
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                    : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                STATUS: {status}
              </span>
              {isFeatured && (
                <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900 dark:bg-amber-900/60 dark:text-amber-200">
                  <Sparkles className="h-3 w-3 text-amber-600 fill-amber-600" />
                  Featured
                </span>
              )}
            </div>

            {isEditing ? (
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-lg font-bold text-slate-900 dark:bg-slate-950 dark:text-white"
                />
                <button
                  onClick={() => setIsEditing(false)}
                  className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white"
                >
                  Save
                </button>
              </div>
            ) : (
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {jobTitle}
              </h1>
            )}

            <p className="mt-1 text-xs text-slate-500">
              Management Token: <code className="font-mono text-slate-700 dark:text-slate-300">{token}</code>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <Edit3 className="h-3.5 w-3.5" />
              {isEditing ? "Cancel" : "Edit Text"}
            </button>
            <button
              onClick={handleRenew}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Renew ($149)
            </button>
            {!isFeatured && (
              <button
                onClick={handleUpgradeToFeatured}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-amber-600"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Upgrade to Featured ($99)
              </button>
            )}
            <button
              onClick={handleCloseJob}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 shadow-sm hover:bg-red-50 dark:border-red-900 dark:bg-slate-800 dark:text-red-400"
            >
              <XCircle className="h-3.5 w-3.5" />
              Close Role
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-100 pt-6 dark:border-slate-800">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" /> Total Views
            </span>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
              {views.toLocaleString()}
            </p>
          </div>

          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <MousePointerClick className="h-3.5 w-3.5 text-blue-600" /> Apply Clicks
            </span>
            <p className="mt-1 text-2xl font-bold text-blue-600">
              {applyClicks.toLocaleString()}
            </p>
          </div>

          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-600" /> Click Rate
            </span>
            <p className="mt-1 text-2xl font-bold text-emerald-600">
              {((applyClicks / views) * 100).toFixed(1)}%
            </p>
          </div>

          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" /> Days Remaining
            </span>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
              28 days
            </p>
          </div>
        </div>
      </div>

      {/* Daily Performance Activity (Wireframe page 20) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 mb-8">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
          Daily Views & Apply Clicks (Last 14 Days)
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          Proof of value for employer renewals and analytics tracking.
        </p>

        <div className="space-y-3">
          {sampleDays.map((item, i) => (
            <div key={i} className="flex items-center gap-4 text-xs">
              <span className="w-16 font-mono text-slate-500 shrink-0">{item.day}</span>
              <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden flex">
                <div
                  className="bg-blue-600 h-full rounded-full"
                  style={{ width: `${(item.views / 100) * 80}%` }}
                />
                <div
                  className="bg-amber-500 h-full"
                  style={{ width: `${(item.clicks / 10) * 20}%` }}
                />
              </div>
              <span className="w-24 text-right text-slate-700 dark:text-slate-300 shrink-0 font-medium">
                {item.views} views • <strong className="text-amber-600">{item.clicks} clicks</strong>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Invoice & Receipts */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-slate-400" />
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              Billing Receipt & Tax Invoice
            </h3>
            <p className="text-[11px] text-slate-500">
              Receipt #INV-2026-0926 • Paid $149.00 via Stripe Checkout
            </p>
          </div>
        </div>

        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            alert("Receipt downloaded successfully!");
          }}
          className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
        >
          Download PDF
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}
