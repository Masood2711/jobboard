// config/site.ts
export const SITE = {
  name: "RoleNest",
  domain: "rolenest.co",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  description: "The home for tech and remote talent. Connect with high-growth companies hiring software engineers, product managers, designers, and digital professionals worldwide.",
  supportEmail: "hello@rolenest.co",
  adminEmails: (process.env.ADMIN_EMAILS || "owner@example.com,admin@rolenest.co")
    .split(",")
    .map((e) => e.trim().toLowerCase()),
  currencySymbol: "$",
  logoText: "RoleNest",
  badgeText: "Tech & Remote Careers",
  navLinks: [
    { label: "Jobs", href: "/" },
    { label: "Companies", href: "/companies" },
    { label: "Pricing", href: "/employers" },
    { label: "Post a Job", href: "/post-a-job" },
  ],
  footerLinks: [
    { label: "About", href: "/about" },
    { label: "Companies", href: "/companies" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Contact", href: "/contact" },
  ],
} as const;
