import {
  CheckCircle2,
  Clock,
  CloudUpload,
  Database,
  FileText,
  Shield,
  Sparkles,
  XCircle,
  Cog,
} from "lucide-react";
import type { ProcessingStatus } from "@/types/candidate";

interface UploadSidebarProps {
  stats: Record<ProcessingStatus, number>;
  total: number;
}

const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Upload",
    description: "Drop PDF or DOCX resumes into your vault.",
    icon: CloudUpload,
  },
  {
    step: 2,
    title: "Extract",
    description: "Text is pulled from each resume automatically.",
    icon: FileText,
  },
  {
    step: 3,
    title: "Protect",
    description: "PII is scrubbed before any AI sees the content.",
    icon: Shield,
  },
  {
    step: 4,
    title: "Analyze",
    description: "Gemini AI extracts skills, experience and summary.",
    icon: Sparkles,
  },
  {
    step: 5,
    title: "Save",
    description: "Structured profiles are saved to your talent vault.",
    icon: Database,
  },
];

export function UploadSidebar({ stats, total }: UploadSidebarProps) {
  const summaryRows = [
    {
      label: "Completed",
      count: stats.completed,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Processing",
      count: stats.processing,
      icon: Cog,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Pending",
      count: stats.pending,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Failed",
      count: stats.failed,
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  return (
    <aside className="w-[320px] shrink-0 space-y-4 border-l border-[#e8ecf4] bg-[#f8fafc]/50 px-5 py-7 dark:border-border/60 dark:bg-muted/10">
      <div className="rounded-xl border border-[#e8ecf4] bg-white p-4 shadow-sm dark:border-border/60 dark:bg-card">
        <h3 className="text-[14px] font-semibold text-[#0f172a] dark:text-foreground">
          Processing Summary
        </h3>
        <ul className="mt-3 space-y-2.5">
          {summaryRows.map((row) => (
            <li key={row.label} className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-[13px] text-[#64748b]">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-lg ${row.bg}`}
                >
                  <row.icon className={`h-3.5 w-3.5 ${row.color}`} />
                </span>
                {row.label}
              </span>
              <span className="text-[13px] font-semibold text-[#0f172a] dark:text-foreground">
                {row.count}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-center justify-between border-t border-[#e8ecf4] pt-3 dark:border-border/60">
          <span className="text-[13px] font-medium text-[#7C3AED]">
            Total Files
          </span>
          <span className="text-[15px] font-bold text-[#7C3AED]">{total}</span>
        </div>
      </div>

      <div className="rounded-xl border border-[#e8ecf4] bg-white p-4 shadow-sm dark:border-border/60 dark:bg-card">
        <h3 className="text-[14px] font-semibold text-[#0f172a] dark:text-foreground">
          How it works
        </h3>
        <ol className="mt-4 space-y-4">
          {HOW_IT_WORKS.map((item) => (
            <li key={item.step} className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-[#7C3AED]">
                <item.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[13px] font-medium text-[#0f172a] dark:text-foreground">
                  {item.step}. {item.title}
                </p>
                <p className="mt-0.5 text-[12px] leading-relaxed text-[#64748b]">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="rounded-xl border border-[#e8ecf4] bg-white p-4 shadow-sm dark:border-border/60 dark:bg-card">
        <h3 className="text-[14px] font-semibold text-[#0f172a] dark:text-foreground">
          Accepted Formats
        </h3>
        <div className="mt-3 flex gap-3">
          <div className="flex flex-1 flex-col items-center rounded-lg border border-[#e8ecf4] bg-[#f8fafc] px-3 py-4 dark:border-border/60 dark:bg-muted/30">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600">
              <FileText className="h-5 w-5" />
            </div>
            <span className="mt-2 text-[12px] font-medium text-[#64748b]">
              PDF
            </span>
          </div>
          <div className="flex flex-1 flex-col items-center rounded-lg border border-[#e8ecf4] bg-[#f8fafc] px-3 py-4 dark:border-border/60 dark:bg-muted/30">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <FileText className="h-5 w-5" />
            </div>
            <span className="mt-2 text-[12px] font-medium text-[#64748b]">
              DOCX
            </span>
          </div>
        </div>
      </div>

      <p className="px-1 text-center text-[12px] text-[#64748b]">
        Need help?{" "}
        <button type="button" className="font-medium text-[#7C3AED] hover:underline">
          Check our guide
        </button>{" "}
        or{" "}
        <button type="button" className="font-medium text-[#7C3AED] hover:underline">
          contact support
        </button>
      </p>
    </aside>
  );
}
