import Image from "next/image";
import type { LineId } from "@/lib/transit/types";

/**
 * DuotoneImage — the "tinted window" photo treatment: any photograph is
 * remapped into a two-color ramp from station black up to a line color,
 * so unedited photos read as part of the signage system.
 *
 * Technique (doc 13, WP-core pattern): a generated SVG reference filter —
 * Rec.709 luminance matrix into a two-stop feComponentTransfer table whose
 * endpoints are the exact token hexes. The filters live in DuotoneDefs.tsx,
 * GENERATED from tokens.json by `pnpm tokens` and mounted once in the root
 * layout. Static filters rasterize once and are cached by the compositor —
 * never animate the filter property (discrete + full re-raster per frame).
 *
 * a11y: alt is required and must be place-specific (CLAUDE.md rule 9).
 * The caption is journal register; the credit line is telemetry.
 */

export interface DuotoneImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Line whose color tints the window; "amber" uses the board amber. */
  line?: LineId | "amber";
  /** Journal-register caption, shown as a placard under the frame. */
  caption?: string;
  /** Telemetry credit/provenance line, e.g. "PHOTO: SAMPLE ASSET". */
  credit?: string;
  /** Set on above-the-fold images. */
  priority?: boolean;
  className?: string;
}

const DUOTONE_CSS = `
.jccl-duotone {
  margin: 0;
}
.jccl-duotone-frame {
  display: block;
  position: relative;
  overflow: hidden;
  border-radius: var(--layout-radius-plate);
  border: 1px solid var(--color-ground-line);
  background-color: var(--color-ground-1);
}
.jccl-duotone-frame img {
  display: block;
  width: 100%;
  height: auto;
  filter: var(--duotone-filter);
}
.jccl-duotone-caption {
  margin-top: 10px;
  font-size: 0.875rem;
  line-height: 1.55;
  color: var(--color-ink-muted);
}
.jccl-duotone-credit {
  margin-top: 4px;
}
`;

export default function DuotoneImage({
  src,
  alt,
  width,
  height,
  line = "amber",
  caption,
  credit,
  priority = false,
  className,
}: DuotoneImageProps) {
  return (
    <figure
      className={["jccl-duotone", className].filter(Boolean).join(" ")}
      data-testid="duotone-image"
      data-duotone-line={line}
    >
      <style>{DUOTONE_CSS}</style>
      <span
        className="jccl-duotone-frame"
        style={
          { "--duotone-filter": `url(#jccl-duo-${line})` } as React.CSSProperties
        }
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          unoptimized
        />
      </span>
      {caption || credit ? (
        <figcaption>
          {caption ? <p className="jccl-duotone-caption">{caption}</p> : null}
          {credit ? (
            <p className="jccl-telemetry jccl-duotone-credit">{credit}</p>
          ) : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
