import Link from "next/link";
import { FileSearch, Upload } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  variant: "no-candidates" | "no-results";
}

export function EmptyState({ variant }: EmptyStateProps) {
  const isNoCandidates = variant === "no-candidates";
  const Icon = isNoCandidates ? Upload : FileSearch;

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-muted/20 px-6 py-20 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-xl font-semibold">
        {isNoCandidates ? "No candidates yet" : "No candidates found"}
      </h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        {isNoCandidates
          ? "Upload resumes to build your talent pool. We'll extract skills, experience, and contact details automatically."
          : "Try another skill, location, or experience filter — or upload more resumes to expand your pool."}
      </p>
      <Link
        href="/upload"
        className={cn(
          buttonVariants({ variant: isNoCandidates ? "default" : "outline" }),
          "mt-8 inline-flex",
        )}
      >
        {isNoCandidates ? "Upload resumes" : "Upload more resumes"}
      </Link>
    </div>
  );
}
