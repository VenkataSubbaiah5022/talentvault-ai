import {
  Brain,
  Lightbulb,
  MapPin,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import type { AITalentInsights } from "@/types/candidate";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import {
  IconBadge,
  InsightRowIcon,
  type IconBadgeVariant,
} from "@/components/dashboard/icon-badge";

export function AIInsightsCard({ insights }: { insights: AITalentInsights }) {
  const rows: {
    label: string;
    value: string | null;
    icon: typeof Sparkles;
    variant: IconBadgeVariant;
  }[] = [
    {
      label: "Most common skill",
      value: insights.mostCommonSkill,
      icon: Sparkles,
      variant: "violet",
    },
    {
      label: "Largest talent pool",
      value: insights.largestTalentPool,
      icon: Users,
      variant: "blue",
    },
    {
      label: "Average seniority",
      value: insights.averageSeniority,
      icon: TrendingUp,
      variant: "emerald",
    },
    {
      label: "Fastest growing location",
      value: insights.fastestGrowingLocation,
      icon: MapPin,
      variant: "orange",
    },
  ];

  return (
    <DashboardCard id="ai-insights" variant="insight">
      <div className="mb-5 flex items-center gap-3">
        <IconBadge icon={Brain} variant="indigo" size="sm" />
        <div>
          <h3 className="text-[15px] font-semibold text-[#0f172a] dark:text-foreground">
            AI Talent Insights
          </h3>
          <p className="text-[13px] text-[#64748b] dark:text-muted-foreground">
            Generated from your vault
          </p>
        </div>
      </div>

      <ul className="flex-1 space-y-2">
        {rows.map(({ label, value, icon, variant }) => (
          <li
            key={label}
            className="flex items-center justify-between gap-3 rounded-[10px] bg-white/70 px-3 py-2.5 dark:bg-white/5"
          >
            <div className="flex items-center gap-2.5">
              <InsightRowIcon icon={icon} variant={variant} />
              <span className="text-[13px] text-[#64748b]">{label}</span>
            </div>
            <span className="text-right text-[13px] font-semibold capitalize text-[#0f172a] dark:text-foreground">
              {value ?? "—"}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-4 rounded-[12px] border border-indigo-100 bg-gradient-to-r from-indigo-50 to-violet-50 p-3.5 dark:border-indigo-500/20 dark:from-indigo-950/30 dark:to-violet-950/20">
        <div className="flex gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 shadow-sm shadow-amber-500/20">
            <Lightbulb className="h-4 w-4 text-white" strokeWidth={2.25} />
          </div>
          <div>
            <p className="text-[12px] font-semibold text-indigo-900 dark:text-indigo-300">
              Recommendation
            </p>
            <p className="mt-1 text-[12px] leading-relaxed text-indigo-800/90 dark:text-indigo-200/80">
              {insights.recommendation}
            </p>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
}
