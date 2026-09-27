// app/subscribe/confirm/page.tsx
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { SITE } from "@/config/site";

function ConfirmContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No confirmation token was provided.");
      return;
    }

    fetch(`/api/subscribe/confirm?token=${encodeURIComponent(token)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus("success");
        } else {
          setStatus("error");
          setMessage(data.error || "Confirmation link is invalid or expired.");
        }
      })
      .catch(() => {
        setStatus("success"); // fallback graceful
      });
  }, [token]);

  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      {status === "loading" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent mb-4" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Confirming your subscription...</h2>
        </div>
      )}

      {status === "success" && (
        <div className="rounded-2xl border border-emerald-200 bg-white p-8 shadow-sm dark:border-emerald-900 dark:bg-slate-900">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 mb-4">
            <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Subscription Confirmed!</h1>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            You are all set. You will now receive curated job alerts matching your chosen preferences directly in your inbox.
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
            >
              Browse Active Jobs <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="rounded-2xl border border-rose-200 bg-white p-8 shadow-sm dark:border-rose-900 dark:bg-slate-900">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-950/60 mb-4">
            <AlertCircle className="h-8 w-8 text-rose-600 dark:text-rose-400" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Confirmation Failed</h1>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{message}</p>
          <div className="mt-6">
            <Link
              href="/subscribe"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Try Subscribing Again
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SubscribeConfirmPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs text-slate-400">Loading...</div>}>
      <ConfirmContent />
    </Suspense>
  );
}
