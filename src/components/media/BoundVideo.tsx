"use client";

import { useEffect, useState } from "react";
import type { MediaSlotSpec } from "@/lib/media/slot";
import type { MediaBinding } from "@/lib/media/bindings";
import { prefersReducedMotion } from "@/lib/stage/types";
import styles from "./MediaSlot.module.css";

/**
 * BoundVideo — renders a bound video slot with correct motion + control
 * behaviour. An ambient loop autoplays muted, but NOT under prefers-reduced-
 * motion (it shows the poster + controls instead). A non-loop clip always
 * exposes controls so it isn't a dead poster. Client component because the
 * decision depends on the runtime media query.
 */
export default function BoundVideo({
  slot,
  binding,
  objectPosition,
}: {
  slot: MediaSlotSpec;
  binding: MediaBinding;
  objectPosition: string;
}) {
  const [reduced, setReduced] = useState(true); // safe default until measured
  useEffect(() => setReduced(prefersReducedMotion()), []);

  const isLoop = !!slot.loop;
  const autoPlay = isLoop && !reduced;
  const showControls = !isLoop || reduced;

  return (
    <video
      className={styles.media}
      style={{ objectPosition }}
      autoPlay={autoPlay}
      loop={isLoop}
      muted
      playsInline
      controls={showControls}
      poster={binding.poster}
      aria-label={binding.alt}
    >
      <source src={binding.src} />
    </video>
  );
}
