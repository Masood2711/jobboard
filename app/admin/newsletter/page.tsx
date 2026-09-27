// app/admin/newsletter/page.tsx
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import AdminNav from "@/components/AdminNav";
import AdminNewsletterClient from "@/components/AdminNewsletterClient";
import prisma from "@/lib/db";

export default async function AdminNewsletterPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  let jobs: any[] = [];
  try {
    const dbJobs = await prisma.job.findMany({
      where: { status: "LIVE" },
      include: { company: true },
      orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
      take: 12,
    });

    jobs = dbJobs.map((j) => ({
      id: j.id,
      title: j.title,
      category: j.category,
      isFeatured: j.isFeatured,
      salaryMin: j.salaryMin,
      salaryMax: j.salaryMax,
      companyName: j.company.name,
    }));
  } catch (err) {
    console.error("Failed to query newsletter jobs:", err);
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-16">
      <AdminNav adminEmail={session.email} />

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <AdminNewsletterClient jobs={jobs} />
      </div>
    </div>
  );
}
