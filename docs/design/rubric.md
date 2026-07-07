# Design-Review Rubric — The JccL Line

The written target the vision-review agent scores against (referenced by doc 08 §3).
Six dimensions, each scored **1–5** per reviewed screen. A critique must cite the
violated token or rule **by name** — "uses `#1a2b3c`, expected `--color-lines-a`" — not
vibes. An automatic-fail condition caps that dimension at 1 regardless of everything
else and must be called out explicitly.

Scale anchor: **5** = indistinguishable from the spec's intent · **3** = correct but
unremarkable · **2** = recognizable drift from the system · **1** = automatic fail
triggered or the system is absent.

---

## 1. Typography discipline

Three voices, never mixed (doc 12): signage (`--font-signage`, Source Sans 3) for
headings, plates, UI, and body; board (`--font-board`, Doto) for departure boards and
LED strips **only**; telemetry (`--font-geist-mono`) for coordinates, dates, codes,
stats.

- **What 5 looks like:** one signage family carrying hierarchy through weight only;
  station names in semibold caps with normal tracking on plates; kickers/labels in mono
  small-caps with wide tracking; Doto confined to board surfaces, its axis animation
  appearing only at the two signature moments (ticket reveal, place-page H1 arrival).
- **What 2 looks like:** hierarchy done with size sprawl instead of weight; tracking
  applied decoratively to body-size text; mono used for a whole paragraph because it
  "looked technical"; Doto on a label that is not a board.
- **Automatic fail:** Doto set as body/reading text; a font family outside the three
  voices (plus deferred `--font-cjk`) appears anywhere.

## 2. Token fidelity

Every color, duration, easing, and radius resolves to a token (`tokens/tokens.json` →
CSS vars). Semantics matter as much as values: **amber is the glow** (boards, LED
strips, primary CTA — `--color-board-amber`), **line colors are identity**
(`--color-lines-a…f`), **status colors are data** (`--color-status-visited/-progress/
-planning`, always paired with word + shape).

- **What 5 looks like:** screens that could be re-themed by editing `tokens.json`
  alone; amber reserved enough that it still reads as signal; line color appearing only
  as line identity (plate edges, discs, diagram strokes); status always redundantly
  encoded.
- **What 2 looks like:** near-token values that don't match (`#ffb100` beside
  `--color-board-amber`); amber spent on decorative borders until nothing glows;
  ground steps (0/1/2) used interchangeably so elevation reads flat.
- **Automatic fail:** any raw hex/duration/easing literal in a component; a line color
  used *as* a status (e.g. jade `--color-lines-c` standing in for visited-green).

## 3. Motion continuity

One interruptible, seekable timeline per sequence (registered on `window.__motion`,
doc 08 §1); easings from tokens (`--motion-easing-train-decelerate/-train-accelerate/
-standard`); durations from tokens (`--motion-duration-*`).

- **What 5 looks like:** a sequence that reads as one gesture — enters, settles, and
  can be interrupted mid-flight without snapping; trains decelerate with
  `--motion-easing-train-decelerate`, not generic ease-out; flap cadence stepped, not
  eased (the mechanical read); the reduced-motion variant is a designed end state, not
  a broken half-render.
- **What 2 looks like:** several small tweens firing independently so elements arrive
  out of order; default `ease: "power1.out"` everywhere; durations that feel authored
  per-component rather than drawn from the scale; motion that replays fully on every
  minor state change.
- **Automatic fail:** no reduced-motion branch (the reduced-motion screenshot is
  missing, identical-but-broken, or still animating).

## 4. Legibility & contrast

Text over imagery must hold **WCAG AA**; scrims are the sanctioned tool (gradient or
solid panels of `--color-ground-0/1/2`), ink tokens (`--color-ink-signage/-muted/
-faint/-inverse`) carry the text hierarchy.

- **What 5 looks like:** AA (or better) everywhere including over the busiest
  photograph, achieved with confident scrims or plate panels rather than by dimming the
  whole image to mud; `--color-ink-muted`/`-faint` used for hierarchy, never for
  essential content; focus states visible against every ground.
- **What 2 looks like:** white text passing AA only over the darkest third of a hero
  image; scrims so heavy the photography (the site's only "other color", doc 12) stops
  contributing; amber body-size text on mid-tone grounds.
- **Automatic fail:** any text over imagery below AA with no scrim, or essential text
  set in `--color-ink-faint`.

## 5. Metro-metaphor fidelity

The system voice and signage grammar are load-bearing (doc 12): polite
transit-authority English in chrome, station codes as the ID system, and **register
discipline per surface — Solari flaps = hall surfaces, dot-matrix = platform strips,
enamel plates = wayfinding.** One register per surface.

- **What 5 looks like:** chrome copy that could hang in a real station ("This is a
  Kyoto-bound service."); every station surface carries its code disc (`A03`); each
  surface uses exactly one signage register, so the metaphor reads as a system rather
  than a mood board; system voice does structure, first person does meaning.
- **What 2 looks like:** system voice drifting into marketing ("Discover the magic of
  Kyoto!") or past tense; a station header missing its code; a plate styled with
  LED glow, or a flap board used as a paragraph container.
- **Automatic fail:** registers mixed in one string (system + first person), or two
  signage registers mixed on one surface (e.g. dot-matrix type inside an enamel plate).

## 6. Composition & pacing

Pages breathe by alternation: media and text trade the lead, and **full-bleed is
punctuation, not wallpaper** (doc 03).

- **What 5 looks like:** a clear rhythm of contained → full-bleed → contained; text
  blocks held to `--layout-measure`; consecutive media varied in scale and placement so
  scrolling has tempo; one moment per screen allowed to be loud.
- **What 2 looks like:** three same-width images stacked like a feed; every section
  full-bleed so none of them land; text columns stretching past a readable measure;
  punctuation moments (door-open, arrival) buried mid-scroll with no space around them.
- **Automatic fail:** an auto-rotating carousel (banned, doc 07 D10), or two
  consecutive full-bleed media blocks with no contained beat between them.

---

## Review protocol

1. **Score against the screenshot manifest** (doc 08 §3): every journey stage × 3
   viewports (390 / 768 / 1440) × {motion-seeked, reduced-motion}. No screenshot, no
   score — request the missing state instead of guessing.
2. **Cite by name.** Every point deducted names the token, rule, or doc section
   violated (`--color-board-amber`, doc 12 register table, this rubric §5). Critiques
   that can't name a rule are observations, not scores.
3. **Max 3 iterations per screen** (doc 08 §3): critique → fix → re-screenshot, then
   stop. Remaining issues are filed, not looped on.
4. **Verdicts are advisory — never a CI gate** (doc 08 §2). Pixel diffs, axe, and
   budgets block merges; a model's aesthetic opinion does not. Scores land as PR
   commentary; humans merge.
5. The reviewer runs with fresh context, separate from the builder, and approves
   nothing.
