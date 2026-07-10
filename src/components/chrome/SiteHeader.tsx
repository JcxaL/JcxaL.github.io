"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LineMark from "./LineMark";

/**
 * SiteHeader — the signage bar. System voice only (doc 12): station-plate
 * caps, hairline rule, amber reserved for the active-route lamp.
 * Suppressed on /station: that route owns its viewport (platform preview).
 */

interface NavStop {
  href: string;
  label: string;
  /** Active when the pathname starts with this prefix ("/" is exact-only). */
  prefix: string;
}

const NAV: NavStop[] = [
  { href: "/", label: "Concourse", prefix: "/" },
  { href: "/travel/", label: "Travel", prefix: "/travel" },
  { href: "/blog/", label: "Notices", prefix: "/blog" },
  { href: "/about/", label: "Operator", prefix: "/about" },
  { href: "/contact/", label: "Contact", prefix: "/contact" },
];

const HEADER_CSS = `
.jccl-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: color-mix(in srgb, var(--color-ground-0) 88%, transparent);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--color-ground-line);
}
.jccl-header-inner {
  max-width: 72rem;
  margin: 0 auto;
  padding: 0 1.5rem;
  min-height: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}
.jccl-header-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  text-decoration: none;
}
.jccl-header-wordmark {
  font-family: var(--font-stack-signage);
  font-weight: 700;
  font-size: 0.875rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-ink-signage);
  white-space: nowrap;
}
.jccl-header-nav ul {
  display: flex;
  align-items: center;
  gap: 4px;
  list-style: none;
  margin: 0;
  padding: 0;
  flex-wrap: wrap;
}
.jccl-header-link {
  display: inline-block;
  padding: 18px 10px 16px;
  font-family: var(--font-stack-signage);
  font-weight: 600;
  font-size: 0.75rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  text-decoration: none;
  color: var(--color-ink-muted);
  border-bottom: 2px solid transparent;
}
.jccl-header-link:hover {
  color: var(--color-ink-signage);
}
.jccl-header-link[aria-current] {
  color: var(--color-ink-signage);
  border-bottom-color: var(--color-board-amber);
}
@media (prefers-reduced-motion: no-preference) {
  .jccl-header-link {
    transition: color var(--motion-duration-exit) var(--motion-easing-standard);
  }
}
@media (max-width: 640px) {
  .jccl-header-inner { padding: 0 1rem; }
  .jccl-header-link { padding: 12px 8px 10px; }
}
`;

export default function SiteHeader() {
  const pathname = usePathname();

  // The platform preview owns its entire viewport — no chrome.
  if (pathname?.startsWith("/station")) return null;

  const isActive = (stop: NavStop): boolean => {
    if (!pathname) return false;
    if (stop.prefix === "/") return pathname === "/";
    return pathname.startsWith(stop.prefix);
  };

  return (
    <header className="jccl-header">
      <style>{HEADER_CSS}</style>
      <div className="jccl-header-inner">
        <Link href="/" className="jccl-header-brand" aria-label="The JccL Line — concourse">
          <LineMark />
          <span className="jccl-header-wordmark">The JccL Line</span>
        </Link>
        <nav aria-label="Stations" className="jccl-header-nav">
          <ul>
            {NAV.map((stop) => (
              <li key={stop.href}>
                <Link
                  href={stop.href}
                  className="jccl-header-link"
                  aria-current={isActive(stop) ? "page" : undefined}
                >
                  {stop.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
