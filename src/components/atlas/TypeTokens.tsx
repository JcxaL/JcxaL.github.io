import type { CSSProperties } from "react";

/* Atlas · Type token specimen. Server component — no "use client", no props.
 * Renders every JccL Line type token as a live specimen line so the family
 * each var resolves to is legible at a glance. Values mirror
 * tokens/tokens.json → src/styles/tokens.css (fontStack.* + raw next/font vars). */

const MONO = "ui-monospace, Menlo, monospace";
const SPECIMEN = "The JccL Line 0123";

type FontToken = {
  token: string; // the real CSS custom property
  value: string; // its resolved value / material
  note: string; // register / house rule
  fallback: string; // safe stack so the specimen renders standalone
  size: number;
};

// Raw next/font vars are injected at runtime; the composed --font-stack-*
// live in tokens.css. Both are referenced by name via var() below.
const FONT_TOKENS: FontToken[] = [
  { token: "--font-signage", value: "Source Sans 3 · next/font", note: "signage register — headings, signs, UI", fallback: "system-ui, sans-serif", size: 30 },
  { token: "--font-board", value: "Doto · next/font", note: "dot-matrix departure boards only, never body", fallback: "monospace", size: 32 },
  { token: "--font-stack-signage", value: "var(--font-signage), var(--font-geist-sans), system-ui, sans-serif", note: "composed signage stack", fallback: "system-ui, sans-serif", size: 30 },
  { token: "--font-stack-body", value: "var(--font-signage), var(--font-geist-sans), system-ui, sans-serif", note: "one family, weight-only hierarchy", fallback: "system-ui, sans-serif", size: 26 },
  { token: "--font-stack-board", value: "var(--font-board), monospace", note: "dot-matrix board stack", fallback: "monospace", size: 32 },
  { token: "--font-stack-mono", value: "var(--font-geist-mono), ui-monospace, monospace", note: "telemetry — coordinates, dates, codes", fallback: "ui-monospace, monospace", size: 26 },
];

const section: CSSProperties = {
  color: "var(--color-ink-signage)",
  background: "var(--color-ground-1)",
  border: "1px solid var(--color-ground-line)",
  borderRadius: "var(--layout-radius-card, 14px)",
  padding: "28px",
  display: "flex",
  flexDirection: "column",
  gap: "18px",
};

const heading: CSSProperties = {
  margin: 0,
  fontFamily: "var(--font-stack-signage, system-ui, sans-serif)",
  fontSize: "22px",
  fontWeight: 650,
  letterSpacing: "-0.01em",
};

const caption: CSSProperties = {
  margin: 0,
  fontFamily: MONO,
  fontSize: "11px",
  textTransform: "uppercase",
  letterSpacing: "0.16em",
  color: "var(--color-ink-faint)",
};

const grid: CSSProperties = { display: "grid", gap: "14px" };

const row: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  background: "var(--color-ground-2)",
  border: "1px solid var(--color-ground-line)",
  borderRadius: "var(--layout-radius-plate, 6px)",
  padding: "18px 20px",
};

const metaRow: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "baseline",
  gap: "6px 12px",
};

const tokenName: CSSProperties = {
  fontFamily: MONO,
  fontSize: "13px",
  color: "var(--color-accent-base)",
};

const note: CSSProperties = {
  fontFamily: MONO,
  fontSize: "11px",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "var(--color-ink-muted)",
};

const value: CSSProperties = {
  fontFamily: MONO,
  fontSize: "11.5px",
  color: "var(--color-ink-faint)",
  wordBreak: "break-word",
};

export default function TypeTokens() {
  return (
    <section style={section} aria-label="Type tokens">
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <h3 style={heading}>Type</h3>
        <p style={caption}>Font families · specimen “{SPECIMEN}”</p>
      </div>
      <div style={grid}>
        {FONT_TOKENS.map((f) => (
          <div key={f.token} style={row}>
            <div
              style={{
                fontFamily: `var(${f.token}, ${f.fallback})`,
                fontSize: `${f.size}px`,
                lineHeight: 1.15,
                color: "var(--color-ink-signage)",
              }}
            >
              {SPECIMEN}
            </div>
            <div style={metaRow}>
              <code style={tokenName}>{f.token}</code>
              <span style={note}>{f.note}</span>
            </div>
            <code style={value}>{f.value}</code>
          </div>
        ))}
      </div>
    </section>
  );
}
