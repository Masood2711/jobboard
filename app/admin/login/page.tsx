// app/admin/login/page.tsx
"use client";

import { useState } from "react";
import { Shield, Mail, CheckCircle2, AlertCircle, ArrowRight, Building2 } from "lucide-react";
import Link from "next/link";
import { SITE } from "@/config/site";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [magicLink, setMagicLink] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to process login request");
      }

      setSent(true);
      if (data.devMagicLink) {
        setMagicLink(data.devMagicLink);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm mb-4">
            <Shield className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Authentication</h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Passwordless magic-link sign in for {SITE.name} operators.
          </p>
        </div>

        {sent ? (
          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50/70 p-5 text-center dark:border-emerald-900 dark:bg-emerald-950/40">
            <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600 dark:text-emerald-400 mb-2" />
            <h2 className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
              Magic link generated!
            </h2>
            <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-300">
              We dispatched an authentication link for <strong>{email}</strong>.
            </p>

            {magicLink && (
              <div className="mt-4 pt-4 border-t border-emerald-200 dark:border-emerald-800 text-left">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block mb-1">
                  Local Dev Instant Login:
                </span>
                <Link
                  href={magicLink}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors w-full justify-center"
                >
                  Verify & Enter Admin Dashboard
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Admin Work Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 shadow-sm focus:border-blue-600 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                Default authorized email: <code className="text-slate-600 dark:text-slate-300">owner@example.com</code> or configure in <code className="text-slate-600 dark:text-slate-300">ADMIN_EMAILS</code>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-98 transition-all disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Send Magic Link"}
            </button>
          </form>
        )}

        {/* Employer Portal Callout */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
            Are you an employer looking to check posting status or candidate clicks?
          </p>
          <Link
            href="/employers/login"
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50 dark:bg-slate-800 dark:text-blue-400 dark:hover:bg-slate-700/50 transition-colors"
          >
            <Building2 className="h-3.5 w-3.5" />
            Go to Employer Login & Status Dashboard →
          </Link>
        </div>
      </div>
    </div>
  );
}

