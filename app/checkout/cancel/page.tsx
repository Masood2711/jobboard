// app/checkout/cancel/page.tsx
import Link from "next/link";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";

export default function CheckoutCancelPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 mb-4">
          <XCircle className="h-8 w-8" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Checkout Cancelled
        </h1>
        <p className="mt-2 text-xs text-slate-500">
          No charges were processed. Your job posting draft has been preserved.
        </p>

        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/post-a-job"
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors inline-flex items-center gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Resume Posting
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            Cancel & Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
