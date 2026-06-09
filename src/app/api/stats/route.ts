import { NextResponse } from "next/server";
import { computeDashboardStats } from "@/lib/analytics/dashboard";
import { getAllCandidates } from "@/lib/search/candidates";

export const runtime = "nodejs";

export async function GET() {
  try {
    const candidates = await getAllCandidates();
    const stats = computeDashboardStats(candidates);
    return NextResponse.json(stats);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch stats";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
