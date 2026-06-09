import Link from "next/link";
import { Bell, Bookmark, Upload } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { IconActionButton } from "@/components/dashboard/icon-badge";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { cn } from "@/lib/utils";

export function SearchTalentHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-[26px] font-semibold tracking-tight text-[#0f172a] dark:text-foreground">
          Search Talent
        </h1>
        <p className="max-w-xl text-[14px] text-[#64748b] dark:text-muted-foreground">
          Find the right candidates in your vault. Use filters or natural search
          to discover talent.
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-10 rounded-lg border-[#e2e8f0] px-4 text-[13px] text-[#64748b]",
          )}
        >
          <Bookmark className="mr-1.5 h-4 w-4" />
          Save Search
        </button>
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
