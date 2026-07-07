"use client";

/**
 * DotMatrixSign — single-line amber LED strip for The JccL Line.
 *
 * Spec: docs/design/12-brand-signage.md ("DotMatrixSign").
 * - Doto board face (var(--font-board)), board amber on --color-ground-0,
 *   bloom via --color-board-glow. Token vars only.
 * - Optional marquee: transform-only translateX keyframes over a duplicated
 *   strip (CSS only). The animation is authored no-motion-first — it exists
 *   only inside prefers-reduced-motion: no-preference, so reduced motion
 *   shows a static sign. The root carries [data-marquee] when scrolling.
 * - A11y: the root exposes the text via aria-label (role="img"); the
 *   rendered strip — including the duplicated copy — is aria-hidden.
 */

export interface DotMatrixSignProps {
  text: string;
  marquee?: boolean;
  className?: string;
}

/* Token vars only — no raw hex/duration/easing literals (CLAUDE.md rule 1).
   Marquee duration derives from the door token (calc multiplier, unitless);
   a marquee must run at constant speed, hence the `linear` keyword. */
const SIGN_CSS = `
.jccl-dotmatrix {
  display: block;
  background: var(--color-ground-0);
  border: 1px solid var(--color-ground-line);
  border-radius: var(--layout-radius-plate);
  padding: 6px 12px;
  font-family: var(--font-board);
  color: var(--color-board-amber);
  text-shadow: 0 0 10px var(--color-board-glow), 0 0 3px var(--color-board-glow);
  letter-spacing: 0.08em;
}
.jccl-dotmatrix-viewport {
  overflow: hidden;
  white-space: nowrap;
}
.jccl-dotmatrix-track {
  display: inline-flex;
  white-space: nowrap;
}
.jccl-dotmatrix-copy {
  display: inline-block;
}
.jccl-dotmatrix[data-marquee] .jccl-dotmatrix-copy {
  padding-right: 3ch;
}
@media (prefers-reduced-motion: no-preference) {
  .jccl-dotmatrix[data-marquee] .jccl-dotmatrix-track {
    animation: jccl-dotmatrix-marquee var(--motion-duration-marquee, 15s)
      linear infinite;
    will-change: transform;
  }
}
/* Belt and braces: if an animation is ever inherited, hold it still. */
@media (prefers-reduced-motion: reduce) {
  .jccl-dotmatrix-track {
    animation-play-state: paused;
  }
}
/* Track holds two identical copies, so -50% loops seamlessly. */
@keyframes jccl-dotmatrix-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
`;

export default function DotMatrixSign({
  text,
  marquee = false,
  className,
}: DotMatrixSignProps) {
  return (
    <div
      role="img"
      aria-label={text}
      data-marquee={marquee ? "true" : undefined}
      className={["jccl-dotmatrix", className].filter(Boolean).join(" ")}
    >
      <style>{SIGN_CSS}</style>
      <div className="jccl-dotmatrix-viewport" aria-hidden="true">
        <div className="jccl-dotmatrix-track">
          <span className="jccl-dotmatrix-copy">{text}</span>
          {marquee ? <span className="jccl-dotmatrix-copy">{text}</span> : null}
        </div>
      </div>
    </div>
  );
}
