import { NextResponse } from "next/server";
import { filterCandidates, getAllCandidates } from "@/lib/search/candidates";
import type { CandidateFilters } from "@/types/candidate";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filters: CandidateFilters = {
      query: searchParams.get("q") ?? undefined,
      skill: searchParams.get("skill") ?? undefined,
      minYears: searchParams.get("minYears")
        ? Number(searchParams.get("minYears"))
        : undefined,
      location: searchParams.get("location") ?? undefined,
    };

    const includeAll = searchParams.get("all") === "true";
    const all = await getAllCandidates();
    const candidates = includeAll ? all : filterCandidates(all, filters);

    return NextResponse.json({ candidates, total: candidates.length });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
