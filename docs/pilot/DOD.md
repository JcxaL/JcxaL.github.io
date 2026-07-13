# Definition-of-Done verification record

Automated DoD checks run against the static build (`out/`) with headless
Chromium at a mobile viewport (390×800), each surface loaded in both default and
`prefers-reduced-motion: reduce` contexts. Re-run as surfaces evolve.

## Latest pass — 2026-07-12

| Surface | h1 | focusable | media slots | imgs w/o alt | console errors (default) | console errors (reduced-motion) |
|---|---|---|---|---|---|---|
| `/` Concourse | 1 | 32 | 0¹ | 0 | ✅ 0 | ✅ 0 |
| `/travel/paris` Paris Line | 1 | 21 | 1 (`travel.paris.cover`) | 0 | ✅ 0 | ✅ 0 |
| `/atlas` Atlas | 1 | 18 | 6 | 0 | ✅ 0 | ✅ 0 |
| `/station` Station preview | 1 | 2 | 0¹ | 0 | ✅ 0 | ✅ 0 |

¹ Concourse hero + Station exhibit slots not yet placed (upcoming units).

## What this verifies (DoD subset — green)
- **No console/page errors** on every surface, in **default and reduced-motion**
  — the reduced-motion path is exercised and clean.
- **Heading structure**: exactly one `h1` per surface.
- **Alt coverage**: no `<img>` without alt (bindings also enforce non-empty alt
  at build time, so this holds through convergence).
- **Slot integration** renders as expected.

## Not yet verified (pending units — tracked here so it's not mistaken for done)
- **WCAG AA contrast / full ARIA audit** — needs axe-core; the placeholder id
  label is known-low-contrast in light mode (noted). → a11y sweep unit.
- **60fps on mid-range mobile** — needs a perf-profiling pass (trace + FPS) once
  the motion/3D layers land. → perf unit.
- **No-WebGL fallback** — trivially green today (no 3D scenes built yet); becomes
  meaningful when the Stage/scene kit ships. → verify with scenes.
- **Keyboard traversal correctness** (focus order, visible focus, traps) — only
  focusable *count* is checked so far. → a11y sweep unit.

Method: `scratchpad/pw/dod.mjs` (playwright-core + the pre-installed Chromium).
