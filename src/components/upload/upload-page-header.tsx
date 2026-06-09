import { CirclePlay } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export function UploadPageHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-[26px] font-semibold tracking-tight text-[#0f172a] dark:text-foreground">
          Upload Resumes
        </h1>
        <p className="text-[14px] text-[#64748b] dark:text-muted-foreground">
          Upload PDF or DOCX files. We&apos;ll extract, analyze and add them to
          your vault.
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <Button
          variant="outline"
          className="h-10 rounded-lg border-[#e2e8f0] text-[13px] text-[#64748b]"
        >
          <CirclePlay className="mr-1.5 h-4 w-4 text-[#7C3AED]" />
          Watch how it works
        </Button>
        <ThemeToggle />
      </div>
    </div>
  );
}
