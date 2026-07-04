# Travel Section — Implementation Plan

## Where things stand

- **Real but hardcoded data lives in `src/lib/travel.ts`** — synchronous, module-level arrays (2 visited: Kyoto/Lisbon, 2 on-deck: Iceland/Seoul, 3 guide drafts) exposed via `getTravelLocations()` and `getTravelGuideDrafts()`. No filesystem or MDX reads. Guide `eta` dates (Nov/Dec 2024, Jan 2025) are already stale as of 2026.
- **The `/travel` page (`src/app/travel/page.tsx`) is a fully-static server component** rendering four real sections (map+legend, mission ledger, guide drafts, footer CTA) — but every section is placeholder copy over the hardcoded arrays. The map heading literally reads "Map View (Preview)" / "Interactive Mapbox layer coming soon," and markers are positioned by array-index math, **ignoring the real lat/lng already in the data**.
- **One real MDX article exists but is orphaned** — `src/content/travel/paris-adventure.mdx` (complete frontmatter + `ImageGallery`/`ImageComparison` imports) has **no route rendering it** and its slug matches no location/guide id. `src/app/travel/[slug]/page.tsx` does not exist.
- **The full MDX toolchain is already in place and reusable** — `src/lib/mdx.ts` loaders are category-generic (`getAllSlugs('travel')` would read `src/content/travel/*.mdx` today with zero changes), and `src/app/blog/[id]/page.tsx` is a ready-made static-route template (`MDXRemote` + `generateStaticParams` + `generateMetadata`). `next-mdx-remote`, `gray-matter`, `@next/mdx`, `remark-gfm`, `rehype-highlight` are all installed and wired.
- **Two data models are disconnected and tests pin the placeholders** — `travel.ts` (locations/drafts) vs `mdx.ts` (real MDX content) never link. `__tests__/travel-lib.test.ts` and `__tests__/travel-page.test.tsx` assert exact fixture counts (2/2 locations, 3 "Draft Mode" badges), so any move to MDX-driven data breaks them and they must be rewritten.

## Target experience

Scoped to what static export can honestly deliver, in priority order:

- **List View (region-grouped) with real status badges** — locations grouped by region, each carrying a `Visited` / `Planning` / `In Progress` badge. Replaces the current flat ledger. Ships first, with **no external map dependency**.
- **Per-destination MDX Guide Pages** at `/travel/[slug]` — narrative + itinerary + gallery + a typed **Personal Radar** panel (gear, budget, mood, top tracks) rendered from frontmatter, not prose. Reuses the blog route contract and MDX components.
- **Interactive Map View** — a client-only, lazy-loaded map plotting `Been` vs `Planned` from the real `coords`, with a hover/click summary card. Loaded via `next/dynamic({ ssr: false })` on its own route so its bundle never touches the rest of the site.
- **Map/list sync + polish** — scroll-synced highlighting between list and map, "Flight Path" entry animation from Home, and a Packing overlay driven by the Radar `gear` data. All motion gets **reduced-motion fallbacks**.

Explicitly **out of scope / cut**: the Subscribe/notify CTA (no server under `output:'export'` — replace with a static `mailto:`), and any CMS/auth/save-state (open questions, not first-release work).

## Data model

MDX becomes the single source of truth; `getTravelLocations()` is *derived* from it so the existing page contract stays intact. The status union is widened to add `'planned'`, and `coords` (SITE_PLAN) is normalized against the existing `coordinates` field inside the loader.

```ts
// Canonical status — WIDEN the current 'visited' | 'onDeck' union in src/lib/travel.ts
export type TravelStatus = 'visited' | 'onDeck' | 'planned';

// Badge label derived for the list view
export type TravelBadge = 'Visited' | 'Planning' | 'In Progress';

export interface LatLng {
  lat: number;
  lng: number;
}

export interface PersonalRadar {
  gear: string[];
  budget: { currency: string; total: number; notes?: string } | string;
  mood: string[];
  topTracks?: { title: string; artist: string; url?: string }[];
}

// The fully-parsed destination — one per MDX file, coerced/validated in the loader.
export interface TravelDestination {
  slug: string;              // = filename, matches getAllSlugs('travel')
  title: string;             // required
  excerpt: string;           // required
  status: TravelStatus;      // required (widened union)
  coordinates: LatLng;       // normalized from frontmatter `coords`
  region?: string;           // for list grouping (new)
  country?: string;
  season?: string;           // e.g. 'Spring 2024'
  tags: string[];
  heroImage?: string;        // root-absolute under /public, e.g. '/travel/kyoto/hero.jpg'
  mapRoute?: string | LatLng[]; // GeoJSON path or ref into routes.json
  radar?: PersonalRadar;     // Personal Radar panel (typed, not prose)
  date?: string;
  readTime?: string;         // derivable via calculateReadingTime()
  author?: string;           // default 'JccL'
  content: string;           // raw MDX body from gray-matter
}
```

**MDX frontmatter schema** (`src/content/travel/{slug}.mdx`). YAML is untyped at rest — the loader coerces, fills defaults, and validates; never trust raw `gray-matter` `data`.

```yaml
---
title: "Kyoto"                      # required
excerpt: "Temple mornings and..."   # required
status: visited                     # visited | onDeck | planned
coords: { lat: 35.0116, lng: 135.7681 }  # required; normalized -> coordinates
region: "East Asia"
country: "Japan"
season: "Spring 2024"
tags: [temples, food, walking]
heroImage: /travel/kyoto/hero.jpg   # must live under /public
mapRoute: kyoto-loop                # optional; string ref or LatLng[]
date: 2024-04-12
author: JccL                        # optional
radar:                              # optional, each sub-field typed
  gear: [film camera, walking shoes]
  budget: { currency: JPY, total: 180000, notes: "8 nights" }
  mood: [contemplative, unhurried]
  topTracks:
    - { title: "Merry Christmas Mr. Lawrence", artist: "Ryuichi Sakamoto" }
---
```

## Map approach

**Recommended: MapLibre GL JS** with free, token-free tiles (OpenFreeMap public instance; Carto Positron/Dark Matter or self-hosted Protomaps PMTiles as equally keyless fallbacks), rendered inside a `'use client'` component loaded via `next/dynamic({ ssr: false })` on its own lazy route.

**Fallback: `@vnedyalk0v/react19-simple-maps`** (the React 19 fork of react-simple-maps) — bundled static GeoJSON, zero tiles, zero network, prerenderable, and it composes with the already-installed `gsap`/`framer-motion` for animated arcs and pulsing pins. Secondary fallback if a truly zoomable street-level map is later required: **react-leaflet v5 + Leaflet** (~42KB gzipped, token-free).

**Rationale & tradeoff.** The hard constraint is `output:'export'` on GitHub Pages: no server, no runtime secrets, everything client-only. That immediately **disqualifies Mapbox GL JS v3** — v2+ refuses to initialize without an access token, and any token on a static site is shipped to the browser (policy *and* security mismatch); it's also billed per map load. deck.gl is token-free but is the heaviest bundle, has the steepest API for plotting a few dozen pins, and usually needs a MapLibre basemap under it anyway (worst total weight). MapLibre wins the "wow but maintainable" brief: it's the actively-maintained BSD-2 official successor to Mapbox GL JS, gives smooth GPU vector-tile interaction, and has native marker/GeoJSON APIs perfect for `visited` vs `onDeck` styling (two colors or two layers). Its **only real cost is bundle size (~200–290KB gzipped)** — neutralized because it must be a `next/dynamic({ ssr:false })` client-only component code-split onto its own route, so it never enters the prerendered/initial bundle and downloads only when the map mounts. Cost/token: **$0, no account, no key.** The one testing tax: Jest has no WebGL, so the map component's unit test needs a jsdom WebGL/context mock (and the map child is mocked out in page tests).

## Content & routing

**Content directory (keep it FLAT).** `src/lib/mdx.ts` does `path.join(contentDirectory, category)` and reads a flat dir, so **do not** adopt SITE_PLAN's nested `travel/locations/*.mdx` (a subfolder returns nothing without a recursive loader). Layout:

```
src/content/travel/
  kyoto.mdx
  lisbon.mdx
  iceland-ring-road.mdx
  seoul.mdx
  paris-adventure.mdx     # existing — keep as a guide or leave as blog essay
  routes.json             # optional, multi-stop journeys; imported statically
```

**Typed loader** — extend the `src/lib/mdx.ts` pattern into a domain service *inside `src/lib/travel.ts`*, reusing `gray-matter` exactly as `getPostBySlug` does. All fs/gray-matter code is **server-only, build-time**; never import it into a `'use client'` file.

- `getTravelDestinationSlugs()` — `readdirSync('src/content/travel')`, filter `.mdx`, strip extension (travel-scoped clone of `getAllSlugs`).
- `getTravelDestinationBySlug(slug)` — `readFileSync` + `matter()`, then pass raw `data` through a `parseFrontmatter()` coercion helper that: fills defaults, **normalizes `coords` → `coordinates`**, widens `status`, validates the `radar` object, and computes `readTime` via `calculateReadingTime`. Throw on missing `title`, like `getPostBySlug`.
- `getAllTravelDestinations()` — map slugs → destinations, sort by status then date.
- `getTravelLocations()` — **derive** it by grouping `getAllTravelDestinations()` on status into `{ visited, onDeck }` (the exact shape `src/app/travel/page.tsx` and `travel-lib.test.ts` already consume, so nothing downstream breaks). `getTravelGuideDrafts()` can stay static initially or derive from `status: 'planned'`.

> Note: `jest.config.cjs` excludes `src/lib/mdx.ts` from coverage but **not** `src/lib/travel.ts`, so the new loader is coverage-tracked and must be unit-tested.

**Dynamic route** — create `src/app/travel/[slug]/page.tsx` as an async Server Component copying the `src/app/blog/[id]/page.tsx` contract:

- `export async function generateStaticParams()` → `getTravelDestinationSlugs().map(slug => ({ slug }))`. Under `output:'export'` this is **MANDATORY** (the blog route's `// optional` comment is wrong for export — without full enumeration the build fails on the dynamic segment).
- `export async function generateMetadata({ params })` — `const { slug } = await params` (params is a Promise in Next 15), `try/catch` around the loader to set title/description/keywords; catch → "Not Found" metadata.
- In the page: `const { slug } = await params`, load in `try/catch` → `notFound()` on throw. Keep it a **server component** so gray-matter/fs run at build; push the map into a separate `'use client'` child via `next/dynamic({ ssr:false })` with a static coords fallback in the prerendered HTML.
- `trailingSlash:true` means real URLs are `/travel/<slug>/` — build links as `` href={`/travel/${slug}`} `` and let Next add the slash. Ensure a static 404 exists (`dynamicParams` has no runtime effect under export).
- **Page chrome** (beyond the blog clone): (1) Hero band — `heroImage` via `next/image` + title + status badge + season; (2) typed **Personal Radar** panel; (3) map/coords block (client-only, static fallback); (4) article body — `<MDXRemote source={dest.content} components={MDXComponents} />` in the same `prose prose-lg dark:prose-invert` wrapper; (5) back link + prev/next nav. **Supply `dark:` variants** for the travel body — `MDXComponents.tsx` uses light-only gray text and the `/travel` route is dark-themed.

## Build sequence

Each milestone is independently shippable and keeps the site green.

### Milestone 1 — Data model + typed loader + real List View (no map dep)

**Goal:** MDX is the source of truth; the list renders real, region-grouped data with status badges. No external dependency.

- **Create** `src/content/travel/{kyoto,lisbon,iceland-ring-road,seoul}.mdx` — migrate the four hardcoded entries into frontmatter (schema above), body optional at this stage.
- **Modify** `src/lib/travel.ts` — widen `TravelStatus` to add `'planned'`; add `TravelDestination`/`PersonalRadar`/`LatLng` types + `parseFrontmatter()`; add `getTravelDestinationSlugs`, `getTravelDestinationBySlug`, `getAllTravelDestinations`; **re-derive** `getTravelLocations()`/`getTravelGuideDrafts()` from MDX (keeping their return shapes).
- **Modify** `src/app/travel/page.tsx` — group the list by `region`, render `Visited`/`Planning`/`In Progress` badges, remove the "once CMS wiring is ready" / "after schema finalization" copy. Keep the existing card/legend Tailwind shell.
- **Tests:** **add** `__tests__/travel-loader.test.ts` (slugs found; `getTravelDestinationBySlug('kyoto')` returns coerced `coordinates`, widened `status`, parsed `radar`; missing slug throws; missing-title defaults/throws per contract). **Rewrite** `__tests__/travel-lib.test.ts` and `__tests__/travel-page.test.tsx` to the new MDX-derived counts/ids (unpin the 2/2 and "3 Draft Mode" fixtures).

### Milestone 2 — MDX Guide routes at `/travel/[slug]`

**Goal:** every destination has a reachable, prerendered guide page. Orphaned `paris-adventure.mdx` becomes reachable (or is intentionally left as a blog essay).

- **Create** `src/app/travel/[slug]/page.tsx` — clone `blog/[id]/page.tsx`; add hero band, typed Personal Radar panel, article body via `MDXRemote` + `MDXComponents`, back/prev-next nav. **Mandatory** `generateStaticParams()` + `generateMetadata()`.
- **Modify** `src/components/mdx/MDXComponents.tsx` (or add a themed travel map) — add `dark:` text variants so the dark travel body is readable.
- **Modify** `src/app/travel/page.tsx` — make guide cards real links to `/travel/${slug}`, drop the static "Draft Mode" badge.
- **Tests:** **add** `__tests__/travel-slug-page.test.tsx` (async server-component render; mock `next/dynamic`, `next/image`, `next/navigation` `notFound`; assert hero title, status badge, Radar gear/budget/mood render from frontmatter). **Add** a `generateStaticParams` assertion: exactly one `{ slug }` per MDX file.

### Milestone 3 — Interactive Map View (MapLibre, client-only)

**Goal:** plot real `Been` vs `Planned` coords on a lazy, token-free map with hover/click summary cards.

- **Create** `src/components/travel/TravelMap.tsx` (`'use client'`) — MapLibre GL, OpenFreeMap tiles, two-layer/two-color markers from `coordinates`, click → summary card linking to the guide.
- **Create** `src/components/travel/TravelMapLoader.tsx` — `next/dynamic(() => import('./TravelMap'), { ssr:false })` with a static coords list as fallback.
- **Modify** `src/app/travel/page.tsx` — replace the fake index-math "Map View (Preview)" block with `TravelMapLoader`; fix the legend so rendered markers match legend colors.
- **Add** `maplibre-gl` dependency.
- **Tests:** **add** `__tests__/travel-map.test.tsx` with a jsdom WebGL/context mock; assert markers are created from the destination coords and the summary card renders on select. Keep other page tests mocking the map child so no WebGL loads.

### Milestone 4 — Sync, Flight Path entry, Packing overlay + a11y polish

**Goal:** the motion-heavy "wow" layer, all with reduced-motion fallbacks.

- **Create** `src/components/travel/PackingOverlay.tsx` — animated UI driven by `radar.gear` (framer-motion, already installed).
- **Modify** the map + list components to add scroll-synced highlight (map pans/zooms as the list scrolls; SITE_PLAN 6.3 "wire map/list sync").
- **Modify** `src/app/page.tsx` (or a Home component) — parallax runway → plane takeoff transition into the Travel map.
- **Add** `prefers-reduced-motion` fallbacks across all four interactions.
- **Modify** the footer — replace the Subscribe/beta CTA with a static `mailto:` (no server under export).
- **Tests:** **add** `__tests__/packing-overlay.test.tsx` (renders gear from Radar) and a reduced-motion assertion (static markup when `prefers-reduced-motion` is set).

## Decisions to confirm

- **Map provider / tiles** — recommend **MapLibre GL JS + OpenFreeMap** (free, keyless, no account). Fallback to `@vnedyalk0v/react19-simple-maps` if you'd rather ship zero runtime tile dependency, or react-leaflet if street-level zoom is required. *Default: MapLibre + OpenFreeMap.*
- **Canonical status vocabulary** — the plan mixes `Been`/`Planned` (map) with `Visited`/`Planning`/`In Progress` (list). Recommend the **frontmatter enum `visited | onDeck | planned`** as canonical, mapping to display labels `Visited` / `In Progress` / `Planning`. *Default: this three-value enum.*
- **Image hosting** — `TravelDestination` has no images today and there's no server-side optimization. Recommend committing hero/gallery images under `/public/travel/<slug>/…` (root-absolute paths, `images.unoptimized` already set). *Default: `/public`, keep files reasonably sized manually.* Flag: if later deployed to a GitHub *project* page with a `basePath`, hardcoded `/travel/...` paths break — centralize base handling now.
- **Scope of first release** — recommend shipping **Milestones 1–2** (real list + reachable MDX guides) as the launch, with the interactive map (M3) and motion polish (M4) as fast-follows. *Default: List + Guides first; map/animation after.*
- **`paris-adventure.mdx`** — keep as a travel guide (needs `status`/`coords` added) or leave as a blog photo-essay? *Default: leave as blog essay; author fresh destination guides for Kyoto/Lisbon/Iceland/Seoul.*
- **Filters / scroll-sync copy** — currently advertised, not built. *Default: keep scroll-sync (M4), drop standalone filters for v1 and remove the copy.*
- **CMS / auth / save-state** — SITE_PLAN open questions. *Default: no — manual MDX authoring and no user data for the first release.*

## New dependencies

- **`maplibre-gl`** — the interactive Map View (Milestone 3); token-free WebGL vector map, code-split behind `next/dynamic({ ssr:false })`. *Only new runtime dep required for the recommended path.*
- **(Fallback only) `@vnedyalk0v/react19-simple-maps`** — React 19 fork for the static-SVG fallback map; add **instead of** `maplibre-gl` if the zero-tile path is chosen. Pulls in `d3-geo` + `topojson-client`.

Everything else is already installed: `next-mdx-remote`, `gray-matter`, `@next/mdx`, `remark-gfm`, `rehype-highlight` (MDX pipeline), and `three` / `gsap` / `framer-motion` (Flight Path + Packing overlay + reduced-motion). No new dependency is needed for Milestones 1, 2, or 4.
