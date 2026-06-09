"use client";

import {
  ChevronDown,
  LayoutGrid,
  List,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { CandidateSort } from "@/types/candidate";

interface CandidatesToolbarProps {
  query: string;
  onQueryChange: (value: string) => void;
  skill: string;
  onSkillChange: (value: string) => void;
  minYears: string;
  onMinYearsChange: (value: string) => void;
  location: string;
  onLocationChange: (value: string) => void;
  jobTitle: string;
  onJobTitleChange: (value: string) => void;
  sort: CandidateSort;
  onSortChange: (value: CandidateSort) => void;
  view: "cards" | "table";
  onViewChange: (view: "cards" | "table") => void;
  onClearAll: () => void;
  hasFilters: boolean;
}

const filterInputClass =
  "h-9 rounded-lg border border-[#e2e8f0] bg-white text-[13px] shadow-sm dark:border-border dark:bg-card";

export function CandidatesToolbar({
  query,
  onQueryChange,
  skill,
  onSkillChange,
  minYears,
  onMinYearsChange,
  location,
  onLocationChange,
  jobTitle,
  onJobTitleChange,
  sort,
  onSortChange,
  view,
  onViewChange,
  onClearAll,
  hasFilters,
}: CandidatesToolbarProps) {
  return (
    <div className="space-y-3 rounded-xl border border-[#e8ecf4] bg-white p-4 shadow-sm dark:border-border/60 dark:bg-card">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
          <Input
            placeholder="Search candidates..."
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            className={cn(filterInputClass, "h-10 pl-9 pr-16")}
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-[#e2e8f0] bg-[#f8fafc] px-1.5 py-0.5 text-[10px] font-medium text-[#94a3b8] sm:inline-block">
            ⌘ K
          </kbd>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-0.5 dark:border-border dark:bg-muted/40">
            <button
              type="button"
              onClick={() => onViewChange("cards")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors",
                view === "cards"
                  ? "bg-white text-[#7C3AED] shadow-sm dark:bg-card"
                  : "text-[#64748b] hover:text-[#0f172a]",
              )}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              Card View
            </button>
            <button
              type="button"
              onClick={() => onViewChange("table")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors",
                view === "table"
                  ? "bg-white text-[#7C3AED] shadow-sm dark:bg-card"
                  : "text-[#64748b] hover:text-[#0f172a]",
              )}
            >
              <List className="h-3.5 w-3.5" />
              Table View
            </button>
          </div>

          <Select
            value={sort}
            onValueChange={(v) => onSortChange(v as CandidateSort)}
          >
            <SelectTrigger className={cn(filterInputClass, "min-w-[180px] gap-2")}>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Sort by Recently Added</SelectItem>
              <SelectItem value="name">Sort by Name</SelectItem>
              <SelectItem value="experience">Sort by Experience</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-4">
          <div className="relative">
            <Input
              placeholder="Skills"
              value={skill}
              onChange={(e) => onSkillChange(e.target.value)}
              className={filterInputClass}
            />
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#94a3b8]" />
          </div>
          <div className="relative">
            <Input
              placeholder="Min Experience"
              type="number"
              min={0}
              value={minYears}
              onChange={(e) => onMinYearsChange(e.target.value)}
              className={filterInputClass}
            />
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#94a3b8]" />
          </div>
          <div className="relative">
            <Input
              placeholder="Location"
              value={location}
              onChange={(e) => onLocationChange(e.target.value)}
              className={filterInputClass}
            />
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#94a3b8]" />
          </div>
          <div className="relative">
            <Input
              placeholder="Job Title"
              value={jobTitle}
              onChange={(e) => onJobTitleChange(e.target.value)}
              className={filterInputClass}
            />
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#94a3b8]" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-lg border-[#e2e8f0] text-[13px] text-[#64748b]"
          >
            <SlidersHorizontal className="mr-1.5 h-3.5 w-3.5" />
            More Filters
          </Button>
          {hasFilters && (
            <button
              type="button"
              onClick={onClearAll}
              className="text-[13px] font-medium text-[#7C3AED] hover:underline"
            >
              Clear all
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
