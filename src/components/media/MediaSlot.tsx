import Image from "next/image";
import type { MediaSlotSpec } from "@/lib/media/slot";
import { aspectRatio } from "@/lib/media/slot";
import { getBinding } from "@/lib/media/bindings";
import MediaPlaceholder from "./MediaPlaceholder";
import BoundVideo from "./BoundVideo";
import styles from "./MediaSlot.module.css";

/**
 * MediaSlot — render a declared media slot.
 *
 * Pass the slot object imported from the registry: <MediaSlot slot={…}/>. If a
 * real asset is bound to slot.id it renders that; otherwise the procedural
 * placeholder. Every state renders the SAME single `.frame` node (consistent
 * styling + a stable `[data-media-slot]` target, no layout shift on swap). This
 * is the only seam between "media-independent build" and "real media" — nothing
 * above it knows whether media exists yet.
 */
export default function MediaSlot({
  slot,
  className,
}: {
  slot: MediaSlotSpec;
  className?: string;
}) {
  const binding = getBinding(slot.id);
  const frameClass = className ? `${styles.frame} ${className}` : styles.frame;
  const frameStyle = { aspectRatio: String(aspectRatio(slot.aspect)) };

  if (!binding) {
    return (
      <div
        className={frameClass}
        style={frameStyle}
        data-media-slot={slot.id}
        data-media-pending="true"
        role="img"
        aria-label={`${slot.purpose} (placeholder — media pending)`}
      >
        <MediaPlaceholder spec={slot} />
      </div>
    );
  }

  const objectPosition = binding.focal
    ? `${binding.focal[0] * 100}% ${binding.focal[1] * 100}%`
    : "center";

  if (binding.kind === "video") {
    return (
      <div className={frameClass} style={frameStyle} data-media-slot={slot.id}>
        <BoundVideo slot={slot} binding={binding} objectPosition={objectPosition} />
      </div>
    );
  }

  const sizes =
    slot.orientation === "portrait"
      ? "(max-width: 700px) 90vw, 40vw"
      : "100vw";

  return (
    <div className={frameClass} style={frameStyle} data-media-slot={slot.id}>
      <Image
        className={styles.media}
        style={{ objectPosition }}
        src={binding.src}
        alt={binding.alt}
        fill
        sizes={sizes}
        priority={slot.priority}
      />
    </div>
  );
}
