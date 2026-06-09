import { Briefcase, CheckCircle2, MapPin, Users } from "lucide-react";
import type { DashboardInsights } from "@/types/candidate";
import { IconBadge, type IconBadgeVariant } from "@/components/dashboard/icon-badge";
import { cn } from "@/lib/utils";

export function MetricCards({ insights }: { insights: DashboardInsights }) {
  const cards: {
    label: string;
    value: string;
    sub: string;
    badge: string | null;
    badgeClass: string;
    icon: typeof Users;
    iconVariant: IconBadgeVariant;
  }[] = [
    {
      label: "Total Candidates",
      value: String(insights.totalCandidates),
      sub: "All searchable profiles",
      badge:
        insights.candidatesThisWeek > 0
          ? `↑ ${insights.candidatesThisWeek} this week`
          : null,
      badgeClass: "text-emerald-700 bg-emerald-50",
      icon: Users,
      iconVariant: "violet",
    },
    {
      label: "Ready To Hire",
      value: String(insights.readyToHire),
      sub: "Profiles ready for outreach",
      badge:
        insights.pipeline.total > 0
          ? `${insights.readyToHirePercent}% of total`
          : null,
      badgeClass: "text-emerald-700 bg-emerald-50",
      icon: CheckCircle2,
      iconVariant: "emerald",
    },
    {
      label: "Average Experience",
      value: insights.totalCandidates
        ? `${insights.averageExperience} Years`
        : "—",
      sub: "Across all candidates",
      badge: null,
      badgeClass: "",
      icon: Briefcase,
      iconVariant: "blue",
    },
    {
      label: "Locations Covered",
      value: insights.locationsCovered
        ? `${insights.locationsCovered} Cities`
        : "—",
      sub:
        insights.countriesCovered > 0
          ? `Across ${insights.countriesCovered} countr${insights.countriesCovered !== 1 ? "ies" : "y"}`
          : "Geographic spread",
      badge: null,
      badgeClass: "",
      icon: MapPin,
      iconVariant: "orange",
    },
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(
        ({ label, value, sub, badge, badgeClass, icon, iconVariant }) => (
          <div
            key={label}
            className="rounded-[14px] border border-[#e8ecf3] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-border dark:bg-card"
          >
            <div className="flex items-start justify-between">
              <IconBadge icon={icon} variant={iconVariant} size="md" />
              {badge && (
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[11px] font-medium",
                    badgeClass,
                  )}
                >
                  {badge}
                </span>
              )}
            </div>
            <p className="mt-4 text-[13px] text-[#64748b] dark:text-muted-foreground">
              {label}
            </p>
            <p className="mt-0.5 text-[28px] font-bold leading-none tracking-tight text-[#0f172a] dark:text-foreground">
              {value}
            </p>
            <p className="mt-1.5 text-[12px] text-[#94a3b8] dark:text-muted-foreground">
              {sub}
            </p>
          </div>
        ),
      )}
    </div>
  );
}
