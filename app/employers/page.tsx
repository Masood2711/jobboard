// app/employers/page.tsx
import Link from "next/link";
import { PRICING } from "@/config/pricing";
import { SITE } from "@/config/site";
import { CheckCircle2, Sparkles, PlusCircle, HelpCircle, Building2 } from "lucide-react";

const FAQS = [
  {
    q: "How long does my job stay live?",
    a: "Standard and Featured job listings remain live for 30 consecutive days from publication. You receive reminder emails 5 days before expiration with an easy one-click renewal option.",
  },
  {
    q: "Do I need to create an employer account?",
    a: "No! We believe in low friction. When you post a role, we generate a private secret management link and send it directly to your work email. You can edit, upgrade, or close the listing at any time without remembering passwords.",
  },
  {
    q: "Can I edit my job after publishing?",
    a: "Yes. Using your private management link, you can modify the title, description, requirements, or apply link instantly at zero extra cost.",
  },
  {
    q: "How will candidates apply?",
    a: "Candidates apply directly on your company careers site, Greenhouse, Ashby, Lever, or via your custom recruiting email. We never gate candidates or collect resumes.",
  },
  {
    q: "Do you show salary ranges?",
    a: "Yes. Jobs that disclose transparent salary ranges get significantly more qualified candidate click-throughs. We encourage all employers to include compensation ranges.",
  },
  {
    q: "Can I get a tax invoice and receipt?",
    a: "Immediately upon payment confirmation, an itemized PDF receipt and tax invoice is available in your private management dashboard and emailed to your billing address.",
  },
  {
    q: "What is your refund policy?",
    a: "If our moderation team rejects your listing during review because it violates guidelines or job criteria, you will receive an automatic 100% full refund.",
  },
];

export default function EmployersPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
          Targeted Recruiting
        </span>
        <h1 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white">
          Hire Top Remote Tech & Digital Talent
        </h1>
        <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
          Skip generic job boards with thousands of unqualified resumes. Connect directly with vetted software engineers, designers, product managers, AI practitioners, and tech professionals worldwide.
        </p>

        {/* Employer Portal Access Callout */}
        <div className="mt-6 flex items-center justify-center">
          <Link
            href="/employers/login"
            className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50/80 px-4 py-2.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-900/60 transition-colors shadow-xs"
          >
            <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span>Already posted or have a membership? <strong>Log in to Employer Dashboard →</strong></span>
          </Link>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 max-w-4xl mx-auto">
        {/* Standard */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {PRICING.standard.title}
            </h2>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                ${PRICING.standard.amount}
              </span>
              <span className="text-xs text-slate-500">/ 30 days</span>
            </div>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
              Essential placement for hiring teams and founders looking to fill tech roles quickly.
            </p>

            <ul className="mt-6 space-y-3 text-xs text-slate-600 dark:text-slate-300">
              {PRICING.standard.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8">
            <Link
              href="/post-a-job"
              className="inline-flex items-center justify-center gap-1.5 w-full rounded-xl border border-slate-200 bg-white py-3 text-xs font-semibold text-slate-800 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 transition-colors"
            >
              <PlusCircle className="h-4 w-4" />
              Post Standard Role ($149)
            </Link>
          </div>
        </div>

        {/* Featured */}
        <div className="relative rounded-2xl border-2 border-amber-400 bg-gradient-to-b from-amber-50/40 to-white p-8 shadow-md dark:border-amber-600 dark:from-slate-900 dark:to-slate-900 flex flex-col justify-between">
          <span className="absolute -top-3 right-6 rounded-full bg-amber-500 px-3 py-1 text-[11px] font-bold text-white shadow-sm">
            {PRICING.featured.badge}
          </span>

          <div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-amber-600" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {PRICING.featured.title}
              </h2>
            </div>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                ${PRICING.featured.amount}
              </span>
              <span className="text-xs text-slate-500">/ 30 days</span>
            </div>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
              Maximum exposure with pinned top placement and inclusion in our subscriber newsletter.
            </p>

            <ul className="mt-6 space-y-3 text-xs text-slate-600 dark:text-slate-300">
              {PRICING.featured.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8">
            <Link
              href="/post-a-job"
              className="inline-flex items-center justify-center gap-1.5 w-full rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all"
            >
              <Sparkles className="h-4 w-4" />
              Post Featured Role ($249)
            </Link>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                {faq.q}
              </h3>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
