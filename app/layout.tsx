// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";
import { SITE } from "@/config/site";
import { NICHE } from "@/config/niche";

export const metadata: Metadata = {
  title: `${NICHE.headline} | ${SITE.name}`,
  description: SITE.description,
  keywords: [...NICHE.includeKeywords],
  authors: [{ name: SITE.name }],
  metadataBase: new URL(SITE.url),
  openGraph: {
    title: `${NICHE.headline} | ${SITE.name}`,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${NICHE.headline} | ${SITE.name}`,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
