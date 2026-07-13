import fs from "node:fs";
import path from "node:path";
import { allSlots } from "@/lib/media/slot";
import { reconcileBindings } from "@/lib/media/reconcile";
// Registering the seeded slots (reconcile imports this too, but be explicit).
import "@/lib/media/slots.registry";

/**
 * Media-manifest integrity guard.
 *
 * Instead of a node file-writer (the registry is TS + zod, unrunnable by the
 * repo's `.mjs` codegen), this guarantees the same thing by *failing CI on
 * drift*: every declared slot must appear in MEDIA_MANIFEST.md (the owner's
 * shopping list can never silently miss a frame), and every binding must
 * reconcile against the registry. This is the enforcement behind the
 * convergence gate "MEDIA_MANIFEST.md enumerates every slot with specs."
 */
const MANIFEST = fs.readFileSync(
  path.join(process.cwd(), "docs/pilot/MEDIA_MANIFEST.md"),
  "utf8",
);

describe("media manifest integrity", () => {
  test("bindings reconcile against the registry", () => {
    expect(reconcileBindings()).toEqual([]);
  });

  test("every declared slot is documented in MEDIA_MANIFEST.md", () => {
    const undocumented = allSlots()
      .map((s) => s.id)
      .filter((id) => !MANIFEST.includes(id));
    expect(undocumented).toEqual([]);
  });

  test("manifest states the current slot count", () => {
    const declared = allSlots().length;
    expect(MANIFEST).toContain(`${declared} declared`);
  });
});
