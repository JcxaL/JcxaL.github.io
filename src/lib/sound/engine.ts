"use client";

import { useSyncExternalStore } from "react";

/**
 * Station sound — synthesized transit chimes, no audio files (doc 13).
 *
 * Best-practice contract (verified 2026):
 * - ONE lazy module-level AudioContext (Safari caps ~4 per page), created
 *   and resumed only inside a user gesture — chimes fire on click/punch,
 *   so play() doubles as the gesture gate.
 * - Envelopes via gain ramps; exponential ramps end at an epsilon, never 0
 *   (RangeError). A DynamicsCompressor on the master bus is the limiter.
 * - Default OFF, persisted opt-in ("jccl.sound.v1"). prefers-reduced-motion
 *   does not cover audio; the explicit toggle is the accessibility control.
 */

const KEY = "jccl.sound.v1";
const EPSILON = 0.0001;
/** Master loudness ceiling — UI chimes sit far under content volume. */
const MASTER_GAIN = 0.14;

let ctx: AudioContext | null = null;
let master: GainNode | null = null;

let enabledSnapshot = false;
const listeners = new Set<() => void>();

function canStore(): boolean {
  try {
    return typeof window !== "undefined" && Boolean(window.localStorage);
  } catch {
    return false;
  }
}

function readEnabled(): boolean {
  if (!canStore()) return false;
  try {
    return window.localStorage.getItem(KEY) === "on";
  } catch {
    return false;
  }
}

function refresh(): void {
  enabledSnapshot = readEnabled();
}

export function isSoundOn(): boolean {
  refresh();
  return enabledSnapshot;
}

export function setSoundOn(on: boolean): void {
  if (!canStore()) return;
  try {
    window.localStorage.setItem(KEY, on ? "on" : "off");
  } catch {
    return;
  }
  enabledSnapshot = on;
  for (const fn of listeners) fn();
  // The toggle click IS a user gesture — arm the context right here so the
  // first chime doesn't race the autoplay policy.
  if (on) void ensureContext();
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  const onStorage = (e: StorageEvent) => {
    if (e.key === null || e.key === KEY) {
      refresh();
      onChange();
    }
  };
  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorage);
  }
  return () => {
    listeners.delete(onChange);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage);
    }
  };
}

/** Sound preference; server-renders as off. */
export function useSoundOn(): boolean {
  return useSyncExternalStore(subscribe, isSoundOn, () => false);
}

async function ensureContext(): Promise<AudioContext | null> {
  if (typeof window === "undefined") return null;
  const Ctor: typeof AudioContext | undefined =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) {
    ctx = new Ctor();
    // Master bus: gain ceiling into a compressor acting as safety limiter.
    master = ctx.createGain();
    master.gain.value = MASTER_GAIN;
    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.value = -20;
    limiter.knee.value = 10;
    limiter.ratio.value = 12;
    limiter.attack.value = 0.002;
    limiter.release.value = 0.15;
    master.connect(limiter);
    limiter.connect(ctx.destination);
  }
  if (ctx.state !== "running") {
    try {
      await ctx.resume();
    } catch {
      return null;
    }
  }
  return ctx.state === "running" ? ctx : null;
}

/** One enveloped tone on the master bus. */
function tone(
  ac: AudioContext,
  at: number,
  freq: number,
  duration: number,
  type: OscillatorType = "sine",
  peak = 1,
): void {
  if (!master) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(EPSILON, at);
  gain.gain.exponentialRampToValueAtTime(peak, at + 0.012);
  gain.gain.exponentialRampToValueAtTime(EPSILON, at + duration);
  osc.connect(gain);
  gain.connect(master);
  osc.start(at);
  osc.stop(at + duration + 0.02);
}

export type ChimeName = "doors" | "punch";

/**
 * Play a chime if sound is on. Safe to call from any user-gesture handler;
 * silently a no-op when off, unsupported, or blocked by autoplay policy.
 */
export function playChime(name: ChimeName): void {
  if (!isSoundOn()) return;
  void (async () => {
    const ac = await ensureContext();
    if (!ac) return;
    const t = ac.currentTime + 0.02;
    if (name === "doors") {
      // The two-tone departure chime: E5 then C5, slightly overlapped.
      tone(ac, t, 659.25, 0.28, "sine", 1);
      tone(ac, t, 1318.5, 0.14, "sine", 0.18); // soft octave shimmer
      tone(ac, t + 0.22, 523.25, 0.34, "sine", 0.9);
    } else {
      // Ticket punch: one bright, short validation ding.
      tone(ac, t, 1174.66, 0.16, "triangle", 1);
      tone(ac, t, 2349.32, 0.08, "sine", 0.15);
    }
  })();
}

/** Test-only: reset preference listeners between cases. */
export function _resetSound(): void {
  enabledSnapshot = false;
  listeners.clear();
}
