# Daily Playground — Daily Build Routine

## Mission
You maintain `jcxal/jcxal.github.io`'s **daily playground** — a public,
constantly-rotating interactive web experience that runs while the owner's
real Next.js site is still under construction.

Each day you ship ONE new self-contained interactive "experience" (Daily
Playground) **and** ONE new "UI Spotlight" entry sourced from a trending
GitHub repo — both go live at jccl.me. Every past day is preserved forever;
visitors browse both sections through built-in Time Machine drawers.

Today's date: use `date +%Y-%m-%d` for the date portion of folder names.

## Repository state when you arrive
- Branch you push to: `daily-playground` (already exists, do not recreate)
- Branch you develop on: `claude/<session-id>` (the session's auto-assigned branch).
  Merge into `daily-playground` and push.
- GitHub Pages is wired to deploy `daily-playground` automatically via
  `.github/workflows/deploy-playground.yml`. Do not touch that workflow
  unless explicitly told to (CI also validates Spotlight now).
- The Next.js source (`src/`, `package.json`, `next.config.ts`, etc.) lives
  on the same branch but is NOT used by the deployment. Leave it alone.

## Directory layout (do not change structure)
```
playground/
├── index.html                        ← portal hub — only modify for bug fixes
├── spotlight/
│   ├── index.html                    ← spotlight hub — only modify for bug fixes
│   └── days/
│       ├── manifest.json             ← append-only spotlight registry
│       └── YYYY-MM-DD-{id}/          ← daily spotlight folder
│           ├── index.html
│           └── meta.json
└── days/
    ├── manifest.json                 ← append-only playground registry
    └── YYYY-MM-DD-{id}/              ← daily playground folder
        ├── index.html
        └── meta.json
```

## Folder naming convention — CRITICAL
Every new folder uses the format **`YYYY-MM-DD-{id}`** where `{id}` is the
first 5 characters of the session slug from the branch name
`claude/<slug>-<ID>` → use the `<ID>` portion. Example:
- Branch `claude/affectionate-tesla-KIwYj` → ID is `KIwYj`
- Folder: `2026-05-19-KIwYj`

This prevents conflicts when multiple runs happen on the same day. Old entries
with plain `YYYY-MM-DD` folders still work (the portal falls back to `date`
if `folder` is absent).

**Always** set both fields in manifest entries:
```json
"date": "YYYY-MM-DD",
"folder": "YYYY-MM-DD-{id}",
```

## The daily 6-step routine (do exactly this)

### Step 1 — Read the current manifests
```
Read playground/days/manifest.json
Read playground/spotlight/manifest.json
```
Note the previous day_number in each (today's = previous + 1 for each).
Note which entry is currently `"status": "active"` in each manifest.

### Step 2 — Build today's Playground experience
Create `playground/days/YYYY-MM-DD-{id}/index.html` — ONE self-contained
HTML file, inline CSS + inline JS, no external dependencies, no build step.

**Content rules (do not ship below this bar):**
- Must be **visually impressive** — assume the visitor is a developer or
  designer who has seen everything; surprise them
- Must be **immediately interactive** — no instructions required; hover,
  click, drag, or scroll produces a satisfying response in <1 second
- Must be **mobile-friendly** — touch events handled, viewport correct,
  runs 60fps on a mid-range phone
- Must be **fully self-contained** — single .html file, no fetch() calls
  to external APIs, no CDN scripts, no Google Fonts (use system-ui stack)
- Must be **a fresh idea** — read past meta.json files to confirm you're
  not duplicating a previous day's core concept

**Concept rotation (pick a different category each day):**
| Category               | Examples |
|------------------------|----------|
| Generative art         | flow fields, reaction-diffusion, l-systems, voronoi |
| Physics toys           | cloth sim, soft-body, fluid sim, springs, gravity wells |
| Audio                  | Web Audio synthesizer, beat sequencer, frequency visualizer |
| 3D / WebGL             | shader art, raymarching, instanced meshes (vanilla WebGL only) |
| Typography             | kinetic type, variable-font playground, ASCII art |
| Data visualization     | network graphs, sunburst, force-directed |
| UI/UX trend showcase   | bento grids, glassmorphism, scroll-jacking, magnetic buttons |
| Game-y                 | infinite runner, mini-puzzle, falling-sand, Game of Life variant |

### Step 3 — Write today's Playground metadata
Create `playground/days/YYYY-MM-DD-{id}/meta.json`:
```json
{
  "date": "YYYY-MM-DD",
  "folder": "YYYY-MM-DD-{id}",
  "day_number": N,
  "title": "Title (under 40 chars)",
  "description": "One-sentence hook (under 140 chars).",
  "concept": "2-4 sentence elaboration.",
  "tags": ["category", "tech", "vibe"],
  "palette": ["#hex1", "#hex2", "#hex3", "#hex4", "#hex5"],
  "tech": ["Canvas API", "Web Audio", "..."],
  "status": "active",
  "interaction": { "mouse": "...", "click": "...", "touch": "..." }
}
```

### Step 4 — Source today's UI Spotlight
**Search GitHub / the web for trending UI:**
1. Use `WebSearch` to find trending UI repos or components released recently.
   Queries like: `site:github.com trending animation component YYYY`,
   `"new release" UI component CSS animation`, `codrops tutorial YYYY`,
   or check awwwards.com / codepen trending.
2. Pick ONE specific repo or component that is:
   - Visually striking (animation, interaction, visual design)
   - Recently released or currently trending
   - Has a clear, reproducible interaction pattern
3. Use `mcp__github__get_file_contents` or `WebFetch` to read its source
4. **Reimplement** the core concept as a standalone `index.html` — do not
   copy code verbatim; understand and recreate it with original CSS/JS.
   Keep the spirit of the source, add the `source` + `source_url` fields.

Create `playground/spotlight/days/YYYY-MM-DD-{id}/index.html` with the demo.
The demo must be self-contained, interactive, and credit the original source
in a subtle footer note ("Inspired by [repo] — UI Spotlight Nº N").

### Step 5 — Write today's Spotlight metadata
Create `playground/spotlight/days/YYYY-MM-DD-{id}/meta.json`:
```json
{
  "date": "YYYY-MM-DD",
  "folder": "YYYY-MM-DD-{id}",
  "day_number": N,
  "title": "Title (under 40 chars)",
  "description": "One-sentence hook (under 140 chars).",
  "concept": "2-4 sentences on the UI pattern and why it's trending.",
  "source": "Short human-readable source credit",
  "source_url": "https://github.com/...",
  "tags": ["pattern", "category", "vibe"],
  "palette": ["#hex1", "#hex2", "#hex3"],
  "tech": ["Vanilla JS", "CSS Custom Properties", "..."],
  "status": "active",
  "interaction": { "mouse": "...", "click": "...", "touch": "..." }
}
```

### Step 6 — Update both manifests
**playground/days/manifest.json:**
1. Flip previous active day's `"status"` → `"archived"`
2. Append today's entry (mirror meta.json fields, include `folder`)
3. Array is append-only — never delete or reorder

**playground/spotlight/manifest.json:**
1. Flip previous active spotlight's `"status"` → `"archived"`
2. Append today's Spotlight entry (mirror meta.json fields, include `folder`)
3. Array is append-only

## Push & CI

```bash
git checkout daily-playground
git pull origin daily-playground
git add playground/days/YYYY-MM-DD-{id}/
git add playground/spotlight/days/YYYY-MM-DD-{id}/
git add playground/days/manifest.json
git add playground/spotlight/manifest.json
git commit -m "feat(day-N): <playground-title> + spotlight: <spotlight-title>"
git push -u origin daily-playground
```

The `deploy-playground.yml` workflow will:
1. **validate** job — checks both manifests are valid JSON, exactly one
   active Playground day, at most one active Spotlight day, and both active
   entries have their `index.html`. **Fix before walking away if red.**
2. **deploy** job — bundles `playground/` + `CNAME` + `.nojekyll`.

## The Welcome popup
`playground/index.html` has a dismissible modal popup (`#wm`) that tells
visitors the full site is incoming and links to both sections. To reset it
for all visitors (e.g., when you update the copy), bump the `WM_KEY` constant
from `jccl_welcome_v1` to `jccl_welcome_v2` etc. Do not remove the popup.

## Failure modes
| Symptom | Cause | Fix |
|---|---|---|
| Validate: "Expected 1 active day, found 2" | Forgot to archive yesterday | Edit manifest, flip old to `"archived"`, push |
| Validate: "Active day HTML missing" | folder/date mismatch | Check manifest `folder` field matches actual directory name |
| Validate: "spotlight manifest has 2 active" | Forgot to archive yesterday's spotlight | Same as above for spotlight manifest |
| Portal loads but iframe blank | JS error in day's HTML | Open the day's index.html standalone; fix error |
| Deploy: "Branch not allowed" | github-pages env protection | Settings → Environments → github-pages → allow `daily-playground` |

## What NOT to do
- Don't modify `playground/index.html` or `playground/spotlight/index.html`
  casually — only for bug fixes or explicit feature requests
- Don't modify `.github/workflows/deploy-playground.yml` unless asked
- Don't delete or rename past folders — they're permanent
- Don't add external CDN scripts, fonts, or images to day content
- Don't push to `main` — that's the real Next.js site
- Don't open a PR — push directly to `daily-playground`
- Don't write a README or design doc — just ship

## Definition of done
- `playground/days/YYYY-MM-DD-{id}/index.html` exists and works standalone
- `playground/days/YYYY-MM-DD-{id}/meta.json` exists and matches manifest entry
- `playground/spotlight/days/YYYY-MM-DD-{id}/index.html` exists and works standalone
- `playground/spotlight/days/YYYY-MM-DD-{id}/meta.json` exists and matches spotlight manifest
- Both manifests: yesterday=archived, today=active
- Committed and pushed to `daily-playground`
- CI is green (validate + deploy both pass)
- jccl.me shows the new Playground at the top of the Time Machine drawer
- jccl.me/spotlight/ shows the new UI Spotlight at the top of its drawer
