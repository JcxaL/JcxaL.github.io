import { Link } from "next-view-transitions";
import type { ReactNode } from "react";

/**
 * DepartureBoard — the concourse departures table: site sections listed as
 * services. Pure render (parents animate rows via [data-depart-row]).
 *
 * - Whole row = one link; the aria-label carries the full announcement so
 *   the columns stay decorative for screen readers.
 * - Status = color + word + shape (CLAUDE.md rule 9): filled disc for a
 *   boarding service, ring for in service, striped square for works.
 * - Destination text is the ONLY board-voice (Doto) text here — never body.
 */

export type DepartureTone = "boarding" | "service" | "works";

export interface Departure {
  href: string;
  destination: string;
  /** Mono "due" cell, e.g. "NOW" or "2026". */
  due: string;
  /** Platform number as printed, e.g. "1". */
  platform: string;
  /** Status word as printed, e.g. "Boarding" / "Under construction". */
  statusWord: string;
  tone: DepartureTone;
}

export interface DepartureBoardProps {
  departures: Departure[];
  className?: string;
}

const TONE_COLOR: Record<DepartureTone, string> = {
  boarding: "var(--color-board-amber)",
  service: "var(--color-status-visited)",
  works: "var(--color-ink-faint)",
};

/** Status shapes — one glyph per tone, so color is never the only signal. */
function ToneShape({ tone }: { tone: DepartureTone }): ReactNode {
  const color = TONE_COLOR[tone];
  if (tone === "works") {
    return (
      <svg aria-hidden="true" width="10" height="10" viewBox="0 0 10 10">
        <rect x="1" y="1" width="8" height="8" fill="none" stroke={color} strokeWidth="1.5" />
        <path d="M1 9 L9 1" stroke={color} strokeWidth="1.5" />
      </svg>
    );
  }
  if (tone === "service") {
    return (
      <svg aria-hidden="true" width="10" height="10" viewBox="0 0 10 10">
        <circle cx="5" cy="5" r="3.5" fill="none" stroke={color} strokeWidth="1.5" />
      </svg>
    );
  }
  return (
    <svg aria-hidden="true" width="10" height="10" viewBox="0 0 10 10">
      <circle cx="5" cy="5" r="4" fill={color} />
    </svg>
  );
}

const BOARD_CSS = `
.jccl-departures {
  background: var(--color-ground-1);
  border: 1px solid var(--color-ground-line);
  border-radius: var(--layout-radius-plate);
  overflow: hidden;
}
.jccl-departures-head,
.jccl-departures-row {
  display: grid;
  grid-template-columns: 5ch minmax(0, 1fr) 5ch 16ch;
  gap: 16px;
  align-items: center;
  padding: 12px 18px;
}
.jccl-departures-head {
  font-family: var(--font-stack-mono);
  font-size: 0.625rem;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--color-ink-faint);
  border-bottom: 1px solid var(--color-ground-line);
  background: var(--color-ground-0);
}
.jccl-departures ol {
  list-style: none;
  margin: 0;
  padding: 0;
}
.jccl-departures li + li {
  border-top: 1px solid var(--color-ground-line);
}
.jccl-departures-row {
  text-decoration: none;
}
.jccl-departures-row:hover {
  background: var(--color-ground-2);
}
@media (prefers-reduced-motion: no-preference) {
  .jccl-departures-row {
    transition: background-color var(--motion-duration-exit) var(--motion-easing-standard);
  }
}
.jccl-departures-due,
.jccl-departures-plat {
  font-family: var(--font-stack-mono);
  font-variant-numeric: tabular-nums;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  color: var(--color-ink-muted);
}
.jccl-departures-dest {
  font-family: var(--font-board);
  font-weight: 600;
  font-size: 1.0625rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-board-amber);
  text-shadow: 0 0 8px var(--color-board-glow);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.jccl-departures-status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-stack-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-ink-muted);
  white-space: nowrap;
}
@media (max-width: 560px) {
  .jccl-departures-head,
  .jccl-departures-row {
    grid-template-columns: 5ch minmax(0, 1fr) 14ch;
    gap: 10px;
    padding: 12px 14px;
  }
  .jccl-departures-plat--col { display: none; }
}
`;

export default function DepartureBoard({
  departures,
  className,
}: DepartureBoardProps) {
  return (
    <nav
      aria-label="Departures"
      className={["jccl-lit-board", "jccl-departures", className]
        .filter(Boolean)
        .join(" ")}
      data-testid="departure-board"
    >
      <style>{BOARD_CSS}</style>
      <div className="jccl-departures-head" aria-hidden="true">
        <span>Due</span>
        <span>Destination</span>
        <span className="jccl-departures-plat--col">Plat</span>
        <span>Status</span>
      </div>
      <ol>
        {departures.map((d) => (
          <li key={d.href} data-depart-row>
            <Link
              href={d.href}
              className="jccl-departures-row"
              aria-label={`${d.destination} — platform ${d.platform}, ${d.statusWord}`}
              data-testid={`departure-${d.destination.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <span aria-hidden="true" className="jccl-departures-due">
                {d.due}
              </span>
              <span aria-hidden="true" className="jccl-departures-dest">
                {d.destination}
              </span>
              <span
                aria-hidden="true"
                className="jccl-departures-plat jccl-departures-plat--col"
              >
                {d.platform}
              </span>
              <span aria-hidden="true" className="jccl-departures-status">
                <ToneShape tone={d.tone} />
                {d.statusWord}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
