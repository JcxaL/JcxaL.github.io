# Web Design Docs — The Metro Museum

Research-backed design documentation for the `jccl.me` rebuild. Two research rounds feed
two doc generations:

- **Round 1 (docs 01–05):** a survey of **100+ acclaimed and award-winning travel
  websites** — patterns, visual language, and motion craft for a travel site.
- **Round 2 (docs 06–10):** the whole-site **metro/rail concept** ("an interactive museum
  entered through the Metro"): station intro → ticket unlock → train-ride navigation →
  city exhibits → rotating globe. 138 additional items researched (rail/metro web
  experiences, the 2025–26 motion stack, globe zoom tech, parallax craft, agent-driven
  design workflows, dev standards, media hosting, audio, transit typography) with 24
  adversarial claim verifications against primary sources.

## The documents

| Doc | What it covers |
|-----|----------------|
| [01 — Inspiration Gallery](./01-inspiration-gallery.md) | Award-winning travel sites: who won what, why it mattered, what to steal. Awards cited to archives. |
| [02 — UX Patterns](./02-ux-patterns.md) | IA and interaction patterns: card schema, status system, list↔map sync, guide-page anatomy, filters, anti-patterns. |
| [03 — Visual Language](./03-visual-language.md) | Palette formulas, three-voice typography, imagery treatment, HUD-as-a-layer, map styling. |
| [04 — Motion & Interaction](./04-motion-interaction.md) | Scroll choreography laws, flight-path camera recipes, arc animation, reduced-motion policy, performance budgets. |
| [05 — Applied Recommendations](./05-recommendations.md) | Round-1 synthesis mapped onto the original TRAVEL_PLAN milestones (partially superseded by doc 10). |
| [06 — Experience Blueprint](./06-experience-blueprint.md) | The Metro Museum concept: scene-by-scene journey, 2.5D-that-reads-as-3D art direction, mobile adaptation, content template, acceptance criteria. |
| [07 — Technical Architecture](./07-technical-architecture.md) | Verified decision records: persistent canvas, motion stack, View Transitions, MapLibre globe, media/hosting (Cloudflare+R2), transit typography, audio, banned list. |
| [08 — Agent Design Workflow](./08-agent-design-workflow.md) | How agents build and verify by vision + code: seekable timelines, two-tier verification, screenshot manifest, design tokens as machine contract, CI gates. |
| [09 — Engineering Standards](./09-engineering-standards.md) | Toolchain, animation code architecture, testing strategy, CI/CD conventions, media pipeline, docs standards, budgets. |
| [10 — Roadmap](./10-roadmap.md) | Phased delivery plan (Phase 0–6) with exit criteria, open decisions, and risk register. |
| [11 — RedNote References Triage](./11-rednote-references-triage.md) | Owner-supplied 29-item reference report mapped onto the plan: adopted ideas, convergences, and claims to verify. |
| [13 — Code as Asset](./13-code-as-asset.md) | The design-asset pipeline: tokens → generated CSS/filters/map styles, verified techniques per asset class (duotone, globe, variable fonts, sound, texture), and the verification workflow. |

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
