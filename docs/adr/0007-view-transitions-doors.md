# 0007 — Route transitions: next-view-transitions doors, chrome exempt

- Status: accepted
- Date: 2026-07-10
- Implements: docs/design/07-technical-architecture.md D3 (DOM tier)

## Context

Doc 07 D3 mandates same-document View Transitions for route changes, with
`AnimatePresence` banned at route boundaries. On Next 15 the native React
`<ViewTransition>` component is not yet available to us (arrives with the
Next 16 / React experimental channel migration), so a bridge is required
that triggers `document.startViewTransition` around App Router navigations.

## Decision

- **`next-view-transitions` (v0.3.x, MIT, ~2KB)** wraps the root layout;
  all internal navigation uses its `Link` / `useTransitionRouter`. The
  package feature-detects `startViewTransition` and degrades to a plain
  navigation, so unsupporting browsers lose nothing.
- **The doors recipe** lives in `globals.css` on the `root` transition:
  old view clips toward the centre seam (`--motion-duration-exit`,
  train-accelerate easing), new view opens from the seam
  (`--motion-duration-enter`, train-decelerate easing, delayed by the
  exit). Timing and easing are the motion tokens — no literals.
- **Persistent chrome is exempt**: the site header carries
  `view-transition-name: jccl-header` with `animation: none`, so the
  signage stays fixed while the doors move (doc 07 D3).
- **Reduced motion**: the door keyframes exist only inside
  `prefers-reduced-motion: no-preference`; under reduce the View
  Transition default cross-fade remains — reduced ≠ none (doc 04 §6).
- Jest: the package ships untranspiled ESM; it is listed in
  `transpilePackages` (which next/jest also reads) and component tests
  render inside `<ViewTransitions>` with `next/navigation` mocked.

## Consequences

- Migration path: when the repo takes Next 16, replace the package with
  React's native `<ViewTransition>` + `Link transitionTypes` per doc 07 D3
  and delete this bridge (the CSS recipe survives unchanged).
- The set-piece tier (station→train boarding takeovers) remains open and
  is NOT covered by this ADR.
