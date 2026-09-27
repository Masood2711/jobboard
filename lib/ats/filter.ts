// lib/ats/filter.ts
import { NICHE } from "@/config/niche";

export interface NicheMatchResult {
  matches: boolean;
  category?: string;
  seniority?: string;
}

/**
 * Checks if a title or job text matches target job categories
 * Returns { matches: boolean, category?: string, seniority?: string }
 */
export function matchNicheJob(title: string, content = ""): NicheMatchResult {
  const combined = `${title} ${content}`.toLowerCase();
  const lowerTitle = title.toLowerCase();

  // Check exclude keywords first (e.g. security guard, physical security, bouncer)
  for (const ex of NICHE.excludeKeywords) {
    if (combined.includes(ex.toLowerCase())) {
      return { matches: false };
    }
  }

  // Check include keywords in title or content
  let matchedKeyword = false;
  for (const kw of NICHE.includeKeywords) {
    if (combined.includes(kw.toLowerCase())) {
      matchedKeyword = true;
      break;
    }
  }

  if (!matchedKeyword) {
    return { matches: false };
  }

  // Assign one category from NICHE.categories by keyword rules
  let assignedCategory: string = NICHE.categories[0] || "Engineering";

  if (combined.includes("ai") || combined.includes("machine learning") || combined.includes("data scientist") || combined.includes("deep learning") || combined.includes("llm") || combined.includes("nlp") || combined.includes("data engineer")) {
    assignedCategory = "AI & Data";
  } else if (combined.includes("design") || combined.includes("ui/ux") || combined.includes("ux designer") || combined.includes("product designer")) {
    assignedCategory = "Design & UX";
  } else if (combined.includes("product manager") || combined.includes("product management") || combined.includes("head of product")) {
    assignedCategory = "Product Management";
  } else if (combined.includes("marketing") || combined.includes("growth") || combined.includes("seo") || combined.includes("content")) {
    assignedCategory = "Marketing & Growth";
  } else if (combined.includes("sales") || combined.includes("account executive") || combined.includes("bizdev") || combined.includes("business development")) {
    assignedCategory = "Sales & BizDev";
  } else if (combined.includes("devops") || combined.includes("sre") || combined.includes("cloud") || combined.includes("kubernetes") || combined.includes("infrastructure") || combined.includes("platform engineer")) {
    assignedCategory = "DevOps & Cloud";
  } else if (combined.includes("security") || combined.includes("soc") || combined.includes("infosec") || combined.includes("cyber") || combined.includes("appsec") || combined.includes("pentest")) {
    assignedCategory = "Cybersecurity";
  } else if (combined.includes("customer support") || combined.includes("customer success") || combined.includes("support specialist")) {
    assignedCategory = "Customer Support";
  } else if (combined.includes("finance") || combined.includes("accounting") || combined.includes("recruiter") || combined.includes("talent") || combined.includes("people") || combined.includes("human resources")) {
    assignedCategory = "Finance & People";
  } else {
    assignedCategory = "Engineering";
  }

  // Detect seniority
  let seniority: string | undefined = undefined;
  for (const lvl of NICHE.seniorityLevels) {
    if (lowerTitle.includes(lvl.toLowerCase())) {
      seniority = lvl;
      break;
    }
  }

  return {
    matches: true,
    category: assignedCategory,
    seniority,
  };
}
