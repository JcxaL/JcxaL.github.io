import type { CSSProperties } from "react";

/* Atlas · Layout & Depth token documentation. Server component — no
 * "use client", no props, no external imports. Each radius token draws a box
 * with that corner radius; the measure token caps a real column of body text.
 * Values mirror tokens/tokens.json → src/styles/tokens.css. The Layer Model's
 * depth/z scale (--depth-*) is NOT defined yet, so it is surfaced below as a
 * visible TODO to keep the gap legible in the Atlas. */

const MONO = "ui-monospace, Menlo, monospace";

type RadiusToken = { name: string; value: string; note: string };

const RADII: RadiusToken[] = [
  { name: "--layout-radius-plate", value: "6px", note: "signage plates" },
  { name: "--layout-radius-card", value: "14px", note: "cards / panels" },
  { name: "--layout-radius-pill", value: "999px", note: "pills / chips" },
];

const MEASURE = { name: "--layout-measure", value: "68ch", note: "body text measure" };
const MEASURE_SAMPLE =
  "The JccL Line runs on one measure. Body copy is capped here so the eye " +
  "never loses its return sweep — roughly sixty-eight characters, the reading " +
  "width the signage system is tuned to.";

const section: CSSProperties = {
  fontFamily: MONO,
  color: "var(--color-ink-signage)",
  background: "var(--color-ground-1)",
  border: "1px solid var(--color-ground-line)",
  borderRadius: "var(--layout-radius-card, 14px)",
  padding: "28px 24px",
  display: "flex",
  flexDirection: "column",
  gap: "26px",
};

const heading: CSSProperties = {
  margin: 0,
  fontSize: "13px",
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "var(--color-ink-signage)",
};

const caption: CSSProperties = {
  margin: 0,
  fontFamily: MONO,
  fontSize: "11px",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--color-ink-faint)",
};

const tokenName: CSSProperties = { fontSize: "13px", color: "var(--color-accent-base)" };
const tokenValue: CSSProperties = { fontSize: "12px", color: "var(--color-ink-muted)" };
const tokenNote: CSSProperties = {
  fontSize: "10.5px",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--color-ink-faint)",
};

export default function LayoutTokens() {
  return (
    <section style={section} aria-label="Layout and depth tokens">
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <h3 style={heading}>Layout &amp; Depth</h3>
        <p style={caption}>Radii · measure · layer model</p>
      </div>

      {/* Radii — each swatch draws a box with its own corner radius. */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <p style={caption}>Radii</p>
        <div style={{ display: "grid", gap: "10px" }}>
          {RADII.map((r) => (
            <div
              key={r.name}
              style={{
                display: "grid",
                gridTemplateColumns: "56px 1fr auto",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 56,
                  height: 38,
                  background: "var(--color-ground-2)",
                  border: "1px solid var(--color-accent-base)",
                  borderRadius: `var(${r.name})`,
                }}
              />
              <span style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                <code style={tokenName}>{r.name}</code>
                <span style={tokenNote}>{r.note}</span>
              </span>
              <code style={tokenValue}>{r.value}</code>
            </div>
          ))}
        </div>
      </div>

      {/* Measure — a real column capped at the token width. */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <p style={caption}>Measure</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <p
            style={{
              maxWidth: `var(${MEASURE.name})`,
              margin: 0,
              fontFamily: "var(--font-stack-body, system-ui, sans-serif)",
              fontSize: "15px",
              lineHeight: 1.55,
              color: "var(--color-ink-signage)",
              borderRight: "2px dashed var(--color-ground-line)",
              paddingRight: "12px",
            }}
          >
            {MEASURE_SAMPLE}
          </p>
          <div style={{ display: "flex", gap: "12px", alignItems: "baseline" }}>
            <code style={tokenName}>{MEASURE.name}</code>
            <code style={tokenValue}>{MEASURE.value}</code>
            <span style={tokenNote}>{MEASURE.note}</span>
          </div>
        </div>
      </div>

      {/* Layer Model — depth/z scale is not defined yet. Flag the gap. */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <p style={caption}>Layer Model</p>
        <div
          role="note"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            background: "var(--color-ground-2)",
            border: "1px dashed var(--color-board-amber)",
            borderRadius: "var(--layout-radius-plate, 6px)",
            padding: "16px 18px",
          }}
        >
          <span
            style={{
              fontSize: "10.5px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--color-board-amber)",
            }}
          >
            TODO · not yet defined
          </span>
          <span style={{ fontSize: "13px", color: "var(--color-ink-signage)" }}>
            <code style={tokenName}>--depth-*</code> scale: not yet defined (Layer Model TODO)
          </span>
          <span style={{ fontSize: "11.5px", lineHeight: 1.5, color: "var(--color-ink-muted)" }}>
            The Layer Model needs a depth / z-index scale; no <code>--depth-*</code> tokens exist in
            tokens.json yet — placeholder until the scale is authored.
          </span>
        </div>
      </div>
    </section>
  );
}
