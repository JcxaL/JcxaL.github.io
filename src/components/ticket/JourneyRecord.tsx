"use client";

import { SITE_NETWORK, stationsInLineOrder } from "@/lib/transit/network";
import { clearPunches, usePunches } from "@/lib/ticket/punchStore";

/**
 * JourneyRecord — the punched-journey strip under the concourse ticket.
 * One hole per destination station: die-cut when its exhibit has been
 * visited, dashed outline otherwise (status = shape + word, never color
 * alone). Server-renders as an unpunched journey; punches hydrate in.
 */

const RECORD_CSS = `
.jccl-journey {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.jccl-journey-holes {
  display: flex;
  align-items: center;
  gap: 18px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.jccl-journey-stop {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.jccl-journey-hole {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px dashed var(--color-ink-faint);
  background: transparent;
}
.jccl-journey-stop[data-punched="true"] .jccl-journey-hole {
  /* A die-cut hole: punched through to station ground. */
  border: 2px solid var(--color-board-amber);
  background: radial-gradient(
    circle at 50% 50%,
    var(--color-ground-0) 62%,
    var(--color-board-amber) 66%,
    transparent 72%
  );
}
.jccl-journey-code {
  font-family: var(--font-stack-mono);
  font-size: 0.625rem;
  letter-spacing: 0.08em;
  color: var(--color-ink-muted);
}
.jccl-journey-clear {
  align-self: flex-start;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  font-family: var(--font-stack-mono);
  font-size: 0.625rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-ink-faint);
  text-decoration: underline;
  text-underline-offset: 3px;
}
.jccl-journey-clear:hover {
  color: var(--color-ink-muted);
}
`;

export default function JourneyRecord() {
  const punches = usePunches();
  const destinations = stationsInLineOrder().filter((code) => code !== "X01");
  const punchedCount = destinations.filter((code) =>
    punches.includes(code),
  ).length;

  return (
    <div className="jccl-journey" data-testid="journey-record">
      <style>{RECORD_CSS}</style>
      <p className="jccl-telemetry">
        JOURNEY RECORD · {punchedCount} OF {destinations.length} STATIONS
        PUNCHED
      </p>
      <ol className="jccl-journey-holes">
        {destinations.map((code) => {
          const punched = punches.includes(code);
          const station = SITE_NETWORK.stations[code];
          return (
            <li
              key={code}
              className="jccl-journey-stop"
              data-punched={punched ? "true" : "false"}
              data-testid={`journey-stop-${code}`}
            >
              <span
                className={
                  punched
                    ? "jccl-journey-hole jccl-lit-board"
                    : "jccl-journey-hole"
                }
                role="img"
                aria-label={`${station?.name ?? code} — ${punched ? "punched" : "not yet punched"}`}
              />
              <span aria-hidden="true" className="jccl-journey-code">
                {code}
              </span>
            </li>
          );
        })}
      </ol>
      {punchedCount > 0 ? (
        <button
          type="button"
          className="jccl-journey-clear"
          onClick={() => clearPunches()}
        >
          Tear up ticket · start a new journey
        </button>
      ) : null}
    </div>
  );
}
