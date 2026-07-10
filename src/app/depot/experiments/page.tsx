import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import DuotoneImage from "@/components/media/DuotoneImage";
import DayServiceTrial from "@/components/experiments/DayServiceTrial";
import EnamelTrial from "@/components/experiments/EnamelTrial";
import type { LineId } from "@/lib/transit/types";

export const metadata: Metadata = {
  title: "Depot — aesthetic trials",
  description:
    "The depot: visual experiments under evaluation before entering service.",
  robots: { index: false, follow: false },
};

/**
 * Depot experiments — A/B swatch wall for aesthetic decisions. Unindexed;
 * linked from the footer depot column. Each trial states its decision
 * criteria so choices get recorded, not vibes-lost.
 */

const LINES: { id: LineId | "amber"; name: string }[] = [
  { id: "a", name: "Line A · Vermillion" },
  { id: "b", name: "Line B · Harbour Blue" },
  { id: "c", name: "Line C · Jade" },
  { id: "d", name: "Line D · Violet" },
  { id: "e", name: "Line E · Teal" },
  { id: "f", name: "Line F · Magenta" },
  { id: "amber", name: "Board Amber" },
];

const SAMPLES = [
  {
    src: "/media/samples/kyoto.jpg",
    alt: "A stone-paved Kyoto lane at dusk leading to the Yasaka pagoda",
    width: 1200,
    height: 801,
  },
  {
    src: "/media/samples/lisbon.jpg",
    alt: "A yellow number 25 tram turning through Praça do Comércio, Lisbon",
    width: 1200,
    height: 798,
  },
] as const;

export default function ExperimentsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6">
      <section className="pt-14 md:pt-20">
        <p className="jccl-kicker">The JccL Line · Depot — aesthetic trials</p>
        <h1 className="jccl-signage mt-5 text-5xl">Experiments</h1>
        <p
          className="jccl-measure mt-6 text-lg leading-relaxed"
          style={{ color: "var(--color-ink-muted)", maxWidth: "52ch" }}
        >
          Trials under evaluation before entering service. Nothing on this
          siding is final; each panel names what it is testing.
        </p>
      </section>

      {/* ---- Trial 01: duotone tint per line color ---- */}
      <section className="mt-14" id="duotone">
        <div className="mb-2 flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="jccl-signage text-xl">Trial 01 · Tinted windows</h2>
          <p className="jccl-telemetry">DUOTONE PHOTO TREATMENT · PICK BY EYE</p>
        </div>
        <p
          className="jccl-measure mb-8 text-sm leading-relaxed"
          style={{ color: "var(--color-ink-muted)" }}
        >
          Every photo is remapped to a two-color ramp — station black up to
          the owning line&apos;s color — so unedited photography reads as part
          of the signage system. Deciding: does each line color hold up as a
          tint, or should exhibits standardise on one or two?
        </p>
        {SAMPLES.map((sample) => (
          <div key={sample.src} className="mb-10">
            <p className="jccl-telemetry mb-4">
              SAMPLE: {sample.src.split("/").pop()?.toUpperCase()}
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {LINES.map((line) => (
                <DuotoneImage
                  key={`${sample.src}-${line.id}`}
                  src={sample.src}
                  alt={sample.alt}
                  width={sample.width}
                  height={sample.height}
                  line={line.id}
                  credit={line.name.toUpperCase()}
                />
              ))}
            </div>
          </div>
        ))}
      </section>

      <DayServiceTrial />

      <EnamelTrial />

      <section className="mt-10">
        <p className="jccl-telemetry">
          MORE TRIALS ARRIVE ON THIS SIDING AS THEY ARE BUILT ·{" "}
          <Link
            href="/"
            className="underline"
            style={{ color: "var(--color-board-amber)" }}
          >
            RETURN TO THE CONCOURSE
          </Link>
        </p>
      </section>
    </div>
  );
}
