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
- **WCAG 2 A/AA — axe-core clean.** Automated axe (wcag2a/2aa/21a/21aa) run over
  all four surfaces: **0 violations** each (incl. color-contrast). The two
  contrast misses it caught were fixed: the Atlas kicker and the LayoutTokens
  "TODO" note used amber (no theme-aware dark variant → failed on the light bg),
  now theme-aware ink. Re-run: all green.
- **No console/page errors** on every surface, in **default and reduced-motion**
  — the reduced-motion path is exercised and clean.
- **Heading structure**: exactly one `h1` per surface.
- **Alt coverage**: no `<img>` without alt (bindings also enforce non-empty alt
  at build time, so this holds through convergence).
- **Slot integration** renders as expected.
- **Keyboard traversal** (partial-green): Tab reaches all interactive elements,
  a "Skip to concourse" skip link leads every surface, and focus order is sane.
  Visible-focus check: Paris Line (21 stops), Atlas (18), Station (2) — **0
  without a detected focus indicator**. Concourse: 6 of 25 stops had no
  outline/box-shadow the automated check could see — all in **pre-existing
  redesign components** (Ticket / DepartureBoard rows / TransitDiagram); could be
  custom focus styling the check misses. Flagged for the manual pass; not a
  pilot-surface regression. Method: `scratchpad/pw/keyboard.mjs`.

## Not yet verified (pending units — tracked here so it's not mistaken for done)
- **60fps on mid-range mobile** — needs a perf-profiling pass (trace + FPS) once
  the motion/3D layers land. → perf unit.
- **No-WebGL fallback** — trivially green today (no 3D scenes built yet); becomes
  meaningful when the Stage/scene kit ships. → verify with scenes.
- **Concourse focus indicators** — 6 pre-existing-component stops need a visible
  focus ring (or confirmation their custom focus styling is sufficient). → manual pass.
- **Full manual SR pass** — automated axe ≠ complete a11y; a screen-reader
  walkthrough of each surface remains.

Axe method: `scratchpad/pw/axe.mjs` (axe-core injected via addScriptTag).

Method: `scratchpad/pw/dod.mjs` (playwright-core + the pre-installed Chromium).
