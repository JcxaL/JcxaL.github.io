import StatusLegend from "@/components/transit/StatusLegend";

/**
 * Atlas doc-card for StatusLegend.
 * Renders one live instance with minimal valid props.
 */
export default function StatusLegendCard() {
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
        StatusLegend
      </h4>
      <p style={{ margin: 0, color: "var(--color-ink-muted)", fontSize: 14 }}>
        The closed three-status key — colored dot plus word for visited, in
        progress, and planning stations.
      </p>
      <code
        style={{
          fontFamily: "var(--font-stack-mono)",
          fontSize: 12,
          color: "var(--color-ink-faint)",
        }}
      >
        @/components/transit/StatusLegend
      </code>
      <div style={{ marginTop: 8 }}>
        <StatusLegend />
      </div>
    </div>
  );
}
