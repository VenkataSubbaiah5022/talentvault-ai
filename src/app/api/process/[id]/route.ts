import { NextResponse } from "next/server";
import { processCandidate } from "@/lib/process/resume";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    await processCandidate(id);
    return NextResponse.json({ success: true, id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Processing failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
