# CLAUDE.md — House Rules for The JccL Line

Agent + developer guardrails. The full spec lives in `docs/design/` (read `README.md`
there first; doc 07 = tech decisions, doc 08 = verification workflow, doc 09 =
standards, doc 12 = brand). ADRs in `docs/adr/` are binding.

## Commands

- `pnpm dev` · `pnpm build` (static export to `out/`; runs `pnpm tokens` via prebuild)
- `pnpm test` (Jest) · `pnpm lint` · `pnpm tokens` (rebuild `src/styles/tokens.css`)

## Non-negotiable rules

1. **Tokens only.** No raw hex colors, durations, or easings in components — consume
   CSS vars from `tokens/tokens.json` (build: `pnpm tokens`). Edit the JSON, never the
   generated `src/styles/tokens.css`. Carve-outs: (a) jsdom/test fallbacks may mirror a
   token value if a comment names the token they mirror; (b) spring physics constants
   (stiffness/damping) are physical, not timed — allowed as named module constants.
2. **GSAP only via `useGSAP()`** (`@gsap/react`) or pure timeline factories in
   `src/lib/animation/` (unit-testable, no React). Never `gsap.timeline()` loose in a
   component. `contextSafe()` for handlers.
3. **One persistent R3F canvas** above the router (when the 3D shell lands). Never a
   `<Canvas>` per route, never inside `template.tsx`. WebGL context budget: 2 total
   (R3F + MapLibre).
4. **Every animation has a reduced-motion branch.** Author no-motion-first; add motion
   inside `prefers-reduced-motion: no-preference`. flyTo→jumpTo, draw-on→static,
   pulse→halo.
5. **Every cinematic timeline is seekable**: registered under the E2E flag on
   `window.__motion` so Playwright/vision review can pose any state (doc 08 §1).
   "Cinematic" = intro/ride/globe/route-transition sequences. Ambient component loops
   (flap cycling, marquees) are exempt but must expose a static settled state
   (e.g. `data-settled`) and a reduced-motion branch.
6. **`AnimatePresence` is banned at route boundaries** (FrozenRouter trap). Motion
   (`motion/react`) is for in-page micro-interactions only. Route transitions: View
   Transitions API / next-transition-router per doc 07 D3.
7. **Media never lands in the repo**: >5MB files in `public/` are rejected; heavy media
   goes to R2 (`NEXT_PUBLIC_MEDIA_BASE`). Git LFS does not work on GitHub Pages.
8. **Banned dependencies** (doc 07 D10): anime.js, Theatre.js, curtains.js, hamo,
   ScrollSmoother (Lenis owns smoothing), dotlottie-web, barba/taxi, deck.gl GlobeView,
   Mapbox GL v2+/Google 3D Tiles/Cesium ion (key economics), audioMotion-analyzer
   (AGPL), pokemon-cards-css (GPL — reimplement), any "gsap plugins unlocked" mirror,
   any font ripped from a transit authority (Johnston/Rail Alphabet/etc.).
9. **Accessibility floor:** decorative layers `aria-hidden`; the document must read
   cleanly with all decoration stripped; images get place-specific alt (required prop);
   status = color + word + shape, never color alone; axe serious/critical = 0.
10. **React is pinned exact** (R3F reconciler coupling). Do not widen to `^`.

## Conventions

- Conventional commits with metro scopes: `feat(station)`, `feat(ticket)`,
  `feat(ride)`, `feat(globe)`, `feat(place)`, `feat(media)`, `feat(foundation)`,
  `chore(ci)`, `docs(design)`.
- Station codes (`A03`) are the deterministic IDs: use them in slugs, test IDs, and
  screenshot names.
- Copy follows the two-register voice (doc 12): system voice for chrome, first person
  for journal content. Never mixed in one string.
- New architectural decisions get a one-page MADR in `docs/adr/`.
