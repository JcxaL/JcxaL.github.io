import type { TransitNetwork } from "@/lib/transit/types";

/**
 * DEMO_NETWORK — a small believable JccL Line network for tests and previews.
 *
 * Two lines share one interchange: X01 "Home" is a single station whose code
 * appears in both lines' ordered station lists, so the interchange capsule
 * marks the same diagram position for both (station codes are globally
 * unique — one station, two lines).
 *
 * Diagram coordinates are abstract octilinear grid units chosen to exercise
 * the renderer: pure diagonals (X01→A01, X01→B01), straights (A01→A02),
 * and Beck elbows (A02→A03 and B02→B03 need one 45° bend each).
 * Statuses are mixed so every status treatment renders.
 */
export const DEMO_NETWORK: TransitNetwork = {
  lines: [
    {
      id: "a",
      name: "East Asia Line",
      stations: ["X01", "A01", "A02", "A03", "A04"],
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
      slug: "tokyo",
      name: "Tokyo",
      nameLocal: "東京",
    nameLocalLang: "ja",
      status: "visited",
      x: 2,
      y: 1,
      coords: { lat: 35.6762, lng: 139.6503 },
    },
    A02: {
      code: "A02",
      slug: "kyoto",
      name: "Kyoto",
      nameLocal: "京都",
    nameLocalLang: "ja",
      status: "visited",
      x: 5,
      y: 1,
      coords: { lat: 35.0116, lng: 135.7681 },
    },
    A03: {
      code: "A03",
      slug: "hong-kong",
      name: "Hong Kong",
      nameLocal: "香港",
    nameLocalLang: "zh-Hant",
      status: "progress",
      x: 7,
      y: 2,
      coords: { lat: 22.3193, lng: 114.1694 },
    },
    A04: {
      code: "A04",
      slug: "seoul",
      name: "Seoul",
      status: "planning",
      x: 9,
      y: 2,
      coords: { lat: 37.5665, lng: 126.978 },
    },
    B01: {
      code: "B01",
      slug: "lisbon",
      name: "Lisbon",
      status: "visited",
      x: 2,
      y: 5,
      coords: { lat: 38.7223, lng: -9.1393 },
    },
    B02: {
      code: "B02",
      slug: "paris",
      name: "Paris",
      status: "progress",
      x: 5,
      y: 5,
      coords: { lat: 48.8566, lng: 2.3522 },
    },
    B03: {
      code: "B03",
      slug: "reykjavik",
      name: "Reykjavik",
      status: "planning",
      x: 8,
      y: 3,
      coords: { lat: 64.1466, lng: -21.9426 },
    },
  },
  interchanges: [{ codes: ["X01"] }],
};
