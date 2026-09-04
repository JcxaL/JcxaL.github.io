import type { CSSProperties } from "react";

/* Atlas — Motion tokens. Server component, no client JS. The hover demo is
 * pure CSS (transition duration/easing pulled straight from the token vars)
 * and is disabled under prefers-reduced-motion. Nothing autoplays. */

const mono = "ui-monospace, Menlo, monospace";

const durations: [name: string, value: string, note: string][] = [
  ["--motion-duration-flap", "90ms", "single split-flap step"],
  ["--motion-duration-hud-boot", "400ms", "HUD boot-up sweep"],
  ["--motion-duration-punch", "250ms", "ticket punch commit"],
  ["--motion-duration-door", "600ms", "train door open/close"],
  ["--motion-duration-exit", "150ms", "route exit (ease-in)"],
  ["--motion-duration-enter", "210ms", "route enter (ease-out)"],
  ["--motion-duration-card-hover", "350ms", "card hover lift"],
  ["--motion-duration-marquee", "15s", "dot-matrix marquee loop"],
];

const easings: [name: string, value: string, note: string][] = [
  ["--motion-easing-train-decelerate", "cubic-bezier(0.16, 1, 0.3, 1)", "arrive: fast then settle"],
  ["--motion-easing-train-accelerate", "cubic-bezier(0.7, 0, 0.84, 0)", "depart: slow then commit"],
  ["--motion-easing-standard", "cubic-bezier(0.4, 0, 0.2, 1)", "standard interface curve"],
];

const caption: CSSProperties = {
  fontFamily: mono,
  fontSize: 10,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "var(--color-ink-faint)",
  margin: "0 0 12px",
};

const row: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "120px minmax(0, 1fr) auto",
  alignItems: "center",
  gap: 16,
  padding: "10px 0",
  borderTop: "1px solid var(--color-ground-line)",
};

const track: CSSProperties = {
  height: 4,
  borderRadius: 999,
  background: "var(--color-ground-2)",
  position: "relative",
  overflow: "hidden",
};

const dotBase: CSSProperties = {
  position: "absolute",
  top: -4,
  left: 0,
  width: 12,
  height: 12,
  borderRadius: 999,
  background: "var(--color-board-amber)",
  boxShadow: "0 0 8px var(--color-board-glow)",
};

const nameStyle: CSSProperties = { fontFamily: mono, fontSize: 12, color: "var(--color-ink-signage)" };
const valStyle: CSSProperties = { fontFamily: mono, fontSize: 12, color: "var(--color-accent-base)", textAlign: "right", whiteSpace: "nowrap" };
const noteStyle: CSSProperties = { fontFamily: mono, fontSize: 10, color: "var(--color-ink-muted)", marginTop: 2 };

export default function MotionTokens() {
  return (
    <section style={{ background: "var(--color-ground-1)", color: "var(--color-ink-signage)", padding: 24, borderRadius: 14 }}>
      <style>{`
        .atlas-mt-dot { transform: translateX(0); }
        .atlas-mt-row:hover .atlas-mt-dot { transform: translateX(calc(100% - 12px)); }
        @media (prefers-reduced-motion: reduce) {
          .atlas-mt-dot { transition: none !important; }
          .atlas-mt-row:hover .atlas-mt-dot { transform: translateX(0); }
        }
      `}</style>

      <h3 style={{ margin: "0 0 4px", fontFamily: mono, fontSize: 16, letterSpacing: "0.04em" }}>Motion</h3>
      <p style={caption}>Durations · Easings — hover a row to preview (respects reduced-motion)</p>

      <p style={{ ...caption, marginTop: 20 }}>Duration</p>
      {durations.map(([name, value, note]) => (
        <div key={name} className="atlas-mt-row" style={row}>
          <div style={track}>
            <span
              className="atlas-mt-dot"
              style={{ ...dotBase, transition: `transform var(${name}) var(--motion-easing-standard)` }}
            />
          </div>
          <div>
            <div style={nameStyle}>var({name})</div>
            <div style={noteStyle}>{note}</div>
          </div>
          <div style={valStyle}>{value}</div>
        </div>
      ))}

      <p style={{ ...caption, marginTop: 24 }}>Easing</p>
      {easings.map(([name, value, note]) => (
        <div key={name} className="atlas-mt-row" style={row}>
          <div style={track}>
            <span
              className="atlas-mt-dot"
              style={{ ...dotBase, transition: `transform var(--motion-duration-door) var(${name})` }}
            />
          </div>
          <div>
            <div style={nameStyle}>var({name})</div>
            <div style={noteStyle}>{note}</div>
          </div>
          <div style={valStyle}>{value}</div>
        </div>
      ))}
    </section>
  );
}
