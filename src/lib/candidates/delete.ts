import { getCandidateById } from "@/lib/search/candidates";
import { createServerClient, RESUMES_BUCKET } from "@/lib/supabase/server";

export async function deleteCandidate(id: string): Promise<boolean> {
  const candidate = await getCandidateById(id);
  if (!candidate) return false;

  const supabase = createServerClient();

  if (candidate.storage_path) {
    const { error: storageError } = await supabase.storage
      .from(RESUMES_BUCKET)
      .remove([candidate.storage_path]);

    if (storageError) {
      console.warn("Failed to delete resume file:", storageError.message);
    }
  }

  const { error } = await supabase.from("candidates").delete().eq("id", id);
  if (error) throw new Error(error.message);

  return true;
}
