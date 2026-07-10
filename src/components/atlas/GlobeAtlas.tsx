"use client";

import { useEffect, useRef, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import { useTransitionRouter } from "next-view-transitions";
import type { Map as MapLibreMap } from "maplibre-gl";
import type { Feature } from "geojson";
import { SITE_NETWORK } from "@/lib/transit/network";
import type { LineId, Station } from "@/lib/transit/types";
import { greatCircle } from "@/lib/atlas/geo";
import { usePrefersReducedMotion } from "@/lib/animation/usePrefersReducedMotion";

/**
 * GlobeAtlas — the network on a night-service globe (doc 07 D4, ADR 0006).
 *
 * - MapLibre GL v5, keyless OpenFreeMap tiles, style JSON GENERATED from
 *   tokens (public/atlas/night-service.json — pnpm tokens).
 * - Activated on intent: ~274KB gz of engine loads only after the visitor
 *   asks for the globe (the poster is the no-JS/no-WebGL/reduced state).
 * - Arcs are pre-densified great circles per line; station markers are DOM
 *   elements in the diagram's node grammar, click → line guide anchor.
 * - Reduced motion: no ambient spin (drag/zoom still work — that's user
 *   motion, not ambient). WebGL context loss returns to the poster.
 */

type AtlasState = "poster" | "loading" | "ready" | "unsupported";

/** Ambient spin: degrees of longitude per second at rest. */
const SPIN_DEG_PER_SEC = 3;

const ATLAS_CSS = `
.jccl-atlas {
  position: relative;
  height: 480px;
  overflow: hidden;
  border-radius: var(--layout-radius-plate);
  border: 1px solid var(--color-ground-line);
  background: var(--color-ground-0);
}
.jccl-atlas-poster {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  width: 100%;
  border: none;
  cursor: pointer;
  background:
    radial-gradient(circle at 50% 120%, var(--color-ground-2) 0%, var(--color-ground-0) 70%);
  color: var(--color-ink-muted);
}
.jccl-atlas-poster:hover .jccl-atlas-poster-cta {
  color: var(--color-board-amber);
}
.jccl-atlas-poster-globe {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  border: 2px solid var(--color-ground-line);
  background:
    radial-gradient(circle at 32% 30%, var(--color-ground-2) 0%, var(--color-ground-1) 65%);
  position: relative;
}
.jccl-atlas-poster-globe::after {
  content: "";
  position: absolute;
  inset: -14px;
  border-radius: 50%;
  border: 1px dashed var(--color-ground-line);
}
.jccl-atlas-poster-cta {
  font-family: var(--font-stack-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}
.jccl-atlas-map {
  position: absolute;
  inset: 0;
}
.jccl-atlas-marker {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--color-ground-0);
  border: 3px solid var(--marker-color);
  cursor: pointer;
}
.jccl-atlas-marker[data-status="planning"] { border-style: dashed; }
.jccl-atlas-hud {
  position: absolute;
  left: 12px;
  bottom: 12px;
  z-index: 2;
  pointer-events: none;
}
`;

interface Waypoint {
  station: Station;
  line: LineId;
}

function waypoints(): Waypoint[] {
  const seen = new Set<string>();
  const out: Waypoint[] = [];
  for (const line of SITE_NETWORK.lines) {
    for (const code of line.stations) {
      const station = SITE_NETWORK.stations[code];
      if (!station?.coords || seen.has(code)) continue;
      seen.add(code);
      out.push({ station, line: line.id });
    }
  }
  return out;
}

/** Arc features per line: consecutive stations with coordinates. */
function arcFeatures(): Feature[] {
  const features: Feature[] = [];
  for (const line of SITE_NETWORK.lines) {
    const stops = line.stations
      .map((code) => SITE_NETWORK.stations[code])
      .filter((s): s is Station => Boolean(s?.coords));
    for (let i = 0; i < stops.length - 1; i++) {
      features.push({
        type: "Feature",
        properties: { line: line.id },
        geometry: {
          type: "LineString",
          coordinates: greatCircle(stops[i].coords!, stops[i + 1].coords!),
        },
      });
    }
  }
  return features;
}

export default function GlobeAtlas() {
  const router = useTransitionRouter();
  const reducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [state, setState] = useState<AtlasState>("poster");

  useEffect(() => {
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  const activate = async () => {
    if (state !== "poster") return;
    setState("loading");
    try {
      const maplibre = await import("maplibre-gl");
      const container = containerRef.current;
      if (!container) return;

      const styles = getComputedStyle(document.documentElement);
      const lineColor = (id: LineId) =>
        styles.getPropertyValue(`--color-lines-${id}`).trim();

      const map = new maplibre.Map({
        container,
        style: "/atlas/night-service.json",
        center: [10, 35],
        zoom: 1.4,
        minZoom: 0.8,
        maxZoom: 6,
        attributionControl: { compact: true },
        canvasContextAttributes: { antialias: true },
      });
      mapRef.current = map;

      map.on("error", () => {
        /* tile hiccups are non-fatal; the globe keeps rendering */
      });
      map.getCanvas().addEventListener("webglcontextlost", () => {
        setState("poster");
        map.remove();
        mapRef.current = null;
      });

      const ready = () => setState((prev) => (prev === "loading" ? "ready" : prev));

      // Ambient spin — started only after the network overlay is up (the
      // spin keeps the map permanently non-idle); reduced motion skips it;
      // any interaction stops it (user motion stays available).
      const startSpin = () => {
        if (reducedMotion || !mapRef.current) return;
        let spinning = true;
        const stop = () => {
          spinning = false;
        };
        map.on("pointerdown", stop);
        map.on("wheel", stop);
        map.on("touchstart", stop);
        const spin = () => {
          if (!spinning || !mapRef.current) return;
          const center = map.getCenter();
          center.lng += SPIN_DEG_PER_SEC;
          map.easeTo({ center, duration: 1000, easing: (n) => n });
        };
        map.on("moveend", () => {
          if (spinning) spin();
        });
        spin();
      };

      // The network overlay must outlive a tile outage: mount it once on
      // whichever of load/idle arrives first (load never fires when the
      // tile host is unreachable; the globe still renders). Mounting ends
      // in ready() + startSpin(), so the poster always clears.
      let networkMounted = false;
      const mountNetwork = () => {
        if (networkMounted || !mapRef.current) return;
        networkMounted = true;
        // Route arcs — one layer per line so each keeps its livery color.
        map.addSource("jccl-arcs", {
          type: "geojson",
          data: { type: "FeatureCollection", features: arcFeatures() },
          lineMetrics: true,
        });
        for (const line of SITE_NETWORK.lines) {
          map.addLayer({
            id: `jccl-arc-${line.id}`,
            type: "line",
            source: "jccl-arcs",
            filter: ["==", ["get", "line"], line.id],
            layout: { "line-cap": "round", "line-join": "round" },
            paint: {
              "line-color": lineColor(line.id),
              "line-width": 2.5,
              "line-opacity": 0.9,
            },
          });
        }

        // Station markers in the diagram node grammar (DOM, line colors
        // via CSS vars, click boards the line guide at that station).
        for (const { station, line } of waypoints()) {
          const el = document.createElement("button");
          el.className = "jccl-atlas-marker";
          el.style.setProperty("--marker-color", `var(--color-lines-${line})`);
          el.dataset.status = station.status;
          el.setAttribute(
            "aria-label",
            `${station.name}, station ${station.code} — open in the line guide`,
          );
          el.addEventListener("click", () =>
            router.push(`/travel/#${station.code}`),
          );
          new maplibre.Marker({ element: el })
            .setLngLat([station.coords!.lng, station.coords!.lat])
            .addTo(map);
        }


        ready();
        startSpin();
      };
      map.on("load", mountNetwork);
      map.once("idle", mountNetwork);
      // Tile-host outage: the source errors, load/idle may never arrive —
      // mount the network overlay anyway (bare globe + arcs + stations).
      map.on("error", (e) => {
        if ((e as { sourceId?: string }).sourceId === "openfreemap") {
          mountNetwork();
        }
      });
    } catch {
      setState("unsupported");
    }
  };

  return (
    <div className="jccl-atlas" data-testid="globe-atlas" data-state={state}>
      <style>{ATLAS_CSS}</style>
      <div
        ref={containerRef}
        className="jccl-atlas-map"
        role="application"
        aria-label="Globe of the JccL network. Drag to rotate; station markers open the line guide."
      />
      {state !== "ready" ? (
        <button
          type="button"
          className="jccl-atlas-poster"
          onClick={activate}
          disabled={state === "loading" || state === "unsupported"}
        >
          <span aria-hidden="true" className="jccl-atlas-poster-globe" />
          <span className="jccl-atlas-poster-cta">
            {state === "loading"
              ? "Preparing the atlas — this can take a moment"
              : state === "unsupported"
                ? "The atlas needs WebGL · the network map covers all stations"
                : "Open the atlas · spin the network globe"}
          </span>
        </button>
      ) : (
        <p className="jccl-telemetry jccl-atlas-hud">
          DRAG TO ROTATE · STATIONS OPEN THE LINE GUIDE
        </p>
      )}
    </div>
  );
}
