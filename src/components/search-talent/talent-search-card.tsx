"use client";

import { ChevronRight, MapPin } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { HireStatusBadge } from "@/components/candidates/hire-status-badge";
import { getAvatarGradient } from "@/lib/candidates/avatar-color";
import { formatDistanceToNow } from "@/lib/utils/date";
import { getInitials } from "@/lib/utils/initials";
import { cn } from "@/lib/utils";
import type { Candidate } from "@/types/candidate";

interface TalentSearchCardProps {
  candidate: Candidate;
  selected: boolean;
  checked: boolean;
  onSelect: () => void;
  onCheckedChange: () => void;
}

export function TalentSearchCard({
  candidate,
  selected,
  checked,
  onSelect,
  onCheckedChange,
}: TalentSearchCardProps) {
  const displayName = candidate.name ?? candidate.original_filename;
  const skills = candidate.skills ?? [];
  const visibleSkills = skills.slice(0, 2);
  const extraCount = skills.length - visibleSkills.length;
  const gradient = getAvatarGradient(displayName);

  return (
    <article
      onClick={onSelect}
      className={cn(
        "group relative cursor-pointer rounded-xl border bg-white p-4 shadow-sm transition-all hover:shadow-md dark:bg-card",
        selected
          ? "border-[#7C3AED] ring-2 ring-[#7C3AED]/20"
          : "border-[#e8ecf4] hover:border-[#d8dee9] dark:border-border/60",
      )}
    >
      <div
        className="absolute left-3 top-3 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <Checkbox
          checked={checked}
          onCheckedChange={onCheckedChange}
          aria-label={`Select ${displayName}`}
        />
      </div>

      <div className="flex flex-col items-center pt-2 text-center">
        <div
          className={cn(
            "flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br text-lg font-semibold text-white shadow-md",
            gradient,
          )}
        >
          {getInitials(displayName)}
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          <h3 className="text-[15px] font-semibold text-[#0f172a] dark:text-foreground">
            {displayName}
          </h3>
          <HireStatusBadge status={candidate.processing_status} />
        </div>

        {candidate.recent_job_title && (
          <p className="mt-1 text-[13px] text-[#64748b]">
            {candidate.recent_job_title}
          </p>
        )}

        {candidate.location && (
          <p className="mt-1 flex items-center justify-center gap-1 text-[12px] text-[#94a3b8]">
            <MapPin className="h-3 w-3" />
            {candidate.location}
          </p>
        )}

        {candidate.years_experience != null && (
          <span className="mt-2 inline-flex rounded-md bg-[#f1f5f9] px-2 py-0.5 text-[11px] font-semibold text-[#475569]">
            {candidate.years_experience} yrs
          </span>
        )}

        {visibleSkills.length > 0 && (
          <div className="mt-3 flex flex-wrap justify-center gap-1">
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
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-[#f1f5f9] pt-3 dark:border-border/40">
        <span className="text-[11px] text-[#94a3b8]">
          Added {formatDistanceToNow(candidate.created_at)}
        </span>
        <ChevronRight className="h-4 w-4 text-[#94a3b8] transition-transform group-hover:translate-x-0.5 group-hover:text-[#7C3AED]" />
      </div>
    </article>
  );
}
