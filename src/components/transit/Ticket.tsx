"use client";

/**
 * Ticket — the site's key object: a single-journey boarding pass for
 * The JccL Line, in Apple-Wallet pass anatomy.
 *
 * Spec: docs/design/12-brand-signage.md ("Ticket").
 * - Amber top strip, die-cut side notches (CSS mask), passenger row, stops
 *   list (status = dot + word, never color alone — CLAUDE.md rule 9), a
 *   perforation divider, then the punch stub.
 * - Drag-to-punch (Jhey tear-strip pattern): a HIDDEN native range input
 *   (0–100) is the source of truth. The visible stub translates X
 *   proportionally to the value; releasing at >= 60 commits the punch,
 *   below springs back to 0. Tap/click or Enter on the stub also punches.
 * - motion/react is used ONLY for the spring-back/commit micro-animation;
 *   useReducedMotion (plus a matchMedia guard for jsdom/SSR, defaulting to
 *   REDUCED) switches every transition to instant.
 * - A11y: range input labelled "Insert ticket to board" with stateful
 *   aria-valuetext; punching announces "Ticket validated. Doors opening."
 *   via an aria-live=polite region (system voice, doc 12).
 * - data-punched="true" on the root is the test/screenshot hook (doc 08).
 *
 * Token vars only — no raw hex/duration/easing literals (CLAUDE.md rule 1).
 */

import {
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { motion, useReducedMotion } from "motion/react";
import type { StationStatus } from "@/lib/transit/types";
import { statusColorVar } from "@/lib/transit/types";

export interface TicketStop {
  /** Station code, e.g. "A03" — the deterministic ID (doc 12). */
  code: string;
  /** Display name (Latin), e.g. "Kyoto". */
  name: string;
  status: StationStatus;
}

export interface TicketProps {
  /** Passenger name printed on the pass. */
  holder?: string;
  /** Stops printed on the ticket body. */
  stations: TicketStop[];
  /** Controlled punched state. Omit to let the ticket manage itself. */
  punched?: boolean;
  /** Initial punched state when uncontrolled. */
  defaultPunched?: boolean;
  /** Fired once when a punch commits (drag past threshold, tap, or Enter). */
  onPunch?: () => void;
  className?: string;
}

/** System-voice status words (doc 12): color + word, never color alone. */
const STATUS_WORD: Record<StationStatus, string> = {
  visited: "Visited",
  progress: "In progress",
  planning: "Planning",
};

/** Range value (0–100) at which releasing the stub commits the punch. */
const COMMIT_AT = 60;

/** Pointer travel (px) beyond which a click is a drag-release, not a tap. */
const TAP_SLOP_PX = 8;

/** Physical spring for spring-back/commit — physics, not a duration literal. */
const SPRING = { type: "spring", stiffness: 520, damping: 34 } as const;

/** Instant transition: the reduced-motion branch (no-motion-first). */
const INSTANT = { duration: 0 } as const;

/* Token vars only. The mask gradients below use black/transparent purely as
 * alpha (keep/cut) channels — they render no color of their own. */
const TICKET_CSS = `
.jccl-ticket {
  position: relative;
  max-width: 26rem;
  background: var(--color-ground-2);
  border-radius: var(--layout-radius-card);
  color: var(--color-ink-signage);
  font-family: var(--font-signage);
  overflow: hidden;
  -webkit-mask-image:
    radial-gradient(circle 10px at 0 50%, transparent 99%, black 100%),
    radial-gradient(circle 10px at 100% 50%, transparent 99%, black 100%);
  -webkit-mask-composite: source-in;
  mask-image:
    radial-gradient(circle 10px at 0 50%, transparent 99%, black 100%),
    radial-gradient(circle 10px at 100% 50%, transparent 99%, black 100%);
  mask-composite: intersect;
}
.jccl-ticket-strip {
  padding: 7px 18px;
  background: var(--color-board-amber);
  color: var(--color-ink-inverse);
  font-family: var(--font-geist-mono);
  font-variant-caps: small-caps;
  font-weight: 600;
  font-size: 0.6875rem;
  letter-spacing: 0.18em;
}
.jccl-ticket-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 16px 18px;
}
.jccl-ticket-label {
  font-family: var(--font-geist-mono);
  font-size: 0.625rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-ink-faint);
}
.jccl-ticket-passenger {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.jccl-ticket-holder {
  font-weight: 700;
  font-size: 1.125rem;
  line-height: 1.2;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.jccl-ticket-stops {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.jccl-ticket-stop {
  display: flex;
  align-items: center;
  gap: 10px;
}
.jccl-ticket-dot {
  width: 8px;
  height: 8px;
  border-radius: var(--layout-radius-pill);
  flex-shrink: 0;
}
.jccl-ticket-stop-code {
  font-family: var(--font-geist-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.06em;
  color: var(--color-ink-faint);
  min-width: 3.5ch;
}
.jccl-ticket-stop-name {
  flex: 1;
  min-width: 0;
  font-size: 0.9375rem;
}
.jccl-ticket-stop-status {
  font-family: var(--font-geist-mono);
  font-size: 0.625rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  white-space: nowrap;
  color: var(--color-ink-muted);
}
/* Perforation: the dashed tear line before the stub. */
.jccl-ticket-stub {
  border-top: 1px dashed var(--color-ground-line);
  padding: 14px 18px 16px;
}
.jccl-ticket-track {
  position: relative;
  overflow: hidden;
  border-radius: var(--layout-radius-pill);
}
.jccl-ticket-track:has(.jccl-ticket-range:focus-visible) {
  outline: 2px solid var(--color-board-amber);
  outline-offset: 3px;
}
.jccl-ticket-slider,
.jccl-ticket-validated {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 10px 16px;
  background: var(--color-ground-1);
  border: 1px solid var(--color-ground-line);
  border-radius: var(--layout-radius-pill);
  font-family: var(--font-geist-mono);
  font-size: 0.75rem;
  letter-spacing: 0.14em;
  color: var(--color-board-amber);
}
.jccl-ticket-slider {
  pointer-events: none;
  user-select: none;
}
.jccl-ticket-validated {
  letter-spacing: 0.2em;
}
/* The punched hole: a die-cut circle down to station ground. */
.jccl-ticket-hole {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  background: radial-gradient(
    circle at 50% 50%,
    var(--color-ground-0) 58%,
    var(--color-ground-line) 62%,
    transparent 66%
  );
}
/* The hidden range input IS the interaction surface (source of truth). */
.jccl-ticket-range {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  opacity: 0;
  cursor: grab;
  -webkit-appearance: none;
  appearance: none;
}
.jccl-ticket[data-punched="true"] .jccl-ticket-range {
  cursor: default;
}
`;

export default function Ticket({
  holder = "GUEST",
  stations,
  punched,
  defaultPunched = false,
  onPunch,
  className,
}: TicketProps) {
  const isControlled = punched !== undefined;
  const [internalPunched, setInternalPunched] = useState(defaultPunched);
  const isPunched = isControlled ? punched : internalPunched;

  /** Insertion progress 0–100, mirrored from the hidden range input. */
  const [value, setValue] = useState(0);
  /** True while the pointer is down — the stub tracks 1:1, no spring lag. */
  const [dragging, setDragging] = useState(false);
  /** Pointer-down x, to tell a tap (punch) from a drag-release (no punch). */
  const downXRef = useRef<number | null>(null);

  /* Reduced motion: no-motion-first. When matchMedia is unavailable
   * (jsdom/SSR) or the preference is unknown, default to REDUCED. */
  const systemReducedMotion = useReducedMotion();
  const canMatchMedia =
    typeof window !== "undefined" && typeof window.matchMedia === "function";
  const reduceMotion = !canMatchMedia || systemReducedMotion !== false;

  const commitPunch = () => {
    if (isPunched) return;
    if (!isControlled) setInternalPunched(true);
    setValue(100);
    onPunch?.();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (isPunched) return;
    const next = Number(event.target.value);
    if (!Number.isFinite(next)) return;
    setValue(next);
    if (next >= COMMIT_AT) commitPunch();
  };

  /** Release below the threshold springs the stub back to the gate. */
  const springBack = () => {
    setDragging(false);
    if (!isPunched && value < COMMIT_AT) setValue(0);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    downXRef.current = event.clientX;
    if (!isPunched) setDragging(true);
  };

  /** Tap-to-punch. A click at the end of a real drag is suppressed. */
  const handleTrackClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    const downX = downXRef.current;
    downXRef.current = null;
    const travelled = downX === null ? 0 : Math.abs(event.clientX - downX);
    if (travelled > TAP_SLOP_PX) return;
    commitPunch();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    commitPunch();
  };

  const valueText = isPunched
    ? "Ticket validated"
    : value === 0
      ? "Ticket ready. Slide right or press Enter to insert."
      : `Ticket ${value}% inserted`;

  return (
    <div
      className={["jccl-ticket", className].filter(Boolean).join(" ")}
      data-testid="jccl-ticket"
      data-punched={isPunched ? "true" : undefined}
    >
      <style>{TICKET_CSS}</style>

      <div className="jccl-ticket-strip">THE JccL LINE · SINGLE JOURNEY</div>

      <div className="jccl-ticket-body">
        <div className="jccl-ticket-passenger">
          <span className="jccl-ticket-label">PASSENGER</span>
          <span className="jccl-ticket-holder">{holder}</span>
        </div>

        <ul className="jccl-ticket-stops" aria-label="Stops on this journey">
          {stations.map((stop) => (
            <li
              key={stop.code}
              className="jccl-ticket-stop"
              data-testid={`ticket-stop-${stop.code}`}
            >
              <span
                aria-hidden="true"
                className="jccl-ticket-dot"
                style={{ backgroundColor: statusColorVar(stop.status) }}
              />
              <span className="jccl-ticket-stop-code">{stop.code}</span>
              <span className="jccl-ticket-stop-name">{stop.name}</span>
              <span className="jccl-ticket-stop-status">
                {STATUS_WORD[stop.status]}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="jccl-ticket-stub">
        <div
          className="jccl-ticket-track"
          data-testid="ticket-stub"
          onPointerDown={handlePointerDown}
          onPointerUp={springBack}
          onPointerCancel={springBack}
          onClick={handleTrackClick}
        >
          {isPunched ? (
            /* Commit micro-animation: the validated stub pops into place. */
            <motion.div
              className="jccl-ticket-validated"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={reduceMotion ? INSTANT : SPRING}
            >
              <span aria-hidden="true" className="jccl-ticket-hole" />
              {/* Board-resolve: the second reserved Doto axis moment (doc 12). */}
              <span className="jccl-board-arrive" style={{ fontSize: "0.8125rem" }}>
                VALIDATED
              </span>
            </motion.div>
          ) : (
            /* The stub tracks the range value; springs back on release. */
            <motion.div
              aria-hidden="true"
              className="jccl-ticket-slider"
              initial={false}
              animate={{ x: `${value}%` }}
              transition={reduceMotion || dragging ? INSTANT : SPRING}
            >
              INSERT TO BOARD →
            </motion.div>
          )}
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={isPunched ? 100 : value}
            className="jccl-ticket-range"
            aria-label="Insert ticket to board"
            aria-valuetext={valueText}
            aria-disabled={isPunched || undefined}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={springBack}
          />
        </div>
        {/* Announced when the punch commits; empty until then. */}
        <div aria-live="polite" className="sr-only">
          {isPunched ? "Ticket validated. Doors opening." : ""}
        </div>
      </div>
    </div>
  );
}
