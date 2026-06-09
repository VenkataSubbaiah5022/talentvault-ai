import { extractResumeData } from "@/lib/ai/gemini";
import { isQuotaError } from "@/lib/ai/quota";
import { extractContactDetails } from "@/lib/extract/contact";
import { extractResumeDataFallback } from "@/lib/extract/fallback";
import { scrubPII } from "@/lib/extract/pii";
import { extractTextFromFile } from "@/lib/extract/text";
import type { AIExtractionResult } from "@/types/candidate";
import {
  createServerClient,
  RESUMES_BUCKET,
} from "@/lib/supabase/server";

export async function processCandidate(candidateId: string): Promise<void> {
  const supabase = createServerClient();

  const { data: candidate, error: fetchError } = await supabase
    .from("candidates")
    .select("*")
    .eq("id", candidateId)
    .single();

  if (fetchError || !candidate) {
    throw new Error("Candidate not found");
  }

  if (candidate.processing_status === "completed") {
    return;
  }

  if (candidate.processing_status === "processing") {
    const { data: reclaimed } = await supabase
      .from("candidates")
      .update({ processing_status: "pending", error_message: null })
      .eq("id", candidateId)
      .eq("processing_status", "processing")
      .select("id")
      .maybeSingle();

    if (!reclaimed) {
      return;
    }
  }

  const { data: claimed } = await supabase
    .from("candidates")
    .update({ processing_status: "processing", error_message: null })
    .eq("id", candidateId)
    .in("processing_status", ["pending", "failed"])
    .select("id")
    .maybeSingle();

  if (!claimed) {
    return;
  }

  try {
    if (!candidate.storage_path) {
      throw new Error("No file stored for this candidate");
    }

    const { data: fileData, error: downloadError } = await supabase.storage
      .from(RESUMES_BUCKET)
      .download(candidate.storage_path);

    if (downloadError || !fileData) {
      throw new Error(downloadError?.message ?? "Failed to download resume");
    }

    const buffer = Buffer.from(await fileData.arrayBuffer());
    const rawText = await extractTextFromFile(
      buffer,
      candidate.original_filename,
    );

    const contact = extractContactDetails(rawText);
    const scrubbedText = scrubPII(rawText);
    const aiData = await extractResumeFields(scrubbedText, contact);

    const { error: updateError } = await supabase
      .from("candidates")
      .update({
        ...contact,
        skills: aiData.skills,
        years_experience: aiData.years_experience,
        recent_job_title: aiData.recent_job_title,
        location: aiData.location,
        resume_summary: aiData.resume_summary,
        scrubbed_text: scrubbedText,
        processing_status: "completed",
        error_message: null,
      })
      .eq("id", candidateId);

    if (updateError) {
      throw new Error(updateError.message);
    }
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown processing error";

    await supabase
      .from("candidates")
      .update({
        processing_status: "failed",
        error_message: message,
      })
      .eq("id", candidateId);

    throw err;
  }
}

async function extractResumeFields(
  scrubbedText: string,
  contact: ReturnType<typeof extractContactDetails>,
): Promise<AIExtractionResult> {
  try {
    return await extractResumeData(scrubbedText);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (isQuotaError(message)) {
      return extractResumeDataFallback(scrubbedText, contact);
    }
    console.warn("Gemini extraction failed, using local fallback:", message);
    return extractResumeDataFallback(scrubbedText, contact);
  }
}
