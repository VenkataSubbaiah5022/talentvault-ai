import type {
  Candidate,
  CandidateFilters,
  ProcessingStatus,
} from "@/types/candidate";
import { createServerClient } from "@/lib/supabase/server";

function tokenizeQuery(query: string): string[] {
  return query
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);
}

function candidateMatchesToken(candidate: Candidate, token: string): boolean {
  const years = candidate.years_experience;
  if (!Number.isNaN(Number(token)) && years !== null) {
    if (years >= Number(token)) return true;
  }

  const haystack = [
    candidate.name,
    candidate.recent_job_title,
    candidate.location,
    candidate.resume_summary,
    ...(candidate.skills ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(token);
}

export function filterCandidates(
  candidates: Candidate[],
  filters: CandidateFilters,
  options?: { completedOnly?: boolean },
): Candidate[] {
  let result =
    options?.completedOnly === false
      ? [...candidates]
      : candidates.filter((c) => c.processing_status === "completed");

  if (filters.query) {
    const tokens = tokenizeQuery(filters.query);
    if (tokens.length > 0) {
      result = result.filter((c) =>
        tokens.every((token) => candidateMatchesToken(c, token)),
      );
    }
  }

  if (filters.skill) {
    const skill = filters.skill.toLowerCase();
    result = result.filter((c) =>
      (c.skills ?? []).some((s) => s.toLowerCase().includes(skill)),
    );
  }

  if (filters.minYears !== undefined && filters.minYears > 0) {
    result = result.filter(
      (c) => (c.years_experience ?? 0) >= filters.minYears!,
    );
  }

  if (filters.location) {
    const loc = filters.location.toLowerCase();
    result = result.filter((c) =>
      (c.location ?? "").toLowerCase().includes(loc),
    );
  }

  if (filters.jobTitle) {
    const title = filters.jobTitle.toLowerCase();
    result = result.filter((c) =>
      (c.recent_job_title ?? "").toLowerCase().includes(title),
    );
  }

  return result;
}

export function sortCandidates(
  candidates: Candidate[],
  sort: "recent" | "name" | "experience",
): Candidate[] {
  const sorted = [...candidates];
  switch (sort) {
    case "name":
      return sorted.sort((a, b) =>
        (a.name ?? a.original_filename).localeCompare(
          b.name ?? b.original_filename,
        ),
      );
    case "experience":
      return sorted.sort(
        (a, b) => (b.years_experience ?? 0) - (a.years_experience ?? 0),
      );
    default:
      return sorted.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
  }
}

export async function getAllCandidates(
  statuses?: ProcessingStatus[],
): Promise<Candidate[]> {
  const supabase = createServerClient();
  let query = supabase
    .from("candidates")
    .select("*")
    .order("created_at", { ascending: false });

  if (statuses?.length) {
    query = query.in("processing_status", statuses);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  return (data ?? []) as Candidate[];
}

export async function getCandidateById(id: string): Promise<Candidate | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("candidates")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as Candidate;
}
