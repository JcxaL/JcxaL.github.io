"use client";

import type { LineId } from "@/lib/transit/types";
import {
  CanopyLayer,
  PillarsLayer,
  PlatformLayer,
  SCENE_DEPTHS,
  SCENE_HEIGHT,
  SCENE_WIDTH,
  SkyLayer,
  SkylineLayer,
  TrainLayer,
  TRAIN_PARKED_X,
  TunnelPortalLayer,
} from "./layers";

/**
 * StationScene — procedural 2.5D station platform for The JccL Line.
 * Spec: docs/design/12-brand-signage.md ("StationScene").
 *
 * Composes the scene layer kit (layers.tsx) in depth order inside one
 * responsive SVG. This component is a pure function of its props — no
 * animation lives here. Parents animate trainX/lightsOn by re-rendering
 * (with their own reduced-motion branch), and the future parallax rig
 * reads each layer's data-depth attribute.
 *
 * The scene is a single labelled image (role="img"); every internal layer
 * is decorative and aria-hidden per CLAUDE.md rule 9.
 */
export interface StationSceneProps {
  /** Station display name for the accessible label. */
  stationName?: string;
  /** Line whose color paints the train livery stripe. */
  line?: LineId;
  /** Train x offset in scene units (0–1600). Defaults to parked at platform. */
  trainX?: number;
  /** Cabin glow + headlight on (true, default) or dimmed (false). */
  lightsOn?: boolean;
  className?: string;
}

/**
 * DotMatrix-style destination strip placeholder hung under the canopy,
 * above the platform. A simple amber rect group only — the real
 * DotMatrixSign component overlays this spot in the DOM later.
 */
function DestinationStripPlaceholder() {
  return (
    <g
      aria-hidden="true"
      data-depth={SCENE_DEPTHS.canopy}
      data-testid="destination-strip"
    >
      {/* Hanger stems from the canopy. */}
      <rect x={604} y={140} width={6} height={52} fill="var(--color-ground-line)" />
      <rect x={990} y={140} width={6} height={52} fill="var(--color-ground-line)" />
      {/* Sign housing. */}
      <rect
        x={560}
        y={190}
        width={480}
        height={64}
        rx={10}
        fill="var(--color-ground-0)"
        stroke="var(--color-ground-line)"
        strokeWidth={3}
      />
      {/* Unlit LED strip with one lit segment. */}
      <rect
        x={584}
        y={208}
        width={432}
        height={28}
        rx={4}
        fill="var(--color-board-amber-dim)"
        opacity={0.55}
      />
      <rect
        x={584}
        y={208}
        width={112}
        height={28}
        rx={4}
        fill="var(--color-board-amber)"
        opacity={0.8}
      />
    </g>
  );
}

export function StationScene({
  stationName = "Station",
  line = "a",
  trainX = TRAIN_PARKED_X,
  lightsOn = true,
  className,
}: StationSceneProps) {
  return (
    <svg
      viewBox={`0 0 ${SCENE_WIDTH} ${SCENE_HEIGHT}`}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`${stationName} platform, The JccL Line`}
      data-testid="station-scene"
      className={className}
      style={{ display: "block", width: "100%", height: "100%" }}
    >
      <SkyLayer />
      <SkylineLayer />
      <CanopyLayer />
      <PillarsLayer />
      <TrainLayer line={line} x={trainX} lightsOn={lightsOn} />
      <PlatformLayer />
      <DestinationStripPlaceholder />
      <TunnelPortalLayer />
    </svg>
  );
}

export default StationScene;
