import { GraduationCap } from "lucide-react";
import type { DashboardInsights } from "@/types/candidate";
import {
  DashboardCard,
  DashboardCardHeader,
  DashboardEmptyState,
} from "@/components/dashboard/dashboard-card";

const SEGMENTS = [
  { key: "junior" as const, label: "Junior", range: "0–2 yrs", color: "#8b5cf6" },
  { key: "mid" as const, label: "Mid-Level", range: "3–5 yrs", color: "#3b82f6" },
  { key: "senior" as const, label: "Senior", range: "6+ yrs", color: "#10b981" },
];

export function ExperienceDonut({
  bands,
  total,
}: {
  bands: DashboardInsights["experienceBands"];
  total: number;
}) {
  const data = SEGMENTS.map((s) => ({
    ...s,
    count: bands[s.key],
  })).filter((d) => d.count > 0);

  const knownTotal = data.reduce((s, d) => s + d.count, 0) || 1;
  const circumference = 2 * Math.PI * 40;
  let offset = 0;

  return (
    <DashboardCard>
      <DashboardCardHeader
        title="Experience Breakdown"
        description="Seniority across your pool"
        icon={GraduationCap}
        iconVariant="blue"
      />

      {total > 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 sm:flex-row">
          <div className="relative h-[148px] w-[148px] shrink-0">
            <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#f1f5f9"
                strokeWidth="14"
              />
              {data.map((segment) => {
                const pct = segment.count / knownTotal;
                const dash = pct * circumference;
                const circle = (
                  <circle
                    key={segment.key}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={segment.color}
                    strokeWidth="14"
                    strokeDasharray={`${dash} ${circumference - dash}`}
                    strokeDashoffset={-offset}
                  />
                );
                offset += dash;
                return circle;
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[22px] font-bold text-[#0f172a] dark:text-foreground">
                {total}
              </span>
              <span className="text-[11px] text-[#94a3b8]">Total</span>
            </div>
          </div>

          <ul className="w-full flex-1 space-y-3">
            {SEGMENTS.map((segment) => {
              const count = bands[segment.key];
              const pct = Math.round((count / knownTotal) * 100);
              return (
                <li key={segment.key} className="flex items-center gap-3">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: segment.color }}
                  />
                  <div className="min-w-0 flex-1 text-[13px]">
                    <p className="font-medium text-[#0f172a] dark:text-foreground">
                      {segment.label}{" "}
                      <span className="font-normal text-[#64748b]">
                        ({segment.range})
                      </span>
                    </p>
                    <p className="text-[12px] text-[#94a3b8]">
                      {count} candidate{count !== 1 ? "s" : ""} · {pct}%
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <DashboardEmptyState>
          Experience data appears after uploads complete
        </DashboardEmptyState>
      )}
    </DashboardCard>
  );
}
