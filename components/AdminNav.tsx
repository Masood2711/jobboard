// components/AdminNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Clock,
  Briefcase,
  Building2,
  RefreshCw,
  Handshake,
  Percent,
  Megaphone,
  CreditCard,
  Mail,
  AlertTriangle,
  Sliders,
  LogOut,
} from "lucide-react";

const ADMIN_LINKS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/review", label: "Review Queue", icon: Clock },
  { href: "/admin/jobs", label: "All Jobs", icon: Briefcase },
  { href: "/admin/companies", label: "Companies", icon: Building2 },
  { href: "/admin/sources", label: "ATS Sources", icon: RefreshCw },
  { href: "/admin/partners", label: "Feed Partners", icon: Handshake },
  { href: "/admin/affiliates", label: "Affiliates", icon: Percent },
  { href: "/admin/sponsors", label: "Sponsors", icon: Megaphone },
  { href: "/admin/orders", label: "Orders", icon: CreditCard },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
  { href: "/admin/takedowns", label: "Takedowns", icon: AlertTriangle },
  { href: "/admin/settings", label: "Settings", icon: Sliders },
];

export default function AdminNav({ adminEmail }: { adminEmail: string }) {
  const pathname = usePathname();

  return (
    <div className="w-full border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/90 mb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-blue-600 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-white">
              Admin
            </span>
            <span className="text-xs text-slate-500 hidden sm:inline">
              Signed in as <strong>{adminEmail}</strong>
            </span>
          </div>

          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-red-600 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          </form>
        </div>

        {/* Admin Navigation Tabs */}
        <nav className="flex space-x-1 overflow-x-auto pb-2 scrollbar-none text-xs">
          {ADMIN_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-semibold"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
