import type { ProcessingStatus } from "@/types/candidate";

export function formatFileSize(bytes: number | null | undefined): string {
  if (bytes == null || bytes <= 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getUploadProgress(status: ProcessingStatus): number {
  switch (status) {
    case "completed":
      return 100;
    case "processing":
      return 60;
    case "failed":
      return 100;
    default:
      return 0;
  }
}

export function getProgressBarColor(status: ProcessingStatus): string {
  switch (status) {
    case "completed":
      return "bg-emerald-500";
    case "processing":
      return "bg-blue-500";
    case "failed":
      return "bg-red-500";
    default:
      return "bg-amber-400";
  }
}
