import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "End of the Line | The JccL Line",
  description: "This station does not exist. Service resumes from the concourse.",
};

// Static-export 404 (emitted as 404.html). Styled as a JccL Line service notice —
// system voice per docs/design/12-brand-signage.md.
export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "var(--color-ground-0)", color: "var(--color-ink-signage)" }}
    >
      <main className="max-w-xl w-full">
        <p
          className="text-xs uppercase tracking-[0.35em] mb-6"
          style={{ color: "var(--color-ink-muted)", fontFamily: "var(--font-mono, monospace)" }}
        >
          The JccL Line · Service Notice
        </p>

        <div
          className="rounded-md border p-8"
          style={{ borderColor: "var(--color-ground-line)", background: "var(--color-ground-1)" }}
        >
          <p
            className="text-3xl sm:text-4xl font-bold mb-3"
            style={{ color: "var(--color-board-amber)", fontFamily: "var(--font-board), monospace" }}
            aria-hidden
          >
            404 · END OF THE LINE
          </p>
          <h1 className="text-xl font-semibold mb-4">This station does not exist.</h1>
          <p className="mb-8" style={{ color: "var(--color-ink-muted)" }}>
            The address you followed leads beyond the network. It may have been renamed,
            demolished, or never built. We apologise for any inconvenience caused.
          </p>
          <Link
            href="/"
            className="inline-block rounded-md px-5 py-3 font-semibold transition-transform hover:-translate-y-0.5"
            style={{ background: "var(--color-board-amber)", color: "var(--color-ink-inverse)" }}
          >
            Return to the concourse →
          </Link>
        </div>

        <p className="mt-6 text-sm" style={{ color: "var(--color-ink-faint)" }}>
          Next departure: wherever you were actually going.
        </p>
      </main>
    </div>
  );
}
