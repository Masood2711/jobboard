// lib/seedData.ts
// Real-time data mode active: all fake placeholder datasets have been removed.

export interface SeedCompany {
  id: string;
  name: string;
  slug: string;
  websiteUrl: string;
  domain: string;
  logoUrl?: string;
  description: string;
}

export interface SeedJob {
  id: string;
  title: string;
  slug: string;
  company: SeedCompany;
  origin: "DIRECT" | "ATS" | "FEED";
  status: "LIVE" | "PENDING_REVIEW" | "EXPIRED";
  category: string;
  seniority: string;
  employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
  locationType: "REMOTE" | "HYBRID" | "ONSITE";
  eligibleRegions: string[];
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string;
  salaryPeriod: string;
  applyUrl: string;
  descriptionHtml: string;
  isFeatured: boolean;
  publishedAt: string;
  views?: number;
  applyClicks?: number;
}

export const SEED_COMPANIES: SeedCompany[] = [];
export const SEED_JOBS: SeedJob[] = [];
