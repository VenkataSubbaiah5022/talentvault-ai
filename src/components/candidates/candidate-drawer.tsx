"use client";

import {
  Briefcase,
  Code2,
  ExternalLink,
  Link2,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/candidates/status-badge";
import type { Candidate } from "@/types/candidate";
import { getInitials } from "@/lib/utils/initials";

interface CandidateDrawerProps {
  candidate: Candidate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ContactRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
      <span className="text-muted-foreground">{label}</span>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto flex items-center gap-1 font-medium hover:underline"
        >
          {value}
          <ExternalLink className="h-3 w-3" />
        </a>
      ) : (
        <span className="ml-auto font-medium">{value}</span>
      )}
    </div>
  );
}

export function CandidateDrawer({
  candidate,
  open,
  onOpenChange,
}: CandidateDrawerProps) {
  if (!candidate) return null;

  const displayName = candidate.name ?? candidate.original_filename;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto border-l border-border/60 sm:max-w-lg">
        <SheetHeader className="space-y-4 border-b border-border/60 pb-5">
          <div className="flex items-start gap-4">
            <Avatar className="h-14 w-14 border border-border/60">
              <AvatarFallback className="bg-primary/10 text-base font-semibold text-primary">
                {getInitials(displayName)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <SheetTitle className="text-xl">{displayName}</SheetTitle>
                <StatusBadge status={candidate.processing_status} />
              </div>
              <SheetDescription className="text-sm">
                {candidate.recent_job_title ?? "Candidate profile"}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6 px-1 pb-6">
          {candidate.resume_summary && (
            <div className="rounded-xl bg-muted/40 p-4">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {candidate.resume_summary}
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {candidate.years_experience != null && (
              <Badge variant="secondary">
                {candidate.years_experience} years experience
              </Badge>
            )}
            {candidate.location && (
              <Badge variant="secondary" className="gap-1">
                <MapPin className="h-3 w-3" />
                {candidate.location}
              </Badge>
            )}
            {candidate.recent_job_title && (
              <Badge variant="secondary" className="gap-1">
                <Briefcase className="h-3 w-3" />
                {candidate.recent_job_title}
              </Badge>
            )}
          </div>

          <Separator />

          <div className="space-y-3 rounded-xl border border-border/60 p-4">
            <h4 className="text-sm font-semibold">Contact</h4>
            {candidate.email && (
              <ContactRow
                icon={Mail}
                label="Email"
                value={candidate.email}
                href={`mailto:${candidate.email}`}
              />
            )}
            {candidate.phone && (
              <ContactRow icon={Phone} label="Phone" value={candidate.phone} />
            )}
            {candidate.linkedin_url && (
              <ContactRow
                icon={Link2}
                label="LinkedIn"
                value="Profile"
                href={
                  candidate.linkedin_url.startsWith("http")
                    ? candidate.linkedin_url
                    : `https://${candidate.linkedin_url}`
                }
              />
            )}
            {candidate.github_url && (
              <ContactRow
                icon={Code2}
                label="GitHub"
                value="Profile"
                href={
                  candidate.github_url.startsWith("http")
                    ? candidate.github_url
                    : `https://${candidate.github_url}`
                }
              />
            )}
            {!candidate.email &&
              !candidate.phone &&
              !candidate.linkedin_url &&
              !candidate.github_url && (
                <p className="text-sm text-muted-foreground">
                  No contact details extracted from resume.
                </p>
              )}
          </div>

          <Separator />

          <div className="space-y-3 rounded-xl border border-border/60 p-4">
            <h4 className="text-sm font-semibold">Skills</h4>
            <div className="flex flex-wrap gap-1.5">
              {(candidate.skills ?? []).map((skill) => (
                <Badge key={skill} variant="outline">
                  {skill}
                </Badge>
              ))}
              {!candidate.skills?.length && (
                <p className="text-sm text-muted-foreground">
                  Skills not yet extracted.
                </p>
              )}
            </div>
          </div>

          {candidate.error_message && (
            <>
              <Separator />
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                <p className="text-sm font-medium text-destructive">
                  Processing error
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {candidate.error_message}
                </p>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
