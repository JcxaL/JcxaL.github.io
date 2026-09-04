# 10 — Roadmap: Building the Metro Museum

Phased delivery plan. Each phase is independently shippable, ends with the agent
verification loop green (doc 08), and de-risks the next. The old TRAVEL_PLAN milestones
are superseded by this roadmap where they conflict (the whole-site metro decision changes
the frame); the MDX data-model work in TRAVEL_PLAN M1 survives intact inside Phase 1.

Guiding order: **foundation → one real vertical slice → the surprise (ticket+intro) →
the ride → the globe → hardening → sound**. The showpieces come after the pipeline
because every showpiece depends on tokens, media, determinism hooks, and CI existing.

---

## Phase 0 — Rails first (foundation)

*Nothing user-visible; everything load-bearing.*

- Kickoff migrations (doc 09 §1): ESLint flat config, `motion/react`, exact-pin React,
  Actions-based deploy, `not-found.tsx`, font wiring.
- Design tokens: DTCG `tokens/*.json` (line colors, signage type scale, motion
  durations/easings, zoom bands) → Style Dictionary → CSS vars + Tailwind `@theme`.
- Transit font stack self-hosted + subset (Overpass, Hanken Grotesk/Public Sans, Doto).
- **Cloudflare zone live**: proxy + cache rules on `jccl.me`, R2 bucket at
  `media.jccl.me`, `NEXT_PUBLIC_MEDIA_BASE` constant.
- Media pipeline scripts (`optimize-media.ts`, `encode-media.sh`) + typed `<Pic>`/`<Vid>`.
- CI: the full gate list (doc 08 §6) — green on the current site before any rebuild code.
- Persistent-canvas shell (empty scene, `frameloop="demand"`), `window.__motion` E2E
  hook, Lenis+GSAP single-clock provider, reduced-motion plumbing (`MotionConfig`,
  GSAP `matchMedia`).
- ADRs 0001–0006. CLAUDE.md house rules + banned list.

**Exit criteria:** CI green with all gates required; a do-nothing scene renders at 60fps
with the clock architecture in place; tokens consumed by one demo component.

## Phase 1 — One real station (vertical slice)

*One city, end-to-end, museum-grade — proves every pipe before scaling to N.*

- MDX schema (doc 06 §4) + zod validation; migrate the existing 4 destinations' data.
- Build ONE complete place page (pick the city with the best material): station-sign
  header, fast-facts strip, themed MapLibre map (city-palette style JSON, animated route
  line), media wall from the R2 pipeline with ThumbHash reveals, typed timeline blocks,
  platform-edge footer.
- Depth-map hero: Depth Anything V2 Small at build + displacement shader (the signature
  effect, cheapest here).
- View Transition morph from a temporary index card into the page.
- Playwright snapshots + axe + budgets for this page become the template for all others.

**Exit criteria:** the slice passes the full gate list; a reviewer agent scores it
against the rubric; the owner signs off the museum feel. **This page IS the design
system review.**

## Phase 2 — The first click (station intro + ticket)

*The surprise moment — built on a pipeline that now exists.*

- Station arrival scene (2.5D planes in the persistent canvas, light choreography,
  ≤4s, skippable frame one) wired as **intro-as-preloader**: timeline driven by real
  LoadingManager progress; doors open only when the critical set is resident. No spinner
  exists.
- The Ticket: Wallet-pass component, line-diagram face from real data, drag-to-commit
  punch (range-input a11y), holo sheen (Motion values), iOS gyro permission + AudioContext
  unlock on the punch gesture.
- Returning-visitor logic (versioned localStorage read pre-hydration), Replay in menu.
- Ticket persists as menu/progress HUD.
- Mobile variant: single-layer arrival + tap-to-punch.

**Exit criteria:** first paint <1.5s; punch→doors ≤800ms; returning visitor to content
≤2s; reduced-motion journey complete and elegant; intro masks 100% of ticket-scene load.

## Phase 3 — The Ride

*The primary navigation.*

- Carriage scene: window portals (DOM tier first, then GSAP `containerAnimation`, then
  MeshPortalMaterial where it earns its keep), scenery strips per region (2.5D multiplane
  + per-region palettes), tunnels between regions.
- Ride model: position-along-path scrub with per-segment easing; ride-state store
  ("return to train" resumes at the window you left).
- Line-diagram progress rail (pinned; jump-nav; octilinear renderer over
  `{lines, stations, interchanges}` data — the same data renders ticket back, rail, and
  sitemap).
- Window → place transitions (VT morph; `board`/`arrive`/`return` types), set-piece
  boarding transition via next-transition-router.
- Mobile: vertical carriage variant.
- "Under construction" station styling for content-incomplete cities.

**Exit criteria:** full journey station→ride→place→back at 60fps desktop / ≥55 mid-tier
mobile; scroll never locked; all windows keyboard-reachable; snapshots for every window.

## Phase 4 — The Globe (terminus)

- MapLibre v5 globe with zoom-interpolated projection; visited/planning marker grammar;
  great-circle arc lifecycle animation (trips as lines).
- LOD ladder per the token'd zoom bands; per-city themed styles already exist from
  Phase 1's template.
- Tour mode (auto-fly the network) + Explore mode; URL-hash camera state.
- Fallback ladder + context-loss recovery, all forceable and CI-screenshot.
- PMTiles extracts on R2 (world z0–6 + per-city), OpenFreeMap primary.

**Exit criteria:** globe→city→place-page zoom reads as one continuous motion; fallback
tiers all render; tile failure degrades gracefully offline in CI.

## Phase 5 — Hardening & the mobile pass

- Dedicated mobile audit of every scene against the designed-simplification specs.
- A11y deep pass: screen-reader walkthrough of the whole journey (decoration stripped),
  focus choreography through cinematics, WCAG 2.3.3 audit.
- Performance endgame: bundle autopsy (knip for dead code), texture/DPR tiers, long-task
  hunt, real-device lab (old Android, mid iPhone).
- Content sprint: fill remaining stations to template (the checklist from doc 06 §4);
  "construction" stations for the rest.

## Phase 6 — Sound & the next lines

- The audio bus goes live (events already emitted since Phase 2): station ambience, door
  chime, punch clack, velocity-coupled ride bed, per-city ambient slots; three-state mute.
- Departure-board split-flap sound; Solari clack throttled.
- Future lines (Design/Music/About as new metro lines) — the IA scales by adding lines;
  the Music line hosts the Tone.js instrument from SITE_PLAN inside its own code-split
  route.

---

## Standing decisions still open (owner input wanted, not blocking Phase 0)

1. **The city list & line grouping** — which cities, grouped into which "lines"
   (regions? trips? years?). Needed by Phase 1 data modeling; drives ticket + diagram.
2. **Naming** — the metro system needs a name (the ticket, boards, and OG images all
   carry it). Candidates: "JCCL Metro", "Transit", "Line J" — owner's call.
3. **Signature photo per city** for the deep-zoom museum treatment (one great image beats
   twelve okay ones).
4. **London vs neutral signage register** (Hammersmith One vs Overpass-led) — a taste
   call best made against Phase 1's slice.
5. **Rive for the ticket** — only if the owner wants to author in the Rive editor;
   otherwise Motion values do it in code.
6. **Argos/Chromatic account** — optional human diff-gallery; local baselines suffice
   until wanted.

## Risk register (top 5)

| Risk | Mitigation |
|---|---|
| Scope: whole-site metro world is large | Vertical slice first; every phase shippable; "construction stations" make partial honest |
| WebGL perf on mid mobile | 2.5D planes (cheap by design), DPR tiers, designed mobile variants, fallback ladders — all CI-checked |
| Next experimental churn (View Transitions API surface) | next-view-transitions now, native on Next 16; pinned versions; prefetch-404 crawl catches regressions |
| Third-party tiles (OpenFreeMap no SLA) | PMTiles extracts on R2 as offline-capable fallback, availability probed nightly |
| Solo-content bottleneck | Strict per-place template, progressive fill, agent-generatable placeholders styled as "under construction" |
