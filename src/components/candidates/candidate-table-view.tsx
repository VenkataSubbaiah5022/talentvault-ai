"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { buttonVariants } from "@/components/ui/button";
import { HireStatusBadge } from "@/components/candidates/hire-status-badge";
import { exportCandidatesCsv } from "@/lib/candidates/export";
import { formatDistanceToNow } from "@/lib/utils/date";
import { getInitials } from "@/lib/utils/initials";
import { cn } from "@/lib/utils";
import type { Candidate } from "@/types/candidate";

interface CandidateTableViewProps {
  candidates: Candidate[];
  total: number;
  readyCount: number;
  selectedId: string | null;
  onSelect: (candidate: Candidate) => void;
  selectedIds: Set<string>;
  onSelectedIdsChange: (ids: Set<string>) => void;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  onDeleteSelected?: () => Promise<void>;
}

export function CandidateTableView({
  candidates,
  total,
  readyCount,
  selectedId,
  onSelect,
  selectedIds,
  onSelectedIdsChange,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onDeleteSelected,
}: CandidateTableViewProps) {
  const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));
  const start = total === 0 ? 0 : (page - 1) * rowsPerPage + 1;
  const end = Math.min(page * rowsPerPage, total);
  const pageCandidates = candidates.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  const allPageSelected =
    pageCandidates.length > 0 &&
    pageCandidates.every((c) => selectedIds.has(c.id));

  const toggleAll = () => {
    const next = new Set(selectedIds);
    if (allPageSelected) {
      pageCandidates.forEach((c) => next.delete(c.id));
    } else {
      pageCandidates.forEach((c) => next.add(c.id));
    }
    onSelectedIdsChange(next);
  };

  const toggleOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onSelectedIdsChange(next);
  };

  const exportSelection =
    selectedIds.size > 0
      ? candidates.filter((c) => selectedIds.has(c.id))
      : candidates;

  const handleBulkDelete = async () => {
    if (!onDeleteSelected || selectedIds.size === 0) return;
    const confirmed = window.confirm(
      `Remove ${selectedIds.size} candidate${selectedIds.size !== 1 ? "s" : ""} from your vault? Resume files will also be deleted. This cannot be undone.`,
    );
    if (!confirmed) return;
    try {
      await onDeleteSelected();
    } catch (err) {
      window.alert(
        err instanceof Error ? err.message : "Could not remove candidates",
      );
    }
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-[#e8ecf4] bg-white shadow-sm dark:border-border/60 dark:bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e8ecf4] px-4 py-3 dark:border-border/60">
        <div className="flex flex-wrap items-center gap-3 text-[13px]">
          <span className="font-medium text-[#0f172a] dark:text-foreground">
            {total} candidate{total !== 1 ? "s" : ""} found
          </span>
          <span className="flex items-center gap-1.5 text-[#64748b]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {readyCount} ready to hire
          </span>
        </div>

        <div className="flex items-center gap-2">
          {selectedIds.size > 0 && onDeleteSelected && (
            <button
              type="button"
              onClick={handleBulkDelete}
              className="text-[13px] font-medium text-red-600 hover:text-red-700 hover:underline"
            >
              Remove selected ({selectedIds.size})
            </button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "h-8 rounded-lg border-[#e2e8f0] text-[13px]",
              )}
            >
              Export
              <ChevronDown className="ml-1 h-3.5 w-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => exportCandidatesCsv(exportSelection)}
              >
                Export as CSV
                {selectedIds.size > 0 ? ` (${selectedIds.size})` : ""}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-[13px]">
          <thead>
            <tr className="border-b border-[#e8ecf4] bg-[#f8fafc] text-[12px] font-medium uppercase tracking-wide text-[#64748b] dark:border-border/60 dark:bg-muted/30">
              <th className="w-10 px-4 py-3">
                <Checkbox
                  checked={allPageSelected}
                  onCheckedChange={toggleAll}
                  aria-label="Select all on page"
                />
              </th>
              <th className="px-4 py-3">Candidate</th>
              <th className="px-4 py-3">Experience</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Top Skills</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Added</th>
              <th className="w-10 px-2 py-3" />
            </tr>
          </thead>
          <tbody>
            {pageCandidates.map((candidate) => {
              const displayName =
                candidate.name ?? candidate.original_filename;
              const skills = candidate.skills ?? [];
              const visibleSkills = skills.slice(0, 2);
              const extraCount = skills.length - visibleSkills.length;
              const isSelected = selectedId === candidate.id;

              return (
                <tr
                  key={candidate.id}
                  onClick={() => onSelect(candidate)}
                  className={cn(
                    "cursor-pointer border-b border-[#f1f5f9] transition-colors last:border-0 hover:bg-[#f8fafc] dark:border-border/40 dark:hover:bg-muted/20",
                    isSelected &&
                      "border-l-[3px] border-l-[#7C3AED] bg-violet-50/50 dark:bg-violet-950/20",
                  )}
                >
                  <td
                    className="px-4 py-3.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      checked={selectedIds.has(candidate.id)}
                      onCheckedChange={() => toggleOne(candidate.id)}
                      aria-label={`Select ${displayName}`}
                    />
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-[#e2e8f0]">
                        <AvatarFallback className="bg-violet-100 text-xs font-semibold text-violet-700">
                          {getInitials(displayName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-[#0f172a] dark:text-foreground">
                          {displayName}
                        </p>
                        <p className="truncate text-[12px] text-[#64748b]">
                          {candidate.recent_job_title ?? "—"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-[#334155]">
                    {candidate.years_experience != null
                      ? `${candidate.years_experience} yrs`
                      : "—"}
                  </td>
                  <td className="px-4 py-3.5 text-[#334155]">
                    {candidate.location ?? "—"}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex flex-wrap items-center gap-1">
                      {visibleSkills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-md bg-[#f1f5f9] px-2 py-0.5 text-[11px] font-medium text-[#475569]"
                        >
                          {skill}
                        </span>
                      ))}
                      {extraCount > 0 && (
                        <span className="rounded-md bg-[#f1f5f9] px-2 py-0.5 text-[11px] font-medium text-[#64748b]">
                          +{extraCount}
                        </span>
                      )}
                      {!skills.length && (
                        <span className="text-[#94a3b8]">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <HireStatusBadge status={candidate.processing_status} />
                  </td>
                  <td className="px-4 py-3.5 text-[#64748b]">
                    {formatDistanceToNow(candidate.created_at)}
                  </td>
                  <td className="px-2 py-3.5 text-[#94a3b8]">
                    <ChevronRight className="h-4 w-4" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-[#e8ecf4] px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-border/60">
        <p className="text-[13px] text-[#64748b]">
          Showing {start} to {end} of {total} candidate{total !== 1 ? "s" : ""}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) =>
                  p === 1 ||
                  p === totalPages ||
                  Math.abs(p - page) <= 1,
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
                      onClick={() => onPageChange(p)}
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
                onRowsPerPageChange(Number(v));
                onPageChange(1);
              }}
            >
              <SelectTrigger className="h-8 w-[70px] rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="8">8</SelectItem>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="24">24</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
