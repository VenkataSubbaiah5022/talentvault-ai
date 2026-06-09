import { cn } from "@/lib/utils";
import {
  getHireStatus,
  HIRE_STATUS_CONFIG,
} from "@/lib/candidates/hire-status";
import type { ProcessingStatus } from "@/types/candidate";

interface HireStatusBadgeProps {
  status: ProcessingStatus;
  className?: string;
}

export function HireStatusBadge({ status, className }: HireStatusBadgeProps) {
  const hireStatus = getHireStatus(status);
  const config = HIRE_STATUS_CONFIG[hireStatus];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        config.badge,
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
}
