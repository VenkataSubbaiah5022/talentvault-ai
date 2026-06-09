import Link from "next/link";
import { Bell, Plus, RefreshCw, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { IconActionButton } from "@/components/dashboard/icon-badge";
import { formatLastUpdated } from "@/lib/utils/date";
import { cn } from "@/lib/utils";

interface DashboardHeroProps {
  totalCandidates: number;
  skillsIndexed: number;
  lastUploadAt: string | null;
}

export function DashboardHero({
  totalCandidates,
  skillsIndexed,
  lastUploadAt,
}: DashboardHeroProps) {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
      <div className="space-y-1.5">
        <h1 className="text-[26px] font-semibold leading-tight text-[#0f172a] dark:text-foreground">
          Welcome back! 👋
        </h1>
        <p className="text-[14px] text-[#64748b] dark:text-muted-foreground">
          Here&apos;s what&apos;s happening in your talent vault today.
        </p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 pt-1 text-[13px] text-[#64748b]">
          <span>
            <span className="font-semibold text-[#0f172a] dark:text-foreground">
              {totalCandidates}
            </span>{" "}
            candidate{totalCandidates !== 1 ? "s" : ""} available
          </span>
          <span>
            <span className="font-semibold text-[#0f172a] dark:text-foreground">
              {skillsIndexed}
            </span>{" "}
            skills indexed
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-2.5">
          <IconActionButton icon={Bell} variant="ghost" label="Notifications" />
          <IconActionButton icon={Sparkles} variant="indigo" label="AI insights" />
          <Link
            href="/upload"
            className={cn(
              buttonVariants(),
              "inline-flex h-10 rounded-[12px] bg-gradient-to-r from-indigo-600 to-violet-600 px-4 text-[13px] font-medium shadow-lg shadow-indigo-500/25 hover:from-indigo-700 hover:to-violet-700",
            )}
          >
            <Plus className="mr-1.5 h-4 w-4" strokeWidth={2.5} />
            Upload Resumes
          </Link>
        </div>
        <p className="flex items-center gap-1.5 text-[12px] text-[#94a3b8]">
          <RefreshCw className="h-3 w-3" strokeWidth={2} />
          Last updated: {formatLastUpdated(lastUploadAt)}
        </p>
      </div>
    </div>
  );
}
