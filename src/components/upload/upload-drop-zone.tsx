"use client";

import { useRef, useState } from "react";
import { CloudUpload, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UPLOAD_LIMITS } from "@/lib/upload/limits";
import { cn } from "@/lib/utils";
import type { UploadQuotaInfo } from "@/components/upload/upload-quota-banner";

interface UploadDropZoneProps {
  onFilesSelected: (files: File[]) => void;
  isUploading: boolean;
  disabled?: boolean;
  quota: UploadQuotaInfo | null;
}

export function UploadDropZone({
  onFilesSelected,
  isUploading,
  disabled,
  quota,
}: UploadDropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const maxFiles = quota?.maxFilesThisUpload ?? UPLOAD_LIMITS.maxFilesPerUpload;
  const uploadDisabled = disabled || isUploading || maxFiles === 0;

  const validateAndEmit = (fileList: FileList | File[]) => {
    if (maxFiles === 0) {
      window.alert(
        "Daily AI limit reached (20/day on Gemini free tier). Try again tomorrow.",
      );
      return;
    }

    const files = Array.from(fileList).filter((f) =>
      /\.(pdf|docx|doc)$/i.test(f.name),
    );

    if (!files.length) return;

    const oversized = files.filter(
      (f) => f.size > UPLOAD_LIMITS.maxFileSizeBytes,
    );
    if (oversized.length) {
      window.alert(
        `Some files exceed 10MB: ${oversized.map((f) => f.name).join(", ")}`,
      );
      return;
    }

    if (files.length > maxFiles) {
      window.alert(
        `Gemini free tier allows up to ${maxFiles} resume(s) per upload (${UPLOAD_LIMITS.maxFilesPerUpload} max per batch, ${quota?.remainingToday ?? UPLOAD_LIMITS.maxAiRequestsPerDay} remaining today). Please select fewer files.`,
      );
      return;
    }

    onFilesSelected(files);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-[#e8ecf4] bg-white shadow-sm dark:border-border/60 dark:bg-card">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!uploadDisabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (!uploadDisabled) validateAndEmit(e.dataTransfer.files);
        }}
        className={cn(
          "border-b border-dashed border-[#e2e8f0] px-6 py-10 text-center transition-colors dark:border-border/60",
          isDragging && "bg-violet-50/50 dark:bg-violet-950/20",
          uploadDisabled && "opacity-60",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.doc"
          className="hidden"
          disabled={uploadDisabled}
          onChange={(e) => {
            if (e.target.files) validateAndEmit(e.target.files);
            e.target.value = "";
          }}
        />

        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-[#7C3AED]">
          <CloudUpload className="h-7 w-7" strokeWidth={1.75} />
        </div>

        <p className="text-[15px] font-medium text-[#0f172a] dark:text-foreground">
          Drag &amp; drop your files here
        </p>
        <p className="mt-1 text-[13px] text-[#64748b]">or</p>

        <Button
          type="button"
          variant="outline"
          disabled={uploadDisabled}
          className="mt-4 h-10 rounded-lg border-[#7C3AED] px-5 text-[13px] font-medium text-[#7C3AED] hover:bg-violet-50"
          onClick={() => inputRef.current?.click()}
        >
          Browse Files
        </Button>

        <p className="mt-5 text-[12px] text-[#94a3b8]">
          PDF or DOCX · Max 10MB per file · Max{" "}
          <span className="font-medium text-[#64748b]">{maxFiles}</span> file
          {maxFiles !== 1 ? "s" : ""} per upload (Gemini free tier)
        </p>
      </div>

      <div className="flex items-start gap-3 bg-violet-50/80 px-5 py-3.5 dark:bg-violet-950/30">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-[#7C3AED]">
          <Shield className="h-4 w-4" />
        </div>
        <div>
          <p className="text-[13px] font-medium text-[#0f172a] dark:text-foreground">
            Your data is secure &amp; private
          </p>
          <p className="mt-0.5 text-[12px] leading-relaxed text-[#64748b]">
            We extract the information and store it securely. Resumes are never
            shared.
          </p>
        </div>
      </div>
    </div>
  );
}
