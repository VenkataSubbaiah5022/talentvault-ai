import { NextResponse } from "next/server";
import { isSupportedResumeFile } from "@/lib/extract/text";
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

    await ensureResumesBucket();

    const autoProcess = formData.get("autoProcess") !== "false";

    const supabase = createServerClient();
    const createdIds: string[] = [];
    const uploadedFiles: { id: string; filename: string; size: number }[] = [];
    const uploadErrors: string[] = [];

    for (const file of files) {
      if (!isSupportedResumeFile(file.name)) {
        continue;
      }

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

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;

    if (autoProcess) {
      for (const id of createdIds) {
        fetch(`${baseUrl}/api/process/${id}`, { method: "POST" }).catch(
          console.error,
        );
      }
    }

    return NextResponse.json({ ids: createdIds, files: uploadedFiles });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    const status = message.includes("SUPABASE_SERVICE_ROLE_KEY") ? 503 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
