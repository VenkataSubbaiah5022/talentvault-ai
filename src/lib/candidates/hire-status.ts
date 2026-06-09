import type { ProcessingStatus } from "@/types/candidate";

export type HireStatus = "ready" | "pipeline" | "review";

export function getHireStatus(status: ProcessingStatus): HireStatus {
  if (status === "completed") return "ready";
  if (status === "failed") return "review";
  return "pipeline";
}

export const HIRE_STATUS_CONFIG: Record<
  HireStatus,
  { label: string; dot: string; badge: string }
> = {
  ready: {
    label: "Ready to hire",
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  },
  pipeline: {
    label: "In pipeline",
    dot: "bg-blue-500",
    badge: "bg-blue-50 text-blue-700 ring-blue-600/20",
  },
  review: {
    label: "Review",
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700 ring-amber-600/20",
  },
};
