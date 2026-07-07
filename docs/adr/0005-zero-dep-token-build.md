---
status: accepted
date: 2026-07-07
---

# 0005 — Zero-dependency token build; graduate to Style Dictionary when needed

## Context and Problem Statement

Design tokens are the machine contract of this project (doc 08 §4): `tokens/tokens.json`
(DTCG-flavored) is the single source for colors, type stacks, motion durations/easings,
and layout radii, and components may consume **only** the generated CSS custom
properties — never raw values. Something must compile JSON → `src/styles/tokens.css`.
Style Dictionary v4/v5 is the standard tool, but today we need exactly one output
format, and every dependency is surface area for an agent-maintained repo.

## Decision Outcome

**Tokens are built by `scripts/build-tokens.mjs` — a zero-dependency Node script**
(~60 lines: flatten DTCG groups, kebab-case the path, emit `--color-lines-a`-style
custom properties into `src/styles/tokens.css`).

- Runs as `pnpm tokens` and automatically via `prebuild`, so `pnpm build` can never ship
  stale tokens.
- **Edit `tokens/tokens.json`, never the generated `tokens.css`** (CLAUDE.md rule 1);
  `tokens/schema.ts` types the source.
- **Graduation trigger:** the moment tokens need a second platform output — MapLibre
  style JSON paint values (planned in doc 08 §4), Tailwind `@theme` beyond plain CSS
  vars, or any native target — switch to **Style Dictionary v4/v5** (Apache-2.0,
  actively maintained, DTCG-stable since 2025.10). Do not grow the script into a
  homemade Style Dictionary.

## Consequences

- Good: zero install cost, instant builds, trivially auditable; the naming convention
  (`color.lines.a` → `--color-lines-a`) is documented in the script header and stable.
- Good: the DTCG-flavored source means graduation is a build-tool swap, not a token
  rewrite.
- Bad: no transforms, themes, aliases-across-files, or platform outputs — by design.
  Anyone tempted to add those features to the script should read the graduation trigger
  instead.
- Constraint: MapLibre styles currently duplicate token values by hand (acceptable while
  there is one map style); that duplication is itself the graduation signal.
