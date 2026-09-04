"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { stageEnabled } from "@/lib/stage/types";

// Code-split: the r3f + three chunk is fetched only when this renders, which
// only happens once stageEnabled() is true — so it never lands in the initial
// bundle or on the SSR / no-WebGL / reduced-motion paths.
const NetworkStage = dynamic(() => import("./NetworkStage"), { ssr: false });

/**
 * StageMount — the seam between the 3D Stage and its fallback. SSR/first paint
 * renders the static poster (stageEnabled starts false); after mount, if WebGL
 * is available and reduced-motion is off, it swaps in the live scene. This is
 * the no-WebGL fallback made real for a shipping scene.
 */
export default function StageMount() {
  const [on, setOn] = useState(false);
  useEffect(() => setOn(stageEnabled()), []);

  if (!on) {
    return (
      <div
        role="img"
        aria-label="3D network stage (static fallback — WebGL off or reduced motion)"
        style={{
          height: 340,
          borderRadius: "var(--layout-radius-card, 14px)",
          border: "1px solid var(--color-ground-line, rgba(255,255,255,.12))",
          background:
            "radial-gradient(120% 90% at 50% 20%, color-mix(in srgb, var(--color-board-amber, #ffb000) 16%, transparent), transparent 60%), var(--color-ground-1, #0e1526)",
          display: "grid",
          placeItems: "center",
          color: "var(--color-ink-muted, #9aa6be)",
          fontFamily: "ui-monospace, Menlo, monospace",
          fontSize: "0.72rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          textAlign: "center",
          padding: "1rem",
        }}
      >
        3D Stage · static fallback
      </div>
    );
  }

  return <NetworkStage />;
}
