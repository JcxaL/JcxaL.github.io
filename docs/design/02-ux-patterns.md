# 02 — UX Patterns & Information Architecture

Evidence-based patterns for the travel section, synthesized from the award corpus
([doc 01](./01-inspiration-gallery.md)) and UX research literature (Baymard travel
benchmarks, NN/g articles, Google travel-journey research). Every pattern names its
precedent so decisions stay arguable.

---

## 1. The two-layer architecture

Baymard's homepage findings, NN/g's list-entry research, and Google's micro-moments
research all converge on the same shape:

- **Inspiration layer** — imagery-led card grid with snackable hooks (serves the
  "dreaming" moment). This is `/travel`.
- **Planning layer** — consistent, scannable guide pages opening with a fast-facts block
  (serves the "planning" moment). This is `/travel/[slug]`.

Rules that follow:

- The destination index (or a jump-to-region control) must be **visible above the fold**.
  99% of Baymard's travel test users immediately look for the browse entry point; 25% of
  sites bury it. Cap the hero at ~60–70vh or overlay the region index on it — NN/g's
  Southwest case documents a beautiful full-viewport hero measurably hurting task success.
- Depth on demand: hero eagerly, heavy layers (map, galleries, video) lazy-mounted behind
  interaction (iFly 50's unlockable media; NASA's poster → immersive tiers).

## 2. One dataset, three views

**The single most load-bearing architectural decision.** Polarsteps, Atlas Obscura, Out of
Eden Walk, and the Mapbox storytelling template all model place data once and render it
many ways.

- One source of truth: MDX frontmatter per destination →
  `{slug, title, coords, region, status, dates, tags, heroImage}` (already the
  TRAVEL_PLAN schema), derivable as a single GeoJSON FeatureCollection at build time.
- The **region-grouped list**, the **MapLibre map**, and the **badge/stat counts** are
  three views of that one object. List, badge, and pin never disagree because they cannot.
- Trips/itineraries are a second content type — a named route object
  `{name, ordered stops[], transport mode, dates}` (MySwitzerland's Grand Tour pattern,
  Banff's itineraries) that references destinations and draws its own polyline.
- Out of Eden Walk's discipline: a **fixed milestone schema** (coords, date, status, one
  wide shot, one detail shot, one quote) — consistency of capture is what makes a growing
  personal archive look designed. Design for accretion: the site should look better at 50
  entries than at 5.

## 3. The status system (Visited / In Progress / Planning)

The three-state taxonomy is award-validated (Atlas Obscura's Webby-winning "Been Here /
Want to Go"; Countries Been's been/lived/want; Treasures of Japan's
locked/active/completed waypoints).

- **Exactly three states, closed vocabulary.** NN/g: badges work as a small, closed set
  with stable colors (Booking.com's ~11 indicators is the cited anti-pattern).
- Each status gets **one fixed color + icon + word**, used identically on cards, map
  markers, guide-page headers, and timeline dots. Never color alone (color-blind safety):
  pair with the label and a shape difference.
- **Composite marker grammar** (survives grayscale — Flightradar24's convention):
  - Visited — solid fill marker, solid route line
  - In Progress — pulsing halo (static halo under reduced motion)
  - Planning — hollow/dashed ring marker, dashed route line (`line-dasharray: [2,2]`)
- Status is a **state machine** (Flighty): Planning → In Progress → Visited, with a
  micro-animated transition when a destination advances (badge flip / stamp-in).
- Status doubles as a **collection loop** (Treasures of Japan, Umami Land): show aggregate
  progress — "12 visited · 4 planning · 23 countries" — as a stat strip. Plain-language
  phrasing beats raw numbers (Google Flights' "prices are currently low" pattern).
- **Planning destinations get the fictional-bureau treatment** (NASA): a poster-style hero
  and teaser copy so unvisited places still have rich pages. Wishlist framing (Airbnb):
  Planning entries render visually lighter (desaturated/outline cards) as a "someday"
  collection.

## 4. The destination card

Every platform converged on image-led cards with 3–5 metadata slots. Lock the schema and
never vary it (NN/g "Anatomy of a List Entry": same attributes, same slots, same style on
every card — inconsistent placement breaks comparison scanning):

```
┌─────────────────────────────┐
│ photo (fixed ratio,         │  ← gradient scrim token, bottom third
│  status badge top-right)    │
├─────────────────────────────┤
│ REGION · eyebrow/kicker     │
│ Destination Name            │
│ One-line hook               │
│ meta: season/year · NN days │  ← tabular numerals
└─────────────────────────────┘
```

- Whole card is one link (Fitts's law); no nested links inside.
- Highest-priority info top-left; hierarchy by type scale, not decoration.
- One confident summary line, not a stats dump (Hopper's one-verdict-sentence).
- Every field shown on a card must be filterable or groupable (Baymard: 38% of travel
  sites fail this).
- Optional: tiny locator mini-map as metadata (NYT 52 Places), numbered index digits
  (iFly 50).
- Card metadata must earn its place — Expedia's deleted "Company" field recovered ~$12M/yr;
  prune ruthlessly.

## 5. List ↔ map synchronization

The single most transferable OTA pattern (Airbnb split view, Wanderlog, FlightConnections).

- **Shared state**: one `{hovered, selected}` destination state consumed by both panes.
  Card hover → marker enlarges/recolors (~150ms); marker click → card scrolls into view +
  compact popover card (not a bare tooltip).
- **One driver at a time**: an explicit flag (or user toggle à la Airbnb's "search as I
  move the map") decides whether scroll drives the map or the map drives the list, with
  debounced `moveend` — otherwise the two views feedback-loop.
- **Numbered/coded markers matching list items** (Wanderlog) is the cheapest, highest-impact
  sync cue.
- Never render all routes at once; dim non-active routes to ~20% opacity
  (FlightConnections).
- **Mobile**: never a fighting half-split. Either list-first with a "Show map" toggle
  (Airbnb), or full-bleed map + swipeable bottom card carousel synced to markers, in a
  draggable sheet with 30/60/100% snap points.
- **The list is canonical**: the region-grouped list remains the keyboard- and
  screen-reader-accessible navigation; the map is an enhancement (GL maps have weak a11y).
  Every map interaction has a plain-list equivalent — this inverts the award-tier's
  documented weakness (Chartogne-Taillet a11y 6.33/10) into an advantage.

## 6. Guide-page anatomy (`/travel/[slug]`)

The converged template, assembled from Jacada (best-in-class itinerary anatomy), Atlas
Obscura (story/practical separation), Lithuania Travel and Banff (DMO page anatomy), and
Think-with-Google planning-moment research:

1. **Hero** — full-bleed image/video, scrim token, title + status badge + season.
2. **Fast-facts / HUD strip** — dates visited, duration, route, cost band, best season;
   label/value chips in mono numerals. Planning-phase readers want this *before* prose.
3. **Orientation block** — locator map snippet + region badge + coordinates readout.
4. **Highlights** — 3–5 bullets.
5. **Narrative sections** — day-range or place chips as anchor nav ("Days 1–3 Kyoto");
   captioned photo interleaved every 2–3 paragraphs (Jacada's hard rule); pull-quote once
   per page (Juvet), not a wall.
6. **Typed timeline blocks** (TripIt) — 3–4 MDX components (travel-leg / stay / sight /
   food), each with fixed icon, color, and fields.
7. **Radar/practical box** — "Know Before You Go" pattern: gear, budget, logistics,
   accessibility notes (terrain/effort as first-class metadata — Travel Oregon).
8. **Variant blocks** — "What I'd do differently / alternate route" accordions
   (Jacada's "Make it mine").
9. **Related footer** — nearby/next destinations + back to map with camera state preserved
   (Marseille's spatial breadcrumbs).

Duration honesty is a beloved feature everywhere (Faroe's 72-hours guides, NZ's
travel-time calculator): precompute distances/durations at build time and surface a
**time-budget stat** — it reads as HUD telemetry and costs nothing.

## 7. Browse dimensions & filters

Every top DMO offers at least two orthogonal browse axes (JNTO: region × interest;
Greenland: season; Scott Dunn: month; Black Tomato: region + A–Z + mood).

- The journal's trio: **region × status × season/date** — all in frontmatter, all
  filterable on both list and map, synced to **URL params** so filtered views are
  shareable on a static host (Windy's URL-state pattern).
- Filter UI per Baymard: applied filters as removable chips above the list; live result
  counts per option ("Japan · 6 places"); instant filtering on desktop, "Show N results"
  apply button on mobile.
- Sticky context bar pinning active region/status filters while scrolling (Booking.com).
- A jump-index by region pinned atop the long list (NYT 52 Places) — long travel lists
  die without one.
- Playful inversion affordance (Skyscanner "Everywhere"): a "Where next?" button that
  picks a random Planning destination.

## 8. Navigation & voice

- Intent-based nav labels beat taxonomy labels (Faroe: SEE & DO / PLAN YOUR STAY).
  Question-form labels give instant personal voice (Juvet: "Where in the world…?" —
  journal equivalent: "Where next?", "How did I get here?").
- **Name the content products** (Black Tomato's Get Lost/Blink; Aman's editorial modules):
  "Flight Log", "Packing Manifest", "Field Notes" — naming features is a proven
  luxury-travel storytelling move that costs nothing.
- One consistent first-person register everywhere — badges, empty states, guide intros —
  slightly dry beats brochure superlatives (VisitOSLO's deadpan; The Standard's jokes).
  e.g. `In Progress: 3 tabs of flight searches open`.
- CTA restraint: single verbs ("Explore", "Read"), one primary CTA per page (Aman/Juvet).
- Provenance metadata as trust UI: `visited May 2024 · updated Jan 2026` — the honest
  inverse of OTA urgency chrome.

## 9. Static-compatible personalization

- localStorage **favorites/shortlist** on destination cards (Faroe, JNTO ship this; fully
  GitHub-Pages-compatible) turns a read-only journal into a planning tool for readers.
- Days-until countdown on Planning cards (TripIt) — anticipation with trivial code.
- A persistent **motion toggle** (see doc 04) also lives in localStorage.

## 10. Anti-patterns (codified bans)

From CMA 2019 enforcement, the €413M Spanish Booking.com fine, and NN/g research:

| Banned | Why | The honest inverse |
|---|---|---|
| Countdown timers, scarcity counts, "X people viewing" | Dark-pattern vocabulary of big-OTA UX; poison for a personal journal's tone | Real states only: trip dates, "last updated" |
| Auto-rotating hero carousels | NN/g: users see slide 1 only; banner blindness | One featured destination + user-scrolled card rail with next-card peek |
| Scroll hijacking (wheel interception, speed change) | Near-universal disorientation in NN/g testing | Scroll-driven (1:1 with native scroll) only — see doc 04 |
| Pulsing/flashing urgency chrome | WCAG 2.2.2 violations; manipulative signature | Reserve warm alert colors for genuine notices ("guide outdated") |
| >3 badge types | NN/g: open-ended indicator vocabularies stop being scannable | Exactly three statuses, fixed colors |
| Full-viewport hero hiding all content | Southwest case: measurable task failure | 60–70vh hero, index peeking above the fold |

## 11. Accessibility architecture

- The **semantic document is the site**; the HUD is decoration. All decorative chrome
  (brackets, scanlines, grain, background globes) is `aria-hidden`; the page must read
  cleanly as headings/lists/links with every decorative layer stripped. Test each guide
  page once in a screen reader.
- Travel photos are content: place-specific alt ("Torii gate at Fushimi Inari at dawn"),
  enforced as a required prop on the MDX image component. Decorative flourishes get
  `alt=""` (W3C WAI decision tree).
- Keyboard-operable map interactions, with the list as the always-available equivalent.
- AA-verified matrix of status-color/background pairs in both themes (Skyscanner
  Backpack's "no AA pairing, no use" rule).
- NASA's Webby-honored lesson: accessibility engineered *above* compliance is itself
  award-legible.
