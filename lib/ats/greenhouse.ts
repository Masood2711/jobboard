// lib/ats/greenhouse.ts
import { sanitizeJobDescription } from "./sanitizer";

export interface NormalizedAtsJob {
  sourceJobId: string;
  title: string;
  descriptionHtml: string;
  applyUrl: string;
  locationText: string;
  isRemote: boolean;
  employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  salaryPeriod?: string;
  publishedAt: Date;
}

export async function fetchGreenhouseJobs(boardToken: string): Promise<NormalizedAtsJob[]> {
  const url = `https://boards-api.greenhouse.io/v1/boards/${encodeURIComponent(boardToken)}/jobs?content=true&pay_transparency=true`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "RoleNest-Bot/1.0 (+https://rolenest.co; hello@rolenest.co)",
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(10000), // 10s timeout
  });

  if (!res.ok) {
    throw new Error(`Greenhouse API responded with HTTP ${res.status}: ${res.statusText}`);
  }

  const data = await res.json();
  const jobsList = data.jobs || [];

  return jobsList.map((j: any): NormalizedAtsJob => {
    const loc = j.location?.name || "";
    const isRemote =
      loc.toLowerCase().includes("remote") ||
      Boolean(j.offices?.some((o: any) => o.name?.toLowerCase().includes("remote")));

    let salaryMin: number | undefined;
    let salaryMax: number | undefined;
    let salaryCurrency: string | undefined;

    if (j.pay_input_ranges && j.pay_input_ranges.length > 0) {
      const p = j.pay_input_ranges[0];
      salaryMin = p.min_cents ? Math.round(p.min_cents / 100) : undefined;
      salaryMax = p.max_cents ? Math.round(p.max_cents / 100) : undefined;
      salaryCurrency = p.currency || "USD";
    }

    return {
      sourceJobId: String(j.id),
      title: j.title?.trim() || "Untitled Role",
      descriptionHtml: sanitizeJobDescription(j.content || ""),
      applyUrl: j.absolute_url || "",
      locationText: loc,
      isRemote,
      employmentType: "FULL_TIME",
      salaryMin,
      salaryMax,
      salaryCurrency,
      salaryPeriod: "YEAR",
      publishedAt: j.first_published ? new Date(j.first_published) : new Date(),
    };
  });
}
