# 03 — Visual Language

The visual system for the travel section, derived from the award corpus and mapped onto
the tokens this codebase already has (`src/app/globals.css`, Geist fonts in
`src/app/layout.tsx`).

---

## 1. The palette formula

The single most consistent finding across every award tier, from SOTD microsites to
national tourism boards:

> **Near-monochrome UI chrome. Photography supplies the color. One (or few) accents carry
> all signaling.**

Documented exemplars:

| Site | Formula |
|---|---|
| Niarra Travel (SOTD 2021) | `#000` / `#FFF` only; WebGL + photos do the rest |
| iFly 50 (SOTD + 6 Webbys) | black + white + one coral `#DF6C4F` |
| Travel Next Level (SOTD 2024) | `#F1F1F1` / `#010101` |
| MySwitzerland (Master of Swiss Web) | black + white + coral `#D14836` |
| Lithuania Travel (HM 2025) | deep teal `#003C3A` + mint `#C7E6DC` |
| Reverie Safaris (HM 2026) | forest `#1E392B` on cream `#FBF9F3` — no pure black/white |
| thevnomad (HM 2022, personal) | navy `#191F2E` + coral `#FF6861` |
| Flighty (ADA 2023) | near-black map, white type, one signal color |
| Eurostar (rebrand) | 2 base blues + ≤6 accents, each bound to a region |

### Applied to this site

The existing token set is *more* chromatic than the award formula (folly `#FF1F4B`, neon
cyan, electric blue, matrix green all in play). Discipline, not replacement:

- **Ground**: keep the dark navy ramp (`#04050D → #0E1628 → #151F33` already on
  `/travel`; `--rich-black #0E131F`). Prefer off-black over pure `#000`.
- **One phosphor accent for the HUD**: cyan is already the travel section's voice —
  keep it as the single "instrument" color (map chrome, readouts, active states).
- **Folly `#FF1F4B`** becomes the *rare* hot signal (alerts, the active flight arc), not
  ambient decoration. World of Swiss/MySwitzerland's coral plays exactly this role.
- **Status colors are data, not decoration** (Google Flights' traffic-light grid):
  - Visited — teal/green family
  - In Progress — amber
  - Planning — blue/violet family
  These three + the phosphor accent are the only chromatic UI. Current page usage
  (cyan = visited, fuchsia = on-deck, amber = drafts) is close; formalize it as tokens
  and re-check AA on the dark ground.
- **Region-coded accents** (Eurostar architecture): if regions need identity, assign each
  region one accent from a fixed ≤6 set, used for its section header, map line, and guide
  accent — a shared logic instead of per-page invention.
- Photography must be **graded to one LUT** (Travel Oregon's "heighten consistently, never
  randomly"; Greenland Is Melting Away's unified ice-blue) so mixed phone/camera sources
  cohere. Pre-grade at build/import time.

### Token discipline (Backpack model)

Define once, consume everywhere — CSS custom properties AND MapLibre paint properties from
the same source (Skyscanner Backpack's token-first architecture; JSON tokens → build step
if it grows):

```css
--status-visited: …;   --status-progress: …;   --status-planning: …;
--hud-accent: …;       --hud-panel: rgb(…/ 0.55);  --scrim: linear-gradient(…);
```

Precompute the **AA matrix**: every status color × every background it sits on, in both
themes; "if there's no AA pairing, you don't use it that way."

---

## 2. Typography: the three-voice system

Synthesized from the editorial corpus (Snow Fall lineage), luxury travel (Eurostar's
La Pontaise, Jacada's serif suite), and HUD references (Bear 71, Flighty, NASA):

| Voice | Role | Face here |
|---|---|---|
| **Display** | Destination names, chapter headlines over imagery | An expressive display face. Geist at heavy weights works; a high-contrast serif (e.g. Fraunces, the free analogue to Eurostar's La Pontaise) is the documented luxury-travel differentiator if more "journal" warmth is wanted |
| **Body** | Longform guide prose | Geist, ~19–22px / 1.6, strict 60–75ch measure |
| **Telemetry** | Coordinates, dates, distances, status badges, stat readouts | **Geist Mono** — small-caps labels, tabular numerals |

- The mono telemetry voice is the differentiator: **no researched luxury/editorial site
  does it**, and every HUD reference (Bear 71's sensor tags, Flighty's tabular telemetry,
  Google Earth's coordinate metadata, Windy's readouts) validates it. Coordinates
  formatted as `35.0116 N · 135.7681 E`, dates as `2024-04-12`, indices as `07 / 23`.
- Three voices, **rigorously separated** — that's the whole system. Kickers/eyebrows in
  small-caps with wide tracking (already the site's habit via `tracking-[0.4em]`).
- Oversized numbered indices as a typographic device (iFly 50's 01–50 countdown; NYT's
  rank badges) — tabular or mono digits.
- ⚠️ Codebase note: `globals.css` sets `body { font-family: Arial, Helvetica }` while
  `layout.tsx` loads Geist into CSS variables that nothing consumes. Wire
  `var(--font-geist-sans)` / `var(--font-geist-mono)` before building type ramps.

---

## 3. Imagery treatment

- **Legibility is a token, not a per-photo fix**: one scrim recipe —
  `linear-gradient(rgba(0,0,0,0) 40%, rgba(0,0,0,.55) 100%)` — applied to every image
  that carries text, targeting WCAG 4.5:1 (3:1 for large text) against the worst pixel
  region (Smashing's technique catalog; Banff's transparent→60% gradient).
- The HUD "label plate" (bracketed panel behind text) is a **branded scrim** — legibility
  device and visual signature in one.
- Alternatives where a scrim kills the shot: localized `backdrop-filter` blur, a solid
  strip, or art-directing text into quiet image regions. Never bake text into images.
- Full-bleed is **earned punctuation, not default** (Snow Fall): body text in a measured
  column; only maps and hero imagery break out. One "hero motion" element per viewport max.
- People-in-landscape scale beats empty vistas (100% Pure NZ's photography doctrine);
  one human moment per destination beats generic sight lists (Night Walk's named guide,
  Beyond the Map's people-as-waypoints).
- Card images: fixed crop ratio (Airbnb's 20:19 or 4:3), rounded 12–16px corners, 3 lines
  of metadata max.
- Illustration accents (hand-drawn route squiggles, stamps — Six Senses, Travel Oregon's
  animated scenery) are the counterweight that keeps the HUD warm and personal. Lottie is
  the static-export-friendly vehicle (thevnomad, Airbnb).

## 4. HUD chrome is a layer, not a theme

The award-validated composition (Faroe Remote Tourism's gamepad over brand-clean video;
Night Walk's thin white UI over photospheres; Bear 71's vector world vs warm footage;
Google Earth's translucent chapter cards):

- The HUD gets **its own token set** (panel translucency, thin dividers, mono type,
  phosphor accent) and sits *over* journal content that stays readable and timeless
  underneath.
- Translucent dark panels + thin dividers + compact numeric readouts (Windy,
  Flightradar24's telemetry rail) deliver the aesthetic with plain HTML/CSS — no WebGL
  required for the HUD itself.
- The tension between cold HUD vector and warm human photography **is the style** — don't
  grade the photos cold to match the chrome.
- Existing effect utilities in `globals.css` (`.scanlines`, `.hologram`, `.glitch`,
  `.tech-border`) belong to this decorative layer: `aria-hidden`, used sparingly, and
  never on reading surfaces.

## 5. Layout systems

- **Region-grouped index** with a persistent progress/HUD element (`DEST 07/23 · ASIA`)
  rather than a plain grid — winning lists are experiences with progress (iFly 50's
  countdown, KBT's regions + stamps, Nomadic Tribe's chapters).
- Cap top-level region groups at 3–5 (Aman's three macro-regions); the map handles
  fine-grained browsing.
- Guide pages: single measured column with typed component breakouts (doc 02 §6);
  magazine-style mixed grid (Habitas) is an option for the journal index if the card wall
  feels too uniform.
- **Scroll-snapped fullscreen sections** are the current award-grade pattern for the
  *landing* page (Lithuania Travel) — apply to `/travel`'s opener, never to guide prose.
- Stat modules share one anatomy: label / big value / unit / context line (GetYourGuide's
  Trend Tracker) so a dashboard reads as one instrument.
- Whitespace is the luxury signal (Aman); density on demand — a calm default map/HUD that
  reveals dense overlays on explicit toggle reads as "instrument panel"; density by
  default reads as clutter (Google Flights' three-tier disclosure).

## 6. Map styling

- **Custom style JSON, always** — never default streets. A desaturated/duotone dark
  basemap in the site's tokens (Polarsteps' muted custom map; Chartogne-Taillet's
  single-ink engraved chart) so the route/status colors are the highest-contrast elements.
- No default POI clutter; contour lines and terrain hillshade optional for the Bear 71
  wireframe feel.
- Labels with contrast halos; legend pairs every color ramp (Windy).
- The map should be **the most polished single component, not the only idea** — the
  award-landscape reality check: no pure personal travel-map site has won big; personal
  winners (thevnomad, Hedwig) won on typography, palette discipline, and polish.
