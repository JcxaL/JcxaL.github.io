# Convergence Notes — decisions & media waiting on the owner

Parked here whenever a unit needs a human decision or real media to *finish*.
The autonomous loop ships the placeholder version and keeps moving; we resolve
these together in the convergence pass. Nothing here blocks the build.

## ⇦ CONVERGENCE HAND-OFF (2026-07-12)
The media-independent build has reached its boundary: every unit that is
media-independent **and not blocked on your input** is built, verified, and on
`pilot/main` (21 commits). What remains all needs you:

1. **~~The r3f decision~~ — RESOLVED (proceeded with r3f).** The 3D Stage is now
   built with `three` + `@react-three/fiber`, code-split (initial bundle intact)
   and gated on `stageEnabled()` with a static fallback. I made the builder's
   technical call (the goal scopes the 3D scene kit; the ask-tool failed twice).
   **Your call to confirm:** keep r3f, or have me reimplement on vanilla WebGL
   behind the same Stage API (no other code changes). Also confirm the abstract
   network-sphere as the Stage motif, or point me at what you'd rather it depict.
2. **Your media.** Gather against `MEDIA_MANIFEST.md` (6 slots). Binding is
   mechanical — edit `bindings.ts`, drop files, zero code changes.
3. **Manual/real-device passes.** Real-device 60fps (esp. the gsap Concourse),
   a screen-reader walkthrough, and the 6 Concourse focus-ring flags (pre-existing
   components). See `DOD.md`.

Everything else — contracts, 3 surfaces, the full token/component/motion/2.5D-
scene documentation in the Atlas, and the automated DoD (WCAG-AA, reduced-motion,
console, keyboard, perf-budget, fallback-contract) — is green. `/atlas` is the
living deliverable.

## Decisions needed
- [ ] **Flagship set beyond Paris.** Pilot proves Concourse + Paris Line + one
      Paris Station. Confirm Paris is the flagship, or name a different
      Line/Station. (Assumed: Paris.)
- [ ] **3D dependency.** Plan is `three` + `@react-three/fiber` for the Stage
      layer (added when the first 3D unit lands). Confirm, or choose vanilla
      WebGL — the Stage API is identical either way. (`motion`/`gsap` already
      installed for 2D/2.5D.)
- [ ] **Media hosting & naming.** The content schema references a `mediaBase`
      (e.g. an R2 bucket). Decide: bundle under `public/media/…` vs a CDN/R2
      base URL. Affects the `src` values in `bindings.ts`. (Assumed: `public/media`.)
- [ ] **Duotone vs full-color.** `DuotoneImage` remaps photos into the signage
      two-tone ramp. Decide per-surface whether heroes stay duotone or go
      full-color at convergence. Related: when a real image binds to a
      `MediaSlot`, should it inherit the duotone treatment (via `slot.line`)?
      Currently the bound image renders full-color; the placeholder is tinted.
      If duotone is wanted on bound media, MediaSlot's image path should apply
      the `--duotone-filter` — a small, deferred build unit pending this call.

## Media waiting (see MEDIA_MANIFEST.md for the full spec table)
- [ ] 6 slots currently declared, 0 bound — gather against the manifest.

## Notes / open threads
- The design-system **Atlas** (showcase/docs surface) does not exist yet; it's a
  build unit. Not to be confused with `src/components/atlas/GlobeAtlas` (a globe).
- The redesign already ships a lot (transit components, tokens, motion libs) —
  the pilot formalizes and extends rather than starts from zero.
