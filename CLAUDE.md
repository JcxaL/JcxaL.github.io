# Daily Playground — Daily Build Routine (v2)

## Mission
You maintain `jcxal/jcxal.github.io`'s **daily playground** — a public,
constantly-rotating set of interactive web experiences that lives at jccl.me
while the owner's real Next.js site is under construction.

**Each day you ship TWO things:**
1. **Playground** — ONE substantial mini-app (your own original idea — think
   "mini website" or "mini plugin", not just a visual toy)
2. **UI Spotlight** — FIVE live demos recreating the day's hottest UI/UX
   patterns sourced from across the design web

Visitors flip between the two modes via an **iOS-style toggle at the top of
the page**. Every past day is preserved forever in Time Machine drawers.

Today's date: use `date +%Y-%m-%d` as the date portion of new folder names.

## Repository state when you arrive
- **Push to:** `daily-playground` branch (exists; do not recreate)
- **Develop on:** `claude/<session-slug>` (auto-assigned). Merge → push.
- **GitHub Pages** auto-deploys `daily-playground` via
  `.github/workflows/deploy-playground.yml`. CI validates BOTH manifests
  AND the 5-drop spotlight structure (presence of `1/`..`5/index.html`,
  meta.json `drops` array length). Don't touch the workflow unless asked.
- **Next.js source** (`src/`, `package.json`, etc.) lives on the same branch
  but is NOT deployed. Leave it alone.
- **Persistent infrastructure** — iOS mode-toggle, welcome popup, and both
  Time Machine hubs live in `playground/index.html` and
  `playground/spotlight/index.html`. Don't modify casually.

## Directory layout (do not restructure)
```
CLAUDE.md                                  ← these instructions
playground/
├── index.html                             ← portal hub + toggle + popup
├── spotlight/
│   ├── index.html                         ← spotlight hub + toggle
│   ├── manifest.json                      ← append-only spotlight registry
│   └── days/
│       └── YYYY-MM-DD-{id}/               ← daily spotlight folder
│           ├── index.html                 ← 5-up gallery for the day
│           ├── 1/index.html               ← drop 1 standalone demo
│           ├── 2/index.html               ← drop 2
│           ├── 3/index.html               ← drop 3
│           ├── 4/index.html               ← drop 4
│           ├── 5/index.html               ← drop 5
│           └── meta.json                  ← day metadata + 5 drops array
└── days/
    ├── manifest.json                      ← append-only playground registry
    └── YYYY-MM-DD-{id}/                   ← daily playground mini-app
        ├── index.html
        └── meta.json
```

## Folder naming — CRITICAL
Every new folder uses **`YYYY-MM-DD-{id}`** where `{id}` is the trailing
identifier from your session branch `claude/<slug>-<ID>`:
- Branch `claude/affectionate-tesla-KIwYj` → ID is `KIwYj`
- Folder: `2026-05-19-KIwYj`

Always set BOTH fields in every new manifest entry:
```json
"date":   "YYYY-MM-DD",
"folder": "YYYY-MM-DD-{id}",
```

---

# The daily 9-step routine

## Step 1 — Read current state
```
Read playground/days/manifest.json
Read playground/spotlight/manifest.json
```
For each, note: previous `day_number` (today's = previous + 1, tracked
independently), the currently-active entry (you'll archive it), and past
`tags`/`source_url`s so today's work doesn't duplicate.

## Step 2 — Build today's Playground **mini-app**
Create `playground/days/YYYY-MM-DD-{id}/index.html`.

**This is the bar — playground entries are real mini-apps, not toys:**
- **Multi-mode / multi-feature** — at least 3 distinct things the user can
  do; not a single one-trick visual. Different brushes, presets, levels,
  modes, instruments, parameter sliders — substance.
- **Functional output** — when applicable, let the user **save / export /
  share** their creation. Examples:
  - Synthesizer → record + export as WAV download
  - Drawing tool → export PNG
  - Sequencer → save pattern as URL hash or downloadable JSON
  - Game → save high score to localStorage, share-link the seed
- **Persistent state** — localStorage where it makes sense
- **Immediately interactive** — first input produces a satisfying response
  in <1 second; no instructions wall
- **Mobile-first** — touch handled, 60fps on a mid-range phone
- **Visually impressive** — the visitor is a developer who has seen
  everything; surprise them with polish
- **Fully self-contained** — single .html, inline CSS+JS, no CDN, no
  Google Fonts (use system-ui), no runtime external API
- **A fresh idea** — read past meta.json files; do not repeat a category
  from the last 5 days

**Concept rotation — pick a different category than the last 3 days:**
| Category               | Mini-app examples (note: "mini-APP", not "demo") |
|------------------------|----------------------------------------------------|
| Audio / synthesis      | Synth with 4 oscillators + recording + WAV export · Drum sequencer with pattern save · Ambient generator w/ download |
| Generative art         | Flow-field painter w/ PNG export · Reaction-diffusion w/ presets and screenshot · L-system designer w/ shareable URL |
| Physics toys           | Cloth tailor (cut, pin, drape, save shape) · Spring sandbox w/ multiple bodies · Fluid sim w/ palettes |
| 3D / WebGL             | Shader playground w/ live editor · Particle system editor · Raymarching scene builder |
| Typography             | Variable-font playground w/ animation export · Kinetic-type generator · Custom font weaver |
| Data visualization     | Network graph editor · Force-directed playground w/ save · Custom sunburst builder |
| Game-y                 | Mini-roguelike w/ seed share · Falling-sand workshop w/ recipes · GOL variant w/ pattern library |

**Examples of the right size:** a 4-voice synth where you can layer
oscillators, tweak ADSR per voice, record a 16-bar loop, and download it
as a `.wav` file. NOT just "a piano on the screen".

## Step 3 — VERIFY the Playground works
**Do not ship Playground without verifying.** Use these tools:

1. **Lint with node:**
   ```bash
   node --check <(extract JS from <script> tags)
   ```
   or pipe inline JS through `node -e`.

2. **Headless browser test (preferred when feasible):**
   ```bash
   npx -y playwright install chromium 2>/dev/null
   ```
   Then write a short script that loads the page in a `file://` URL,
   waits for the canvas/audio to be ready, simulates click/drag/keypress,
   and checks no console errors occurred. Spot-check:
   - **Audio:** AudioContext starts on user gesture; verify nodes connect
   - **Canvas/WebGL:** context created; first frame draws (peek pixel)
   - **Saved data:** localStorage write/read round-trips
   - **Export:** download path produces a Blob with non-zero size — don't
     ship a "Download" button that downloads 0 bytes
   - **Mobile:** simulate `pointer:coarse` viewport, confirm touch handlers fire

3. **Code self-review checklist (always):**
   - Every event listener has a corresponding handler that exists
   - Every `getElementById` ID exists in the HTML
   - All shader uniforms are set before `drawArrays`
   - AudioContext is created after first user gesture (not on load)
   - `requestAnimationFrame` loops exit cleanly when needed
   - No `console.error` paths the user can stumble into

**If something is broken, fix it before moving on.** A broken Playground
day is worse than no day.

## Step 4 — Write Playground metadata
Create `playground/days/YYYY-MM-DD-{id}/meta.json`:
```json
{
  "date": "YYYY-MM-DD",
  "folder": "YYYY-MM-DD-{id}",
  "day_number": N,
  "title": "Title (under 40 chars)",
  "description": "One-sentence hook (under 140 chars).",
  "concept": "2–4 sentence elaboration — what's the app, what can users do.",
  "features": ["multi-feature 1", "feature 2", "feature 3", "export/save feature"],
  "tags": ["category", "tech", "vibe"],
  "palette": ["#hex1", "#hex2", "#hex3", "#hex4", "#hex5"],
  "tech": ["Web Audio API", "Canvas", "MediaRecorder", "..."],
  "status": "active",
  "interaction": { "mouse": "...", "click": "...", "touch": "...", "keyboard": "..." },
  "verified": true
}
```

## Step 5 — Research today's 5 UI Spotlights
You're a design newsletter editor curating today's must-see UI drops.
You need **5 distinct, currently-trending UI patterns** — different
categories, different sources, all visually striking.

**Diversify across these 5 buckets — one drop per bucket:**

| # | Bucket            | Looking for |
|---|-------------------|-------------|
| 1 | **Animation**     | Scroll-triggered, GSAP-style timeline, CSS keyframe wow-effect |
| 2 | **Layout**        | Bento grid, masonry trick, asymmetric hero, glassmorphism, dock |
| 3 | **Typography**    | Variable-font effect, kinetic type, text-distort, hover-reveal |
| 4 | **Micro-interaction** | Magnetic button, custom cursor, hover-shimmer, ripple, drag-snap |
| 5 | **Component**     | Slider, modal, accordion, command-palette, toast, menu — done in a NEW way |

**Where to scout (work top-down, find one per bucket):**

1. **GitHub** (most authoritative for "released this month")
   - `mcp__github__search_repositories` with queries like:
     - `topic:animation pushed:>YYYY-MM-DD sort:stars`
     - `topic:ui topic:css pushed:>YYYY-MM-DD`
     - `topic:web-components created:>YYYY-MM-DD sort:stars`
     - `magic-ui OR aceternity-ui OR motion pushed:>YYYY-MM-DD`
   - For each candidate, `mcp__github__get_file_contents` to read the
     actual technique

2. **Curated design feeds** (use `WebFetch`)
   - codrops.com (articles in the last 30 days have the best demos)
   - awwwards.com/sites-of-the-day
   - codepen.io/picks
   - 21st.dev, ui.aceternity.com, magicui.design, originui.com
   - cssdb.com, animista.net (for new CSS features in the wild)

3. **Trend signals** (use `WebSearch`)
   - `"just released" UI animation YYYY`
   - `viral CSS effect YYYY`
   - `site:github.com trending CSS animation pushed:>YYYY-MM-DD`

**Each of the 5 candidates must be:**
- **Recently released or trending** (last ~60 days; older only if a
  rediscovered classic going viral right now)
- **From a different source** than the other 4 (no two drops from the
  same repo / author / site)
- **Visually striking** — stops scrolling
- **Reproducible in vanilla HTML/CSS/JS** in under ~250 lines per drop
- **Distinct from past spotlight entries** (grep past `source_url`s)

**TRY EACH ONE before committing to it.** Read enough of the source to
understand the mechanism — don't pick something you don't understand.

## Step 6 — Build all 5 Spotlight demos
Create `playground/spotlight/days/YYYY-MM-DD-{id}/`:
- `1/index.html` through `5/index.html` — each a standalone fullscreen demo
- `index.html` — a **5-up gallery page** that previews all 5 today's drops
  as cards (each card links to its drop folder, e.g. `1/`, `2/` etc.)
- `meta.json` — see Step 7

**Rules per drop:**
- **Reimplement, don't copy-paste** — understand and rewrite with your own
  structure and naming
- **Isolate the core technique** — strip unrelated layout/branding so the
  pattern is the star
- **Show enough to feel it** — at least 3 instances of the effect (e.g.,
  5 magnetic buttons not 1; 3 animated text variants not 1)
- **Tunable parameters** when the effect has them — small debug panel
  (top-right, glass card style). Hide on mobile if cluttered.
- **Back link** — every drop's `index.html` must include
  `<a href="../" class="back-link">← All 5 drops</a>` in a fixed top-left
  glass-pill so users can return to the gallery
- **Credit the source** — small unobtrusive footer:
  `"Inspired by [author/repo] · UI Spotlight Day N · Drop #X"`
- **Same self-contained rules as Playground**: single HTML per drop,
  no CDN, no external fonts, mobile-friendly, 60fps

**Verify each drop loads and the effect actually fires** — at minimum
spot-check 2 of the 5 with `node --check` for JS validity + load test.

**Gallery (`index.html`) requirements:**
- Hero header introducing the day's theme
- A bucket-color legend
- 5 cards in a responsive grid, each with: drop number, bucket tag, title,
  description, source credit, "Open →" affordance
- Each card is an `<a href="N/">` link to its drop
- Bucket color theming: micro-interaction=#fbbf24, animation=#38bdf8,
  layout=#34d399, typography=#f87171, component=#a78bfa

## Step 7 — Write Spotlight metadata
Create `playground/spotlight/days/YYYY-MM-DD-{id}/meta.json`:
```json
{
  "date": "YYYY-MM-DD",
  "folder": "YYYY-MM-DD-{id}",
  "day_number": N,
  "title": "Day-level title (e.g. 'Magnetism, Bento, Kinetic Type')",
  "description": "One-sentence summary of today's 5 drops (under 140 chars).",
  "palette": ["#hex1", "#hex2", "#hex3"],
  "status": "active",
  "verified": true,
  "drops": [
    {
      "id": "1",
      "bucket": "micro-interaction",
      "title": "Drop title (under 40 chars)",
      "description": "One-sentence hook (under 140 chars).",
      "concept": "2–3 sentences on what it is and why it's hot.",
      "source": "Human-readable credit, e.g. 'author/repo + codrops tutorial'",
      "source_url": "https://github.com/... or https://codrops.com/...",
      "tags": ["pattern", "tech"],
      "tech": ["Vanilla JS", "CSS Custom Properties"],
      "interaction": { "mouse": "...", "click": "...", "touch": "..." }
    },
    { "id": "2", "bucket": "animation", "...": "..." },
    { "id": "3", "bucket": "layout", "...": "..." },
    { "id": "4", "bucket": "typography", "...": "..." },
    { "id": "5", "bucket": "component", "...": "..." }
  ]
}
```

## Step 8 — Update both manifests

**`playground/days/manifest.json`:**
1. Flip previous active day `"status"`: `"active"` → `"archived"`
2. Append today's entry (mirror meta.json: date, folder, day_number, title,
   description, tags, palette, tech, status="active")
3. Append-only — never delete or reorder

**`playground/spotlight/manifest.json`:**
1. Flip previous active spotlight `"status"`: `"active"` → `"archived"`
2. Append today's day-level entry with `"drops_count": 5` and a `"buckets"`
   array listing the 5 bucket names in order
3. Append-only

## Step 9 — Push & verify CI

```bash
git checkout daily-playground
git pull origin daily-playground
git add playground/days/YYYY-MM-DD-{id}/
git add playground/spotlight/days/YYYY-MM-DD-{id}/
git add playground/days/manifest.json
git add playground/spotlight/manifest.json
git commit -m "feat(day-N): <playground-title> + 5 spotlights (<5-bucket-summary>)"
git push -u origin daily-playground
```

The `deploy-playground.yml` workflow runs:

1. **validate** —
   - Both manifests are valid JSON
   - Exactly 1 active Playground; its `index.html` exists
   - At most 1 active Spotlight day; its gallery `index.html` exists AND
     when `drops_count > 1`, all `{1..N}/index.html` files exist AND
     `meta.json` has exactly `drops_count` entries in `drops` array
2. **deploy** — bundles `playground/` + `CNAME` + `.nojekyll` to Pages

**Confirm green via `mcp__github__get_commit`.** If red: read the failed
step's log, fix root cause, push new commit. Never `--no-verify`.

---

## Persistent infrastructure — what's already in place
- **iOS-style mode toggle** at the top of both hub pages — Playground (left)
  vs Spotlight (right). Slider position reflects the current page; clicking
  flips to the other. Uses a sliding pill thumb with spring easing.
  **Do not remove or restyle.**
- **Welcome popup** (`#wm`) on `playground/index.html` — once-per-browser
  via `localStorage` key `WM_KEY`. To force-show again, bump from
  `jccl_welcome_v2` → `v3`. **Do not remove.**
- **Time Machine drawers** on both hubs — auto-populated from manifests.
  Spotlight cards show a `"5 drops"` pill when `drops_count > 1` and open
  the day's gallery `index.html`.

## Failure modes
| Symptom | Cause | Fix |
|---|---|---|
| `Expected 1 active day, found 2` | Forgot to archive yesterday | Edit manifest, flip old to `archived`, push |
| `Active day HTML missing` | `folder` field mismatch | Align manifest `folder` to actual directory name |
| `Spotlight drop missing` | Missing one of `1/..5/index.html` | Create the missing demo files |
| `meta.json has X drops, manifest says Y` | `drops_count` mismatch | Make them equal (count of drops array = drops_count) |
| Audio silent on mobile | AudioContext created on load instead of first gesture | Move `new AudioContext()` into first click handler |
| Export downloads 0 bytes | Forgot to populate Blob before download | Re-verify export path with playwright; fix encoder |
| Branch not allowed | github-pages env protection | Settings → Environments → github-pages → allow `daily-playground` |

## What NOT to do
- Don't modify `playground/index.html` or `playground/spotlight/index.html`
  casually — only for bug fixes or explicit feature requests
- Don't modify `.github/workflows/deploy-playground.yml` unless asked
- Don't delete or rename past day folders — permanent record
- Don't add CDN scripts, external fonts, or runtime external API calls
- Don't push to `main` — that's the real Next.js site
- Don't open a PR — push directly to `daily-playground`
- Don't claim a Spotlight pattern as your own — always credit `source_url`
- Don't ship without verifying (Step 3 + Step 6 verification)
- Don't write a README per day — meta.json is the record

## Definition of done
- [ ] `playground/days/YYYY-MM-DD-{id}/index.html` is a real mini-app with
      ≥3 features, save/export where applicable, **verified** functional
- [ ] `playground/days/YYYY-MM-DD-{id}/meta.json` matches manifest entry
      with `"verified": true`
- [ ] `playground/spotlight/days/YYYY-MM-DD-{id}/` contains:
      - 5 working demos: `1/`, `2/`, `3/`, `4/`, `5/index.html`
      - 5-up gallery `index.html` linking to each drop
      - `meta.json` with exactly 5 `drops`, one per bucket, distinct sources
- [ ] Each drop's `index.html` has a `← All 5 drops` back link
- [ ] Both manifests: yesterday `"archived"`, today `"active"`
- [ ] Committed and pushed to `daily-playground`
- [ ] CI green (validate + deploy)
- [ ] jccl.me (Playground) shows new day at top of Time Machine
- [ ] jccl.me/spotlight/ shows new 5-up gallery; iOS toggle works on both pages

Begin.
