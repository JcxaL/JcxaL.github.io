# The JccL Line — Travel Routine

## Mission
Maintain `jccl.me/travel` — a growing, transit-themed collection of travel
**field notes, photo essays, and interactive travel interfaces**. It ships
**incrementally**: add one "stop" whenever there's something to show, deploy,
repeat. Unlike the daily playground, there is **no daily cadence and no
"exactly one active" rule** — the line just gets longer over time.

`/travel` is a self-contained static bundle (exactly like `playground/`).
The full Next.js relaunch of the site lives on the WIP branch
`claude/travel-website-redesign-6a8dah`; polished pieces from there get
**ported down** into a `/travel` stop when they're ready to be public.

## How it deploys
- **Push to:** `main`. GitHub Pages auto-deploys via
  `.github/workflows/deploy.yml`, which copies `travel/` into the build output
  at `/travel/` (right alongside `/playground/`). Neither replaces the site
  root — `/` stays the "under construction" homepage.
- The workflow's `validate-travel` step only checks that `travel/manifest.json`
  is valid JSON, that `travel/index.html` (the hub) exists, and that every stop
  listed in the manifest has an `index.html`. Sparse/empty is fine.
- Infra changes (this doc, the hub, the workflow) go through the PR + review
  flow. Adding a **new stop** is content — push straight to `main`.

## Layout
```
travel/
├── index.html            ← the line hub (reads manifest.json, renders stop cards)
├── manifest.json         ← append-only registry of stops
└── stops/
    └── YYYY-MM-DD-{id}/   ← one travel stop
        ├── index.html     ← self-contained page for this stop
        └── meta.json      ← stop metadata
```

## Folder naming
Every stop folder is **`YYYY-MM-DD-{id}`**, where `{id}` is the trailing ID of
the session branch `claude/<slug>-<ID>` (same convention as the playground).
Set both `date` and `folder` in every manifest + meta entry.

## Adding a stop — the routine

### 1. Read current state
Read `travel/manifest.json`; note the highest `stop_number` (next = +1) and the
current `status:"active"` stop (you'll flip it to `archived`).

### 2. Build the stop
Create `travel/stops/YYYY-MM-DD-{id}/index.html`. Bar for a stop:
- **Self-contained** — single HTML, inline CSS+JS, no CDN, no external fonts
  (use `system-ui`), no runtime external API.
- **Back link** — a fixed top-left glass pill: `<a class="back" href="../">← The JccL Line</a>`.
- **On-theme** — transit/station language fits the line, but the content is
  yours: a photo essay, a map, a departure-board interface, a journal entry.
- **Mobile-first, 60fps, dark-friendly.**
- **A `line` category** drives the hub card's accent color:
  `intro` #38bdf8 · `journal` #34d399 · `photo` #fbbf24 · `interface` #a78bfa · `note` #f87171.

### 3. Verify
- `node --check` the inline JS (extract from `<script>` tags).
- Load it (Playwright/`file://`) — no console errors; interactions fire; any
  export/download produces a non-zero blob.

### 4. Write `travel/stops/YYYY-MM-DD-{id}/meta.json`
```json
{
  "date": "YYYY-MM-DD",
  "folder": "YYYY-MM-DD-{id}",
  "stop_number": N,
  "title": "Under 40 chars",
  "description": "One-sentence hook (under 140 chars).",
  "concept": "2–4 sentences on what it is.",
  "line": "journal | photo | interface | note",
  "features": ["...", "..."],
  "tags": ["...", "..."],
  "palette": ["#hex1", "#hex2", "#hex3"],
  "tech": ["..."],
  "status": "active",
  "verified": true
}
```

### 5. Update `travel/manifest.json`
1. Flip the previous active stop `"status": "active" → "archived"`.
2. Append today's stop (mirror meta.json: date, folder, stop_number, title,
   description, line, tags, palette, status="active").
3. Append-only — never delete or reorder past stops.

### 6. Push & verify CI
```bash
git checkout main && git pull origin main
git add travel/
git commit -m "travel(stop-N): <title>"
git push -u origin main
```
Confirm the deploy workflow is green, then check
`jccl.me/travel` shows the new stop at the top of the line.

## What NOT to do
- Don't touch `src/`, `package.json`, or `playground/` from this routine.
- Don't add CDN scripts, external fonts, or runtime external API calls.
- Don't delete or rename past stop folders — permanent record.
- Don't modify `travel/index.html` (the hub) casually — that's infra (PR flow).
- Don't claim someone else's photos/words as your own — credit sources.

## Definition of done
- [ ] `travel/stops/YYYY-MM-DD-{id}/index.html` is self-contained + verified.
- [ ] `meta.json` present with `"verified": true`, matching the manifest entry.
- [ ] `travel/manifest.json`: previous stop `archived`, new stop `active`.
- [ ] Pushed to `main`; CI green; `jccl.me/travel` shows the new stop.
