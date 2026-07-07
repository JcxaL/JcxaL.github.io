# 07 — Technical Architecture (Decision Records)

The verified tech decisions for the Metro Museum. Every claim below was fact-checked
against primary sources (repo LICENSE files, npm registries, official docs, caniuse) on
2026-07-07 by the round-2 research fleet; corrections to popular-but-wrong claims are
flagged. Format: **Decision → why → the rejected alternatives**.

---

## D1 — One persistent WebGL canvas; navigation is camera choreography

**Decision:** Mount a single R3F `<Canvas>` in the root layout (fixed, behind
`{children}`, never unmounts). Station intro, train ride, and globe hero are branches of
one scene graph keyed off `usePathname()`. Place pages are DOM/MDX overlays whose 3D
garnish portals into the same canvas (drei `<View>` / tunnel-rat, ~1KB). Route changes
move the camera; they never recreate the GL context.

- This is the architecture behind the smoothest site of the current era — **Igloo Inc,
  Awwwards Site of the Year 2024 + Developer Site of the Year**: one scene, camera-flight
  navigation, shader stings instead of page loads, URL state mapping to camera targets.
- Pattern source: `pmndrs/react-three-next` (2.8k★, active 2026) — copy the architecture
  into our TS setup, don't adopt the template.
- **WebGL context budget = 2, total** (R3F world + MapLibre on map routes). Safari kills
  the oldest context beyond its cap; drei `<View>` slices one canvas into all the train
  windows. Handle `webglcontextlost` with preventDefault + rebuild — and test it in CI.
- 2.5D future-proofing falls out of this for free: scene layers are textured planes at
  real Z depths in front of a real camera; any plane can be swapped for a glTF mesh with
  zero choreography changes (the owner's requirement).

## D2 — Motion stack: Lenis + GSAP master clock + Motion for micro

| Role | Library | Verified status |
|---|---|---|
| Smooth scroll | **Lenis 1.3** (~5KB, MIT, 14.3k★, v1.3.25 Jun 2026) | wraps native scroll; keeps sticky/anchors/a11y |
| Choreography master | **GSAP 3.15 + ScrollTrigger** (+SplitText, MotionPath, DrawSVG) | **100% free incl. all former Club plugins since Apr 29 2025** (Webflow acquisition) — verified at gsap.com/pricing + blog/3-13. Custom "Standard License", NOT MIT → record in ADR |
| React micro-interactions & presence | **Motion** (`motion/react`, MIT, 32.7k★) | migrate the installed `framer-motion` import — same API |
| Cinematic post | **@react-three/postprocessing** (Zlib, v6.39.2 Jun 2026) | bloom/vignette/aberration for the intro |

**The single-rAF rule (the actual secret of "buttery"):** one clock drives everything —
`gsap.ticker.add(t => lenis.raf(t*1000))`, Lenis `scroll` event → `ScrollTrigger.update()`,
ScrollTrigger/timeline callbacks → R3F `invalidate()` (frameloop `demand`). Two
independent rAF loops is where one-frame scroll/WebGL jank comes from. (Tempus is the
packaged version of this pattern; `gsap.ticker` does it without a new dep. Study
`darkroomengineering/satus` for the full wiring.)

**Rejected (verified reasons):** anime.js v4 (excellent, but ~90% GSAP overlap);
**Theatre.js** (no public commit since Apr 11 2024 — dormant, confirmed);
curtains.js (dormant, author moved to WebGPU); ScrollSmoother (Lenis wins; never run
both); **dotlottie-web** (~700KB gz WASM vs 60KB lottie-web — confirmed via LottieFiles'
own discussion #514); lottie-web for core interactions (coasting; fine for flourishes);
Rive = optional for the ticket only (runtimes MIT confirmed; Oct 2025 pricing change is
editor-only).

## D3 — Page transitions: View Transitions API first, GSAP set-pieces second

**Decision:** three strictly-separated tiers.

1. **WebGL tier** owns the metaphor: camera flights + shader stings (tunnel whoosh,
   light-streak pass) on the persistent canvas.
2. **DOM tier**: same-document **View Transitions API** — now genuinely cross-browser
   (**Chrome 111+ / Safari 18+ / Firefox 144+**, verified via caniuse; the "Chromium-only"
   caveat applies only to cross-document transitions, which this architecture never
   performs — after first load every navigation is same-document). On Next 15 use
   `next-view-transitions` (shuding, MIT, ~2KB); migrate to React's native
   `<ViewTransition>` + `Link transitionTypes` when we take Next 16.
   Shared-element morph: train-window poster → place-page hero (`view-transition-name`).
   Transition types encode the metaphor: `board`, `arrive`, `return`, `depart`.
   Official timing recipe: exit 150ms ease-in → enter 210ms ease-out, 60px directional
   offset; persistent chrome (ticket HUD) gets `animation:none`.
3. **Set-piece tier**: `next-transition-router` (MIT, ~2KB, active) for the 2–3 cinematic
   takeovers where VT snapshots are too limiting (station→train boarding) — GSAP `leave`
   timeline blocks navigation ≤400ms while prefetching the target.

**Banned:** `AnimatePresence` at the route boundary (App Router unmounts pages before
exit variants run; the FrozenRouter workaround depends on unexposed Next internals —
verified unresolved in motion #2411 / next #49279). Motion stays welcome *inside* pages.
**Banned:** barba.js/taxi.js in the Next app (DOM swaps behind React's back corrupt
hydration; barba core dormant since Dec 2024) — steal their leave/enter vocabulary only.

**Prefetch:** Next `<Link>` auto-prefetch works on static export but has known 404 bug
classes (vercel/next.js #92341, #85374) — CI crawls the built `out/` and fails on any
404'd `_next/*.txt`. Real payloads to warm are 3D/media: `useGLTF.preload` during the
ticket moment, pointerenter warmup on windows, `requestIdleCallback` for globe textures.
One conservative Speculation-Rules prerender script for hard-link entry points.

## D4 — Globe: MapLibre GL JS v5 is the one-engine zoom ladder

**Decision:** **MapLibre GL JS v5** (BSD-3, v5.24.0 Apr 2026, ~274KB gz — loaded only on
map routes) renders the summary globe AND every per-place themed map. Verified: v5
supports **zoom-interpolated `projection`** (`vertical-perspective` → `mercator`
morph), terrain + three.js custom layers under globe projection. The globe→map→place
zoom becomes **one `flyTo` in one renderer — no handoff seam**, which is the only way to
fully satisfy "silky zoom in/out" on a static site.

- **LOD ladder as design tokens** (zoom stops in one config): z0–3 dotted globe +
  animated great-circle arcs (trips as "lines"); z3–7 arcs fade, labeled pins in; z7+
  the city's themed vector style takes over; final band = route transition into the
  place page. Opacity ramps via zoom-interpolated paint properties (GPU, zero JS/frame).
  Hide representation swaps inside camera motion, never at rest.
- **Tiles, keyless (the economics decide):** OpenFreeMap primary (verified: no keys, no
  caps, donation-funded, no SLA) + **self-hosted PMTiles extracts on R2** as resilience:
  z0–6 world ≈ 60MB, per-city capped-zoom extracts a few MB each; range requests mean
  visitors fetch KBs, not the file. ODbL attribution required.
- **Feel:** inertial damping + versor-style drag; idle auto-rotation pausing on pointer;
  GSAP can drive `jumpTo` per-frame for transition-synced choreography.
- Decorative mini-globes (ticket back, flourishes): **cobe v2** (5KB, MIT, v2 Mar 2026
  verified — no zoom-to-detail, which is fine for decoration).
- **Fallback ladder** (forceable via query param for CI): full globe → DPR-reduced,
  no-terrain → D3 orthographic canvas (~30KB) → build-time pre-rendered globe image
  (Stripe doctrine — verified: both the GitHub and Stripe reference globes are now
  retired from production; the write-ups are doctrine, not live sites).

**Rejected (verified):** Google Photorealistic 3D Tiles (Enterprise SKU ~$6/1k root-tile
requests, 1k free/month — structurally disqualified: a static site can't hide keys);
CesiumJS (weight + ion gravity); deck.gl GlobeView (officially experimental, no
pitch/bearing); globe.gl as primary (raster tiles on a sphere never reach vector
crispness at city zoom; `three-globe` remains an option *inside* our canvas if the art
direction demands a stylized museum-exhibit globe, accepting a z≈6–8 crossfade handoff).

## D5 — Scene craft: windows, parallax, depth

- **Train windows = three-tier progressive enhancement**, each screenshot-testable:
  (1) DOM tier — clip-path/mask window frames over a translated scenery strip with real
  `<a>` links (SEO/keyboard/no-JS truth); (2) GSAP tier — pinned carriage with
  `containerAnimation` per-window triggers; (3) WebGL tier — drei `MeshPortalMaterial`
  portals sharing the one canvas.
- **Ride model:** position-along-path `t∈[0,1]` with per-segment easing (slow out of the
  station, cruise, slow in) — the Mini Tokyo 3D animation model (MIT, 4.1k★, verified
  active) — scrubbed by ScrollTrigger; ride state persists in a client store so "return
  to train" resumes at the same window.
- **Depth-map photo parallax is the signature-per-effort winner:** run **Depth Anything
  V2 Small** (verified **Apache-2.0**; Base/Large are CC-BY-NC — do not use those) at
  build time to give every travel photo a depth map (~10KB), then a ~30-line
  fake3d-style displacement shader makes every place-page hero respond to mouse/gyro.
  Nothing else makes personal photos feel this custom.
- **Scroll-scrubbed media rules:** short intro beats (2–4s) → canvas image sequence
  (deterministic, cross-browser); longer passages → **video with keyframe-dense encoding**
  (`-g` low / all-intra for the hero) + lerped `currentTime` — never raw currentTime from
  scroll events, never default-encoded MP4 (sparse keyframes = choppy seeks; the
  keyframe-density principle verified, exact per-browser numbers from the folk articles
  did not survive fact-check). scrolly-video's WebCodecs mode is Chrome-only (verified) —
  treat as enhancement.
- **Image-sequence memory math (the hidden mobile killer):** a decoded 1600×900 frame
  ≈ 5.5MB RAM; 120 frames ≈ 660MB = iOS crash. Keep compressed blobs, decode a ±20-frame
  LRU window via `createImageBitmap`, serve smaller mobile frame sets, zero canvas
  dimensions on unmount.
- **Atmosphere** (rain-on-glass, tunnel streaks, fog) = fragment-shader overlays, not
  particle systems; they carry meaning (the actual weather/time of the visit) and pause
  off-screen.
- **iOS gyro:** `DeviceOrientationEvent.requestPermission()` must be called from a user
  gesture over HTTPS (verified) — the ticket-punch tap IS the gesture. Mouse fallback
  always.

## D6 — Media & hosting: Pages is the app shell; R2 is the museum vault

Verified constraints: GitHub Pages = 1GB site, 100GB/month **soft bandwidth** (~95
media-rich visits/day at ~35MB/visit before throttling), 100MB/file Git limit, **Git LFS
is not served by Pages** ("cannot be used" — official docs), Cache-Control fixed at
`max-age=600` (empirically confirmed on the live site).

**Decision:**

1. **Cloudflare free zone on `jccl.me`** (CNAME already in repo): orange-cloud proxy +
   Cache Rules — `/_next/static/*` → edge+browser TTL 1 year (content-hashed), HTML →
   short TTL; SSL Full (strict); purge HTML on deploy. This single ops change fixes the
   10-minute revalidation that would undermine every "buttery repeat visit" goal.
2. **Cloudflare R2 bucket as `media.jccl.me`** (verified free tier: 10GB storage, **zero
   egress fees**): all window loops, photo sets, PMTiles, audio. Define
   `NEXT_PUBLIC_MEDIA_BASE` **before the first place page** — retrofitting URLs later
   touches every MDX file. Upload via `rclone sync` in CI.
3. **Two-tier asset policy, CI-enforced:** `/public` ≤ ~50MB (fonts, UI sprites, posters);
   pre-commit/CI guard rejects >5MB files in `public/`; `du -sb out/` budget assertion.
4. **Encoding spec** (deterministic scripts the agent runs): ambient window loops =
   720p/24fps/8s, AV1 (`libsvtav1 -crf 42`) + H.264 fallback (`-crf 23 -preset slow
   -movflags +faststart`, `yuv420p`, muted+playsinline) ≈ 1–3MB each; poster AVIF ~30–50KB,
   `preload="none"`, IntersectionObserver init, no autoload under reduced-motion.
   Photos: sharp → AVIF/WebP srcsets + **ThumbHash** placeholders (build-time data-URLs)
   → typed `<Pic>` component from a media manifest JSON.
5. **Two-tier video rule:** ambient loops (<15s, muted) self-hosted on R2; narrative
   videos (>60s, sound) = YouTube behind `lite-youtube-embed` facade (Apache-2.0, active)
   with a custom R2 poster — never an embed as ambient texture.

## D7 — Transit typography: the $0 legally-clean stack

Every real metro typeface is closed (Johnston100 = TfL-exclusive; Rail Alphabet =
commercial; NYC's Helvetica = commercial; free "Tube font" sites are unlicensed rips).
**Decision — all OFL, self-hosted WOFF2, subset with pyftsubset:**

- **Overpass** (US Highway Gothic DNA; + Overpass Mono) — station-sign chrome & telemetry
- **Hanken Grotesk** or **Public Sans** — reading text
- **Hammersmith One** — optional Johnston-flavored display one-off (London register)
- **Doto** (variable dot-matrix, OFL, on Google Fonts) — departure boards; its
  wght/ROND axes give the "LEDs warming up" reveal for near-zero bytes; animate axes only
  on one-line moments (per-frame re-rasterization — not GPU composited)
- Split-flap boards: **vendor a ~150-line component** (ecosystem is hobby-scale/dormant;
  react-split-flap-effect won't even install under React 19). Flap motion =
  transform-only rotateX; settled text mirrored to `aria-label`, flapping cells
  `aria-hidden`, announce via `aria-live="polite"` after settling.
- Register discipline: Solari flaps = hall surfaces; dot-matrix = platform strips; enamel
  grotesque = wayfinding. One register per surface — mixing them is what reads as pastiche.
- Design-token sources: the 1970 NYCTA Standards Manual (archive.org) and TfL's standards
  PDFs — transcribe grids/lockups/line-color logic into Tailwind `@theme` tokens; their
  marks (roundel, bullets) are trademarks — build original equivalents.

## D8 — Audio: ship silent, architected now

- Site-wide bus = **~200 lines of raw Web Audio** (matches the blueprint's committed
  manager shape; exposes AnalyserNode cleanly). Tone.js (verified active — npm is ground
  truth; its GitHub releases page is stale) only inside the code-split `/music` route.
  Howler is maintenance-mode (last ship 2023) — usable shortcut, not preferred.
- **Do the iOS unlock now:** resume AudioContext on the ticket-punch pointerdown
  (+keydown fallback) — 10 lines, kills the future gesture-race.
- Scenes emit events from day one (door-open, punch, tunnel-enter, station-arrive) plus a
  normalized velocity stream; sound lands later without touching animation code. GSAP is
  audio's clock on the ride (params via `setTargetAtTime`); Tone.Transport never leaves
  the music route.
- Codecs: Opus WebM 64–96kbps + AAC fallback (Safari <18.4 constraint). One 50–90KB UI
  sprite preloaded during the intro keeps ticket-punch ≤800ms. Mute = three states
  (null/on/off), storage-event sync, suspend on visibilitychange.
- **audioMotion-analyzer is AGPL — banned**; a DIY analyser + canvas styled as a
  departure board is ~50 lines and fits the theme better.

## D9 — The ticket component

- Anatomy = Apple Wallet boarding-pass slots (header/primary/secondary/auxiliary);
  die-cut notches via CSS radial-gradient masks; itinerary ordered by travel sequence.
- Drag-to-commit: threshold >60% travel OR flick velocity; spring snap-back below;
  rubber-band at bounds; irreversible-looking result (punch/tear). Motion's built-in
  drag covers it; `@use-gesture` only if pinch arrives later.
- **Accessibility = a range input under the hood** (Jhey tear-strip pattern): arrow keys
  tear the ticket, AT gets a labeled slider, reduced-motion gets crossfade + text.
- Holographic sheen: **re-implement with Motion values — `pokemon-cards-css` is GPL-3.0**
  (verified); do not copy code.
- After validation the ticket persists as the site menu + progress HUD (hole punches per
  visited stop).

## D10 — Explicitly rejected / banned list (for the agent's guardrails)

`anime.js`, `Theatre.js`, `curtains.js`, `hamo`, `ScrollSmoother` (with Lenis),
`dotlottie-web`, `barba.js`/`taxi.js` (in the Next app), `AnimatePresence` at route
boundaries, `deck.gl GlobeView`, Google 3D Tiles / Cesium ion / Mapbox GL v2+ (token
economics), Git LFS for media, `audioMotion-analyzer` (AGPL), `pokemon-cards-css` (GPL),
"gsap-plugins-unlocked" mirrors (license-violating), Johnston/Rail Alphabet webfonts,
auto-rotating hero carousels, scroll hijacking.
