"use client";

import { useState } from "react";
import {
  Download,
  ExternalLink,
  FileText,
  Link2,
  Mail,
  MapPin,
  Phone,
  StickyNote,
  Trash2,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { HireStatusBadge } from "@/components/candidates/hire-status-badge";
import { getInitials } from "@/lib/utils/initials";
import type { Candidate } from "@/types/candidate";

interface CandidateDetailPanelProps {
  candidate: Candidate;
  onClose: () => void;
  onDelete: (id: string) => Promise<void>;
}

function ContactItem({
  icon: Icon,
  value,
  href,
}: {
  icon: React.ElementType;
  value: string;
  href?: string;
}) {
  const content = href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="truncate text-[13px] font-medium text-[#0f172a] hover:text-[#7C3AED] hover:underline dark:text-foreground"
    >
      {value}
    </a>
  ) : (
    <span className="truncate text-[13px] font-medium text-[#0f172a] dark:text-foreground">
      {value}
    </span>
  );

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f1f5f9] text-[#64748b]">
        <Icon className="h-4 w-4" />
      </div>
      {content}
    </div>
  );
}

export function CandidateDetailPanel({
  candidate,
  onClose,
  onDelete,
}: CandidateDetailPanelProps) {
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const displayName = candidate.name ?? candidate.original_filename;
  const skills = candidate.skills ?? [];

  const handleDownload = async () => {
    if (!candidate.storage_path) return;
    setDownloading(true);
    try {
      const res = await fetch(`/api/candidates/${candidate.id}/resume`);
      const data = await res.json();
      if (data.url) {
        window.open(data.url, "_blank");
      }
    } finally {
      setDownloading(false);
    }
  };

  const handleDelete = async () => {
    const name = candidate.name ?? candidate.original_filename;
    const confirmed = window.confirm(
      `Remove ${name} from your vault? Their resume file will also be deleted. This cannot be undone.`,
    );
    if (!confirmed) return;

    setDeleting(true);
    try {
      await onDelete(candidate.id);
      onClose();
    } catch (err) {
      window.alert(
        err instanceof Error ? err.message : "Could not remove candidate",
      );
    } finally {
      setDeleting(false);
    }
  };

  const linkedinHref = candidate.linkedin_url
    ? candidate.linkedin_url.startsWith("http")
      ? candidate.linkedin_url
      : `https://${candidate.linkedin_url}`
    : undefined;

  return (
    <aside className="flex h-full w-[380px] shrink-0 flex-col border-l border-[#e8ecf4] bg-white dark:border-border/60 dark:bg-card">
      <div className="flex items-center justify-between border-b border-[#e8ecf4] px-4 py-3 dark:border-border/60">
        <p className="text-[13px] font-medium text-[#64748b]">Candidate profile</p>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-[#64748b] hover:text-[#0f172a]"
          onClick={onClose}
          aria-label="Close panel"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-20 w-20 border-2 border-[#e8ecf4]">
            <AvatarFallback className="bg-violet-100 text-xl font-semibold text-violet-700">
              {getInitials(displayName)}
            </AvatarFallback>
          </Avatar>
          <h2 className="mt-4 text-lg font-semibold text-[#0f172a] dark:text-foreground">
            {displayName}
          </h2>
          <p className="mt-0.5 text-[13px] text-[#64748b]">
            {candidate.recent_job_title ?? "Candidate"}
          </p>
          <div className="mt-3">
            <HireStatusBadge status={candidate.processing_status} />
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {candidate.email && (
            <ContactItem
              icon={Mail}
              value={candidate.email}
              href={`mailto:${candidate.email}`}
            />
          )}
          {candidate.phone && (
            <ContactItem icon={Phone} value={candidate.phone} />
          )}
          {candidate.linkedin_url && (
            <ContactItem
              icon={Link2}
              value="LinkedIn Profile"
              href={linkedinHref}
            />
          )}
          {candidate.location && (
            <ContactItem icon={MapPin} value={candidate.location} />
          )}
        </div>

        {candidate.resume_summary && (
          <section className="mt-6">
            <h3 className="text-[13px] font-semibold text-[#0f172a] dark:text-foreground">
              About
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-[#64748b]">
              {candidate.resume_summary}
            </p>
          </section>
        )}

        <section className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-[#e8ecf4] bg-[#f8fafc] p-3 dark:border-border/60 dark:bg-muted/30">
            <p className="text-lg font-semibold text-[#0f172a] dark:text-foreground">
              {candidate.years_experience ?? "—"}
              {candidate.years_experience != null && (
                <span className="text-sm font-normal text-[#64748b]">
                  {" "}
                  years
                </span>
              )}
            </p>
            <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-[#94a3b8]">
              Total Experience
            </p>
          </div>
          <div className="rounded-lg border border-[#e8ecf4] bg-[#f8fafc] p-3 dark:border-border/60 dark:bg-muted/30">
            <p className="line-clamp-2 text-sm font-semibold text-[#0f172a] dark:text-foreground">
              {candidate.recent_job_title ?? "—"}
            </p>
            <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-[#94a3b8]">
              Current Role
            </p>
          </div>
        </section>

        {skills.length > 0 && (
          <section className="mt-6">
            <h3 className="text-[13px] font-semibold text-[#0f172a] dark:text-foreground">
              Top Skills
            </h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {skills.slice(0, 8).map((skill) => (
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

        {candidate.storage_path && (
          <section className="mt-6">
            <h3 className="text-[13px] font-semibold text-[#0f172a] dark:text-foreground">
              Resume
            </h3>
            <div className="mt-2 flex items-center gap-3 rounded-lg border border-[#e8ecf4] bg-[#f8fafc] p-3 dark:border-border/60 dark:bg-muted/30">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-[#0f172a] dark:text-foreground">
                  {candidate.original_filename}
                </p>
                <p className="text-[11px] text-[#94a3b8]">Resume file</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 text-[#64748b] hover:text-[#7C3AED]"
                onClick={handleDownload}
                disabled={downloading}
                aria-label="Download resume"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </section>
        )}

        {candidate.error_message && (
          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-3">
            <p className="text-[12px] font-medium text-amber-800">
              Processing note
            </p>
            <p className="mt-1 text-[12px] text-amber-700">
              {candidate.error_message}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-2 border-t border-[#e8ecf4] p-4 dark:border-border/60">
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="h-10 flex-1 rounded-lg border-[#e2e8f0] text-[13px]"
          >
            View Full Profile
            <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
          </Button>
          <Button className="h-10 flex-1 rounded-lg bg-[#7C3AED] text-[13px] hover:bg-[#6d28d9]">
            <StickyNote className="mr-1.5 h-3.5 w-3.5" />
            Add Note
          </Button>
        </div>
        <Button
          variant="outline"
          className="h-10 w-full rounded-lg border-red-200 text-[13px] text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={handleDelete}
          disabled={deleting}
        >
          <Trash2 className="mr-1.5 h-3.5 w-3.5" />
          {deleting ? "Removing…" : "Remove from vault"}
        </Button>
      </div>
    </aside>
  );
}
