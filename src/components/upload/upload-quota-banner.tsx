"use client";

import { Info } from "lucide-react";
import { FREE_TIER_NOTICE } from "@/lib/upload/limits";

export interface UploadQuotaInfo {
  maxFilesPerUpload: number;
  maxAiRequestsPerDay: number;
  usedToday: number;
  remainingToday: number;
  maxFilesThisUpload: number;
}

export function UploadQuotaBanner({ quota }: { quota: UploadQuotaInfo }) {
  const atDailyLimit = quota.maxFilesThisUpload === 0;

  return (
    <div
      className={
        atDailyLimit
          ? "flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900/40 dark:bg-amber-950/30"
          : "flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-900/40 dark:bg-blue-950/30"
      }
    >
      <Info
        className={`mt-0.5 h-5 w-5 shrink-0 ${atDailyLimit ? "text-amber-600" : "text-blue-600"}`}
      />
      <div className="text-[13px] leading-relaxed">
        <p
          className={`font-medium ${atDailyLimit ? "text-amber-900 dark:text-amber-200" : "text-blue-900 dark:text-blue-200"}`}
        >
          {atDailyLimit
            ? "Daily AI limit reached"
            : "Gemini free API limits (demo)"}
        </p>
        <p
          className={`mt-1 ${atDailyLimit ? "text-amber-800 dark:text-amber-300" : "text-blue-800 dark:text-blue-300"}`}
        >
          {FREE_TIER_NOTICE}
        </p>
        <p className="mt-2 text-[12px] text-[#64748b]">
          Today:{" "}
          <span className="font-semibold text-[#0f172a] dark:text-foreground">
            {quota.usedToday} / {quota.maxAiRequestsPerDay}
          </span>{" "}
          used · Up to{" "}
          <span className="font-semibold text-[#0f172a] dark:text-foreground">
            {quota.maxFilesThisUpload}
          </span>{" "}
          file{quota.maxFilesThisUpload !== 1 ? "s" : ""} per upload (max{" "}
          {quota.maxFilesPerUpload})
        </p>
      </div>
    </div>
  );
}
