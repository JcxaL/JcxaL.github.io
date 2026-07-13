import type { CSSProperties } from "react";

/**
 * Atlas · Color token documentation.
 * Server component — no "use client", no props, no external imports.
 * Swatches reference the real CSS custom properties by name; the printed
 * hex is the night-service value from src/styles/tokens.css (day values
 * theme-switch live via the same var()).
 */

type Token = { name: string; value: string };
type Group = { label: string; tokens: Token[] };

const MONO = "ui-monospace, Menlo, monospace";

const GROUPS: Group[] = [
  {
    label: "Ground",
    tokens: [
      { name: "--color-ground-0", value: "#100e17" },
      { name: "--color-ground-1", value: "#17151f" },
      { name: "--color-ground-2", value: "#211e2b" },
      { name: "--color-ground-line", value: "#322d40" },
    ],
  },
  {
    label: "Ink",
    tokens: [
      { name: "--color-ink-signage", value: "#f3f2f7" },
      { name: "--color-ink-muted", value: "#a6a2b4" },
      { name: "--color-ink-faint", value: "#918ca6" },
      { name: "--color-ink-inverse", value: "#100e17" },
    ],
  },
  {
    label: "Accent",
    tokens: [{ name: "--color-accent-base", value: "#b8a1ff" }],
  },
  {
    label: "Board",
    tokens: [
      { name: "--color-board-amber", value: "#ffb000" },
      { name: "--color-board-amber-dim", value: "#7a5500" },
      { name: "--color-board-glow", value: "rgba(255, 176, 0, 0.35)" },
    ],
  },
  {
    label: "Lines",
    tokens: [
      { name: "--color-lines-a", value: "#e2231a" },
      { name: "--color-lines-b", value: "#0075c2" },
      { name: "--color-lines-c", value: "#00a040" },
      { name: "--color-lines-d", value: "#7d499d" },
      { name: "--color-lines-e", value: "#009b9b" },
      { name: "--color-lines-f", value: "#c2186b" },
    ],
  },
  {
    label: "Status",
    tokens: [
      { name: "--color-status-visited", value: "#2fbf71" },
      { name: "--color-status-progress", value: "#ffb000" },
      { name: "--color-status-planning", value: "#6e7bf2" },
    ],
  },
];

const caption: CSSProperties = {
  fontFamily: MONO,
  fontSize: 11,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--color-ink-faint)",
  margin: 0,
};

export default function ColorTokens() {
  return (
    <section
      style={{
        fontFamily: MONO,
        color: "var(--color-ink-signage)",
        background: "var(--color-ground-1)",
        border: "1px solid var(--color-ground-line)",
        borderRadius: 14,
        padding: "28px 24px",
      }}
    >
      <h3
        style={{
          margin: "0 0 4px",
          fontSize: 13,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--color-ink-signage)",
        }}
      >
        Color
      </h3>
      <p style={{ ...caption, marginBottom: 24 }}>Design tokens · night service values</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
        {GROUPS.map((group) => (
          <div key={group.label}>
            <p style={{ ...caption, marginBottom: 12 }}>{group.label}</p>
            <div style={{ display: "grid", gap: 8 }}>
              {group.tokens.map((token) => (
                <div
                  key={token.name}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "44px 1fr auto",
                    alignItems: "center",
                    gap: 14,
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: 44,
                      height: 30,
                      borderRadius: 6,
                      background: `var(${token.name})`,
                      border: "1px solid var(--color-ground-line)",
                      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.04)",
                    }}
                  />
                  <span style={{ fontSize: 13, color: "var(--color-ink-signage)" }}>
                    {token.name}
                  </span>
                  <span style={{ fontSize: 12, color: "var(--color-ink-muted)" }}>
                    {token.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
