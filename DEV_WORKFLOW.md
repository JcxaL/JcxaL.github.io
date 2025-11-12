# DevOps & Git Workflow Guide

This workflow enforces disciplined, issue-driven development so the rebuild stays predictable and traceable.

---

## 1. Branching Strategy
- `main`: production-ready; only fast-forward merges from release branches.
- `develop`: integration branch for features slated for the next release cycle.
- `feature/{issue-id}-{slug}`: single-issue branches (e.g., `feature/42-travel-map-sync`). Always branch off `develop`.
- `hotfix/{issue-id}-{slug}`: urgent fixes cut from `main`, merged back into both `main` and `develop`.
- `release/{version}`: stabilization branches created when a milestone is feature-complete (e.g., `release/v0.2.0`).

## 2. Issue-First Workflow
1. Raise a ticket (GitHub Issue or Linear task) describing scope, acceptance criteria, and dependencies.
2. Assign yourself, reference the ticket when creating the branch (`feature/ID-desc`).
3. Work only on that scope; open new issues for drive-by findings.

## 3. Commit & PR Rules
- Write atomic commits with imperatives: `feat(travel): add itinerary cards`.
- Reference the issue ID in every commit body and PR description.
- Rebase onto the latest `develop` before opening a PR; never merge `main` into feature branches.
- Require at least one review + passing CI for every PR. Block merges if lint/tests fail.

## 4. Version Control & Releases
- Semantic versioning (`vMAJOR.MINOR.PATCH`).
  - Increment MAJOR for breaking UX/API changes.
  - Increment MINOR for new sections/features.
  - Increment PATCH for fixes or UI polish.
- When a release branch is ready:
  1. Update changelog.
  2. Tag `release/vX.Y.Z` commit as `vX.Y.Z`.
  3. Merge into `main`, then back into `develop`.

## 5. Automation Expectations
- CI pipeline (GitHub Actions) must run lint, type-check, unit tests, and build preview for every PR.
- Optional: add visual regression or Lighthouse checks for UI-heavy updates.
- Enable branch protection on `main` and `develop` (no direct pushes, status checks required).

## 6. Agile Rituals
- **Sprint Length**: 1 week.
- **Ceremonies**:
  - Monday planning: select issues, scope, define Definition of Done.
  - Midweek sync: unblockers, demo partials.
  - Friday review/retro: showcase progress, capture learnings, prep backlog grooming.
- Maintain a living roadmap (see `SITE_PLAN.md`) and keep sprint board statuses accurate (`Todo`, `In Progress`, `In Review`, `Done`).

## 7. Documentation & Handoffs
- Update `SITE_PLAN.md` or relevant docs when scope or architecture decisions change.
- Each merged PR should note verification steps (screenshots, recordings for interactions).
- Keep `/docs` (future) for design references, motion specs, and API contracts to align dev + design.

Adhering to this structure ensures every change is auditable, reviewable, and ready for deployment without surprises.
