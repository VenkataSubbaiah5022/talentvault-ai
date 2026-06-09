"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { UploadPageHeader } from "@/components/upload/upload-page-header";
import { UploadDropZone } from "@/components/upload/upload-drop-zone";
import {
  UploadQuotaBanner,
  type UploadQuotaInfo,
} from "@/components/upload/upload-quota-banner";
import {
  UploadFilesTable,
  type UploadFileItem,
} from "@/components/upload/upload-files-table";
import { UploadSidebar } from "@/components/upload/upload-sidebar";
import { processCandidatesQueued } from "@/lib/process/client-queue";
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
  const [quota, setQuota] = useState<UploadQuotaInfo | null>(null);
  const fileSizesRef = useRef<Record<string, number>>({});
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeBatchRef = useRef<Set<string>>(new Set());
  const pollCountRef = useRef(0);

  const POLL_INTERVAL_MS = 3000;
  const MAX_POLL_ITERATIONS = 120;

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    activeBatchRef.current.clear();
    pollCountRef.current = 0;
  }, []);

  const refreshBatchItems = useCallback(
    async (batchIds: Set<string>) => {
      const res = await fetch("/api/candidates?all=true");
      const data = await res.json();
      const candidates = (data.candidates ?? []) as Candidate[];

      setItems((prev) => {
        const prevIds = new Set(prev.map((p) => p.id));
        const byId = new Map(
          candidates
            .filter((c) => prevIds.has(c.id))
            .map((c) => [c.id, mapCandidate(c, fileSizesRef.current)]),
        );

        const merged = prev.map((item) => byId.get(item.id) ?? item);
        const batchItems = merged.filter((i) => batchIds.has(i.id));
        const stillRunning = batchItems.some(
          (i) => i.status === "pending" || i.status === "processing",
        );

        if (!stillRunning && batchIds.size > 0) {
          stopPolling();
          setIsProcessing(false);
          const failed = batchItems.filter((i) => i.status === "failed").length;
          const done = batchItems.filter(
            (i) => i.status === "completed",
          ).length;
          if (failed > 0) {
            toast.warning(`${done} completed, ${failed} failed`);
          } else if (done > 0) {
            toast.success(`${done} resume(s) processed successfully`);
          }
        }

        return merged;
      });
    },
    [stopPolling],
  );

  const startPolling = useCallback(
    (batchIds: string[]) => {
      if (!batchIds.length) return;

      stopPolling();
      activeBatchRef.current = new Set(batchIds);
      pollCountRef.current = 0;

      pollRef.current = setInterval(async () => {
        pollCountRef.current += 1;
        if (pollCountRef.current > MAX_POLL_ITERATIONS) {
          stopPolling();
          setIsProcessing(false);
          toast.warning(
            "Stopped status checks — click Start Processing to retry if needed",
          );
          return;
        }

        try {
          await refreshBatchItems(activeBatchRef.current);
        } catch {
          /* retry on next tick */
        }
      }, POLL_INTERVAL_MS);
    },
    [refreshBatchItems, stopPolling],
  );

  const loadQuota = useCallback(async () => {
    try {
      const res = await fetch("/api/upload/limits");
      if (res.ok) {
        setQuota(await res.json());
      }
    } catch {
      /* optional */
    }
  }, []);

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
    } catch {
      toast.error("Could not load uploaded files");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFiles();
    loadQuota();
    return () => stopPolling();
  }, [loadFiles, loadQuota, stopPolling]);

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

      await loadQuota();

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
      toast.success(`Uploaded ${uploaded.length} file(s)`);

      if (autoProcess) {
        const batchIds = uploaded.map((f) => f.id);
        setIsProcessing(true);
        startPolling(batchIds);
        await processCandidatesQueued(batchIds);
        await refreshBatchItems(new Set(batchIds));
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleStartProcessing = async () => {
    const pending = items.filter(
      (i) =>
        i.status === "pending" ||
        i.status === "failed" ||
        i.status === "processing",
    );
    if (!pending.length) return;

    const batchIds = pending.map((item) => item.id);
    setIsProcessing(true);
    startPolling(batchIds);
    try {
      await processCandidatesQueued(batchIds);
      await refreshBatchItems(new Set(batchIds));
    } catch {
      toast.error("Failed to start processing");
      stopPolling();
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
    await loadQuota();
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
    await loadQuota();
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
        {quota && <UploadQuotaBanner quota={quota} />}
        <UploadDropZone
          onFilesSelected={handleUpload}
          isUploading={isUploading}
          quota={quota}
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
