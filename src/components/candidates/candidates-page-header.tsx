import Link from "next/link";
import { Bell, Upload } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { IconActionButton } from "@/components/dashboard/icon-badge";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { cn } from "@/lib/utils";

export function CandidatesPageHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-[26px] font-semibold tracking-tight text-[#0f172a] dark:text-foreground">
          Candidates
        </h1>
        <p className="text-[14px] text-[#64748b] dark:text-muted-foreground">
          Search, filter and discover the best talent in your vault.
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <Link
          href="/upload"
          className={cn(
            buttonVariants(),
            "inline-flex h-10 rounded-lg bg-[#7C3AED] px-4 text-[13px] font-medium text-white shadow-md shadow-violet-500/20 hover:bg-[#6d28d9]",
          )}
        >
          <Upload className="mr-1.5 h-4 w-4" strokeWidth={2.5} />
          Upload Resumes
        </Link>
        <IconActionButton icon={Bell} variant="ghost" label="Notifications" />
        <ThemeToggle />
      </div>
    </div>
  );
}
