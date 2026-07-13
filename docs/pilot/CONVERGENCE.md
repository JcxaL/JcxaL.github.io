# Convergence Notes — decisions & media waiting on the owner

Parked here whenever a unit needs a human decision or real media to *finish*.
The autonomous loop ships the placeholder version and keeps moving; we resolve
these together in the convergence pass. Nothing here blocks the build.

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
