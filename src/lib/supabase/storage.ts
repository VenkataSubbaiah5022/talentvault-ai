import { createServerClient, RESUMES_BUCKET } from "@/lib/supabase/server";

const BUCKET_FILE_SIZE_LIMIT = 10 * 1024 * 1024; // 10 MB

export async function ensureResumesBucket(): Promise<void> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is missing on the server. Add it in Vercel → Settings → Environment Variables (use the service_role key from Supabase → Project Settings → API, not the anon key).",
    );
  }

  const supabase = createServerClient();

  const { data: buckets, error: listError } =
    await supabase.storage.listBuckets();

  if (listError) {
    throw new Error(
      `Cannot access Supabase Storage. Check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY. Details: ${listError.message}`,
    );
  }

  const exists = buckets?.some(
    (b) => b.name === RESUMES_BUCKET || b.id === RESUMES_BUCKET,
  );

  if (exists) return;

  const { error: createError } = await supabase.storage.createBucket(
    RESUMES_BUCKET,
    {
      public: false,
      fileSizeLimit: BUCKET_FILE_SIZE_LIMIT,
    },
  );

  if (createError) {
    const alreadyExists =
      createError.message.toLowerCase().includes("already exists") ||
      createError.message.toLowerCase().includes("duplicate");

    if (!alreadyExists) {
      throw new Error(
        `Could not create Storage bucket "${RESUMES_BUCKET}". Create it manually in Supabase Dashboard → Storage → New bucket (name: resumes). Details: ${createError.message}`,
      );
    }
  }
}

export async function getStorageHealth(): Promise<{
  ok: boolean;
  bucket: string;
  bucketExists: boolean;
  hasServiceRole: boolean;
  supabaseUrl: boolean;
  buckets: string[];
  error?: string;
}> {
  const hasServiceRole = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const supabaseUrl = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

  if (!supabaseUrl) {
    return {
      ok: false,
      bucket: RESUMES_BUCKET,
      bucketExists: false,
      hasServiceRole,
      supabaseUrl,
      buckets: [],
      error: "NEXT_PUBLIC_SUPABASE_URL is not set",
    };
  }

  try {
    const supabase = createServerClient();
    const { data: buckets, error } = await supabase.storage.listBuckets();

    if (error) {
      return {
        ok: false,
        bucket: RESUMES_BUCKET,
        bucketExists: false,
        hasServiceRole,
        supabaseUrl,
        buckets: [],
        error: error.message,
      };
    }

    const names = (buckets ?? []).map((b) => b.name);
    const bucketExists = names.includes(RESUMES_BUCKET);

    return {
      ok: bucketExists && hasServiceRole,
      bucket: RESUMES_BUCKET,
      bucketExists,
      hasServiceRole,
      supabaseUrl,
      buckets: names,
    };
  } catch (err) {
    return {
      ok: false,
      bucket: RESUMES_BUCKET,
      bucketExists: false,
      hasServiceRole,
      supabaseUrl,
      buckets: [],
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
