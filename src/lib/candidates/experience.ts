import type { Candidate } from "@/types/candidate";

export interface ExperienceTimelineItem {
  title: string;
  company: string;
  period?: string;
  isCurrent?: boolean;
  highlights: string[];
}

function splitSummary(summary: string): string[] {
  return summary
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20)
    .slice(0, 3);
}

export function buildExperienceTimeline(
  candidate: Candidate,
): ExperienceTimelineItem[] {
  const items: ExperienceTimelineItem[] = [];
  const years = candidate.years_experience ?? 0;

  if (candidate.recent_job_title) {
    items.push({
      title: candidate.recent_job_title,
      company: candidate.location
        ? `Based in ${candidate.location}`
        : "Current role",
      isCurrent: true,
      highlights: candidate.resume_summary
        ? splitSummary(candidate.resume_summary)
        : [],
    });
  }

  if (years > 3) {
    items.push({
      title: "Previous experience",
      company: "Earlier roles in career",
      period: years > 6 ? `${Math.max(2, Math.floor(years / 3))} yrs` : undefined,
      highlights: [],
    });
  }

  if (years > 7) {
    items.push({
      title: "Early career",
      company: "Foundation roles",
      highlights: [],
    });
  }

  return items;
}
