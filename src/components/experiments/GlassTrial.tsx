import type { CSSProperties } from "react";

/**
 * GlassTrial — Trial 02 on the depot experiments siding.
 *
 * The day service is now a real, togglable theme (header toggle → persisted
 * `data-theme`), so the ground/ink ramp no longer needs a scoped trial. The
 * open question that remains is a *chrome* decision: when a surface floats
 * over the day-service paper, should it be a solid panel or frosted glass?
 *
 * This trial poses both treatments of one floating sub-header, over a real
 * slice of station content so the blur has something to read:
 *   A · SOLID PAPER — an opaque `.jccl-panel`. Hides whatever it covers.
 *   B · GLASSY LILAC — the `.jccl-glass` utility. The line strip and heading
 *       behind it frost through, so the chrome reads as translucent.
 *
 * The specimens theme with the running service (screenshot both), but the
 * decision is about the DAY service: glass only earns its blur when there is
 * content behind it, and it must still clear AA on the chrome's own text.
 *
 * Static render, no animation — nothing here needs a reduced-motion branch.
 * Tokens + the `.jccl-glass` / `.jccl-panel` utilities only; no raw values.
 */

/** The six line colors — invariant across services, allowed as fills. They
 *  give the glass sample a strip of color to frost, so the blur is obvious. */
const LINE_IDS = ["a", "b", "c", "d", "e", "f"] as const;

/** A believable slice of station content, painted behind the floating chrome
 *  so the glass treatment has a backdrop to blur. Identical under both
 *  treatments — only the floating bar differs. */
const stageStyle: CSSProperties = {
  position: "relative",
  overflow: "hidden",
  /* Contain the backdrop sample to this stage, not the page behind it. */
  isolation: "isolate",
  minHeight: 320,
  backgroundColor: "var(--color-ground-0)",
  border: "1px solid var(--color-ground-line)",
  borderRadius: "var(--layout-radius-card)",
};

const stripStyle: CSSProperties = {
  display: "flex",
  gap: 4,
  marginBottom: 20,
};

const chromeBarStyle: CSSProperties = {
  position: "absolute",
  top: 18,
  left: 18,
  right: 18,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 16,
  padding: "12px 16px",
  borderRadius: "var(--layout-radius-plate)",
};

const chromeLinkBase: CSSProperties = {
  fontFamily: "var(--font-stack-mono)",
  fontSize: "0.6875rem",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  fontWeight: 600,
};

/** The floating sub-header — the chrome under evaluation. `variant` picks the
 *  surface utility; everything else is shared so only the surface is judged. */
function GlassStage({ variant }: { variant: "solid" | "glass" }) {
  return (
    <div style={stageStyle}>
      {/* Backdrop content — real station slice, sits behind the floating bar. */}
      <div style={{ padding: "clamp(20px, 3vw, 28px)" }}>
        <div style={stripStyle} aria-hidden>
          {LINE_IDS.map((id) => (
            <div
              key={id}
              style={{
                height: 8,
                flex: 1,
                borderRadius: "var(--layout-radius-pill)",
                backgroundColor: `var(--color-lines-${id})`,
              }}
            />
          ))}
        </div>
        <h3 className="jccl-signage text-2xl">Kyoto · Line A</h3>
        <p className="jccl-telemetry mt-2">
          A01 · 35.0116 N 135.7681 E · 3 CALLS LOGGED
        </p>
        <p
          className="jccl-measure mt-4 text-sm leading-relaxed"
          style={{ color: "var(--color-ink-muted)" }}
        >
          I learned to read Kyoto by its side streets — the lanes behind the
          shrine gates where the signs go quiet and the city slows to walking
          pace. The sub-header above floats over this while you scroll.
        </p>
      </div>

      {/* The floating chrome under trial: opaque panel vs frosted glass. */}
      <div
        className={variant === "glass" ? "jccl-glass" : "jccl-panel"}
        style={chromeBarStyle}
      >
        <span className="jccl-kicker" style={{ color: "var(--color-ink-signage)" }}>
          Line A · Sub-services
        </span>
        <span style={{ display: "flex", gap: 16 }}>
          {/* Active chrome link = lilac accent; the rest = signage ink. */}
          <span style={{ ...chromeLinkBase, color: "var(--color-accent-base)" }}>
            Stations
          </span>
          <span style={{ ...chromeLinkBase, color: "var(--color-ink-signage)" }}>
            Journal
          </span>
        </span>
      </div>
    </div>
  );
}

export function GlassTrial() {
  return (
    <section className="mt-14" id="glass" aria-labelledby="trial-02-heading">
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="trial-02-heading" className="jccl-signage text-xl">
          Trial 02 · Glass vs solid
        </h2>
        <p className="jccl-telemetry">DAY-SERVICE CHROME · FLOATING SURFACE</p>
      </div>
      <p
        className="jccl-measure mb-8 text-sm leading-relaxed"
        style={{ color: "var(--color-ink-muted)" }}
      >
        The same floating sub-header, two ways: an opaque paper panel that hides
        whatever it covers, and the frosted glass utility that lets the platform
        show through. Deciding: does the day service float on glass, or sit on
        solid paper? Glass needs content behind it to read — and must keep AA on
        text.
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col">
          <p className="jccl-telemetry mb-3">
            TREATMENT A · SOLID PAPER — OPAQUE PANEL
          </p>
          <GlassStage variant="solid" />
        </div>
        <div className="flex flex-col">
          <p className="jccl-telemetry mb-3">
            TREATMENT B · GLASSY LILAC — FROSTED CHROME
          </p>
          <GlassStage variant="glass" />
        </div>
      </div>

      <p className="jccl-telemetry mt-4">
        SOLID = .JCCL-PANEL (OPAQUE GROUND) · GLASS = .JCCL-GLASS (BLUR +
        THEMED TRANSLUCENT GROUND) · CHROME ONLY, NEVER BODY-TEXT SURFACES
      </p>
    </section>
  );
}

export default GlassTrial;
