---
status: accepted
date: 2026-07-07
---

# 0002 — GSAP under the Standard License (the one non-MIT dependency)

## Context and Problem Statement

GSAP is the choreography master of the motion stack (doc 07 D2): ScrollTrigger drives
the ride, and SplitText / MotionPath / DrawSVG carry the signature moments. Since
**April 29, 2025** (the Webflow acquisition), GSAP and **all former Club plugins are
100% free** — verified at gsap.com/pricing. But they ship under a custom **"Standard
License", which is not MIT and not OSI-approved**. Everything else in the dependency
tree is MIT/BSD/OFL/Apache, so this needs an explicit, recorded acceptance rather than
a silent assumption.

## Decision Outcome

**Accepted.** GSAP 3.13+ and its plugins are used under the Standard License, installed
only from the official `gsap` npm package.

- The Standard License permits free use in this site (a non-charging, publicly viewable
  project); we do not resell, redistribute the library, or build a competing tool — the
  clauses that would need review do not apply here.
- **Never install "gsap plugins unlocked" / mirror packages** (already on the doc 07 D10
  banned list). They were workarounds for the pre-2025 paid Club plugins; today they are
  both license-violating and pointless.
- Usage remains architecturally confined per doc 09 §4: `useGSAP()` (`@gsap/react`) or
  pure timeline factories in `src/lib/animation/` only.

## Consequences

- Good: the full former-Club plugin set is available at $0, no license keys, no build
  gymnastics.
- Bad: one dependency in the tree is not OSI open source. Any future reuse of this
  codebase in a different context (a paid product, a template for others) must re-read
  the Standard License first; this ADR is the flag.
- Bad: agents and automated license scanners will trip on the non-SPDX license — point
  them here. The banned-mirror rule is lint/review-enforced, not just documented.
