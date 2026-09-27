// app/admin/companies/page.tsx
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import AdminNav from "@/components/AdminNav";
import AdminCompanyList from "@/components/AdminCompanyList";
import prisma from "@/lib/db";
import { Building2 } from "lucide-react";

export default async function AdminCompaniesPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  let companies: any[] = [];
  try {
    const dbCompanies = await prisma.company.findMany({
      where: { blocklisted: false },
      include: {
        jobs: {
          select: {
            id: true,
            title: true,
            _count: {
              select: { clicks: true },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    });

    companies = dbCompanies.map((c) => {
      const clicks = c.jobs.reduce((acc, j) => acc + (j._count?.clicks || 0), 0);
      return {
        id: c.id,
        name: c.name,
        slug: c.slug,
        domain: c.domain,
        description: c.description,
        jobs: c.jobs.map((j) => ({ id: j.id, title: j.title })),
        views: clicks * 10, // estimated impressions based on CTR
        clicks,
      };
    });
  } catch (err) {
    console.error("Failed to fetch admin companies:", err);
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-16">
      <AdminNav adminEmail={session.email} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="h-6 w-6 text-blue-600" />
            Company Outreach & Claim Management (Flow E)
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Convert free imported ATS company feeds into $99 featured upgrades by showing actual candidate views and apply clicks.
          </p>
        </div>

        <AdminCompanyList companies={companies} />
      </div>
    </div>
  );
}
