"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DEFAULT_PREFERENCES,
  loadPreferences,
  PREFERENCES_CHANGE_EVENT,
  savePreferences,
  type RecruiterPreferences,
} from "@/lib/settings/preferences";

export function useRecruiterPreferences() {
  const [preferences, setPreferences] =
    useState<RecruiterPreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    setPreferences(loadPreferences());

    const onChange = (event: Event) => {
      const detail = (event as CustomEvent<RecruiterPreferences>).detail;
      if (detail) setPreferences(detail);
    };

    window.addEventListener(PREFERENCES_CHANGE_EVENT, onChange);
    return () => window.removeEventListener(PREFERENCES_CHANGE_EVENT, onChange);
  }, []);

  const updatePreferences = useCallback(
    (partial: Partial<RecruiterPreferences>) => {
      setPreferences(savePreferences(partial));
    },
    [],
  );

  return { preferences, updatePreferences };
}
