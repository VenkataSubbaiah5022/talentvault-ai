import { Suspense } from "react";
import { SearchTalentView } from "@/components/search-talent/search-talent-view";
import { Skeleton } from "@/components/ui/skeleton";

function SearchTalentLoading() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-16 w-full max-w-xl" />
      <Skeleton className="h-32 w-full rounded-xl" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton key={i} className="h-56 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default function SearchTalentPage() {
  return (
    <Suspense fallback={<SearchTalentLoading />}>
      <SearchTalentView />
    </Suspense>
  );
}
