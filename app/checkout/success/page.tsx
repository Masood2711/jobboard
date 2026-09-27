// app/checkout/success/page.tsx
import Link from "next/link";
import { CheckCircle2, ArrowRight, ShieldCheck, Mail } from "lucide-react";
import { SITE } from "@/config/site";

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string; orderId?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const { session_id, orderId } = await searchParams;

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <div className="rounded-2xl border border-emerald-200 bg-white p-8 shadow-sm dark:border-emerald-900 dark:bg-slate-900">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 mb-4">
          <CheckCircle2 className="h-8 w-8" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Payment Confirmed!
        </h1>
        <p className="mt-2 text-xs text-slate-500">
          Order Reference: <code className="font-mono text-slate-700 dark:text-slate-300">{orderId || session_id || "ORD-2026-LIVE"}</code>
        </p>

        <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-5 text-left dark:border-slate-800 dark:bg-slate-800/40 text-xs space-y-3">
          <div className="flex items-start gap-2.5">
            <Mail className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800 dark:text-slate-200">Confirmation Email Sent</strong>
              <p className="text-[11px] text-slate-500">
                We sent your payment receipt and secret management link to your billing email.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800 dark:text-slate-200">Listing Status</strong>
              <p className="text-[11px] text-slate-500">
                Your role has moved to moderation review. First-time employer listings are reviewed within 2 hours. Returning trusted employers are published immediately!
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/"
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors inline-flex items-center gap-1.5"
          >
            Return to {SITE.name}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
