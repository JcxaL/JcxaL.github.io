"use client";

/**
 * SplitFlapBoard — Solari-style hall departure board for The JccL Line.
 *
 * Each row renders fixed-width flap cells that cycle through a charset
 * stepwise (frame-stepped, not eased — the mechanical read) until settling
 * on the target character, staggered so cells settle left-to-right.
 *
 * Spec: docs/design/12-brand-signage.md ("SplitFlapBoard").
 * - Transform/opacity animation only (scaleY flap accent), no layout animation.
 * - Step timing from var(--motion-duration-flap), read via getComputedStyle
 *   once, with a 90ms fallback for jsdom/SSR.
 * - A11y: settled full text lives in an aria-label on each row (role="img");
 *   flap cells are aria-hidden; after settling the text is announced via an
 *   aria-live="polite" visually-hidden region.
 * - Reduced motion (or matchMedia unavailable): settled text renders
 *   instantly, no cycling.
 * - data-settled="true" appears on the root once all rows have settled
 *   (test + screenshot hook, doc 08).
 */

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

export interface SplitFlapRow {
  /** Optional kicker label, e.g. platform or line name. */
  label?: string;
  /** The settled text of the row. */
  text: string;
}

export interface SplitFlapBoardProps {
  rows: SplitFlapRow[];
  /** Characters the flaps cycle through before settling. */
  charset?: string;
  className?: string;
}

/** Classic Solari drum order: blank first, then letters, digits, punctuation. */
const DEFAULT_CHARSET = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:.-";

/** Fallback step duration for jsdom/SSR where the token is unreadable. */
const FALLBACK_STEP_MS = 90;

/** Flips every cell performs before the first (leftmost) cell may settle. */
const LEAD_STEPS = 5;

/** Extra steps between one column settling and the next (left-to-right). */
const STAGGER_STEPS = 1;

/** Spread multiplier so neighbouring drums show different glyphs mid-cycle. */
const DRUM_OFFSET = 7;

type Phase = "static" | "cycling" | "settled";

/** Default to REDUCED motion when matchMedia is unavailable (jsdom/SSR). */
const prefersReducedMotion = (): boolean => {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return true;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

const parseMs = (raw: string): number | null => {
  const value = raw.trim();
  if (value.endsWith("ms")) {
    const n = Number.parseFloat(value);
    return Number.isFinite(n) && n > 0 ? n : null;
  }
  if (value.endsWith("s")) {
    const n = Number.parseFloat(value);
    return Number.isFinite(n) && n > 0 ? n * 1000 : null;
  }
  return null;
};

/** Read --motion-duration-flap off the board element; 90ms jsdom fallback. */
const readFlapStepMs = (el: HTMLElement | null): number => {
  if (typeof window === "undefined" || el === null) return FALLBACK_STEP_MS;
  try {
    const raw = window
      .getComputedStyle(el)
      .getPropertyValue("--motion-duration-flap");
    return parseMs(raw) ?? FALLBACK_STEP_MS;
  } catch {
    return FALLBACK_STEP_MS;
  }
};

/** useLayoutEffect on the client, useEffect during SSR (avoids the warning). */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* Token vars only — no raw hex/duration/easing literals (CLAUDE.md rule 1). */
const BOARD_CSS = `
.jccl-splitflap {
  display: block;
  background: var(--color-ground-1);
  border: 1px solid var(--color-ground-line);
  border-radius: var(--layout-radius-plate);
  padding: 12px 14px;
  font-family: var(--font-board);
  color: var(--color-board-amber);
  text-shadow: 0 0 8px var(--color-board-glow), 0 0 2px var(--color-board-glow);
}
.jccl-splitflap-rows {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.jccl-splitflap-row {
  display: flex;
  align-items: baseline;
  gap: 12px;
}
.jccl-splitflap-label {
  font-family: var(--font-geist-mono, monospace);
  font-size: 0.6875em;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-ink-muted);
  text-shadow: none;
  min-width: 6ch;
}
.jccl-splitflap-cells {
  display: inline-flex;
  gap: 2px;
}
.jccl-splitflap-cell {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.25ch;
  padding: 2px 1px;
  background: var(--color-ground-2);
  border-radius: 2px;
  overflow: hidden;
}
/* Horizontal seam between the two flap halves — the Solari tell. */
.jccl-splitflap-cell::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 1px;
  background: var(--color-ground-0);
  opacity: 0.65;
  pointer-events: none;
}
.jccl-splitflap-glyph {
  display: inline-block;
  line-height: 1.2;
}
/* Flap accent: stepped scaleY squash while a drum is mid-cycle.
   Transform only; frame-stepped via steps(), never eased. */
@media (prefers-reduced-motion: no-preference) {
  .jccl-splitflap-cell[data-flapping="true"] .jccl-splitflap-glyph {
    animation: jccl-splitflap-flap var(--motion-duration-flap)
      steps(2, jump-none) infinite;
  }
}
@keyframes jccl-splitflap-flap {
  0% { transform: scaleY(1); }
  50% { transform: scaleY(0.35); }
  100% { transform: scaleY(1); }
}
`;

export default function SplitFlapBoard({
  rows,
  charset = DEFAULT_CHARSET,
  className,
}: SplitFlapBoardProps) {
  const glyphs = charset.length > 0 ? charset : DEFAULT_CHARSET;
  const rootRef = useRef<HTMLDivElement>(null);
  const stepMsRef = useRef<number | null>(null);

  const [phase, setPhase] = useState<Phase>("static");
  const [step, setStep] = useState(0);

  /** Stable identity for row content (rows arrays are often inline literals). */
  const rowsKey = rows
    .map((row) => `${row.label ?? ""}\u001f${row.text}`)
    .join("\u001e");

  /** Rows are padded to a common column count so the board reads as one unit. */
  const columnCount = rows.reduce((max, row) => Math.max(max, row.text.length), 0);
  const totalSteps =
    columnCount === 0 ? 0 : LEAD_STEPS + (columnCount - 1) * STAGGER_STEPS;

  /* Decide the motion branch before first paint: reduced motion (or no
     matchMedia, e.g. jsdom) renders the settled text instantly. */
  useIsomorphicLayoutEffect(() => {
    setStep(0);
    setPhase(prefersReducedMotion() || totalSteps === 0 ? "settled" : "cycling");
  }, [rowsKey, glyphs, totalSteps]);

  /* The drum motor: one interval steps every cell in lockstep. */
  useEffect(() => {
    if (phase !== "cycling") return;
    if (stepMsRef.current === null) {
      stepMsRef.current = readFlapStepMs(rootRef.current);
    }
    const id = window.setInterval(() => {
      setStep((s) => Math.min(s + 1, totalSteps));
    }, stepMsRef.current);
    return () => window.clearInterval(id);
  }, [phase, totalSteps]);

  /* All columns settled → stop the motor and announce. */
  useEffect(() => {
    if (phase === "cycling" && step >= totalSteps) {
      setPhase("settled");
    }
  }, [phase, step, totalSteps]);

  const settleStepFor = (col: number): number =>
    LEAD_STEPS + col * STAGGER_STEPS;

  /** Character a drum shows at the current step. */
  const drumChar = (
    target: string,
    col: number,
  ): { char: string; flapping: boolean } => {
    if (phase !== "cycling" || step >= settleStepFor(col)) {
      return { char: target, flapping: false };
    }
    return {
      char: glyphs[(step + col * DRUM_OFFSET) % glyphs.length],
      flapping: true,
    };
  };

  const rowLabelText = (row: SplitFlapRow): string =>
    row.label ? `${row.label}: ${row.text}` : row.text;

  const announcement = rows.map(rowLabelText).join(". ");

  return (
    <div
      ref={rootRef}
      className={["jccl-splitflap", className].filter(Boolean).join(" ")}
      data-settled={phase === "settled" ? "true" : undefined}
    >
      <style>{BOARD_CSS}</style>
      <div className="jccl-splitflap-rows">
        {rows.map((row, rowIndex) => (
          <div
            key={`${rowIndex}-${row.text}`}
            role="img"
            aria-label={rowLabelText(row)}
            className="jccl-splitflap-row"
          >
            {row.label ? (
              <span aria-hidden="true" className="jccl-splitflap-label">
                {row.label}
              </span>
            ) : null}
            <span aria-hidden="true" className="jccl-splitflap-cells">
              {row.text
                .padEnd(columnCount, " ")
                .split("")
                .map((target, col) => {
                  const { char, flapping } = drumChar(target, col);
                  return (
                    <span
                      key={col}
                      className="jccl-splitflap-cell"
                      data-flapping={flapping ? "true" : undefined}
                    >
                      <span className="jccl-splitflap-glyph">
                        {char === " " ? "\u00a0" : char}
                      </span>
                    </span>
                  );
                })}
            </span>
          </div>
        ))}
      </div>
      {/* Announced once the board settles; empty while flaps are cycling. */}
      <div aria-live="polite" className="sr-only">
        {phase === "settled" ? announcement : ""}
      </div>
    </div>
  );
}
