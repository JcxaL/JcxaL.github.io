# 08 — Agent Design Workflow: build → see → verify

How an AI agent designs, builds, and verifies this site by **vision AND by code** — the
owner's requirement that the workflow be robust, tested, and standardized. Everything
here was chosen for automatability and verified for maintenance status (2026-07-07).

---

## 1. The prime architectural rule: animation must be seekable

**Every cinematic sequence (station intro, ticket, ride, globe zoom) is a named GSAP
timeline registered on a `window.__motion` test hook** (behind `NEXT_PUBLIC_E2E` /
`?e2e=1`). One decision, four payoffs:

1. Playwright can pose ANY animation state deterministically (`__motion.ride.progress(0.5)`)
   before screenshotting.
2. Reduced-motion variants fall out naturally (seek to end state).
3. "Skip intro" UX is the same seek call.
4. The vision-review agent can debug by stepping through states.

This must be adopted **before the first sequence is written** — it is the single
highest-leverage decision in this document. Supporting determinism hooks:
`lenis.scrollTo(x, {immediate:true})`, MapLibre `map.once('idle')`, R3F
`frameloop="demand"` + `invalidate()` (+ `preserveDrawingBuffer` for capture), the globe
fallback-ladder forceable via query param, `page.clock` for time-driven frames, fixed
seeds/camera poses for WebGL scenes.

## 2. Two-tier verification (the tiers are not interchangeable)

| Tier | Question | Tool | CI role |
|---|---|---|---|
| **Deterministic** | "Did it change?" | Playwright `toHaveScreenshot` (pixelmatch, baselines in-repo), axe, Lighthouse CI, size-limit | **Required PR gates** |
| **Subjective** | "Is it good?" | Vision-model critique of screenshots against the written rubric | **PR commentary — never a required check** |

A model's aesthetic opinion must never block a merge; pixel diffs, budgets, and a11y do.

## 3. The vision loop (the documented pattern)

The canonical loop (Anthropic best practices + corroborating case studies):
**implement → build → serve `out/` → screenshot → critique against an explicit written
target → fix → re-screenshot**, capped at **3 iterations per screen**, with a
**fresh-context reviewer separate from the builder** (a second agent catches what the
builder rationalizes away).

- **The screenshot manifest** (the reviewer's contract): every journey stage ×
  3 viewports (390 / 768 / 1440) × {motion-seeked, reduced-motion}. Stages: station
  arrival (0%, 50%, doors-open), ticket (idle, dragging, punched), ride (per window,
  tunnel), place page (hero, media wall, map), globe (each LOD band, tour mode), plus
  each fallback tier.
- **The rubric lives in-repo** (`docs/design/rubric.md` — to be written with the first
  build phase): scored dimensions (typography, spacing, motion continuity, contrast,
  metro-metaphor fidelity) so critiques are consistent across sessions and cite the
  violated rule, not vibes.
- **Tooling split (2026 practice):** playwright-mcp (34.8k★, Apache-2.0) for interactive
  exploration — its 2026 `--vision auto` mode switches to screenshots for canvas/WebGL,
  which accessibility-tree agents are blind to; **plain Playwright scripts invoked by a
  repo skill for the repeatable loop** (disk-mediated screenshots cut ~4× tokens vs MCP
  streaming). Wrap as `scripts/verify-ui.ts` + a skill doc so every session runs the
  same loop.

## 4. Design tokens as the machine contract

The DTCG spec went **stable (2025.10)**; Style Dictionary v4/v5 (Apache-2.0, active,
Tokens-Studio co-maintained) compiles it. Tokens become the thing vision review can
*cite*:

- `tokens/*.json` (DTCG): metro line colors per city, signage type scale, motion
  durations/easings (`motion.duration.station-arrival`, `easing.train-decelerate`),
  zoom-band stops for the globe ladder.
- Build → CSS custom properties → Tailwind 4 `@theme` → **and MapLibre style JSON paint
  values** — one source for DOM, GSAP, and the map.
- **Lint rule the agent enforces:** no raw hex/duration literals in components — only
  token-derived values. A critique then reads "uses `#1a2b3c`, expected
  `color.line.eastAsia`" instead of "colors look off".

## 5. Visual regression: the 2026 field, after the consolidation

Verified status — the field consolidated hard:

- **Adopt:** Playwright `toHaveScreenshot` as the primary gate — free, local, baselines
  committed (Linux-CI-generated only; never local-OS renders). Two Playwright projects:
  `reduced-motion` (layout truth, blocking) and `seeked-motion` (animation truth via
  `__motion` seeks, blocking) — plus full-motion journeys as **non-blocking nightly**
  (shared-runner flake).
- **Optional layer:** Argos CI (MIT platform, active, Playwright-native) when a
  human-friendly diff gallery per PR is wanted. Agent proposes, human approves.
- **Only with Storybook:** Chromatic (5k free snapshots/mo; TurboSnap mandatory).
  Storybook 9/10 itself: adopt **selectively** — stories for reusable motion components
  (ticket, window card, board, globe wrapper) as an enumerable state machine, not for
  cinematic pages. Defer until components stabilize.
- **Banned (verified):** Lost Pixel (**archived 2026-04-22**), BackstopJS (dormant since
  2024-09) — both still recommended by 2025 blog posts; do not trust VRT roundups without
  checking archive status.
- WebGL screenshots vary by GPU: `maxDiffPixelRatio` ~0.02–0.05 on canvas regions, or
  assert exposed state instead of pixels; mask volatile regions.

## 6. The full gate list (what CI actually runs)

Required PR checks — every gate emits machine-readable output (JSON reporters) so the
orchestrating agent parses failures instead of screen-scraping logs:

1. `tsc --noEmit` · ESLint (flat) · Prettier check
2. Jest unit suite (logic, timeline factories, frontmatter schema)
3. `next build` (static export) → artifact
4. Playwright vs `out/`: reduced-motion snapshots + seeked-motion snapshots +
   **axe** (`wcag2a/aa/21aa`, both motion modes — violations = 0) + **prefetch crawl**
   (fail on any 404'd `_next/*.txt` — catches the static-export prefetch bug class)
5. **Lighthouse CI** `staticDistDir: ./out` — perf ≥ 0.9 median-of-3, LCP/TBT thresholds,
   **CLS ≤ 0.1 hard**, per-URL overrides for the cinematic intro rather than weakened
   global budgets
6. **size-limit** per route group: shared baseline ≤ 130KB gz; globe route +170KB
   (three.js/maplibre allowance); PR comment with delta
7. **Media-weight check**: `du -sb out/` budget + >5MB file guard in `public/` +
   per-page media budget from the manifest
8. **FPS probe** (non-blocking trend): 2s rAF counter during intro ≥ 55fps average;
   no long task > 50ms during the intro window

Nightly (non-blocking): full-motion journeys, WebGL context-loss recovery drill,
fallback-ladder screenshots, PMTiles/tile-source availability.

## 7. Roles and loop etiquette

- **Builder agent**: implements against docs 06–07 + tokens; runs the local loop (build →
  screenshot → self-critique → fix, ≤3 iterations); commits with conventional scopes
  (`feat(ticket): …`).
- **Reviewer agent** (fresh context): consumes the screenshot manifest + rubric; files
  critiques as PR comments citing tokens/rules; approves nothing — humans merge.
- **Vision review of WebGL** always uses screenshots (axe and a11y-tree are blind there);
  the globe/train need DOM text alternatives anyway (a11y + SEO), which doubles as the
  agent's assertable state.
- Audio (later phase) is verified **by contract, not pixels**: Jest against the bus with
  `standardized-audio-context-mock` (active, v10 Jun 2026) asserting event→sound
  mappings and mute behavior; `data-audio-state` attributes for the vision loop.
- Figma MCP: **only if** mockups get authored in Figma; otherwise the written brief +
  reference screenshots are the target (current plan).

## 8. What this buys us

The genre's award-tier weakness is accessibility and performance (doc 01); this pipeline
turns both into hard gates. And the metro metaphor's determinism (station codes, line
colors, numbered stops, fixed camera poses) is not just theme — it is what makes every
screen assertable by a machine. The aesthetic and the verification strategy are the same
design.
