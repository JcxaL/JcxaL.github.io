import type { CSSProperties } from "react";
import type { LineId, StationStatus } from "@/lib/transit/types";
import { lineColorVar, statusColorVar } from "@/lib/transit/types";
import CodeDisc from "./CodeDisc";

/**
 * StationPlate — enamel station sign (MTR grammar, original mark).
 * Left edge carries the line color; the name is set in signage caps with an
 * optional local-script counterpart beneath; the code disc sits right-aligned.
 * Status is always color + word — never color alone (CLAUDE.md rule 9).
 * Pure render; token vars only.
 */
export interface StationPlateProps {
  /** Display name (Latin), e.g. "Kyoto". */
  name: string;
  /** Optional local-script name for bilingual plates, e.g. "京都". */
  nameLocal?: string;
  /** BCP-47 tag for nameLocal script (e.g. "zh-Hant", "ja"). */
  nameLocalLang?: string;
  /** Station code, e.g. "A02". */
  code: string;
  /** Owning line — supplies the edge/disc color. */
  line: LineId;
  /** Optional status chip (word + colored dot). */
  status?: StationStatus;
}

/** System-voice status words (doc 12): color + word, never color alone. */
const STATUS_WORD: Record<StationStatus, string> = {
  visited: "Visited",
  progress: "In progress",
  planning: "Planning",
};

const plateStyle: CSSProperties = {
  display: "flex",
  alignItems: "stretch",
  backgroundColor: "var(--color-ground-1)",
  border: "1px solid var(--color-ground-line)",
  borderRadius: "var(--layout-radius-plate)",
  overflow: "hidden",
};

const nameStyle: CSSProperties = {
  fontFamily: "var(--font-signage)",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.01em",
  fontSize: "1.25rem",
  lineHeight: 1.2,
  color: "var(--color-ink-signage)",
};

const nameLocalStyle: CSSProperties = {
  fontFamily: "var(--font-signage)",
  fontSize: "0.875rem",
  lineHeight: 1.3,
  marginTop: 2,
  color: "var(--color-ink-muted)",
};

const chipStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  marginTop: 8,
  fontFamily: "var(--font-geist-mono)",
  fontSize: "0.6875rem",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "var(--color-ink-muted)",
};

export function StationPlate({
  name,
  nameLocal,
  nameLocalLang = "zh",
  code,
  line,
  status,
}: StationPlateProps) {
  return (
    <div style={plateStyle} data-testid={`station-plate-${code}`}>
      {/* Line-color edge bar (decorative — the disc carries the line identity too). */}
      <span
        aria-hidden="true"
        style={{
          display: "block",
          width: 6,
          flexShrink: 0,
          backgroundColor: lineColorVar(line),
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          flex: 1,
          minWidth: 0,
          padding: "12px 16px",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={nameStyle}>{name}</div>
          {nameLocal ? (
            <div lang={nameLocalLang} style={nameLocalStyle}>
              {nameLocal}
            </div>
          ) : null}
          {status ? (
            <span style={chipStyle}>
              <span
                aria-hidden="true"
                style={{
                  display: "inline-block",
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: statusColorVar(status),
                }}
              />
              {STATUS_WORD[status]}
            </span>
          ) : null}
        </div>
        <CodeDisc code={code} line={line} />
      </div>
    </div>
  );
}

export default StationPlate;
