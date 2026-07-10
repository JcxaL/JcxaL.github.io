/**
 * Station sound — preference store + no-op safety (jsdom has no AudioContext).
 */
import {
  isSoundOn,
  setSoundOn,
  playChime,
  _resetSound,
} from "@/lib/sound/engine";

describe("sound engine", () => {
  beforeEach(() => {
    window.localStorage.clear();
    _resetSound();
  });

  it("defaults to off (opt-in only)", () => {
    expect(isSoundOn()).toBe(false);
  });

  it("persists the opt-in and reads it back", () => {
    setSoundOn(true);
    expect(isSoundOn()).toBe(true);
    expect(window.localStorage.getItem("jccl.sound.v1")).toBe("on");
    setSoundOn(false);
    expect(isSoundOn()).toBe(false);
  });

  it("playChime is a silent no-op when off or unsupported", () => {
    expect(() => playChime("doors")).not.toThrow();
    setSoundOn(true);
    // jsdom has no AudioContext: must still not throw.
    expect(() => playChime("punch")).not.toThrow();
  });
});
