import Image from "next/image";
import type { MediaSlotSpec } from "@/lib/media/slot";
import { aspectRatio } from "@/lib/media/slot";
import { getBinding } from "@/lib/media/bindings";
import MediaPlaceholder from "./MediaPlaceholder";
import styles from "./MediaSlot.module.css";

/**
 * MediaSlot — render a declared media slot.
 *
 * Pass the slot object imported from the registry (which guarantees it's
 * registered): <MediaSlot slot={PARIS_STATION_EIFFEL} />. If a real asset is
 * bound to slot.id in bindings.ts it renders that; otherwise the procedural
 * placeholder. This is the ONLY seam between "media-independent build" and
 * "real media" — nothing above this component knows whether media exists yet.
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
      <div className={className}>
        <MediaPlaceholder spec={slot} />
      </div>
    );
  }

  const objectPosition = binding.focal
    ? `${binding.focal[0] * 100}% ${binding.focal[1] * 100}%`
    : "center";

  if (binding.kind === "video") {
    return (
      <div
        className={frameClass}
        style={frameStyle}
        data-media-slot={slot.id}
      >
        <video
          className={styles.media}
          style={{ objectPosition }}
          autoPlay={slot.loop}
          loop={slot.loop}
          muted
          playsInline
          poster={binding.poster}
          aria-label={binding.alt}
        >
          <source src={binding.src} />
        </video>
      </div>
    );
  }

  return (
    <div className={frameClass} style={frameStyle} data-media-slot={slot.id}>
      <Image
        className={styles.media}
        style={{ objectPosition }}
        src={binding.src}
        alt={binding.alt}
        fill
        sizes="100vw"
        priority={slot.priority}
      />
    </div>
  );
}
