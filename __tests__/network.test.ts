import {
  SITE_NETWORK,
  STATION_NOTES,
  networkStats,
  stationsInLineOrder,
} from "@/lib/transit/network";

describe("SITE_NETWORK integrity", () => {
  it("uses deterministic Tokyo-style station codes", () => {
    for (const [key, station] of Object.entries(SITE_NETWORK.stations)) {
      expect(station.code).toBe(key);
      expect(station.code).toMatch(/^[A-Z]\d{2}$/);
      expect(station.slug).toMatch(/^[a-z-]+$/);
    }
  });

  it("only references stations that exist, in every line", () => {
    for (const line of SITE_NETWORK.lines) {
      for (const code of line.stations) {
        expect(SITE_NETWORK.stations[code]).toBeDefined();
      }
    }
  });

  it("dedupes the interchange across lines in list order", () => {
    const codes = stationsInLineOrder();
    expect(new Set(codes).size).toBe(codes.length);
    expect(codes[0]).toBe("X01");
  });

  it("counts statuses for the HUD strip", () => {
    const stats = networkStats();
    expect(stats.stations).toBe(6);
    expect(stats.lines).toBe(2);
    expect(
      stats.byStatus.visited + stats.byStatus.progress + stats.byStatus.planning,
    ).toBe(stats.stations);
  });

  it("gives every destination a journal note; guide slugs resolve", () => {
    for (const code of stationsInLineOrder()) {
      if (code === "X01") continue;
      const note = STATION_NOTES[code];
      expect(note).toBeDefined();
      expect(note.season.length).toBeGreaterThan(0);
      expect(note.hook.length).toBeGreaterThan(0);
      expect(note.tags.length).toBeGreaterThan(0);
    }
    for (const [code, note] of Object.entries(STATION_NOTES)) {
      expect(SITE_NETWORK.stations[code]).toBeDefined();
      if (note.guideSlug) {
        expect(SITE_NETWORK.stations[code].slug).toBe(note.guideSlug);
      }
    }
  });

  it("keeps bilingual plates honestly tagged", () => {
    for (const station of Object.values(SITE_NETWORK.stations)) {
      if (station.nameLocal) {
        expect(station.nameLocalLang).toBeDefined();
      }
    }
  });
});
