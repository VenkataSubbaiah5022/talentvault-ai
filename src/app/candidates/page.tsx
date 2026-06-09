import { CandidatesView } from "@/components/candidates/candidates-view";

export default function CandidatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Candidates</h1>
        <p className="mt-1 text-muted-foreground">
          Search and filter your talent pool. Click any candidate for full
          profile details.
        </p>
      </div>
      <CandidatesView />
    </div>
  );
}
