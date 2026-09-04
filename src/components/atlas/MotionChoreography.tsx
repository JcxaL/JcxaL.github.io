import type { CSSProperties } from "react";

/**
 * MotionChoreography — Atlas entry for the motion system (CHARTER T3). Documents
 * the "train" ease vocabulary (as precise, static SVG bézier plots — no
 * animation, so reduced-motion safe) and the choreography principles: a
 * no-motion-first baseline, named seekable timelines, and the ambient-loop
 * exemption. Durations/easing values themselves live in the MotionTokens card.
 */

const EASES: {
  name: string;
  gsap: string;
  bez: [number, number, number, number];
  use: string;
}[] = [
  {
    name: "train-decelerate",
    gsap: "expo.out",
    bez: [0.16, 1, 0.3, 1],
    use: "arrivals — rows settle, panels land",
  },
  {
    name: "train-accelerate",
    gsap: "expo.in",
    bez: [0.7, 0, 0.84, 0],
    use: "departures — elements pull away",
  },
  {
    name: "standard",
    gsap: "power2.inOut",
    bez: [0.4, 0, 0.2, 1],
    use: "general UI transitions",
  },
];

const S = 108;
function curve([x1, y1, x2, y2]: [number, number, number, number]): string {
  return `M 0 ${S} C ${x1 * S} ${S - y1 * S}, ${x2 * S} ${S - y2 * S}, ${S} 0`;
}

const label: CSSProperties = {
  fontFamily: "ui-monospace, Menlo, monospace",
  fontSize: "0.72rem",
  color: "var(--color-ink-signage, #f8fafc)",
};
const sub: CSSProperties = {
  fontSize: "0.72rem",
  color: "var(--color-ink-muted, #9aa6be)",
  lineHeight: 1.5,
};

export default function MotionChoreography() {
  return (
    <div style={{ display: "grid", gap: "2rem" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "1.25rem",
        }}
      >
        {EASES.map((e) => (
          <figure
            key={e.name}
            style={{
              margin: 0,
              display: "flex",
              gap: "0.9rem",
              alignItems: "flex-start",
            }}
          >
            <svg
              width={S}
              height={S}
              viewBox={`-2 -2 ${S + 4} ${S + 4}`}
              role="img"
              aria-label={`${e.name} easing curve`}
              style={{ flex: "none" }}
            >
              <rect
                x="0"
                y="0"
                width={S}
                height={S}
                fill="none"
                stroke="var(--color-ground-line, rgba(255,255,255,.14))"
              />
              <line
                x1="0"
                y1={S}
                x2={S}
                y2="0"
                stroke="var(--color-ground-line, rgba(255,255,255,.1))"
                strokeDasharray="3 3"
              />
              <path
                d={curve(e.bez)}
                fill="none"
                stroke="var(--color-board-amber, #ffb000)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
            <figcaption style={{ display: "grid", gap: "0.3rem" }}>
              <span style={label}>{e.name}</span>
              <span style={sub}>
                gsap <code>{e.gsap}</code>
              </span>
              <span style={sub}>
                cubic-bezier({e.bez.join(", ")})
              </span>
              <span style={sub}>{e.use}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div style={{ display: "grid", gap: "0.5rem", maxWidth: "62ch" }}>
        <span style={label}>Principles</span>
        <span style={sub}>
          <b>No-motion-first.</b> Reduced motion is the baseline (the hook
          defaults to reduced under SSR/no-matchMedia); motion is the enhancement
          that switches on.
        </span>
        <span style={sub}>
          <b>Named, seekable timelines.</b> Every cinematic timeline registers
          under a stable name (e.g. <code>concourse-intro</code>: rows settle →
          line paths draw) and is exposed as <code>window.__motion</code> under
          the E2E flag so any state can be posed for review.
        </span>
        <span style={sub}>
          <b>Ambient loops are exempt.</b> Flap cycling and marquees don&rsquo;t
          register; they expose <code>data-settled</code> instead.
        </span>
      </div>
    </div>
  );
}
