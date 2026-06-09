import { Briefcase, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/candidates/status-badge";
import type { Candidate } from "@/types/candidate";
import { getInitials } from "@/lib/utils/initials";

interface CandidateCardProps {
  candidate: Candidate;
  onClick: () => void;
}

export function CandidateCard({ candidate, onClick }: CandidateCardProps) {
  const displayName = candidate.name ?? candidate.original_filename;
  const skills = (candidate.skills ?? []).slice(0, 4);

  return (
    <Card className="surface-card-hover group cursor-pointer" onClick={onClick}>
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start gap-3">
          <Avatar className="h-11 w-11 border border-border/60">
            <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
              {getInitials(displayName)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="truncate font-semibold group-hover:text-primary">
                  {displayName}
                </h3>
                {candidate.recent_job_title && (
                  <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Briefcase className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{candidate.recent_job_title}</span>
                  </p>
                )}
              </div>
              <StatusBadge status={candidate.processing_status} />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          {candidate.years_experience != null && (
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {candidate.years_experience} yrs
            </span>
          )}
          {candidate.location && (
            <span className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span className="truncate">{candidate.location}</span>
            </span>
          )}
        </div>

        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="text-xs font-normal"
              >
                {skill}
              </Badge>
            ))}
            {(candidate.skills?.length ?? 0) > 4 && (
              <Badge variant="outline" className="text-xs">
                +{(candidate.skills?.length ?? 0) - 4}
              </Badge>
            )}
          </div>
        )}

        {candidate.resume_summary && (
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {candidate.resume_summary}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
