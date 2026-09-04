# 05 — Applied Recommendations

The synthesis: what this site should actually build, mapped onto the
[`TRAVEL_PLAN.md`](../../TRAVEL_PLAN.md) milestones. Each item cites the pattern doc
(02–04) or gallery entry (01) that justifies it.

---

## Strategic posture (three decisions the research settles)

1. **The aesthetic direction is validated — commit to it.** "Sci-fi HUD meets travel
   journal" has juried precedent: NASA Exoplanet Travel Bureau (Webby 2021), Bear 71
   (Webby 2013), Flighty (Apple Design Award 2023). The variable is execution discipline,
   not concept risk. (Doc 01 §D/E, meta-lessons.)
2. **Hub + stunt-satellite architecture.** The evergreen journal core stays static, fast,
   content-first (that's what survives — Atlas Obscura, MySwitzerland); kinetic
   experiments (flight-path scenes, packing overlay) live on self-contained lazy routes
   that can be extreme or retired without touching guides (Faroe's model; the
   World-of-Swiss/Nomadic-Tribe graveyard lesson). TRAVEL_PLAN's M3/M4 isolation already
   matches this — keep it strict.
3. **Personal-scale can win.** Travel Next Level (SOTD 2024), Hedwig (HM 2026), Reverie
   Safaris (HM 2026), thevnomad (HM 2022) all reached award level on curation, typography,
   palette discipline, and pacing — not budget. The bar is craft, and the genre's known
   weaknesses (accessibility, performance) are exactly where a static-export site starts
   ahead.

---

## Milestone 1 — Data model + list view (amendments)

TRAVEL_PLAN M1 is right. Research adds:

- **Widen the frontmatter to the milestone schema** (doc 02 §2): the planned fields plus
  `country`, one-line `hook`, and a `radar` block are already there — add optional
  `routeRef` (trip membership) now so trips can arrive later without migration.
  Consistency of capture is the design system (Out of Eden Walk).
- **Card schema, locked** (doc 02 §4): photo (fixed ratio + scrim token) / region eyebrow /
  name / one-line hook / status badge / mono meta (season · days). Whole card one link.
  Numbered index digits (`07`) for the iFly-50 HUD flavor.
- **Status tokens formalized** (docs 02 §3, 03 §1): three states, fixed color + icon +
  word, AA-checked on the dark ground, consumed by badges AND (later) map paint. Replace
  the current ad-hoc cyan/fuchsia/amber usage in `src/app/travel/page.tsx` with the
  tokens.
- **Progress stat strip**: `12 visited · 4 planning · 23 countries` derived from
  frontmatter at build time (doc 02 §3). This is the cheapest award-grade device on the
  whole list.
- **Jump-to-region index** pinned atop the list; region groups capped at 3–5 (docs 02 §7,
  03 §5).
- **Copy pass**: kill placeholder promises ("once CMS wiring is ready"); adopt the dry
  first-person register and provenance metadata (`visited May 2024 · updated Jan 2026`)
  (doc 02 §8, §10).
- **Fix the fonts** first: wire `var(--font-geist-sans)`/`var(--font-geist-mono)` into
  `globals.css` (body currently renders Arial while Geist loads unused) and establish the
  three-voice ramp (doc 03 §2). Everything downstream depends on the telemetry voice.

## Milestone 2 — Guide pages (amendments)

- **Adopt the converged guide anatomy** (doc 02 §6): hero + scrim → **HUD fast-facts
  strip** (dates, duration, route, cost band, season — mono chips) → orientation block
  (locator snippet + coordinates readout) → highlights → narrative with a captioned photo
  every 2–3 paragraphs → typed timeline blocks → Radar/practical box → variants accordion →
  related footer. The Radar panel in TRAVEL_PLAN is the "Know Before You Go" box —
  keep it typed, style it as a telemetry card (Bear 71).
- **Planning destinations get the bureau treatment** (NASA, doc 02 §3): poster-style hero +
  teaser + "days until" countdown, so unvisited places are rich pages, not stubs.
- **Typed MDX timeline components** (TripIt, doc 02 §6): `travel-leg` / `stay` / `sight` /
  `food`, fixed icon + color + fields each.
- **Time-budget stat** precomputed at build (doc 02 §6) — duration honesty as HUD telemetry.
- **The sticky locator rail** (NYT Russia Left Behind, doc 04 §2.2) is the highest
  value-per-effort motion feature on guide pages — ship it in M2 (it's an
  IntersectionObserver + tiny fixed SVG map, no MapLibre needed).
- Every M2 page must pass the **stripped-decoration screen-reader test** (doc 02 §11);
  alt is a required prop on the MDX image component.

## Milestone 3 — Map (amendments)

- **Custom dark style JSON from day one** (doc 03 §6): desaturated duotone basemap in site
  tokens, no POI clutter — the single most effective map-styling decision (Polarsteps).
  Default-streets basemaps read as embeds, not products.
- **Composite marker grammar** (doc 02 §3): solid/halo/dashed by status, driven by a
  `status` property on one GeoJSON source via `match` expressions — never color alone.
- **List↔map sync with a single driver flag** (doc 02 §5) and numbered markers matching
  list items (Wanderlog). Popover cards on click, not tooltips.
- **Great-circle arcs between visited cities** with lifecycle animation (docs 04 §3;
  GitHub/Stripe/Flighty) — this, plus the dark basemap, IS the site's signature visual.
- **Mission-control chrome** (Faroe, doc 03 §4): coordinates readout, heading, "FLY TO"
  buttons, status lamps — instead of default zoom buttons. This converts a generic embed
  into the signature moment.
- **Static map image placeholder** = loading state + no-WebGL fallback + SEO content
  (doc 04 §8). URL-hash camera state (Windy).
- Mobile: list-first with "Show map" toggle, or bottom card carousel — never a fighting
  split (doc 02 §5).

## Milestone 4 — Motion layer (amendments)

- **Build the flight path on the Mapbox-storytelling chapter model** (doc 04 §2): chapters
  as data, enter/exit states, high-curve flyTo swoops, pitch/bearing variation, fog at
  speed. Route-spine scrolling for trips; zoom-ladder for the Home → Travel entry.
- **Trip replay** ("play this trip") as the cinematic payoff feature (Polarsteps, doc 04
  §3) — more memorable than passive scroll effects and reuses the same chapter data.
- **Packing overlay as a HUD layer** with its own tokens (docs 03 §4, 01 The Boat):
  weather/atmosphere overlay precedent says theme it per destination; gear list rendered
  as manifest checklist in the telemetry voice.
- **Motion tokens named and fixed** (`flight-path`, `hud-boot`, `stamp-in`) beside color
  tokens (doc 04 §5); ONE card hover, ONE transition motif (waypoint glyph / dotted line)
  reused as loader, divider, bullet, marker (Eurostar's Spark strategy).
- **No-motion-first + visible motion toggle** (doc 04 §6); replace the blunt global
  0.01ms kill-switch with per-pattern fallbacks (flyTo→jumpTo, draw-on→static route,
  pulse→halo).
- Scroll-snap fullscreen sections only on the `/travel` opener, never in guide prose
  (doc 03 §5).

## Naming (free brand equity)

Name the features (Black Tomato's productized storytelling, doc 02 §8) — candidates
already implied by the site's voice:

- The map — **Flight Deck** · the list — **Mission Ledger** (already in use, keep it) ·
  guides — **Field Notes** · packing overlay — **Packing Manifest** · trips — **Flight
  Paths** · stats strip — **Telemetry**.

## Durability rules (from the graveyard)

1. Journeys are **data** (GeoJSON legs + frontmatter), presentation is replaceable —
   World of Swiss, iFly 50, Nomadic Tribe, and Night Walk all died with their budgets;
   Snow Fall (plain web) still runs 14 years later.
2. Standard tech only: CSS/canvas/MapLibre, no exotic runtimes (Bear 71's Flash death).
3. Every kinetic feature has a static equivalent that is the *default*, not the fallback.
4. The MDX content must be re-renderable into new shells (Polarsteps' Travel Books prove
   structured journals re-flow into new formats).

## Measurable budgets (adopt as CI-checkable where possible)

| Budget | Value | Source |
|---|---|---|
| LCP | ≤ 2.5s | web.dev; Visit California's speed-led wins |
| Hero image | ≤ ~200KB, priority `<img>`, never lazy | web.dev |
| Below-fold media | 100% lazy, chapter-boundary init | Snow Fall lineage |
| Map bundle | 0KB until map nears viewport | doc 04 §8 |
| WebGL floor | 60fps or ship the static image | Stripe |
| Status colors | AA on every used background, both themes | Backpack |
| Badge vocabulary | exactly 3 | NN/g |
| Text over images | 4.5:1 (3:1 large) vs worst pixel region | WCAG/Smashing |

## Suggested build order (impact ÷ effort, within the existing milestones)

1. Fonts wired + three-voice type ramp + status/scrim/HUD tokens (M1 prerequisite).
2. Card schema + region groups + progress stat strip + copy pass (M1).
3. Guide anatomy + fast-facts strip + typed timeline blocks (M2).
4. Sticky locator rail on guides (M2 — the cheapest signature motion).
5. Custom dark map style + status markers + list↔map sync (M3).
6. Great-circle arcs + mission-control chrome (M3 — the signature visual).
7. Flight-path chapters + trip replay (M4).
8. Packing Manifest overlay + motion tokens + toggle (M4).

Ship 1–4 and the site already clears the bar that personal-scale award winners set
(typography, palette, pacing, structure); 5–8 is where it becomes distinctive.
