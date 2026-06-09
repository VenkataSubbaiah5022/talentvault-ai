"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Shield, Sparkles, Upload, Users, Zap } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/layout/page-header";
import { StatsCards } from "@/components/dashboard/stats-cards";
import type { DashboardStats } from "@/types/candidate";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Shield,
    title: "PII-safe extraction",
    description: "Contact details never reach the AI model.",
  },
  {
    icon: Sparkles,
    title: "Smart parsing",
    description: "Skills, experience, and summaries from Gemini.",
  },
  {
    icon: Zap,
    title: "Instant search",
    description: "Filter your vault by skills, location, and years.",
  },
];

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

  return (
    <div className="space-y-10">
      <PageHeader
        title="Dashboard"
        description="Your talent pool at a glance — upload resumes, track processing, and find the right people in seconds."
      />

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : (
        stats && <StatsCards stats={stats} />
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        {features.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="flex gap-4 rounded-xl border border-border/60 bg-muted/30 p-4"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">{title}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="surface-card-hover group">
          <CardContent className="space-y-5 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <Upload className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Upload resumes</h3>
              <p className="text-sm text-muted-foreground">
                Drop PDF or Word files in bulk. We extract skills and experience
                while keeping contact details private from AI.
              </p>
            </div>
            <Link
              href="/upload"
              className={cn(buttonVariants(), "inline-flex w-full sm:w-auto")}
            >
              Go to upload
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </CardContent>
        </Card>

        <Card className="surface-card-hover group">
          <CardContent className="space-y-5 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <Users className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Browse candidates</h3>
              <p className="text-sm text-muted-foreground">
                Search by skills, title, or location. Open any profile in a drawer
                for full contact and skill details.
              </p>
            </div>
            <Link
              href="/candidates"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "inline-flex w-full sm:w-auto",
              )}
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
