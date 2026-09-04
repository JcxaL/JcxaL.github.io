# Contributing to The JccL Line

Welcome aboard. This guide is written for humans **and** agents — the rules are the
same for both. Read `CLAUDE.md` (the non-negotiables) before your first change; the
ADRs in `docs/adr/` are binding.

## What this is

The JccL Line is a personal travel site built as an interactive metro system: a station
intro, a ticket that unlocks the site, train-ride navigation between city "stations,"
and a zoomable globe — a Next.js 15 static export on GitHub Pages with heavy media on
R2. The full research-backed spec lives in **`docs/design/README.md`** (start there;
doc 07 = tech decisions, doc 08 = verification workflow, doc 09 = engineering
standards, doc 12 = brand and voice).

## Commands

| Command | What it does |
|---|---|
| `pnpm dev` | Dev server (Turbopack) |
| `pnpm build` | Static export to `out/` (runs `pnpm tokens` first via `prebuild`) |
| `pnpm test` | Jest unit suite |
| `pnpm lint` | Lint |
| `pnpm tokens` | Rebuild `src/styles/tokens.css` from `tokens/tokens.json` |

Run a single test file with `pnpm exec jest __tests__/<file> --coverage=false`, and
typecheck with `pnpm exec tsc --noEmit`.

## Branches and commits

- **Trunk-based**: short-lived branches off `main` → PR → squash-merge. No long-running
  feature branches.
- **Conventional commits with metro scopes** (agent-greppable history):
  `feat(station)`, `feat(ticket)`, `feat(ride)`, `feat(globe)`, `feat(place)`,
  `feat(media)`, `feat(foundation)`, `chore(ci)`, `docs(design)`.
  Example: `feat(ticket): add drag-to-punch with range-input fallback`.
- Station codes (`A03`) are the deterministic IDs — use them in slugs, test IDs, and
  screenshot names.
- New architectural decisions get a one-page MADR in `docs/adr/` (next number in
  sequence) in the same PR as the change.

## PR checklist

Before requesting review:

- [ ] `pnpm lint`, `pnpm test`, and `pnpm exec tsc --noEmit` pass locally
- [ ] `pnpm build` succeeds (static export — no server-only APIs crept in)
- [ ] New copy follows the two-register voice (doc 12): system voice for chrome, first
      person for journal content, never mixed in one string
- [ ] Interactive elements are keyboard-operable with visible focus; decorative
      layers are `aria-hidden`; status uses color + word + shape

**Motion checklist** (required whenever a PR touches animation):

- [ ] **Reduced-motion path?** Every animation has a `prefers-reduced-motion` branch,
      authored no-motion-first (flyTo→jumpTo, draw-on→static, pulse→halo)
- [ ] **`useGSAP` cleanup?** GSAP runs only via `useGSAP()` or factories in
      `src/lib/animation/`; `contextSafe()` for handlers; no loose `gsap.timeline()`
- [ ] **Tokens only?** No raw hex, duration, or easing literals — CSS vars from the
      token build (`--motion-duration-*`, `--motion-easing-*`, `--color-*`)
- [ ] **Budget delta?** size-limit / media-weight delta noted in the PR description
- [ ] **Screenshot manifest updated?** New or changed states are added to the
      screenshot manifest so the vision loop can see them (doc 08 §3)

## The media rule

**Nothing over 5 MB ever lands in `public/`** — CI rejects it, and Git LFS is not
served by GitHub Pages, so it is not an escape hatch. Heavy media (window loops, photo
sets, PMTiles, audio) goes to the R2 bucket and is referenced only via
`NEXT_PUBLIC_MEDIA_BASE`. Encoding recipes live in doc 07 D6; details in ADR 0001.

## Where things live

| Path | Contents |
|---|---|
| `src/components/transit/` | Signage components: `StationPlate`, `CodeDisc`, `TransitDiagram`, `SplitFlapBoard`, `DotMatrixSign`, `Ticket` |
| `src/components/scene/` | `StationScene` and its procedural 2.5D SVG layer kit |
| `src/lib/transit/` | Shared types (`LineId`, `Station`, `TransitNetwork`, …) and network fixtures — import from `@/lib/transit/types` |
| `src/lib/content/` | Content loading and frontmatter schemas |
| `tokens/` | `tokens.json` (the source of truth — edit this) + `schema.ts`; never edit generated `src/styles/tokens.css` |
| `docs/design/` | The full design spec (docs 01–12) and `rubric.md`, the design-review rubric |
| `docs/adr/` | Architecture decision records — binding constraints on all changes |

Thank you for keeping the platform clear of obstructions. Mind the gap between plan
and reality.
