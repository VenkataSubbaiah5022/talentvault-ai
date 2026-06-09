"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { CandidatesPageHeader } from "@/components/candidates/candidates-page-header";
import { CandidatesToolbar } from "@/components/candidates/candidates-toolbar";
import { CandidateTableView } from "@/components/candidates/candidate-table-view";
import { CandidateDetailPanel } from "@/components/candidates/candidate-detail-panel";
import { CandidateCard } from "@/components/candidates/candidate-card";
import { EmptyState } from "@/components/candidates/empty-state";
import type { Candidate, CandidateSort } from "@/types/candidate";

export function CandidatesView() {
  const searchParams = useSearchParams();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [readyCount, setReadyCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"cards" | "table">("table");
  const [selected, setSelected] = useState<Candidate | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [sort, setSort] = useState<CandidateSort>("recent");

  const [query, setQuery] = useState("");
  const [skill, setSkill] = useState("");
  const [minYears, setMinYears] = useState("");
  const [location, setLocation] = useState("");
  const [jobTitle, setJobTitle] = useState("");

  useEffect(() => {
    setSkill(searchParams.get("skill") ?? "");
    setLocation(searchParams.get("location") ?? "");
    setQuery(searchParams.get("q") ?? "");
    const years = searchParams.get("minYears");
    setMinYears(years ?? "");
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
    const list = (data.candidates ?? []) as Candidate[];
    setCandidates(list);
    setReadyCount(data.readyCount ?? 0);
    setLoading(false);

    setSelected((prev) =>
      prev && list.some((c) => c.id === prev.id) ? prev : null,
    );
    setPage(1);
  }, [query, skill, minYears, location, jobTitle, sort]);

  const handleSelect = (candidate: Candidate) => {
    setSelected((prev) =>
      prev?.id === candidate.id ? null : candidate,
    );
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/candidates/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error ?? "Failed to remove candidate");
    }
    setSelected((prev) => (prev?.id === id ? null : prev));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    await fetchCandidates();
  };

  const handleDeleteSelected = async () => {
    const ids = Array.from(selectedIds);
    for (const id of ids) {
      const res = await fetch(`/api/candidates/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to remove candidates");
      }
    }
    setSelected(null);
    setSelectedIds(new Set());
    await fetchCandidates();
  };

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(fetchCandidates, 300);
    return () => clearTimeout(timer);
  }, [fetchCandidates]);

  const hasFilters = Boolean(query || skill || minYears || location || jobTitle);
  const showEmptyResults = !loading && candidates.length === 0 && hasFilters;
  const showNoCandidates = !loading && candidates.length === 0 && !hasFilters;

  const clearFilters = () => {
    setQuery("");
    setSkill("");
    setMinYears("");
    setLocation("");
    setJobTitle("");
  };

  return (
    <div className="-mx-7 -my-7 flex min-h-[calc(100vh)]">
      <div className="flex min-w-0 flex-1 flex-col gap-5 px-7 py-7">
        <CandidatesPageHeader />
        <CandidatesToolbar
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
          sort={sort}
          onSortChange={setSort}
          view={view}
          onViewChange={setView}
          onClearAll={clearFilters}
          hasFilters={hasFilters}
        />

        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-12 rounded-xl" />
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-lg" />
            ))}
          </div>
        ) : showNoCandidates ? (
          <EmptyState variant="no-candidates" />
        ) : showEmptyResults ? (
          <EmptyState variant="no-results" />
        ) : view === "cards" ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {candidates.map((c) => (
              <CandidateCard
                key={c.id}
                candidate={c}
                selected={selected?.id === c.id}
                onClick={() => handleSelect(c)}
              />
            ))}
          </div>
        ) : (
          <CandidateTableView
            candidates={candidates}
            total={candidates.length}
            readyCount={readyCount}
            selectedId={selected?.id ?? null}
            onSelect={handleSelect}
            selectedIds={selectedIds}
            onSelectedIdsChange={setSelectedIds}
            onDeleteSelected={handleDeleteSelected}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={setPage}
            onRowsPerPageChange={setRowsPerPage}
          />
        )}
      </div>

      {selected && !loading && (
        <CandidateDetailPanel
          candidate={selected}
          onClose={() => setSelected(null)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
