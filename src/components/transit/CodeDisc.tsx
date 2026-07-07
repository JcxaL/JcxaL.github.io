import type { CSSProperties } from "react";
import type { LineId } from "@/lib/transit/types";
import { lineColorVar } from "@/lib/transit/types";

/**
 * CodeDisc — circled station code (e.g. "A03") in its line color.
 * Line-colored ring on station-dark fill, code set in Geist Mono.
 * Pure render; token vars only (docs/design/12-brand-signage.md).
 */
export interface CodeDiscProps {
  /** Station code, e.g. "A03". */
  code: string;
  /** Owning line — supplies the ring color via `lineColorVar`. */
  line: LineId;
  /** Disc diameter in px. Ring width and type scale with it. */
  size?: number;
}

export function CodeDisc({ code, line, size = 34 }: CodeDiscProps) {
  const ringWidth = Math.max(2, Math.round(size / 12));
  const style: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    width: size,
    height: size,
    borderRadius: "50%",
    flexShrink: 0,
    backgroundColor: "var(--color-ground-0)",
    border: `${ringWidth}px solid ${lineColorVar(line)}`,
    color: "var(--color-ink-signage)",
    fontFamily: "var(--font-geist-mono)",
    fontWeight: 600,
    fontSize: Math.round(size * 0.36),
    lineHeight: 1,
    letterSpacing: "0.02em",
  };

  return (
    <span role="img" aria-label={`Station ${code}`} style={style}>
      <span aria-hidden="true">{code}</span>
    </span>
  );
}

export default CodeDisc;
