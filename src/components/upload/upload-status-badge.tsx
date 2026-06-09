import { cn } from "@/lib/utils";
import type { ProcessingStatus } from "@/types/candidate";

const CONFIG: Record<
  ProcessingStatus,
  { label: string; dot: string; badge: string }
> = {
  completed: {
    label: "Completed",
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  },
  processing: {
    label: "Processing",
    dot: "bg-blue-500",
    badge: "bg-blue-50 text-blue-700 ring-blue-600/20",
  },
  pending: {
    label: "Pending",
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700 ring-amber-600/20",
  },
  failed: {
    label: "Failed",
    dot: "bg-red-500",
    badge: "bg-red-50 text-red-700 ring-red-600/20",
  },
};

export function UploadStatusBadge({ status }: { status: ProcessingStatus }) {
  const config = CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        config.badge,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
}
