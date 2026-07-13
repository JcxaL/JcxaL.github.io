# The JccL Line — Pilot Design Charter

> **North-star `/goal`:** *Ship the JccL Line pilot — a launch-candidate 3D/2.5D
> design language, proven end-to-end across three flagship surfaces (Concourse
> home · one Line journey · one Station exhibit) and backed by a complete,
> documented design system (tokens → 2D components → motion → 3D scene kit) with
> a living Atlas. Parallelized across the tracks in this charter; every unit ships
> only when it meets the Definition of Done (60 fps mobile · WCAG AA · reduced-motion
> path · no-WebGL fallback · Atlas entry · tests). Not done until all three surfaces
> integrate on `pilot/main`, the Atlas covers every primitive, and CI (perf +
> a11y + visual-regression) is green.*

This document is the shared source of truth for a **multi-agent, multi-month**
build. It exists so that many agents can work **in parallel without colliding**:
tracks own disjoint directories, build against **frozen contracts**, and
integrate on a cadence. Read your track, honor the contracts, ship to the
Definition of Done.

---

## 0. What "pilot" means

Not the whole site — a **vertical slice that proves the entire design language**
on three surfaces, at launch quality:

1. **The Concourse** (`/`) — the home. A 3D metro-network hero you can orbit;
   departures board into the lines. Proves: hero-scale 3D, the network model,
   the entry moment.
2. **A Line journey** (`/travel` → one line, e.g. *Paris*) — a 2.5D scroll
   journey down a strip-map, stations revealing as depth-layered dioramas.
   Proves: scroll orchestration, 2.5D parallax, content pipeline.
3. **A Station exhibit** (`/station/[id]`) — a single destination as an
   immersive room: 3D diorama + long-form field note + media. Proves: deep 3D
   scene, typography system, media handling.

If these three sing together, the language is proven and the rest of the site
is "more of the same." That is the whole bet.

---

## 1. Non-negotiable principles

- **Progressive enhancement, always.** Every surface is usable and beautiful
  **without WebGL** (2.5D/2D fallback) and **with `prefers-reduced-motion`**.
  3D and heavy motion are enhancements layered on a solid base, never a gate.
- **Performance is a feature.** 60 fps on a mid-range phone. Ship budgets, not
  vibes (see §9). A frame drop is a bug.
- **Accessible by construction.** Keyboard-operable, screen-reader sane, focus
  managed across transitions, contrast AA. 3D scenes have text equivalents.
- **One coherent language.** Everything speaks *transit museum* — lines,
  stations, plates, boards, strip-maps, the network. No orphan aesthetics.
- **Documented or it doesn't exist.** Every token, component, motion, and 3D
  primitive has a live entry in the **Atlas** the day it merges.
- **Contracts over coordination.** Agents don't sync by talking; they sync by
  building to the interfaces in §5. Change a contract → §7 process.

---

## 2. The Layer Model (the master technical contract)

Every surface composes from **three depth planes**. This is what lets 2D, 2.5D,
and 3D agents work independently and still integrate.

| Plane | What lives here | Owner track | Fallback when no WebGL |
|---|---|---|---|
| **Chrome** (2D, z-top) | Nav, dock, boards, HUD, text, controls | T2 UI | unchanged (it's already 2D) |
| **Parallax** (2.5D, mid) | Layered image/vector planes, depth cards, strip-map rails | T3 Motion | static layered CSS transforms |
| **Stage** (3D, z-back) | r3f scenes: network map, station dioramas, particles | T4 Scene | pre-rendered still / gradient poster |

**Rules:** Chrome never depends on the Stage being present. The Stage publishes a
small imperative API (`stage.focus(stationId)`, `stage.setLine(id)`,
`stage.progress(0..1)`); Chrome/Parallax call it and degrade silently if it's a
no-op fallback. Depth ordering, camera, and the `--depth-*` token scale are owned
by the Layer contract, not by any single component.

---

## 3. Tech stack (decisions — forks flagged 🔀)

- **Framework:** Next.js (App Router, static export) on the redesign branch —
  it already hosts the transit foundation. Client-side WebGL is fine on Pages.
- **3D:** 🔀 `three` + `@react-three/fiber` + `@react-three/drei` (bundled via
  npm). *Fork:* if you want zero-dependency vanilla WebGL instead, swap T4's
  toolchain — the Stage API (§2) stays identical, so no other track changes.
- **2.5D / motion:** CSS custom properties + scroll-driven animations +
  view-transitions; a thin motion lib (Motion One or GSAP) 🔀 behind the
  motion-token API so it's swappable.
- **Styling:** CSS variables from tokens (no hard-coded values in components).
- **Content:** MDX + typed schemas.
- **Docs/Atlas:** self-built showcase routes (no external Storybook), so it
  ships with the site and obeys the same constraints.

> The **playground's** self-contained/no-CDN rule does **not** apply here — this
> is the bundled Next.js app. Keep that distinction.

---

## 4. Parallel Tracks (each = one or more agents, disjoint ownership)

Ownership is by **directory** so PRs don't conflict. "Consumes/Produces" are the
contracts (§5) each track depends on or defines.

| # | Track | Owns (dirs) | Produces | Consumes |
|---|---|---|---|---|
| **T1** | **Foundations & Tokens** | `tokens/`, `src/styles/tokens/` | token schema, CSS-var pipeline, theming (light/dark + per-line), depth/motion scales | — |
| **T2** | **2D Component Library** | `src/components/ui/` | primitives + components (board, plate, dock, card, modal, command-palette, toast, nav) | T1 tokens, T3 motion API |
| **T3** | **Motion & Interaction** | `src/lib/motion/`, `src/components/motion/` | motion tokens, scroll-orchestration registry, gesture + view-transition helpers, reduced-motion strategy | T1 tokens |
| **T4** | **3D / 2.5D Scene Kit** | `src/three/`, `src/components/scene/` | the **Stage API** (§2), reusable scene primitives (NetworkMap, Diorama, ParallaxRig, DepthCard), LOD + fallback | T1 depth tokens, Layer contract |
| **T5** | **Content & Data** | `src/content/`, `src/lib/content/`, `src/lib/transit/` | typed schemas (Line/Station/Journal), MDX pipeline, the network graph data | — |
| **T6** | **Flagship Surfaces** | `src/app/(pilot)/*` | the 3 assembled pilot pages | T1–T5 (integrator track) |
| **T7** | **Design-System Atlas** | `src/app/atlas/`, `src/components/atlas/` | living docs: every token/component/motion/3D primitive with live controls | T1–T4 |
| **T8** | **Quality · Perf · A11y** | `.github/`, `tests/`, `scripts/audit/` | CI gates, perf budgets, a11y + visual-regression harness, device matrix | all (cross-cutting) |

Agents can be assigned per track, or per unit within a track. Multiple agents may
work a track in parallel as long as they take **different files/components**.

---

## 5. Contracts-first (Phase 0 — must land before parallel build)

Nothing large gets built until these interfaces are frozen and stubbed, because
they are what let tracks proceed **without waiting on each other**:

1. **Token schema** — `tokens/tokens.json` structure + the CSS-var naming
   convention (`--color-*`, `--space-*`, `--type-*`, `--motion-*`, `--elev-*`,
   `--depth-*`, `--line-<id>`). *Owner: T1.*
2. **Component API conventions** — prop naming, `className` passthrough,
   `data-*` state hooks, slotting, controlled/uncontrolled rules. *Owner: T2.*
3. **Motion vocabulary** — named motions (durations/eases), the scroll-timeline
   registry signature, the reduced-motion contract. *Owner: T3.*
4. **Stage API** — the imperative 3D interface + the no-WebGL fallback contract
   (§2). *Owner: T4.*
5. **Content schema** — `Line`, `Station`, `Journal` types + MDX frontmatter.
   *Owner: T5.*
6. **Layer model** — depth planes, render order, camera/scroll coupling (§2).
   *Owner: T4 + T1, ratified by all.*

Deliverable of Phase 0: every contract has a **typed stub that compiles**, so a
T6 page can import real interfaces backed by placeholder implementations.

---

## 6. Phases & milestones (indicative months)

- **Phase 0 — Contracts & scaffold (wk 0–2).** §5 frozen; `pilot/main` branch;
  Atlas skeleton live; CI green on stubs.
- **Phase 1 — Vertical slice (wk 2–6).** *One* surface (the Line journey) built
  through **all** tracks, end to end, to full DoD. This is the proof the pipeline
  works; do not go wide before it's green.
- **Phase 2 — Breadth (wk 6–12).** The Concourse + a Station exhibit; fill out
  the component & scene kits; Atlas covers everything shipped.
- **Phase 3 — Launch candidate (wk 12–16).** Perf/a11y/motion polish, cross-
  device, visual-regression locked, LC review.
- **Ongoing.** Atlas stays green; contracts versioned; the pilot is the seed the
  full site grows from.

Gate between phases: **all DoD met + CI green + a review-agent sign-off**.

---

## 7. Coordination protocol (how months of parallel work stays sane)

- **Branches.** Integration branch `pilot/main` (off the travel WIP). Each unit
  on `pilot/t<N>-<slug>`. Agents PR into `pilot/main`.
- **Integration cadence.** Merge to `pilot/main` continuously; a scheduled
  "integration sweep" reconciles cross-track drift and re-runs the full audit.
- **Every PR gets an independent review agent** (fresh context) before merge —
  the house pattern. No self-merges of substantive work.
- **Contract changes** are special: a "contract PR" tagged `contract:` touching
  §5 needs sign-off from every consuming track's owner and a **version bump**
  (`contracts/VERSION`). Breaking changes ship with a migration note.
- **Ownership map (§4) is law** — if two units need the same file, one is
  mis-scoped; split it or move the shared bit into a contract.
- **Definition of Ready** (before an agent starts a unit): contracts it needs are
  frozen · owned files are free · acceptance criteria written · Atlas slot named.

---

## 8. Definition of Done (per unit — non-negotiable checklist)

- [ ] Meets its acceptance criteria; integrates on `pilot/main`.
- [ ] **60 fps** on the mid-range device profile; within the route's perf budget (§9).
- [ ] **Reduced-motion** path implemented and tested.
- [ ] **No-WebGL fallback** implemented (for anything touching the Stage).
- [ ] **A11y:** keyboard path, focus management, SR labels, contrast AA; 3D has a text equivalent.
- [ ] Uses **only tokens** (no hard-coded color/space/type/motion values).
- [ ] **Atlas entry** added with live controls.
- [ ] Tests: unit where logic exists + a **visual-regression** snapshot.
- [ ] Reviewed by an independent review agent; CI green.

## 9. Quality budgets (numbers, per pilot route)

- **Frame:** ≥ 60 fps sustained; no single long task > 50 ms after interaction.
- **Weight:** ≤ 250 KB JS (gzip) initial per route; 3D assets lazy + streamed.
- **Load:** LCP < 2.5 s, TTI < 3.5 s on the mid-tier profile.
- **A11y:** automated checks 100% pass; manual keyboard/SR pass per surface.
- **Fallback:** full content + navigation with JS-lite / no-WebGL / reduced-motion.

## 10. Risks → how this structure mitigates them

- *3D tanks perf on mobile* → budgets in DoD, LOD + fallback in the Stage
  contract, T8 gates every PR.
- *Tracks drift / merge hell* → disjoint ownership + contracts-first + integration
  sweeps.
- *Scope creep past "pilot"* → the three-surface definition (§0) is the fence.
- *Inconsistency across agents* → tokens-only rule + the Atlas as the single mirror.
- *A contract needs to change mid-flight* → the versioned contract-PR process (§7),
  not an ad-hoc edit that breaks five tracks.

## 11. Kickoff checklist

1. Cut `pilot/main` off the travel WIP branch; add `contracts/VERSION` = `0.1.0`.
2. Assign agents to T1, T4, T5 first (they define the load-bearing contracts).
3. Land Phase 0 (§5) — stubs compile, Atlas skeleton + CI green.
4. Open the vertical-slice (Phase 1) as the first cross-track epic.
5. From then on: one unit → one branch → review agent → `pilot/main`; sweep weekly.

---

*Tunable knobs before you start: (a) build on the travel WIP branch vs a fresh
pilot repo; (b) r3f/three vs vanilla-WebGL for T4; (c) which Line & Station are
the flagships; (d) team size → how many agents per track. Everything else here
holds regardless.*
