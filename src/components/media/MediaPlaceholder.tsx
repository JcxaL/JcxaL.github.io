import type { MediaSlotSpec } from "@/lib/media/slot";
import styles from "./MediaSlot.module.css";

/**
 * MediaPlaceholder — the procedural fill a slot shows until a real asset is
 * bound. Decorative only (aria-hidden): the enclosing <MediaSlot> frame carries
 * role="img" + the accessible label. Tints itself with the slot's line color
 * and labels itself with the slot id + spec so the whole system can be built,
 * reviewed, and screenshotted with zero real media. Static → reduced-motion safe.
 */
export default function MediaPlaceholder({ spec }: { spec: MediaSlotSpec }) {
  const tint =
    !spec.line || spec.line === "amber"
      ? "var(--color-board-amber, #ffb000)"
      : `var(--color-lines-${spec.line}, #f4b740)`;
  return (
    <div
      className={styles.placeholder}
      style={{ ["--slot-tint" as string]: tint } as React.CSSProperties}
      aria-hidden="true"
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
