import type { CSSProperties } from "react";

import StationPlate from "@/components/transit/StationPlate";

/* Atlas gallery doc-card for StationPlate. Server component — it renders one
 * live StationPlate with a minimal valid set of props (name/code/line required;
 * nameLocal/nameLocalLang/status optional). Inline styles here lay out the
 * titled block only; the plate styles itself from its own token CSS. */

const mono = "ui-monospace, Menlo, monospace";

const card: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
  padding: 20,
  borderRadius: "var(--layout-radius-plate)",
  border: "1px solid var(--color-ground-line)",
  background: "var(--color-ground-1)",
};

const heading: CSSProperties = {
  margin: 0,
  fontSize: 18,
  color: "var(--color-ink)",
};

const description: CSSProperties = {
  margin: 0,
  fontSize: 14,
  lineHeight: 1.5,
  color: "var(--color-ink-muted)",
  maxWidth: "56ch",
};

const importPath: CSSProperties = {
  fontFamily: mono,
  fontSize: 11,
  letterSpacing: "0.08em",
  color: "var(--color-ink-faint)",
};

export default function StationPlateCard() {
  return (
    <div style={card}>
      <h4 style={heading}>StationPlate</h4>
      <p style={description}>
        An enamel station sign with a line-color edge bar, signage-caps name plus
        optional local script, a right-aligned code disc, and a color+word status
        chip.
      </p>
      <code style={importPath}>@/components/transit/StationPlate</code>
      <div>
        <StationPlate
          name="Kyoto"
          nameLocal="京都"
          nameLocalLang="ja"
          code="A02"
          line="a"
          status="visited"
        />
      </div>
    </div>
  );
}
