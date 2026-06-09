"use client";

import { useCallback, useRef, useState } from "react";
import { FileText, Loader2, Shield, Sparkles, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const steps = [
  { icon: Upload, label: "Upload files" },
  { icon: Shield, label: "Scrub PII" },
  { icon: Sparkles, label: "AI extraction" },
];

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
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
        {steps.map(({ icon: Icon, label }, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <Icon className="h-3.5 w-3.5 text-primary" />
              {label}
            </div>
            {i < steps.length - 1 && (
              <span className="hidden text-muted-foreground/50 sm:inline">→</span>
            )}
          </div>
        ))}
      </div>

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
          "surface-card cursor-pointer border-2 border-dashed p-12 text-center transition-all",
          isDragging
            ? "border-primary bg-primary/5 scale-[1.01] shadow-lg shadow-primary/10"
            : "hover:border-primary/40 hover:bg-muted/20",
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
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Upload className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-semibold">Drop resumes here</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          PDF or Word — multiple files supported. Contact details are scrubbed
          before any AI processing.
        </p>
        <p className="mt-4 text-xs text-muted-foreground">
          or click to browse files
        </p>
      </div>

      {selectedFiles.length > 0 && (
        <Card className="surface-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              Ready to process ({selectedFiles.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="space-y-2">
              {selectedFiles.map((file, i) => (
                <li
                  key={`${file.name}-${i}`}
                  className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 px-3 py-2.5 text-sm"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <FileText className="h-4 w-4 shrink-0 text-primary" />
                    <span className="truncate">{file.name}</span>
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0"
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
        <Card className="surface-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Processing progress</CardTitle>
              <span className="text-sm text-muted-foreground">
                {completed} / {total} completed
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={progressPct} className="h-2" />
            <ul className="space-y-2">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5 text-sm"
                >
                  <span className="flex min-w-0 items-center gap-2 truncate">
                    <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                    {item.filename}
                  </span>
                  <div className="flex shrink-0 items-center gap-2">
                    {item.error && (
                      <span className="max-w-[140px] truncate text-xs text-destructive">
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
