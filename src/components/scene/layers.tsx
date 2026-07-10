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
 * - lighting is PAINT-ONLY: linear/radial gradients with stop-opacity
 *   falloff. No SVG filters — feGaussianBlur re-rasters per frame under
 *   the scroll scrub;
 * - aerial perspective: farther layers sit closer to ground-0, nearer
 *   layers get lighter tops and sharper amber accents, so depth reads
 *   tonally, not just through parallax motion;
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

/**
 * Stable, plain-ASCII id prefix for per-instance gradient defs. useId keeps
 * ids unique across scene instances; the wrapper punctuation is stripped so
 * url(#…) references stay valid.
 */
function useSceneId(prefix: string): string {
  const raw = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return `${prefix}-${raw}`;
}

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
  [1150, 44, 1.5, 0.55],
  [1420, 130, 1.5, 0.4],
  [1560, 90, 2, 0.6],
  [240, 214, 1.5, 0.45],
  [960, 238, 2, 0.5],
];

/**
 * Night sky: barely-perceptible vertical gradient from ground-0 at the
 * zenith to a hair of ground-2 at the horizon, an amber city-glow pooled
 * behind the skyline, a crescent moon, and tiny star dots. The gradient is
 * userSpaceOnUse so the moon's crescent bite can refill with the exact sky
 * tone at its position.
 */
export function SkyLayer() {
  const uid = useSceneId("jccl-sky");
  const skyId = `${uid}-g`;
  const cityGlowId = `${uid}-city`;
  const moonHaloId = `${uid}-moon`;
  return (
    <g aria-hidden="true" data-depth={SCENE_DEPTHS.sky} data-testid="layer-sky">
      <defs>
        <linearGradient
          id={skyId}
          gradientUnits="userSpaceOnUse"
          x1={0}
          y1={-80}
          x2={0}
          y2={980}
        >
          <stop offset="0" stopColor="var(--color-ground-0)" />
          <stop offset="0.5" stopColor="var(--color-ground-1)" />
          <stop offset="0.72" stopColor="var(--color-ground-2)" />
          <stop offset="1" stopColor="var(--color-ground-2)" />
        </linearGradient>
        <radialGradient id={cityGlowId}>
          <stop offset="0" stopColor="var(--color-board-amber)" stopOpacity={0.1} />
          <stop offset="0.55" stopColor="var(--color-board-amber)" stopOpacity={0.04} />
          <stop offset="1" stopColor="var(--color-board-amber)" stopOpacity={0} />
        </radialGradient>
        <radialGradient id={moonHaloId}>
          <stop offset="0" stopColor="var(--color-ink-signage)" stopOpacity={0.16} />
          <stop offset="0.4" stopColor="var(--color-ink-signage)" stopOpacity={0.06} />
          <stop offset="1" stopColor="var(--color-ink-signage)" stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect x={-120} y={-80} width={1840} height={1060} fill={`url(#${skyId})`} />
      {/* City glow pooled at the horizon, behind the skyline silhouettes. */}
      <ellipse cx={820} cy={648} rx={980} ry={300} fill={`url(#${cityGlowId})`} />
      {/* Crescent moon: pale disc, bite refilled with the sky gradient. */}
      <circle cx={1252} cy={182} r={46} fill={`url(#${moonHaloId})`} />
      <circle
        cx={1252}
        cy={182}
        r={15}
        fill="var(--color-ink-signage)"
        fillOpacity={0.8}
      />
      <circle cx={1259} cy={176} r={14} fill={`url(#${skyId})`} />
      {STARS.map(([cx, cy, r, opacity]) => (
        <circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r={r}
          fill={opacity >= 0.7 ? "var(--color-ink-signage)" : "var(--color-ink-muted)"}
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

/**
 * Sparse deterministic lit windows for one silhouette. A second, rarer
 * modulo picks brighter panes so blocks read lived-in, not gridded.
 */
function litWindows(building: Building, seed: number): ReactNode[] {
  const cells: ReactNode[] = [];
  const cols = Math.floor((building.w - 24) / 32);
  const rows = Math.floor((SKYLINE_BASE - building.top - 24) / 44);
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      // Fixed modulo pattern: sparse, deterministic, no randomness.
      if ((row * 7 + col * 3 + seed) % 6 !== 0) continue;
      const bright = (row * 5 + col * 2 + seed) % 7 === 0;
      cells.push(
        <rect
          key={`${row}-${col}`}
          x={building.x + 16 + col * 32}
          y={building.top + 18 + row * 44}
          width={10}
          height={14}
          fill={bright ? "var(--color-board-amber)" : "var(--color-board-amber-dim)"}
          fillOpacity={bright ? 0.55 : 0.9}
        />,
      );
    }
  }
  return cells;
}

/** Even rarer lit windows for the hazy back row. */
function backLitWindows(building: Building, seed: number): ReactNode[] {
  const cells: ReactNode[] = [];
  const cols = Math.floor((building.w - 24) / 34);
  const rows = Math.floor((SKYLINE_BASE - building.top - 24) / 48);
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      if ((row * 5 + col * 3 + seed) % 11 !== 0) continue;
      cells.push(
        <rect
          key={`${row}-${col}`}
          x={building.x + 14 + col * 34}
          y={building.top + 16 + row * 48}
          width={8}
          height={11}
          fill="var(--color-board-amber-dim)"
          fillOpacity={0.45}
        />,
      );
    }
  }
  return cells;
}

/**
 * Flat building silhouettes with aerial perspective: the back row is a
 * darker haze (sky bleeds through) melting toward ground-0, the front row
 * is lighter with moonlit parapets, roof furniture, and warmer windows.
 */
export function SkylineLayer() {
  const uid = useSceneId("jccl-skyline");
  const frontGradId = `${uid}-front`;
  return (
    <g
      aria-hidden="true"
      data-depth={SCENE_DEPTHS.skyline}
      data-testid="layer-skyline"
    >
      <defs>
        <linearGradient id={frontGradId} x1={0} y1={0} x2={0} y2={1}>
          <stop offset="0" stopColor="var(--color-ground-line)" />
          <stop offset="0.3" stopColor="var(--color-ground-2)" />
          <stop offset="1" stopColor="var(--color-ground-2)" />
        </linearGradient>
      </defs>
      {BACK_ROW.map((b, i) => (
        <g key={`back-${b.x}`}>
          <rect
            x={b.x}
            y={b.top}
            width={b.w}
            height={SKYLINE_BASE - b.top}
            fill="var(--color-ground-1)"
            fillOpacity={0.85}
          />
          {backLitWindows(b, i)}
        </g>
      ))}
      {FRONT_ROW.map((b, i) => (
        <g key={`front-${b.x}`}>
          <rect
            x={b.x}
            y={b.top}
            width={b.w}
            height={SKYLINE_BASE - b.top}
            fill={`url(#${frontGradId})`}
          />
          {/* Moonlit parapet lip. */}
          <rect
            x={b.x}
            y={b.top}
            width={b.w}
            height={3}
            fill="var(--color-ink-faint)"
            fillOpacity={0.35}
          />
          {/* Roof furniture: alternating antenna masts and plant boxes. */}
          {i % 3 === 0 ? (
            <g>
              <line
                x1={b.x + b.w * 0.3}
                y1={b.top}
                x2={b.x + b.w * 0.3}
                y2={b.top - 38}
                stroke="var(--color-ground-line)"
                strokeWidth={2}
              />
              <circle
                cx={b.x + b.w * 0.3}
                cy={b.top - 40}
                r={2.5}
                fill="var(--color-board-amber-dim)"
              />
            </g>
          ) : (
            <rect
              x={b.x + b.w - 52}
              y={b.top - 12}
              width={36}
              height={12}
              rx={2}
              fill="var(--color-ground-1)"
            />
          )}
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

/** Lamp positions along the fascia, clear of the destination strip. */
const LAMP_XS = [180, 440, 1160, 1400] as const;

/**
 * Station roof: canopy slab with a shaded underside, thin support struts,
 * and hung lamp fixtures whose amber bloom is a pure radial-gradient disc
 * (paint-only — no filters).
 */
export function CanopyLayer() {
  const uid = useSceneId("jccl-canopy");
  const slabGradId = `${uid}-slab`;
  const bloomId = `${uid}-bloom`;
  return (
    <g
      aria-hidden="true"
      data-depth={SCENE_DEPTHS.canopy}
      data-testid="layer-canopy"
    >
      <defs>
        <linearGradient id={slabGradId} x1={0} y1={0} x2={0} y2={1}>
          <stop offset="0" stopColor="var(--color-ground-2)" />
          <stop offset="0.6" stopColor="var(--color-ground-2)" />
          <stop offset="1" stopColor="var(--color-ground-1)" />
        </linearGradient>
        <radialGradient id={bloomId}>
          <stop offset="0" stopColor="var(--color-board-amber)" stopOpacity={0.3} />
          <stop offset="0.35" stopColor="var(--color-board-amber)" stopOpacity={0.16} />
          <stop offset="0.7" stopColor="var(--color-board-amber)" stopOpacity={0.06} />
          <stop offset="1" stopColor="var(--color-board-amber)" stopOpacity={0} />
        </radialGradient>
      </defs>
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
        fill={`url(#${slabGradId})`}
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
      {/* Hung platform lamps: bloom disc first, then stem, housing, tube. */}
      {LAMP_XS.map((x) => (
        <g key={x} data-testid="canopy-lamp">
          <circle cx={x} cy={172} r={72} fill={`url(#${bloomId})`} />
          <rect
            x={x - 2}
            y={CANOPY_BOTTOM - 4}
            width={4}
            height={16}
            fill="var(--color-ground-line)"
          />
          <rect
            x={x - 19}
            y={158}
            width={38}
            height={12}
            rx={6}
            fill="var(--color-ground-2)"
            stroke="var(--color-ground-line)"
            strokeWidth={1.5}
          />
          <rect
            x={x - 13}
            y={161.5}
            width={26}
            height={5}
            rx={2.5}
            fill="var(--color-board-amber)"
            fillOpacity={0.9}
          />
        </g>
      ))}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Pillars                                                              */
/* ------------------------------------------------------------------ */

const PILLAR_XS = [140, 460, 780, 1100, 1420] as const;
const PILLAR_WIDTH = 30;

/** Catenary anchors: pillar centres plus off-stage virtual anchors. */
const CATENARY_ANCHORS = [-180, ...PILLAR_XS, 1740] as const;
const MESSENGER_Y = 428;
const MESSENGER_SAG = 20;
const CONTACT_Y = 452;

/** Messenger-wire path: quadratic sag between consecutive anchors. */
function messengerPath(): string {
  const segments: string[] = [`M ${CATENARY_ANCHORS[0]} ${MESSENGER_Y}`];
  for (let i = 1; i < CATENARY_ANCHORS.length; i += 1) {
    const mid = (CATENARY_ANCHORS[i - 1] + CATENARY_ANCHORS[i]) / 2;
    segments.push(
      `Q ${mid} ${MESSENGER_Y + MESSENGER_SAG} ${CATENARY_ANCHORS[i]} ${MESSENGER_Y}`,
    );
  }
  return segments.join(" ");
}

/** Vertical dropper wires from the sagging messenger to the contact wire. */
function dropperLines(): ReactNode[] {
  const lines: ReactNode[] = [];
  for (let i = 1; i < CATENARY_ANCHORS.length; i += 1) {
    const x0 = CATENARY_ANCHORS[i - 1];
    const span = CATENARY_ANCHORS[i] - x0;
    for (const t of [0.25, 0.5, 0.75]) {
      // Quadratic bezier y at t with both ends at MESSENGER_Y.
      const y = MESSENGER_Y + 2 * t * (1 - t) * MESSENGER_SAG;
      lines.push(
        <line
          key={`${x0}-${t}`}
          x1={x0 + span * t}
          y1={y}
          x2={x0 + span * t}
          y2={CONTACT_Y}
          stroke="var(--color-ground-line)"
          strokeWidth={1}
          opacity={0.7}
        />,
      );
    }
  }
  return lines;
}

/**
 * Evenly spaced pillars with capitals and plinth bases, each carrying a
 * tiny station plate, plus the thin catenary run (sagging messenger wire,
 * droppers, straight contact wire) strung behind them.
 */
export function PillarsLayer() {
  const uid = useSceneId("jccl-pillars");
  const pillarGradId = `${uid}-round`;
  return (
    <g
      aria-hidden="true"
      data-depth={SCENE_DEPTHS.pillars}
      data-testid="layer-pillars"
    >
      <defs>
        <linearGradient id={pillarGradId} x1={0} y1={0} x2={1} y2={0}>
          <stop offset="0" stopColor="var(--color-ground-1)" />
          <stop offset="0.45" stopColor="var(--color-ground-2)" />
          <stop offset="1" stopColor="var(--color-ground-1)" />
        </linearGradient>
      </defs>
      {/* Catenary: messenger with sag, droppers, straight contact wire. */}
      <g data-testid="catenary">
        <path
          d={messengerPath()}
          fill="none"
          stroke="var(--color-ground-line)"
          strokeWidth={1.5}
          opacity={0.85}
        />
        {dropperLines()}
        <line
          x1={-180}
          y1={CONTACT_Y}
          x2={1740}
          y2={CONTACT_Y}
          stroke="var(--color-ground-line)"
          strokeWidth={2}
          opacity={0.9}
        />
        {/* Cantilever arm stubs at each pillar. */}
        {PILLAR_XS.map((cx) => (
          <line
            key={cx}
            x1={cx - 22}
            y1={MESSENGER_Y}
            x2={cx + 22}
            y2={MESSENGER_Y}
            stroke="var(--color-ground-line)"
            strokeWidth={2.5}
            opacity={0.9}
          />
        ))}
      </g>
      {PILLAR_XS.map((cx) => (
        <g key={cx} data-testid="pillar">
          {/* Shaft with a soft cylindrical sheen. */}
          <rect
            x={cx - PILLAR_WIDTH / 2}
            y={CANOPY_BOTTOM + 2}
            width={PILLAR_WIDTH}
            height={PLATFORM_TOP - CANOPY_BOTTOM + 58}
            rx={8}
            fill={`url(#${pillarGradId})`}
            stroke="var(--color-ground-line)"
            strokeWidth={2}
          />
          {/* Capital under the canopy. */}
          <rect
            x={cx - 27}
            y={CANOPY_BOTTOM - 8}
            width={54}
            height={16}
            rx={4}
            fill="var(--color-ground-2)"
            stroke="var(--color-ground-line)"
            strokeWidth={1.5}
          />
          {/* Plinth base — lower half tucks behind the platform slab. */}
          <rect
            x={cx - 29}
            y={PLATFORM_TOP - 34}
            width={58}
            height={40}
            rx={4}
            fill="var(--color-ground-2)"
            stroke="var(--color-ground-line)"
            strokeWidth={1.5}
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

/**
 * Body outline: rounded tail on the left, long roof, and a broad swept
 * nose on the right (the cabin front), closing over a rounded skirt.
 */
const TRAIN_BODY_PATH = [
  "M 36 0",
  `H ${TRAIN_BODY_WIDTH - 90}`,
  `Q ${TRAIN_BODY_WIDTH} 6 ${TRAIN_BODY_WIDTH} 116`,
  `L ${TRAIN_BODY_WIDTH} 148`,
  `Q ${TRAIN_BODY_WIDTH} ${TRAIN_BODY_HEIGHT} ${TRAIN_BODY_WIDTH - 32} ${TRAIN_BODY_HEIGHT}`,
  "H 32",
  `Q 0 ${TRAIN_BODY_HEIGHT} 0 148`,
  "L 0 36",
  "Q 0 0 36 0",
  "Z",
].join(" ");

function TrainWindow({
  x,
  width,
  lightsOn,
  glowFill,
}: {
  x: number;
  width: number;
  lightsOn: boolean;
  /** url(#…) reference to the shared warm interior gradient. */
  glowFill: string;
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
          fill={glowFill}
        />
      ) : null}
    </g>
  );
}

/**
 * Side view of a sleek metro train: rounded cabin nose, roof light strip,
 * pantograph reaching the contact wire, line-colored livery stripe, warm
 * gradient-lit windows, door pairs with dark leaf glass, and an amber
 * headlight whose beam is a radial-gradient ellipse (paint-only).
 */
export function TrainLayer({
  line = "a",
  x = TRAIN_PARKED_X,
  lightsOn = true,
}: TrainLayerProps) {
  const uid = useSceneId("jccl-train");
  const sheenId = `${uid}-sheen`;
  const windowGlowId = `${uid}-cabin`;
  const beamId = `${uid}-beam`;
  return (
    <g
      aria-hidden="true"
      data-depth={SCENE_DEPTHS.train}
      data-testid="layer-train"
      transform={`translate(${x} ${TRAIN_TOP})`}
    >
      <defs>
        {/* Roof catch-light fading through the flank into a darker skirt. */}
        <linearGradient id={sheenId} x1={0} y1={0} x2={0} y2={1}>
          <stop offset="0" stopColor="var(--color-ground-line)" stopOpacity={0.5} />
          <stop offset="0.22" stopColor="var(--color-ground-line)" stopOpacity={0.12} />
          <stop offset="0.5" stopColor="var(--color-ground-line)" stopOpacity={0} />
          <stop offset="0.78" stopColor="var(--color-ground-0)" stopOpacity={0} />
          <stop offset="1" stopColor="var(--color-ground-0)" stopOpacity={0.4} />
        </linearGradient>
        {/* Warm interior light, brighter at the ceiling line. */}
        <linearGradient id={windowGlowId} x1={0} y1={0} x2={0} y2={1}>
          <stop offset="0" stopColor="var(--color-board-amber)" stopOpacity={0.85} />
          <stop offset="0.6" stopColor="var(--color-board-amber)" stopOpacity={0.5} />
          <stop offset="1" stopColor="var(--color-board-amber)" stopOpacity={0.32} />
        </linearGradient>
        {/* Headlight beam falloff. */}
        <radialGradient id={beamId}>
          <stop offset="0" stopColor="var(--color-board-amber)" stopOpacity={0.55} />
          <stop offset="0.4" stopColor="var(--color-board-amber)" stopOpacity={0.22} />
          <stop offset="1" stopColor="var(--color-board-amber)" stopOpacity={0} />
        </radialGradient>
      </defs>
      {/* Pantograph reaching up to the contact wire. */}
      <g
        stroke="var(--color-ground-line)"
        strokeWidth={3}
        strokeLinecap="round"
      >
        <line x1={950} y1={-2} x2={986} y2={-20} />
        <line x1={1022} y1={-2} x2={986} y2={-20} />
      </g>
      <rect
        x={966}
        y={-25}
        width={40}
        height={5}
        rx={2.5}
        fill="var(--color-ground-line)"
      />
      {/* Body */}
      <path
        d={TRAIN_BODY_PATH}
        fill="var(--color-ground-2)"
        stroke="var(--color-ground-line)"
        strokeWidth={3}
      />
      <path d={TRAIN_BODY_PATH} fill={`url(#${sheenId})`} />
      {/* Roof light strip. */}
      <rect
        x={46}
        y={8}
        width={974}
        height={5}
        rx={2.5}
        fill="var(--color-ground-line)"
        fillOpacity={0.9}
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
      {/* Door pairs: leaf glass, thin centre seam; doors interrupt the stripe. */}
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
          <rect
            x={dx + 7}
            y={DOOR_TOP + 12}
            width={20}
            height={38}
            rx={6}
            fill="var(--color-ground-0)"
            stroke="var(--color-ground-line)"
            strokeWidth={1.5}
          />
          <rect
            x={dx + DOOR_LEAF_WIDTH + 9}
            y={DOOR_TOP + 12}
            width={20}
            height={38}
            rx={6}
            fill="var(--color-ground-0)"
            stroke="var(--color-ground-line)"
            strokeWidth={1.5}
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
      {/* Saloon windows + cab window tucked inside the nose curve. */}
      {WINDOW_XS.map((wx) => (
        <TrainWindow
          key={wx}
          x={wx}
          width={WINDOW_WIDTH}
          lightsOn={lightsOn}
          glowFill={`url(#${windowGlowId})`}
        />
      ))}
      <TrainWindow
        x={CAB_WINDOW_X}
        width={38}
        lightsOn={lightsOn}
        glowFill={`url(#${windowGlowId})`}
      />
      {/* Headlight: amber lens; radial-gradient halo + forward beam when lit. */}
      {lightsOn ? (
        <g>
          <circle cx={HEADLIGHT_CX} cy={HEADLIGHT_CY} r={22} fill={`url(#${beamId})`} />
          <ellipse
            data-testid="headlight-glow"
            cx={HEADLIGHT_CX + 40}
            cy={HEADLIGHT_CY}
            rx={100}
            ry={24}
            fill={`url(#${beamId})`}
          />
        </g>
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

const JOINT_XS = [300, 620, 940, 1260] as const;

/**
 * Platform slab falling off into shadow, coping surface with a warm wash
 * of lamp light, edge line, tactile stud strip, and expansion joints.
 */
export function PlatformLayer() {
  const uid = useSceneId("jccl-platform");
  const slabGradId = `${uid}-slab`;
  const washGradId = `${uid}-wash`;
  return (
    <g
      aria-hidden="true"
      data-depth={SCENE_DEPTHS.platform}
      data-testid="layer-platform"
    >
      <defs>
        <linearGradient id={slabGradId} x1={0} y1={0} x2={0} y2={1}>
          <stop offset="0" stopColor="var(--color-ground-1)" />
          <stop offset="0.4" stopColor="var(--color-ground-1)" />
          <stop offset="1" stopColor="var(--color-ground-0)" />
        </linearGradient>
        <linearGradient id={washGradId} x1={0} y1={0} x2={0} y2={1}>
          <stop offset="0" stopColor="var(--color-board-amber)" stopOpacity={0.07} />
          <stop offset="1" stopColor="var(--color-board-amber)" stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect
        x={-100}
        y={PLATFORM_TOP}
        width={1800}
        height={340}
        fill={`url(#${slabGradId})`}
      />
      {/* Coping surface along the top. */}
      <rect
        x={-100}
        y={PLATFORM_TOP}
        width={1800}
        height={22}
        fill="var(--color-ground-2)"
      />
      {/* Lamp light washing over the coping and upper slab. */}
      <rect
        x={-100}
        y={PLATFORM_TOP}
        width={1800}
        height={90}
        fill={`url(#${washGradId})`}
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
      {/* Tactile safety strip: subdued band with two rows of studs. */}
      <rect
        data-testid="tactile-strip"
        x={-100}
        y={PLATFORM_TOP + 34}
        width={1800}
        height={14}
        fill="var(--color-board-amber-dim)"
        fillOpacity={0.5}
      />
      <line
        x1={-100}
        y1={PLATFORM_TOP + 38}
        x2={1700}
        y2={PLATFORM_TOP + 38}
        stroke="var(--color-board-amber)"
        strokeWidth={4}
        strokeLinecap="round"
        strokeDasharray="0 26"
        opacity={0.55}
      />
      <line
        x1={-100}
        y1={PLATFORM_TOP + 44}
        x2={1700}
        y2={PLATFORM_TOP + 44}
        stroke="var(--color-board-amber)"
        strokeWidth={4}
        strokeLinecap="round"
        strokeDasharray="0 26"
        strokeDashoffset={13}
        opacity={0.55}
      />
      {/* Expansion joints receding into the slab shadow. */}
      {JOINT_XS.map((x) => (
        <line
          key={x}
          x1={x}
          y1={PLATFORM_TOP + 56}
          x2={x}
          y2={PLATFORM_TOP + 300}
          stroke="var(--color-ground-line)"
          strokeWidth={2}
          opacity={0.4}
        />
      ))}
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
      {/* Hazard ticks where the platform edge meets the portal wall. */}
      <g
        stroke="var(--color-board-amber-dim)"
        strokeWidth={6}
        strokeLinecap="round"
        opacity={0.8}
      >
        <line x1={200} y1={624} x2={222} y2={596} />
        <line x1={200} y1={664} x2={222} y2={636} />
        <line x1={200} y1={704} x2={222} y2={676} />
      </g>
    </g>
  );
}
