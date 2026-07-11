"use client";

import { playChime, setSoundOn, useSoundOn } from "@/lib/sound/engine";

/**
 * SoundToggle — the station announcements switch. Default off; the choice
 * persists (localStorage) and the enabling click doubles as the autoplay
 * gesture. Status is word + shape, never color alone.
 */
const TOGGLE_CSS = `
.jccl-sound-toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--color-ground-line);
  border-radius: var(--layout-radius-pill);
  background: none;
  padding: 6px 14px;
  cursor: pointer;
  font-family: var(--font-stack-mono);
  font-size: 0.625rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-ink-muted);
}
.jccl-sound-toggle:hover {
  color: var(--color-ink-signage);
  border-color: var(--color-ink-faint);
}
.jccl-sound-toggle[aria-pressed="true"] {
  color: var(--color-accent-base);
  border-color: var(--color-accent-base);
}
`;

export default function SoundToggle() {
  const on = useSoundOn();

  const toggle = () => {
    const next = !on;
    setSoundOn(next);
    if (next) playChime("doors"); // audible confirmation of the opt-in
  };

  return (
    <button
      type="button"
      className="jccl-sound-toggle"
      aria-pressed={on}
      onClick={toggle}
      data-testid="sound-toggle"
    >
      <style>{TOGGLE_CSS}</style>
      <span aria-hidden="true">{on ? "♪" : "∅"}</span>
      Announcements: {on ? "On" : "Off"}
    </button>
  );
}
