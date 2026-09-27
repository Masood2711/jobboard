// app/admin/review/page.tsx
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import AdminNav from "@/components/AdminNav";
import AdminReviewClient from "@/components/AdminReviewClient";
import prisma from "@/lib/db";

export default async function AdminReviewPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  let pendingJobs: any[] = [];
  try {
    const dbJobs = await prisma.job.findMany({
      where: { status: "PENDING_REVIEW" },
      include: { company: true },
      orderBy: { createdAt: "desc" },
    });

    pendingJobs = dbJobs.map((j) => ({
      id: j.id,
      title: j.title,
      category: j.category,
      employerEmail: j.employerEmail,
      salaryMin: j.salaryMin,
      salaryMax: j.salaryMax,
      salaryCurrency: j.salaryCurrency,
      salaryPeriod: j.salaryPeriod,
      createdAt: j.createdAt.toISOString(),
      company: {
        name: j.company.name,
        websiteUrl: j.company.websiteUrl,
        domain: j.company.domain,
      },
    }));
  } catch (err) {
    console.error("Failed to query pending jobs:", err);
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-16">
      <AdminNav adminEmail={session.email} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <AdminReviewClient initialJobs={pendingJobs} />
      </div>
    </div>
  );
}
