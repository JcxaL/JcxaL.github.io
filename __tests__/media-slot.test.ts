import {
  defineSlot,
  mediaSlotSchema,
  aspectRatio,
} from "@/lib/media/slot";
import { mediaBindingSchema, MEDIA_BINDINGS } from "@/lib/media/bindings";
import { reconcileBindings, unboundSlots } from "@/lib/media/reconcile";

// reconcile pulls in the seeded registry.
import "@/lib/media/slots.registry";

const base = {
  id: "test.unit.frame",
  kind: "image",
  aspect: "16:9",
  orientation: "landscape",
  purpose: "unit test frame",
  surface: "test",
} as const;

afterEach(() => {
  for (const k of Object.keys(MEDIA_BINDINGS)) delete MEDIA_BINDINGS[k];
});

describe("slot schema", () => {
  test("aspectRatio parses w:h", () => {
    expect(aspectRatio("16:9")).toBeCloseTo(16 / 9);
    expect(aspectRatio("1:1")).toBe(1);
  });

  test("orientation must agree with aspect", () => {
    expect(
      mediaSlotSchema.safeParse({ ...base, orientation: "portrait" }).success,
    ).toBe(false);
    expect(mediaSlotSchema.safeParse(base).success).toBe(true);
  });

  test("video-only fields rejected on an image slot", () => {
    expect(
      mediaSlotSchema.safeParse({
        ...base,
        aspect: "1:1",
        orientation: "square",
        loop: true,
      }).success,
    ).toBe(false);
  });

  test("line must be a real line id or amber", () => {
    expect(mediaSlotSchema.safeParse({ ...base, line: "zebra" }).success).toBe(
      false,
    );
    expect(mediaSlotSchema.safeParse({ ...base, line: "a" }).success).toBe(true);
  });
});

describe("defineSlot registry", () => {
  test("returns the validated spec", () => {
    const s = defineSlot({ ...base, id: "test.define.ok" });
    expect(s.id).toBe("test.define.ok");
  });

  test("throws on a duplicate id with a different spec", () => {
    defineSlot({ ...base, id: "test.define.dup" });
    expect(() =>
      defineSlot({ ...base, id: "test.define.dup", purpose: "changed" }),
    ).toThrow(/Duplicate/);
  });
});

describe("binding schema (the file humans edit at convergence)", () => {
  test("requires non-empty alt", () => {
    expect(
      mediaBindingSchema.safeParse({ kind: "image", src: "/x.jpg", alt: "" })
        .success,
    ).toBe(false);
  });

  test("rejects a relative src", () => {
    expect(
      mediaBindingSchema.safeParse({ kind: "image", src: "x.jpg", alt: "x" })
        .success,
    ).toBe(false);
  });

  test("accepts a valid image binding", () => {
    expect(
      mediaBindingSchema.safeParse({
        kind: "image",
        src: "/media/x.jpg",
        alt: "A place",
      }).success,
    ).toBe(true);
  });
});

describe("reconcileBindings (catches convergence mistakes)", () => {
  test("clean when there are no bindings", () => {
    expect(reconcileBindings()).toEqual([]);
  });

  test("flags a binding whose id matches no slot (typo)", () => {
    MEDIA_BINDINGS["travel.paris.nope"] = {
      kind: "image",
      src: "/media/x.jpg",
      alt: "x",
    };
    expect(reconcileBindings().some((e) => e.includes("no declared slot"))).toBe(
      true,
    );
  });

  test("flags a kind mismatch against the slot", () => {
    MEDIA_BINDINGS["concourse.hero.aerial"] = {
      kind: "video", // slot is an image
      src: "/media/x.mp4",
      alt: "x",
    };
    expect(reconcileBindings().some((e) => e.includes("kind"))).toBe(true);
  });

  test("unboundSlots lists the seeded flagship slots", () => {
    expect(unboundSlots()).toEqual(
      expect.arrayContaining([
        "concourse.hero.aerial",
        "travel.paris.eiffel.sunrise",
        "station.paris.ambient.loop",
      ]),
    );
  });
});
