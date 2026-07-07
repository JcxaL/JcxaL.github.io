"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { StationScene } from "@/components/scene/StationScene";
import { TRAIN_PARKED_X } from "@/components/scene/layers";
import DotMatrixSign from "@/components/transit/DotMatrixSign";
import SplitFlapBoard from "@/components/transit/SplitFlapBoard";
import Ticket from "@/components/transit/Ticket";
import { TransitDiagram } from "@/components/transit/TransitDiagram";
import { StationPlate } from "@/components/transit/StationPlate";
import { DEMO_NETWORK } from "@/lib/transit/fixtures";
import { registerTimeline } from "@/lib/animation/motionRegistry";
import { usePrefersReducedMotion } from "@/lib/animation/usePrefersReducedMotion";
import { EASE_TRAIN_DECELERATE, EASE_STANDARD } from "@/lib/animation/eases";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Off-screen start for the arrival scrub, in scene units (train enters from the portal side). */
const TRAIN_OFFSCREEN_X = -1500;
/** Parallax pan budget per unit depth, scene px. Far layers barely move; near layers lead. */
const PARALLAX_PAN = -90;

const STATUS_WORD: Record<string, string> = {
  visited: "VISITED",
  progress: "IN PROGRESS",
  planning: "PLANNING",
};

function departureRows() {
  const codes = ["A01", "A02", "A03", "A04", "B02"];
  return codes.map((code) => {
    const s = DEMO_NETWORK.stations[code];
    return { label: s?.code ?? code, text: `${s?.name ?? code}  ${STATUS_WORD[s?.status ?? "planning"]}` };
  });
}

function ticketStops() {
  return ["A01", "A02", "A03", "A04", "B03"].flatMap((code) => {
    const s = DEMO_NETWORK.stations[code];
    return s ? [{ code: s.code, name: s.name, status: s.status }] : [];
  });
}

/**
 * StationDemo — the first composed JccL Line experience (preview route).
 * Beat 1: scroll-scrubbed train arrival with depth parallax (seekable as
 * "station-arrival" per CLAUDE.md rule 5). Beat 2: departures hall.
 * Beat 3: ticket validation revealing the network diagram.
 * Reduced motion: no pin, no scrub — the settled composition of every beat.
 */
export default function StationDemo() {
  const reduced = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const arrivalRef = useRef<HTMLElement>(null);
  const [punched, setPunched] = useState(false);

  useGSAP(
    () => {
      if (reduced) return;
      const section = arrivalRef.current;
      const root = rootRef.current;
      if (!section || !root) return;

      const train = root.querySelector<SVGGElement>('[data-testid="layer-train"]');
      const layers = Array.from(root.querySelectorAll<SVGGElement>("[data-depth]")).filter(
        (el) => el.dataset.testid !== "layer-train",
      );
      if (!train) return;

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });

      // Depth parallax: the platform pans slightly as you scroll; far layers lag.
      for (const layer of layers) {
        const depth = Number(layer.dataset.depth ?? 0);
        tl.to(layer, { x: PARALLAX_PAN * depth, ease: "none" }, 0);
      }

      // The train arrives out of the portal and settles at the platform.
      tl.fromTo(
        train,
        { x: TRAIN_OFFSCREEN_X },
        { x: TRAIN_PARKED_X, ease: EASE_TRAIN_DECELERATE, duration: 0.72 },
        0,
      );

      // Arrival caption hands over to the "doors opening" line.
      tl.to('[data-beat="approach"]', { autoAlpha: 0, ease: EASE_STANDARD, duration: 0.12 }, 0.55);
      tl.fromTo(
        '[data-beat="arrived"]',
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, ease: EASE_STANDARD, duration: 0.16 },
        0.74,
      );

      const unregister = registerTimeline("station-arrival", tl);
      return () => unregister();
    },
    { scope: rootRef, dependencies: [reduced] },
  );

  return (
    <div
      ref={rootRef}
      style={{ background: "var(--color-ground-0)", color: "var(--color-ink-signage)" }}
    >
      {/* ——— Beat 1 · Arrival ——— */}
      <section
        ref={arrivalRef}
        aria-label="Platform 1 — train arriving"
        className={reduced ? "relative" : "relative h-[280vh]"}
      >
        <div className={reduced ? "relative h-screen overflow-hidden" : "sticky top-0 h-screen overflow-hidden"}>
          <StationScene
            stationName="Concourse"
            line="a"
            trainX={reduced ? undefined : TRAIN_OFFSCREEN_X}
            className="absolute inset-0 h-full w-full"
          />

          {/* Overlay chrome — HUD layer over the scene. */}
          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-6 sm:p-10">
            <div>
              <p
                className="text-xs uppercase tracking-[0.35em]"
                style={{ color: "var(--color-ink-muted)", fontFamily: "var(--font-geist-mono)" }}
              >
                The JccL Line · Platform 1
              </p>
              <h1
                className="mt-2 text-3xl sm:text-5xl font-bold uppercase"
                style={{ fontFamily: "var(--font-signage)" }}
              >
                Concourse
              </h1>
            </div>
            <DotMatrixSign text="WELCOME ABOARD — THE JCCL LINE" marquee={!reduced} className="max-w-[46vw]" />
          </div>

          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
            {reduced ? (
              <p style={{ color: "var(--color-ink-muted)" }}>
                This is a JccL Line service. Doors are open — the departures board is below.
              </p>
            ) : (
              <>
                <p data-beat="approach" style={{ color: "var(--color-ink-muted)" }}>
                  Scroll — a train is approaching Platform 1.
                </p>
                <p data-beat="arrived" style={{ opacity: 0, color: "var(--color-board-amber)" }}>
                  This is a JccL Line service. Doors opening — mind the gap.
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ——— Beat 2 · Departures hall ——— */}
      <section aria-label="Departures" className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
        <p
          className="text-xs uppercase tracking-[0.35em] mb-6"
          style={{ color: "var(--color-ink-muted)", fontFamily: "var(--font-geist-mono)" }}
        >
          Departures · All services
        </p>
        <SplitFlapBoard rows={departureRows()} />

        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          <StationPlate name="Kyoto" nameLocal="京都" nameLocalLang="ja" code="A02" line="a" status="visited" />
          <StationPlate name="Hong Kong" nameLocal="香港" nameLocalLang="zh-Hant" code="A03" line="a" status="visited" />
          <StationPlate name="Reykjavik" code="B03" line="b" status="planning" />
        </div>
      </section>

      {/* ——— Beat 3 · Ticket gate ——— */}
      <section
        aria-label="Ticket gate"
        className="mx-auto max-w-5xl px-6 pb-24 grid gap-10 lg:grid-cols-2 items-start"
      >
        <div>
          <p
            className="text-xs uppercase tracking-[0.35em] mb-6"
            style={{ color: "var(--color-ink-muted)", fontFamily: "var(--font-geist-mono)" }}
          >
            Ticket gate · Validation required
          </p>
          <Ticket holder="GUEST" stations={ticketStops()} onPunch={() => setPunched(true)} />
        </div>

        <div aria-live="polite">
          {punched ? (
            <div data-testid="network-reveal">
              <p
                className="text-xs uppercase tracking-[0.35em] mb-6"
                style={{ color: "var(--color-board-amber)", fontFamily: "var(--font-geist-mono)" }}
              >
                Network map · You are at Home
              </p>
              <div
                className="rounded-md border p-4"
                style={{ borderColor: "var(--color-ground-line)", background: "var(--color-ground-1)" }}
              >
                <TransitDiagram network={DEMO_NETWORK} currentCode="X01" />
              </div>
            </div>
          ) : (
            <p className="mt-12" style={{ color: "var(--color-ink-faint)" }}>
              Validate your ticket to view the network map.
            </p>
          )}
        </div>
      </section>

      <footer
        className="border-t px-6 py-10 text-center text-sm"
        style={{ borderColor: "var(--color-ground-line)", color: "var(--color-ink-faint)" }}
      >
        Preview platform — no timetable is final. Operated by JccL. All journeys real.
      </footer>
    </div>
  );
}
