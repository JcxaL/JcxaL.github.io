"use client";

import { useEffect, useRef, useState } from "react";

/**
 * ArrivalName — the exhibit's arrival moment: the station name resolves on
 * the board (Doto wght/ROND axis animation — one of the two reserved
 * axis-animation moments, doc 12 / doc 07 D7).
 *
 * Decorative: the StationPlate above already carries the accessible name,
 * so this is aria-hidden. Exposes data-settled once the resolve finishes
 * (immediately under reduced motion) for tests and vision review.
 */
export default function ArrivalName({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced =
      typeof window.matchMedia !== "function" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setSettled(true);
      return;
    }
    const onEnd = () => setSettled(true);
    el.addEventListener("animationend", onEnd);
    return () => el.removeEventListener("animationend", onEnd);
  }, []);

  return (
    // The name resolves on a lit platform board — dark-and-amber in both
    // services (jccl-lit-board pins the night palette).
    <p
      ref={ref}
      aria-hidden="true"
      className={["jccl-lit-board", "jccl-board-arrive", className]
        .filter(Boolean)
        .join(" ")}
      data-settled={settled ? "true" : undefined}
      data-testid="arrival-name"
      style={{
        display: "block",
        background: "var(--color-ground-0)",
        border: "1px solid var(--color-ground-line)",
        borderRadius: "var(--layout-radius-plate)",
        padding: "0.35em 0.6em",
        fontSize: "clamp(2.5rem, 8vw, 4.5rem)",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        lineHeight: 1.05,
        margin: 0,
      }}
    >
      {name}
    </p>
  );
}
