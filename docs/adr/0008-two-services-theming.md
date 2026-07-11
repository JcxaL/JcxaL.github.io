# 0008 — Two services from one token set: night default, day opt-in

- Status: accepted
- Date: 2026-07-11
- Implements: docs/design/12-brand-signage.md · docs/design/13-code-as-asset.md §1.1
- Relates: ADR 0005 (zero-dependency token build)

## Context

The site launched as a single night service — deep lilac-charcoal grounds.
Visitors on light-defaulted devices, in bright rooms, and with light-mode OS
preferences wanted a daylight face, but the brand law is specific: amber is
lit-signage material, and a station board stays a lit board whatever the
weather. A naive "invert everything for dark/light" would either turn the
departure boards into pale rectangles or float amber text onto pale paper
(which fails AA). We needed a second service that shares the signage grammar
without a parallel component tree or a second set of raw colors.

## Decision

- **Two services, one token source.** `tokens/tokens.json` carries a `$value`
  (night, the default) and an optional `$light` (day) per color. Theme-varying
  tokens (the four grounds, three inks, the accent) have both; invariant tokens
  (`board-amber*`, `board-glow`, `ink-inverse`, the six line colors, status
  colors) have only `$value`. The zero-dep generator (ADR 0005) emits the theme
  blocks; there is no second palette to maintain.
- **Night is the default; day is opt-in.** The build emits `:root` +
  `:root[data-theme="dark"]` for night (also the SSR / no-JS state),
  `@media (prefers-color-scheme: light) :root:not([data-theme])` for day-by-OS,
  and `:root[data-theme="light"]` for day-by-toggle. Explicit `data-theme`
  always beats the media query.
- **Persisted toggle, no-flash.** A header toggle writes `data-theme` on
  `<html>` and persists the choice; an inline pre-hydration script applies it
  before first paint so there is no theme flash. Untoggled visitors follow OS
  preference.
- **Lit boards are pinned to night.** `.jccl-lit-board` re-declares the night
  ground/ink values, so departure boards, code blocks, the magstripe reader,
  and the 404 readout stay dark-and-amber in both services.
- **The colour split holds in both services.** Amber = lit-signage material
  only (board text, ticket strip, boarding CTA fill, lamp glow) and never text
  on a themeable ground. Lilac (`--color-accent-base`, itself theme-varying so
  it clears AA on both grounds) = the interactive/chrome accent, as
  text/stroke/border only — links, active nav, focus rings, live indicators.

## Consequences

- Adding or retuning a service is a `tokens.json` edit + `pnpm tokens`, never a
  component change — components already consume the vars.
- Every text pairing must clear AA on *both* grounds; `ink-faint` is the floor
  and is chosen to pass on the palest day ground and the darkest night ground.
- **Floating chrome floats on glass** (decided 2026-07 from Trial 02): the
  header, footer and toggle pills use the frosted `.jccl-glass` treatment in
  both services (translucent themed ground + blur). **Content panels stay
  solid** `.jccl-panel` — glass needs content behind it to read, and body text
  must keep AA. Trial 02 on `/depot/experiments/` remains as the reference.
- Amber-as-text regressions are the predictable failure mode when new UI lands;
  the fix is always the same swap — accent for interactive text, or wrap the
  amber display element in `.jccl-lit-board`.
- A third service (e.g. a high-contrast mode) is a third value key on the same
  tokens plus one more emitted block — no architectural change.
