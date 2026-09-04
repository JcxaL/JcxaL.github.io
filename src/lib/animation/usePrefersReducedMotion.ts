"use client";

import { useEffect, useState } from "react";

/**
 * Reduced-motion preference hook (CLAUDE.md rule 4).
 * Defaults to REDUCED when matchMedia is unavailable (SSR, jsdom) — the
 * no-motion-first baseline; motion is the enhancement that switches on.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mql.matches);
    update();
    mql.addEventListener?.("change", update);
    return () => mql.removeEventListener?.("change", update);
  }, []);

  return reduced;
}
