import {
  NOOP_STAGE,
  hasWebGL,
  stageEnabled,
  prefersReducedMotion,
} from "@/lib/stage/types";

/**
 * Stage API / no-WebGL fallback contract (CHARTER §2). jsdom has no WebGL, so
 * this environment exercises exactly the fallback path a real no-WebGL / SSR
 * client hits: stageEnabled() is false, callers wire to NOOP_STAGE, and every
 * Stage method is a safe no-op. This is the "no-WebGL fallback" DoD item at the
 * contract level (the visual fallback becomes testable once 3D scenes ship).
 */
describe("Stage API fallback contract", () => {
  test("NOOP_STAGE is inactive and its methods are safe no-ops", () => {
    expect(NOOP_STAGE.active).toBe(false);
    expect(() => {
      NOOP_STAGE.focus("paris", { duration: 0.4 });
      NOOP_STAGE.setLine("a");
      NOOP_STAGE.progress(0.5);
      NOOP_STAGE.reset();
    }).not.toThrow();
  });

  test("no WebGL (jsdom) → stage disabled, so surfaces take the fallback", () => {
    expect(hasWebGL()).toBe(false);
    expect(stageEnabled()).toBe(false);
  });

  test("prefersReducedMotion resolves to a boolean without throwing", () => {
    expect(typeof prefersReducedMotion()).toBe("boolean");
  });
});
