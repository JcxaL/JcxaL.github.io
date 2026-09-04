# The JccL Line — jccl.me

[![CI](https://github.com/JcxaL/jcxal.github.io/actions/workflows/ci.yml/badge.svg)](https://github.com/JcxaL/jcxal.github.io/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/JcxaL/jcxal.github.io/branch/main/graph/badge.svg?token=CODECOV_TOKEN)](https://codecov.io/gh/JcxaL/jcxal.github.io)

A personal museum of places, entered through the Metro. Travel journals,
photography and field notes presented as a small transit network: the home
page is the concourse, sections are departures, trips are stations on a line.

Design spec lives in `docs/design/` (read its README first); binding
decisions in `docs/adr/`; agent/developer guardrails in `CLAUDE.md`.

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## The signage system

- **Design tokens** — `tokens/tokens.json` is the source of truth (station
  black ground, signage white ink, board amber, six line colors). Build CSS
  vars with `pnpm tokens`; never edit the generated `src/styles/tokens.css`.
- **Transit kit** — `src/components/transit/`: StationPlate, CodeDisc,
  SplitFlapBoard, DotMatrixSign, DepartureBoard, TransitDiagram, Ticket.
- **Network data** — `src/lib/transit/network.ts` renders the concourse map,
  the travel line guide, and the ticket from one graph.
- **Motion** — GSAP via `useGSAP()` + pure timeline factories in
  `src/lib/animation/`; every animation has a reduced-motion branch;
  cinematic timelines are seekable on `window.__motion` under `?e2e=1`.
- **Content** — MDX via next-mdx-remote (`src/content/blog`,
  `src/content/travel`), validated station schema in `src/lib/content/schema.ts`.

## Testing & Coverage

```bash
pnpm test            # Jest + Testing Library with coverage
pnpm test -- --watch # watch mode
pnpm lint
pnpm build           # static export to out/ (GitHub Pages)
```

- Coverage artifacts live in `coverage/` and are uploaded to Codecov through CI.
- Accessibility floor: axe serious/critical = 0 on every page; status is
  always color + word + shape; decorative layers are `aria-hidden`.

## CI / CD

- `.github/workflows/ci.yml` gates lint → test → build.
- `.github/workflows/deploy.yml` exports and publishes to GitHub Pages on
  pushes to `main`.
- Follow the branch workflow in `DEV_WORKFLOW.md` (feature branches only; no
  direct pushes to `main`).

## Contact

Visit [jcxal.github.io](https://jcxal.github.io) for the latest deployment.
The roadmap lives in `docs/design/10-roadmap.md`.
