"use client";

import { Eye, FileText, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploadStatusBadge } from "@/components/upload/upload-status-badge";
import {
  formatFileSize,
  getProgressBarColor,
  getUploadProgress,
} from "@/lib/upload/format";
import { formatDistanceToNow } from "@/lib/utils/date";
import { shortenErrorMessage } from "@/lib/ai/quota";
import { cn } from "@/lib/utils";
import type { ProcessingStatus } from "@/types/candidate";

export interface UploadFileItem {
  id: string;
  filename: string;
  size: number | null;
  status: ProcessingStatus;
  error?: string;
  created_at: string;
}

interface UploadFilesTableProps {
  items: UploadFileItem[];
  isProcessing: boolean;
  onView: (item: UploadFileItem) => void;
  onDelete: (id: string) => void;
  onRemoveAll: () => void;
  onStartProcessing: () => void;
}

function FileTypeIcon({ filename }: { filename: string }) {
  const isPdf = /\.pdf$/i.test(filename);
  return (
    <div
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
        isPdf ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600",
      )}
    >
      <FileText className="h-4 w-4" />
    </div>
  );
}

export function UploadFilesTable({
  items,
  isProcessing,
  onView,
  onDelete,
  onRemoveAll,
  onStartProcessing,
}: UploadFilesTableProps) {
  const pendingCount = items.filter(
    (i) => i.status === "pending" || i.status === "failed",
  ).length;

  if (!items.length) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-[#e8ecf4] bg-white shadow-sm dark:border-border/60 dark:bg-card">
      <div className="border-b border-[#e8ecf4] px-4 py-3 dark:border-border/60">
        <h2 className="text-[15px] font-semibold text-[#0f172a] dark:text-foreground">
          Uploaded Files ({items.length})
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-left text-[13px]">
          <thead>
            <tr className="border-b border-[#e8ecf4] bg-[#f8fafc] text-[12px] font-medium uppercase tracking-wide text-[#64748b] dark:border-border/60 dark:bg-muted/30">
              <th className="px-4 py-3">File Name</th>
              <th className="px-4 py-3">Size</th>
              <th className="px-4 py-3">Status</th>
              <th className="min-w-[140px] px-4 py-3">Progress</th>
              <th className="px-4 py-3">Added</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const progress = getUploadProgress(item.status);
              const barColor = getProgressBarColor(item.status);

              return (
                <tr
                  key={item.id}
                  className="border-b border-[#f1f5f9] last:border-0 dark:border-border/40"
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <FileTypeIcon filename={item.filename} />
                      <span className="max-w-[200px] truncate font-medium text-[#0f172a] dark:text-foreground">
                        {item.filename}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-[#64748b]">
                    {formatFileSize(item.size)}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="space-y-1">
                      <UploadStatusBadge status={item.status} />
                      {item.status === "failed" && item.error && (
                        <p
                          className="max-w-[180px] text-[11px] leading-snug text-red-600"
                          title={item.error}
                        >
                          {shortenErrorMessage(item.error)}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#e2e8f0]">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            barColor,
                          )}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="w-8 text-right text-[12px] text-[#64748b]">
                        {progress}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-[#64748b]">
                    {formatDistanceToNow(item.created_at)}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-[#64748b] hover:text-[#7C3AED]"
                        onClick={() => onView(item)}
                        aria-label="View file"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-[#64748b] hover:text-red-600"
                        onClick={() => onDelete(item.id)}
                        aria-label="Delete file"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-[#e8ecf4] px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-border/60">
        <p className="text-[13px] text-[#64748b]">
          {items.length} file{items.length !== 1 ? "s" : ""} uploaded
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-9 rounded-lg border-red-200 text-[13px] text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={onRemoveAll}
            disabled={isProcessing}
          >
            Remove all
          </Button>
          <Button
            className="h-9 rounded-lg bg-[#7C3AED] px-4 text-[13px] hover:bg-[#6d28d9]"
            onClick={onStartProcessing}
            disabled={isProcessing || pendingCount === 0}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                Processing…
              </>
            ) : (
              "Start Processing"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
