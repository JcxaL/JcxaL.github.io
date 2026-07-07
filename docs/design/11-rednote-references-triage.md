# 11 — RedNote Reference Report: Triage

Owner-supplied source: *RedNote UI/UX and Web Design Reference Report* (2026-07-06, 29
items). This doc maps each useful item onto the Metro Museum plan (docs 06–10), flags
what to verify, and discards the rest. Item numbers refer to the report.

---

## New ideas adopted into the plan

| # | Item | Where it lands |
|---|------|----------------|
| 7 | **Satellite-imagery letter collages** — letterforms assembled from rivers/mountains/fields | **Station monograms**: each city's letter built from its own satellite/map imagery — maps-as-typography, perfectly on-theme. Asset-production technique for the window posters and place-page H1 art (Phase 1/3 asset pipeline) |
| 15 | **Halftone text–image mixing** (Typowow-style dot pixelation) | A halftone photo treatment joins the **dot-matrix hardware register** (doc 07 D7): "Planning"-status bureau posters and print-flavored textures rendered in the same dot language as the departure boards |
| 23 | **Global Artifact Atlas** — 7,820 artifacts on a 3D globe, category filters, century timeline, side panel | Strongest single reference for the **globe terminus** (doc 06 scene 4): adds a **timeline scrubber** (visits by year, JNTO forecast-front style) and a filter-chip row (by line/region/year) to the globe spec |
| 8 | **"10-year life experience" map site** — clickable dots opening memories, ambient audio per place | Validates the map-as-index + **per-stop ambient audio slots** already reserved in the content schema (doc 06 §4/§5); the "living personal archive" framing matches the accretion principle |
| 3 | **Liquid-glass effect** (pixel-displacement, Rive mesh, convex-droplet simulation) | Candidate **material for the train-window glass** (doc 07 D5 atmosphere layer): refraction/displacement on the scenery texture; also trend-aware (Apple Liquid Glass era) — keep subtle |
| 20 | **Rive mesh + bone interactive book carousel** | Confirms Rive's fit for the **ticket** state machine (doc 07 D9) and offers an exhibit-room interaction pattern: a rotating ring of "postcards/books" as an alternative media-wall module |
| 22 | **"Stamp of Spring" drag-on stamp maker** | Charm layer for the **passport-stamp system** (docs 02/06): visited stations collect stamps on the ticket; a playful stamp visual language beats generic badges |
| 4 | **Hand-drawn font package maker** (Doodle Fonts) | A personal **handwriting accent font** for journal annotations/captions — the warmth counterweight to the HUD that doc 03 §3 calls for (illustration accents). One-off asset, OFL-equivalent self-host |
| 2 + 26 | **Text-poster generator; cinematic-site AI workflow** (structure → assets → skeleton → manual refinement) | Feeds the **agent asset pipeline** (doc 08): per-city window posters generated to a fixed template (name, monogram, palette, one image), then human-curated — the report's own workflow items mirror our builder/reviewer loop |
| 29 | **"Synex" organic-growth interaction** — branch grows across the page linking panels; author admits "good-looking but hard to implement" | Adopt the *achievable version we already planned*: the **route-line draw-on** (doc 04 §3) IS the organic-growth device, built on line-progress animation instead of bespoke SVG growth. The report's own caveat validates the motion-budget discipline |

## Converges with decisions already made (no change, extra confidence)

- **27 — Bruno Simon's portfolio**: already in round-2 research (2019 Awwwards Developer
  award, verified). Confirms the "one WebGL world" ambition — and our persistent-canvas
  architecture is the maintainable route to it.
- **28 — MingDesign particle audio site**: scene-cycling cinematic hero = our station
  intro beat structure; its particle engine is the kind of thing doc 07 D5 does with
  fragment shaders instead (cheaper, pausable).
- **17 / 21 — kinetic type + ASCII interactive text**: both live inside our variable-font
  signature moments (Doto axes) and dot-matrix register; ASCII flow is a nice option for
  the 404 "end of the line" page or tunnel texture.
- **18 — sumaart (Swiss layout + WebGL geometry + issue-based navigation)**: issue-based
  nav ≈ our line-based IA; editorial typography direction matches doc 03.
- **13 — dark theme + large type + subtle animation client site**: the baseline taste we
  already standardized.
- **6 — "GSAP-based micro-animation library"**: unnamed in the report; our named motion
  tokens on GSAP (doc 08 §4) already cover the practice — no new dependency wanted.
- **19 — semicircle album-cover music site**: parked for the future Music line.
- **25 — Illustrator abstract-map workflow**: useful authoring technique for the 2.5D
  scenery/city diagrams; complements the build pipeline, changes nothing architectural.
- **1 — Codex-generated 8-day itinerary**: process anecdote; our agent workflow already
  assumes this class of tooling.

## Verify before touching (claims that didn't survive a sniff test)

- **16 — "Pretext, 15KB layout/animation library, ~46k GitHub stars"**: no library of
  that name and scale is known to us; the name/stars are likely garbled in transcription.
  **Do not adopt or search-install anything by this name without finding the actual
  repo** — the round-2 lesson (Lost Pixel archived, Theatre.js dormant, license traps)
  applies doubly to virally-shared libraries.
- **9 — Swishy.ai templates / 15 — Typowow / 14 — Colaiqte**: Chinese-ecosystem SaaS
  tools; fine as inspiration, but check availability/licensing before any pipeline role.
- **14 — Mapit (roots vs city)**: lovely 3D-map juxtaposition — note its **ticket-shaped
  UI element** as visual reference — but it runs on Mapbox; our stack stays
  MapLibre/keyless (doc 07 D4). The design transfers; the engine doesn't.
- **11 / 12 / 24 — 500-agent 3D city, 144 AI employees, generative flipbook**: spectacle
  and workflow demos; no static-export-compatible architecture to borrow. The flipbook's
  *isometric expanding cityscape* is worth a mood-board pin for tunnel/interchange art,
  nothing more.

## Meta-note on the report itself

The per-item "Reference value" lines are template-generated (four phrases rotate);
treat the report as a **curated link list with screenshots**, not as analysis. Its real
contribution is ~10 adoptable ideas above — the strongest being satellite-letter
monograms, the halftone/dot poster language, and the globe timeline+filter pattern.
