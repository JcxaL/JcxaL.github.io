---
status: accepted
date: 2026-07-07
---

# 0006 — MapLibre GL JS v5 is the one engine for globe and city maps

## Context and Problem Statement

The site's summary view is a rotating globe that zooms into per-city themed maps; the
brief demands "silky zoom in/out" with no visible seam. Two-engine designs (a 3D globe
library handing off to a 2D map at some zoom) always show the seam. And because the site
is static (ADR 0001), any tile or imagery service requiring an API key is structurally
disqualified — the key would be public.

## Decision Outcome

**MapLibre GL JS v5 (BSD-3) renders both the globe and every per-place themed city map**
(doc 07 D4). v5's zoom-interpolated `projection` (`vertical-perspective` → `mercator`)
makes globe→city one `flyTo` in one renderer — no handoff.

- **Loaded only on map routes** (~274 KB gz, inside the +170 KB route allowance) and it
  owns the second of the two budgeted WebGL contexts (ADR 0003).
- **Tiles, keyless:** OpenFreeMap primary (no keys, no caps, no SLA) + **self-hosted
  PMTiles extracts on R2** as resilience — z0–6 world ≈ 60 MB plus small capped-zoom
  per-city extracts; HTTP range requests mean visitors fetch KBs. ODbL attribution
  required.
- The LOD ladder's zoom stops live as design tokens; representation swaps (arcs → pins →
  themed style) hide inside camera motion via zoom-interpolated paint properties.
- Decorative mini-globes (ticket back) use cobe v2 — decoration only, never a map.
- Fallback ladder, forceable via query param for CI: full globe → DPR-reduced/no-terrain
  → D3 orthographic canvas → pre-rendered globe image.

**Rejected:** Google Photorealistic 3D Tiles and Cesium ion (key economics — a static
site cannot hide keys); deck.gl GlobeView (officially experimental, no pitch/bearing);
globe.gl/three-globe as primary (raster-on-sphere never reaches vector crispness at city
zoom; remains an option *inside* the R3F canvas only if art direction demands it,
accepting a crossfade handoff).

## Consequences

- Good: one engine, one gesture model, one styling system; city map themes and the globe
  share tokens; zero per-request cost at any traffic level.
- Bad: we own tile infrastructure health — nightly CI checks PMTiles/tile-source
  availability; OpenFreeMap has no SLA, which is why the R2 extracts exist.
- Bad: MapLibre's style JSON is a second styling language to keep in sync with tokens
  (see ADR 0005's graduation trigger).
