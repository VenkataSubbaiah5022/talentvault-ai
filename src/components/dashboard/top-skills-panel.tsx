import Link from "next/link";
import { Zap } from "lucide-react";
import type { RankedItem } from "@/types/candidate";
import {
  DashboardCard,
  DashboardCardHeader,
  DashboardEmptyState,
} from "@/components/dashboard/dashboard-card";
import { cn } from "@/lib/utils";

export function TopSkillsPanel({ skills }: { skills: RankedItem[] }) {
  const max = skills[0]?.count ?? 1;
  const chips = skills.slice(0, 4);
  const moreCount = Math.max(0, skills.length - 4);

  return (
    <DashboardCard>
      <DashboardCardHeader
        title="Top Skills"
        description="Most common in your vault"
        href="/candidates"
        icon={Zap}
        iconVariant="amber"
      />

      {skills.length > 0 ? (
        <>
          <ul className="flex-1 space-y-3.5">
            {skills.map((skill) => (
              <li key={skill.label}>
                <Link
                  href={`/candidates?skill=${encodeURIComponent(skill.label)}`}
                  className="group block space-y-1.5"
                >
                  <div className="flex justify-between text-[13px]">
                    <span className="font-medium capitalize text-[#0f172a] group-hover:text-indigo-600 dark:text-foreground">
                      {skill.label}
                    </span>
                    <span className="tabular-nums text-[#64748b]">
                      {skill.count}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-[#f1f5f9] dark:bg-muted">
                    <div
                      className="h-full rounded-full bg-[#6366f1]"
                      style={{ width: `${(skill.count / max) * 100}%` }}
                    />
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-wrap gap-2 border-t border-[#e8ecf3] pt-4 dark:border-border">
            {chips.map((skill) => (
              <Link
                key={skill.label}
                href={`/candidates?skill=${encodeURIComponent(skill.label)}`}
                className={cn(
                  "rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-[12px] font-medium text-indigo-700",
                  "transition-colors hover:bg-indigo-100 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300",
                )}
              >
                {skill.label}
              </Link>
            ))}
            {moreCount > 0 && (
              <Link
                href="/candidates"
                className="rounded-full border border-[#e8ecf3] px-3 py-1 text-[12px] font-medium text-[#64748b] hover:bg-[#f8fafc] dark:border-border"
              >
                +{moreCount} more
              </Link>
            )}
          </div>
        </>
      ) : (
        <DashboardEmptyState>
          Skill trends appear after processing
        </DashboardEmptyState>
      )}
    </DashboardCard>
  );
}
