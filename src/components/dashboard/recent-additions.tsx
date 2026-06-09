"use client";

import { UserPlus } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { RecentCandidateSummary } from "@/types/candidate";
import { formatDistanceToNow } from "@/lib/utils/date";
import { getInitials } from "@/lib/utils/initials";
import {
  DashboardCard,
  DashboardCardHeader,
  DashboardEmptyState,
} from "@/components/dashboard/dashboard-card";

interface RecentAdditionsProps {
  candidates: RecentCandidateSummary[];
  onSelect: (id: string) => void;
}

export function RecentAdditions({
  candidates,
  onSelect,
}: RecentAdditionsProps) {
  return (
    <DashboardCard className="min-h-[380px]">
      <DashboardCardHeader
        title="Recent Additions"
        description="Latest talent added to your vault"
        href="/candidates"
        icon={UserPlus}
        iconVariant="emerald"
      />

      {candidates.length > 0 ? (
        <ul className="divide-y divide-[#e8ecf3] dark:divide-border">
          {candidates.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => onSelect(c.id)}
                className="flex w-full gap-3.5 py-4 text-left transition-colors hover:bg-[#f8fafc] dark:hover:bg-muted/30"
              >
                <Avatar className="h-10 w-10 ring-2 ring-white dark:ring-card">
                  <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-600 text-[12px] font-semibold text-white">
                    {getInitials(c.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[14px] font-semibold text-[#0f172a] dark:text-foreground">
                      {c.name}
                    </p>
                    <span className="shrink-0 text-[11px] text-[#94a3b8]">
                      {formatDistanceToNow(c.created_at)}
                    </span>
                  </div>
                  {c.recent_job_title && (
                    <p className="text-[13px] text-[#334155] dark:text-foreground/80">
                      {c.recent_job_title}
                    </p>
                  )}
                  <p className="text-[12px] text-[#64748b]">
                    {[c.location, c.years_experience != null && `${c.years_experience} Years Experience`]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  {c.skills.length > 0 && (
                    <p className="mt-1 text-[12px] text-[#64748b]">
                      <span className="font-medium text-[#475569]">Skills: </span>
                      {c.skills.join(" · ")}
                    </p>
                  )}
                </div>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <DashboardEmptyState>
          Recent uploads will appear here
        </DashboardEmptyState>
      )}
    </DashboardCard>
  );
}
