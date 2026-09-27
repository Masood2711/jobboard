// lib/ats/lever.ts
import { sanitizeJobDescription } from "./sanitizer";
import { NormalizedAtsJob } from "./greenhouse";

export async function fetchLeverJobs(company: string): Promise<NormalizedAtsJob[]> {
  const url = `https://api.lever.co/v0/postings/${encodeURIComponent(company)}?mode=json`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "NicheJobs-Bot/1.0 (+https://nichejobs.work; hello@nichejobs.work)",
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok) {
    throw new Error(`Lever API responded with HTTP ${res.status}: ${res.statusText}`);
  }

  const postings = await res.json();
  if (!Array.isArray(postings)) return [];

  return postings.map((j: any): NormalizedAtsJob => {
    const loc = j.categories?.location || "";
    const isRemote =
      j.workplaceType?.toLowerCase() === "remote" ||
      loc.toLowerCase().includes("remote");

    // Reconstruct HTML from description and lists
    let fullHtml = j.description || "";
    if (j.lists && Array.isArray(j.lists)) {
      for (const list of j.lists) {
        fullHtml += `<h4>${list.text || ""}</h4><ul>${list.content || ""}</ul>`;
      }
    }

    let employmentType: NormalizedAtsJob["employmentType"] = "FULL_TIME";
    const commitment = j.categories?.commitment?.toLowerCase() || "";
    if (commitment.includes("contract")) employmentType = "CONTRACT";
    else if (commitment.includes("part")) employmentType = "PART_TIME";
    else if (commitment.includes("intern")) employmentType = "INTERNSHIP";

    let salaryMin: number | undefined;
    let salaryMax: number | undefined;
    let salaryCurrency: string | undefined;

    if (j.salaryRange) {
      salaryMin = j.salaryRange.min;
      salaryMax = j.salaryRange.max;
      salaryCurrency = j.salaryRange.currency || "USD";
    }

    return {
      sourceJobId: String(j.id),
      title: j.text?.trim() || "Untitled Role",
      descriptionHtml: sanitizeJobDescription(fullHtml),
      applyUrl: j.applyUrl || j.hostedUrl || "",
      locationText: loc,
      isRemote,
      employmentType,
      salaryMin,
      salaryMax,
      salaryCurrency,
      salaryPeriod: "YEAR",
      publishedAt: j.createdAt ? new Date(j.createdAt) : new Date(),
    };
  });
}
