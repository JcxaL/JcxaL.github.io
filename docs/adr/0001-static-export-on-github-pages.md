---
status: accepted
date: 2026-07-07
---

# 0001 — Static export on GitHub Pages, media on R2, Cloudflare proxy in front

## Context and Problem Statement

The JccL Line is a personal travel site with no server-side needs, hosted for $0. It
must feel cinematic (heavy media, WebGL) while living inside GitHub Pages' verified
constraints (doc 07 D6): 1 GB site limit, ~100 GB/month soft bandwidth, 100 MB/file Git
limit, **Git LFS is not served by Pages**, and `Cache-Control` fixed at `max-age=600` —
which alone would break "buttery repeat visits." A static site also cannot hide API
keys, which constrains every downstream service choice.

## Decision Outcome

1. **Next.js 15 with `output: 'export'`** builds to `out/`, deployed by a custom GitHub
   Actions workflow (`configure-pages` → `upload-pages-artifact` → `deploy-pages`, doc
   09 §1.5). No SSR, ISR, route handlers, or middleware — all data is resolved at build
   time.
2. **Heavy media is offloaded to a Cloudflare R2 bucket** served as `media.jccl.me`
   (free tier: 10 GB storage, zero egress). Window loops, photo sets, PMTiles, and audio
   never enter the repo; URLs are composed only via `NEXT_PUBLIC_MEDIA_BASE`. Uploads go
   through `rclone sync` in CI. `public/` stays ≤ ~50 MB, with a >5 MB per-file guard.
3. **Cloudflare free zone proxies `jccl.me`** (orange-cloud) with Cache Rules:
   content-hashed `/_next/static/*` → edge+browser TTL 1 year; HTML → short TTL, purged
   on deploy; SSL Full (strict). This overrides Pages' fixed 10-minute cache.

## Consequences

- Good: $0 hosting with real CDN behavior; no secrets to leak; the whole site is a
  reproducible artifact CI can crawl, screenshot, and budget-assert (`du -sb out/`).
- Good: media discipline is structural — the 1 GB/bandwidth ceilings can't be hit by
  accident because heavy assets live on R2 by rule.
- Bad: everything dynamic must be precomputed; keyed third-party APIs are structurally
  disqualified (this decided ADR 0006's tile sources).
- Bad: static-export `<Link>` prefetch has known 404 bug classes — CI must crawl `out/`
  and fail on 404'd `_next/*.txt` (doc 08 §6).
- Constraint: `NEXT_PUBLIC_MEDIA_BASE` must be defined before the first place page ships;
  retrofitting media URLs touches every MDX file.
