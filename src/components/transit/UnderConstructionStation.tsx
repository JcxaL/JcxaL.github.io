import { Link } from "next-view-transitions";
import type { LineId } from "@/lib/transit/types";
import StationPlate from "@/components/transit/StationPlate";
import DotMatrixSign from "@/components/transit/DotMatrixSign";

/**
 * UnderConstructionStation — the full "station under works" treatment shared
 * by the not-yet-open stops (Photography, Music, Design).
 *
 * Anatomy, top to bottom: kicker → StationPlate → hoarding band (amber tape)
 * → works notice panel with a dot-matrix sign → works-order telemetry and the
 * way back to the concourse. System voice throughout (doc 12); no JS motion —
 * these platforms are still behind the hoarding.
 * Tokens only; decorative layers aria-hidden (CLAUDE.md rules 1, 9).
 */

export interface UnderConstructionStationProps {
  /** Station display name, e.g. "Photography". */
  name: string;
  /** Station code, e.g. "C01" — deterministic ID (slugs, test IDs). */
  code: string;
  /** Owning line — supplies plate edge and disc color. */
  line: LineId;
  /** One calm system-voice sentence: what this station will be when it opens. */
  plans: string;
}

/* Link grammar mirrors the site chrome (footer links): signage semibold,
   muted at rest, ink on hover. Instant color swap — not an animation, so no
   reduced-motion branch is needed (no-motion-first). */
const WORKS_CSS = `
.jccl-works-return {
  font-family: var(--font-stack-signage);
  font-weight: 600;
  font-size: 0.8125rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-decoration: none;
  color: var(--color-ink-muted);
}
.jccl-works-return:hover {
  color: var(--color-ink-signage);
}
`;

export default function UnderConstructionStation({
  name,
  code,
  line,
  plans,
}: UnderConstructionStationProps) {
  return (
    <div
      className="mx-auto max-w-3xl px-6 pt-14 pb-16 md:pt-20"
      data-testid={`under-construction-${code}`}
    >
      <style>{WORKS_CSS}</style>
      <h1 className="sr-only">{name} — station under construction</h1>

      <p className="jccl-kicker">The JccL Line · Station under construction</p>

      <div className="mt-6">
        <StationPlate name={name} code={code} line={line} status={undefined} />
      </div>

      {/* Hoarding band — tape and cones. Decorative; the words live below. */}
      <div
        aria-hidden="true"
        className="mt-4"
        style={{
          height: 20,
          borderRadius: "var(--layout-radius-plate)",
          border: "1px solid var(--color-ground-line)",
          backgroundImage:
            "repeating-linear-gradient(45deg, var(--color-board-amber), var(--color-board-amber) 12px, var(--color-ground-0) 12px, var(--color-ground-0) 24px)",
        }}
      />

      {/* Works notice — system voice. */}
      <section className="jccl-panel mt-6 p-6 sm:p-8" aria-label="Works notice">
        <p
          className="jccl-measure text-lg leading-relaxed"
          style={{ color: "var(--color-ink-muted)" }}
        >
          {plans}
        </p>
        <div className="mt-6">
          <DotMatrixSign text="OPENING 2026 · PLEASE MIND THE HOARDING" />
        </div>
      </section>

      <div className="mt-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3">
        <p className="jccl-telemetry">WORKS ORDER {code} · SCHEDULED 2026</p>
        <Link href="/" className="jccl-works-return">
          ← Return to the concourse
        </Link>
      </div>
    </div>
  );
}
