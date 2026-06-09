import { NextResponse } from "next/server";
import {
  FREE_TIER_NOTICE,
  getMaxFilesForBatch,
  startOfUtcDay,
  UPLOAD_LIMITS,
} from "@/lib/upload/limits";
import { createServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const supabase = createServerClient();
    const { count, error } = await supabase
      .from("candidates")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfUtcDay());

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const usedToday = count ?? 0;
    const remainingToday = Math.max(
      0,
      UPLOAD_LIMITS.maxAiRequestsPerDay - usedToday,
    );

    return NextResponse.json({
      maxFilesPerUpload: UPLOAD_LIMITS.maxFilesPerUpload,
      maxAiRequestsPerDay: UPLOAD_LIMITS.maxAiRequestsPerDay,
      maxFileSizeMb: UPLOAD_LIMITS.maxFileSizeBytes / (1024 * 1024),
      usedToday,
      remainingToday,
      maxFilesThisUpload: getMaxFilesForBatch(usedToday),
      notice: FREE_TIER_NOTICE,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to read limits";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
