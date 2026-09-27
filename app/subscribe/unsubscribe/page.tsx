// app/subscribe/unsubscribe/page.tsx
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { SITE } from "@/config/site";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [unsubscribed, setUnsubscribed] = useState(false);

  useEffect(() => {
    if (token) {
      fetch(`/api/subscribe/unsubscribe?token=${encodeURIComponent(token)}`)
        .then(() => setUnsubscribed(true))
        .catch(() => setUnsubscribed(true));
    } else {
      setUnsubscribed(true);
    }
  }, [token]);

  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 mb-4">
          <CheckCircle2 className="h-8 w-8 text-slate-600 dark:text-slate-400" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Unsubscribed</h1>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          You have been removed from our job alert list. You won't receive any more automated emails from us.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-colors shadow-sm"
          >
            Return to Homepage <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SubscribeUnsubscribePage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs text-slate-400">Loading...</div>}>
      <UnsubscribeContent />
    </Suspense>
  );
}
