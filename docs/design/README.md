# Web Design Docs — Travel Section

Research-backed design documentation for the `jccl.me` rebuild, focused on the travel
section that leads the launch (see [`TRAVEL_PLAN.md`](../../TRAVEL_PLAN.md) and
[`SITE_PLAN.md`](../../SITE_PLAN.md)). These docs distill a survey of **100+ acclaimed and
award-winning travel websites** into patterns, tokens, and build recommendations for a
static-export Next.js 15 site with a cinematic, sci-fi-HUD-meets-travel-journal direction.

## The documents

| Doc | What it covers |
|-----|----------------|
| [01 — Inspiration Gallery](./01-inspiration-gallery.md) | The award-winning sites themselves: who won what, why it mattered, what to steal. Organized by category, awards cited to archives. |
| [02 — UX Patterns](./02-ux-patterns.md) | Information architecture and interaction patterns: the two-layer architecture, destination-card schema, status system, list↔map sync, guide-page anatomy, filters, anti-patterns. |
| [03 — Visual Language](./03-visual-language.md) | Palette formulas, the three-voice typography system, imagery treatment (scrims, grading), HUD-as-a-layer, and how it maps onto the site's existing tokens. |
| [04 — Motion & Interaction](./04-motion-interaction.md) | Scroll choreography rules, the flight-path camera recipe, map/globe techniques, arc animation, performance tiers, reduced-motion policy. |
| [05 — Applied Recommendations](./05-recommendations.md) | The synthesis, mapped onto TRAVEL_PLAN milestones M1–M4: concrete build items ranked by impact. |

## How this research was done

- **Nine parallel research passes** (2026-07) across: Awwwards archives; FWA / CSS Design
  Awards / Webby archives; national & regional tourism boards; OTAs and travel platforms;
  luxury/boutique operators; editorial scrollytelling; interactive maps & 3D globes; and
  evidence-based UX literature (Baymard, Nielsen Norman Group, Smashing, web.dev, design
  systems from Airbnb DLS and Skyscanner Backpack). A ninth pass on 2024–26 trends did not
  complete and its ground is partially covered by the recency of the other passes.
- **103 unique sites** and **88 cross-cutting insights** survived deduplication.
- Every award claim carries its **archive or press citation**. Claims that could *not* be
  confirmed are labeled as reported/unconfirmed rather than dropped silently.

### Verification notes (read before quoting awards)

- Spot-checked directly against live Awwwards archive pages and confirmed: **Persepolis
  Reimagined** (SOTD Jun 1 2022, 7.96/10 + Developer Award 8.03/10), **iFly 50** (SOTD
  Mar 23 2016, 8.19/10 + Developer Award), **Nomadic Tribe** (SOTD Feb 19 2019, 8.30/10).
- Corrections the research surfaced against common claims:
  - **Hopper did not win the Apple Design Award 2023.** The 2023 ADA travel/Interaction
    winner was **Flighty** (verified against Apple's official list).
  - **No Webby win could be confirmed for Visit Faroe Islands' Remote Tourism** — its
    confirmed metal is a Clio Bronze (Experience/Activation, 2020).
  - **Travel Oregon's 2018 Webby level is unconfirmed** (registration-gated archive):
    listed in the winners gallery, exact honor level unknown.
  - **Polarsteps' "TravelTech Mobile App of the Year"** is currently sourced only to the
    company's own announcement — treat as claimed.
- Several award-winning campaign sites are **dead** (World of Swiss, both KLM iFly
  properties, Nomadic Tribe, Google Night Walk). Their lessons are cited from award
  archives and agency case studies; the graveyard itself is a design lesson (see doc 05,
  "Durability").

## Reading order

Skim **01** for taste calibration, read **02–04** when designing components, and treat
**05** as the actionable backlog companion to `TRAVEL_PLAN.md`.
