# 12 — Brand & Signage: The JccL Line

The locked brand decisions (owner-confirmed 2026-07-07) and the signage system spec.
This is the reference every asset, component, and copy string is checked against.

## Identity

- **Name:** **The JccL Line** (casing exactly so — matches the author mark "JccL").
  The operating fiction: a one-traveler transit system run by its own small authority.
  Chrome may reference "JccL Line services"; legal-style footer humor is welcome
  ("Operated by JccL. All journeys real.").
- **Register:** **Hong Kong MTR first**, borrowing Tokyo/international conventions where
  they serve (station numbering codes, colorblind-safe redundancy). What we take from
  MTR — the *system logic*, not trademarks:
  - **Per-station color identity** (MTR's signature): each city/station owns a plate
    color drawn from its photography — this IS our per-city palette mechanism.
  - **Bilingual signage energy**: big Latin station name with an optional local-script
    counterpart (e.g. 京都 under KYOTO, tagged with its own language). Ship
    English-first; `nameLocal` + `nameLocalLang` exist from day one so bilingual plates
    switch on per-station.
  - Enamel-plate aesthetics: rounded-corner plates (`--layout-radius-plate`), signage
    white on station black, thin hairline dividers.
  - Line diagram with interchange capsules (two-color pills where lines meet).
- **Station codes:** Tokyo-style `LINE+NUMBER` (e.g. `A03`) in a colored disc; used in
  URLs, window labels, map pins, tests, and screenshot names. Codes are the deterministic
  ID system for agents (doc 08).
- **Trademark rule:** no MTR/TfL/MTA marks, roundels, or bullets — we build original
  equivalents in the same *grammar*.

## Palette (compiled in `tokens/tokens.json` — never hardcode)

| Role | Token | Value | Notes |
|---|---|---|---|
| Station ground | `color.ground.0/1/2` | `#0a0c10 / #12151c / #1b2029` | dark station; never pure black |
| Signage text | `color.ink.signage` | `#f2f3f5` | white enamel |
| **Board amber** | `color.board.amber` | `#ffb000` | the site glow: departure boards, LED strips, primary CTA |
| Unlit LED | `color.board.amberDim` | `#7a5500` | dot-matrix off-cells |
| Lines A–F | `color.lines.a…f` | vermillion/harbour/jade/violet/teal/magenta | assigned to real lines when the city list lands |
| Status | `color.status.visited/progress/planning` | green/amber/indigo | data colors; always paired with word + shape (doc 02 §3) |

Rules: photography supplies all other color (doc 03 §1). The legacy neon-cyan retires;
amber is the glow. Line colors are identity, status colors are data — they may
near-collide (jade vs visited-green) because shape+context disambiguate, but never use a
line color *as* a status.

## Typography (wired in `layout.tsx`)

| Voice | Font (OFL) | Var | Use |
|---|---|---|---|
| Signage + body | **Source Sans 3** (the free Myriad-register cousin — MTR's English signage voice) | `--font-signage` | headings, plates, UI, body (one family, weight-only hierarchy) |
| Boards | **Doto** (variable dot-matrix; wght + ROND axes) | `--font-board` | departure boards/LED strips ONLY — never body text |
| Telemetry | **Geist Mono** | `--font-geist-mono` | coordinates, dates, codes, stats |
| CJK accent | Noto Sans TC/HK — *deferred* (heavy; load per-page when bilingual plates ship) | `--font-cjk` | `nameLocal` plates |

Signage conventions: station names set in semibold caps with normal tracking on plates;
kickers/labels in mono small-caps with wide tracking; Doto axis animation reserved for
two signature moments (ticket reveal, place-page H1 arrival) per doc 07 D7.

## Voice: two registers

1. **System voice** (chrome, boards, notices, transitions) — polite transit-authority
   English, present tense, lightly deadpan:
   - "This is a Kyoto-bound service."
   - "Transfer here for the Island Line (Europe)."
   - "404 · End of the line. This station does not exist."
   - "Mind the gap between plan and reality." (planning-status pages)
   - Under construction: "Station opening soon. Works in progress since {date}."
2. **Your voice** (journal entries, captions, human moments) — dry first person, one
   tactile detail over three adjectives (doc 02 §8).

Never mix registers in one string. The contrast is the charm; system voice does
structure, your voice does meaning.

## Signage components (built by the asset workstream)

- **StationPlate** — enamel sign: name (+ optional `nameLocal`), code disc, line color
  edge. The place-page header and window label.
- **CodeDisc** — circled station code: line-colored ring on dark fill (Tokyo
  convention), code in mono.
- **TransitDiagram** — octilinear line renderer (45° geometry, rounded caps,
  interchange capsules — white-stroked Beck capsules v1; two-color MTR pills are a
  later enhancement); consumes `{lines, stations, interchanges}`; renders ticket back,
  ride progress rail, and sitemap from the same data.
- **SplitFlapBoard** — Solari hall board: frame-stepped flaps (`--motion-duration-flap`,
  stepped not eased — the mechanical read), settled text mirrored to `aria-label`,
  cycling cells `aria-hidden`, `aria-live="polite"` after settle.
- **DotMatrixSign** — Doto amber LED strip with bloom (`--color-board-glow`),
  transform-only marquee.
- **Ticket** — Wallet-pass anatomy, die-cut notches, drag-to-punch (range input under
  the hood), punched state persists as menu/progress HUD. The line-diagram strip is a
  Phase-2 composition: `<TransitDiagram showLabels={false}>` slotted into the card.
- **StationScene** — procedural 2.5D SVG layer kit (sky/skyline/canopy/pillars/platform/
  train/tunnel) in geometric transit grammar; every layer carries `data-depth` for the
  parallax rig; decorative layers `aria-hidden`.

All components: token vars only (no raw hex/durations), reduced-motion branch required,
Jest test required, registered states screenshot-testable (doc 08).
