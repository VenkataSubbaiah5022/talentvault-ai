import { NextResponse } from "next/server";
import { isSupportedResumeFile } from "@/lib/extract/text";
import { createServerClient, RESUMES_BUCKET } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files.length) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const supabase = createServerClient();
    const createdIds: string[] = [];

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
    }

    if (!createdIds.length) {
      return NextResponse.json(
        { error: "No valid resume files were uploaded" },
        { status: 400 },
      );
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;

    for (const id of createdIds) {
      fetch(`${baseUrl}/api/process/${id}`, { method: "POST" }).catch(
        console.error,
      );
    }

    return NextResponse.json({ ids: createdIds });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
