import { Briefcase, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/candidates/status-badge";
import type { Candidate } from "@/types/candidate";

interface CandidateCardProps {
  candidate: Candidate;
  onClick: () => void;
}

export function CandidateCard({ candidate, onClick }: CandidateCardProps) {
  const displayName = candidate.name ?? candidate.original_filename;
  const skills = (candidate.skills ?? []).slice(0, 5);

  return (
    <Card
      className="cursor-pointer border-border/60 bg-card/50 transition-all hover:border-primary/30 hover:shadow-md"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold">{displayName}</h3>
            {candidate.recent_job_title && (
              <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Briefcase className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{candidate.recent_job_title}</span>
              </p>
            )}
          </div>
          <StatusBadge status={candidate.processing_status} />
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {candidate.years_experience != null && (
            <span className="rounded-md bg-muted px-2 py-0.5 font-medium">
              {candidate.years_experience} yrs
            </span>
          )}
          {candidate.location && (
            <span className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              {candidate.location}
            </span>
          )}
        </div>

        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill) => (
              <Badge key={skill} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
            {(candidate.skills?.length ?? 0) > 5 && (
              <Badge variant="outline" className="text-xs">
                +{(candidate.skills?.length ?? 0) - 5}
              </Badge>
            )}
          </div>
        )}

        {candidate.resume_summary && (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {candidate.resume_summary}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
