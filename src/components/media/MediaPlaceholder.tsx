import type { MediaSlotSpec } from "@/lib/media/slot";
import { aspectRatio } from "@/lib/media/slot";
import styles from "./MediaSlot.module.css";

/**
 * MediaPlaceholder — the procedural stand-in a slot renders until a real asset
 * is bound. It reserves the slot's exact aspect ratio (no CLS on swap), tints
 * itself with the slot's line color, and labels itself with the slot id + spec
 * so the whole design system can be built, reviewed, and screenshotted with
 * zero real media. Static by construction → reduced-motion safe.
 */
export default function MediaPlaceholder({ spec }: { spec: MediaSlotSpec }) {
  const tint = spec.line ? `var(--line-${spec.line}, #f4b740)` : "#f4b740";
  return (
    <div
      className={`${styles.frame} ${styles.placeholder}`}
      style={
        {
          aspectRatio: String(aspectRatio(spec.aspect)),
          ["--slot-tint" as string]: tint,
        } as React.CSSProperties
      }
      role="img"
      aria-label={`${spec.purpose} (placeholder — media pending)`}
      data-media-slot={spec.id}
      data-media-pending="true"
    >
      <span className={styles.kindBadge}>{spec.kind}</span>
      <span className={styles.label}>
        <span className={styles.id}>{spec.id}</span>
        <span className={styles.spec}>
          {spec.aspect} · {spec.orientation}
          {spec.durationSec ? ` · ${spec.durationSec}s` : ""}
        </span>
      </span>
    </div>
  );
}
