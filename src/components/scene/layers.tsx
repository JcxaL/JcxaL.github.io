"use client";

import { useId } from "react";
import type { ReactNode } from "react";
import type { LineId } from "@/lib/transit/types";
import { lineColorVar } from "@/lib/transit/types";

/**
 * Scene layer kit for The JccL Line — procedural 2.5D station in geometric
 * transit grammar (flat shapes, thick rounded strokes, zero illustration
 * assets). Spec: docs/design/12-brand-signage.md ("StationScene").
 *
 * Every layer is a pure SVG <g> designed to compose inside one parent
 * <svg viewBox="0 0 1600 900"> (see StationScene.tsx). Rules:
 * - decorative: every layer is aria-hidden (CLAUDE.md rule 9);
 * - every layer carries data-depth — the future parallax rig reads it;
 * - token vars only, no raw hex/duration literals (CLAUDE.md rule 1);
 * - no animation in here: layers are pure functions of props, parents
 *   animate by re-rendering (e.g. TrainLayer x) or wrapping.
 *
 * Geometry bleeds past the 1600x900 viewBox on purpose so parallax
 * translation never exposes a bare edge.
 */

export const SCENE_WIDTH = 1600;
export const SCENE_HEIGHT = 900;

/** Parallax depth per layer, 0 = infinitely far, 1 = front of stage. */
export const SCENE_DEPTHS = {
  sky: 0.05,
  skyline: 0.15,
  canopy: 0.5,
  pillars: 0.7,
  train: 0.8,
  platform: 0.9,
  portal: 1,
} as const;

/* Shared vertical composition (scene px). */
const CANOPY_TOP = 88;
const CANOPY_HEIGHT = 58;
const CANOPY_BOTTOM = CANOPY_TOP + CANOPY_HEIGHT; // 146
const PLATFORM_TOP = 640;
const SKYLINE_BASE = 632; // building feet hide behind train + platform
const TRAIN_TOP = 470;
const TRAIN_BODY_WIDTH = 1180;
const TRAIN_BODY_HEIGHT = 180; // skirt tucks behind the platform slab

/** Default parked position: train body centred on the platform. */
export const TRAIN_PARKED_X = Math.round((SCENE_WIDTH - TRAIN_BODY_WIDTH) / 2); // 210

/* ------------------------------------------------------------------ */
/* Sky                                                                  */
/* ------------------------------------------------------------------ */

/** Deterministic star field: [cx, cy, r, opacity]. */
const STARS: ReadonlyArray<readonly [number, number, number, number]> = [
  [120, 60, 2, 0.7],
  [340, 150, 1.5, 0.5],
  [520, 40, 2, 0.6],
  [700, 120, 1.5, 0.4],
  [880, 70, 2.5, 0.8],
  [1060, 170, 1.5, 0.5],
  [1240, 50, 2, 0.7],
  [1420, 130, 1.5, 0.4],
  [1560, 90, 2, 0.6],
];

/** Night sky: ground-0 fading to a hint of ground-2, plus tiny star dots. */
export function SkyLayer() {
  // useId keeps gradient ids unique across scene instances; strip the
  // wrapper punctuation so the url(#…) reference stays plain-ASCII.
  const gradientId = `jccl-sky-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <g aria-hidden="true" data-depth={SCENE_DEPTHS.sky} data-testid="layer-sky">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--color-ground-0)" />
          <stop offset="0.7" stopColor="var(--color-ground-1)" />
          <stop offset="1" stopColor="var(--color-ground-2)" />
        </linearGradient>
      </defs>
      <rect x={-120} y={-80} width={1840} height={1060} fill={`url(#${gradientId})`} />
      {STARS.map(([cx, cy, r, opacity]) => (
        <circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r={r}
          fill="var(--color-ink-muted)"
          fillOpacity={opacity}
        />
      ))}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Skyline                                                              */
/* ------------------------------------------------------------------ */

interface Building {
  x: number;
  w: number;
  /** Roofline y — the silhouette runs down to SKYLINE_BASE. */
  top: number;
}

const BACK_ROW: readonly Building[] = [
  { x: -80, w: 180, top: 330 },
  { x: 140, w: 130, top: 390 },
  { x: 320, w: 200, top: 300 },
  { x: 560, w: 140, top: 360 },
  { x: 750, w: 220, top: 320 },
  { x: 1010, w: 150, top: 400 },
  { x: 1190, w: 200, top: 310 },
  { x: 1430, w: 250, top: 350 },
];

const FRONT_ROW: readonly Building[] = [
  { x: -60, w: 150, top: 430 },
  { x: 130, w: 190, top: 458 },
  { x: 380, w: 150, top: 440 },
  { x: 600, w: 210, top: 412 },
  { x: 890, w: 170, top: 448 },
  { x: 1110, w: 200, top: 424 },
  { x: 1360, w: 180, top: 442 },
  { x: 1560, w: 140, top: 460 },
];

/** Sparse deterministic lit windows for one silhouette. */
function litWindows(building: Building, seed: number): ReactNode[] {
  const cells: ReactNode[] = [];
  const cols = Math.floor((building.w - 24) / 32);
  const rows = Math.floor((SKYLINE_BASE - building.top - 24) / 44);
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      // Fixed modulo pattern: sparse, deterministic, no randomness.
      if ((row * 7 + col * 3 + seed) % 6 !== 0) continue;
      cells.push(
        <rect
          key={`${row}-${col}`}
          x={building.x + 16 + col * 32}
          y={building.top + 18 + row * 44}
          width={10}
          height={14}
          fill="var(--color-board-amber-dim)"
        />,
      );
    }
  }
  return cells;
}

/** Flat building silhouettes in two ground tones with sparse lit windows. */
export function SkylineLayer() {
  return (
    <g
      aria-hidden="true"
      data-depth={SCENE_DEPTHS.skyline}
      data-testid="layer-skyline"
    >
      {BACK_ROW.map((b) => (
        <rect
          key={`back-${b.x}`}
          x={b.x}
          y={b.top}
          width={b.w}
          height={SKYLINE_BASE - b.top}
          fill="var(--color-ground-1)"
        />
      ))}
      {FRONT_ROW.map((b, i) => (
        <g key={`front-${b.x}`}>
          <rect
            x={b.x}
            y={b.top}
            width={b.w}
            height={SKYLINE_BASE - b.top}
            fill="var(--color-ground-2)"
          />
          {litWindows(b, i)}
        </g>
      ))}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Canopy                                                               */
/* ------------------------------------------------------------------ */

const STRUT_XS = [60, 300, 620, 940, 1260, 1540] as const;

/** Station roof: long rounded canopy slab with thin support struts. */
export function CanopyLayer() {
  return (
    <g
      aria-hidden="true"
      data-depth={SCENE_DEPTHS.canopy}
      data-testid="layer-canopy"
    >
      {STRUT_XS.map((x) => (
        <rect
          key={x}
          x={x - 4}
          y={CANOPY_BOTTOM - 6}
          width={8}
          height={74}
          rx={4}
          fill="var(--color-ground-2)"
          stroke="var(--color-ground-line)"
          strokeWidth={1.5}
        />
      ))}
      <rect
        x={-100}
        y={CANOPY_TOP}
        width={1800}
        height={CANOPY_HEIGHT}
        rx={CANOPY_HEIGHT / 2}
        fill="var(--color-ground-2)"
        stroke="var(--color-ground-line)"
        strokeWidth={3}
      />
      {/* Fascia hairline along the underside. */}
      <line
        x1={-70}
        y1={CANOPY_BOTTOM - 14}
        x2={1670}
        y2={CANOPY_BOTTOM - 14}
        stroke="var(--color-ground-line)"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Pillars                                                              */
/* ------------------------------------------------------------------ */

const PILLAR_XS = [140, 460, 780, 1100, 1420] as const;
const PILLAR_WIDTH = 30;

/** Evenly spaced rounded pillars, each carrying a tiny station plate. */
export function PillarsLayer() {
  return (
    <g
      aria-hidden="true"
      data-depth={SCENE_DEPTHS.pillars}
      data-testid="layer-pillars"
    >
      {PILLAR_XS.map((cx) => (
        <g key={cx} data-testid="pillar">
          <rect
            x={cx - PILLAR_WIDTH / 2}
            y={CANOPY_BOTTOM - 6}
            width={PILLAR_WIDTH}
            height={PLATFORM_TOP - CANOPY_BOTTOM + 66}
            rx={PILLAR_WIDTH / 2}
            fill="var(--color-ground-1)"
            stroke="var(--color-ground-line)"
            strokeWidth={2}
          />
          {/* Tiny enamel station plate at eye level. */}
          <rect
            x={cx - 34}
            y={308}
            width={68}
            height={26}
            rx={6}
            fill="var(--color-ground-0)"
            stroke="var(--color-ink-faint)"
            strokeWidth={1.5}
          />
          <rect
            x={cx - 22}
            y={319}
            width={44}
            height={4}
            rx={2}
            fill="var(--color-ink-muted)"
          />
        </g>
      ))}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Train                                                                */
/* ------------------------------------------------------------------ */

export interface TrainLayerProps {
  /** Line whose color paints the livery stripe. */
  line?: LineId;
  /** Horizontal offset of the train nose-to-tail group in scene px. */
  x?: number;
  /** Cabin glow + headlight on (true) or dimmed/off (false). */
  lightsOn?: boolean;
}

/* Train local geometry (group origin = top-left of the body). */
const DOOR_PAIR_XS = [160, 450, 740, 1030] as const;
const DOOR_LEAF_WIDTH = 34;
const DOOR_TOP = 28;
const DOOR_HEIGHT = 104;
const WINDOW_XS = [56, 260, 350, 550, 640, 840, 930] as const;
const WINDOW_TOP = 30;
const WINDOW_WIDTH = 72;
const WINDOW_HEIGHT = 52;
const CAB_WINDOW_X = 1112;
const STRIPE_TOP = 118;
const STRIPE_HEIGHT = 18;
const HEADLIGHT_CX = 1156;
const HEADLIGHT_CY = 152;

function TrainWindow({
  x,
  width,
  lightsOn,
}: {
  x: number;
  width: number;
  lightsOn: boolean;
}) {
  return (
    <g>
      <rect
        data-testid="train-window"
        x={x}
        y={WINDOW_TOP}
        width={width}
        height={WINDOW_HEIGHT}
        rx={12}
        fill="var(--color-ground-0)"
        stroke="var(--color-ground-line)"
        strokeWidth={2}
      />
      {lightsOn ? (
        <rect
          data-testid="window-glow"
          x={x + 5}
          y={WINDOW_TOP + 5}
          width={width - 10}
          height={WINDOW_HEIGHT - 10}
          rx={8}
          fill="var(--color-board-glow)"
        />
      ) : null}
    </g>
  );
}

/**
 * Side view of a sleek metro train facing the tunnel portal side of the
 * platform: rounded-rect body, line-colored livery stripe, evenly spaced
 * windows with faint amber cabin glow, door pairs with thin seams, and an
 * amber headlight with a glow ellipse.
 */
export function TrainLayer({
  line = "a",
  x = TRAIN_PARKED_X,
  lightsOn = true,
}: TrainLayerProps) {
  return (
    <g
      aria-hidden="true"
      data-depth={SCENE_DEPTHS.train}
      data-testid="layer-train"
      transform={`translate(${x} ${TRAIN_TOP})`}
    >
      {/* Body */}
      <rect
        x={0}
        y={0}
        width={TRAIN_BODY_WIDTH}
        height={TRAIN_BODY_HEIGHT}
        rx={36}
        fill="var(--color-ground-2)"
        stroke="var(--color-ground-line)"
        strokeWidth={3}
      />
      {/* Livery stripe in the line color. */}
      <rect
        data-testid="livery-stripe"
        x={8}
        y={STRIPE_TOP}
        width={TRAIN_BODY_WIDTH - 16}
        height={STRIPE_HEIGHT}
        rx={STRIPE_HEIGHT / 2}
        fill={lineColorVar(line)}
      />
      {/* Door pairs with a thin centre seam; doors interrupt the stripe. */}
      {DOOR_PAIR_XS.map((dx) => (
        <g key={dx} data-testid="train-door-pair">
          <rect
            x={dx}
            y={DOOR_TOP}
            width={DOOR_LEAF_WIDTH * 2 + 4}
            height={DOOR_HEIGHT}
            rx={8}
            fill="var(--color-ground-1)"
            stroke="var(--color-ground-line)"
            strokeWidth={2}
          />
          <line
            x1={dx + DOOR_LEAF_WIDTH + 2}
            y1={DOOR_TOP + 6}
            x2={dx + DOOR_LEAF_WIDTH + 2}
            y2={DOOR_TOP + DOOR_HEIGHT - 6}
            stroke="var(--color-ground-0)"
            strokeWidth={3}
            strokeLinecap="round"
          />
        </g>
      ))}
      {/* Saloon windows + cab window. */}
      {WINDOW_XS.map((wx) => (
        <TrainWindow key={wx} x={wx} width={WINDOW_WIDTH} lightsOn={lightsOn} />
      ))}
      <TrainWindow x={CAB_WINDOW_X} width={48} lightsOn={lightsOn} />
      {/* Headlight: amber disc with a forward glow ellipse when lit. */}
      {lightsOn ? (
        <ellipse
          data-testid="headlight-glow"
          cx={HEADLIGHT_CX + 44}
          cy={HEADLIGHT_CY}
          rx={48}
          ry={16}
          fill="var(--color-board-glow)"
        />
      ) : null}
      <circle
        data-testid="train-headlight"
        cx={HEADLIGHT_CX}
        cy={HEADLIGHT_CY}
        r={9}
        fill={lightsOn ? "var(--color-board-amber)" : "var(--color-board-amber-dim)"}
      />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Platform                                                             */
/* ------------------------------------------------------------------ */

/** Platform slab, edge line, and tactile safety strip in board amber. */
export function PlatformLayer() {
  return (
    <g
      aria-hidden="true"
      data-depth={SCENE_DEPTHS.platform}
      data-testid="layer-platform"
    >
      <rect
        x={-100}
        y={PLATFORM_TOP}
        width={1800}
        height={340}
        fill="var(--color-ground-1)"
      />
      {/* Coping surface along the top. */}
      <rect
        x={-100}
        y={PLATFORM_TOP}
        width={1800}
        height={22}
        fill="var(--color-ground-2)"
      />
      {/* Platform edge line. */}
      <line
        data-testid="platform-edge"
        x1={-100}
        y1={PLATFORM_TOP + 2}
        x2={1700}
        y2={PLATFORM_TOP + 2}
        stroke="var(--color-ink-muted)"
        strokeWidth={3}
      />
      {/* Tactile safety strip: amber dashes behind the edge. */}
      <line
        data-testid="tactile-strip"
        x1={-100}
        y1={PLATFORM_TOP + 40}
        x2={1700}
        y2={PLATFORM_TOP + 40}
        stroke="var(--color-board-amber)"
        strokeWidth={10}
        strokeDasharray="30 22"
        strokeLinecap="round"
        opacity={0.85}
      />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Tunnel portal                                                        */
/* ------------------------------------------------------------------ */

/** Dark tunnel arch at the left end of the platform (frontmost layer). */
export function TunnelPortalLayer() {
  return (
    <g
      aria-hidden="true"
      data-depth={SCENE_DEPTHS.portal}
      data-testid="layer-portal"
    >
      <path
        d="M -100 960 L -100 400 Q -100 296 4 296 L 152 296 Q 256 296 256 400 L 256 960 Z"
        fill="var(--color-ground-0)"
        stroke="var(--color-ground-line)"
        strokeWidth={5}
        strokeLinejoin="round"
      />
      {/* Inner arch ring. */}
      <path
        d="M -76 960 L -76 412 Q -76 322 14 322 L 142 322 Q 232 322 232 412 L 232 960"
        fill="none"
        stroke="var(--color-ground-line)"
        strokeWidth={2}
        opacity={0.7}
      />
    </g>
  );
}
