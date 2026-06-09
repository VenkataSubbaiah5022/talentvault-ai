import { NextResponse } from "next/server";
import {
  filterCandidates,
  getAllCandidates,
  sortCandidates,
} from "@/lib/search/candidates";
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
      jobTitle: searchParams.get("jobTitle") ?? undefined,
    };

    const includeAll = searchParams.get("all") === "true";
    const browse = searchParams.get("browse") === "true";
    const sort = (searchParams.get("sort") as "recent" | "name" | "experience") ?? "recent";

    const all = await getAllCandidates();
    let candidates = includeAll
      ? all
      : filterCandidates(all, filters, { completedOnly: !browse });

    if (!includeAll) {
      candidates = sortCandidates(candidates, sort);
    }

    const readyCount = candidates.filter(
      (c) => c.processing_status === "completed",
    ).length;

    return NextResponse.json({
      candidates,
      total: candidates.length,
      readyCount,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
