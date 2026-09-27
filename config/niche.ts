// config/niche.ts - Universal Jobs & Careers Board
export const NICHE = {
  name: "Jobs & Careers",
  headline: "Find your next career opportunity",
  subheadline: "Explore verified job openings across engineering, design, marketing, sales, product, operations, and more worldwide.",
  categories: [
    "Engineering",
    "AI & Data",
    "Design & Creative",
    "Product Management",
    "Marketing & Growth",
    "Sales & BizDev",
    "DevOps & Cloud",
    "Cybersecurity & IT",
    "Customer Support",
    "Finance, HR & People"
  ],
  includeKeywords: [
    "engineer",
    "developer",
    "software",
    "frontend",
    "backend",
    "fullstack",
    "ai",
    "machine learning",
    "data",
    "designer",
    "product",
    "marketing",
    "sales",
    "devops",
    "security",
    "analyst",
    "support",
    "manager",
    "lead",
    "specialist",
    "coordinator",
    "director",
    "executive",
    "finance",
    "accountant",
    "recruiter",
    "hr",
    "operations",
    "consultant"
  ],
  excludeKeywords: [
    "scam",
    "get rich quick",
    "pyramid scheme"
  ],
  seniorityLevels: [
    "Junior / Entry",
    "Mid",
    "Senior",
    "Lead",
    "Principal / Staff",
    "Director / VP",
    "Executive / C-Level"
  ],
  employmentTypes: [
    { value: "FULL_TIME", label: "Full-time" },
    { value: "PART_TIME", label: "Part-time" },
    { value: "CONTRACT", label: "Contract" },
    { value: "INTERNSHIP", label: "Internship" }
  ],
  regions: [
    { code: "WORLDWIDE", label: "Worldwide (Anywhere)" },
    { code: "US", label: "United States" },
    { code: "IN", label: "India" },
    { code: "EU", label: "Europe & UK" },
    { code: "APAC", label: "Asia-Pacific" },
    { code: "LATAM", label: "Latin America" },
    { code: "CA", label: "Canada" }
  ]
} as const;
