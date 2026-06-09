"use client";

import { useState } from "react";
import {
  ChevronDown,
  Download,
  ExternalLink,
  FileText,
  Link2,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { HireStatusBadge } from "@/components/candidates/hire-status-badge";
import { buildExperienceTimeline } from "@/lib/candidates/experience";
import { getAvatarGradient } from "@/lib/candidates/avatar-color";
import { formatDistanceToNow } from "@/lib/utils/date";
import { getInitials } from "@/lib/utils/initials";
import { cn } from "@/lib/utils";
import type { Candidate } from "@/types/candidate";

interface TalentDetailDrawerProps {
  candidate: Candidate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function QuickAction({
  icon: Icon,
  label,
  href,
  onClick,
  disabled,
}: {
  icon: React.ElementType;
  label: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const className =
    "flex h-10 w-10 items-center justify-center rounded-full border border-[#e8ecf4] bg-white text-[#64748b] transition-colors hover:border-violet-200 hover:bg-violet-50 hover:text-[#7C3AED] disabled:opacity-40";

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className={className}
      >
        <Icon className="h-4 w-4" />
      </a>
    );
  }

  return (
    <button
      type="button"
      aria-label={label}
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

export function TalentDetailDrawer({
  candidate,
  open,
  onOpenChange,
}: TalentDetailDrawerProps) {
  const [summaryExpanded, setSummaryExpanded] = useState(false);
  const [experienceExpanded, setExperienceExpanded] = useState(false);

  if (!candidate) return null;

  const displayName = candidate.name ?? candidate.original_filename;
  const gradient = getAvatarGradient(displayName);
  const skills = candidate.skills ?? [];
  const timeline = buildExperienceTimeline(candidate);
  const summary = candidate.resume_summary ?? "";
  const summaryPreview =
    summary.length > 180 && !summaryExpanded
      ? `${summary.slice(0, 180)}…`
      : summary;

  const linkedinHref = candidate.linkedin_url
    ? candidate.linkedin_url.startsWith("http")
      ? candidate.linkedin_url
      : `https://${candidate.linkedin_url}`
    : undefined;

  const handleDownload = async () => {
    const res = await fetch(`/api/candidates/${candidate.id}/resume`);
    const data = await res.json();
    if (data.url) window.open(data.url, "_blank");
  };

  const visibleTimeline = experienceExpanded ? timeline : timeline.slice(0, 2);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 overflow-y-auto border-l border-[#e8ecf4] p-0 sm:max-w-[440px]">
        <SheetTitle className="sr-only">{displayName} profile</SheetTitle>

        <div className="border-b border-[#e8ecf4] px-6 pb-5 pt-6">
          <div className="flex flex-col items-center text-center">
            <div
              className={cn(
                "flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br text-xl font-semibold text-white shadow-lg",
                gradient,
              )}
            >
              {getInitials(displayName)}
            </div>
            <h2 className="mt-4 text-xl font-semibold text-[#0f172a] dark:text-foreground">
              {displayName}
            </h2>
            <div className="mt-2">
              <HireStatusBadge status={candidate.processing_status} />
            </div>
            {candidate.recent_job_title && (
              <p className="mt-2 text-[14px] font-medium text-[#334155]">
                {candidate.recent_job_title}
              </p>
            )}
            <p className="mt-1 flex flex-wrap items-center justify-center gap-1 text-[13px] text-[#64748b]">
              {candidate.location && (
                <>
                  <MapPin className="h-3.5 w-3.5" />
                  {candidate.location}
                </>
              )}
              {candidate.location && candidate.years_experience != null && (
                <span className="text-[#cbd5e1]">·</span>
              )}
              {candidate.years_experience != null && (
                <span>{candidate.years_experience} years experience</span>
              )}
            </p>
          </div>

          <div className="mt-5 flex items-center justify-center gap-2">
            <QuickAction
              icon={Mail}
              label="Email"
              href={
                candidate.email ? `mailto:${candidate.email}` : undefined
              }
              disabled={!candidate.email}
            />
            <QuickAction
              icon={Phone}
              label="Phone"
              href={candidate.phone ? `tel:${candidate.phone}` : undefined}
              disabled={!candidate.phone}
            />
            <QuickAction
              icon={Link2}
              label="LinkedIn"
              href={linkedinHref}
              disabled={!candidate.linkedin_url}
            />
            <QuickAction
              icon={FileText}
              label="Resume"
              onClick={handleDownload}
              disabled={!candidate.storage_path}
            />
            <QuickAction
              icon={ExternalLink}
              label="Open profile"
              href={linkedinHref}
              disabled={!candidate.linkedin_url}
            />
          </div>
        </div>

        <div className="space-y-6 px-6 py-5">
          {summary && (
            <section>
              <h3 className="text-[13px] font-semibold text-[#0f172a] dark:text-foreground">
                About
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-[#64748b]">
                {summaryPreview}
              </p>
              {summary.length > 180 && (
                <button
                  type="button"
                  onClick={() => setSummaryExpanded((v) => !v)}
                  className="mt-2 flex items-center gap-1 text-[12px] font-medium text-[#7C3AED] hover:underline"
                >
                  {summaryExpanded ? "Show less" : "View full summary"}
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 transition-transform",
                      summaryExpanded && "rotate-180",
                    )}
                  />
                </button>
              )}
            </section>
          )}

          {skills.length > 0 && (
            <section>
              <h3 className="text-[13px] font-semibold text-[#0f172a] dark:text-foreground">
                Top Skills
              </h3>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {skills.slice(0, 10).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md bg-violet-50 px-2.5 py-1 text-[12px] font-medium text-violet-700 ring-1 ring-violet-600/10"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {timeline.length > 0 && (
            <section>
              <h3 className="text-[13px] font-semibold text-[#0f172a] dark:text-foreground">
                Experience
              </h3>
              <ol className="mt-4 space-y-0">
                {visibleTimeline.map((item, index) => (
                  <li key={`${item.title}-${index}`} className="relative flex gap-3 pb-6 last:pb-0">
                    {index < visibleTimeline.length - 1 && (
                      <span className="absolute left-[7px] top-4 h-[calc(100%-4px)] w-px bg-[#e2e8f0]" />
                    )}
                    <span
                      className={cn(
                        "relative z-10 mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-white ring-1",
                        item.isCurrent
                          ? "bg-[#7C3AED] ring-[#7C3AED]/30"
                          : "bg-[#cbd5e1] ring-[#cbd5e1]",
                      )}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-semibold text-[#0f172a] dark:text-foreground">
                        {item.title}
                      </p>
                      <p className="text-[12px] text-[#64748b]">{item.company}</p>
                      {item.period && (
                        <p className="text-[11px] text-[#94a3b8]">{item.period}</p>
                      )}
                      {item.highlights.length > 0 && (
                        <ul className="mt-2 list-disc space-y-1 pl-4 text-[12px] leading-relaxed text-[#64748b]">
                          {item.highlights.map((h) => (
                            <li key={h}>{h}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
              {timeline.length > 2 && (
                <button
                  type="button"
                  onClick={() => setExperienceExpanded((v) => !v)}
                  className="mt-2 text-[12px] font-medium text-[#7C3AED] hover:underline"
                >
                  {experienceExpanded
                    ? "Show less experience"
                    : "View full experience"}
                </button>
              )}
            </section>
          )}

          {candidate.storage_path && (
            <section>
              <h3 className="text-[13px] font-semibold text-[#0f172a] dark:text-foreground">
                Resume
              </h3>
              <div className="mt-2 flex items-center gap-3 rounded-lg border border-[#e8ecf4] bg-[#f8fafc] p-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-[#0f172a]">
                    {candidate.original_filename}
                  </p>
                  <p className="text-[11px] text-[#94a3b8]">
                    Uploaded {formatDistanceToNow(candidate.created_at)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#64748b] hover:bg-white hover:text-[#7C3AED]"
                  aria-label="Download resume"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </section>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
