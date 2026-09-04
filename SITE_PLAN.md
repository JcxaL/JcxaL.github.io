# JcxaL Website Activation Plan

Central reference for the upcoming redesign/rebuild of `jcxal.github.io`. This document tracks intent, content architecture, and implementation requirements so the work stays cohesive while the visual language becomes more ambitious.

---

## 1. Project North Star
- **Purpose**: elevate the personal site from a static hub into an immersive, animated journey through Design, Music, Travel, and About facets.
- **Tone**: cinematic, kinetic, interface-heavy. Think sci-fi control room meets travel journal—bold but readable.
- **Experience Pillars**
  - Narrative scroll: the homepage should feel like a guided tour (camera rig exploding into parts, plane taking off, etc.) instead of isolated hero sections.
  - Seamless parallax + micro-interactions: continuous motion, depth, and tactile feedback on every scroll span.
  - Content depth: each section needs authentic material (copy, media, guides, showcases) surfaced through custom tooling, not generic cards.

---

## 2. Global Architecture
- **Framework**: keep Next.js 15 App Router + TypeScript + Tailwind 4. Add Framer Motion/GSAP scene controllers and Three.js/WebGL layers where needed.
- **Content System**
  - Continue using MDX for rich copy/guide authoring, but organize by domain (`src/content/{travel, design, music, about}`).
  - Store structured metadata in frontmatter (e.g., map coords, gear used, BPM, moods). Create TypeScript schemas/helpers per category.
  - Introduce lightweight JSON or YAML registries when content must stay machine-readable (e.g., travel waypoints, instrument presets).
- **Data Access**
  - Expand `src/lib/mdx.ts` into modular content services, one per domain (e.g., `getTravelDestinations`, `getMusicShowcases`).
  - Build caching + `async` file reads to prep for ISR/SSG.
- **Component System**
  - Global primitives: `Section`, `ParallaxStage`, `AnimatedHeading`, `SplitScene`, `FloatingNav`.
  - Shared visual assets: texture overlays, gradient maps, vector glyphs, plane/camera meshes.

---

## 3. Experience Blueprint by Section

### 3.1 Home / Narrative Scroll
1. **Intro Dock**: holographic welcome, particle cloud, mission statement.
2. **Camera Deconstruction**: scrolling breaks a 3D camera into Sensor / Lens / Body, each linking to Design, Photography, Music.
3. **Flight Path**: parallax runway → plane takeoff animation → transitions into Travel map.
4. **Control Deck**: radial menu or HUD that locks to viewport, offering quick jumps with live previews.
5. **Wrap-Up**: CTA to contact / subscribe anchored by animated signature.

Implementation notes:
- Use scroll-driven timelines (`lenis` + `framer-motion` + `gsap/ScrollTrigger`).
- Combine CSS `perspective` with Three.js scenes for 3D decompositions.
- Provide reduced-motion variants/fallbacks.

### 3.2 Travel (Primary)
- **Views**
  - *Map View*: interactive globe/map (Mapbox GL JS or deck.gl) plotting “Been” vs “Planned”. Hover/click reveals summary card.
  - *List View*: grouped by region, with badges for `Visited`, `Planning`, `In Progress`.
  - *Guide Pages*: MDX per destination containing narrative, itinerary, gallery, and “Personal Radar” (gear, budget, mood, top tracks).
- **Data Model**
  - `travel/locations/*.mdx` with frontmatter: `status`, `coords`, `season`, `tags`, `heroImage`, `mapRoute`.
  - Optional `travel/routes.json` for multi-stop journeys.
- **Interactions**
  - Scroll-synced map: as user scrolls list, map pans/zooms to highlight location.
  - “Packing overlay”: animated UI showing gear/essentials per guide.

### 3.3 Design
- **Fictional Map Engine**
  - Story-driven UI that renders procedural maps (custom tiles or WebGL grid). Could showcase typography, UI motion, or architecture layout overlays.
  - Provide toggles for layers (Transit, Elevation, Concept).
- **Architecture Showcases**
  - Carousel of concept scenes (renderings, sketches) with animated annotations.
  - Support for `before/after` comparisons using existing `ImageComparison`.
- **Content Source**
  - `design/projects/*.mdx` with metadata: `type`, `software`, `dimensions`, `narrative`.

### 3.4 Music
- **Web Instrument**
  - Browser-based synth/sampler (Tone.js or Web Audio API) featuring pads keyed to curated samples.
  - Visual feedback responsive to user play (spectrum analyzer, particle bursts).
  - Preset selector tied to MDX-defined data (scale, BPM, mood).
- **Song Showcases**
  - Card list with embedded players (SoundCloud/Spotify) plus behind-the-scenes notes.
  - Add “In Progress” board for WIP tracks.
- **Data Model**
  - `music/instruments/*.json` (presets) + `music/showcases/*.mdx`.

### 3.5 About
- **Perspective Timeline**
  - Scroll down a vertical timeline where blocks tilt/rotate in 3D space.
  - Include stats (years coding, fav tools) with animated counters.
- **Values + Toolkit**
  - Grid of principles, each with micro animation.
  - Downloadable résumé + quick-contact module.

---

## 4. Visual + Interaction Direction
- **Color System**: keep existing neon palette; expand with muted grounding tones for readability.
- **Typography**: retain Geist but add monospace accent for HUD copy. Consider variable font for dynamic weights.
- **Motion Library**
  - Base easing + duration tokens.
  - Scroll-bound sequences defined in JSON for repeatability.
  - Reusable shader snippets for glows, scan lines, volumetric lighting.
- **3D Assets**: model camera and plane in Blender → export GLTF for Three.js usage; optimize via `drei` + `useGLTF`.
- **Navigation**: rework `LiquidMenu` into multi-layer HUD rather than simple nav bar; integrate progress indicators + section previews.

---

## 5. Content Production Checklist
| Domain   | Tasks |
|----------|-------|
| Travel   | Draft top 6 guides (Visited + Planned), gather coordinates, select hero imagery, write tips. |
| Design   | Outline fictional map story, export architecture renders, define 3-4 concept writeups. |
| Music    | Record sample stems, design instrument presets, choose 3 showcase tracks, write liner notes. |
| About    | Update bio, craft timeline milestones, gather photos/icons for each era. |

---

## 6. Implementation Roadmap
1. **Foundations**
   - Formalize content schemas + TypeScript types.
   - Introduce `contentlayer` or custom loader to centralize MDX ingestion.
   - Build shared layout primitives (`Section`, `SplitScene`, `ScrollStage`).
2. **Home Narrative**
   - Prototype scroll controller + parallax stack.
   - Build camera + plane scenes; integrate with story beats.
3. **Travel System**
   - Define data shape, create sample guides, wire map/list sync.
4. **Design + Music Interactives**
   - Implement fictional map engine (WebGL canvas) and music instrument (Tone.js + React).
5. **About Experience**
   - Compose timeline, micro animations, CTA modules.
6. **Polish**
   - Accessibility + reduced-motion handling.
   - Performance passes (code splitting, suspense boundaries, memoization).
   - Analytics + contact funnels.

---

## 7. Open Questions
- Map provider decision (self-hosted tiles vs Mapbox/MapLibre).
- Hosting strategy for audio samples (local vs external storage/CDN).
- Need for CMS? If manual MDX authoring becomes heavy, consider Sanity/Contentful hybrid.
- Authentication or user data tracking? (Probably not, but consider for future interactive save states.)

---

## 8. Next Immediate Actions
1. Flesh out sample content entries for each domain to validate schema.
2. Sketch home scroll storyboard (Figma or Excalidraw) to lock transitions.
3. Inventory existing components (LiquidMenu, animations) for reuse vs. refactor.
4. Spin up a `/docs` or `/design` space to drop reference assets (renders, palettes, motion studies).

Use this file as the single source of truth—update it as decisions evolve to keep the rebuild disciplined and aligned with the creative vision.
