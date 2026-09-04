import { allSlots, getSlot } from "@/lib/media/slot";
import { MEDIA_BINDINGS } from "@/lib/media/bindings";
// Import the concrete array (a *used* value) so registration can't be
// tree-shaken away — a bare side-effect import could be, leaving allSlots()
// silently incomplete (review Finding 9).
import { REGISTERED_SLOTS } from "@/lib/media/slots.registry";

void REGISTERED_SLOTS;

/**
 * Cross-check bindings against the slot registry. Every binding key must match a
 * declared slot of the same kind. Returns human-readable errors (empty = OK).
 * Called by tests and the (upcoming) manifest generator / CI — not at render.
 */
export function reconcileBindings(): string[] {
  const errors: string[] = [];
  const ids = new Set(allSlots().map((s) => s.id));
  for (const [id, binding] of Object.entries(MEDIA_BINDINGS)) {
    if (!ids.has(id)) {
      errors.push(`binding "${id}" matches no declared slot (typo'd id?)`);
      continue;
    }
    const slot = getSlot(id)!;
    if (slot.kind !== binding.kind) {
      errors.push(
        `binding "${id}" kind "${binding.kind}" ≠ slot kind "${slot.kind}"`,
      );
    }
  }
  return errors;
}

/** Slot ids with no real asset yet — the convergence shopping list gauge. */
export function unboundSlots(): string[] {
  const bound = new Set(Object.keys(MEDIA_BINDINGS));
  return allSlots()
    .map((s) => s.id)
    .filter((id) => !bound.has(id));
}
