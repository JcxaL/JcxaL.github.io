import type { CSSProperties } from "react";
import ParallaxRig from "@/components/scene/ParallaxRig";

/**
 * ParallaxDemo — Atlas card for the 2.5D scene kit. Three layers at
 * --depth-near / --depth-mid / --depth-far inside a ParallaxRig; the translateZ
 * scale-compensation keeps them the same visual size at rest, and the pointer
 * tilt reveals their depth. Static under reduced-motion.
 */
const label: CSSProperties = {
  fontFamily: "ui-monospace, Menlo, monospace",
  fontSize: "0.66rem",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
};

// scale ≈ (perspective − z) / perspective, so a plane pushed back in Z keeps its
// on-screen size at rest (1000 perspective; z = −120 / −320 / −640).
function plane(z: string, scale: number): CSSProperties {
  return { transform: `translateZ(var(${z})) scale(${scale})` };
}

export default function ParallaxDemo() {
  return (
    <div style={{ maxWidth: 460 }}>
      <ParallaxRig>
        <div
          style={{
            position: "relative",
            height: 280,
            borderRadius: "var(--layout-radius-card, 14px)",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              ...plane("--depth-far", 1.64),
              background: "var(--color-ground-2, #121a30)",
              border: "1px solid var(--color-ground-line, rgba(255,255,255,.12))",
              borderRadius: "inherit",
              display: "grid",
              placeItems: "end start",
              padding: 12,
              color: "var(--color-ink-muted, #9aa6be)",
            }}
          >
            <span style={label}>--depth-far</span>
          </div>

          <div
            style={{
              position: "absolute",
              inset: "50px 66px",
              ...plane("--depth-mid", 1.32),
              background: "var(--color-ground-1, #0e1526)",
              border: "1px solid var(--color-ground-line, rgba(255,255,255,.12))",
              borderRadius: 12,
              display: "grid",
              placeItems: "center",
              boxShadow: "0 30px 60px -30px rgba(0,0,0,.6)",
              color: "var(--color-ink-signage, #f8fafc)",
            }}
          >
            <span style={label}>--depth-mid</span>
          </div>

          <div
            style={{
              position: "absolute",
              top: 26,
              left: 26,
              ...plane("--depth-near", 1.12),
              background: "var(--color-board-amber, #ffb000)",
              color: "#0b1020",
              borderRadius: 8,
              padding: "6px 12px",
            }}
          >
            <span style={{ ...label, color: "#0b1020", fontWeight: 700 }}>
              --depth-near
            </span>
          </div>
        </div>
      </ParallaxRig>
      <p
        style={{
          marginTop: "0.9rem",
          fontSize: "0.85rem",
          lineHeight: 1.55,
          color: "var(--color-ink-muted, #9aa6be)",
        }}
      >
        Move the pointer across the rig — the three planes parallax by depth.
        Flat and still under <code>prefers-reduced-motion</code>. No WebGL.
      </p>
    </div>
  );
}
