"use client";

import { useSyncExternalStore } from "react";

/**
 * Theme store — night service (default) vs day service. Hydration-safe:
 * the server snapshot is always "dark" (the :root default), so SSG markup
 * matches first paint; the resolved theme hydrates in.
 *
 * Persistence records only an EXPLICIT choice ("light"/"dark"). Absence
 * means "follow the platform" — the CSS media query owns that case, so the
 * no-flash script never has to touch the DOM for system-preference users.
 */

type Choice = "light" | "dark";
const KEY = "jccl.theme.v1";
const listeners = new Set<() => void>();

/** Inline this in <head> before paint so an explicit choice never flashes. */
export const NO_FLASH_SCRIPT = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  KEY,
)});if(t==="light"||t==="dark"){document.documentElement.dataset.theme=t;}}catch(e){}})();`;

function canStore(): boolean {
  try {
    return typeof window !== "undefined" && Boolean(window.localStorage);
  } catch {
    return false;
  }
}

function readChoice(): Choice | null {
  if (!canStore()) return null;
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "light" || v === "dark" ? v : null;
  } catch {
    return null;
  }
}

function systemPrefersLight(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: light)").matches
  );
}

function applyToRoot(choice: Choice | null): void {
  if (typeof document === "undefined") return;
  if (choice) document.documentElement.dataset.theme = choice;
  else delete document.documentElement.dataset.theme;
}

let snapshot: "light" | "dark" = "dark";

function refresh(): void {
  const c = readChoice();
  snapshot = c ?? (systemPrefersLight() ? "light" : "dark");
}

/** The theme actually in effect right now ("light" | "dark"). */
export function resolvedTheme(): "light" | "dark" {
  refresh();
  return snapshot;
}

/** Set the running service. "system" clears the override back to the OS. */
export function setService(choice: Choice | "system"): void {
  if (!canStore()) return;
  try {
    if (choice === "system") window.localStorage.removeItem(KEY);
    else window.localStorage.setItem(KEY, choice);
  } catch {
    return;
  }
  applyToRoot(choice === "system" ? null : choice);
  refresh();
  for (const fn of listeners) fn();
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  const onStorage = (e: StorageEvent) => {
    if (e.key === null || e.key === KEY) {
      refresh();
      onChange();
    }
  };
  let mql: MediaQueryList | null = null;
  const onMedia = () => {
    refresh();
    onChange();
  };
  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorage);
    if (typeof window.matchMedia === "function") {
      mql = window.matchMedia("(prefers-color-scheme: light)");
      mql.addEventListener?.("change", onMedia);
    }
  }
  return () => {
    listeners.delete(onChange);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage);
      mql?.removeEventListener?.("change", onMedia);
    }
  };
}

/** Resolved theme as a hook. Server-renders "dark" (the :root default). */
export function useResolvedTheme(): "light" | "dark" {
  return useSyncExternalStore(subscribe, resolvedTheme, () => "dark");
}

/** Test-only: reset module state between cases. */
export function _resetTheme(): void {
  snapshot = "dark";
  listeners.clear();
}
