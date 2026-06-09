export function isQuotaError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("429") ||
    lower.includes("quota") ||
    lower.includes("resource_exhausted") ||
    lower.includes("too many requests") ||
    lower.includes("rate limit")
  );
}

export function parseRetryDelayMs(message: string, attempt: number): number {
  const match = message.match(/retry in (\d+(?:\.\d+)?)s/i);
  if (match) {
    return Math.ceil(parseFloat(match[1]) * 1000) + 1000;
  }
  return Math.min(60_000, 15_000 * (attempt + 1));
}

export function shortenErrorMessage(message: string): string {
  if (isQuotaError(message)) {
    if (
      message.includes("PerDay") ||
      message.toLowerCase().includes("per day")
    ) {
      return "AI daily limit reached (free tier: ~20/day)";
    }
    return "AI rate limit reached (free tier: ~5/min)";
  }
  if (message.length > 120) {
    return message.slice(0, 117) + "…";
  }
  return message;
}
