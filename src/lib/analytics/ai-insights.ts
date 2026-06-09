import type { Candidate, RankedItem } from "@/types/candidate";
import type { TalentRole } from "@/lib/analytics/roles";

export interface AITalentInsights {
  mostCommonSkill: string | null;
  largestTalentPool: string | null;
  averageSeniority: string | null;
  fastestGrowingLocation: string | null;
  recommendation: string;
}

const DEVOPS_SKILLS = [
  "devops",
  "kubernetes",
  "docker",
  "terraform",
  "aws",
  "azure",
  "gcp",
  "ci/cd",
];
const FRONTEND_SKILLS = [
  "react",
  "vue",
  "angular",
  "frontend",
  "javascript",
  "typescript",
  "next.js",
];

function dominantSeniority(bands: {
  junior: number;
  mid: number;
  senior: number;
}): string | null {
  const { junior, mid, senior } = bands;
  const max = Math.max(junior, mid, senior);
  if (max === 0) return null;
  if (max === junior) return "Junior (0–2 yrs)";
  if (max === mid) return "Mid-Level (3–5 yrs)";
  return "Senior (6+ yrs)";
}

function skillPoolStrength(
  completed: Candidate[],
  keywords: string[],
): number {
  let count = 0;
  for (const c of completed) {
    const has = (c.skills ?? []).some((s) =>
      keywords.some((k) => s.toLowerCase().includes(k)),
    );
    if (has) count++;
  }
  return count;
}

export function generateAITalentInsights(
  completed: Candidate[],
  topSkills: RankedItem[],
  roleDistribution: RankedItem[],
  experienceBands: { junior: number; mid: number; senior: number },
  topLocations: RankedItem[],
  recentCandidates: Candidate[],
): AITalentInsights {
  const mostCommonSkill = topSkills[0]?.label ?? null;

  const rolesExcludingOther = roleDistribution.filter(
    (r) => r.label !== "Other",
  );
  const largestTalentPool = rolesExcludingOther[0]?.label ?? null;

  const averageSeniority = dominantSeniority(experienceBands);

  const locationFromRecent = recentCandidates
    .map((c) => c.location)
    .filter(Boolean) as string[];
  const fastestGrowingLocation =
    locationFromRecent[0] ?? topLocations[0]?.label ?? null;

  const frontendCount = skillPoolStrength(completed, FRONTEND_SKILLS);
  const devopsCount = skillPoolStrength(completed, DEVOPS_SKILLS);

  let recommendation =
    "Upload more resumes to unlock personalized talent recommendations.";

  if (completed.length >= 3) {
    if (frontendCount >= 3 && devopsCount <= 1) {
      recommendation =
        "You have strong frontend talent but limited DevOps profiles. Consider sourcing infrastructure engineers.";
    } else if (devopsCount >= 3 && frontendCount <= 1) {
      recommendation =
        "Your vault is backend/infrastructure heavy. Add designers or frontend engineers for balanced product teams.";
    } else if (experienceBands.senior > experienceBands.junior + experienceBands.mid) {
      recommendation =
        "Your pool skews senior — great for lead roles. Add junior profiles if you're building grad pipelines.";
    } else if (experienceBands.junior > experienceBands.senior) {
      recommendation =
        "Strong junior pipeline detected. Pair with senior hires for mentorship-heavy team builds.";
    } else {
      recommendation =
        "Balanced talent mix across skills and seniority. Use search filters to narrow by role and location.";
    }
  }

  return {
    mostCommonSkill,
    largestTalentPool,
    averageSeniority,
    fastestGrowingLocation,
    recommendation,
  };
}
