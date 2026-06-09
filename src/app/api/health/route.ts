import { NextResponse } from "next/server";
import { getStorageHealth } from "@/lib/supabase/storage";

export const runtime = "nodejs";

export async function GET() {
  const health = await getStorageHealth();

  return NextResponse.json(health, { status: health.ok ? 200 : 503 });
}
