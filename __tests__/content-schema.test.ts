import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  isUnderConstruction,
  parseStationFrontmatter,
  stationFrontmatterSchema,
  type StationFrontmatter,
} from "@/lib/content/schema";

/** Minimal valid "visited" frontmatter; spread-and-override per test. */
const baseVisited = () => ({
  slug: "kyoto",
  title: "Kyoto",
  code: "A03",
  line: "a",
  status: "visited",
  coords: { lat: 35.0116, lng: 135.7681 },
  region: "East Asia",
  hook: "Temples before breakfast; trains before everything.",
  heroImage: "/images/stations/kyoto/hero.jpg",
  humanMoment:
    "The ticket machine returned my coins and apologized in two languages.",
});

describe("stationFrontmatterSchema", () => {
  it("parses valid visited frontmatter and defaults tags to []", () => {
    const fm = parseStationFrontmatter(baseVisited());
    expect(fm.slug).toBe("kyoto");
    expect(fm.code).toBe("A03");
    expect(fm.line).toBe("a");
    expect(fm.status).toBe("visited");
    expect(fm.tags).toEqual([]);
  });

  it("parses a fully populated frontmatter, passing radar extras through", () => {
    const fm = parseStationFrontmatter({
      ...baseVisited(),
      nameLocal: "京都",
      country: "Japan",
      dates: { from: "2026-11-02", to: "2026-11-09" },
      season: "Late autumn",
      windowPoster: "https://media.example.com/kyoto/window.jpg",
      route: [
        { lat: 35.0116, lng: 135.7681 },
        { lat: 34.9858, lng: 135.7588 },
      ],
      facts: { durationDays: 7, km: 412, costBand: "$$" },
      quote: "A line worth pulling out of the page.",
      tags: ["temples", "rail"],
      radar: {
        gear: ["camera"],
        budget: "$$",
        mood: ["unhurried"],
        topTracks: [{ title: "Track", artist: "Artist" }],
        customExtra: "kept",
      },
      mediaBase: "https://media.example.com/stations/kyoto",
    });
    expect(fm.nameLocal).toBe("京都");
    expect(fm.route).toHaveLength(2);
    expect(fm.facts?.costBand).toBe("$$");
    expect(
      (fm.radar as Record<string, unknown> | undefined)?.customExtra,
    ).toBe("kept");
  });

  it("rejects a bad station code with a readable message naming the field", () => {
    const attempt = () =>
      parseStationFrontmatter(
        { ...baseVisited(), code: "Z9" },
        "src/content/stations/kyoto.mdx",
      );
    expect(attempt).toThrow(/code/);
    expect(attempt).toThrow(/src\/content\/stations\/kyoto\.mdx/);
    expect(attempt).toThrow(/A03/);
  });

  it("accepts special X-prefixed codes", () => {
    expect(
      parseStationFrontmatter({ ...baseVisited(), code: "X01" }).code,
    ).toBe("X01");
  });

  it("rejects status 'visited' without a humanMoment", () => {
    const data: Record<string, unknown> = { ...baseVisited() };
    delete data.humanMoment;
    const attempt = () => parseStationFrontmatter(data);
    expect(attempt).toThrow(/humanMoment/);
  });

  it("accepts status 'planning' without a humanMoment", () => {
    const data: Record<string, unknown> = { ...baseVisited() };
    delete data.humanMoment;
    delete data.heroImage;
    const fm = parseStationFrontmatter({ ...data, status: "planning" });
    expect(fm.status).toBe("planning");
    expect(fm.humanMoment).toBeUndefined();
  });

  it("enforces coordinate bounds", () => {
    expect(() =>
      parseStationFrontmatter({
        ...baseVisited(),
        coords: { lat: 90.5, lng: 0 },
      }),
    ).toThrow(/coords/);
    expect(() =>
      parseStationFrontmatter({
        ...baseVisited(),
        coords: { lat: 0, lng: -180.5 },
      }),
    ).toThrow(/coords/);
    // Boundary values are valid.
    const fm = parseStationFrontmatter({
      ...baseVisited(),
      coords: { lat: -90, lng: 180 },
    });
    expect(fm.coords).toEqual({ lat: -90, lng: 180 });
  });

  it("caps the hook at 140 characters", () => {
    expect(
      parseStationFrontmatter({ ...baseVisited(), hook: "x".repeat(140) }).hook,
    ).toHaveLength(140);
    expect(() =>
      parseStationFrontmatter({ ...baseVisited(), hook: "x".repeat(141) }),
    ).toThrow(/hook/);
  });

  it("rejects invalid line letters and statuses", () => {
    expect(() =>
      parseStationFrontmatter({ ...baseVisited(), line: "g" }),
    ).toThrow(/line/);
    expect(() =>
      parseStationFrontmatter({ ...baseVisited(), status: "someday" }),
    ).toThrow(/status/);
  });

  it("requires at least 2 points for a route", () => {
    expect(() =>
      parseStationFrontmatter({
        ...baseVisited(),
        route: [{ lat: 1, lng: 1 }],
      }),
    ).toThrow(/route/);
  });

  it("validates facts: positive integer days, positive km, known cost bands", () => {
    expect(() =>
      parseStationFrontmatter({
        ...baseVisited(),
        facts: { durationDays: 0 },
      }),
    ).toThrow(/facts/);
    expect(() =>
      parseStationFrontmatter({
        ...baseVisited(),
        facts: { durationDays: 2.5 },
      }),
    ).toThrow(/facts/);
    expect(() =>
      parseStationFrontmatter({ ...baseVisited(), facts: { km: -3 } }),
    ).toThrow(/facts/);
    expect(() =>
      parseStationFrontmatter({
        ...baseVisited(),
        facts: { costBand: "$$$$" },
      }),
    ).toThrow(/facts/);
  });

  it("rejects media references that are neither root-absolute nor URLs", () => {
    expect(() =>
      parseStationFrontmatter({
        ...baseVisited(),
        heroImage: "images/relative.jpg",
      }),
    ).toThrow(/heroImage/);
  });

  it("safeParse reports failure without throwing", () => {
    const result = stationFrontmatterSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe("isUnderConstruction", () => {
  const fitted: Pick<
    StationFrontmatter,
    "status" | "heroImage" | "humanMoment"
  > = {
    status: "visited",
    heroImage: "/images/stations/kyoto/hero.jpg",
    humanMoment: "One short first-person paragraph.",
  };

  it("is false for a fully fitted visited station", () => {
    expect(isUnderConstruction(fitted)).toBe(false);
  });

  it("is true when status is not 'visited'", () => {
    expect(isUnderConstruction({ ...fitted, status: "planning" })).toBe(true);
    expect(isUnderConstruction({ ...fitted, status: "progress" })).toBe(true);
  });

  it("is true when the hero image is missing", () => {
    expect(isUnderConstruction({ ...fitted, heroImage: undefined })).toBe(true);
  });

  it("is true when the human moment is missing or blank", () => {
    expect(isUnderConstruction({ ...fitted, humanMoment: undefined })).toBe(
      true,
    );
    expect(isUnderConstruction({ ...fitted, humanMoment: "   " })).toBe(true);
  });
});

describe("_TEMPLATE.mdx", () => {
  it("carries frontmatter that satisfies the schema", () => {
    const templatePath = path.join(
      process.cwd(),
      "src/content/stations/_TEMPLATE.mdx",
    );
    const { data } = matter(fs.readFileSync(templatePath, "utf8"));
    const fm = parseStationFrontmatter(data, "_TEMPLATE.mdx");
    expect(fm.slug).toBe("example-city");
    expect(fm.code).toBe("A99");
    expect(fm.status).toBe("planning");
    // Planning + placeholder assets: still under construction, still visible.
    expect(isUnderConstruction(fm)).toBe(true);
  });
});
