import type { Metadata } from "next";
import DotMatrixSign from "@/components/transit/DotMatrixSign";

/**
 * Station office — the contact page. Static export: no form, no backend.
 * Every channel below existed on the old page; nothing is invented.
 * System voice throughout (doc 12) — this is all chrome, no journal prose.
 */

export const metadata: Metadata = {
  title: "Contact",
  description:
    "The station office of The JccL Line. Leave a message at any counter and the operator responds when the train reaches a station.",
};

interface Counter {
  number: string;
  name: string;
  /** One-line system-voice description; carries the real address. */
  detail: string;
  href: string;
  external: boolean;
}

const COUNTERS: Counter[] = [
  {
    number: "01",
    name: "GitHub",
    detail: "Public works and rolling stock on display at github.com/JcxaL.",
    href: "https://github.com/JcxaL",
    external: true,
  },
  {
    number: "02",
    name: "Email",
    detail: "Written enquiries to hello@jccl.dev. Answered in order of arrival.",
    href: "mailto:hello@jccl.dev",
    external: false,
  },
];

export default function Contact() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-14 pb-16">
      {/* ---- Signage ---- */}
      <p className="jccl-kicker">The JccL Line · Station office</p>
      <h1 className="jccl-signage mt-5 text-4xl sm:text-5xl">Station office</h1>
      <div
        aria-hidden="true"
        className="mt-6 h-1 w-16"
        style={{ backgroundColor: "var(--color-board-amber)" }}
      />
      <p
        className="jccl-measure mt-6 text-lg leading-relaxed"
        style={{ color: "var(--color-ink-muted)" }}
      >
        The station office is staffed asynchronously. Please leave a message at
        any counter below; the operator responds when the train reaches a
        station.
      </p>

      {/* ---- Counters ---- */}
      <section className="mt-14">
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 className="jccl-signage text-xl">Counters</h2>
          <p className="jccl-telemetry">
            ALL COUNTERS OPEN · REPLIES USUALLY WITHIN 24 HOURS
          </p>
        </div>
        <ul className="grid list-none gap-4 p-0">
          {COUNTERS.map((c) => (
            <li key={c.number}>
              <a
                href={c.href}
                {...(c.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="jccl-panel jccl-lift flex items-center gap-5 px-5 py-4 no-underline sm:px-6 sm:py-5"
              >
                <span
                  className="jccl-telemetry shrink-0"
                  style={{ color: "var(--color-board-amber)" }}
                >
                  COUNTER {c.number}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="jccl-signage block text-base">{c.name}</span>
                  <span
                    className="mt-1 block text-sm leading-relaxed"
                    style={{ color: "var(--color-ink-muted)" }}
                  >
                    {c.detail}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="shrink-0 text-lg"
                  style={{ color: "var(--color-ink-faint)" }}
                >
                  →
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* ---- Sign-off ---- */}
      <div className="mt-14">
        <DotMatrixSign text="THANK YOU FOR TRAVELLING WITH THE JCCL LINE" />
      </div>
    </div>
  );
}
