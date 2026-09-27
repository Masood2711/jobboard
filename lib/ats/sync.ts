// lib/ats/sync.ts
import crypto from "crypto";
import prisma from "@/lib/db";
import { fetchGreenhouseJobs } from "./greenhouse";
import { fetchLeverJobs } from "./lever";
import { fetchAshbyJobs } from "./ashby";
import { matchNicheJob } from "./filter";

function calculateContentHash(title: string, description: string, location: string, salary: string): string {
  return crypto.createHash("sha256").update(`${title}|${description}|${location}|${salary}`).digest("hex");
}

function generateSlug(title: string, companyName: string, shortId: string): string {
  const cleanTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const cleanComp = companyName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${cleanTitle}-${cleanComp}-${shortId}`;
}

export interface SyncReport {
  sourceId: string;
  provider: string;
  boardToken: string;
  companyName: string;
  seen: number;
  added: number;
  updated: number;
  expired: number;
  error?: string;
}

/**
 * Runs ATS nocturnal synchronization for all active company sources (Section 11.3)
 */
export async function syncAllAtsSources(): Promise<SyncReport[]> {
  const reports: SyncReport[] = [];

  let sources: any[] = [];
  try {
    sources = await prisma.atsSource.findMany({
      where: { active: true },
      include: { company: true },
    });
  } catch (err: any) {
    return [
      {
        sourceId: "all",
        provider: "NONE",
        boardToken: "NONE",
        companyName: "Database Offline",
        seen: 0,
        added: 0,
        updated: 0,
        expired: 0,
        error: "Database is not connected. Connect PostgreSQL to store live synchronized feeds.",
      },
    ];
  }

  for (const source of sources) {
    const report: SyncReport = {
      sourceId: source.id,
      provider: source.provider,
      boardToken: source.boardToken,
      companyName: source.company.name,
      seen: 0,
      added: 0,
      updated: 0,
      expired: 0,
    };

    const startTime = new Date();

    try {
      // Step 1: Fetch from provider
      let rawJobs: any[] = [];
      if (source.provider === "GREENHOUSE") {
        rawJobs = await fetchGreenhouseJobs(source.boardToken);
      } else if (source.provider === "LEVER") {
        rawJobs = await fetchLeverJobs(source.boardToken);
      } else if (source.provider === "ASHBY") {
        rawJobs = await fetchAshbyJobs(source.boardToken);
      }

      report.seen = rawJobs.length;
      const seenSourceJobIds: string[] = [];
      const now = new Date();

      for (const raw of rawJobs) {
        // Step 4: Niche filter & category classification
        const nicheMatch = matchNicheJob(raw.title, raw.descriptionHtml);
        if (!nicheMatch.matches || !nicheMatch.category) {
          continue; // Skip non-matching roles
        }

        seenSourceJobIds.push(raw.sourceJobId);

        const salaryStr = `${raw.salaryMin || ""}-${raw.salaryMax || ""}`;
        const contentHash = calculateContentHash(
          raw.title,
          raw.descriptionHtml,
          raw.locationText,
          salaryStr
        );

        // Find existing job
        const existing = await prisma.job.findUnique({
          where: {
            atsSourceId_sourceJobId: {
              atsSourceId: source.id,
              sourceJobId: raw.sourceJobId,
            },
          },
        });

        if (!existing) {
          // Add new job
          const shortId = crypto.randomBytes(3).toString("hex");
          const slug = generateSlug(raw.title, source.company.name, shortId);

          await prisma.job.create({
            data: {
              slug,
              origin: "ATS",
              status: "LIVE",
              companyId: source.companyId,
              atsSourceId: source.id,
              sourceJobId: raw.sourceJobId,
              title: raw.title,
              descriptionHtml: raw.descriptionHtml,
              category: nicheMatch.category,
              seniority: nicheMatch.seniority || null,
              employmentType: raw.employmentType,
              locationType: raw.isRemote ? "REMOTE" : "HYBRID",
              eligibleRegions: raw.isRemote ? ["Worldwide"] : [],
              locationText: raw.locationText,
              salaryMin: raw.salaryMin || null,
              salaryMax: raw.salaryMax || null,
              salaryCurrency: raw.salaryCurrency || "USD",
              salaryPeriod: raw.salaryPeriod || "YEAR",
              applyUrl: raw.applyUrl,
              contentHash,
              lastSeenAt: now,
              missedRuns: 0,
              publishedAt: raw.publishedAt,
              expiresAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
            },
          });

          report.added += 1;
        } else {
          // Update if content hash changed
          const hasChanged = existing.contentHash !== contentHash;

          await prisma.job.update({
            where: { id: existing.id },
            data: {
              title: hasChanged ? raw.title : undefined,
              descriptionHtml: hasChanged ? raw.descriptionHtml : undefined,
              contentHash,
              lastSeenAt: now,
              missedRuns: 0,
              status: existing.status === "EXPIRED" ? "LIVE" : existing.status,
            },
          });

          if (hasChanged) report.updated += 1;
        }
      }

      // Step 8: Handle missed runs & expiration (Section 11.3 Step 8)
      // Any job of this source not seen in this run increments missedRuns. >= 2 runs -> EXPIRED
      const unvisitedJobs = await prisma.job.findMany({
        where: {
          atsSourceId: source.id,
          sourceJobId: { notIn: seenSourceJobIds },
          status: "LIVE",
        },
      });

      for (const unvisited of unvisitedJobs) {
        const nextMissed = unvisited.missedRuns + 1;
        const newStatus = nextMissed >= 2 ? "EXPIRED" : "LIVE";

        await prisma.job.update({
          where: { id: unvisited.id },
          data: {
            missedRuns: nextMissed,
            status: newStatus,
          },
        });

        if (newStatus === "EXPIRED") {
          report.expired += 1;
        }
      }

      // Reset source failedRuns
      await prisma.atsSource.update({
        where: { id: source.id },
        data: {
          lastSyncAt: now,
          failedRuns: 0,
        },
      });

      // Save SyncLog
      await prisma.syncLog.create({
        data: {
          sourceId: source.id,
          startedAt: startTime,
          finishedAt: new Date(),
          seen: report.seen,
          added: report.added,
          updated: report.updated,
          expired: report.expired,
        },
      });
    } catch (err: any) {
      report.error = err.message || "Unknown sync error";

      // Increment failedRuns count
      await prisma.atsSource.update({
        where: { id: source.id },
        data: { failedRuns: { increment: 1 } },
      }).catch(() => {});

      await prisma.syncLog.create({
        data: {
          sourceId: source.id,
          startedAt: startTime,
          finishedAt: new Date(),
          seen: 0,
          added: 0,
          updated: 0,
          expired: 0,
          error: report.error,
        },
      }).catch(() => {});
    }

    reports.push(report);
  }

  return reports;
}
