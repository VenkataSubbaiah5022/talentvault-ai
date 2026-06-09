"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Upload, Users } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatsCards } from "@/components/dashboard/stats-cards";
import type { DashboardStats } from "@/types/candidate";

export function DashboardView() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Your talent pool at a glance — search, filter, and review candidates
          in seconds.
        </p>
      </div>

      {stats && <StatsCards stats={stats} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-border/60 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Upload className="h-5 w-5" />
              Upload resumes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Drop PDF or Word files. We extract skills and experience while
              keeping contact details private from AI.
            </p>
            <Link href="/upload" className={cn(buttonVariants(), "inline-flex")}>
              Go to upload
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-5 w-5" />
              Browse candidates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Search by skills, title, or location. Open any profile in a drawer
              for full contact and skill details.
            </p>
            <Link
              href="/candidates"
              className={cn(buttonVariants({ variant: "outline" }), "inline-flex")}
            >
              View candidates
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
