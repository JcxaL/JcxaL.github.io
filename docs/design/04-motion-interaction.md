# 04 — Motion & Interaction

Scroll choreography, the flight-path recipe, map/globe technique, and the motion-safety
policy. The stack constraint throughout: static-export Next.js 15 on GitHub Pages — all
of this is client-side (CSS scroll-driven animations, IntersectionObserver, MapLibre GL,
Framer Motion/GSAP already installed).

---

## 1. The laws of scroll choreography

From NN/g's scrolljacking research + the jury evidence (Persepolis' 9.60/10 animation
sub-score vs the genre's failures):

1. **Scroll-driven, never scroll-jacked.** Animation progress maps 1:1 to native scroll
   position (CSS `animation-timeline: scroll()/view()` or IntersectionObserver + rAF).
   Never intercept wheel events, change scroll speed, or take over direction —
   disorientation was near-universal in NN/g testing.
2. **One continuous, interruptible timeline** beats stacked one-shot effects. Chaptered,
   with a persistent progress rail and a skip link (Persepolis' pattern; its jury scored
   the *continuity of easing*).
3. **Text never animates while being read.** Keep reading text outside animated regions;
   pinned graphics animate beside static text ("text + altered scrolling" produced NN/g's
   worst outcomes).
4. **Interleave**: kinetic sections alternate with conventionally scrolling prose;
   full-bleed media panel → quiet text interlude, never two dense sections adjacent
   (Reverie Safaris' award-credited "elegant pacing").
5. **Skip the effect on mobile** — small screens + touch amplify disorientation; serve the
   static composition (hero frame + SVG route line).
6. Every cinematic moment must **land on a practical link** (Travel Oregon's rule) —
   spectacle that dead-ends is wasted.

## 2. The flight-path recipe (the signature move)

The site's "flight path" transition has four award-proven variants — build them as one
system on the Mapbox storytelling architecture (JSON chapters + IntersectionObserver,
ported to MapLibre):

**Chapter model** — every section carries a camera pose:

```js
{ id, title, location: { center, zoom, pitch, bearing }, onChapterEnter, onChapterExit }
```

- Define **both enter AND exit** states or reverse-scrolling breaks the story.
- Vary pitch (30–60°) and bearing per chapter — identical angles make even flyTo feel
  static.
- Use `flyTo` with a **high `curve`** value: the zoom-out → great-circle arc → zoom-in
  "swoop" is what reads as flight (Google Earth Voyager's signature move).

**The four patterns** (from the awarded editorial corpus):

1. **Route-spine scroller** (NYT Silk Road) — scroll progress = distance along the trip
   polyline (`turf.along`), route drawn progressively, media docked at waypoints.
2. **Sticky locator rail** (NYT Russia Left Behind) — thin fixed mini-map, marker synced
   to reading position, dots double as section nav. Cheapest, works on every guide page.
3. **Tilted flyover** (WaPo Borderline) — pitch ≈ 60°, fog on to hide tile LOD seams,
   chained `easeTo` along the route, inset locator map always present, ambient context
   labels (distance to next stop, heading) as free HUD flavor.
4. **Zoom-ladder** (NYT Greenland) — camera zoom as narrative scale: globe → region →
   place → detail, each zoom band a content tier.

**Waypoint captions fire on geography, not pixels** (Persepolis): trigger at route
distances / chapter boundaries, with numbered chapters (`03 / 07`) in mono digits.

## 3. Route & arc animation

- Great-circle arcs always — `turf.greatCircle` (flat) or `d3.geoInterpolate` (globe);
  straight intercontinental lines read as wrong (FlightConnections).
- Draw-on animation: slice the LineString per rAF frame (`turf.along`), or the cheaper GPU
  route — `line-gradient` keyed to `line-progress` with an animated stop (requires
  `lineMetrics: true` on the source).
- **Arcs have a lifecycle** (GitHub globe): spawn → draw toward destination → dwell → fade.
  A stream, not static spaghetti. Dim inactive routes to ~20%.
- Status line grammar: solid = visited, dashed (`line-dasharray: [2,2]`) = planned
  (Flightradar24's flown/remaining convention).
- The **trip replay** camera tour — chained flyTo step-to-step along the route
  (Polarsteps' most-loved feature) — is the cinematic payoff feature.

## 4. Globe vs flat map

- Globes win: intercontinental drama, arc theater, the "personal planet" hero moment.
  Flat maps win: dense regional browsing, mobile ergonomics, label legibility.
- MapLibre GL v5 `projection: 'globe'` auto-morphs to mercator on zoom-in — **one library
  covers both**: globe at world zoom (hero/index), flat at region zoom (browsing).
- Heavy 3D is opt-in behind an explicit toggle with a capability check (Flightradar24's
  honest gating).
- Dotted hero-globe option (Stripe): sunflower-spiral dot distribution
  (`phi = acos(-1 + 2i/N)`), visited/planned countries' dots brighter, semi-transparent
  ocean sphere for depth.

## 5. Micro-interaction budget

Winners repeat **one signature micro-interaction** rather than many (Niarra's single
hover-mask; Chartogne-Taillet's dot-line motif; Eurostar's Spark morphing across loader/
wayfinding/frames):

- Pick ONE card hover — lift + image scale 1.03–1.05, 300–400ms ease-out (the Airbnb
  card standard) — and use it everywhere.
- Pick ONE transition motif — the dotted flight line / waypoint diamond — and reuse it as
  loader, section divider, list bullet, and map marker (the Spark strategy).
- Marker hover: scale + label reveal (~150ms), not just recolor (Umami Land).
- Status change: one celebratory micro-animation (badge flip / stamp-in) — tiny rewards
  make journaling addictive (Airbnb's heart burst).
- Named motion tokens with fixed duration/easing — `flight-path`, `hud-boot`, `stamp-in` —
  defined once beside the color tokens (Backpack keeps animation values in the token
  layer; Airbnb DLS treats motion as a brand principle).
- A 2-second skippable intro (animated glyph + coordinates readout, once per session) sets
  cinematic tone cheaply (Treasures of Japan); KAYAK's scan animation proves users enjoy
  watching a "boot sequence" — but keep it under 2s and skippable.
- Ambient life comes from ONE animated layer: subtle pulse at visited points, or a slow
  auto-rotating hero globe that pauses on interaction (Windy's particles, GitHub's idle
  rotation). Not several.

## 6. Reduced motion (non-negotiable)

Flight-path pans, globe spins, parallax, and large zooms are all in the documented
vestibular-trigger classes (Smashing/Val Head; WCAG technique C39).

- **No-motion-first authoring**: base styles are motionless; animation is added inside
  `@media (prefers-reduced-motion: no-preference)` — motion as progressive enhancement,
  nothing to strip out later.
- Under reduce: `flyTo` → `jumpTo` (MapLibre already downgrades non-`essential`
  animations — never mark decorative flights `essential: true`); route draw-on → static
  drawn route; parallax → cross-fade; marker pulse → static halo; scroll scenes hard-cut
  between camera poses.
- Reduced motion ≠ no motion: keep opacity cross-fades so state changes stay perceivable.
- Ship a **visible motion toggle** in the site chrome, persisted to localStorage — on a
  deliberately kinetic site an in-page control is warranted beyond the OS setting.
  (Framer Motion: `useReducedMotion()` / `MotionConfig reducedMotion="user"`.)
- The existing global reduced-motion kill-switch in `globals.css` is a good backstop but
  too blunt as the only mechanism — it nukes all transitions to 0.01ms including
  perceivability cross-fades. Move toward per-pattern fallbacks.

## 7. Sound (if ever)

Optional, always. Custom scores appear across FWA winners (iFly 50, Night Walk's binaural
audio) but always with visible mute, default-off ambient, an upfront "sound optional"
line, and headphone prompts as a designed moment. Tie SFX to route transitions only.

## 8. Performance engineering

- **Lazy-init everything**: MapLibre behind `next/dynamic({ ssr:false })` + an
  IntersectionObserver so the ~230KB-gzip bundle and style JSON fetch only when the map
  nears the viewport; a **pre-rendered static map image** is the placeholder, the no-JS
  fallback, and the SEO content in one.
- Feature-detect WebGL (attempt context creation); no WebGL → static image + the HTML
  list. Stripe's doc-policy: *"if 60fps cannot be met, ship the static image."*
- Adaptive quality tiers (GitHub globe): FPS monitor; under ~55fps over 50 frames,
  degrade in order — devicePixelRatio cap → raycast frequency → geometry. Antialias off
  from the start; pause rAF when the tab is hidden or during scroll (Stripe).
- Hero budget (web.dev): LCP ≤ 2.5s; hero ≤ ~200KB as a priority `<img>`
  (`fetchpriority=high`, never lazy); AVIF/WebP srcsets + blur-up placeholders
  **pre-generated at build time and committed** (GitHub Pages has no image service);
  explicit dimensions everywhere (zero CLS); everything below the fold lazy.
- Render continuous animation to canvas/WebGL, keep text in DOM (Greenland's 60fps
  approach — MapLibre gives this free). Never animate layout properties on scroll.
- Media rules: video muted/autoplay/playsinline/loop with poster fallbacks; lazy-init at
  chapter boundaries (the 2012 Snow Fall trick that still defines perceived performance).
- Serialize map camera + active filters into the **URL hash** (Windy) — shareable views,
  sane back button, zero server.
