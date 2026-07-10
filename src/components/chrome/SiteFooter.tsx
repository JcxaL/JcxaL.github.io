"use client";

import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";
import type { LineId } from "@/lib/transit/types";
import { lineColorVar } from "@/lib/transit/types";
import LineMark from "./LineMark";
import SoundToggle from "./SoundToggle";

/**
 * SiteFooter — end-of-platform signage. System voice; the line-color strip
 * along the bottom edge is the network's livery (decorative, aria-hidden).
 * Suppressed on /station (the platform preview owns its viewport).
 */

const STATIONS: { href: string; label: string }[] = [
  { href: "/", label: "Concourse" },
  { href: "/travel/", label: "Travel" },
  { href: "/blog/", label: "Notices" },
  { href: "/about/", label: "Operator" },
  { href: "/contact/", label: "Contact" },
];

const DEPOT: { href: string; label: string; external?: boolean }[] = [
  { href: "https://github.com/JcxaL", label: "GitHub", external: true },
  { href: "/station/", label: "Platform preview" },
  { href: "/depot/experiments/", label: "Experiments" },
];

const LIVERY: LineId[] = ["a", "b", "c", "d", "e", "f"];

const FOOTER_CSS = `
.jccl-footer {
  margin-top: 6rem;
  border-top: 1px solid var(--color-ground-line);
  background: var(--color-ground-0);
}
.jccl-footer-inner {
  max-width: 72rem;
  margin: 0 auto;
  padding: 3rem 1.5rem 2.5rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
}
@media (min-width: 768px) {
  .jccl-footer-inner { grid-template-columns: 2fr 1fr 1fr; }
}
.jccl-footer-brandline {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-stack-signage);
  font-weight: 700;
  font-size: 0.875rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-ink-signage);
}
.jccl-footer-notice {
  margin-top: 0.75rem;
  max-width: 34ch;
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--color-ink-muted);
}
.jccl-footer-meta {
  margin-top: 1.25rem;
}
.jccl-footer ul {
  list-style: none;
  margin: 0.75rem 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.jccl-footer-link {
  font-family: var(--font-stack-signage);
  font-weight: 600;
  font-size: 0.8125rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-decoration: none;
  color: var(--color-ink-muted);
}
.jccl-footer-link:hover {
  color: var(--color-ink-signage);
}
.jccl-footer-livery {
  display: flex;
  height: 5px;
}
.jccl-footer-livery span {
  flex: 1;
}
`;

export default function SiteFooter() {
  const pathname = usePathname();
  if (pathname?.startsWith("/station")) return null;

  return (
    <footer className="jccl-footer">
      <style>{FOOTER_CSS}</style>
      <div className="jccl-footer-inner">
        <div>
          <span className="jccl-footer-brandline">
            <LineMark />
            The JccL Line
          </span>
          <p className="jccl-footer-notice">
            Operated by JccL. All journeys real. Please stand behind the
            yellow line while pages are in motion.
          </p>
          <p className="jccl-telemetry jccl-footer-meta">
            © {new Date().getFullYear()} JCCL · SERVICE SINCE 2024
          </p>
          <div className="jccl-footer-meta">
            <SoundToggle />
          </div>
        </div>
        <nav aria-label="Footer stations">
          <span className="jccl-kicker">Stations</span>
          <ul>
            {STATIONS.map((s) => (
              <li key={s.href}>
                <Link href={s.href} className="jccl-footer-link">
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Depot">
          <span className="jccl-kicker">Depot</span>
          <ul>
            {DEPOT.map((d) =>
              d.external ? (
                <li key={d.href}>
                  <a
                    href={d.href}
                    className="jccl-footer-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {d.label} ↗
                  </a>
                </li>
              ) : (
                <li key={d.href}>
                  <Link href={d.href} className="jccl-footer-link">
                    {d.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>
      </div>
      {/* Network livery — the six line colors as an edge strip. */}
      <div className="jccl-footer-livery" aria-hidden="true">
        {LIVERY.map((id) => (
          <span key={id} style={{ backgroundColor: lineColorVar(id) }} />
        ))}
      </div>
    </footer>
  );
}
