/**
 * Motion registry — CLAUDE.md rule 5.
 *
 * Every cinematic GSAP timeline registers here under a stable name. When the
 * E2E flag is on (NEXT_PUBLIC_E2E=1 or ?e2e=1), the registry is exposed as
 * window.__motion so Playwright / vision review can pose any state:
 *
 *   await page.evaluate(() => window.__motion?.seek("station-arrival", 0.5));
 *
 * Ambient component loops (flap cycling, marquees) are exempt (rule 5) and do
 * not register; they expose data-settled instead.
 */

type SeekableTimeline = {
  progress(value: number): unknown;
  pause(): unknown;
};

const registry = new Map<string, SeekableTimeline>();

declare global {
  interface Window {
    __motion?: {
      list(): string[];
      seek(name: string, progress: number): boolean;
      has(name: string): boolean;
    };
  }
}

export function isE2E(): boolean {
  if (process.env.NEXT_PUBLIC_E2E === "1") return true;
  if (typeof window === "undefined") return false;
  try {
    return new URLSearchParams(window.location.search).has("e2e");
  } catch {
    return false;
  }
}

function expose(): void {
  if (typeof window === "undefined" || !isE2E()) return;
  window.__motion ??= {
    list: () => [...registry.keys()],
    has: (name) => registry.has(name),
    seek: (name, progress) => {
      const tl = registry.get(name);
      if (!tl) return false;
      tl.pause();
      tl.progress(Math.min(1, Math.max(0, progress)));
      return true;
    },
  };
}

/** Register a timeline; returns an unregister cleanup for useGSAP revert. */
export function registerTimeline(name: string, timeline: SeekableTimeline): () => void {
  registry.set(name, timeline);
  expose();
  return () => {
    registry.delete(name);
  };
}

/** Test-only helper. */
export function _clearRegistry(): void {
  registry.clear();
}
