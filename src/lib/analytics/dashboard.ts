import type { Candidate, DashboardStats } from "@/types/candidate";

export function computeDashboardStats(
  candidates: Candidate[],
): DashboardStats {
  const completed = candidates.filter(
    (c) => c.processing_status === "completed",
  );

  const totalCandidates = completed.length;

  const withYears = completed.filter((c) => c.years_experience != null);
  const averageExperience =
    withYears.length > 0
      ? Math.round(
          (withYears.reduce((sum, c) => sum + Number(c.years_experience), 0) /
            withYears.length) *
            10,
        ) / 10
      : 0;

  const skillCounts = new Map<string, number>();
  for (const c of completed) {
    for (const skill of c.skills ?? []) {
      const key = skill.toLowerCase();
      skillCounts.set(key, (skillCounts.get(key) ?? 0) + 1);
    }
  }
  const topSkill =
    [...skillCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  const locationCounts = new Map<string, number>();
  for (const c of completed) {
    if (c.location) {
      locationCounts.set(
        c.location,
        (locationCounts.get(c.location) ?? 0) + 1,
      );
    }
  }
  const topLocation =
    [...locationCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  return { totalCandidates, averageExperience, topSkill, topLocation };
}
