import type { StationStatus, TransitNetwork } from "@/lib/transit/types";

/**
 * SITE_NETWORK — the real JccL Line map rendered on the concourse and the
 * travel index (DEMO_NETWORK in fixtures.ts stays test-only).
 *
 * X01 "Home" is the interchange both lines share. Diagram coordinates are
 * abstract octilinear grid units (NOT geography); coords carry the real
 * lat/lng for the future globe. Station codes are the deterministic IDs —
 * they appear in slugs, test IDs, and screenshot names (CLAUDE.md).
 */
export const SITE_NETWORK: TransitNetwork = {
  lines: [
    {
      id: "a",
      name: "East Asia Line",
      stations: ["X01", "A01", "A02"],
    },
    {
      id: "b",
      name: "Atlantic Line",
      stations: ["X01", "B01", "B02", "B03"],
    },
  ],
  stations: {
    X01: {
      code: "X01",
      slug: "home",
      name: "Home",
      status: "visited",
      x: 0,
      y: 3,
    },
    A01: {
      code: "A01",
      slug: "kyoto",
      name: "Kyoto",
      nameLocal: "京都",
      nameLocalLang: "ja",
      status: "visited",
      x: 3,
      y: 1,
      coords: { lat: 35.0116, lng: 135.7681 },
    },
    A02: {
      code: "A02",
      slug: "seoul",
      name: "Seoul",
      nameLocal: "서울",
      nameLocalLang: "ko",
      status: "planning",
      x: 6,
      y: 1,
      coords: { lat: 37.5665, lng: 126.978 },
    },
    B01: {
      code: "B01",
      slug: "lisbon",
      name: "Lisbon",
      nameLocal: "Lisboa",
      nameLocalLang: "pt",
      status: "visited",
      x: 3,
      y: 5,
      coords: { lat: 38.7223, lng: -9.1393 },
    },
    B02: {
      code: "B02",
      slug: "paris",
      name: "Paris",
      status: "progress",
      x: 6,
      y: 5,
      coords: { lat: 48.8566, lng: 2.3522 },
    },
    B03: {
      code: "B03",
      slug: "reykjavik",
      name: "Reykjavik",
      nameLocal: "Reykjavík",
      nameLocalLang: "is",
      status: "planning",
      x: 9,
      y: 3,
      coords: { lat: 64.1466, lng: -21.9426 },
    },
  },
  interchanges: [{ codes: ["X01"] }],
};

/** Journal metadata per station — everything the diagram doesn't carry. */
export interface StationNote {
  /** Telemetry season line, e.g. "Spring 2024". */
  season: string;
  /** One-line hook in the journal register (first person). */
  hook: string;
  tags: string[];
  /** Slug under /travel/ when a written guide exists. */
  guideSlug?: string;
}

export const STATION_NOTES: Record<string, StationNote> = {
  A01: {
    season: "Spring 2024",
    hook: "Temple dawns before the crowds; a kaiseki notebook I still reread.",
    tags: ["Culture", "Food", "Photography"],
  },
  A02: {
    season: "Target: Spring 2026",
    hook: "Cafés, modular synth shops, night markets — in that order.",
    tags: ["Food", "Music", "City"],
  },
  B01: {
    season: "Autumn 2023",
    hook: "An analog film crawl through Alfama, one roll per afternoon.",
    tags: ["City", "Analog", "Music"],
  },
  B02: {
    season: "Winter 2024",
    hook: "A week of dawn walks with two lenses and too many pastries.",
    tags: ["Photography", "Food", "City"],
    guideSlug: "paris",
  },
  B03: {
    season: "Target: Winter 2026",
    hook: "Aurora chase and geothermal field recordings around the Ring Road.",
    tags: ["Roadtrip", "Nature"],
  },
};

/** Stations in line order (deduped across interchanges), for list views. */
export function stationsInLineOrder(
  network: TransitNetwork = SITE_NETWORK,
): string[] {
  const seen = new Set<string>();
  const codes: string[] = [];
  for (const line of network.lines) {
    for (const code of line.stations) {
      if (seen.has(code)) continue;
      seen.add(code);
      codes.push(code);
    }
  }
  return codes;
}

/** Network stat line for HUD strips: "6 stations · 2 lines". */
export function networkStats(network: TransitNetwork = SITE_NETWORK): {
  stations: number;
  lines: number;
  byStatus: Record<StationStatus, number>;
} {
  const byStatus: Record<StationStatus, number> = {
    visited: 0,
    progress: 0,
    planning: 0,
  };
  for (const code of stationsInLineOrder(network)) {
    const station = network.stations[code];
    if (station) byStatus[station.status] += 1;
  }
  return {
    stations: stationsInLineOrder(network).length,
    lines: network.lines.length,
    byStatus,
  };
}
