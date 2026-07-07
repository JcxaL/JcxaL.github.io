# 01 — Inspiration Gallery: Award-Winning Travel Web Design

A curated survey of the travel websites juries actually rewarded — plus a handful of
un-awarded sites whose patterns are too instructive to skip. Each entry: what it won
(cited), why it matters, and what this site should take from it.

Status legend: **live** · **changed** (redesigned since award) · **dead** (archive only).

---

## A. Cinematic scroll journeys (the award-tier showpieces)

### Persepolis Reimagined — Getty / Media.Monks · live
<https://persepolis.getty.edu/>
**Awards:** Awwwards Site of the Day Jun 1 2022 (7.96/10) + Developer Award (8.03/10) +
Site of the Month Jun 2022 (awwwards.com/sites/persepolis-reimagined — verified against
the live archive); FWA of the Year 2022 (reported).
The archetype of the scroll-scrubbed camera journey through a place: one continuous WebGL
flight through ancient Persepolis, chaptered, with waypoint-triggered captions. Its
animations/transitions sub-score was **9.60/10** — juries reward *continuity of easing*,
not effect count.
**Take:** model the flight-path transition as ONE interruptible scroll-driven camera
timeline with numbered chapters and a progress rail; its weakest sub-scores were
accessibility (7.4) and performance (7.2) — beating the genre's known flaw is free.

### Nomadic Tribe — makemepulse · dead
Archive: <https://thefwa.com/cases/nomadic-tribe>
**Awards:** FWA of the Day Feb 2019 + FWA of the Month Mar 2019 + FWA Site of the Year
2019 (per makemepulse case study); Awwwards SOTD Feb 19 2019 (8.30/10 — verified);
CSSDA Website of the Year 2019 nominee; Eurobest Craft (reported).
A four-chapter WebGL migration tale with Moebius-inspired art direction. One of the most
decorated travel experiences ever — and it no longer exists.
**Take:** chapter journeys by region, restrict each chapter's palette; a small custom
motion vocabulary (2–3 reusable effects on a tuned engine) beat effect sprawl. And: keep
showpiece WebGL isolated from durable content, because pure-experience sites die.

### The Boat — SBS Australia / Matt Huynh · live
<https://www.sbs.com.au/theboat/>
**Awards:** Walkley Award, Multimedia Storytelling 2015; UNAA Media Peace Award (Special
Commendation) 2015; Webby Honoree (Best Visual Design; Online Video Doc) 2016; SXSW
Interactive Innovation finalist; FWA SOTD + Awwwards SOTD 2015 (per artist's site).
Ink-brush illustration, layered parallax, weather effects and sound building total
immersion from almost no color.
**Take:** weather/atmosphere overlays over content (direct precedent for the packing
overlay as a themed layer); near-monochrome base + one accent per destination; onboard
with one line ("scroll to travel · sound optional").

### Bear 71 — National Film Board of Canada · changed (Flash original retired; WebVR re-release)
<https://bear71vr.nfb.ca/>
**Awards:** Webby, Best Internet Art (NetArt) 2013; FWA Site of the Year 2012 (reported).
A surveillance-styled wireframe map of Banff with tracked, labeled entities — **the**
precedent for "sci-fi HUD over real landscape": contour terrain, monospaced entity tags,
glowing markers, warm grainy footage popping against the cold vector world.
**Take:** steal the duality wholesale — HUD vector map + human photography in popups;
destination badges styled as sensor readouts (code, coords, date, status).

### Umami Land — Google / MediaMonks · dead
Archive: <https://www.awwwards.com/sites/umami-land>
**Awards:** Awwwards SOTD + Developer Award Feb 2021; Site of the Month Feb 2021;
**Developer Site of the Year 2021**; FWA case.
A free-roaming illustrated WebGL "theme park map" of Japanese food culture with a guided
tour mode — the most decorated map-world travel experience of its era.
**Take:** guided-tour mode = a predefined camera spline scrubbed by scroll; marker hovers
animate (scale + label), not just recolor; art-directing map style and page UI together is
what makes a map site feel like one product.

### Marseille — PHA5E · live (verify before citing)
<https://marseille.laphase5.com>
**Awards:** Awwwards SOTD Mar 13 2021 + Developer Award 2021 (animations dev sub-score 8.60/10).
"Map as the entire site": a stylized low-poly 3D Marseille where zooming into a district
IS the navigation, diving into 360° panoramas.
**Take:** zoom depth as navigation hierarchy (world → region → destination); a stylized,
non-photoreal map ages better and hides tile seams; invest disproportionately in the ONE
dive transition — it's what juries remember.

### Chartogne-Taillet — Immersive Garden · live
<https://chartogne-taillet.com/en>
**Awards:** Awwwards SOTD Dec 2 2020 (7.93/10; creativity 8.53/10).
The definitive "map as navigation" winner: the whole site is an engraved-style illustrated
map in a single warm-brown ink (#987654); content slides in over the map; animated
dot-line paths connect locations.
**Take:** custom-style MapLibre into a single-ink "engraved chart" (no default POI noise);
animated dotted lines between visited points can carry an entire identity; its
accessibility sub-score (6.33) is the genre's warning — mirror every map interaction with
a plain list.

### Treasures of Japan — Mirror / Weekend Max Mara · live
<https://treasuresofjapan.mirror.it/>
**Awards:** Awwwards SOTD Oct 5 2024 (7.21/10).
A Kyoto→Tokyo journey structured as a game: waypoints with locked/active/completed states,
collectibles, explicit progress.
**Take:** the three waypoint states map 1:1 onto Planning / In&nbsp;Progress / Visited; an
aggregate progress meter ("23/47 places") gives a journal a collection loop.

### World of Swiss — SWISS / Hinderling Volkart · dead (parked domain)
Archive: <https://www.awwwards.com/sites/world-of-swiss>
**Awards:** Awwwards SOTD Jun 9 2014 (8.06/10; creativity 8.66/10).
A 3D-scrolling airline brand experience with a LIVE route-network visualization — the
closest historical precedent for a personal flight-path map.
**Take:** render personal trips as an animated route network ("systems diagram" framing);
one saturated accent (#D14836-style) over neutral grays is the proven airline palette.

### The Smart Way to Travel — DFDS Seaways · dead
**Awards:** Awwwards Honorable Mention Aug 23 2013.
An early horizontal-parallax "journey as scroll" microsite — the primitive ancestor of
scroll-choreographed travel pages.
**Take:** one horizontal scroll-snapped leg-by-leg section still works as a rhythm change
inside a vertical site. Thirteen years later the idea survives, the site doesn't — encode
journeys as data so presentation can be rebuilt.

---

## B. The destination-list masterclass

### iFly 50 — KLM / Born05 · dead (KLM shut the iFly magazine platform)
Archive: <https://www.awwwards.com/sites/ifly50>
**Awards:** Awwwards SOTD Mar 23 2016 (8.19/10 — verified) + Developer Award + Site of the
Month Mar 2016; **6 Webby Awards 2017** — winner + People's Voice, Tourism & Leisure; Best
User Experience; Best Visual Design – Aesthetic (winners.webbyawards.com archives); Red Dot
Communication Design "Best of the Best" (red-dot.org/project/ifly50-14846); Lovie Award
(per KLM press).
Fifty destinations, one full-screen photograph each, a giant numbered countdown, ambient
score, flawless keyboard/scroll navigation. 1.2M visitors, 7+ minute average engagement.
The strongest award-verified template for a destination list — and its highest jury
sub-score was **content (8.61)**: terse, confident copy.
**Take:** number the destinations (tabular/mono digits) as an index-as-HUD device; rigid
per-destination template (photo / number / name / one-line hook / status badge); unlock
secondary media (gallery, map, video) on demand instead of stacking it on the page.

### iFly KLM 360° — KLM / Born05 · dead
**Awards:** Awwwards SOTD Dec 7 2018 (7.34/10).
The same format evolved into 360° video served at three fidelity tiers (VR / mobile gyro /
desktop drag) from one codebase.
**Take:** design destination pages in fidelity tiers — static hero → scroll motion →
optional immersive extra; keep chrome as thin translucent overlays.

### 52 Places to Go — The New York Times · live
<https://www.nytimes.com/interactive/2018/travel/places-to-visit.html>
**Awards:** none confirmed for the interactive itself — included as the canonical list UI.
52 numbered cards: rank badge, hero media, one-line hook, tiny grey locator map, byline —
plus the serialized "52 Places Traveler" journal visiting every entry.
**Take:** the card anatomy (badge slot where NYT puts rank, locator mini-map, consistent
crop ratio); a "jump to region" index pinned atop long lists; uniform card structure is
what makes eclectic personal photos read as a designed collection.

---

## C. Tourism boards & DMOs

### MySwitzerland — Switzerland Tourism / Dept + Unic · live
<https://www.myswitzerland.com/>
**Awards:** "Master of Swiss Web" (overall winner), Best of Swiss Web 2020, + 3× Gold
(Creation/Technology/Usability); Awwwards Honorable Mention Dec 18 2019; World's Leading
Tourism Authority Website, World Travel Awards 2019; FWA case (tier/date unverified).
45,000 tourist objects cross-linked in 16 languages; the jury singled out its scroll-driven
"interactive visual journey". Palette: black + one coral accent (#D14836) + white.
**Take:** model destinations ↔ routes ↔ guides as ONE content graph in frontmatter; named
route objects (the Grand Tour pattern) drive both guide pages and map polylines; build-time
responsive imagery is the static-export equivalent of their ML image pipeline.

### Kentucky Bourbon Trail — Lewis Communications · live
<https://kybourbontrail.com/>
**Awards:** Webby People's Voice, Travel & Lifestyle 2025 (winners.webbyawards.com archive).
The most recent Webby travel-site winner. Thesis: named regions + build-your-own-trail
itinerary tool + passport/stamp gamification. Post-launch +29% traffic.
**Take:** region grouping with a map-first region opener just won a 2025 Webby; a
"passport of stamps" is a charming skin for status badges; judge the redesign by
planning-task completion, not aesthetics.

### Lithuania Travel · live
<https://lithuania.travel/en>
**Awards:** Awwwards Honorable Mention Jun 20 2025.
A real production NTO (not a campaign microsite) earning Awwwards recognition with a
two-tone identity: deep teal `#003C3A` + mint `#C7E6DC`, fullscreen sections, disciplined
typography.
**Take:** a dark ground + single pale companion is a proven jury-pleaser that maps
directly onto a HUD aesthetic; DMO page anatomy for guides: hero → orientation (map
snippet + region badge) → highlights → practical info → related.

### Visit Faroe Islands (+ Remote Tourism) · live / campaign archived
<https://visitfaroeislands.com/en> · <https://www.remote-tourism.com/>
**Awards:** D&AD Yellow Pencil, PR 2020 ("Closed for Maintenance"); Clio Bronze,
Experience/Activation 2020 ("Remote Tourism"). No Webby win could be confirmed.
Lockdown-era web users steered a real islander via an on-screen **gamepad HUD over live
video** — the most direct published reference for game-controller chrome over travel
imagery. Evergreen site: intent-based nav, favorites, "72-hours" duration-scoped guides.
**Take:** HUD as a *layer* over brand-clean content, not a theme; hub + stunt-satellite
architecture (keep kinetic experiments on self-contained routes); duration-honest guides.

### Inspired by Iceland / Visit Iceland · live
<https://www.visiticeland.com/>
**Awards:** One Show Gold Pencil, Social Media 2022 ("Icelandverse"); One Show 2023 listing
("OutHorse Your Email"); Clio shortlist 2022.
The best example of an evergreen hub continuously docking viral campaign modules without
breaking its IA. Three entry grains: region, route, place.
**Take:** persona and humor are legitimate design systems — badges and empty states can
carry a running voice; time-pegged content gives a personal site reasons to be revisited.

### Banff & Lake Louise Tourism — VentureWeb · live
<https://www.banfflakelouise.com/>
**Awards:** Awwwards Honorable Mention Aug 16 2023.
Regional-scale DMO (the closest analog to a personal site's 20–40 destinations):
cinematic mountain imagery over a rigorous utility layer — seasonal switching,
itineraries as a content type, alerts.
**Take:** "itinerary" as a content type distinct from "destination"; style practical
blocks as carefully as heroes — utility-with-craft is what earned the mention.

### Travel Oregon (+ "Only Slightly Exaggerated") · live
<https://traveloregon.com/>
**Awards:** listed in the 2018 Webby winners gallery, Travel (honor level unconfirmed —
registration-gated archive). Campaign honors are ad-industry, not web.
The Ghibli-style animated campaign (10.7M views) whose illustrated fantasy style carries
into the site UI; publicly recognized accessibility initiatives.
**Take:** every cinematic hero moment must land on a practical link — spectacle that
dead-ends is wasted; a consistent "slightly exaggerated" grade (one LUT, painted skies)
unifies wildly different imagery; treat terrain/effort accessibility notes as metadata.

### Also instructive (no confirmed web-design awards)
- **100% Pure New Zealand** (PATA Grand Award 2004, marketing) — travel-time honesty
  calculator; "Explore by map" as co-equal nav mode. <https://www.newzealand.com/>
- **Visit Greenland** — season-first IA; dual paths by traveler certainty ("find your
  destination" vs direct access). Certainty level ≈ the journal's status dimension.
- **Visit Norway** — named scenic routes; region sub-identities under one system;
  long-form culture "Stories" as the shareable layer. <https://www.visitnorway.com/>
- **JNTO (japan.travel)** — region × interest dual taxonomy; cherry-blossom **forecast
  fronts sweeping a map** — time-as-data making maps kinetic with zero WebGL.
- **VisitOSLO** — the "Is it even a city?" campaign (13M+ views): deadpan understatement
  as art direction; site craft ≠ campaign craft.
- **Visit California** (Appnovation rebuild) — research + speed produced the measurable
  wins: +37% organic, 2× faster loads. Budget performance before spectacle.

---

## D. Editorial scrollytelling (the NYT lineage)

### Snow Fall: The Avalanche at Tunnel Creek — NYT, 2012 · live
<https://www.nytimes.com/projects/2012/snow-fall/index.html>
**Awards:** Pulitzer Prize, Feature Writing 2013; Peabody Award 2013.
The founding document of scrollytelling. Six named chapters, persistent chapter nav,
measured ~600px text column, media breaking out full-bleed, ambient video chapter openers.
**Take:** 4–6 named chapters + sticky chapter nav = progress HUD; muted looping video as
chapter openers; the text-measure / full-bleed contrast IS the drama; lazy-init everything
on IntersectionObserver.

### Firestorm — The Guardian, 2013 · live
**Awards:** SND Digital Silver, Multimedia 2013; Walkley, Multimedia Storytelling 2013.
The counter-model: full-screen media panels with text cards overlaid (media-first rather
than text-first).
**Take:** 100vh media panels + scrim + short text card for destination intros, then drop
into measured-column mode; chapter mood coded by color pulled from footage; sound opt-in.

### Riding the New Silk Road — NYT, 2013 · live
**Awards:** SND Digital Award of Excellence, Multimedia 2013.
The purest "route as story spine": a continuous vertical map of the Chongqing→Duisburg
rail route you literally travel by scrolling; media docked at waypoints; timetable-style
waypoint metadata.
**Take:** THE mental model for the flight path — scroll progress maps to distance along a
polyline; stamp waypoints with place/date/km telemetry; progressively draw the route line.

### The Russia Left Behind — NYT, 2013 · live
**Awards:** SND Digital Award of Excellence 2013.
A 12-hour drive told as stops, with a persistent thin **locator-map rail** whose marker
tracks reading position; dots double as section nav.
**Take:** the fixed mini-map rail is cheap and delivers huge orientation payoff; model
guide content as "stops" with coordinates per section so rail and main map share data.

### Greenland Is Melting Away — NYT, 2015 · live
**Awards:** Webby, Best Individual Editorial Experience + People's Voice 2016; World Press
Photo Digital Storytelling, 2nd place 2016.
The zoom-ladder masterclass: one continuous scroll-linked zoom from drone footage through
satellite to hand-made map, canvas-rendered at 60fps, seams color-graded away.
**Take:** camera zoom as narrative scale (globe → region → place → detail), each zoom band
a content tier; render continuous animation to canvas/WebGL (MapLibre gives this free),
keep text in DOM; pre-grade all imagery to one palette so mixed sources cohere.

### Borderline — The Washington Post, 2018 · live
**Awards:** Online Journalism Award, Excellence in Visual Digital Storytelling (Large
Newsroom) 2019; Malofiej/SND golds reported via team portfolios (unverified).
A seamless tilted-perspective flight along ~2,000 miles of border.
**Take:** the flight recipe — pitch ≈ 60°, fog/haze on, chained eased camera moves, inset
locator map always present, ambient context labels (distance to next stop) as free HUD.

### Out of Eden Walk — NatGeo / Paul Salopek · live
<https://outofedenwalk.nationalgeographic.org/>
**Awards:** none site-specific confirmed.
A 21,000-mile walk recorded as a **Milestone every 100 miles** with an identical capture
template (panorama, ground/sky shots, audio, interview at exact coordinates).
**Take:** define a fixed milestone schema in frontmatter — consistency of capture is what
makes a growing personal archive look designed; cumulative stats (km, countries, days) as
HUD readouts; design for accretion — the site should look better at 50 entries than at 5.

### Google Night Walk in Marseille — 72andSunny / MediaMonks · dead
Archive: <https://thefwa.com/cases/google-s-night-walk-in-marseille>
**Awards:** FWA SOTD + Mobile of the Day 2014 (per creator case studies); D&AD Pencil,
Digital Marketing 2015; One Show Gold Pencil 2015; Cannes Lions Silver & Bronze (Cyber) 2014.
A guided binaural audio night-walk through photospheres, with a corner **route-map inset
showing position and progress** and a named human guide.
**Take:** the inset route map with moving position marker sold this to four juries; anchor
photos as hotspots along a path, not a flat gallery; first-person narration wins awards.

### The Hidden Worlds of the National Parks — Google Arts & Culture · live
**Awards:** Webby winner, Education 2017 + People's Voice + Best Use of Video; D&AD 2017 listing.
Ranger-narrated 360° journeys with a "guided tour vs free explore" duality.
**Take:** offer both map modes — Tour (auto-fly through visited places with captions) and
Explore (free pan/zoom); template each destination identically so navigation skills
transfer; pulse hotspots subtly.

### Google Earth Web + Voyager stories — Google / Ubilabs · live
<https://earth.google.com/web>
**Awards:** Webby 2018: "Earth View" — People's Voice + jury winner, Best User Experience;
"Total Eclipse of the Sun" — Best Data Visualization + Technical Achievement.
The reference implementation of globe storytelling: chapter cards drive the camera; users
can free-orbit and "return to story"; coordinates displayed as ambient metadata.
**Take:** chapters as data — `{center, zoom, pitch, bearing, content}`; the zoom-out → arc
→ zoom-in "swoop" (flyTo with high curve) reads as flight; translucent cards keep the
globe visible underneath.

### NASA Exoplanet Travel Bureau · live
<https://science.nasa.gov/exoplanets/immersive/exoplanet-travel-bureau/>
**Awards:** Webby winner, Science 2021 (per NASA's official Webby list); Webby People's
Voice, Weird 2018; Webby accessibility honoree 2023 (per JPL).
**The single best aesthetic reference for this site's direction**: unreachable exoplanets
framed as vacation destinations — retro travel posters, deep-space dark UI, luminous data
chips (distance, type, discovery year), 360° surface layers, a fictional bureau voice.
**Take:** steal the whole formula — poster hero per destination + HUD data chips + optional
immersive layer; give **Planning** destinations the fictional-bureau treatment so
unvisited places still get rich pages; display face for titles, mono/condensed for data.

---

## E. Platforms & travel products (pattern references)

### Airbnb · live (fully redesigned May 2025)
**Awards:** Webby winner, Travel website + Best Travel App 2014; Webby winner + People's
Voice, Travel app 2017 (webbyawards.com archives).
A decade of reference-setting: DLS (2016), Lottie (open-sourced), the 2025 "dimensional"
redesign (3D clay icons, springy micro-animations, warm neutrals), the 2023 review
redesign (rating histogram, percentile badges). Canonical patterns: split list+map with
**bidirectional hover sync**, price-pill markers, wishlists as cover-image collections,
shared-element card→hero transitions, "search as I move the map" toggle.
**Take:** status badges should behave like wishlist state — identical on card, pin, and
detail page; card hover = lift + image scale 1.03–1.05 over 300–400ms; one typeface family
with weight-only hierarchy.

### Kayak · live
**Awards:** 10 Webby wins/People's Voice across 2008–2015 (per kayak.com/news/kayaks-awards/,
corroborated by press) — the most Webby-decorated travel brand.
Flexible-date sliders, Explore budget-slider map, price-forecast confidence meter, search
progress "scan" animation.
**Take:** a scan/boot animation is a legitimate HUD moment; range-slider live-filtering of
map pins (by year, trip length); confidence gauge as a "trip readiness" widget.

### TripIt · live
**Awards:** Webby 2011; People's Voice 2014; People's Voice 2023; Webby + People's Voice
2025 (Apps – Travel; per TripIt's milestones page).
The definitive trip timeline: typed blocks (flight/stay/activity) each with fixed icon,
color, fields; days-until countdowns.
**Take:** define 3–4 typed MDX timeline blocks (travel-leg, stay, sight, food) — guide
pages become typed timelines, not freeform prose; countdown numerals on Planning cards.

### Flighty · live
**Awards:** **Apple Design Award, Interaction, 2023** (developer.apple.com/design/awards/2023 —
this is the award commonly misattributed to Hopper).
The sci-fi-HUD-travel aesthetic *shipped*: glowing great-circle arcs on a dark map,
pilot-grade telemetry progressively disclosed, past flights accumulating into a personal
route map.
**Take:** steal the visual grammar wholesale — dark desaturated basemap, glowing arcs,
small-caps labels, tabular numerals; "your accumulated routes" as the map's hero state;
status as a state machine with distinct styling per phase.

### Polarsteps · live
**Awards:** TravelTech Show Mobile App of the Year (Jan 2026; self-announced — treat as
claimed); App Store editorial features.
The closest existing product to this site's travel section: trips as ordered **steps** on
a custom muted vector map, auto-drawn route lines, stats rows (km/countries/days), the
same map serving planning and memory, printed Travel Books re-flowed from structured data.
**Take:** the structural blueprint — `steps[] {coords, date, status, photos, mdx}` powering
map, timeline, and cards from one source; desaturate the basemap so route/status colors
own the palette; "replay trip" camera tour as the cinematic payoff.

### Atlas Obscura · live
**Awards:** Webby People's Voice, Travel 2018 (press release + AO's own account); listed in
the 2019 winners gallery.
The strongest IA reference: place-page template (story → "Know Before You Go" facts box →
coordinates → nearby), **"Been Here / Want to Go" status toggles aggregating into personal
maps** — the exact Visited/Planning pattern, award-validated, and deliberately low-motion.
**Take:** drive list badges AND map pin styling from a single status field; separate story
from practical info visually; "my map" is the emotional payoff page.

### Pattern references without design-award claims
- **Booking.com** — dense scannable cards, live filter counts, sticky context bar — and
  the canonical **dark-pattern catalog to ban** (CMA 2019 enforcement; €413M Spanish fine).
- **Google Flights** — the traffic-light data grid; three zoom levels of the same price
  data; plain-language status lines ("prices are currently low").
- **Skyscanner** — "Everywhere" search inversion; **Backpack**, the only fully open-source
  travel design system (tokens incl. motion durations, AA-marked color pairs).
- **Wanderlog** — the strongest live list↔map sync: numbered pins matching numbered list
  items, per-day colors on both panes, drag-reorder redrawing the route.
- **Trainline** — vertical stop-timeline with a moving position dot; complex logic
  expressed as one sentence + badge.
- **Omio** — heterogeneous transport modes normalized into one card schema.
- **Expedia** — Trip Boards (named saved collections); the $12M deleted-form-field story
  as the argument for pruning card metadata.
- **Hopper** (Webby, Travel app 2021; World Travel Tech Awards 2023) — prediction verdicts
  as one confident sentence; color-coded calendar; unconventional palette ownership.

---

## F. Luxury & boutique (restraint tier)

### Reverie Safaris · live
<https://reveriesafaris.com/> — **Awwwards Honorable Mention May 4 2026.**
The most recent award-recognized journey site and the closest stylistic cousin to a
personal journey site: deep forest green `#1E392B` on warm cream `#FBF9F3`, editorial
serif over fullscreen video, and the quality Awwwards explicitly credited: **"elegant
pacing"** — full-bleed media panel → quiet text interlude, never two dense sections
adjacent. Built on Framer + Contentful.
**Take:** pacing beats tech; a small team on a light stack hits Awwwards level in 2026.

### Travel Next Level — Artemii Lebedev · live
<https://www.travelnextlvl.de/en> — **Awwwards SOTD Dec 27 2024 + Developer Award.**
A typography-led travel magazine (near-monochrome `#F1F1F1`/`#010101`) taking SOTD without
campaign budget — the closest award-verified analog to MDX guide pages.
**Take:** design the article template first (type scale, pull-quotes, image rhythm); the
flashy homepage is a view over it; off-white beats pure white for a "printed journal" feel.

### Niarra Travel — Superhero Cheesecake · changed
**Awards:** Awwwards SOTD Jun 22 2021 + Developer Award.
Pure black/white editorial system where a single WebGL hover-mask reveal supplies all the
drama and photography supplies all the color; judges credited semantics + usability
alongside the effects.
**Take:** monochrome UI + full-color photography means status badges can be the ONLY
chromatic UI element — instantly scannable and HUD-like; one signature hover, reused.

### Hedwig: Curated Travel · live
**Awards:** Awwwards Honorable Mention Apr 19 2026.
A single creator's curated travel guide, built in Readymag, earning an HM in 2026 — the
existence proof that a personal travel site reaches Awwwards standard through curation,
typography, and restraint rather than WebGL budget.

### More award-verified entries
- **Travel Sensations** (Awwwards HM Sep 10 2025) — journeys as sequenced experiences;
  serif display + airy tracking.
- **Our Habitas** (Awwwards HM Jun 21 2018) — two teals + white, magazine grid, parallax:
  recognition without WebGL.
- **Six Senses** (Awwwards Nominee May 2020) — content architecture + illustration accents
  humanizing polish.
- **Black Tomato** (Travel Marketing Awards Best Website 2011; Good Web Guide Travel
  Website of the Year 2013; Guardian Best Travel Website 2006/07; TMA 2025 for "The
  Feelings Engine") — **named content products** ("Get Lost", "Blink") and a feeling/mood
  browse facet; dual region + A–Z indexes.
- **Abercrombie & Kent** (Melbourne Design Awards 2019, Silver, Website — as listed) —
  the structured day-by-day itinerary table with route maps as first-class artifacts.
- **Brightline** (World Travel Tech Awards 2024, best rail website — voted, not juried) —
  linear station-strip route UI; selling with one tactile detail ("hand-stitched leather").
- **Eurostar** (D&AD 2023 shortlist for the DesignStudio rebrand) — the best documented
  travel type/color system: La Pontaise high-contrast serif over a functional sans; 2 base
  blues + 6 region-coded accents; the "Spark" motif morphing across loader, wayfinding,
  frames.

### No-award pattern references
**Aman** (restraint + the 86% PageSpeed → 36% revenue case), **Belmond** (one skeleton,
per-property mood; modality as browse axis), **Jacada Travel** (the single best itinerary
page anatomy — see doc 02), **Juvet Landscape Hotel** (question-form nav, radical content
economy), **The Standard** (personality-first microcopy), **Scott Dunn** (process
transparency; month/season facet), **La Compagnie** (route-card chip rows — the ancestor
of a flight-log entry).

---

## G. Maps, globes & engineering references

- **Mapbox Storytelling template** (github.com/mapbox/storytelling) — the de-facto
  scrollytelling architecture: JSON chapters with camera poses, `onChapterEnter/Exit`
  states, portable to MapLibre. The fastest path to the flight-path feature.
- **GitHub globe** (github.blog write-up) — arc *lifecycle* (spawn → draw → dwell → fade);
  4-tier adaptive performance degradation under 55fps; antialias off from the start.
- **Stripe globe** (stripe.com/blog/globe) — dot-matrix landmass (sunflower-spiral
  distribution), d3.geoInterpolate great circles, "if 60fps can't be met, ship the static
  image."
- **Flightradar24** — solid line = flown, dashed = remaining (the visited/planned line
  grammar); left-rail telemetry panel; honest capability gating of 3D mode.
- **Windy.com** — URL-serialized camera/layer state; translucent dark panels + mono
  numerals; one ambient animated layer making a map feel alive.
- **FlightConnections** — never render all routes; dim non-active to ~20%; selection
  filters list and map simultaneously.
- **Countries Been** — three-state status taxonomy with per-status fills + aggregate
  stats ("37 countries · 18% of world") as the emotional hook.
- **iMapa** (Awwwards HM Nov 3 2020) — an illustrated regional map site: stylized beats
  photoreal for personal/editorial feel.
- **thevnomad** (Awwwards HM Mar 30 2022) — one of the few award-recognized personal
  travel portfolios: dark navy `#191F2E` + coral `#FF6861`, typography-led, Lottie
  flourishes. Personal sites win on type, one accent, and micro-interaction polish.

---

## The meta-lessons (what the whole corpus agrees on)

1. **Monochrome UI + photography supplies the color.** Niarra, iFly 50, Travel Next Level,
   MySwitzerland, Flighty — the single most consistent formula across every tier.
2. **One continuous, interruptible scroll timeline wins; stacked effects lose.**
   (Persepolis 9.6/10 animations vs the genre's graveyard.)
3. **Accessibility is the award-tier's systematic weakness** (sub-scores 6.2–7.4) — a
   static site with honest HTML and reduced-motion fallbacks beats the genre at zero cost.
4. **Campaign WebGL dies; content-first survives.** Encode journeys as data, layer motion
   as progressive enhancement.
5. **The exact target aesthetic already won juried awards** — NASA's Exoplanet Travel
   Bureau (Webby 2021) and Bear 71 (Webby 2013) for HUD-over-place; Flighty (ADA 2023)
   for HUD flight arcs. This direction is validated; execution quality is the variable.
