# Build Log — JccL Line pilot

Reverse-chronological. One entry per shipped unit: what landed, verification,
what's next. Keeps the autonomous loop legible across sessions.

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
