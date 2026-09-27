// lib/data.ts
import prisma from "@/lib/db";

export interface FilterParams {
  q?: string;
  category?: string;
  region?: string;
  type?: string;
  seniority?: string;
  hasSalary?: boolean;
  page?: number;
  limit?: number;
}

export async function getJobs(params: FilterParams = {}) {
  const {
    q = "",
    category = "",
    region = "",
    type = "",
    seniority = "",
    hasSalary = false,
    page = 1,
    limit = 20,
  } = params;

  try {
    const where: any = {
      status: "LIVE",
    };

    if (q.trim()) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { company: { name: { contains: q, mode: "insensitive" } } },
        { category: { contains: q, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (type) {
      where.employmentType = type;
    }

    if (seniority) {
      where.seniority = seniority;
    }

    if (hasSalary) {
      where.salaryMin = { not: null };
    }

    if (region) {
      where.eligibleRegions = {
        hasSome: [region, "WORLDWIDE", "Worldwide"],
      };
    }

    const [dbJobs, totalCount] = await Promise.all([
      prisma.job.findMany({
        where,
        include: { company: true },
        orderBy: [
          { isFeatured: "desc" },
          { publishedAt: "desc" },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.job.count({ where }),
    ]);

    return {
      jobs: dbJobs.map((j) => ({
        ...j,
        publishedAt: j.publishedAt?.toISOString() || new Date().toISOString(),
        expiresAt: j.expiresAt?.toISOString() || new Date().toISOString(),
      })),
      total: totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
    };
  } catch (err) {
    console.error("Database query error in getJobs:", err);
    return {
      jobs: [],
      total: 0,
      page,
      totalPages: 0,
    };
  }
}

export async function getJobBySlug(slug: string) {
  try {
    const job = await prisma.job.findUnique({
      where: { slug },
      include: { company: true },
    });
    if (job) {
      return {
        ...job,
        publishedAt: job.publishedAt?.toISOString() || new Date().toISOString(),
        expiresAt: job.expiresAt?.toISOString() || new Date().toISOString(),
      };
    }
  } catch (err) {
    console.error("Database query error in getJobBySlug:", err);
  }
  return null;
}

export async function getSimilarJobs(jobId: string, category: string, limit = 5) {
  try {
    const similar = await prisma.job.findMany({
      where: {
        category,
        id: { not: jobId },
        status: "LIVE",
      },
      include: { company: true },
      take: limit,
      orderBy: { publishedAt: "desc" },
    });
    return similar.map((j) => ({
      ...j,
      publishedAt: j.publishedAt?.toISOString() || new Date().toISOString(),
      expiresAt: j.expiresAt?.toISOString() || new Date().toISOString(),
    }));
  } catch (err) {
    console.error("Database query error in getSimilarJobs:", err);
    return [];
  }
}

export async function getCompanyBySlug(slug: string) {
  try {
    const comp = await prisma.company.findUnique({
      where: { slug },
      include: {
        jobs: {
          where: { status: "LIVE" },
          orderBy: { publishedAt: "desc" },
        },
      },
    });
    return comp;
  } catch (err) {
    console.error("Database query error in getCompanyBySlug:", err);
    return null;
  }
}
