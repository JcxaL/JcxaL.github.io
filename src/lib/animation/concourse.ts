import gsap from "gsap";
import { EASE_STANDARD, EASE_TRAIN_DECELERATE } from "@/lib/animation/eases";

/**
 * createConcourseIntro — pure timeline factory (CLAUDE.md rule 2) for the
 * home concourse arrival: departure rows settle in, then the network
 * diagram's line paths draw on.
 *
 * No React in here; the caller (useGSAP) owns lifecycle and reduced-motion
 * branching, and registers the timeline as "concourse-intro" (rule 5).
 */

export interface ConcourseIntroTargets {
  /** Departure rows, in board order. */
  rows: Element[];
  /** Line paths of the network diagram (stroke draw-on). */
  paths: SVGPathElement[];
}

/** jsdom/test fallbacks — each mirrors the named token (rule-1 carve-out a). */
const FALLBACK_MS = {
  /** motion.duration.flap */
  flap: 90,
  /** motion.duration.enter */
  enter: 210,
  /** motion.duration.door */
  door: 600,
};

/** Read a --motion-duration-* token in ms off an element, with fallback. */
export function readMotionMs(
  el: Element | null,
  token: "flap" | "enter" | "door",
): number {
  if (typeof window === "undefined" || el === null) return FALLBACK_MS[token];
  try {
    const raw = window
      .getComputedStyle(el)
      .getPropertyValue(`--motion-duration-${token}`)
      .trim();
    const n = Number.parseFloat(raw);
    if (!Number.isFinite(n) || n <= 0) return FALLBACK_MS[token];
    return raw.endsWith("ms") ? n : raw.endsWith("s") ? n * 1000 : FALLBACK_MS[token];
  } catch {
    return FALLBACK_MS[token];
  }
}

/** Total path length; jsdom has no getTotalLength, so fall back to a fixed sweep. */
function pathLength(path: SVGPathElement): number {
  try {
    return path.getTotalLength();
  } catch {
    return 1000;
  }
}

export function createConcourseIntro({
  rows,
  paths,
}: ConcourseIntroTargets): gsap.core.Timeline {
  const probe = rows[0] ?? paths[0] ?? null;
  const enterS = readMotionMs(probe, "enter") / 1000;
  const flapS = readMotionMs(probe, "flap") / 1000;
  const doorS = readMotionMs(probe, "door") / 1000;

  const tl = gsap.timeline();

  if (rows.length > 0) {
    tl.from(rows, {
      autoAlpha: 0,
      y: 10,
      duration: enterS,
      ease: EASE_TRAIN_DECELERATE,
      stagger: flapS,
    });
  }

  if (paths.length > 0) {
    for (const [i, path] of paths.entries()) {
      const len = pathLength(path);
      tl.fromTo(
        path,
        { strokeDasharray: len, strokeDashoffset: len },
        {
          strokeDashoffset: 0,
          duration: doorS,
          ease: EASE_STANDARD,
          // Clear the inline dash so hover/focus styles see a clean path.
          clearProps: "strokeDasharray,strokeDashoffset",
        },
        i === 0 ? `>-${enterS / 2}` : `<+${flapS * 2}`,
      );
    }
  }

  return tl;
}
