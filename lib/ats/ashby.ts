// lib/ats/ashby.ts
import { sanitizeJobDescription } from "./sanitizer";
import { NormalizedAtsJob } from "./greenhouse";

export async function fetchAshbyJobs(boardName: string): Promise<NormalizedAtsJob[]> {
  const url = `https://api.ashbyhq.com/posting-api/job-board/${encodeURIComponent(boardName)}?includeCompensation=true`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "RoleNest-Bot/1.0 (+https://rolenest.co; hello@rolenest.co)",
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok) {
    throw new Error(`Ashby API responded with HTTP ${res.status}: ${res.statusText}`);
  }

  const data = await res.json();
  const jobs = data.jobs || [];

  return jobs
    .filter((j: any) => j.isListed !== false) // Skip unlisted roles (Section 11.1)
    .map((j: any): NormalizedAtsJob => {
      const loc = j.location || "";
      const isRemote =
        Boolean(j.isRemote) ||
        j.workplaceType?.toLowerCase() === "remote" ||
        loc.toLowerCase().includes("remote");

      let employmentType: NormalizedAtsJob["employmentType"] = "FULL_TIME";
      const empType = j.employmentType?.toLowerCase() || "";
      if (empType.includes("contract")) employmentType = "CONTRACT";
      else if (empType.includes("part")) employmentType = "PART_TIME";
      else if (empType.includes("intern")) employmentType = "INTERNSHIP";

      let salaryMin: number | undefined;
      let salaryMax: number | undefined;
      let salaryCurrency: string | undefined;

      if (j.compensation?.compensationTierSummary) {
        const comp = j.compensation.compensationTierSummary;
        salaryMin = comp.min;
        salaryMax = comp.max;
        salaryCurrency = comp.currency || "USD";
      }

      return {
        sourceJobId: String(j.id),
        title: j.title?.trim() || "Untitled Role",
        descriptionHtml: sanitizeJobDescription(j.descriptionHtml || ""),
        applyUrl: j.applyUrl || j.jobUrl || "",
        locationText: loc,
        isRemote,
        employmentType,
        salaryMin,
        salaryMax,
        salaryCurrency,
        salaryPeriod: "YEAR",
        publishedAt: j.publishedAt ? new Date(j.publishedAt) : new Date(),
      };
    });
}
