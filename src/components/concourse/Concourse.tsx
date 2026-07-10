"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitFlapBoard from "@/components/transit/SplitFlapBoard";
import DepartureBoard, {
  type Departure,
} from "@/components/transit/DepartureBoard";
import DotMatrixSign from "@/components/transit/DotMatrixSign";
import Ticket from "@/components/transit/Ticket";
import TransitDiagram from "@/components/transit/TransitDiagram";
import StatusLegend from "@/components/transit/StatusLegend";
import { SITE_NETWORK, networkStats } from "@/lib/transit/network";
import {
  createConcourseIntro,
  readMotionMs,
} from "@/lib/animation/concourse";
import { registerTimeline } from "@/lib/animation/motionRegistry";
import { usePrefersReducedMotion } from "@/lib/animation/usePrefersReducedMotion";

/**
 * Concourse — the station hall the site opens onto.
 * System voice everywhere (doc 12); the single cinematic here is the
 * arrival intro (rows settle, lines draw), registered as "concourse-intro".
 */

const DEPARTURES: Departure[] = [
  { href: "/travel/", destination: "Travel", due: "NOW", platform: "1", statusWord: "Boarding", tone: "boarding" },
  { href: "/blog/", destination: "Notices", due: "NOW", platform: "2", statusWord: "In service", tone: "service" },
  { href: "/about/", destination: "Operator", due: "NOW", platform: "3", statusWord: "In service", tone: "service" },
  { href: "/contact/", destination: "Contact", due: "NOW", platform: "4", statusWord: "In service", tone: "service" },
  { href: "/photography/", destination: "Photography", due: "2026", platform: "5", statusWord: "Under construction", tone: "works" },
  { href: "/music/", destination: "Music", due: "2026", platform: "6", statusWord: "Under construction", tone: "works" },
  { href: "/design/", destination: "Design", due: "2026", platform: "7", statusWord: "Under construction", tone: "works" },
];

/** Stops printed on the concourse ticket — the network's current headline. */
const TICKET_STOPS = [
  { code: "A01", name: "Kyoto", status: "visited" as const },
  { code: "B01", name: "Lisbon", status: "visited" as const },
  { code: "B02", name: "Paris", status: "progress" as const },
  { code: "B03", name: "Reykjavik", status: "planning" as const },
];

/* Plain classes (no Tailwind colon variants) on the hero: colon class names
   on Ticket ancestors make jsdom's selector engine choke on the ticket's
   :has(:focus-visible) rule during role queries. */
const HERO_CSS = `
.jccl-concourse-hero {
  display: grid;
  gap: 2.5rem;
  padding-top: 3.5rem;
  padding-bottom: 4rem;
}
.jccl-concourse-title {
  font-size: clamp(3rem, 8vw, 4.5rem);
}
@media (min-width: 768px) {
  .jccl-concourse-hero {
    grid-template-columns: 1.35fr 1fr;
    align-items: start;
    gap: 3.5rem;
    padding-top: 5rem;
  }
  .jccl-concourse-aside {
    padding-top: 2.5rem;
  }
}
`;

export default function Concourse() {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const stats = networkStats();

  useGSAP(
    () => {
      if (reducedMotion) return;
      const root = rootRef.current;
      if (!root) return;
      const rows = gsap.utils.toArray<Element>("[data-depart-row]", root);
      const paths = gsap.utils.toArray<SVGPathElement>(
        "[data-testid^='line-path-']",
        root,
      );
      const tl = createConcourseIntro({ rows, paths });
      const unregister = registerTimeline("concourse-intro", tl);
      return () => {
        unregister();
      };
    },
    { scope: rootRef, dependencies: [reducedMotion] },
  );

  /** Punching the ticket boards the Travel line (doors, then depart). */
  const handlePunch = () => {
    const delay = reducedMotion
      ? 0
      : readMotionMs(rootRef.current, "door");
    window.setTimeout(() => router.push("/travel/"), delay);
  };

  return (
    <div ref={rootRef} className="mx-auto max-w-6xl px-6">
      <style>{HERO_CSS}</style>
      {/* ---- Hero: service information ---- */}
      <section className="jccl-concourse-hero">
        <div>
          <p className="jccl-kicker">X01 · Concourse — Service information</p>
          <h1
            className="jccl-signage jccl-concourse-title mt-5"
            style={{ letterSpacing: "0.02em" }}
          >
            The JccL
            <br />
            Line
          </h1>
          <div
            aria-hidden="true"
            className="mt-6 h-1.5 w-24"
            style={{ backgroundColor: "var(--color-board-amber)" }}
          />
          <p
            className="jccl-measure mt-6 text-lg leading-relaxed"
            style={{ color: "var(--color-ink-muted)", maxWidth: "44ch" }}
          >
            A personal museum of places, entered through the Metro. Travel
            journals, photography and field notes — one station at a time.
          </p>
          <div className="mt-8">
            <SplitFlapBoard
              rows={[
                { label: "SERVICE", text: "WELCOME ABOARD" },
                { label: "OPERATOR", text: "JCCL" },
                { label: "STATUS", text: "ALL LINES GOOD" },
              ]}
            />
          </div>
        </div>

        <div className="jccl-concourse-aside">
          <p className="jccl-kicker mb-4">Ticket office</p>
          <Ticket holder="Guest" stations={TICKET_STOPS} onPunch={handlePunch} />
          <p className="jccl-telemetry mt-3">
            VALID FOR ONE JOURNEY · PUNCH TO BOARD THE TRAVEL LINE
          </p>
        </div>
      </section>

      {/* ---- Departures ---- */}
      <section className="pb-16">
        <div className="mb-5 flex items-baseline justify-between gap-4">
          <h2 className="jccl-signage text-xl">Departures</h2>
          <p className="jccl-telemetry">ALL SERVICES · UPDATED DAILY</p>
        </div>
        <DepartureBoard departures={DEPARTURES} />
      </section>

      {/* ---- Network map ---- */}
      <section className="pb-16">
        <div className="mb-5 flex items-baseline justify-between gap-4">
          <h2 className="jccl-signage text-xl">Network map</h2>
          <p className="jccl-telemetry">
            {stats.stations} STATIONS · {stats.lines} LINES ·{" "}
            {stats.byStatus.visited} VISITED
          </p>
        </div>
        <div className="jccl-panel overflow-x-auto p-6 sm:p-8">
          <TransitDiagram
            network={SITE_NETWORK}
            currentCode="X01"
            onStationClick={(code) => {
              const station = SITE_NETWORK.stations[code];
              if (station) router.push(`/travel/#${station.code}`);
            }}
          />
          <StatusLegend className="mt-6" />
        </div>
      </section>

      {/* ---- Service marquee ---- */}
      <section className="pb-4">
        <DotMatrixSign
          marquee
          text="THIS IS A JCCL LINE SERVICE · MIND THE GAP BETWEEN PLAN AND REALITY · NEXT GUIDE: PARIS — ATLANTIC LINE · PLEASE HOLD THE HANDRAIL"
        />
      </section>
    </div>
  );
}
