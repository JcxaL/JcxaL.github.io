/**
 * Stage API — the Layer Model contract (CHARTER §2).
 *
 * Every surface composes three depth planes: Chrome (2D, top), Parallax (2.5D),
 * and Stage (3D, back). The rule that lets the 2D and 3D tracks build in
 * parallel: **Chrome never depends on the Stage existing.** Chrome/Parallax call
 * this imperative API; a real WebGL scene implements it, and `NOOP_STAGE`
 * implements the exact same shape when there is no WebGL, reduced-motion is on,
 * or we're server-rendering. Callers never branch on "is there 3D?" — they just
 * call, and it's a no-op in the fallback.
 */

export interface StageFocusOptions {
  /** Seconds for the camera move; 0 = cut. Ignored by the fallback. */
  duration?: number;
  /** Ease token name (see motion tokens), e.g. "concourse". */
  ease?: string;
}

export interface StageAPI {
  /** True on a live WebGL stage; false on the no-op fallback. Callers may read
   *  this to *enhance* (e.g. skip a decorative parallax) but must stay correct
   *  when it's false. */
  readonly active: boolean;
  /** Move the camera / attention to a named node (a station or line node id). */
  focus(nodeId: string, opts?: StageFocusOptions): void;
  /** Set the active line (recolors / isolates the network); null = whole map. */
  setLine(lineId: string | null): void;
  /** Scrub a 0..1 journey parameter (scroll-driven). Clamped by impls. */
  progress(t: number): void;
  /** Return to the neutral establishing shot. */
  reset(): void;
}

/** The fallback Stage: satisfies the contract, does nothing. */
export const NOOP_STAGE: StageAPI = {
  active: false,
  focus() {},
  setLine() {},
  progress() {},
  reset() {},
};

/** WebGL availability (client-only; false during SSR/static export). */
export function hasWebGL(): boolean {
  if (typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      canvas.getContext("webgl2") || canvas.getContext("webgl")
    );
  } catch {
    return false;
  }
}

/** Honors the OS reduced-motion setting (client-only). */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Whether the 3D Stage should mount at all. When false, surfaces render their
 * Parallax/2D fallback and wire to `NOOP_STAGE`. This is the single gate every
 * scene checks before instantiating WebGL.
 */
export function stageEnabled(): boolean {
  return hasWebGL() && !prefersReducedMotion();
}
