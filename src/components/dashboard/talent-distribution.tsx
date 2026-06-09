import { PieChart } from "lucide-react";
import type { RankedItem } from "@/types/candidate";
import { ROLE_COLORS, type TalentRole } from "@/lib/analytics/roles";
import {
  DashboardCard,
  DashboardCardHeader,
  DashboardEmptyState,
} from "@/components/dashboard/dashboard-card";
import { cn } from "@/lib/utils";

export function TalentDistribution({ items }: { items: RankedItem[] }) {
  const total = items.reduce((s, i) => s + i.count, 0) || 1;
  const max = items[0]?.count ?? 1;

  return (
    <DashboardCard>
      <DashboardCardHeader
        title="Talent Distribution by Role"
        description="What talent exists in your vault"
        href="/candidates"
        icon={PieChart}
        iconVariant="pink"
      />

      {items.length > 0 ? (
        <ul className="flex-1 space-y-[18px]">
          {items.map((item) => {
            const pct = Math.round((item.count / total) * 100);
            const barColor =
              ROLE_COLORS[item.label as TalentRole] ?? "bg-slate-400";
            return (
              <li key={item.label} className="space-y-2">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="font-medium text-[#0f172a] dark:text-foreground">
                    {item.label}
                  </span>
                  <span className="tabular-nums text-[#64748b]">
                    {item.count}{" "}
                    <span className="text-[12px]">({pct}%)</span>
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#f1f5f9] dark:bg-muted">
                  <div
                    className={cn("h-full rounded-full", barColor)}
                    style={{ width: `${(item.count / max) * 100}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <DashboardEmptyState>
          Role breakdown appears after profiles are processed
        </DashboardEmptyState>
      )}
    </DashboardCard>
  );
}
