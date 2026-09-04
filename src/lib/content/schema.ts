/**
 * The JccL Line — station content contract.
 *
 * Zod schemas for per-place MDX frontmatter (docs/design/06-experience-blueprint.md §4).
 * Every file in `src/content/stations/*.mdx` must satisfy `stationFrontmatterSchema`;
 * `parseStationFrontmatter` powers CI content validation and throws readable,
 * per-field errors. Stations that are not fully fitted out ship as
 * "under construction" (`isUnderConstruction`) — visible on the line with
 * tape-and-cones styling, never hidden.
 *
 * Copy template: `src/content/stations/_TEMPLATE.mdx`.
 */

import { z } from "zod";
import type { LineId, StationStatus } from "@/lib/transit/types";

/** Line letters — kept in sync with `LineId` via `satisfies`. */
const LINE_IDS = ["a", "b", "c", "d", "e", "f"] as const satisfies readonly LineId[];

/** Station statuses — kept in sync with `StationStatus` via `satisfies`. */
const STATION_STATUSES = [
  "visited",
  "progress",
  "planning",
] as const satisfies readonly StationStatus[];

/** Tokyo-style station code: line letter A–F (or X for specials) + two digits. */
export const STATION_CODE_RE = /^[A-FX]\d{2}$/;

/** URL slug: lowercase kebab-case, e.g. "kyoto" or "hong-kong". */
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Geographic point (decimal degrees). */
const geoPointSchema = z.object({
  lat: z
    .number({ error: "lat must be a number in decimal degrees" })
    .min(-90, { error: "lat must be ≥ -90" })
    .max(90, { error: "lat must be ≤ 90" }),
  lng: z
    .number({ error: "lng must be a number in decimal degrees" })
    .min(-180, { error: "lng must be ≥ -180" })
    .max(180, { error: "lng must be ≤ 180" }),
});

/** Root-absolute path ("/images/…") or full http(s) URL. */
export const mediaRefSchema = z
  .string()
  .refine((v) => v.startsWith("/") || /^https?:\/\/\S+$/.test(v), {
    error: 'Must be a root-absolute path (e.g. "/images/…") or a full http(s) URL',
  });

/** ISO calendar date string, e.g. "2026-11-02". Quote dates in YAML. */
const isoDateSchema = z.iso.date({
  error: 'Must be an ISO date string, e.g. "2026-11-02" (quote it in YAML)',
});

/** Optional travel window for the facts plate. */
const dateRangeSchema = z.object({
  from: isoDateSchema.optional(),
  to: isoDateSchema.optional(),
});

/** Facts plate: dates/duration/km/season/cost band (doc 06 §4). */
const factsSchema = z.object({
  durationDays: z
    .int({ error: "durationDays must be an integer" })
    .positive({ error: "durationDays must be a positive integer" })
    .optional(),
  km: z
    .number({ error: "km must be a number" })
    .positive({ error: "km must be a positive number" })
    .optional(),
  costBand: z.enum(["$", "$$", "$$$"], {
    error: 'costBand must be one of "$", "$$", "$$$"',
  })
    .optional(),
});

/**
 * Radar block — the pre-existing gear/budget/mood/tracks shape. Kept loose on
 * purpose (unknown keys pass through) so legacy radar data ports without churn.
 */
const radarSchema = z.looseObject({
  gear: z.array(z.string()).optional(),
  budget: z.union([z.string(), z.record(z.string(), z.unknown())]).optional(),
  mood: z.array(z.string()).optional(),
  topTracks: z.array(z.unknown()).optional(),
});

/**
 * Frontmatter contract for one station page (`src/content/stations/<slug>.mdx`).
 */
export const stationFrontmatterSchema = z
  .object({
    /** URL slug; must match the filename (`<slug>.mdx`). */
    slug: z.string().regex(SLUG_RE, {
      error: 'slug must be lowercase kebab-case, e.g. "hong-kong"',
    }),
    /** Display name (Latin script) for the station plate. */
    title: z.string().min(1, { error: "title is required" }),
    /** Optional local-script name for the bilingual plate (e.g. 京都 under KYOTO). */
    nameLocal: z.string().optional(),
    /** Deterministic station code: A–F (or X) + two digits, e.g. "A03". */
    code: z.string().regex(STATION_CODE_RE, {
      error:
        'code must be a line letter A–F (or X for specials) followed by two digits, e.g. "A03"',
    }),
    /** Line letter this station sits on (maps to --color-lines-{a..f}). */
    line: z.enum(LINE_IDS, {
      error: 'line must be one of "a"–"f"',
    }),
    /** visited | progress | planning. "visited" requires humanMoment. */
    status: z.enum(STATION_STATUSES, {
      error: 'status must be "visited", "progress", or "planning"',
    }),
    /** Geographic coordinates (globe/map rendering). */
    coords: geoPointSchema,
    /** Region label for grouping on ride and globe views, e.g. "East Asia". */
    region: z.string().min(1, { error: "region is required" }),
    /** Optional country name. */
    country: z.string().optional(),
    /** Optional travel window (ISO date strings; quote them in YAML). */
    dates: dateRangeSchema.optional(),
    /** Optional season descriptor, e.g. "Late autumn". */
    season: z.string().optional(),
    /** One-line card hook — the teaser that earns the click. Max 140 chars. */
    hook: z
      .string()
      .min(1, { error: "hook is required" })
      .max(140, { error: "hook must be 140 characters or fewer" }),
    /** Hero image: root-absolute path or full URL. Required to leave under-construction. */
    heroImage: mediaRefSchema.optional(),
    /** Window poster, art-directed for the train-window crop. */
    windowPoster: mediaRefSchema.optional(),
    /** Ordered coordinates for the themed-map line. Minimum 2 points. */
    route: z
      .array(geoPointSchema)
      .min(2, { error: "route needs at least 2 points to draw a line" })
      .optional(),
    /** Facts plate: duration, distance, cost band. */
    facts: factsSchema.optional(),
    /** One short first-person paragraph. Required when status is "visited". */
    humanMoment: z.string().optional(),
    /** Optional one-line pull quote. */
    quote: z.string().optional(),
    /** Free-form tags. Defaults to []. */
    tags: z.array(z.string()).default([]),
    /** Optional radar block (gear/budget/mood/tracks; extra keys pass through). */
    radar: radarSchema.optional(),
    /** Optional media base URL (e.g. the R2 bucket path for this station). */
    mediaBase: z
      .url({ error: "mediaBase must be a full URL" })
      .optional(),
  })
  .superRefine((fm, ctx) => {
    if (fm.status === "visited" && !fm.humanMoment?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["humanMoment"],
        message:
          'humanMoment is required when status is "visited" — one short first-person paragraph (doc 06 §4)',
      });
    }
  });

export type StationFrontmatter = z.infer<typeof stationFrontmatterSchema>;

/**
 * Parse raw frontmatter (e.g. gray-matter output) into a `StationFrontmatter`.
 *
 * Throws an `Error` whose message names the offending source file (when given)
 * and lists every failing field on its own line — this is the message CI
 * content validation surfaces, so it must read cleanly in a terminal:
 *
 *   Invalid station frontmatter in src/content/stations/kyoto.mdx:
 *     code: code must be a line letter A–F (or X for specials) followed by two digits, e.g. "A03"
 */
export function parseStationFrontmatter(
  data: unknown,
  sourcePath?: string,
): StationFrontmatter {
  const result = stationFrontmatterSchema.safeParse(data);
  if (result.success) return result.data;

  const { formErrors, fieldErrors } = z.flattenError(result.error);
  const lines: string[] = [];
  for (const message of formErrors) {
    lines.push(`  (frontmatter) ${message}`);
  }
  for (const [field, messages] of Object.entries(fieldErrors)) {
    if (messages && messages.length > 0) {
      lines.push(`  ${field}: ${messages.join("; ")}`);
    }
  }

  const where = sourcePath ? ` in ${sourcePath}` : "";
  throw new Error(`Invalid station frontmatter${where}:\n${lines.join("\n")}`);
}

/**
 * A station is under construction until it is fully fitted out: status
 * "visited" AND a hero image AND a human moment. Under-construction stations
 * stay visible on the line with tape-and-cones styling (doc 06 §4) —
 * "Station opening soon. Works in progress."
 */
export function isUnderConstruction(
  fm: Pick<StationFrontmatter, "status" | "heroImage" | "humanMoment">,
): boolean {
  return (
    fm.status !== "visited" ||
    !fm.heroImage?.trim() ||
    !fm.humanMoment?.trim()
  );
}
