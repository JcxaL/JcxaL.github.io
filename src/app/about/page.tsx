import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import CodeDisc from "@/components/transit/CodeDisc";

export const metadata: Metadata = {
  title: "Operator",
  description:
    "Operator information for the JccL Line. This service is driven, photographed and maintained by one member of staff.",
};

/** Staff-pass rows — telemetry register, system voice. */
const ID_ROWS = [
  { label: "OPERATOR", value: "JCCL" },
  { label: "ROLE", value: "DRIVER · PHOTOGRAPHER · DEVELOPER" },
  { label: "BASE", value: "X01 HOME" },
  { label: "SERVICE SINCE", value: "2024" },
];

const COMPETENCIES = [
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "Tailwind CSS",
  "Git",
  "Docker",
];

export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-14 pb-16">
      {/* ---- Signage ---- */}
      <p className="jccl-kicker">The JccL Line · Operator’s office</p>
      <h1 className="jccl-signage mt-5 text-5xl sm:text-6xl">Operator</h1>
      <div
        aria-hidden="true"
        className="mt-6 h-1.5 w-24"
        style={{ backgroundColor: "var(--color-board-amber)" }}
      />

      {/* ---- Operator ID (staff pass) ---- */}
      <section className="mt-10" aria-label="Operator identification">
        <div className="jccl-panel flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:gap-8 sm:p-7">
          <CodeDisc code="X01" line="a" size={56} />
          <dl className="grid flex-1 gap-2.5">
            {ID_ROWS.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-[7.5rem_1fr] gap-3 sm:grid-cols-[9rem_1fr]"
              >
                <dt
                  className="jccl-telemetry"
                  style={{ color: "var(--color-ink-faint)" }}
                >
                  {row.label}
                </dt>
                <dd
                  className="jccl-telemetry"
                  style={{ color: "var(--color-ink-signage)" }}
                >
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <p className="jccl-telemetry mt-3">
          STAFF PASS · NOT VALID FOR TRAVEL
        </p>
      </section>

      {/* ---- Journal register: first person from here to the divider ---- */}
      <section className="mt-12">
        <p
          className="jccl-measure text-base leading-relaxed"
          style={{ color: "var(--color-ink-muted)" }}
        >
          I write software for a living and take photographs when I travel.
          This site is where the two meet — a portfolio of sorts and a place to
          file thoughts on technology, laid out as a small metro system because
          a plain list of posts felt like a missed opportunity.
        </p>
        <p
          className="jccl-measure mt-5 text-base leading-relaxed"
          style={{ color: "var(--color-ink-muted)" }}
        >
          Most of my work is on the modern web: building applications, keeping
          them running at scale, contributing to open source where I can. I
          like problems that resist the first attempt, and I pick up whatever
          tools the job turns out to need. Everything else here is journals and
          field notes from the places in between.
        </p>
      </section>

      {/* ---- Competencies ---- */}
      <section className="mt-14" aria-label="Competencies">
        <p className="jccl-kicker">Certified for</p>
        <h2 className="jccl-signage mt-4 text-xl">Competencies</h2>
        <ul className="mt-6 flex flex-wrap gap-2.5">
          {COMPETENCIES.map((skill) => (
            <li
              key={skill}
              className="border px-3.5 py-1.5 text-xs"
              style={{
                borderColor: "var(--color-ground-line)",
                borderRadius: "var(--layout-radius-pill)",
                fontFamily: "var(--font-stack-mono)",
                letterSpacing: "0.08em",
                color: "var(--color-ink-signage)",
              }}
            >
              {skill}
            </li>
          ))}
        </ul>
      </section>

      {/* ---- Station office notice ---- */}
      <section
        className="mt-14 border-t pt-8"
        style={{ borderColor: "var(--color-ground-line)" }}
      >
        <p style={{ color: "var(--color-ink-muted)" }}>
          The operator is occasionally away driving trains.
        </p>
        <Link
          href="/contact/"
          className="jccl-telemetry mt-4 inline-block hover:underline"
          style={{ color: "var(--color-board-amber)" }}
        >
          Contact the station office →
        </Link>
      </section>
    </div>
  );
}
