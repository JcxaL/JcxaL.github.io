import type { MediaKind } from "@/lib/media/slot";

/**
 * Media bindings — the ONLY file that changes at convergence.
 *
 * Maps a slot id to a real asset. While this is empty (the media-independent
 * build phase), every <MediaSlot> renders its procedural placeholder. At the
 * convergence pass we drop files under /public and add one entry per slot here
 * — no component touches required.
 *
 * `src` is a root-absolute path ("/media/…") or a full https URL, matching the
 * content schema's mediaRefSchema. `alt` is REQUIRED and must be place-specific
 * (a11y rule). `focal` (0..1, 0..1) sets object-position for smart cropping.
 */

export interface MediaBinding {
  kind: MediaKind;
  src: string;
  /** Place-specific alt text. Required for images. */
  alt: string;
  /** Provenance line, e.g. "PHOTO: J. LI · 2024". */
  credit?: string;
  /** Normalised focal point for cropping [x, y], each 0..1. */
  focal?: [number, number];
  /** Video only. */
  poster?: string;
}

/**
 * Empty by design during the build phase. Convergence fills it, e.g.:
 *   "concourse.hero.aerial": {
 *     kind: "image", src: "/media/concourse/aerial.jpg",
 *     alt: "Aerial view of the city at dusk", credit: "PHOTO: J. LI",
 *   },
 */
export const MEDIA_BINDINGS: Record<string, MediaBinding> = {};

export function getBinding(id: string): MediaBinding | undefined {
  return MEDIA_BINDINGS[id];
}

/** How many declared slots still have no real asset — a convergence gauge. */
export function boundCount(): number {
  return Object.keys(MEDIA_BINDINGS).length;
}
