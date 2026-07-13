import { z } from "zod";
import type { LineId } from "@/lib/transit/types";

/**
 * Media Slot contract — the linchpin of the media-independent pilot build.
 *
 * A *slot* is a declared place where a real photo/video will eventually land.
 * We build the whole design system against slots, never against assets: every
 * component that shows media renders a <MediaSlot id="…" />, which shows a
 * procedural placeholder until a real asset is *bound* to that id.
 *
 * Because every slot is declared with full specs (aspect, orientation, kind,
 * purpose), the registry can emit docs/pilot/MEDIA_MANIFEST.md — the owner's
 * shopping list. When real media arrives, the ONLY change is editing bindings
 * (src/lib/media/bindings.ts) + dropping files; zero component edits.
 */

export type MediaKind = "image" | "video";
export type Orientation = "landscape" | "portrait" | "square";

/** e.g. "16:9", "4:5", "1:1" */
export const aspectSchema = z
  .string()
  .regex(/^\d+:\d+$/, 'aspect must look like "16:9"');

/** The six network lines (see tokens `--color-lines-a…f`) + board amber. */
export const LINE_IDS = ["a", "b", "c", "d", "e", "f"] as const;

export const mediaSlotSchema = z
  .object({
    /** Stable, unique, dotted-kebab: "concourse.hero.aerial". Never renamed. */
    id: z
      .string()
      .regex(/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/, "id is dotted-kebab, lowercase"),
    kind: z.enum(["image", "video"]),
    aspect: aspectSchema,
    orientation: z.enum(["landscape", "portrait", "square"]),
    /** Human sentence: what this frame is and why. Shown to the gatherer. */
    purpose: z.string().min(1),
    /** Surface it lives on: "concourse" | "travel/paris" | "station/paris". */
    surface: z.string().min(1),
    /** Line whose color tints the duotone window; "amber" = board amber. */
    line: z.enum([...LINE_IDS, "amber"]).optional(),
    /** Recommended minimum source width in px. */
    minWidth: z.number().int().positive().optional(),
    /** Video only: target duration & loop behaviour. */
    durationSec: z.number().positive().optional(),
    loop: z.boolean().optional(),
    /** Above-the-fold hint for next/image. */
    priority: z.boolean().optional(),
    /** Extra gathering guidance ("shoot 6–7am, low sun"). */
    notes: z.string().optional(),
  })
  // Cross-field guards: catch authoring mistakes the field types can't.
  .superRefine((s, ctx) => {
    const r = aspectRatio(s.aspect);
    const derived =
      r > 1.02 ? "landscape" : r < 0.98 ? "portrait" : "square";
    if (s.orientation !== derived) {
      ctx.addIssue({
        code: "custom",
        path: ["orientation"],
        message: `orientation "${s.orientation}" contradicts aspect ${s.aspect} (expected "${derived}")`,
      });
    }
    if (s.kind === "image" && (s.durationSec != null || s.loop != null)) {
      ctx.addIssue({
        code: "custom",
        path: ["durationSec"],
        message: "durationSec/loop are valid only on video slots",
      });
    }
  });

export type MediaSlotSpec = z.infer<typeof mediaSlotSchema>;
export type LineTint = LineId | "amber";

const REGISTRY = new Map<string, MediaSlotSpec>();

/**
 * Declare a slot. Call at module scope so the registry is populated on import.
 * Returns the (validated) spec so callers can pass it straight to <MediaSlot>.
 * Throws on a duplicate id or an invalid spec — both are authoring bugs.
 */
export function defineSlot(spec: MediaSlotSpec): MediaSlotSpec {
  const parsed = mediaSlotSchema.parse(spec);
  const existing = REGISTRY.get(parsed.id);
  // Re-registering the identical spec (HMR) is fine; a *different* spec under an
  // existing id is a collision.
  if (existing && JSON.stringify(existing) !== JSON.stringify(parsed)) {
    throw new Error(`Duplicate media slot id: "${parsed.id}"`);
  }
  REGISTRY.set(parsed.id, parsed);
  return parsed;
}

/** All declared slots, sorted by surface then id — the manifest source. */
export function allSlots(): MediaSlotSpec[] {
  return [...REGISTRY.values()].sort(
    (a, b) => a.surface.localeCompare(b.surface) || a.id.localeCompare(b.id),
  );
}

export function getSlot(id: string): MediaSlotSpec | undefined {
  return REGISTRY.get(id);
}

/** Parse "16:9" → 1.777…; used to reserve layout space so there is no CLS. */
export function aspectRatio(aspect: string): number {
  const [w, h] = aspect.split(":").map(Number);
  return h ? w / h : 1;
}
