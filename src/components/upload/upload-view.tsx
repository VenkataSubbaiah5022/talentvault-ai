"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { UploadPageHeader } from "@/components/upload/upload-page-header";
import { UploadDropZone } from "@/components/upload/upload-drop-zone";
import {
  UploadFilesTable,
  type UploadFileItem,
} from "@/components/upload/upload-files-table";
import { UploadSidebar } from "@/components/upload/upload-sidebar";
import { loadPreferences } from "@/lib/settings/preferences";
import type { Candidate, ProcessingStatus } from "@/types/candidate";

function mapCandidate(c: Candidate, sizes: Record<string, number>): UploadFileItem {
  return {
    id: c.id,
    filename: c.original_filename,
    size: sizes[c.id] ?? null,
    status: c.processing_status,
    error: c.error_message ?? undefined,
    created_at: c.created_at,
  };
}

export function UploadView() {
  const [items, setItems] = useState<UploadFileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileSizesRef = useRef<Record<string, number>>({});
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const startPolling = useCallback(() => {
    stopPolling();
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch("/api/candidates?all=true");
        const data = await res.json();
        const candidates = (data.candidates ?? []) as Candidate[];

        setItems((prev) => {
          const prevIds = new Set(prev.map((p) => p.id));
          const updated = candidates
            .filter((c) => prevIds.has(c.id))
            .sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime(),
            )
            .map((c) => mapCandidate(c, fileSizesRef.current));

          const stillRunning = updated.some(
            (i) => i.status === "pending" || i.status === "processing",
          );

          if (!stillRunning) {
            stopPolling();
            setIsProcessing(false);
            const failed = updated.filter((i) => i.status === "failed").length;
            const done = updated.filter(
              (i) => i.status === "completed",
            ).length;
            if (failed > 0) {
              toast.warning(`${done} completed, ${failed} failed`);
            } else if (done > 0) {
              toast.success(`${done} resumes processed successfully`);
            }
          }

          return updated.length ? updated : prev;
        });
      } catch {
        /* keep polling */
      }
    }, 1500);
  }, [stopPolling]);

  const loadFiles = useCallback(async () => {
    try {
      const res = await fetch("/api/candidates?all=true");
      const data = await res.json();
      const candidates = (data.candidates ?? []) as Candidate[];
      const sorted = candidates
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        )
        .map((c) => mapCandidate(c, fileSizesRef.current));

      setItems(sorted);

      if (sorted.some((i) => i.status === "processing")) {
        setIsProcessing(true);
        startPolling();
      }
    } catch {
      toast.error("Could not load uploaded files");
    } finally {
      setLoading(false);
    }
  }, [startPolling]);

  useEffect(() => {
    loadFiles();
    return () => stopPolling();
  }, [loadFiles, stopPolling]);

  const handleUpload = async (files: File[]) => {
    setIsUploading(true);
    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));
    const autoProcess = loadPreferences().autoProcessUploads;
    formData.append("autoProcess", autoProcess ? "true" : "false");

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Upload failed");
      }

      const uploaded: { id: string; filename: string; size: number }[] =
        data.files ?? [];
      uploaded.forEach((f) => {
        fileSizesRef.current[f.id] = f.size;
      });

      const newItems: UploadFileItem[] = uploaded.map((f) => ({
        id: f.id,
        filename: f.filename,
        size: f.size,
        status: "pending" as ProcessingStatus,
        created_at: new Date().toISOString(),
      }));

      setItems((prev) => [...newItems, ...prev]);
      if (autoProcess) {
        setIsProcessing(true);
        startPolling();
        toast.success(
          `Uploaded ${uploaded.length} file(s) — processing started`,
        );
      } else {
        toast.success(`Uploaded ${uploaded.length} file(s)`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleStartProcessing = async () => {
    const pending = items.filter((i) => i.status === "pending");
    if (!pending.length) return;

    setIsProcessing(true);
    try {
      await Promise.all(
        pending.map((item) =>
          fetch(`/api/process/${item.id}`, { method: "POST" }),
        ),
      );
      startPolling();
    } catch {
      toast.error("Failed to start processing");
      setIsProcessing(false);
    }
  };

  const handleDelete = async (id: string) => {
    const item = items.find((i) => i.id === id);
    const confirmed = window.confirm(
      `Remove ${item?.filename ?? "this file"} from your vault?`,
    );
    if (!confirmed) return;

    const res = await fetch(`/api/candidates/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Could not remove file");
      return;
    }

    setItems((prev) => prev.filter((i) => i.id !== id));
    delete fileSizesRef.current[id];
    toast.success("File removed");
  };

  const handleRemoveAll = async () => {
    if (!items.length) return;
    const confirmed = window.confirm(
      `Remove all ${items.length} files from your vault? This cannot be undone.`,
    );
    if (!confirmed) return;

    for (const item of items) {
      await fetch(`/api/candidates/${item.id}`, { method: "DELETE" });
    }

    setItems([]);
    fileSizesRef.current = {};
    toast.success("All files removed");
  };

  const handleView = async (item: UploadFileItem) => {
    const res = await fetch(`/api/candidates/${item.id}/resume`);
    const data = await res.json();
    if (data.url) {
      window.open(data.url, "_blank");
    } else {
      toast.error("Resume not available");
    }
  };

  const stats = useMemo(() => {
    const counts: Record<ProcessingStatus, number> = {
      completed: 0,
      processing: 0,
      pending: 0,
      failed: 0,
    };
    items.forEach((i) => {
      counts[i.status]++;
    });
    return counts;
  }, [items]);

  return (
    <div className="-mx-7 -my-7 flex min-h-[calc(100vh)]">
      <div className="flex min-w-0 flex-1 flex-col gap-5 px-7 py-7">
        <UploadPageHeader />
        <UploadDropZone
          onFilesSelected={handleUpload}
          isUploading={isUploading}
        />

        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-10 rounded-xl" />
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 rounded-lg" />
            ))}
          </div>
        ) : (
          <UploadFilesTable
            items={items}
            isProcessing={isProcessing}
            onView={handleView}
            onDelete={handleDelete}
            onRemoveAll={handleRemoveAll}
            onStartProcessing={handleStartProcessing}
          />
        )}
      </div>

      <UploadSidebar stats={stats} total={items.length} />
    </div>
  );
}
