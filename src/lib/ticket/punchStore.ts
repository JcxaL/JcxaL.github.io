"use client";

import { useSyncExternalStore } from "react";

/**
 * punchStore — the persistent ticket (doc 06: "the punched ticket persists
 * as session progress"). Station codes are punched into localStorage the
 * first time their exhibit is visited; the record survives reloads and
 * syncs across tabs via the storage event.
 *
 * Hydration safety: the server snapshot is always the empty journey, so
 * SSG markup matches the first client render; punches appear after mount
 * via useSyncExternalStore's subscription (no hydration mismatch).
 */

const KEY = "jccl.ticket.v1";

interface StoredTicket {
  v: 1;
  /** Station codes in first-punch order. */
  punches: string[];
}

const EMPTY: readonly string[] = Object.freeze([]);

/** Module-level snapshot cache — useSyncExternalStore needs stable refs. */
let snapshot: readonly string[] = EMPTY;
const listeners = new Set<() => void>();

function canStore(): boolean {
  try {
    return typeof window !== "undefined" && Boolean(window.localStorage);
  } catch {
    return false;
  }
}

function parse(raw: string | null): readonly string[] {
  if (!raw) return EMPTY;
  try {
    const data = JSON.parse(raw) as Partial<StoredTicket>;
    if (data.v !== 1 || !Array.isArray(data.punches)) return EMPTY;
    const codes = data.punches.filter(
      (c): c is string => typeof c === "string" && /^[A-Z]\d{2}$/.test(c),
    );
    return Object.freeze([...new Set(codes)]);
  } catch {
    return EMPTY;
  }
}

function refresh(): void {
  if (!canStore()) return;
  const next = parse(window.localStorage.getItem(KEY));
  // Keep the reference stable when the contents are unchanged.
  if (
    next.length !== snapshot.length ||
    next.some((code, i) => code !== snapshot[i])
  ) {
    snapshot = next;
  }
}

function emit(): void {
  for (const fn of listeners) fn();
}

/** Punch a station code onto the ticket (idempotent). */
export function punchStation(code: string): void {
  if (!canStore()) return;
  refresh();
  if (snapshot.includes(code)) return;
  const next: StoredTicket = { v: 1, punches: [...snapshot, code] };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    return; // storage full/blocked — the journey just isn't recorded
  }
  snapshot = Object.freeze(next.punches);
  emit();
}

/** Tear up the ticket (start a fresh journey). */
export function clearPunches(): void {
  if (!canStore()) return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    return;
  }
  snapshot = EMPTY;
  emit();
}

export function getPunches(): readonly string[] {
  refresh();
  return snapshot;
}

function getServerPunches(): readonly string[] {
  return EMPTY;
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  // Cross-tab sync: another tab's punch fires storage on this one.
  const onStorage = (e: StorageEvent) => {
    if (e.key === null || e.key === KEY) {
      refresh();
      onChange();
    }
  };
  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorage);
  }
  return () => {
    listeners.delete(onChange);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage);
    }
  };
}

/** The punched journey, oldest first. Server-renders as empty. */
export function usePunches(): readonly string[] {
  return useSyncExternalStore(subscribe, getPunches, getServerPunches);
}

/** Test-only: reset module state between cases. */
export function _resetPunchStore(): void {
  snapshot = EMPTY;
  listeners.clear();
}
