"use client";

import { useEffect } from "react";
import { punchStation, usePunches } from "@/lib/ticket/punchStore";

/**
 * StationPunch — mounted on a station exhibit: punches the station onto the
 * visitor's persistent ticket and confirms it in the system voice.
 * The confirmation only renders once the punch exists client-side, so the
 * SSG markup (no punch) never mismatches.
 */
export default function StationPunch({ code }: { code: string }) {
  const punches = usePunches();

  useEffect(() => {
    punchStation(code);
  }, [code]);

  if (!punches.includes(code)) return null;

  return (
    <p className="jccl-telemetry" data-testid="station-punch" aria-live="polite">
      TICKET PUNCHED · {code} RECORDED ON YOUR JOURNEY
    </p>
  );
}
