import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import TransitDiagram from "@/components/transit/TransitDiagram";
import StationPlate from "@/components/transit/StationPlate";
import StatusLegend from "@/components/transit/StatusLegend";
import { SITE_NETWORK, STATION_NOTES, networkStats } from "@/lib/transit/network";
import type { Line, Station } from "@/lib/transit/types";
import { lineColorVar } from "@/lib/transit/types";

export const metadata: Metadata = {
  title: "Travel — the line guide",
  description:
    "The JccL Line network guide: every station on the map, its status, and the field guides in service. Please choose a station to visit its exhibit.",
};

/**
 * Travel index — the line guide. Each line renders as a vertical strip map:
 * the running rail carries the line color; stations hang off it as plates
 * with journal metadata. System voice for chrome; hooks are journal register.
 */

const STRIP_CSS = `
.jccl-strip {
  list-style: none;
  margin: 0;
  padding: 0;
}
.jccl-strip-entry {
  position: relative;
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr);
  gap: 18px;
  padding: 14px 0;
  scroll-margin-top: 6rem;
}
/* The running rail. First/last entries half-mast it so the line terminates. */
.jccl-strip-entry::before {
  content: "";
  position: absolute;
  left: 11px;
  top: 0;
  bottom: 0;
  width: 6px;
  background: var(--line-color);
}
.jccl-strip-entry[data-first="true"]::before { top: 50%; }
.jccl-strip-entry[data-last="true"]::before { bottom: 50%; }
/* Station node, in the diagram's grammar: ground fill, line-color ring. */
.jccl-strip-node {
  position: relative;
  z-index: 1;
  align-self: center;
  justify-self: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-ground-0);
  border: 3px solid var(--line-color);
}
.jccl-strip-node[data-status="planning"] { border-style: dashed; }
.jccl-strip-node[data-origin="true"] {
  border-color: var(--color-ink-signage);
}
.jccl-strip-card {
  display: block;
  text-decoration: none;
  color: inherit;
}
.jccl-strip-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 8px 18px;
  margin-top: 12px;
}
.jccl-strip-hook {
  margin-top: 8px;
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--color-ink-muted);
  max-width: 60ch;
}
.jccl-strip-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
}
.jccl-strip-tag {
  font-family: var(--font-stack-mono);
  font-size: 0.625rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-ink-muted);
  border: 1px solid var(--color-ground-line);
  border-radius: var(--layout-radius-pill);
  padding: 2px 10px;
}
.jccl-strip-guide {
  font-family: var(--font-stack-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.jccl-strip-guide[data-live="true"] { color: var(--color-board-amber); }
.jccl-strip-guide[data-live="false"] { color: var(--color-ink-faint); }
`;

function LineHeader({ line }: { line: Line }) {
  return (
    <div className="mb-2 flex flex-wrap items-center gap-4">
      <span
        aria-hidden="true"
        className="inline-block h-4 w-10 rounded-full"
        style={{ backgroundColor: lineColorVar(line.id) }}
      />
      <h2 className="jccl-signage text-2xl">{line.name}</h2>
      <span className="jccl-telemetry">
        LINE {line.id.toUpperCase()} · {line.stations.length - 1} STATIONS
      </span>
    </div>
  );
}

function StationEntry({
  line,
  station,
  first,
  last,
}: {
  line: Line;
  station: Station;
  first: boolean;
  last: boolean;
}) {
  const isOrigin = station.code === "X01";
  const note = STATION_NOTES[station.code];

  const card: ReactNode = isOrigin ? (
    <p className="jccl-telemetry self-center">
      {station.code} · HOME — INTERCHANGE · ALL LINES BEGIN HERE
    </p>
  ) : (
    <div className="jccl-panel jccl-lift p-4 sm:p-5">
      <StationPlate
        name={station.name}
        nameLocal={station.nameLocal}
        nameLocalLang={station.nameLocalLang}
        code={station.code}
        line={line.id}
        status={station.status}
      />
      {note ? (
        <>
          <div className="jccl-strip-meta">
            <span className="jccl-telemetry">{note.season.toUpperCase()}</span>
            {station.coords ? (
              <span className="jccl-telemetry">
                {Math.abs(station.coords.lat).toFixed(4)}°
                {station.coords.lat >= 0 ? "N" : "S"} ·{" "}
                {Math.abs(station.coords.lng).toFixed(4)}°
                {station.coords.lng >= 0 ? "E" : "W"}
              </span>
            ) : null}
          </div>
          <p className="jccl-strip-hook">{note.hook}</p>
          <div className="jccl-strip-tags" aria-label="Themes">
            {note.tags.map((tag) => (
              <span key={tag} className="jccl-strip-tag">
                {tag}
              </span>
            ))}
          </div>
          <p
            className="jccl-strip-guide mt-4"
            data-live={note.guideSlug ? "true" : "false"}
          >
            {note.guideSlug ? "Guide in service →" : "Guide in production"}
          </p>
        </>
      ) : null}
    </div>
  );

  return (
    <li
      id={station.code}
      className="jccl-strip-entry"
      data-first={first ? "true" : undefined}
      data-last={last ? "true" : undefined}
      style={{ "--line-color": lineColorVar(line.id) } as CSSProperties}
      data-testid={`strip-${station.code}`}
    >
      <span
        aria-hidden="true"
        className="jccl-strip-node"
        data-status={station.status}
        data-origin={isOrigin ? "true" : undefined}
      />
      {note?.guideSlug ? (
        <Link
          href={`/travel/${note.guideSlug}/`}
          className="jccl-strip-card"
          aria-label={`${station.name} — guide in service`}
        >
          {card}
        </Link>
      ) : (
        <div className="jccl-strip-card">{card}</div>
      )}
    </li>
  );
}

export default function TravelPage() {
  const stats = networkStats();

  return (
    <div className="mx-auto max-w-6xl px-6">
      <style>{STRIP_CSS}</style>

      <section className="pt-14 md:pt-20">
        <p className="jccl-kicker">The JccL Line · Line guide</p>
        <h1 className="jccl-signage mt-5 text-5xl sm:text-6xl">Travel</h1>
        <p
          className="jccl-measure mt-6 text-lg leading-relaxed"
          style={{ color: "var(--color-ink-muted)", maxWidth: "52ch" }}
        >
          Every journey runs on a line. This is the network as it stands —
          stations visited, works in progress, and extensions under survey.
          Please choose a station to visit its exhibit.
        </p>
      </section>

      <section className="mt-10">
        <div className="jccl-panel overflow-x-auto p-6 sm:p-8">
          <TransitDiagram network={SITE_NETWORK} currentCode="X01" />
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <StatusLegend />
            <p className="jccl-telemetry">
              {stats.stations} STATIONS · {stats.lines} LINES ·{" "}
              {stats.byStatus.visited} VISITED · {stats.byStatus.progress} IN
              PROGRESS · {stats.byStatus.planning} PLANNING
            </p>
          </div>
        </div>
      </section>

      {SITE_NETWORK.lines.map((line) => {
        const stations = line.stations
          .map((code) => SITE_NETWORK.stations[code])
          .filter((s): s is Station => Boolean(s));
        return (
          <section key={line.id} className="mt-14">
            <LineHeader line={line} />
            <ol className="jccl-strip">
              {stations.map((station, i) => (
                <StationEntry
                  key={station.code}
                  line={line}
                  station={station}
                  first={i === 0}
                  last={i === stations.length - 1}
                />
              ))}
            </ol>
          </section>
        );
      })}

      <section className="mt-14">
        <p className="jccl-telemetry">
          EXTENSIONS UNDER SURVEY · NEW STATIONS ANNOUNCED IN THE{" "}
          <Link
            href="/blog/"
            className="underline"
            style={{ color: "var(--color-board-amber)" }}
          >
            NOTICES
          </Link>
        </p>
      </section>
    </div>
  );
}
