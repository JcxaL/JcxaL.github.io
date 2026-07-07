---
status: accepted
date: 2026-07-07
---

# 0003 — One persistent R3F canvas above the router; WebGL context budget = 2

## Context and Problem Statement

The site's navigation metaphor is continuous camera movement (station → train → globe →
place). Recreating a WebGL context per route makes that impossible: context creation is
slow, state is lost, and Safari silently kills the oldest context beyond its per-page
cap. The smoothest sites of the current era (Igloo Inc, Awwwards SOTY 2024) all use one
scene with camera-flight navigation (doc 07 D1). Meanwhile MapLibre needs its own GL
context on map routes (ADR 0006), so contexts are a scarce, budgeted resource.

## Decision Outcome

1. **A single R3F `<Canvas>` mounts in the root layout** — fixed, behind `{children}`,
   above the router, and it **never unmounts**. Station intro, train ride, and globe
   hero are branches of one scene graph keyed off `usePathname()`; route changes move
   the camera, never the context.
2. Per-page 3D garnish portals into the same canvas via drei `<View>` / tunnel-rat.
   **Per-route canvases are banned; `template.tsx` must never contain a `<Canvas>`**
   (it remounts per navigation).
3. **WebGL context budget: 2 total** — the R3F world plus MapLibre on map routes.
   Nothing else may create a GL context (no cobe + R3F + MapLibre on one page).
4. `webglcontextlost` is handled with `preventDefault` + rebuild, and the recovery drill
   runs in nightly CI (doc 08 §6).

## Consequences

- Good: seamless camera choreography; shared asset warm-up (`useGLTF.preload`); 2.5D
  layers can later be swapped for real glTF meshes with zero choreography changes.
- Good: `frameloop="demand"` + `invalidate()` on one canvas keeps the single-rAF rule
  (doc 07 D2) intact — no competing render loops.
- Bad: unmounting *content* inside the persistent canvas now requires dispose audits
  (geometries/textures) — the #1 leak class this genre suffers (doc 09 §4).
- Bad: all 3D work is coupled to one scene graph's conventions; a quick "throwaway
  canvas in this one component" is never acceptable, even for prototypes that might ship.

Clarification (2026-07-07, reconciling with ADR 0006): decorative cobe mini-globes are permitted only on routes where MapLibre is not mounted, and count toward the 2-context page budget. R3F + MapLibre + cobe on one page is never allowed.
