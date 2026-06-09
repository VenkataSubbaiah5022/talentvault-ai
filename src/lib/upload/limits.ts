/**
 * Gemini API free-tier limits (documented for assignment demo).
 * @see https://ai.google.dev/gemini-api/docs/rate-limits
 */
export const UPLOAD_LIMITS = {
  /** Max resumes per single upload — matches ~5 AI requests/minute */
  maxFilesPerUpload: 5,
  /** Max AI extractions per day on free tier */
  maxAiRequestsPerDay: 20,
  /** Max file size in bytes */
  maxFileSizeBytes: 10 * 1024 * 1024,
} as const;

export function startOfUtcDay(): string {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

export function getMaxFilesForBatch(usedToday: number): number {
  const remaining = Math.max(
    0,
    UPLOAD_LIMITS.maxAiRequestsPerDay - usedToday,
  );
  return Math.min(UPLOAD_LIMITS.maxFilesPerUpload, remaining);
}

export const FREE_TIER_NOTICE =
  "Demo uses the Google Gemini free API: up to 5 resumes per upload and 20 AI extractions per day.";
