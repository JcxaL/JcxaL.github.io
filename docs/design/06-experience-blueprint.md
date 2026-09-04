# 06 — Experience Blueprint: The Metro Museum

The product concept for the whole-site rebuild. The site is **an interactive museum you
enter through the Metro**: the homepage is a station, your ticket is the index of visited
places, the train ride is the navigation, each city is an exhibit, and the globe is the
atlas at the terminus.

Decisions this blueprint encodes (confirmed with the owner, 2026-07-07):

- **Scope**: whole-site entry — the homepage IS the station.
- **Art direction**: 2.5D layered illustration engineered to read as 3D; architecture must
  accept true 3D assets later without re-choreography.
- **Devices**: desktop-first cinematic; mobile gets a designed, simplified version of the
  same story (mobile is a major entry point — it must feel intentional, not degraded).
- **Content**: scattered today → strict per-place template, filled progressively.

---

## 1. The journey (scene by scene)

### Scene 0 — Arrival *(boot sequence = preloader)*

A dark platform. A headlight grows in the tunnel. The train arrives with light streaks
and a rush of air; doors open with the chime (silent by default; sound is a later phase).

- **Job**: mask asset loading with narrative. While the train "arrives", the ticket scene
  and first ride assets preload. The intro *is* the loading bar — anticipation instead of
  a spinner (award-validated preloader pattern, docs 01/04).
- Duration ≤ 4s, **skippable from frame one** ("Skip to concourse"), and **returning
  visitors skip automatically** (localStorage) to a fast "doors open" cut — never replay
  an intro at someone (research: returning-visitor etiquette).
- Reduced motion: a still platform scene, doors already open, one cross-fade.

### Scene 1 — The Ticket *(the unlock)*

At the gate, the visitor holds a ticket — a 2.5D card that tilts with the mouse/gyro,
with foil sheen and embossed type. The ticket is real content, not a prop:

- Face: the traveler's line diagram — visited cities as **stops on a metro line**
  (Beck-style diagram), issue date, a stamp count ("12 stations · 4 under construction").
- **Interaction**: drag the ticket into the gate slot (drag-to-commit ≈ 60% travel then
  it "takes over": snap, punch sound-slot, gate opens, you board). Keyboard/AT fallback:
  a plain "Insert ticket →" button with the same result. Mobile: tap to punch.
- The punched ticket persists as a UI object — it becomes the **site menu** (open the
  ticket = see all stops/lines) and remembers which stops you've visited this session
  (hole punches).

### Scene 2 — The Ride *(primary navigation)*

Interior of a train car rendered in layered depth. **Scroll = the train moves.**

- Through the windows, region scenery flows past in true multiplane parallax (near posts
  fast and blurred, mid scenery at speed, far skyline slow — depth cues: speed
  differential, scale, atmospheric haze, DOF).
- **Windows are portals**: each window frames one destination as an exhibit poster
  (city name in transit-signage type + one image + status lamp). Click/tap a window →
  the camera moves *through* it into the place page (shared-element transition).
- Between window clusters: **tunnels** — dark beats with light streaks that give rhythm,
  hide asset swaps between regions, and make the ride feel edited rather than uniform.
- A **line diagram progress rail** (the metro line with stop dots) is pinned at the
  bottom: it is simultaneously progress indicator, current-position marker, and jump
  navigation (click a stop = express to that window). This is the sticky-locator-rail
  pattern (doc 04 §2.2) wearing transit skin.
- Regions = line segments; transferring between regions is announced like a service
  change ("Transfer: East Asia Line").
- Scroll is **native and 1:1** (doc 04 §1 laws apply in full — no hijacking; the ride is
  a scroll-driven pinned scene, interruptible anywhere).

### Scene 3 — The Exhibits *(place pages)*

Each city is an exhibit room. The guide-page anatomy from doc 02 §6 wearing the metro
identity:

1. **Station-sign header** — city name set like platform signage (roundel/plate),
   coordinates + dates in the telemetry voice, status lamp.
2. **Fast-facts strip** — HUD chips (dates, duration, route, season, cost band).
3. **Themed map animation** — each city gets a custom-styled MapLibre map (its own
   duotone derived from that city's palette) with an animated route line; the map is a
   first-class exhibit, not an embed.
4. **Media wall** — photos/videos in a museum-hang grid (mixed sizes, captions as
   placards), lazy, LQIP placeholders.
5. **Narrative + typed timeline blocks** (travel-leg / stay / sight / food).
6. **Platform-edge footer** — "Next station →" / "← Previous station" + "Back to the
   line" (returns to the ride at this window, camera state preserved).

### Scene 4 — The Globe *(terminus / atlas)*

The concourse of the museum: a **rotating globe** carrying every visited place.

- Visited stops glow with arcs connecting them in trip order ("lines" on the planet);
  Planning stops are dashed/hollow (doc 02 §3 grammar).
- **Zoom is the star**: silky inertial zoom from planet → region → city, handing off
  from globe to the city's themed map at close zoom (the LOD ladder — globe → map →
  exhibit). Zoom out re-aggregates. Target: no visible seam at the handoff.
- Stats strip: `12 stations · 4 lines · 23,400 km` (plain-language telemetry).
- Two modes (doc 01, Hidden Worlds): **Tour** (auto-ride the whole network, camera
  swooping stop to stop) and **Explore** (free orbit/zoom).

### Cross-cutting: the site as museum

- Nav chrome everywhere = **transit wayfinding**: the ticket (menu), the line diagram
  (where am I), departures-board index page (split-flap destination list — also the
  sitemap and the SEO-friendly plain HTML index).
- Future sections (Design / Music / About) are **new lines** on the same network — the
  IA scales by adding lines, not by redesigning.
- Every scene lands on practical links (Travel Oregon rule): the spectacle always opens
  doors, never dead-ends.

---

## 2. Art direction: 2.5D engineered to read as 3D

The look: **transit poster × multiplane camera** — flat, art-directed layers arranged in
real 3D space, lit and photographed like a set. Not "flat with offset scrolling."

What makes 2.5D read as 3D (the checklist every scene must pass):

| Cue | Implementation |
|---|---|
| True perspective | Layers are textured planes at real Z depths in front of a real camera (not translate-Y offsets) — camera dollies/pans produce correct parallax automatically |
| Occlusion | Foreground silhouettes (pillars, window frames, passengers) overlapping midground |
| Atmospheric depth | Far layers desaturated + hazed (fog), near layers contrasty |
| Depth of field | Subtle blur on near-fast and far-slow layers; focus plane on the subject |
| Light | Animated light (headlight sweep, tunnel strobes, window light patches sliding across the car interior) — light in motion sells 3D harder than geometry |
| Micro-parallax | Mouse/gyro adds ±2° camera drift on top of scroll — the scene feels volumetric at rest |
| Scale discipline | Consistent perspective grid across layers (author layers against a camera rig template) |

**Future-proofing (the owner's requirement):** scenes are data, not markup —
`scene = { camera rig, layers: [{ asset, z, size, material, motion }] }` rendered by a
scene runtime (Three.js/R3F planes). Because the camera, choreography, and scene graph
are already 3D, any layer can be **individually replaced by a glTF mesh later** (the
train exterior, a station clock) with zero changes to composition or scroll mapping.
Prototyping true-3D moments is allowed and encouraged where they're cheap (e.g. the
ticket as a real 3D card is nearly free).

Palette/type: the round-1 system holds (docs 03) — dark ground, phosphor accent, status
colors as data, three-voice typography — with one addition: **transit signage** becomes
the display voice's context (platform signs, line numbers, roundels), and the telemetry
voice gets departure-board numerals.

---

## 3. Mobile: the designed simplification

Same story, lighter staging — a "local service" rather than a broken express:

- **Arrival**: single-layer platform scene + doors-open transition (no multiplane).
- **Ticket**: full-screen card, tap to punch (the tactile moment survives as haptics-like
  animation), same content.
- **Ride**: the car interior becomes a **vertical carriage** — windows stack as
  full-width portals with 2-layer parallax each; the line-diagram rail stays pinned
  (it's even more valuable on mobile). Horizontal swipe inside a window browses that
  region's stops.
- **Exhibits**: identical template (it's already mobile-first content).
- **Globe**: lower dot density, no post-processing, tour mode default (guided beats
  free-orbit on touch), or a static hero + region list on weak GPUs (capability-gated,
  Flightradar24-style honest gating).
- One media budget rule: mobile never downloads desktop scene textures (responsive
  texture sets, `srcset` for scene layers too).

---

## 4. The per-place content template (fill progressively)

Strict schema so scattered content converges (Out of Eden's milestone discipline). Per
city, the checklist:

| Asset | Spec | Required for launch? |
|---|---|---|
| Hero image | 1 wide shot, graded to city palette | yes |
| Photos | 6–12, captioned (placards) | ≥4 |
| Video | 0–2 clips ≤30s, muted loops, poster frames | no |
| Window poster | 1 image art-directed for the train window crop | yes |
| Route | ordered coords for the themed map line | yes |
| Facts | dates, duration, km, season, cost band | yes |
| One human moment | 1 short first-person paragraph | yes |
| Quote | one line, pull-quote treatment | no |
| Sounds | ambient loop (later phase) | no |
| Radar | gear/budget/mood/tracks (existing schema) | no |

Cities without full content ship as **"Under construction" stations** — visible on the
line with tape-and-cones styling (honest, on-theme, and motivating) rather than hidden.

---

## 5. Sound design (later phase — architecture now)

Decided: ship silent first, but the audio bus is designed now so sound can be added
without rework: a single audio manager (mute default, visible toggle, localStorage
persistence), event hooks already emitted by scenes (door-open, punch, tunnel-enter,
station-arrive), per-city ambient slots in the content schema. Round-2 research covers
the runtime choice.

---

## 6. What "surprising on first click" means here (acceptance criteria)

1. First paint < 1.5s: the platform scene's first frame is a static image (LCP asset),
   animation layers hydrate behind it.
2. The intro masks 100% of ticket-scene loading; the ticket masks the first ride region.
   **No spinner exists anywhere in the experience.**
3. Scroll input during any choreography is never locked out (interruptible timelines).
4. The ticket-punch moment: from drag-release to doors-open ≤ 800ms, 60fps.
5. A returning visitor reaches the ride in ≤ 2s from load.
6. Reduced-motion visitors get a complete, elegant, static-composed journey — not an
   apology.
