"use client";

import { setService, useResolvedTheme } from "@/lib/theme/themeStore";

/**
 * ThemeToggle — pick the running service. A two-segment control (Night /
 * Day); the active segment is marked with the lilac accent and aria-pressed.
 * Before first interaction the active segment reflects the resolved theme
 * (OS preference); choosing a segment persists an explicit override.
 */

const TOGGLE_CSS = `
.jccl-service {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--color-ground-line);
  border-radius: var(--layout-radius-pill);
  padding: 2px;
  gap: 2px;
}
.jccl-service button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: none;
  background: none;
  cursor: pointer;
  padding: 5px 11px;
  border-radius: var(--layout-radius-pill);
  font-family: var(--font-stack-mono);
  font-size: 0.6rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-ink-muted);
}
.jccl-service button:hover {
  color: var(--color-ink-signage);
}
.jccl-service button[aria-pressed="true"] {
  background: var(--color-ground-2);
  color: var(--color-accent-base);
}
.jccl-service svg { display: block; }
`;

function MoonIcon() {
  return (
    <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path
        d="M10 7.2A4.2 4.2 0 0 1 4.8 2 4.2 4.2 0 1 0 10 7.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" fill="none">
      <circle cx="6" cy="6" r="2.4" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="1" strokeLinecap="round">
        <path d="M6 .8V2M6 10v1.2M.8 6H2M10 6h1.2M2.3 2.3l.85.85M8.85 8.85l.85.85M9.7 2.3l-.85.85M3.15 8.85l-.85.85" />
      </g>
    </svg>
  );
}

export default function ThemeToggle() {
  const theme = useResolvedTheme();

  return (
    <div
      className="jccl-service"
      role="group"
      aria-label="Service"
      data-testid="theme-toggle"
    >
      <style>{TOGGLE_CSS}</style>
      <button
        type="button"
        aria-pressed={theme === "dark"}
        aria-label="Night service (dark theme)"
        onClick={() => setService("dark")}
      >
        <MoonIcon />
        Night
      </button>
      <button
        type="button"
        aria-pressed={theme === "light"}
        aria-label="Day service (light theme)"
        onClick={() => setService("light")}
      >
        <SunIcon />
        Day
      </button>
    </div>
  );
}
