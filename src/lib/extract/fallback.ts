import type { ContactDetails } from "@/lib/extract/contact";
import type { AIExtractionResult } from "@/types/candidate";

export function extractResumeDataFallback(
  scrubbedText: string,
  contact: ContactDetails,
): AIExtractionResult {
  const lines = scrubbedText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const sectionIndex = (pattern: RegExp) =>
    lines.findIndex((line) => pattern.test(line));

  const skillsIdx = sectionIndex(/^skills?$/i);
  let skills: string[] = [];
  if (skillsIdx >= 0) {
    const skillLine = lines[skillsIdx + 1] ?? "";
    skills = skillLine
      .split(/[,;|•·]/)
      .map((s) => s.trim().toLowerCase())
      .filter((s) => s.length > 1 && s.length < 40);
  }

  const yearsMatch = scrubbedText.match(
    /(\d+)\+?\s*(?:years?|yrs?)(?:\s+of)?\s+experience/i,
  );
  const years_experience = yearsMatch ? Number(yearsMatch[1]) : 0;

  const pipeLine = lines.find((line) => line.includes("|"));
  let location = "Unknown";
  if (pipeLine) {
    const parts = pipeLine.split("|").map((p) => p.trim());
    const last = parts[parts.length - 1];
    if (last && !last.includes("[PHONE]") && !last.includes("[EMAIL]")) {
      location = last;
    }
  }

  let recent_job_title = "Unknown";
  const nameLine = contact.name ?? lines[0];
  const nameIdx = lines.findIndex((line) => line === nameLine);
  if (nameIdx >= 0 && lines[nameIdx + 1]) {
    const candidate = lines[nameIdx + 1];
    if (!/^(skills?|experience|education|professional)/i.test(candidate)) {
      recent_job_title = candidate;
    }
  }

  const summaryIdx = sectionIndex(/professional summary/i);
  const resume_summary =
    summaryIdx >= 0 ? (lines[summaryIdx + 1] ?? "").slice(0, 300) : "";

  const experienceIdx = sectionIndex(/^experience$/i);
  if (recent_job_title === "Unknown" && experienceIdx >= 0) {
    const roleLine = lines[experienceIdx + 1];
    if (roleLine) {
      recent_job_title = roleLine.split("—")[0]?.split("(")[0]?.trim() || roleLine;
    }
  }

  return {
    skills: skills.slice(0, 15),
    years_experience,
    recent_job_title,
    location,
    resume_summary: resume_summary || `Profile extracted from ${nameLine ?? "resume"}.`,
  };
}
