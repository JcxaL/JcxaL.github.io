import type { CSSProperties } from "react";

import SplitFlapBoard from "@/components/transit/SplitFlapBoard";

/* Atlas gallery doc-card for SplitFlapBoard. Server component — it renders the
 * client SplitFlapBoard child with a minimal valid `rows` literal (shape:
 * { label?: string; text: string }[]). Inline styles here lay out the titled
 * block only; the board styles itself from its own token CSS. */

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

export default function SplitFlapBoardCard() {
  return (
    <div style={card}>
      <h4 style={heading}>SplitFlapBoard</h4>
      <p style={description}>
        A Solari-style split-flap departure board whose flap cells cycle through
        a charset and settle left-to-right into the target text.
      </p>
      <code style={importPath}>@/components/transit/SplitFlapBoard</code>
      <div>
        <SplitFlapBoard
          rows={[
            { label: "SERVICE", text: "WELCOME ABOARD" },
            { label: "OPERATOR", text: "JCCL" },
            { label: "STATUS", text: "ALL LINES GOOD" },
          ]}
        />
      </div>
    </div>
  );
}
