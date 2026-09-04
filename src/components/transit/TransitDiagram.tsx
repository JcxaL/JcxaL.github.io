"use client";

import type { KeyboardEvent, ReactNode } from "react";
import type { LineId, Station, TransitNetwork } from "@/lib/transit/types";
import { lineColorVar } from "@/lib/transit/types";

/**
 * TransitDiagram — octilinear SVG line-diagram renderer.
 * Renders each line as a single path through its stations' grid coordinates
 * with strictly octilinear segments (classic Beck elbow: diagonal first, then
 * straight). Interchanges render as white-stroked capsules; the current
 * station gets a board-amber halo. Pure, deterministic render — no animation
 * lives in this component (parents animate it).
 */
export interface TransitDiagramProps {
  network: TransitNetwork;
  /** Station code to highlight with a halo ring ("you are here"). */
  currentCode?: string;
  /** When provided, stations become keyboard-operable buttons. */
  onStationClick?: (code: string) => void;
  className?: string;
  /** Station name labels (default true). */
  showLabels?: boolean;
}

/** Diagram grid pitch in px — station (x, y) are multiplied by this. */
export const GRID = 48;

const PAD = GRID;
const LABEL_SPACE = 96;
const NODE_R = 7;
const CAPSULE_R = 12;
const HALO_R = 13;
const FOCUS_R = 16;
const LABEL_OFFSET_X = NODE_R + 7;

/**
 * Octilinear segment between two stations (pixel space). Straight when the
 * pair is already horizontal, vertical, or exactly 45°; otherwise one Beck
 * elbow — go diagonal first, then straight. Deterministic.
 */
function segmentPath(from: Station, to: Station): string {
  const ax = from.x * GRID;
  const ay = from.y * GRID;
  const bx = to.x * GRID;
  const by = to.y * GRID;
  const dx = bx - ax;
  const dy = by - ay;
  if (dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy)) {
    return `L ${bx} ${by}`;
  }
  const run = Math.min(Math.abs(dx), Math.abs(dy));
  const elbowX = ax + Math.sign(dx) * run;
  const elbowY = ay + Math.sign(dy) * run;
  return `L ${elbowX} ${elbowY} L ${bx} ${by}`;
}

function linePath(stations: Station[]): string {
  if (stations.length === 0) return "";
  const [first, ...rest] = stations;
  let d = `M ${first.x * GRID} ${first.y * GRID}`;
  let prev = first;
  for (const next of rest) {
    d += ` ${segmentPath(prev, next)}`;
    prev = next;
  }
  return d;
}

interface PlacedStation {
  station: Station;
  line: LineId;
}

export function TransitDiagram({
  network,
  currentCode,
  onStationClick,
  className,
  showLabels = true,
}: TransitDiagramProps) {
  // Unique stations in deterministic line order; each keeps the first line
  // that claims it (colors its node ring).
  const placed: PlacedStation[] = [];
  const seen = new Set<string>();
  for (const line of network.lines) {
    for (const code of line.stations) {
      if (seen.has(code)) continue;
      const station = network.stations[code];
      if (!station) continue;
      seen.add(code);
      placed.push({ station, line: line.id });
    }
  }

  const interchangeCodes = new Set(
    network.interchanges.flatMap((i) => i.codes),
  );

  // Canvas bounds from station positions.
  const xs = placed.map((p) => p.station.x * GRID);
  const ys = placed.map((p) => p.station.y * GRID);
  const minX = xs.length ? Math.min(...xs) : 0;
  const maxX = xs.length ? Math.max(...xs) : 0;
  const minY = ys.length ? Math.min(...ys) : 0;
  const maxY = ys.length ? Math.max(...ys) : 0;
  const width = maxX - minX + PAD * 2 + (showLabels ? LABEL_SPACE : 0);
  const height = maxY - minY + PAD * 2;
  const viewBox = `${minX - PAD} ${minY - PAD} ${width} ${height}`;

  const lineCount = network.lines.length;
  const stationCount = placed.length;
  const ariaLabel = `Transit diagram of The JccL Line: ${lineCount} ${
    lineCount === 1 ? "line" : "lines"
  }, ${stationCount} ${stationCount === 1 ? "station" : "stations"}.`;

  const handleKeyDown = (code: string) => (event: KeyboardEvent<SVGGElement>) => {
    if (!onStationClick) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onStationClick(code);
    }
  };

  const renderStation = ({ station, line }: PlacedStation): ReactNode => {
    const cx = station.x * GRID;
    const cy = station.y * GRID;
    const isInterchange = interchangeCodes.has(station.code);
    const isCurrent = currentCode === station.code;
    const clickable = Boolean(onStationClick);

    const contents = (
      <>
        {isCurrent ? (
          <circle
            data-testid="current-halo"
            cx={cx}
            cy={cy}
            r={HALO_R}
            fill="none"
            stroke="var(--color-board-amber)"
            strokeWidth={2}
          />
        ) : null}
        {isInterchange ? (
          // Capsule already marks this station; keep an invisible hit target.
          <circle
            cx={cx}
            cy={cy}
            r={CAPSULE_R}
            fill="transparent"
            stroke="none"
          />
        ) : (
          <circle
            data-testid={`station-node-${station.code}`}
            cx={cx}
            cy={cy}
            r={NODE_R}
            fill="var(--color-ground-0)"
            stroke={lineColorVar(line)}
            strokeWidth={3}
            strokeDasharray={
              station.status === "planning" ? "3 3" : undefined
            }
          />
        )}
        {clickable ? (
          <circle
            className="jccl-focus-ring"
            cx={cx}
            cy={cy}
            r={FOCUS_R}
            fill="none"
            stroke="none"
            strokeWidth={2}
            pointerEvents="none"
          />
        ) : null}
        {showLabels ? (
          <text
            x={cx + LABEL_OFFSET_X}
            y={cy + 4}
            fontSize={11}
            fontFamily="var(--font-signage)"
            fill="var(--color-ink-signage)"
          >
            {station.name}
          </text>
        ) : null}
      </>
    );

    if (clickable) {
      return (
        <g
          key={station.code}
          data-testid={`station-${station.code}`}
          role="button"
          tabIndex={0}
          aria-label={`${station.name}, station ${station.code}`}
          onClick={() => onStationClick?.(station.code)}
          onKeyDown={handleKeyDown(station.code)}
        >
          {contents}
        </g>
      );
    }
    return (
      <g key={station.code} data-testid={`station-${station.code}`}>
        {contents}
      </g>
    );
  };

  return (
    <svg
      data-testid="transit-diagram"
      // role=img flattens children for AT; with clickable stations inside,
      // that nests interactive controls — expose a labelled group instead.
      role={onStationClick ? "group" : "img"}
      aria-label={ariaLabel}
      viewBox={viewBox}
      width={width}
      height={height}
      className={["jccl-transit-diagram", className]
        .filter(Boolean)
        .join(" ")}
      style={{ maxWidth: "100%", height: "auto", display: "block" }}
    >
      {/* Visible focus for keyboard users; token colors only. */}
      <style>{`
        .jccl-transit-diagram g[role="button"] { cursor: pointer; outline: none; }
        .jccl-transit-diagram g[role="button"]:focus-visible .jccl-focus-ring {
          stroke: var(--color-accent-base);
        }
      `}</style>
      {network.lines.map((line) => {
        const stations = line.stations
          .map((code) => network.stations[code])
          .filter((s): s is Station => Boolean(s));
        if (stations.length < 2) return null;
        return (
          <path
            key={line.id}
            data-testid={`line-path-${line.id}`}
            d={linePath(stations)}
            fill="none"
            stroke={lineColorVar(line.id)}
            strokeWidth={6}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      })}
      {network.interchanges.map((interchange) => {
        const points = interchange.codes
          .map((code) => network.stations[code])
          .filter((s): s is Station => Boolean(s))
          .map((s) => ({ x: s.x * GRID, y: s.y * GRID }));
        if (points.length === 0) return null;
        const capMinX = Math.min(...points.map((p) => p.x));
        const capMaxX = Math.max(...points.map((p) => p.x));
        const capMinY = Math.min(...points.map((p) => p.y));
        const capMaxY = Math.max(...points.map((p) => p.y));
        return (
          <rect
            key={interchange.codes.join("-")}
            data-testid={`interchange-${interchange.codes.join("-")}`}
            x={capMinX - CAPSULE_R}
            y={capMinY - CAPSULE_R}
            width={capMaxX - capMinX + CAPSULE_R * 2}
            height={capMaxY - capMinY + CAPSULE_R * 2}
            rx={CAPSULE_R}
            fill="var(--color-ground-0)"
            stroke="var(--color-ink-signage)"
            strokeWidth={3}
          />
        );
      })}
      {placed.map(renderStation)}
    </svg>
  );
}

export default TransitDiagram;
