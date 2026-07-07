"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * SmoothScrollProvider — the single-clock rule (doc 07 D2).
 *
 * One heartbeat: gsap.ticker drives Lenis; Lenis notifies ScrollTrigger.
 * Two independent rAF loops is where one-frame scroll/WebGL jank comes from,
 * so nothing else may create its own loop.
 *
 * Reduced motion (or no matchMedia, e.g. jsdom): Lenis is skipped entirely —
 * native scroll is the no-motion-first baseline (CLAUDE.md rule 4).
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced =
      typeof window.matchMedia !== "function" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({ autoRaf: false });
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
