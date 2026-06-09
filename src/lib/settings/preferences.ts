import type { CandidateSort } from "@/types/candidate";

export const PREFERENCES_STORAGE_KEY = "talentvault-preferences";
export const PREFERENCES_CHANGE_EVENT = "talentvault-preferences-change";

export interface RecruiterPreferences {
  defaultView: "cards" | "table";
  defaultSort: CandidateSort;
  rowsPerPage: number;
  readyToHireOnly: boolean;
  autoProcessUploads: boolean;
}

export const DEFAULT_PREFERENCES: RecruiterPreferences = {
  defaultView: "cards",
  defaultSort: "recent",
  rowsPerPage: 9,
  readyToHireOnly: false,
  autoProcessUploads: false,
};

export function loadPreferences(): RecruiterPreferences {
  if (typeof window === "undefined") return DEFAULT_PREFERENCES;

  try {
    const raw = localStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (!raw) return DEFAULT_PREFERENCES;
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferences(
  partial: Partial<RecruiterPreferences>,
): RecruiterPreferences {
  const next = { ...loadPreferences(), ...partial };
  localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(
    new CustomEvent(PREFERENCES_CHANGE_EVENT, { detail: next }),
  );
  return next;
}
