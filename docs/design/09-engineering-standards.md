# 09 — Engineering Standards

The standardized dev practice for the rebuild: toolchain, code architecture for
animation-heavy React, testing strategy, CI/CD, and documentation rules. Verified
against current tool status 2026-07-07.

---

## 1. Debt to clear at kickoff (before any feature work)

1. **`next lint` → ESLint 9 flat config.** `next lint` is deprecated in 15.5, removed in
   16, and `next build` won't lint in 16. Run the codemod
   (`npx @next/codemod@latest next-lint-to-eslint-cli .`), verify output (known codemod
   bug #85679). Layers: `@eslint/js` → `typescript-eslint` recommendedTypeChecked
   (`projectService: true`) → `eslint-config-next` flat → `eslint-plugin-jsx-a11y`.
2. **`framer-motion` → `motion`** (`motion/react` imports — the maintained line).
3. **Wire the Geist font variables** (body currently renders Arial while Geist loads
   unused — found in round-1) and replace with the transit stack when doc 07 D7 lands.
4. **Pin `react`/`react-dom` to exact versions** — R3F v9 couples to React's internal
   reconciler and has already broken on a 19.x minor (verified incident). `^19` ranges
   are a silent globe-breaker.
5. **Custom GitHub Actions deploy** (`actions/configure-pages` + `upload-pages-artifact`
   + `deploy-pages`): the only path to production, waives the 10-builds/hour soft limit,
   belt-and-braces with the existing `.nojekyll`.
6. **Add `src/app/not-found.tsx`** (none exists) so the exported `404.html` is branded —
   it's also a station ("end of the line").

## 2. TypeScript & content typing

- Strictest-minus-one baseline: everything in `@tsconfig/strictest` except
  `exactOptionalPropertyTypes` (fights GSAP/three typings).
  **`noUncheckedIndexedAccess` is non-negotiable** — the site is registries indexed by
  slug (stations, tickets, places); this flag is what catches the typo'd slug.
- **Zod-validated MDX frontmatter in a prebuild script**: a malformed place page fails CI
  with a named field error instead of rendering a broken train window. The schema IS the
  content contract from doc 06 §4.
- `tsc --noEmit --pretty false` as its own CI job — machine-parseable, separable signal.

## 3. Formatting & lint policy

- **Prettier 3 + prettier-plugin-tailwindcss** (deterministic class order matters when an
  agent writes most Tailwind). **Biome rejected for now** (verified: no
  `react-hooks`/`@next` rule equivalents — the two highest-value rule sets here; revisit
  when it covers them).
- Custom guardrails (lint-enforced house rules):
  - `no-restricted-imports`: ban `gsap` timeline creation outside `lib/animation/` and
    `hooks/`; ban `framer-motion` (use `motion/react`).
  - Ban raw hex/duration literals in components (tokens only — doc 08 §4).
  - Ban `AnimatePresence` in route-boundary files.

## 4. Animation code architecture (the #1 bug class is lifecycle leaks)

The failure mode of this whole genre: ride → place → back, repeated, leaking tweens,
ScrollTriggers, and GL resources until the tab dies. The fix is architectural:

- **`useGSAP()` is the ONLY way GSAP runs in React** (`@gsap/react`, official): wraps
  `gsap.context()`, auto-reverts on unmount, survives React 19 StrictMode double-invoke.
  `contextSafe()` for event handlers. `ScrollTrigger.refresh()` after route-in
  transitions and image settles.
- **Pure timeline factories** in `lib/animation/` — `buildArrivalTimeline(refs, opts):
  gsap.core.Timeline` — separated from React; unit-testable without DOM; hooks
  (`useTrainArrival`, `useTicketReveal`) only mount/revert them.
- **One persistent R3F canvas above the router** (doc 07 D1); per-route canvases are
  banned; `template.tsx` must never contain a Canvas (remounts per navigation).
- Dispose audits: tunneled scene content unmounts must dispose geometries/textures;
  pre-warm shared assets (`useGLTF.preload`) so per-page scenes appear instantly.
- Every timeline registers in `window.__motion` under the E2E flag (doc 08 §1) and has a
  reduced-motion branch — both are lintable/greppable repo rules.

## 5. Testing strategy (inverted pyramid for animation sites)

- **Jest 30** (already in repo) owns logic: timeline-factory structure (labels,
  durations, targets — GSAP itself module-mocked), ride math (position-along-path,
  easing segments), ticket state machine, frontmatter schema, reduced-motion branching.
  `jest.advanceTimersToNextFrame()` (new in 30) steps rAF loops deterministically.
  Standard mock block in one shared setup: `matchMedia` (with add/removeEventListener —
  ScrollTrigger queries it), IntersectionObserver, ResizeObserver, scrollTo,
  HTMLMediaElement.
- **three.js in units:** no WebGL in jsdom; assert scene-graph structure via
  `@react-three/test-renderer` or stub `getContext('webgl2')`. headless-gl is dead for
  this (no WebGL2; three dropped WebGL1 in r163). Pixels are Playwright's job.
- **Playwright owns everything visual** (doc 08 §5–6). Audio (later) by contract with
  `standardized-audio-context-mock`.
- Test hygiene: don't run three runners. Jest stays until/unless Storybook Test makes
  Vitest worth a deliberate migration; not a 2026 necessity.

## 6. Git & CI conventions

- **Trunk-based**: short-lived branches → PR → squash-merge; branch protection requires
  all gates.
- **husky + lint-staged + commitlint** (conventional commits). Scopes match the
  architecture: `feat(station)`, `feat(ticket)`, `feat(ride)`, `feat(globe)`,
  `feat(place)`, `feat(media)`, `chore(ci)` — agent-greppable history. **Skip
  changesets** (nothing to version on a deployed site). Hooks are fast feedback; CI is
  the enforcement (agents can `--no-verify`).
- **Two workflows**: PR gates (parallel jobs, doc 08 §6) and main-branch deploy. Pin
  third-party actions by SHA; minimal `permissions:` (pages/id-token only in deploy);
  `concurrency: pages, cancel-in-progress`. Playwright browsers cached by version key.
- PR template includes the **motion checklist**: reduced-motion path? `useGSAP` cleanup?
  budget delta? screenshot manifest updated?

## 7. Media pipeline (every "service" is a build step)

- `scripts/optimize-media.ts` (sharp): widths [640, 1080, 1920, 2560] × AVIF q50 + WebP
  q75 + intrinsic dimensions + **ThumbHash** placeholder (decoded to data-URL at build —
  zero client JS, CLS-free) → `media-manifest.json` → typed `<Pic>`/`<Vid>` components.
  (`next-image-export-optimizer` is the buy-option if images must be solved this week;
  the custom manifest wins once ThumbHash reveals/video/art-direction arrive — they will.)
- `scripts/encode-media.sh` (ffmpeg): the doc 07 D6 recipes, checked-in source manifest,
  deterministic output. CI caches the output dir keyed on source hashes; AVIF on main
  only if PR encode time hurts.
- Fonts: `next/font/local`, pre-subset WOFF2 (pyftsubset; caps+digits subset for display
  faces often <15KB), preload the intro display font, keep `OFL.txt` beside self-hosted
  files.
- Upload: `rclone sync` to R2 in CI; media URLs only via `NEXT_PUBLIC_MEDIA_BASE`.

## 8. Documentation standards

- **MADR 4.0 ADRs** in `docs/adr/`, one page max, seeded at kickoff:
  `0001` static-export-on-github-pages · `0002` gsap-standard-license (the one non-MIT
  dep) · `0003` single-persistent-canvas · `0004` eslint-not-biome ·
  `0005` media-manifest-pipeline + R2 · `0006` maplibre-globe-one-engine.
  ADRs double as constraints the verification agent checks changes against.
- **CONTRIBUTING.md** written for humans AND agents: exact command list
  (dev/lint/typecheck/test/e2e/build/media/encode), commit convention, PR checklist.
- **CLAUDE.md / AGENTS.md**: the house animation rules (useGSAP-only, contextSafe,
  dispose audit, reduced-motion required, banned-list from doc 07 D10) — lint enforces
  what these docs declare.
- Per-feature `README.md` (train/, ticket/, globe/) with props table + **motion
  contract**: what animates, when, and how it degrades.
- Analytics: **GoatCounter** (free personal tier, no cookies, no banner, one async tag).

## 9. Performance budgets (recap — enforced, not intended)

| Budget | Value | Gate |
|---|---|---|
| Shared JS baseline | ≤ 130KB gz | size-limit |
| Globe/map route | +170KB allowance | size-limit |
| LCP | ≤ 2.5s (median of 3) | LHCI |
| CLS | ≤ 0.1 **hard** | LHCI |
| Intro long tasks | none > 50ms | Playwright trace |
| FPS during intro | ≥ 55 average | Playwright probe (trend) |
| `out/` size | budget assert (≪ 1GB) | CI script |
| `public/` file size | > 5MB rejected | pre-commit + CI |
| Window loop | ≤ 3MB H.264 / ≤ 1.5MB AV1 | media check |
| axe violations | 0 (serious/critical) | Playwright |
