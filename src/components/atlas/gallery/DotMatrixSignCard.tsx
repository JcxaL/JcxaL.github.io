import DotMatrixSign from "@/components/transit/DotMatrixSign";

/**
 * Atlas doc-card for DotMatrixSign.
 * Renders one live instance with minimal valid props.
 */
export default function DotMatrixSignCard() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: 16,
        borderRadius: "var(--layout-radius-plate)",
        border: "1px solid var(--color-ground-line)",
        background: "var(--color-ground-1)",
      }}
    >
      <h4 style={{ margin: 0, color: "var(--color-ink-signage)" }}>
        DotMatrixSign
      </h4>
      <p style={{ margin: 0, color: "var(--color-ink-muted)", fontSize: 14 }}>
        A single-line amber LED strip signboard with an optional CSS marquee.
      </p>
      <code
        style={{
          fontFamily: "var(--font-stack-mono)",
          fontSize: 12,
          color: "var(--color-ink-faint)",
        }}
      >
        @/components/transit/DotMatrixSign
      </code>
      <div style={{ marginTop: 8 }}>
        <DotMatrixSign text="WELCOME ABOARD — THE JCCL LINE" />
      </div>
    </div>
  );
}
