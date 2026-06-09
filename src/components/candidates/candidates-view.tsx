"use client";

import { useCallback, useEffect, useState } from "react";
import { LayoutGrid, List, Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CandidateCard } from "@/components/candidates/candidate-card";
import { CandidateDrawer } from "@/components/candidates/candidate-drawer";
import { EmptyState } from "@/components/candidates/empty-state";
import { StatusBadge } from "@/components/candidates/status-badge";
import type { Candidate } from "@/types/candidate";

export function CandidatesView() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"cards" | "table">("cards");
  const [selected, setSelected] = useState<Candidate | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [query, setQuery] = useState("");
  const [skill, setSkill] = useState("");
  const [minYears, setMinYears] = useState("");
  const [location, setLocation] = useState("");

  const fetchCandidates = useCallback(async () => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (skill) params.set("skill", skill);
    if (minYears) params.set("minYears", minYears);
    if (location) params.set("location", location);

    const res = await fetch(`/api/candidates?${params}`);
    const data = await res.json();
    setCandidates(data.candidates ?? []);
    setLoading(false);
  }, [query, skill, minYears, location]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(fetchCandidates, 300);
    return () => clearTimeout(timer);
  }, [fetchCandidates]);

  const openCandidate = (c: Candidate) => {
    setSelected(c);
    setDrawerOpen(true);
  };

  const hasFilters = query || skill || minYears || location;
  const showEmptyResults = !loading && candidates.length === 0 && hasFilters;
  const showNoCandidates = !loading && candidates.length === 0 && !hasFilters;

  const clearFilters = () => {
    setQuery("");
    setSkill("");
    setMinYears("");
    setLocation("");
  };

  return (
    <div className="space-y-6">
      <Card className="surface-card">
        <CardContent className="space-y-4 p-5">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <SlidersHorizontal className="h-4 w-4" />
            Search & filters
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search skills, title, location..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-10 bg-background pl-9"
              />
            </div>
            <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3">
              <Input
                placeholder="Filter by skill"
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                className="h-10 bg-background"
              />
              <Input
                placeholder="Min years"
                type="number"
                min={0}
                value={minYears}
                onChange={(e) => setMinYears(e.target.value)}
                className="h-10 bg-background"
              />
              <Input
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-10 bg-background"
              />
            </div>
            <div className="flex items-center gap-2">
              {hasFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear
                </Button>
              )}
              <div className="flex gap-1 rounded-lg border border-border/60 bg-muted/40 p-1">
                <Button
                  variant={view === "cards" ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setView("cards")}
                  aria-label="Card view"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={view === "table" ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setView("table")}
                  aria-label="Table view"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {!loading && candidates.length > 0 && (
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">{candidates.length}</span>{" "}
          candidate{candidates.length !== 1 ? "s" : ""}
        </p>
      )}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-52 rounded-xl" />
          ))}
        </div>
      ) : showNoCandidates ? (
        <EmptyState variant="no-candidates" />
      ) : showEmptyResults ? (
        <EmptyState variant="no-results" />
      ) : view === "cards" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {candidates.map((c) => (
            <CandidateCard
              key={c.id}
              candidate={c}
              onClick={() => openCandidate(c)}
            />
          ))}
        </div>
      ) : (
        <div className="surface-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead>Name</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Skills</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {candidates.map((c) => (
                <TableRow
                  key={c.id}
                  className="cursor-pointer"
                  onClick={() => openCandidate(c)}
                >
                  <TableCell className="font-medium">
                    {c.name ?? c.original_filename}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {c.recent_job_title ?? "—"}
                  </TableCell>
                  <TableCell>
                    {c.years_experience != null
                      ? `${c.years_experience} yrs`
                      : "—"}
                  </TableCell>
                  <TableCell>{c.location ?? "—"}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-muted-foreground">
                    {(c.skills ?? []).slice(0, 4).join(" · ")}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={c.processing_status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <CandidateDrawer
        candidate={selected}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  );
}
