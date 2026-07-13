import { defineSlot } from "@/lib/media/slot";

/**
 * Central slot registry. Importing this module registers every slot in the
 * pilot, which is what makes the MEDIA_MANIFEST generator (and any "how much
 * media is left" gauge) complete. Co-located component slots should ALSO be
 * declared here (or re-exported) so a single import populates the registry.
 *
 * Seeded with the flagship surfaces' load-bearing frames. Grows as tracks
 * build; every new slot MUST land here and in docs/pilot/MEDIA_MANIFEST.md.
 */

// ── Concourse (home) ──────────────────────────────────────────────────────
export const CONCOURSE_HERO = defineSlot({
  id: "concourse.hero.aerial",
  kind: "image",
  aspect: "21:9",
  orientation: "landscape",
  surface: "concourse",
  purpose:
    "Wide aerial/skyline plate behind the 3D network map on the home concourse.",
  line: "amber",
  minWidth: 2560,
  priority: true,
  notes: "Dusk or blue-hour reads best against the signage palette.",
});

// ── Travel · Paris (the flagship Line) ────────────────────────────────────
export const PARIS_LINE_COVER = defineSlot({
  id: "travel.paris.cover",
  kind: "image",
  aspect: "3:2",
  orientation: "landscape",
  surface: "travel/paris",
  purpose: "Line cover for the Paris strip-map journey header.",
  line: "amber",
  minWidth: 2000,
});

export const PARIS_STATION_EIFFEL = defineSlot({
  id: "travel.paris.eiffel.sunrise",
  kind: "image",
  aspect: "4:5",
  orientation: "portrait",
  surface: "travel/paris",
  purpose: "Eiffel Tower at sunrise — the diorama window for station 02.",
  line: "amber",
  minWidth: 1600,
  notes: "6–7am, low sun, long silhouettes (per the field note).",
});

export const PARIS_STATION_MONTMARTRE = defineSlot({
  id: "travel.paris.montmartre.street",
  kind: "image",
  aspect: "4:5",
  orientation: "portrait",
  surface: "travel/paris",
  purpose: "Montmartre cobblestone street / Sacré-Cœur view — station 03.",
  line: "amber",
  minWidth: 1600,
});

// ── Station exhibit (the flagship Station) ────────────────────────────────
export const STATION_HERO = defineSlot({
  id: "station.paris.hero",
  kind: "image",
  aspect: "16:9",
  orientation: "landscape",
  surface: "station/paris",
  purpose: "Immersive hero image for the Paris station exhibit room.",
  line: "amber",
  minWidth: 2400,
  priority: true,
});

export const STATION_AMBIENT = defineSlot({
  id: "station.paris.ambient.loop",
  kind: "video",
  aspect: "16:9",
  orientation: "landscape",
  surface: "station/paris",
  purpose:
    "Short ambient loop (street life / trains) behind the exhibit, muted.",
  line: "amber",
  durationSec: 8,
  loop: true,
  notes: "Silent, ≤8s, seamless loop; graceful still-frame fallback.",
});

/** Force-registers all of the above on import. */
export const REGISTERED_SLOTS = [
  CONCOURSE_HERO,
  PARIS_LINE_COVER,
  PARIS_STATION_EIFFEL,
  PARIS_STATION_MONTMARTRE,
  STATION_HERO,
  STATION_AMBIENT,
] as const;
