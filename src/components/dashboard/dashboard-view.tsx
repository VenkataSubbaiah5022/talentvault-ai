"use client";

import { useCallback, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHero } from "@/components/dashboard/dashboard-hero";
import { MetricCards } from "@/components/dashboard/metric-cards";
import { TalentDistribution } from "@/components/dashboard/talent-distribution";
import { ExperienceDonut } from "@/components/dashboard/experience-donut";
import { TopSkillsPanel } from "@/components/dashboard/top-skills-panel";
import { RecentAdditions } from "@/components/dashboard/recent-additions";
import { AIInsightsCard } from "@/components/dashboard/ai-insights-card";
import { ProcessingPipelineCard } from "@/components/dashboard/processing-pipeline-card";
import { DashboardEmpty } from "@/components/dashboard/dashboard-empty";
import { CandidateDrawer } from "@/components/candidates/candidate-drawer";
import type { Candidate, DashboardInsights } from "@/types/candidate";

function DashboardSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-[88px] rounded-[14px]" />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[148px] rounded-[14px]" />
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-[340px] rounded-[14px]" />
        ))}
      </div>
    </div>
  );
}

export function DashboardView() {
  const [insights, setInsights] = useState<DashboardInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Candidate | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => {
        setInsights(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const openCandidate = useCallback(async (id: string) => {
    try {
      const res = await fetch("/api/candidates?all=true");
      const data = await res.json();
      const candidate = (data.candidates as Candidate[])?.find(
        (c) => c.id === id,
      );
      if (candidate) {
        setSelected(candidate);
        setDrawerOpen(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const isEmpty = insights?.pipeline.total === 0;

  return (
    <div className="mx-auto max-w-[1280px] space-y-5">
      {loading ? (
        <DashboardSkeleton />
      ) : isEmpty ? (
        <DashboardEmpty />
      ) : insights ? (
        <>
          <DashboardHero
            totalCandidates={insights.totalCandidates}
            skillsIndexed={insights.skillsIndexed}
            lastUploadAt={insights.lastUploadAt}
          />

          <MetricCards insights={insights} />

          <div className="grid gap-5 lg:grid-cols-3">
            <TalentDistribution items={insights.roleDistribution} />
            <ExperienceDonut
              bands={insights.experienceBands}
              total={insights.totalCandidates}
            />
            <TopSkillsPanel skills={insights.topSkills} />
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <RecentAdditions
              candidates={insights.recentCandidates}
              onSelect={openCandidate}
            />
            <AIInsightsCard insights={insights.aiInsights} />
            <ProcessingPipelineCard pipeline={insights.pipeline} />
          </div>
        </>
      ) : null}

      <CandidateDrawer
        candidate={selected}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  );
}
