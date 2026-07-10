import type { CSSProperties } from "react";
import { Link } from "next-view-transitions";
import StationPlate from "@/components/transit/StationPlate";

/**
 * DayServiceTrial — Trial 02 on the depot experiments siding.
 * The night signage system re-lit for daylight: the four ground tokens and
 * three ink tokens are remapped to an enamel-white ramp, SCOPED to one
 * wrapper via inline custom properties. Amber and the six line colors ride
 * through unchanged — they are shared between services.
 *
 * The same specimen composition renders twice (night = site theme untouched,
 * day = the ramp below) so the two services can be judged side by side.
 * Static render, no animation — nothing here needs a reduced-motion branch;
 * the only motion is the pre-existing `.jccl-lift` hover, which carries its
 * own no-motion-first branch in globals.css.
 */

/**
 * Day-service trial ramp — the ONE sanctioned raw-hex carve-out for this
 * experiment (theme-ramp trial, CLAUDE.md rule 1 does not apply to scoped
 * theme experiments on the depot siding). GRADUATION: if this ramp enters
 * service, move this palette into tokens/tokens.json as a second theme
 * ("day") and delete this object — components must never read these hexes.
 *
 * Every text pairing shown below was checked for WCAG AA (≥ 4.5:1):
 *   ink-signage #14171c on ground-0 #f4f5f7 → 16.47:1
 *   ink-muted   #4b5563 on ground-0 #f4f5f7 →  6.93:1 (7.56:1 on ground-1)
 *   ink-faint   #656e7d on ground-0 #f4f5f7 →  4.72:1
 *     (spec asked #6b7280 — that lands at 4.43:1 on day enamel, so the
 *      gray is darkened one step; same cool-gray family.)
 *   ink-inverse #0a0c10 on board-amber #ffb000 → 10.68:1 (CTA chip)
 * Amber, amber-dim, the six line colors, and the status colors are
 * deliberately absent: shared between services, never remapped.
 */
const DAY_RAMP = {
  "--color-ground-0": "#f4f5f7", // day enamel
  "--color-ground-1": "#ffffff", // panel
  "--color-ground-2": "#e8eaee", // raised
  "--color-ground-line": "#d3d7de", // hairline
  "--color-ink-signage": "#14171c",
  "--color-ink-muted": "#4b5563",
  "--color-ink-faint": "#656e7d",
  "--color-board-glow": "rgba(255, 176, 0, 0.25)",
} as const;

/** Shared frame for both specimens — resolves against whichever theme scopes it.
 *  flex: 1 (inside the flex column) equalizes frame heights across the grid row
 *  without overflowing past the caption the way height:100% would. */
const frameStyle: CSSProperties = {
  flex: "1 1 auto",
  backgroundColor: "var(--color-ground-0)",
  color: "var(--color-ink-signage)",
  border: "1px solid var(--color-ground-line)",
  borderRadius: "var(--layout-radius-card)",
  padding: "clamp(20px, 3vw, 32px)",
};

const dayFrameStyle = { ...frameStyle, ...DAY_RAMP } as CSSProperties;

const ctaChipStyle: CSSProperties = {
  display: "inline-block",
  fontFamily: "var(--font-stack-mono)",
  fontSize: "0.6875rem",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  fontWeight: 600,
  padding: "8px 14px",
  borderRadius: "var(--layout-radius-pill)",
  backgroundColor: "var(--color-board-amber)",
  color: "var(--color-ink-inverse)",
};

/**
 * The specimen: one believable slice of a station page — kicker, signage
 * heading, enamel plate, journal panel, amber CTA. Rendered identically in
 * both services so only the theme differs.
 */
function ServiceSpecimen() {
  return (
    <div>
      <p className="jccl-kicker">The JccL Line · Service preview</p>
      <h3 className="jccl-signage mt-3 text-2xl">Day service — trial ramp</h3>

      <div className="mt-6">
        <StationPlate
          name="Kyoto"
          nameLocal="京都"
          nameLocalLang="ja"
          code="A01"
          line="a"
          status="visited"
        />
      </div>

      <div className="jccl-panel jccl-lift mt-4 p-4">
        <p className="jccl-telemetry">
          A01 · 35.0116 N 135.7681 E · LINE A · 3 CALLS LOGGED
        </p>
        <p
          className="jccl-measure mt-3 text-sm leading-relaxed"
          style={{ color: "var(--color-ink-muted)" }}
        >
          I learned to read Kyoto by its side streets — the lanes behind the
          shrine gates where the signs go quiet and the city slows to walking
          pace. I still plan every trip around one unhurried morning there.
        </p>
      </div>

      {/* CTA targets the travel index — the A01 exhibit page is not yet in
          service, and a specimen must not ship a dead link. */}
      <div className="mt-5">
        <Link href="/travel/" style={ctaChipStyle}>
          Board Line A →
        </Link>
      </div>
    </div>
  );
}

export function DayServiceTrial() {
  return (
    <section className="mt-14" id="day-service" aria-labelledby="trial-02-heading">
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="trial-02-heading" className="jccl-signage text-xl">
          Trial 02 · Day service
        </h2>
        <p className="jccl-telemetry">LIGHT THEME RAMP · SCOPED TOKEN REMAP</p>
      </div>
      <p
        className="jccl-measure mb-8 text-sm leading-relaxed"
        style={{ color: "var(--color-ink-muted)" }}
      >
        The same signage grammar re-lit for daylight: ground and ink tokens
        swap to an enamel-white ramp, scoped to one wrapper; nothing else
        changes. Deciding: does the enamel daylight ramp keep the signage
        identity? Amber and line colors are shared between services.
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col">
          <p className="jccl-telemetry mb-3">SPECIMEN N · NIGHT SERVICE — CURRENT</p>
          <div style={frameStyle}>
            <ServiceSpecimen />
          </div>
        </div>
        <div className="flex flex-col">
          <p className="jccl-telemetry mb-3">SPECIMEN D · DAY SERVICE — TRIAL</p>
          <div style={dayFrameStyle}>
            <ServiceSpecimen />
          </div>
        </div>
      </div>

      <p className="jccl-telemetry mt-4">
        ALL SHOWN PAIRINGS AA ≥ 4.5:1 · INK-FAINT DARKENED #6B7280 → #656E7D
        FOR DAY ENAMEL · GRADUATION = SECOND THEME IN TOKENS.JSON
      </p>
    </section>
  );
}

export default DayServiceTrial;
