"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LayoutGrid, List } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchTalentHeader } from "@/components/search-talent/search-talent-header";
import { SearchTalentToolbar } from "@/components/search-talent/search-talent-toolbar";
import { TalentSearchCard } from "@/components/search-talent/talent-search-card";
import { TalentDetailDrawer } from "@/components/search-talent/talent-detail-drawer";
import { EmptyState } from "@/components/candidates/empty-state";
import { useRecruiterPreferences } from "@/hooks/use-recruiter-preferences";
import { cn } from "@/lib/utils";
import type { Candidate, CandidateSort } from "@/types/candidate";

export function SearchTalentView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [readyCount, setReadyCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [view] = useState<"cards" | "table">("cards");
  const [selected, setSelected] = useState<Candidate | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const { preferences } = useRecruiterPreferences();
  const [rowsPerPage, setRowsPerPage] = useState(preferences.rowsPerPage);
  const [sort, setSort] = useState<CandidateSort>(preferences.defaultSort);
  const [prefsApplied, setPrefsApplied] = useState(false);

  const [query, setQuery] = useState("");
  const [skill, setSkill] = useState("");
  const [minYears, setMinYears] = useState("");
  const [location, setLocation] = useState("");
  const [jobTitle, setJobTitle] = useState("");

  useEffect(() => {
    if (preferences.defaultView === "table") {
      router.replace("/candidates");
      return;
    }
    setSort(preferences.defaultSort);
    setRowsPerPage(preferences.rowsPerPage);
    setPrefsApplied(true);
  }, [preferences.defaultView, preferences.defaultSort, preferences.rowsPerPage, router]);

  useEffect(() => {
    setSkill(searchParams.get("skill") ?? "");
    setLocation(searchParams.get("location") ?? "");
    setQuery(searchParams.get("q") ?? "");
    setMinYears(searchParams.get("minYears") ?? "");
    setJobTitle(searchParams.get("jobTitle") ?? "");
  }, [searchParams]);

  const fetchCandidates = useCallback(async () => {
    const params = new URLSearchParams({ browse: "true", sort });
    if (query) params.set("q", query);
    if (skill) params.set("skill", skill);
    if (minYears) params.set("minYears", minYears);
    if (location) params.set("location", location);
    if (jobTitle) params.set("jobTitle", jobTitle);

    const res = await fetch(`/api/candidates?${params}`);
    const data = await res.json();
    let list = (data.candidates ?? []) as Candidate[];
    if (preferences.readyToHireOnly) {
      list = list.filter((c) => c.processing_status === "completed");
    }
    setCandidates(list);
    setReadyCount(
      list.filter((c) => c.processing_status === "completed").length,
    );
    setLoading(false);
    setPage(1);
  }, [
    query,
    skill,
    minYears,
    location,
    jobTitle,
    sort,
    preferences.readyToHireOnly,
  ]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(fetchCandidates, 300);
    return () => clearTimeout(timer);
  }, [fetchCandidates]);

  const hasFilters = Boolean(query || skill || minYears || location || jobTitle);
  const activeFilterCount = [skill, minYears, location, jobTitle].filter(
    Boolean,
  ).length;

  const clearFilters = () => {
    setQuery("");
    setSkill("");
    setMinYears("");
    setLocation("");
    setJobTitle("");
  };

  const openCandidate = (candidate: Candidate) => {
    setSelected(candidate);
    setDrawerOpen(true);
  };

  const toggleChecked = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const total = candidates.length;
  const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));
  const start = total === 0 ? 0 : (page - 1) * rowsPerPage + 1;
  const end = Math.min(page * rowsPerPage, total);
  const pageCandidates = candidates.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  const showEmptyResults = !loading && total === 0 && hasFilters;
  const showNoCandidates = !loading && total === 0 && !hasFilters;

  return (
    <div className="space-y-5">
      <SearchTalentHeader />

      <SearchTalentToolbar
        query={query}
        onQueryChange={setQuery}
        skill={skill}
        onSkillChange={setSkill}
        minYears={minYears}
        onMinYearsChange={setMinYears}
        location={location}
        onLocationChange={setLocation}
        jobTitle={jobTitle}
        onJobTitleChange={setJobTitle}
        onClearAll={clearFilters}
        hasFilters={hasFilters}
        activeFilterCount={activeFilterCount}
      />

      {!loading && total > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3 text-[13px]">
            <span className="font-medium text-[#0f172a] dark:text-foreground">
              {total} candidate{total !== 1 ? "s" : ""} found
            </span>
            <span className="flex items-center gap-1.5 text-[#64748b]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {readyCount} ready to hire
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-0.5">
              <button
                type="button"
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors",
                  view === "cards"
                    ? "bg-white text-[#7C3AED] shadow-sm"
                    : "text-[#64748b] hover:text-[#0f172a]",
                )}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                Card View
              </button>
              <button
                type="button"
                onClick={() => router.push("/candidates")}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors",
                  "text-[#64748b] hover:text-[#0f172a]",
                )}
              >
                <List className="h-3.5 w-3.5" />
                Table View
              </button>
            </div>

            <Select
              value={sort}
              onValueChange={(v) => setSort(v as CandidateSort)}
            >
              <SelectTrigger className="h-9 min-w-[190px] rounded-lg border-[#e2e8f0] text-[13px]">
                <span className="text-[#94a3b8]">Sort by:</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recently Added</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="experience">Experience</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

        {!prefsApplied || loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-xl" />
          ))}
        </div>
      ) : showNoCandidates ? (
        <EmptyState variant="no-candidates" />
      ) : showEmptyResults ? (
        <EmptyState variant="no-results" />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {pageCandidates.map((candidate) => (
              <TalentSearchCard
                key={candidate.id}
                candidate={candidate}
                selected={selected?.id === candidate.id && drawerOpen}
                checked={selectedIds.has(candidate.id)}
                onSelect={() => openCandidate(candidate)}
                onCheckedChange={() => toggleChecked(candidate.id)}
              />
            ))}
          </div>

          <div className="flex flex-col gap-3 rounded-xl border border-[#e8ecf4] bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-border/60 dark:bg-card">
            <p className="text-[13px] text-[#64748b]">
              Showing {start} to {end} of {total} candidate
              {total !== 1 ? "s" : ""}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      p === 1 || p === totalPages || Math.abs(p - page) <= 1,
                  )
                  .map((p, idx, arr) => {
                    const prev = arr[idx - 1];
                    const showEllipsis = prev != null && p - prev > 1;
                    return (
                      <span key={p} className="flex items-center gap-1">
                        {showEllipsis && (
                          <span className="px-1 text-[#94a3b8]">…</span>
                        )}
                        <button
                          type="button"
                          onClick={() => setPage(p)}
                          className={cn(
                            "flex h-8 min-w-8 items-center justify-center rounded-lg text-[13px] font-medium transition-colors",
                            p === page
                              ? "bg-[#7C3AED] text-white"
                              : "text-[#64748b] hover:bg-[#f1f5f9]",
                          )}
                        >
                          {p}
                        </button>
                      </span>
                    );
                  })}
              </div>

              <div className="flex items-center gap-2 text-[13px] text-[#64748b]">
                <span>Rows per page</span>
                <Select
                  value={String(rowsPerPage)}
                  onValueChange={(v) => {
                    setRowsPerPage(Number(v));
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="h-8 w-[70px] rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9">9</SelectItem>
                    <SelectItem value="12">12</SelectItem>
                    <SelectItem value="24">24</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </>
      )}

      <TalentDetailDrawer
        candidate={selected}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  );
}
