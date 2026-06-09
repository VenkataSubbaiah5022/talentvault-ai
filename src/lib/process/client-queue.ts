// Gemini free tier: ~5 requests/min per model — stay safely under that.
const CONCURRENCY = 1;
const DELAY_BETWEEN_BATCHES_MS = 14_000;

export interface ProcessQueueResult {
  succeeded: number;
  failed: number;
}

export async function processCandidatesQueued(
  ids: string[],
): Promise<ProcessQueueResult> {
  let succeeded = 0;
  let failed = 0;

  for (let i = 0; i < ids.length; i += CONCURRENCY) {
    const chunk = ids.slice(i, i + CONCURRENCY);
    const results = await Promise.all(
      chunk.map(async (id) => {
        try {
          const res = await fetch(`/api/process/${id}`, { method: "POST" });
          return res.ok;
        } catch {
          return false;
        }
      }),
    );

    results.forEach((ok) => (ok ? succeeded++ : failed++));

    if (i + CONCURRENCY < ids.length) {
      await new Promise((r) => setTimeout(r, DELAY_BETWEEN_BATCHES_MS));
    }
  }

  return { succeeded, failed };
}
