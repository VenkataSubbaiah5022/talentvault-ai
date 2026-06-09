import { PageHeader } from "@/components/layout/page-header";
import { CandidatesView } from "@/components/candidates/candidates-view";

export default function CandidatesPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Candidates"
        description="Search and filter your talent pool. Click any candidate for full profile details."
      />
      <CandidatesView />
    </div>
  );
}
