import { MapPin, Sparkles, TrendingUp, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardStats } from "@/types/candidate";

const cards = [
  {
    key: "totalCandidates" as const,
    label: "Total Candidates",
    icon: Users,
    format: (v: number) => String(v),
  },
  {
    key: "averageExperience" as const,
    label: "Avg Experience",
    icon: TrendingUp,
    format: (v: number) => `${v} yrs`,
  },
  {
    key: "topSkill" as const,
    label: "Top Skill",
    icon: Sparkles,
    format: (v: string | null) => v ?? "—",
  },
  {
    key: "topLocation" as const,
    label: "Top Location",
    icon: MapPin,
    format: (v: string | null) => v ?? "—",
  },
];

export function StatsCards({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ key, label, icon: Icon, format }) => (
        <Card key={key} className="border-border/60 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {label}
            </CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tracking-tight">
              {format(stats[key] as never)}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
