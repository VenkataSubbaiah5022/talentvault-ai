import { MapPin, Sparkles, TrendingUp, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { DashboardStats } from "@/types/candidate";
import { cn } from "@/lib/utils";

const cards = [
  {
    key: "totalCandidates" as const,
    label: "Total Candidates",
    icon: Users,
    accent: "from-violet-500/15 to-violet-500/5 text-violet-600 dark:text-violet-400",
    format: (v: number) => String(v),
  },
  {
    key: "averageExperience" as const,
    label: "Avg Experience",
    icon: TrendingUp,
    accent: "from-blue-500/15 to-blue-500/5 text-blue-600 dark:text-blue-400",
    format: (v: number) => `${v} yrs`,
  },
  {
    key: "topSkill" as const,
    label: "Top Skill",
    icon: Sparkles,
    accent: "from-amber-500/15 to-amber-500/5 text-amber-600 dark:text-amber-400",
    format: (v: string | null) => v ?? "—",
  },
  {
    key: "topLocation" as const,
    label: "Top Location",
    icon: MapPin,
    accent: "from-emerald-500/15 to-emerald-500/5 text-emerald-600 dark:text-emerald-400",
    format: (v: string | null) => v ?? "—",
  },
];

export function StatsCards({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ key, label, icon: Icon, accent, format }) => (
        <Card key={key} className="surface-card overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">
                  {label}
                </p>
                <p className="text-3xl font-bold tracking-tight capitalize">
                  {format(stats[key] as never)}
                </p>
              </div>
              <div
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br",
                  accent,
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
