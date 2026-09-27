// app/post-a-job/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { NICHE } from "@/config/niche";
import { PRICING } from "@/config/pricing";
import { SITE } from "@/config/site";
import {
  Briefcase,
  Building2,
  CreditCard,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  MapPin,
  DollarSign,
  Clock,
  Shield,
  Eye,
} from "lucide-react";

export default function PostJobPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Job Details
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>(NICHE.categories[0] || "");
  const [locationType, setLocationType] = useState<"REMOTE" | "HYBRID" | "ONSITE">("REMOTE");
  const [employmentType, setEmploymentType] = useState("FULL_TIME");
  const [region, setRegion] = useState("Worldwide");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [salaryPeriod, setSalaryPeriod] = useState("YEAR");
  const [applyUrl, setApplyUrl] = useState("");
  const [description, setDescription] = useState("");

  // Step 2: Company Details
  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [companyLogo, setCompanyLogo] = useState("");
  const [companyDesc, setCompanyDesc] = useState("");
  const [employerEmail, setEmployerEmail] = useState("");

  // Step 3: Plan
  const [selectedPlan, setSelectedPlan] = useState<"standard" | "featured">("featured");
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [manageToken, setManageToken] = useState("");

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
  };

  const handleCreateListing = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          locationType,
          employmentType,
          region,
          salaryMin,
          salaryMax,
          salaryPeriod,
          applyUrl,
          description,
          companyName,
          companyWebsite,
          companyLogo,
          companyDesc,
          employerEmail,
          plan: selectedPlan === "featured" ? "FEATURED" : "STANDARD",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to initialize checkout");
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        setManageToken(data.editToken || "tok_demo");
        setIsCompleted(true);
      }
    } catch (err: any) {
      alert(err.message || "Failed to initialize payment checkout");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCompleted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="rounded-2xl border border-emerald-200 bg-white p-8 shadow-sm dark:border-emerald-900 dark:bg-slate-900">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 mb-4">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Job Listing Created Successfully!
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Thank you for posting on {SITE.name}. A confirmation receipt and your private management link have been generated.
          </p>

          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-left dark:border-slate-800 dark:bg-slate-800/50">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Your Secret Management Link:
            </span>
            <p className="mt-1 font-mono text-xs font-semibold text-blue-600 dark:text-blue-400 break-all">
              {SITE.url}/manage/{manageToken}
            </p>
            <p className="mt-2 text-[11px] text-slate-500">
              Use this private link anytime to update job details, review live views and apply clicks, or renew placement.
            </p>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/"
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              Return to Homepage
            </Link>
            <Link
              href={`/manage/${manageToken}`}
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              View Employer Management Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Header & Stepper */}
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Post a Role
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Reach thousands of qualified tech, remote, and digital professionals in minutes. No mandatory account setup required.
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Already posted jobs or have a monthly membership?{" "}
          <Link href="/employers/login" className="text-blue-600 hover:underline font-semibold dark:text-blue-400">
            Sign in to your Employer Dashboard →
          </Link>
        </p>

        {/* Stepper indicators */}
        <div className="mt-6 flex items-center justify-center gap-2 sm:gap-4 text-xs font-semibold">
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${
              step >= 1
                ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                : "text-slate-400"
            }`}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white text-[10px]">
              1
            </span>
            Job Details
          </div>
          <span className="text-slate-300">→</span>

          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${
              step >= 2
                ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                : "text-slate-400"
            }`}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white text-[10px]">
              2
            </span>
            Company Info
          </div>
          <span className="text-slate-300">→</span>

          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${
              step >= 3
                ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                : "text-slate-400"
            }`}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white text-[10px]">
              3
            </span>
            Plan & Checkout
          </div>
        </div>
      </div>

      {/* 2-Column Split: Form on Left, Live Preview on Right (Section 15.3 wireframe) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Form Column */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            {step === 1 && (
              <form onSubmit={handleNextStep} className="space-y-4">
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                  Step 1: Role Specification
                </h2>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Senior Software Engineer, Product Designer, AI Specialist"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    >
                      {NICHE.categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Workplace Setting *
                    </label>
                    <select
                      value={locationType}
                      onChange={(e) => setLocationType(e.target.value as any)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    >
                      <option value="REMOTE">Remote</option>
                      <option value="HYBRID">Hybrid</option>
                      <option value="ONSITE">On-site</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Employment Type *
                    </label>
                    <select
                      value={employmentType}
                      onChange={(e) => setEmploymentType(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    >
                      <option value="FULL_TIME">Full-time</option>
                      <option value="PART_TIME">Part-time</option>
                      <option value="CONTRACT">Contract</option>
                      <option value="INTERNSHIP">Internship</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Location / Region *
                  </label>
                  <input
                    type="text"
                    required
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    placeholder="e.g. Worldwide, Remote, New York, London, Bangalore"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                  <p className="mt-1 text-[11px] text-slate-400">
                    Specify city/country if on-site or hybrid, or &quot;Worldwide&quot; if remote.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Min Salary ($)
                    </label>
                    <input
                      type="number"
                      value={salaryMin}
                      onChange={(e) => setSalaryMin(e.target.value)}
                      placeholder="120000"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Max Salary ($)
                    </label>
                    <input
                      type="number"
                      value={salaryMax}
                      onChange={(e) => setSalaryMax(e.target.value)}
                      placeholder="150000"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Period
                    </label>
                    <select
                      value={salaryPeriod}
                      onChange={(e) => setSalaryPeriod(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    >
                      <option value="YEAR">per year</option>
                      <option value="MONTH">per month</option>
                      <option value="HOUR">per hour</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Direct Apply Link or Email *
                  </label>
                  <input
                    type="url"
                    required
                    value={applyUrl}
                    onChange={(e) => setApplyUrl(e.target.value)}
                    placeholder="https://company.greenhouse.io/jobs/12345"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Job Description & Responsibilities *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Outline key requirements, stack, and interview process..."
                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-3 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-98 transition-all"
                >
                  Continue to Company Details
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleNextStep} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    Step 2: Company Profile
                  </h2>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> Back
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Acme Corp"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Website URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                    placeholder="https://company.com"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Logo Image URL
                  </label>
                  <input
                    type="url"
                    value={companyLogo}
                    onChange={(e) => setCompanyLogo(e.target.value)}
                    placeholder="https://.../logo.png"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Company Headline / Short Summary
                  </label>
                  <input
                    type="text"
                    value={companyDesc}
                    onChange={(e) => setCompanyDesc(e.target.value)}
                    placeholder="e.g. Next-generation collaboration and productivity platform"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Work Email * (Used for manage link & receipts)
                  </label>
                  <input
                    type="email"
                    required
                    value={employerEmail}
                    onChange={(e) => setEmployerEmail(e.target.value)}
                    placeholder="hiring@company.com"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                  <p className="mt-1 text-[11px] text-slate-400">
                    We will send your secret edit/manage token here. We never share your email publicly.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-3 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-98 transition-all"
                >
                  Continue to Plan Selection
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    Step 3: Select Plan & Publish
                  </h2>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> Back
                  </button>
                </div>

                {/* Plan Selection Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Standard */}
                  <div
                    onClick={() => setSelectedPlan("standard")}
                    className={`cursor-pointer rounded-xl border p-4 transition-all ${
                      selectedPlan === "standard"
                        ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 ring-2 ring-blue-600"
                        : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {PRICING.standard.title}
                      </span>
                      <span className="text-base font-extrabold text-slate-900 dark:text-white">
                        ${PRICING.standard.amount}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500">
                      Standard listing live for 30 days.
                    </p>
                    <ul className="mt-3 space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                      {PRICING.standard.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Featured */}
                  <div
                    onClick={() => setSelectedPlan("featured")}
                    className={`relative cursor-pointer rounded-xl border p-4 transition-all ${
                      selectedPlan === "featured"
                        ? "border-amber-500 bg-amber-50/60 dark:bg-amber-950/30 ring-2 ring-amber-500"
                        : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900"
                    }`}
                  >
                    <span className="absolute -top-2.5 right-3 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                      {PRICING.featured.badge}
                    </span>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {PRICING.featured.title}
                      </span>
                      <span className="text-base font-extrabold text-slate-900 dark:text-white">
                        ${PRICING.featured.amount}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500">
                      Pinned at top with over 3x candidate click-throughs.
                    </p>
                    <ul className="mt-3 space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                      {PRICING.featured.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-3 w-3 text-amber-600 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Terms agreement */}
                <label className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300 cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600"
                  />
                  <span>
                    I confirm this is a genuine job opening. I agree to the{" "}
                    <Link href="/terms" className="text-blue-600 hover:underline">
                      Listing Terms
                    </Link>{" "}
                    and refund policy.
                  </span>
                </label>

                {/* Submit Checkout */}
                <button
                  type="button"
                  disabled={!agreedTerms || isSubmitting}
                  onClick={handleCreateListing}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 active:scale-98 transition-all disabled:opacity-50"
                >
                  <CreditCard className="h-4 w-4" />
                  {isSubmitting
                    ? "Redirecting to checkout..."
                    : `Pay $${selectedPlan === "featured" ? PRICING.featured.amount : PRICING.standard.amount} & Launch Listing`}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Interactive Preview Panel */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <Eye className="h-4 w-4 text-blue-600" />
              Live Interactive Preview
            </div>

            {/* Simulated Job Card */}
            <div
              className={`rounded-xl border p-4 transition-all ${
                selectedPlan === "featured"
                  ? "border-amber-300 bg-amber-50/70 shadow-sm dark:border-amber-700/60 dark:bg-amber-950/20"
                  : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-100 bg-slate-50 dark:border-slate-800">
                  {companyLogo ? (
                    <Image
                      src={companyLogo}
                      alt={companyName}
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Building2 className="h-5 w-5 text-slate-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    {selectedPlan === "featured" && (
                      <span className="inline-flex items-center gap-1 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-900 dark:bg-amber-900/60 dark:text-amber-200">
                        <Sparkles className="h-2.5 w-2.5 text-amber-600 fill-amber-600" />
                        Featured
                      </span>
                    )}
                    <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200/60 dark:border-emerald-800/60">
                      Direct
                    </span>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {companyName || "Your Company"}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[10px] text-slate-400">Just now</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {title || "Job Title"}
                  </h3>

                  <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-600 dark:bg-slate-800 dark:text-slate-300 flex items-center gap-1">
                      <MapPin className="h-2.5 w-2.5 text-slate-400" />
                      {locationType === "REMOTE" ? "Remote" : locationType === "HYBRID" ? "Hybrid" : "On-site"} ({region || "Worldwide"})
                    </span>
                    {salaryMin && salaryMax && (
                      <span className="rounded bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700 border border-emerald-200/50">
                        ${Math.round(Number(salaryMin) / 1000)}k - ${Math.round(Number(salaryMax) / 1000)}k/{salaryPeriod.toLowerCase()}
                      </span>
                    )}
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {category}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Micro preview explanation card */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900">
              <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
                How candidates find your role:
              </p>
              <ul className="space-y-1 text-[11px]">
                <li>• Displayed on front page and filtered searches</li>
                <li>• Pushed to Google Jobs with structured JobPosting JSON-LD</li>
                <li>• Candidate clicks Apply and opens your custom URL directly</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
