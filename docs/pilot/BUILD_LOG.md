# Build Log — JccL Line pilot

Reverse-chronological. One entry per shipped unit: what landed, verification,
what's next. Keeps the autonomous loop legible across sessions.

---

### 2026-07-12 · T3 — motion-choreography Atlas entry
- **Shipped:** `MotionChoreography.tsx` wired into `/atlas`. Documents the
  "train" ease vocabulary as **precise static SVG bézier plots** (decelerate =
  arrivals, accelerate = departures, standard) — no animation, reduced-motion
  safe — plus the choreography principles (no-motion-first baseline, named
  seekable timelines via `window.__motion`, ambient-loop exemption).
- **Verified:** tsc clean · build clean · curves render · axe **0 violations**.
- **Design system now documented:** media slots · tokens (incl. depth) ·
  components · 2.5D scene kit · motion choreography. **Only the 3D Stage remains
  — blocked on the r3f dependency decision (parked in CONVERGENCE.md).**
- **Next (final autonomous units):** 60fps perf pass + no-WebGL fallback
  verification. After those, remaining gaps are user-gated (r3f · real media ·
  manual SR · real-device perf) — the convergence boundary.

---

### 2026-07-12 · T1/T4 — depth token scale + 2.5D Parallax scene kit
- **Shipped:**
  - **`--depth-*` scale** added to `tokens.json` (perspective + near/mid/far
    parallax planes) → regenerated via `pnpm tokens`; the generic generator
    emitted them cleanly. Closes the Layer-Model depth TODO; LayoutTokens Atlas
    card now documents the values.
  - **`ParallaxRig`** (`src/components/scene/ParallaxRig.tsx` + module.css) — the
    2.5D Parallax plane: a perspective container that tilts depth layers toward
    the pointer. Dependency-free CSS 3D; flat under reduced-motion (JS listener
    skipped + CSS backstop); flat at SSR/first paint.
  - **Atlas Scene-kit section** with a live `ParallaxDemo` (three planes at
    `--depth-near/mid/far` with translateZ scale-compensation).
- **Verified:** tsc clean · build clean (token regen included) · demo renders +
  tilts · axe **0 violations** all surfaces · screenshot confirms the 3D depth.
- **Deferred (parked in CONVERGENCE):** the 3D **Stage** (WebGL/r3f) layer needs
  the r3f dependency decision. The Stage API + fallback are already in place.
- **Next:** motion-choreography Atlas entry; 60fps perf pass; then the r3f Stage
  once the dep is confirmed.

---

### 2026-07-12 · T2 — component gallery in the Atlas (parallel workflow)
- **Shipped:** `/atlas` now has a **Components** section — live doc-cards for
  `SplitFlapBoard`, `DotMatrixSign`, `StationPlate`, `StatusLegend`, each
  rendering a real instance from the component's actual props
  (`src/components/atlas/gallery/*Card.tsx` + `ComponentGallery.tsx`).
- **How:** a 4-agent parallel **Workflow** — each read the real props interface +
  a usage example and authored one card; all typechecked first try, integrated
  in one pass.
- **Verified:** tsc clean · build clean · gallery renders in static HTML · axe
  re-run **still 0 violations** across all surfaces (live components are
  contrast-safe). Advances gate A: media slots ✅ + tokens ✅ + **components ✅**;
  motion-choreography + scene-kit remain.
- **Next:** motion-choreography Atlas entry; the 3D scene-kit + `--depth-*` scale.

---

### 2026-07-12 · DoD — keyboard traversal audit
- **Shipped:** `scratchpad/pw/keyboard.mjs` results in `DOD.md`. Tab reaches all
  interactive elements; a skip link leads every surface; focus order is sane.
  Visible-focus: Paris Line / Atlas / Station **0 without indicator**; Concourse
  6/25 stops (all pre-existing redesign components) flagged for the manual pass.
- **Gate D** keyboard item now partial-green (pilot surfaces clean; one
  pre-existing-component flag parked). Remaining: 60fps perf, manual SR.

---

### 2026-07-12 · DoD — axe-core a11y audit (WCAG 2 A/AA green)
- **Shipped:** an automated axe-core pass (wcag2a/2aa/21a/21aa) over all four
  surfaces → **0 violations** each. Two real color-contrast misses caught and
  fixed: the Atlas kicker and the LayoutTokens "TODO" note both used amber (no
  theme-aware dark variant → 1.47:1 on the light bg); switched to theme-aware
  `--color-ink-muted`. Re-run: all green. `DOD.md` updated.
- **Gate D** now: WCAG-AA contrast ✅ + reduced-motion ✅ + console ✅. Remaining:
  keyboard operability, 60fps perf, manual SR pass.
- **Next:** keyboard traversal sweep; then design-system breadth (component
  gallery + scene kit) via parallel workflow.

---

### 2026-07-12 · Phase 1 — Station exhibit surface (3 of 3) + contrast fix
- **Shipped:** `/station/[slug]` — the third flagship surface, an immersive
  station room (`/station/paris`): A01 plate + title, the 16:9 `station.paris.hero`
  slot, a long-form field note (inline placeholder prose), a facts rail, and the
  `station.paris.ambient.loop` video slot. Self-contained (inline content) to
  avoid the station-schema/loader traps; a full content pipeline is a later unit.
  **All three flagship surfaces are now media-independent — gate B met.**
- **Bug fixed (tokens-only + a11y):** several pilot CSS files used
  `var(--color-ink, …)` — a **non-existent** token — so labels/prose always fell
  back to white and vanished in light mode. Root-caused and corrected to
  `--color-ink-signage` (theme-aware) in MediaSlot, Atlas, and Station styles.
  This is the light-mode contrast issue flagged in earlier passes.
- **Verified:** tsc clean · build clean (`/station/paris` prerenders static) ·
  both slots present · headless screenshot, zero console errors.
- **Next:** a11y contrast/keyboard sweep (axe); component-gallery + scene-kit
  Atlas docs; the `--depth-*` token scale.

---

### 2026-07-12 · Phase 1 — Concourse home made media-independent
- **Shipped:** the Concourse (`/`) network-map panel now leads with
  `<MediaSlot slot={CONCOURSE_HERO}>` (21:9 aerial, `concourse.hero.aerial`) —
  the establishing plate the map sits over, per the slot's purpose. Placeholder
  now, fills at convergence. The signage-first hero is untouched. `MediaSlot`
  composes fine inside the client Concourse (it's a shared component).
- **Verified:** tsc clean · build clean · static HTML confirms
  `data-media-slot="concourse.hero.aerial"` + placeholder present.
- **Surfaces: 2 of 3** now media-independent (Paris Line ✓, Concourse ✓).
  Remaining: the Station exhibit (`/station/[slug]` room — a new-surface unit).
- **Next:** Station exhibit surface; then the a11y contrast/keyboard sweep.

---

### 2026-07-12 · DoD — first verification pass (a11y/reduced-motion/console)
- **Shipped:** `docs/pilot/DOD.md` — automated headless audit over all four
  built surfaces (`/`, `/travel/paris`, `/atlas`, `/station`) at mobile viewport,
  default **and** reduced-motion. Result: **zero console/page errors everywhere
  in both modes**, exactly one `h1` per surface, no `<img>` missing alt, slot
  integration confirmed. Closes the "no DoD verification" gap for what's built.
- **Honest gaps recorded** (not mistaken for done): WCAG-AA contrast/axe audit,
  60fps perf profiling, no-WebGL fallback (N/A until scenes land), keyboard
  traversal correctness — each tracked as a pending unit in DOD.md.
- **Next:** Concourse hero slot; then the a11y sweep (contrast + keyboard).

---

### 2026-07-12 · T1 — token documentation in the Atlas (parallel workflow)
- **Shipped:** the Atlas now documents the full token system —
  `src/components/atlas/{ColorTokens,TypeTokens,MotionTokens,LayoutTokens}.tsx`
  wired into `/atlas`. 22 color swatches (live CSS vars → theme-switch), 6 type
  specimens, the motion duration/easing table, layout radii + measure, and an
  explicit **`--depth-*` "not yet defined (Layer Model TODO)"** note.
- **How:** a 4-agent parallel **Workflow** (one component per token category,
  disjoint files) — the parallel-build model this pilot is designed for. All 4
  authored against the real `tokens.json`/`tokens.css`; integrated in one pass.
- **Verified:** tsc clean · build clean (`/atlas` static) · headless screenshot,
  zero console errors. Advances gate A (design system documented).
- **Follow-up:** define the `--depth-*` token scale (Layer Model) as a T1 unit.

---

### 2026-07-12 · Phase 1 — Paris Line surface made media-independent
- **Shipped:** `/travel/paris` no longer hard-codes `DuotoneImage
  src="/media/samples/paris.jpg"` (a direct contract violation). Its cover is now
  `<MediaSlot slot={PARIS_LINE_COVER}>` — placeholder today, fills at convergence
  by binding `travel.paris.cover`, zero further edits. First real flagship
  surface converted to the slot system.
- **Verified:** tsc clean · build clean · static HTML confirms
  `data-media-slot="travel.paris.cover"` present and the hard-coded asset gone.
- **Parked (CONVERGENCE):** whether MediaSlot bound *images* should carry the
  duotone signage treatment (as DuotoneImage did) — a design call for convergence.
- **Next:** Concourse hero slot + Station exhibit slot (finish the 3 surfaces'
  media independence); then the token-table Atlas entry + a11y/fallback sweep.

---

### 2026-07-12 · Phase 0 — Atlas route (design-system docs surface)
- **Shipped:** `/atlas` (`src/app/atlas/page.tsx` + `atlas.module.css`) — the
  living design-system documentation surface (CHARTER T7), noindex. v1 is a live
  **media-slot gallery**: renders all 6 `REGISTERED_SLOTS` as real `<MediaSlot>`
  placeholders, proving the media-independent contract works in-app. Inherits
  the transit chrome; sections stubbed for tokens/components/motion/scene-kit.
- **Verified:** tsc clean · build clean (`/atlas` prerenders static, 1.11 kB) ·
  placeholders present in static HTML · headless screenshot, zero console errors.
- **Known polish:** placeholder id label is low-contrast in light mode (caption
  below is AA-legible) — parked for the a11y sweep.
- **Next:** token contract (T1) documented into the Atlas; then the Paris
  vertical slice (Phase 1).

---

### 2026-07-12 · Phase 0 — media-manifest integrity guard
- **Shipped:** `__tests__/media-manifest.test.ts` + `pnpm media:check`. The
  registry is TS+zod (unrunnable by the repo's `.mjs` codegen), so instead of a
  file-writer the manifest is kept honest by a **CI guard**: fails if any
  declared slot is missing from `MEDIA_MANIFEST.md`, if the stated count is
  wrong, or if a binding fails `reconcileBindings()`. Drift-proof — this is the
  enforcement behind the convergence gate "manifest enumerates every slot."
- **Verified:** jest 16/16 (contract + manifest guard).
- **Next:** token contract (T1) — surface `tokens.json` as a typed, documented
  contract; then the design-system Atlas route; then the Paris vertical slice.

---

### 2026-07-12 · Phase 0 — media-slot review fixes (all 10 findings)
- Independent review verdict: contract sound & safe to build on. Closed every
  finding (Ultracode — not just the blocker):
  - **MAJOR** — `bindings.ts` (the file humans edit at convergence) now has a
    `mediaBindingSchema` (required alt, valid src reused from content schema) +
    load-time validation, and a new `reconcile.ts` (`reconcileBindings` /
    `unboundSlots`) catching typo'd ids & kind mismatches that used to ship green.
  - Placeholder tint now uses real tokens (`--color-lines-*` / `--color-board-amber`).
  - `line` is a real `z.enum` (cast removed → runtime matches type).
  - Cross-field `superRefine` (orientation ⟷ aspect; video-only fields).
  - Reduced-motion-aware bound video (`BoundVideo`); unified single `.frame`
    node across states; orientation-aware `sizes`; dead-code + comment fixes.
- **Tests:** `__tests__/media-slot.test.ts` — 13 passing (schema guards, binding
  validation, reconciler). **Verified:** tsc clean · jest 13/13 · build clean.

---

### 2026-07-12 · Phase 0 — Stage API contract (Layer Model)
- **Shipped:** `src/lib/stage/types.ts` — the imperative `StageAPI`
  (`focus`/`setLine`/`progress`/`reset` + `active`), `NOOP_STAGE` fallback, and
  the `stageEnabled()` gate (`hasWebGL()` && !`prefersReducedMotion()`). Lets the
  2D/2.5D tracks drive the 3D Stage without depending on it existing — the
  keystone that keeps the no-WebGL / reduced-motion path correct by construction.
- **Verified:** `tsc --noEmit` clean.
- **Next:** a `StageProvider` + `useStage()` context (wires real scene ↔ fallback)
  when the first scene lands; token contract (T1); vertical-slice kickoff.

---

### 2026-07-12 · Phase 0 — media-slot contract (the linchpin)
- **Branch cut:** `pilot/main` off the travel WIP branch (`…-6a8dah`, caught up
  to `main`). Knobs taken as "owner's call": build on the WIP branch · r3f for 3D
  (added when the first 3D unit needs it) · Paris as flagship Line + Station.
- **Shipped:** the media-slot system —
  - `src/lib/media/slot.ts` — `MediaSlotSpec` type + zod schema + `defineSlot`
    registry (`allSlots`/`getSlot`/`aspectRatio`).
  - `src/lib/media/bindings.ts` — binding resolver; empty by design during the
    build phase (the only file convergence edits).
  - `src/lib/media/slots.registry.ts` — 6 seeded flagship slots.
  - `src/components/media/MediaSlot.tsx` + `MediaPlaceholder.tsx` +
    `MediaSlot.module.css` — renders real asset when bound, else a token-driven
    procedural placeholder at the exact aspect ratio (no CLS on swap).
- **Verified:** `tsc --noEmit` clean · `pnpm build` clean (pnpm 10.12.1, static
  export unaffected). Independent review agent dispatched on the contract.
- **Docs:** `MEDIA_MANIFEST.md` seeded (6 slots) · `CONVERGENCE.md` opened.
- **Next:** (1) address review findings; (2) `pnpm media:manifest` generator so
  the manifest regenerates from the registry; (3) the design-system **Atlas**
  route (there is no showcase route yet — `src/components/atlas` is a *globe*,
  unrelated) to document tokens/components/slots; (4) formalize the token
  contract (T1) and the Layer Model + Stage API stub (T4) to unblock the
  vertical slice.
