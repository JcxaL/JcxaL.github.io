/**
 * The JccL Line — shared transit data model.
 * One graph renders the ticket back, the ride progress rail, the sitemap diagram,
 * and (later) the globe markers. See docs/design/12-brand-signage.md.
 */

/** Line letters map to color tokens --color-lines-{a..f}. */
export type LineId = "a" | "b" | "c" | "d" | "e" | "f";

export type StationStatus = "visited" | "progress" | "planning";

export interface Station {
  /** Tokyo-style code: line letter + 2-digit ordinal, e.g. "A03". Deterministic ID. */
  code: string;
  /** URL slug, e.g. "kyoto". */
  slug: string;
  /** Display name (Latin), e.g. "Kyoto". */
  name: string;
  /** Optional local-script name for bilingual plates, e.g. "京都". */
  nameLocal?: string;
  /** BCP-47 language tag for nameLocal (e.g. "ja", "zh-Hant"). */
  nameLocalLang?: string;
  status: StationStatus;
  /** Diagram-space coordinates (abstract octilinear grid units, NOT geo). */
  x: number;
  y: number;
  /** Geographic coordinates (globe/map rendering). */
  coords?: { lat: number; lng: number };
}

export interface Line {
  id: LineId;
  /** Display name, e.g. "East Asia Line". */
  name: string;
  /** Ordered station codes along the line. */
  stations: string[];
}

export interface Interchange {
  /** Station codes that form one interchange capsule (same place, multiple lines). */
  codes: string[];
}

export interface TransitNetwork {
  lines: Line[];
  stations: Record<string, Station>;
  interchanges: Interchange[];
}

/** CSS var for a line's color. */
export const lineColorVar = (id: LineId): string => `var(--color-lines-${id})`;

/** CSS var for a status color. */
export const statusColorVar = (s: StationStatus): string => `var(--color-status-${s})`;
