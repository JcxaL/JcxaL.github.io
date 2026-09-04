"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/stage/types";
import styles from "./ParallaxRig.module.css";

/**
 * ParallaxRig — 2.5D Parallax plane (Layer Model). Wrap depth layers (children
 * placed at `translateZ(var(--depth-*))`); the rig tilts them toward the pointer
 * so they parallax. Dependency-free (CSS 3D), and it stays flat under
 * prefers-reduced-motion (the listener never attaches, and the CSS zeroes the
 * transform as a backstop). Values default to 0 so SSR/first paint is flat.
 */
export default function ParallaxRig({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--px", String((e.clientX - r.left) / r.width - 0.5));
        el.style.setProperty("--py", String((e.clientY - r.top) / r.height - 0.5));
      });
    };
    const reset = () => {
      cancelAnimationFrame(raf);
      el.style.setProperty("--px", "0");
      el.style.setProperty("--py", "0");
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", reset);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", reset);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className={`${styles.rig} ${className ?? ""}`}>
      <div className={styles.stage}>{children}</div>
    </div>
  );
}
