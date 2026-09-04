import type { CSSProperties } from "react";
import StationPlate from "@/components/transit/StationPlate";

/**
 * EnamelTrial — Trial 03: vitreous-enamel plate texture.
 *
 * Station plates and panels currently render as flat fills. This trial layers
 * two static treatments over the same surfaces so they read as fired enamel
 * (glass over steel) instead of matte paint:
 *
 *   1. Grain — an SVG feTurbulence fractalNoise tile BAKED into a data-URI
 *      background-image on a `::after` overlay. Never `filter:` on the
 *      element itself: a live SVG filter forces a full re-raster of the
 *      element every frame the moment it moves; a background tile rasterizes
 *      once and is cached by the compositor.
 *   2. Sheen — a diagonal specular gradient (`::before`) with a faint white
 *      band near the top edge plus a hairline top-bevel light catch, both
 *      derived from the ink token via color-mix (no raw color literals).
 *
 * Nothing here animates, so no reduced-motion branch is required (the rule
 * is no-motion-first; this trial is all-motion-never). Both overlays are
 * empty pseudo-elements: pointer-events none, no content, nothing exposed
 * to the accessibility tree — the plate underneath reads exactly as before.
 * Pure render; token vars only.
 */

/* Tuning constants — report these with the trial verdict. */
const GRAIN_TILE = 120; // px, square noise tile
const GRAIN_BASE_FREQUENCY = 0.9;
const GRAIN_NUM_OCTAVES = 2;
const GRAIN_OPACITY = 0.05;
/* `overlay` was tried first per the classic recipe and MEASURED invisible on
 * this theme: against ground-1 the blend result is 2·base·noise, and base
 * luminance ≈ 0.08, so even full-opacity noise moves a pixel ~1 RGB level
 * (flat-region stddev 0.19). `screen` keeps only the light-catch component —
 * which is all you would see of enamel grain on a night-dark plate. */
const GRAIN_BLEND_MODE = "screen";

/** Static noise tile: fractal turbulence, desaturated, stitched for tiling. */
const GRAIN_TILE_URI =
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' ` +
  `width='${GRAIN_TILE}' height='${GRAIN_TILE}'%3E%3Cfilter id='g'%3E` +
  `%3CfeTurbulence type='fractalNoise' baseFrequency='${GRAIN_BASE_FREQUENCY}' ` +
  `numOctaves='${GRAIN_NUM_OCTAVES}' stitchTiles='stitch'/%3E` +
  `%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E` +
  `%3Crect width='${GRAIN_TILE}' height='${GRAIN_TILE}' filter='url(%23g)'/%3E%3C/svg%3E`;

const ENAMEL_CSS = `
.jccl-enamel {
  position: relative;
  /* Keep the blend inside the plate — never against the page ground. */
  isolation: isolate;
}
.jccl-enamel::before,
.jccl-enamel::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  border-radius: var(--layout-radius-plate);
}
/* Specular sheen: diagonal light catch from the top edge + hairline bevel. */
.jccl-enamel::before {
  background: linear-gradient(
    120deg,
    color-mix(in srgb, var(--color-ink-signage) 7%, transparent) 0%,
    color-mix(in srgb, var(--color-ink-signage) 3%, transparent) 22%,
    transparent 44%
  );
  box-shadow: inset 0 1px 0
    color-mix(in srgb, var(--color-ink-signage) 10%, transparent);
}
/* Vitreous grain: static baked tile blended over the plate. */
.jccl-enamel::after {
  background-image: url("${GRAIN_TILE_URI}");
  background-size: ${GRAIN_TILE}px ${GRAIN_TILE}px;
  opacity: ${GRAIN_OPACITY};
  mix-blend-mode: ${GRAIN_BLEND_MODE};
}

.jccl-enamel-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}
@media (min-width: 640px) {
  .jccl-enamel-grid {
    grid-template-columns: 1fr 1fr;
  }
}
`;

const panelBodyStyle: CSSProperties = {
  padding: "20px 24px",
};

const panelProseStyle: CSSProperties = {
  fontSize: "0.9375rem",
  lineHeight: 1.65,
  color: "var(--color-ink-muted)",
};

/** Journal-register sample copy so the texture can be judged under prose. */
const PANEL_PROSE =
  "I kept the ticket stub in my coat pocket through three more countries " +
  "before I let it go. The night we left Kyoto it rained, and the arcade " +
  "lights ran the length of the block like a second platform, and I stood " +
  "under the awning counting stops I had not taken yet.";

function SamplePlate() {
  return (
    <StationPlate
      name="Kyoto"
      nameLocal="京都"
      nameLocalLang="ja"
      code="A01"
      line="a"
      status="visited"
    />
  );
}

function SamplePanel() {
  return (
    <div className="jccl-panel" style={panelBodyStyle}>
      <p className="jccl-telemetry" style={{ marginBottom: 10 }}>
        A01 · KYOTO · JOURNAL EXTRACT
      </p>
      <p className="jccl-measure" style={panelProseStyle}>
        {PANEL_PROSE}
      </p>
    </div>
  );
}

export default function EnamelTrial() {
  return (
    <section className="mt-14" id="enamel" data-testid="enamel-trial">
      <style>{ENAMEL_CSS}</style>

      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="jccl-signage text-xl">Trial 03 · Enamel plate</h2>
        <p className="jccl-telemetry">
          VITREOUS TEXTURE · STATIC BAKE · NO ANIMATION
        </p>
      </div>
      <p
        className="jccl-measure mb-8 text-sm leading-relaxed"
        style={{ color: "var(--color-ink-muted)" }}
      >
        Plates and panels currently render as flat fills. This trial bakes a
        fractal-noise grain tile and a diagonal specular sheen over the same
        surfaces so they read as vitreous enamel — fired glass over steel —
        instead of matte paint. The texture is a static background tile;
        nothing animates and nothing re-rasterizes. Deciding: does grain at{" "}
        {Math.round(GRAIN_OPACITY * 100)}% read as material or as dirt on
        retina and non-retina screens?
      </p>

      <div className="jccl-enamel-grid">
        <div>
          <p className="jccl-telemetry mb-3">MATTE (CURRENT) · PLATE</p>
          <SamplePlate />
        </div>
        <div>
          <p className="jccl-telemetry mb-3">ENAMEL (TRIAL) · PLATE</p>
          <div className="jccl-enamel">
            <SamplePlate />
          </div>
        </div>
      </div>

      <div className="jccl-enamel-grid mt-8">
        <div>
          <p className="jccl-telemetry mb-3">MATTE (CURRENT) · PANEL</p>
          <SamplePanel />
        </div>
        <div>
          <p className="jccl-telemetry mb-3">ENAMEL (TRIAL) · PANEL</p>
          <div className="jccl-enamel">
            <SamplePanel />
          </div>
        </div>
      </div>

      <p className="jccl-telemetry mt-6">
        BAKE: feTurbulence fractalNoise · baseFrequency{" "}
        {GRAIN_BASE_FREQUENCY} · {GRAIN_NUM_OCTAVES} octaves · {GRAIN_TILE}px
        tile · {GRAIN_BLEND_MODE} @ {GRAIN_OPACITY}
      </p>
    </section>
  );
}
