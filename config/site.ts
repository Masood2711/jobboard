// config/site.ts
export const SITE = {
  name: "NicheJobs",
  domain: "nichejobs.work",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  description: "The premier board for verified jobs, careers, and opportunities worldwide. Connect top talent with leading companies.",
  supportEmail: "hello@nichejobs.work",
  adminEmails: (process.env.ADMIN_EMAILS || "owner@example.com,admin@nichejobs.work")
    .split(",")
    .map((e) => e.trim().toLowerCase()),
  currencySymbol: "$",
  logoText: "NicheJobs",
  badgeText: "Jobs & Careers",
  navLinks: [
    { label: "Jobs", href: "/" },
    { label: "Post a Job", href: "/post-a-job" },
    { label: "Companies", href: "/companies" },
    { label: "Subscribe", href: "/subscribe" }
  ],
  footerLinks: [
    { label: "About", href: "/about" },
    { label: "Companies", href: "/companies" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Takedown Request", href: "/takedown" },
    { label: "Contact", href: "/contact" }
  ]
} as const;
