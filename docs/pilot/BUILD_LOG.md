# Build Log — JccL Line pilot

Reverse-chronological. One entry per shipped unit: what landed, verification,
what's next. Keeps the autonomous loop legible across sessions.

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
