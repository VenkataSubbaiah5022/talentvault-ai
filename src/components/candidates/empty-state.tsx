import Link from "next/link";
import { FileSearch, Upload } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  variant: "no-candidates" | "no-results";
}

export function EmptyState({ variant }: EmptyStateProps) {
  if (variant === "no-candidates") {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/20 px-6 py-16 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <Upload className="h-7 w-7 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">No candidates yet</h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Upload resumes to build your talent pool. We&apos;ll extract skills,
          experience, and contact details automatically.
        </p>
        <Link
          href="/upload"
          className={cn(buttonVariants(), "mt-6 inline-flex")}
        >
          Upload resumes
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/20 px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <FileSearch className="h-7 w-7 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">No candidates found</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Try another skill, location, or experience filter — or upload more
        resumes to expand your pool.
      </p>
      <Link
        href="/upload"
        className={cn(buttonVariants({ variant: "outline" }), "mt-6 inline-flex")}
      >
        Upload more resumes
      </Link>
    </div>
  );
}
