# 13 — Code as Asset: the design-asset pipeline

*Added 2026-07 after the signage-system overhaul. Verified against primary
sources July 2026 (citations at the end of each section). Binding alongside
docs 07/09 and the ADRs.*

The JccL Line's uniqueness engine is that its **assets are drawn or generated
in code from one token source**. There is no Figma export step, no PNG sprite
folder, no icon pack. Every visual material on the site is one of: a token, a
component that consumes tokens, or a **generated artifact** compiled *from*
the tokens. This doc records that pipeline, which asset classes are worth
using, and how each was verified.

## 1. The pipeline

```
tokens/tokens.json  (DTCG-flavored, the single source of truth)
        │  pnpm tokens  (scripts/build-tokens.mjs — zero-dep, ADR 0005)
        ├─► src/styles/tokens.css              CSS custom properties
        ├─► src/components/media/DuotoneDefs.tsx   SVG duotone filters (one per line color)
        └─► public/atlas/night-service.json    MapLibre style (globe atlas)
```

Rules that make this work:

- **Generated files are committed** and must regenerate byte-identically
  (CI builds run `pnpm tokens` via prebuild; a dirty tree means someone
  hand-edited an artifact). Edit the JSON, never the outputs.
- One color edit in `tokens.json` therefore recolors the UI, the photo
  treatment, *and* the world map in a single commit. That is the whole
  point: the palette is executable.
- When an artifact needs a value the tokens don't carry, add the token
  first. When a mirror is unavoidable (GSAP eases, jsdom fallbacks), the
  mirror names the token it mirrors (CLAUDE.md rule-1 carve-outs).

## 2. Asset classes — what is genuinely good to use

### 2.1 Color, motion, layout — design tokens
`tokens/tokens.json`. DTCG-ish groups → kebab-case CSS vars. The three-voice
type system, six line colors, board amber, motion durations/easings, radii.
Everything else in this doc derives from here.

### 2.2 Typography — self-hosted Google variable fonts via next/font
- **Source Sans 3** (signage voice), **Geist Mono** (telemetry), **Doto**
  (board voice — `wght` 100–900 + `ROND` 0–100, loaded with
  `axes: ["ROND"]`; omitting the axes array silently pins ROND and axis
  animation does nothing).
- Doto axis animation is **reserved for exactly two moments** (doc 12):
  the exhibit arrival name and the ticket VALIDATED stub
  (`.jccl-board-arrive`). Both endpoints list *both* axes in the same
  order (otherwise the interpolation is discrete), and `font-weight`
  mirrors the settled `wght` so fallback metrics match.
- Never rip transit-authority faces (Johnston/Rail Alphabet — banned).
- Receipts: fonts.google.com/specimen/Doto · google/fonts METADATA.pb ·
  nextjs.org/docs/app/api-reference/components/font ·
  fonts.google.com/knowledge/glossary/rond_axis

### 2.3 Photography — the duotone "tinted window" (no art skills required)
Any unedited photo becomes on-brand by remapping its luminance onto a
two-stop ramp: station black → the owning line's color.

- **Technique (the production-proven one — WordPress core ships it for
  millions of sites):** SVG reference filter = `feColorMatrix` (Rec.709
  luminance) → `feComponentTransfer` with two-stop `tableValues` per
  channel. Our filters are **generated from tokens.json** into
  `DuotoneDefs.tsx` (`pnpm tokens`), mounted once in the root layout,
  applied as `filter: url(#jccl-duo-<line>)` (`DuotoneImage`).
- Non-negotiables learned from primary sources:
  `color-interpolation-filters="sRGB"` on the filter (default linearRGB
  washes colors); hide the defs SVG with `width=0 height=0 + absolute`
  (`display:none` breaks `url(#)` in some engines); same-document
  references only (Safari); **never animate the filter** (discrete
  interpolation + full re-raster per frame — static filters raster once
  and are cached by the compositor, so scroll cost is zero).
- CSS `grayscale+sepia+hue-rotate` chains are mathematically unable to hit
  exact token hexes — rejected. Blend-mode duotone is a decent no-SVG
  fallback but is a multiply composite, not a linear ramp.
- **Media hosting:** production photos ship from R2 via
  `NEXT_PUBLIC_MEDIA_BASE` (rule 7; >5MB files never land in the repo;
  images are pre-sized because the static export has no image optimizer).
  The three small sample photos in `public/media/samples/` are
  demo/placeholder assets, credited as such in the UI.
- Receipts: developer.wordpress.org/reference/classes/wp_duotone ·
  tympanus.net/codrops/2019/02/05 (feComponentTransfer duotone) ·
  utilitybend.com (2025 revisit) · MDN flood-color/feComposite ·
  chromium.org image-filters design doc · Skia Graphite blog (2025)

### 2.4 Maps — keyless vector tiles + a token-generated style
- **MapLibre GL JS v5** (ADR 0006) renders the globe atlas; globe
  projection is a first-class style-spec feature since v5.0 (Jan 2025).
  The engine (~274KB gz) loads **only on visitor intent** (poster →
  click → dynamic import), so every other route stays light.
- **OpenFreeMap** (openmaptiles schema) supplies tiles and glyphs with no
  keys and no usage caps — the economics decide. It also has **no SLA**
  (donation-funded), so the atlas is built to survive an outage: the
  poster is the resting state, and the network overlay (arcs + markers)
  mounts on `load` *or* first `idle` *or* source `error` — a bare globe
  with the network drawn on it still works with the tile host down.
  The hedge, when traffic justifies it: self-hosted PMTiles on R2.
- **The style is an asset generated from tokens**
  (`public/atlas/night-service.json`): dark oceans (ground-0) on faintly
  lit continents (ground-2), hairline admin-0 borders (ground-line),
  muted country labels. ~8 layers is all a z0–6 globe needs; city-zoom
  styles are future work on the same pipeline.
- **Great circles must be pre-densified** (spherical interpolation,
  `src/lib/atlas/geo.ts`) — MapLibre draws LineStrings as Mercator paths,
  and a two-point line renders as the wrong curve on a globe. MapLibre has
  no `line-trim` (Mapbox-proprietary); draw-on animation later means the
  `line-gradient` step trick with `lineMetrics: true` (already set).
- v5 gotcha: `antialias` and friends moved into `canvasContextAttributes`.
- Receipts: maplibre.org/roadmap/maplibre-gl-js/globe-view ·
  maplibre style-spec projection docs · openfreemap.org

### 2.5 Texture — SVG turbulence, baked, never live
Material grain (the enamel-plate trial in the depot) comes from
`feTurbulence` fractal noise rendered as a **static data-URI background
tile** at ~5% opacity — never as a live `filter:` on an element, because a
live SVG filter on anything that moves forces a software re-raster every
frame under scroll scrubbing.

### 2.6 Sound — synthesized, never sampled
`src/lib/sound/engine.ts`: one lazy module-level `AudioContext` (Safari
caps ~4/page), created and resumed **inside a user gesture** (autoplay
policy), envelopes as gain ramps ending at an epsilon (a ramp to exactly 0
throws), a `DynamicsCompressor` as the master safety limiter, and a
**default-OFF persisted toggle** in the footer — `prefers-reduced-motion`
does not cover audio, so the explicit switch *is* the accessibility
control. Two chimes exist: `doors` (two-tone departure) and `punch`
(validation ding). No audio files: the chime is ~40 lines of oscillator
code, weighs nothing, and stays on-palette by construction.
Receipts: MDN Web Audio best practices · developer.chrome.com/blog/autoplay ·
mattmontag.com Safari unlock notes · W3C audio-session (Safari-only, 2026).

### 2.7 Scene art & iconography — inline SVG with token fills
The transit kit, LineMark, the station scene: all inline SVG drawn in
code, filled with `var(--color-*)` (inline SVG participates in the CSS
cascade — gradients read tokens via `stop-color: var(...)` with
`stop-opacity` carrying alpha). Scroll-scrubbed scenes stay at 60fps by
animating **transform/opacity on a few `<g>` layers only** — no animated
geometry attributes, no live filters, glow via radial-gradient alpha
falloff instead of blur, `transform-box: fill-box` when rotating around a
group's own center, and no `will-change` on pinned ancestors (it breaks
`position: sticky` pinning).
Receipts: motion.dev performance tier list · GSAP ScrollTrigger docs ·
developer.chrome.com scroll-animation case study · Lenis README.

### 2.8 Persistent state — the ticket as a data asset
`punchStore.ts`: a hand-rolled ~100-line `useSyncExternalStore` store (no
library earns its bundle for one key). The verified contract: **stable
snapshot references** (fresh objects per `getSnapshot` call loop React),
`getServerSnapshot` returns the empty journey (static export still
prerenders client components — omitting it throws), `storage` events only
fire in *other* tabs (local writes must `emit()` themselves), every
localStorage access wrapped (enterprise policy/private-mode throws), and
stored JSON treated as untrusted input (parse + shape-validate + version).
localStorage-only personalization with no cross-site identifier keeps the
site out of consent-banner territory (ePrivacy "strictly necessary" /
terminal-equipment guidance) — revisit if analytics ever land.
Receipts: react.dev useSyncExternalStore · TkDodo hydration-mismatch post ·
MDN storage event · EDPB guidelines 2/2023.

## 3. Route transitions & motion assets

- **Doors** (ADR 0007): same-document View Transitions via
  `next-view-transitions` — the only mechanism of the four candidates that
  actually fires on App Router `<Link>` navigations in a static export
  (cross-document `@view-transition` CSS never does; React's native
  `<ViewTransition>` is still canary in the React our Next 15 pins).
  The recipe is CSS only: old view clips to the center seam
  (`--motion-duration-exit`, accelerate), new opens from it
  (`--motion-duration-enter`, decelerate, delayed, `fill both` — without
  `both` the new page is visible during the close). Persistent chrome
  (`view-transition-name: jccl-header`, `animation: none`) rides through
  unmoved. Under reduced motion our keyframes are absent and the UA's
  default 0.25s cross-fade remains — deliberate: reduced ≠ none (doc 04).
  Keep total ≤700ms: the VT snapshot overlay eats input while it runs.
- **Cinematics** register on `window.__motion` (rule 5) — the concourse
  intro is a pure timeline factory (`lib/animation/concourse.ts`), seekable
  in E2E for vision review.
- Receipts: web.dev same-document-VT-baseline · react.dev ViewTransition ·
  nextjs.org view-transitions guide · github.com/shuding/next-view-transitions.

## 4. Verification workflow (how an asset earns its place)

Every asset class above went through the same loop, and future ones must:

1. **Research pass** — verify the technique against primary sources
   *before* building (the receipts above). If the frontier moved, follow it.
2. **Build from tokens** — no raw values; extend the generator when the
   asset class is new.
3. **Screenshot loop** — Playwright at 1440px and 390px, top + mid-scroll,
   read the images, iterate. Mid-animation states are posed via
   `window.__motion` (cinematics) or slowed animations (view transitions),
   and verified with `document.getAnimations()` when snapshots can't show
   motion.
4. **Gates** — axe serious/critical = 0 on every page; reduced-motion run
   renders a settled page; `pnpm test && pnpm lint && pnpm build` green;
   generated artifacts regenerate byte-identically.
5. **Decision recorded** — aesthetic A/Bs live on `/depot/experiments/`
   with their decision criterion printed on the page; architectural
   choices get a MADR in `docs/adr/`.

## 5. What never becomes an asset here

- Files >5MB in `public/` (rule 7) — R2 or nothing.
- Anything requiring an API key (static export = the key ships to everyone).
- Downloaded icon packs, UI kits, transit-authority marks or fonts.
- Lottie/After Effects exports (dotlottie-web is banned; doc 07 D10) —
  if it can't be drawn from tokens, it isn't in the system's language.
