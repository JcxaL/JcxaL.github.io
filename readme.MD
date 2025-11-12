# JcxaL - Personal Website

[![CI](https://github.com/JcxaL/jcxal.github.io/actions/workflows/ci.yml/badge.svg)](https://github.com/JcxaL/jcxal.github.io/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/JcxaL/jcxal.github.io/branch/main/graph/badge.svg?token=CODECOV_TOKEN)](https://codecov.io/gh/JcxaL/jcxal.github.io)

Immersive personal site powered by Next.js App Router, Tailwind 4, and a suite of custom animation components.

## About

This site serves as my digital lab for travel guides, design experiments, music tools, and long-form writing. The rebuild prioritizes a travel-first experience with cinematic navigation, parallax scenes, and MDX-driven content.

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to explore the in-progress experience.

## Feature Highlights

- Travel “Mission Control” dashboard (map preview, mission ledger, guide drafts)
- Custom animation systems (Liquid menu, Matrix rain, Particle background, custom cursor)
- MDX content pipeline for blog posts + future guides
- Futuristic HUD theming with layered parallax backgrounds

## Tech Stack

- [Next.js](https://nextjs.org/) 15 App Router + React 19
- [Tailwind CSS](https://tailwindcss.com/) 4 beta
- [TypeScript](https://www.typescriptlang.org/)
- Animation: [Framer Motion](https://www.framer.com/motion/), [GSAP](https://greensock.com/gsap/), [Three.js](https://threejs.org/)
- Content tooling: MDX, gray-matter

## Testing & Coverage

```bash
pnpm test            # Jest + Testing Library with coverage
pnpm test -- --watch # watch mode
```

- Coverage artifacts live in `coverage/` and are uploaded to Codecov through CI.
- Add new unit tests for every component/page (see `__tests__/` for examples).
- To inspect HTML output during development, use Testing Library’s `screen.debug()`.

## CI / CD

- `.github/workflows/ci.yml` runs on pushes to `main` and pull requests targeting `main` or `master`.
- Pipeline steps: install → lint → test (coverage) → build → upload coverage to Codecov.
- Set `CODECOV_TOKEN` in repo secrets for private uploads (public repos can omit).
- Follow the branch workflow in `DEV_WORKFLOW.md` (feature branches only; no direct pushes to `main`).

## Contact

Visit [jcxal.github.io](https://jcxal.github.io) for the latest deployment and follow the roadmap in `SITE_PLAN.md`.
