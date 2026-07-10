/**
 * LineMark — the JccL Line network mark: three rounded route bars rising
 * left to right (an original device — no transit-authority marks, CLAUDE.md
 * rule 8). Decorative; parents provide the accessible name.
 */
export default function LineMark({ size = 18 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
    >
      <rect x="1" y="7" width="4" height="10" rx="2" fill="var(--color-lines-a)" />
      <rect x="7" y="4" width="4" height="13" rx="2" fill="var(--color-lines-b)" />
      <rect x="13" y="1" width="4" height="16" rx="2" fill="var(--color-board-amber)" />
    </svg>
  );
}
