import { z } from "zod";
import { mediaRefSchema } from "@/lib/content/schema";

/**
 * Media bindings — the ONLY file that changes at convergence.
 *
 * Maps a slot id to a real asset. While this is empty (the media-independent
 * build phase), every <MediaSlot> renders its procedural placeholder. At the
 * convergence pass we drop files under /public and add one entry per slot here
 * — no component touches required.
 *
 * This file is hand-edited, so it is validated two ways: every value is checked
 * against `mediaBindingSchema` at load (shape / required alt / valid src), and
 * `reconcileBindings()` (see ./reconcile) asserts each key matches a real slot
 * of the same kind — catching the typo'd-id and wrong-kind mistakes that would
 * otherwise leave a slot silently stuck on its placeholder.
 */

export const mediaBindingSchema = z.object({
  kind: z.enum(["image", "video"]),
  /** Root-absolute path ("/media/…") or full https URL (content schema rule). */
  src: mediaRefSchema,
  /** Place-specific alt text — REQUIRED (a11y). */
  alt: z.string().min(1, "alt is required and must be place-specific"),
  /** Provenance line, e.g. "PHOTO: J. LI · 2024". */
  credit: z.string().optional(),
  /** Normalised focal point for cropping [x, y], each 0..1. */
  focal: z
    .tuple([z.number().min(0).max(1), z.number().min(0).max(1)])
    .optional(),
  /** Video only. */
  poster: mediaRefSchema.optional(),
});

export type MediaBinding = z.infer<typeof mediaBindingSchema>;

/**
 * Empty by design during the build phase. Convergence fills it, e.g.:
 *   "concourse.hero.aerial": {
 *     kind: "image", src: "/media/concourse/aerial.jpg",
 *     alt: "Aerial view of the city at dusk", credit: "PHOTO: J. LI",
 *   },
 */
export const MEDIA_BINDINGS: Record<string, MediaBinding> = {};

// Fail loud at build time if a hand-authored binding is malformed.
for (const [id, binding] of Object.entries(MEDIA_BINDINGS)) {
  const result = mediaBindingSchema.safeParse(binding);
  if (!result.success) {
    throw new Error(
      `Invalid media binding "${id}": ${result.error.issues
        .map((i) => `${i.path.join(".")} ${i.message}`)
        .join("; ")}`,
    );
  }
}

export function getBinding(id: string): MediaBinding | undefined {
  return MEDIA_BINDINGS[id];
}

/** How many slots currently have a real asset bound. */
export function boundCount(): number {
  return Object.keys(MEDIA_BINDINGS).length;
}
