import type { Candidate, DashboardInsights, RankedItem } from "@/types/candidate";
import { generateAITalentInsights } from "@/lib/analytics/ai-insights";
import {
  classifyTalentRole,
  getRoleOrder,
  type TalentRole,
} from "@/lib/analytics/roles";

function rankCounts(map: Map<string, number>, limit = 6): RankedItem[] {
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }));
}

function extractCountry(location: string): string {
  const parts = location.split(",").map((p) => p.trim());
  return parts.length > 1 ? parts[parts.length - 1] : parts[0];
}

function isWithinDays(isoDate: string, days: number): boolean {
  const diff = Date.now() - new Date(isoDate).getTime();
  return diff <= days * 86_400_000;
}

export function computeDashboardInsights(
  candidates: Candidate[],
): DashboardInsights {
  const completed = candidates.filter(
    (c) => c.processing_status === "completed",
  );

  const pipeline = {
    completed: candidates.filter((c) => c.processing_status === "completed")
      .length,
    pending: candidates.filter((c) => c.processing_status === "pending").length,
    processing: candidates.filter((c) => c.processing_status === "processing")
      .length,
    failed: candidates.filter((c) => c.processing_status === "failed").length,
    total: candidates.length,
  };

  const totalCandidates = completed.length;
  const readyToHire = totalCandidates;
  const readyToHirePercent =
    pipeline.total > 0
      ? Math.round((readyToHire / pipeline.total) * 100)
      : 0;

  const withYears = completed.filter((c) => c.years_experience != null);
  const averageExperience =
    withYears.length > 0
      ? Math.round(
          (withYears.reduce((sum, c) => sum + Number(c.years_experience), 0) /
            withYears.length) *
            10,
        ) / 10
      : 0;

  const experienceBands = { junior: 0, mid: 0, senior: 0, unknown: 0 };
  for (const c of completed) {
    const years = c.years_experience;
    if (years == null) experienceBands.unknown++;
    else if (years <= 2) experienceBands.junior++;
    else if (years <= 5) experienceBands.mid++;
    else experienceBands.senior++;
  }

  const skillCounts = new Map<string, number>();
  const skillDisplay = new Map<string, string>();
  for (const c of completed) {
    for (const skill of c.skills ?? []) {
      const key = skill.toLowerCase();
      skillCounts.set(key, (skillCounts.get(key) ?? 0) + 1);
      if (!skillDisplay.has(key)) skillDisplay.set(key, skill);
    }
  }

  const topSkills = rankCounts(skillCounts, 6).map(({ label, count }) => ({
    label: skillDisplay.get(label) ?? label,
    count,
  }));

  const locationCounts = new Map<string, number>();
  const countries = new Set<string>();
  for (const c of completed) {
    if (c.location) {
      locationCounts.set(
        c.location,
        (locationCounts.get(c.location) ?? 0) + 1,
      );
      countries.add(extractCountry(c.location));
    }
  }

  const topLocations = rankCounts(locationCounts, 5);

  const roleCounts = new Map<TalentRole, number>();
  for (const role of getRoleOrder()) roleCounts.set(role, 0);
  roleCounts.set("Other", 0);

  for (const c of completed) {
    const role = classifyTalentRole(c.recent_job_title, c.skills ?? []);
    roleCounts.set(role, (roleCounts.get(role) ?? 0) + 1);
  }

  const roleDistribution: RankedItem[] = getRoleOrder()
    .map((role) => ({ label: role, count: roleCounts.get(role) ?? 0 }))
    .filter((r) => r.count > 0);

  const otherCount = roleCounts.get("Other") ?? 0;
  if (otherCount > 0) {
    roleDistribution.push({ label: "Other", count: otherCount });
  }

  const recentCandidates = completed
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, 3)
    .map((c) => ({
      id: c.id,
      name: c.name ?? c.original_filename,
      recent_job_title: c.recent_job_title,
      location: c.location,
      years_experience: c.years_experience,
      skills: (c.skills ?? []).slice(0, 4),
      created_at: c.created_at,
    }));

  const lastUploadAt =
    candidates.length > 0
      ? candidates.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        )[0].created_at
      : null;

  const candidatesThisWeek = candidates.filter((c) =>
    isWithinDays(c.created_at, 7),
  ).length;

  const aiInsights = generateAITalentInsights(
    completed,
    topSkills,
    roleDistribution,
    experienceBands,
    topLocations,
    completed
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      .slice(0, 5),
  );

  return {
    totalCandidates,
    readyToHire,
    readyToHirePercent,
    averageExperience,
    locationsCovered: locationCounts.size,
    countriesCovered: countries.size,
    candidatesThisWeek,
    skillsIndexed: skillCounts.size,
    lastUploadAt,
    pipeline,
    experienceBands,
    roleDistribution,
    topSkills,
    topLocations,
    recentCandidates,
    aiInsights,
  };
}
