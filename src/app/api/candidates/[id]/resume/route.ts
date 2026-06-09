import { NextResponse } from "next/server";
import { getCandidateById } from "@/lib/search/candidates";
import { createServerClient, RESUMES_BUCKET } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const candidate = await getCandidateById(id);
    if (!candidate?.storage_path) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    const supabase = createServerClient();
    const { data, error } = await supabase.storage
      .from(RESUMES_BUCKET)
      .createSignedUrl(candidate.storage_path, 60);

    if (error || !data?.signedUrl) {
      return NextResponse.json(
        { error: error?.message ?? "Failed to generate download URL" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      url: data.signedUrl,
      filename: candidate.original_filename,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Download failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
