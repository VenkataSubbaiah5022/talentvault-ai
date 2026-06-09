"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  AlertTriangle,
  Download,
  LayoutGrid,
  List,
  Monitor,
  Moon,
  Sun,
  Trash2,
  Upload,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRecruiterPreferences } from "@/hooks/use-recruiter-preferences";
import { exportCandidatesCsv } from "@/lib/candidates/export";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Candidate, CandidateSort, DashboardInsights } from "@/types/candidate";

const THEME_OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

function SettingsSection({
  title,
  description,
  children,
  danger,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <section
      className={cn(
        "rounded-xl border bg-white p-5 shadow-sm dark:bg-card",
        danger
          ? "border-red-200 dark:border-red-900/40"
          : "border-[#e8ecf4] dark:border-border/60",
      )}
    >
      <div className="mb-4">
        <h2
          className={cn(
            "text-[15px] font-semibold",
            danger ? "text-red-700" : "text-[#0f172a] dark:text-foreground",
          )}
        >
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-[13px] text-[#64748b] dark:text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

function PreferenceToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 py-3">
      <div>
        <p className="text-[13px] font-medium text-[#0f172a] dark:text-foreground">
          {label}
        </p>
        <p className="mt-0.5 text-[12px] text-[#64748b]">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-[#7C3AED]" : "bg-[#e2e8f0]",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
            checked && "translate-x-5",
          )}
        />
      </button>
    </label>
  );
}

export function SettingsView() {
  const { theme, setTheme } = useTheme();
  const { preferences, updatePreferences } = useRecruiterPreferences();
  const [mounted, setMounted] = useState(false);
  const [insights, setInsights] = useState<DashboardInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [clearing, setClearing] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setInsights)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await fetch("/api/candidates?all=true");
      const data = await res.json();
      const candidates = (data.candidates ?? []) as Candidate[];
      if (!candidates.length) {
        toast.info("No candidates to export yet");
        return;
      }
      exportCandidatesCsv(candidates, "talent-vault-export.csv");
      toast.success(`Exported ${candidates.length} candidates`);
    } catch {
      toast.error("Export failed");
    } finally {
      setExporting(false);
    }
  };

  const handleClearVault = async () => {
    if (!insights?.totalCandidates) {
      toast.info("Your vault is already empty");
      return;
    }

    const confirmed = window.confirm(
      `Delete all ${insights.totalCandidates} candidates and their resume files? This cannot be undone.`,
    );
    if (!confirmed) return;

    setClearing(true);
    try {
      const res = await fetch("/api/candidates?all=true");
      const data = await res.json();
      const candidates = (data.candidates ?? []) as Candidate[];

      for (const c of candidates) {
        await fetch(`/api/candidates/${c.id}`, { method: "DELETE" });
      }

      setInsights((prev) =>
        prev
          ? {
              ...prev,
              totalCandidates: 0,
              readyToHire: 0,
              skillsIndexed: 0,
              pipeline: {
                completed: 0,
                pending: 0,
                processing: 0,
                failed: 0,
                total: 0,
              },
            }
          : prev,
      );
      toast.success("Vault cleared");
    } catch {
      toast.error("Could not clear vault");
    } finally {
      setClearing(false);
    }
  };

  const needsAttention =
    insights &&
    (insights.pipeline.pending > 0 ||
      insights.pipeline.processing > 0 ||
      insights.pipeline.failed > 0);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-[26px] font-semibold tracking-tight text-[#0f172a] dark:text-foreground">
          Settings
        </h1>
        <p className="text-[14px] text-[#64748b] dark:text-muted-foreground">
          Tune how you search, upload, and manage your talent vault.
        </p>
      </div>

      {needsAttention && insights && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/40 dark:bg-amber-950/30">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div className="flex-1">
            <p className="text-[13px] font-medium text-amber-900 dark:text-amber-200">
              {insights.pipeline.pending + insights.pipeline.processing} resume
              {insights.pipeline.pending + insights.pipeline.processing !== 1
                ? "s"
                : ""}{" "}
              still processing
              {insights.pipeline.failed > 0 &&
                ` · ${insights.pipeline.failed} need review`}
            </p>
            <Link
              href="/upload"
              className="mt-1 inline-block text-[13px] font-medium text-[#7C3AED] hover:underline"
            >
              Go to Upload to process or fix →
            </Link>
          </div>
        </div>
      )}

      <SettingsSection
        title="Search & browse"
        description="Defaults for Search Talent and All Candidates."
      >
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-[13px] font-medium text-[#0f172a] dark:text-foreground">
              Default view
            </p>
            <div className="flex rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-0.5 dark:border-border dark:bg-muted/40">
              <button
                type="button"
                onClick={() => updatePreferences({ defaultView: "cards" })}
                className={cn(
                  "inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-[13px] font-medium transition-colors",
                  preferences.defaultView === "cards"
                    ? "bg-white text-[#7C3AED] shadow-sm dark:bg-card"
                    : "text-[#64748b] hover:text-[#0f172a]",
                )}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                Card view
              </button>
              <button
                type="button"
                onClick={() => updatePreferences({ defaultView: "table" })}
                className={cn(
                  "inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-[13px] font-medium transition-colors",
                  preferences.defaultView === "table"
                    ? "bg-white text-[#7C3AED] shadow-sm dark:bg-card"
                    : "text-[#64748b] hover:text-[#0f172a]",
                )}
              >
                <List className="h-3.5 w-3.5" />
                Table view
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-[13px] font-medium text-[#0f172a] dark:text-foreground">
                Default sort
              </p>
              <Select
                value={preferences.defaultSort}
                onValueChange={(v) =>
                  updatePreferences({ defaultSort: v as CandidateSort })
                }
              >
                <SelectTrigger className="h-9 w-full rounded-lg text-[13px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recently added</SelectItem>
                  <SelectItem value="name">Name (A–Z)</SelectItem>
                  <SelectItem value="experience">Most experience</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="mb-2 text-[13px] font-medium text-[#0f172a] dark:text-foreground">
                Results per page
              </p>
              <Select
                value={String(preferences.rowsPerPage)}
                onValueChange={(v) =>
                  updatePreferences({ rowsPerPage: Number(v) })
                }
              >
                <SelectTrigger className="h-9 w-full rounded-lg text-[13px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="8">8</SelectItem>
                  <SelectItem value="9">9</SelectItem>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="24">24</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border-t border-[#f1f5f9] pt-1 dark:border-border/40">
            <PreferenceToggle
              label="Ready to hire only"
              description="Hide candidates still processing or needing review from search results."
              checked={preferences.readyToHireOnly}
              onChange={(readyToHireOnly) =>
                updatePreferences({ readyToHireOnly })
              }
            />
          </div>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Upload workflow"
        description="Control what happens after you add resumes."
      >
        <PreferenceToggle
          label="Process automatically"
          description="Start AI extraction right after upload instead of clicking Start Processing."
          checked={preferences.autoProcessUploads}
          onChange={(autoProcessUploads) =>
            updatePreferences({ autoProcessUploads })
          }
        />
        <Link
          href="/upload"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "mt-3 inline-flex h-9 rounded-lg border-[#e2e8f0] text-[13px]",
          )}
        >
          <Upload className="mr-1.5 h-4 w-4" />
          Open upload page
        </Link>
      </SettingsSection>

      <SettingsSection
        title="Vault data"
        description="Export or manage candidates in your vault."
      >
        {loading ? (
          <Skeleton className="h-20 w-full rounded-lg" />
        ) : insights ? (
          <dl className="mb-4 grid grid-cols-2 gap-3 text-[13px] sm:grid-cols-4">
            <div className="rounded-lg bg-[#f8fafc] p-3 dark:bg-muted/30">
              <dt className="text-[#64748b]">In vault</dt>
              <dd className="mt-1 text-lg font-semibold text-[#0f172a] dark:text-foreground">
                {insights.totalCandidates}
              </dd>
            </div>
            <div className="rounded-lg bg-[#f8fafc] p-3 dark:bg-muted/30">
              <dt className="text-[#64748b]">Ready</dt>
              <dd className="mt-1 text-lg font-semibold text-emerald-600">
                {insights.readyToHire}
              </dd>
            </div>
            <div className="rounded-lg bg-[#f8fafc] p-3 dark:bg-muted/30">
              <dt className="text-[#64748b]">In pipeline</dt>
              <dd className="mt-1 text-lg font-semibold text-blue-600">
                {insights.pipeline.pending + insights.pipeline.processing}
              </dd>
            </div>
            <div className="rounded-lg bg-[#f8fafc] p-3 dark:bg-muted/30">
              <dt className="text-[#64748b]">Need review</dt>
              <dd className="mt-1 text-lg font-semibold text-amber-600">
                {insights.pipeline.failed}
              </dd>
            </div>
          </dl>
        ) : null}

        <Button
          variant="outline"
          className="h-9 rounded-lg border-[#e2e8f0] text-[13px]"
          onClick={handleExport}
          disabled={exporting}
        >
          <Download className="mr-1.5 h-4 w-4" />
          {exporting ? "Exporting…" : "Export all candidates (CSV)"}
        </Button>
      </SettingsSection>

      <SettingsSection
        title="Appearance"
        description="Display theme for your workspace."
      >
        {mounted ? (
          <div className="flex rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-0.5 dark:border-border dark:bg-muted/40">
            {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setTheme(value)}
                className={cn(
                  "inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-[13px] font-medium transition-colors",
                  theme === value
                    ? "bg-white text-[#7C3AED] shadow-sm dark:bg-card"
                    : "text-[#64748b] hover:text-[#0f172a]",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>
        ) : (
          <Skeleton className="h-10 w-full rounded-lg" />
        )}
      </SettingsSection>

      <SettingsSection
        title="Privacy"
        description="How candidate data is handled in your vault."
      >
        <ul className="space-y-2 text-[13px] leading-relaxed text-[#64748b]">
          <li>Contact details are detected and scrubbed before AI reads a resume.</li>
          <li>Only structured profile data is stored for search and filtering.</li>
          <li>Original resume files stay in your vault and are not shared externally.</li>
        </ul>
      </SettingsSection>

      <SettingsSection
        title="Danger zone"
        description="Permanently remove all candidates and resume files from your vault."
        danger
      >
        <Button
          variant="outline"
          className="h-9 rounded-lg border-red-200 text-[13px] text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={handleClearVault}
          disabled={clearing}
        >
          <Trash2 className="mr-1.5 h-4 w-4" />
          {clearing ? "Clearing…" : "Clear entire vault"}
        </Button>
      </SettingsSection>
    </div>
  );
}
