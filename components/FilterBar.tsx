// components/FilterBar.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useState, useTransition } from "react";
import { NICHE } from "@/config/niche";

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [q, setQ] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [region, setRegion] = useState(searchParams.get("region") || "");
  const [seniority, setSeniority] = useState(searchParams.get("seniority") || "");
  const [type, setType] = useState(searchParams.get("type") || "");
  const [hasSalary, setHasSalary] = useState(searchParams.get("salary") === "true");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const applyFilters = (overrides?: Record<string, string | boolean>) => {
    const params = new URLSearchParams(searchParams.toString());

    const values = {
      q,
      category,
      region,
      seniority,
      type,
      salary: hasSalary,
      ...overrides,
    };

    if (values.q) params.set("q", String(values.q));
    else params.delete("q");

    if (values.category) params.set("category", String(values.category));
    else params.delete("category");

    if (values.region) params.set("region", String(values.region));
    else params.delete("region");

    if (values.seniority) params.set("seniority", String(values.seniority));
    else params.delete("seniority");

    if (values.type) params.set("type", String(values.type));
    else params.delete("type");

    if (values.salary) params.set("salary", "true");
    else params.delete("salary");

    params.set("page", "1");

    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });
  };

  const clearFilters = () => {
    setQ("");
    setCategory("");
    setRegion("");
    setSeniority("");
    setType("");
    setHasSalary(false);
    startTransition(() => {
      router.push("/");
    });
  };

  const hasActiveFilters = Boolean(q || category || region || seniority || type || hasSalary);

  return (
    <div className="w-full space-y-3">
      {/* Search Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          applyFilters();
        }}
        className="flex gap-2"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by job title, skill, keyword, or company..."
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          />
          {q && (
            <button
              type="button"
              onClick={() => {
                setQ("");
                applyFilters({ q: "" });
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all"
        >
          {isPending ? "Searching..." : "Search"}
        </button>

        <button
          type="button"
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-3 text-sm font-medium transition-colors sm:hidden ${
            hasActiveFilters
              ? "border-blue-600 text-blue-600 bg-blue-50 dark:bg-blue-950/40"
              : "border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filters</span>
        </button>
      </form>

      {/* Filter Select Controls (always visible on desktop, toggleable on mobile) */}
      <div
        className={`grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-5 ${
          isFiltersOpen ? "block" : "hidden sm:grid"
        }`}
      >
        {/* Category */}
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            applyFilters({ category: e.target.value });
          }}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm focus:border-blue-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
        >
          <option value="">All Categories</option>
          {NICHE.categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Region */}
        <select
          value={region}
          onChange={(e) => {
            setRegion(e.target.value);
            applyFilters({ region: e.target.value });
          }}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm focus:border-blue-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
        >
          <option value="">All Locations</option>
          <option value="Worldwide">Worldwide / Anywhere</option>
          <option value="US">United States</option>
          <option value="EU">Europe</option>
          <option value="India">India</option>
          <option value="APAC">Asia-Pacific</option>
          <option value="Canada">Canada</option>
        </select>

        {/* Seniority */}
        <select
          value={seniority}
          onChange={(e) => {
            setSeniority(e.target.value);
            applyFilters({ seniority: e.target.value });
          }}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm focus:border-blue-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
        >
          <option value="">All Levels</option>
          {NICHE.seniorityLevels.map((lvl) => (
            <option key={lvl} value={lvl}>
              {lvl}
            </option>
          ))}
        </select>

        {/* Employment Type */}
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            applyFilters({ type: e.target.value });
          }}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm focus:border-blue-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
        >
          <option value="">All Types</option>
          <option value="FULL_TIME">Full-time</option>
          <option value="PART_TIME">Part-time</option>
          <option value="CONTRACT">Contract</option>
          <option value="INTERNSHIP">Internship</option>
        </select>

        {/* Salary Toggle */}
        <label className="col-span-2 sm:col-span-4 lg:col-span-1 flex items-center justify-between sm:justify-start gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm cursor-pointer dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          <span>Salary Specified</span>
          <input
            type="checkbox"
            checked={hasSalary}
            onChange={(e) => {
              setHasSalary(e.target.checked);
              applyFilters({ salary: e.target.checked });
            }}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
        </label>
      </div>

      {/* Active Filter Badges */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 pt-1 text-xs text-slate-500">
          <span>Active filters:</span>
          {category && (
            <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              {category}
            </span>
          )}
          {region && (
            <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              Region: {region}
            </span>
          )}
          {seniority && (
            <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              Level: {seniority}
            </span>
          )}
          {hasSalary && (
            <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              With Salary
            </span>
          )}
          <button
            onClick={clearFilters}
            className="ml-auto text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
