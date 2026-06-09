import { Activity } from "lucide-react";
import type { DashboardInsights } from "@/types/candidate";
import {
  DashboardCard,
  DashboardCardHeader,
  DashboardEmptyState,
} from "@/components/dashboard/dashboard-card";
import { cn } from "@/lib/utils";

const segments = [
  { key: "completed" as const, label: "Completed", color: "bg-emerald-500" },
  { key: "processing" as const, label: "Processing", color: "bg-blue-500" },
  { key: "pending" as const, label: "Pending", color: "bg-amber-500" },
  { key: "failed" as const, label: "Failed", color: "bg-red-500" },
];

export function ProcessingPipelineCard({
  pipeline,
}: {
  pipeline: DashboardInsights["pipeline"];
}) {
  const total = pipeline.total || 1;

  return (
    <DashboardCard>
      <DashboardCardHeader
        title="Processing Pipeline"
        description="Resume extraction status"
        href={pipeline.failed > 0 ? "/upload" : undefined}
        linkLabel="Review failed"
        icon={Activity}
        iconVariant="cyan"
      />

      {pipeline.total > 0 ? (
        <>
          <div className="flex h-2.5 overflow-hidden rounded-full bg-[#f1f5f9] dark:bg-muted">
            {segments.map(({ key, color }) => {
              const count = pipeline[key];
              if (!count) return null;
              return (
                <div
                  key={key}
                  className={cn(color)}
                  style={{ width: `${(count / total) * 100}%` }}
                />
              );
            })}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            {segments.map(({ key, label, color }) => {
              const count = pipeline[key];
              const pct = Math.round((count / total) * 100);
              return (
                <div key={key} className="flex items-center gap-2">
                  <span className={cn("h-2 w-2 rounded-full", color)} />
                  <div className="text-[13px]">
                    <span className="text-[#64748b]">{label}</span>
                    <span className="ml-1.5 font-semibold text-[#0f172a] dark:text-foreground">
                      {count}
                    </span>
                    <span className="ml-1 text-[11px] text-[#94a3b8]">
                      ({pct}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-auto border-t border-[#e8ecf3] pt-4 text-center text-[12px] text-[#94a3b8] dark:border-border">
            Total resumes:{" "}
            <strong className="font-semibold text-[#0f172a] dark:text-foreground">
              {pipeline.total}
            </strong>
          </p>
        </>
      ) : (
        <DashboardEmptyState>No resumes in pipeline</DashboardEmptyState>
      )}
    </DashboardCard>
  );
}
