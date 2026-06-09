import Link from "next/link";
import { FolderOpen, Search, Upload } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { IconBadge } from "@/components/dashboard/icon-badge";
import { cn } from "@/lib/utils";

export function DashboardEmpty() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center rounded-[14px] border border-[#e8ecf3] bg-white px-8 py-16 text-center shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-border dark:bg-card">
      <IconBadge icon={FolderOpen} variant="violet" size="lg" />
      <h2 className="mt-5 text-[20px] font-semibold text-[#0f172a] dark:text-foreground">
        Your talent vault is empty
      </h2>
      <p className="mt-2 text-[14px] leading-relaxed text-[#64748b]">
        Upload resumes to unlock role distribution, experience insights, skill
        trends, and AI-powered recommendations.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/upload"
          className={cn(
            buttonVariants(),
            "rounded-[12px] bg-gradient-to-r from-indigo-600 to-violet-600 text-[13px] shadow-lg shadow-indigo-500/20 hover:from-indigo-700 hover:to-violet-700",
          )}
        >
          <Upload className="mr-2 h-4 w-4" strokeWidth={2.25} />
          Upload Resumes
        </Link>
        <Link
          href="/candidates"
          className={cn(buttonVariants({ variant: "outline" }), "rounded-[12px] text-[13px]")}
        >
          <Search className="mr-2 h-4 w-4" strokeWidth={2.25} />
          Search Talent
        </Link>
      </div>
    </div>
  );
}
