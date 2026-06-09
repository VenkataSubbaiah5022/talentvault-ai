import { Badge } from "@/components/ui/badge";
import type { ProcessingStatus } from "@/types/candidate";
import { cn } from "@/lib/utils";

const config: Record<
  ProcessingStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  processing: {
    label: "Processing",
    className: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  completed: {
    label: "Completed",
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  failed: {
    label: "Failed",
    className: "bg-red-500/10 text-red-600 dark:text-red-400",
  },
};

export function StatusBadge({ status }: { status: ProcessingStatus }) {
  const { label, className } = config[status];
  return (
    <Badge variant="secondary" className={cn("font-medium", className)}>
      {label}
    </Badge>
  );
}
