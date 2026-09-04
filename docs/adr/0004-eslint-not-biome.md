---
status: accepted
date: 2026-07-07
---

# 0004 — ESLint 9 flat config + Prettier, not Biome (for now)

## Context and Problem Statement

`next lint` is deprecated in Next 15.5 and removed in 16, so the lint setup must be
rebuilt regardless (doc 09 §1.1). Biome is the attractive single-binary alternative
(fast, format+lint in one), and most of this codebase is written by agents — so lint is
not style preference here, it is the **enforcement layer for the house rules** (tokens
only, `useGSAP` only, banned imports). The deciding question is rule coverage, not speed.

## Decision Outcome

**ESLint 9 flat config + Prettier 3, Biome rejected until further notice.**

- **Biome has no equivalents for `eslint-plugin-react-hooks` or `@next/eslint-plugin-next`**
  (verified 2026-07-07) — the two highest-value rule sets for this stack. Hooks-deps
  mistakes and Next-specific footguns are exactly the bug classes agents introduce.
- Lint layers: `@eslint/js` → `typescript-eslint` *recommendedTypeChecked*
  (`projectService: true`) → `eslint-config-next` (flat) → `eslint-plugin-jsx-a11y`.
- **Prettier 3 + `prettier-plugin-tailwindcss`** for formatting — deterministic Tailwind
  class order matters when an agent writes most of the classes.
- House rules ride on ESLint (doc 09 §3): `no-restricted-imports` bans `gsap` timeline
  creation outside `src/lib/animation/` and hooks, bans `framer-motion` (use
  `motion/react`); custom rules ban raw hex/duration literals in components and
  `AnimatePresence` in route-boundary files.

**Revisit trigger:** Biome ships react-hooks and Next rule equivalents. Re-evaluate
then; nothing else about Biome is disqualifying.

## Consequences

- Good: full rule coverage for the actual bug classes; the CLAUDE.md guardrails are
  machine-enforced, not aspirational.
- Bad: two tools (ESLint + Prettier) instead of one, slower than Biome, flat-config
  layering is fiddly — the codemod (`next-lint-to-eslint-cli`) output must be verified
  by hand (known bug #85679).
- Neutral: `tsc --noEmit` stays a separate CI job; type-aware linting does not replace it.
