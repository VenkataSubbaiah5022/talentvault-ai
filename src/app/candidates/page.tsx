import { Suspense } from "react";
import { CandidatesView } from "@/components/candidates/candidates-view";
import { Skeleton } from "@/components/ui/skeleton";

function CandidatesLoading() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-16 w-full max-w-xl" />
      <Skeleton className="h-32 w-full rounded-xl" />
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-14 rounded-lg" />
      ))}
    </div>
  );
}

export default function CandidatesPage() {
  return (
    <Suspense fallback={<CandidatesLoading />}>
      <CandidatesView />
    </Suspense>
  );
}
