"use client";

import { useCallback, useRef, useState } from "react";
import { FileText, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/candidates/status-badge";
import type { Candidate, ProcessingStatus } from "@/types/candidate";
import { cn } from "@/lib/utils";

interface UploadItem {
  id: string;
  filename: string;
  status: ProcessingStatus;
  error?: string;
}

export function UploadZone() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [items, setItems] = useState<UploadItem[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const pollStatus = useCallback(
    (ids: string[]) => {
      stopPolling();
      pollRef.current = setInterval(async () => {
        try {
          const res = await fetch("/api/candidates?all=true");
          const data = await res.json();
          const all = (data.candidates ?? []) as Candidate[];
          const tracked = all.filter((c) => ids.includes(c.id));

          setItems(
            ids.map((id) => {
              const c = tracked.find((t) => t.id === id);
              return {
                id,
                filename: c?.original_filename ?? "Unknown",
                status: c?.processing_status ?? "pending",
                error: c?.error_message ?? undefined,
              };
            }),
          );

          const stillRunning = tracked.some(
            (c) =>
              c.processing_status === "pending" ||
              c.processing_status === "processing",
          );

          if (!stillRunning) {
            stopPolling();
            const failed = tracked.filter(
              (c) => c.processing_status === "failed",
            ).length;
            const done = tracked.filter(
              (c) => c.processing_status === "completed",
            ).length;
            if (failed > 0) {
              toast.warning(`${done} completed, ${failed} failed`);
            } else {
              toast.success(`${done} resumes processed successfully`);
            }
          }
        } catch {
          /* keep polling */
        }
      }, 1500);
    },
    [stopPolling],
  );

  const handleFiles = useCallback((files: FileList | File[]) => {
    const valid = Array.from(files).filter((f) =>
      /\.(pdf|docx|doc)$/i.test(f.name),
    );
    if (!valid.length) {
      toast.error("Please upload PDF or Word (.docx) files only");
      return;
    }
    setSelectedFiles((prev) => [...prev, ...valid]);
  }, []);

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const upload = async () => {
    if (!selectedFiles.length) return;

    setIsUploading(true);
    const formData = new FormData();
    selectedFiles.forEach((f) => formData.append("files", f));

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Upload failed");
      }

      const ids: string[] = data.ids;
      setItems(
        ids.map((id, i) => ({
          id,
          filename: selectedFiles[i]?.name ?? "Resume",
          status: "pending" as ProcessingStatus,
        })),
      );
      setSelectedFiles([]);
      pollStatus(ids);
      toast.success(`Uploaded ${ids.length} resume(s) — processing started`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const completed = items.filter((i) => i.status === "completed").length;
  const total = items.length;
  const progressPct = total ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "cursor-pointer rounded-xl border-2 border-dashed p-12 text-center transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border/80 hover:border-primary/40 hover:bg-muted/30",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.doc"
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <Upload className="h-7 w-7 text-primary" />
        </div>
        <h3 className="text-lg font-semibold">Drop resumes here</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          PDF or Word — multiple files supported. PII is scrubbed before AI
          processing.
        </p>
      </div>

      {selectedFiles.length > 0 && (
        <Card className="border-border/60">
          <CardContent className="space-y-3 pt-6">
            <p className="text-sm font-medium">
              {selectedFiles.length} file(s) ready to upload
            </p>
            <ul className="space-y-2">
              {selectedFiles.map((file, i) => (
                <li
                  key={`${file.name}-${i}`}
                  className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-sm"
                >
                  <span className="flex items-center gap-2 truncate">
                    <FileText className="h-4 w-4 shrink-0" />
                    {file.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(i);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
            <Button onClick={upload} disabled={isUploading} className="w-full">
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Process resumes"
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {items.length > 0 && (
        <Card className="border-border/60">
          <CardContent className="space-y-4 pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Processing progress</p>
              <span className="text-sm text-muted-foreground">
                {completed} / {total} completed
              </span>
            </div>
            <Progress value={progressPct} />
            <ul className="space-y-2">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2.5 text-sm"
                >
                  <span className="truncate">{item.filename}</span>
                  <div className="flex items-center gap-2">
                    {item.error && (
                      <span className="max-w-[120px] truncate text-xs text-destructive">
                        {item.error}
                      </span>
                    )}
                    <StatusBadge status={item.status} />
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
