import { getHireStatus, HIRE_STATUS_CONFIG } from "@/lib/candidates/hire-status";
import type { Candidate } from "@/types/candidate";

export function exportCandidatesCsv(candidates: Candidate[], filename = "candidates.csv") {
  const headers = [
    "Name",
    "Job Title",
    "Experience (years)",
    "Location",
    "Skills",
    "Status",
    "Email",
    "Added",
  ];

  const rows = candidates.map((c) => {
    const hireStatus = HIRE_STATUS_CONFIG[getHireStatus(c.processing_status)].label;
    return [
      c.name ?? c.original_filename,
      c.recent_job_title ?? "",
      c.years_experience?.toString() ?? "",
      c.location ?? "",
      (c.skills ?? []).join("; "),
      hireStatus,
      c.email ?? "",
      c.created_at,
    ];
  });

  const escape = (value: string) =>
    `"${value.replace(/"/g, '""')}"`;

  const csv = [headers, ...rows]
    .map((row) => row.map(escape).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
