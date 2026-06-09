import { NextResponse } from "next/server";
import { isSupportedResumeFile } from "@/lib/extract/text";
import {
  FREE_TIER_NOTICE,
  getMaxFilesForBatch,
  startOfUtcDay,
  UPLOAD_LIMITS,
} from "@/lib/upload/limits";
import { createServerClient, RESUMES_BUCKET } from "@/lib/supabase/server";
import { ensureResumesBucket } from "@/lib/supabase/storage";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files.length) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const validFiles = files.filter((f) => isSupportedResumeFile(f.name));
    if (!validFiles.length) {
      return NextResponse.json(
        { error: "No valid resume files. Use PDF or DOCX." },
        { status: 400 },
      );
    }

    await ensureResumesBucket();

    const autoProcess = formData.get("autoProcess") !== "false";

    const supabase = createServerClient();

    const { count: todayCount, error: countError } = await supabase
      .from("candidates")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfUtcDay());

    if (countError) {
      return NextResponse.json({ error: countError.message }, { status: 500 });
    }

    const usedToday = todayCount ?? 0;
    const maxThisUpload = getMaxFilesForBatch(usedToday);

    if (maxThisUpload === 0) {
      return NextResponse.json(
        {
          error: `Daily AI limit reached (${UPLOAD_LIMITS.maxAiRequestsPerDay} resumes/day on Gemini free tier). Try again tomorrow or upgrade your API key.`,
          code: "DAILY_LIMIT",
          usedToday,
          maxPerDay: UPLOAD_LIMITS.maxAiRequestsPerDay,
        },
        { status: 429 },
      );
    }

    if (validFiles.length > maxThisUpload) {
      return NextResponse.json(
        {
          error: `You can upload at most ${maxThisUpload} file(s) right now. ${FREE_TIER_NOTICE}`,
          code: "BATCH_LIMIT",
          maxFilesPerUpload: UPLOAD_LIMITS.maxFilesPerUpload,
          maxThisUpload,
          usedToday,
          remainingToday: maxThisUpload,
        },
        { status: 400 },
      );
    }

    for (const file of validFiles) {
      if (file.size > UPLOAD_LIMITS.maxFileSizeBytes) {
        return NextResponse.json(
          {
            error: `${file.name} exceeds ${UPLOAD_LIMITS.maxFileSizeBytes / (1024 * 1024)}MB limit.`,
            code: "FILE_TOO_LARGE",
          },
          { status: 400 },
        );
      }
    }
    const createdIds: string[] = [];
    const uploadedFiles: { id: string; filename: string; size: number }[] = [];
    const uploadErrors: string[] = [];

    for (const file of validFiles) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const storagePath = `${Date.now()}-${crypto.randomUUID()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from(RESUMES_BUCKET)
        .upload(storagePath, buffer, {
          contentType: file.type || "application/octet-stream",
          upsert: false,
        });

      if (uploadError) {
        console.error("Storage upload failed:", uploadError.message);
        uploadErrors.push(`${file.name}: ${uploadError.message}`);
        continue;
      }

      const { data: row, error: insertError } = await supabase
        .from("candidates")
        .insert({
          original_filename: file.name,
          storage_path: storagePath,
          processing_status: "pending",
        })
        .select("id")
        .single();

      if (insertError || !row) {
        console.error("DB insert failed:", insertError?.message);
        continue;
      }

      createdIds.push(row.id);
      uploadedFiles.push({
        id: row.id,
        filename: file.name,
        size: buffer.length,
      });
    }

    if (!createdIds.length) {
      const bucketMissing = uploadErrors.some((e) =>
        e.toLowerCase().includes("bucket not found"),
      );
      const error = bucketMissing
        ? `Supabase Storage bucket "${RESUMES_BUCKET}" does not exist. Create it in Supabase Dashboard → Storage → New bucket (name: resumes), or run supabase/migrations/002_storage_bucket.sql`
        : uploadErrors[0] ??
          "No valid resume files were uploaded. Use PDF or DOCX.";

      return NextResponse.json({ error, details: uploadErrors }, { status: 400 });
    }

    return NextResponse.json({
      ids: createdIds,
      files: uploadedFiles,
      autoProcess,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    const status = message.includes("SUPABASE_SERVICE_ROLE_KEY") ? 503 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
