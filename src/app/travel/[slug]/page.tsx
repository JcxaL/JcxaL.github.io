import type { Metadata } from "next";
import type { ComponentPropsWithoutRef } from "react";
import { Link } from "next-view-transitions";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import StationPlate from "@/components/transit/StationPlate";
import DotMatrixSign from "@/components/transit/DotMatrixSign";
import StationPunch from "@/components/ticket/StationPunch";
import ArrivalName from "@/components/transit/ArrivalName";
import DuotoneImage from "@/components/media/DuotoneImage";
import { SITE_NETWORK, STATION_NOTES } from "@/lib/transit/network";
import type { Station } from "@/lib/transit/types";
import { getAllSlugs, getPostBySlug } from "@/lib/mdx";

/**
 * Station exhibit — a written guide mounted at its station. Chrome is system
 * voice; the article body is the journal register (first person).
 * Static export: every slug comes from generateStaticParams (ADR 0001).
 */

interface ExhibitParams {
  slug: string;
}

/** Stations that have a guide in service AND a matching MDX file. */
function guideSlugs(): string[] {
  const withGuides = Object.values(STATION_NOTES)
    .map((note) => note.guideSlug)
    .filter((slug): slug is string => Boolean(slug));
  const files = new Set(getAllSlugs("travel"));
  return withGuides.filter((slug) => files.has(slug));
}

function stationForSlug(slug: string): Station | undefined {
  const code = Object.entries(STATION_NOTES).find(
    ([, note]) => note.guideSlug === slug,
  )?.[0];
  return code ? SITE_NETWORK.stations[code] : undefined;
}

/** The line that owns a station code (first line that lists it). */
function lineFor(code: string) {
  return SITE_NETWORK.lines.find((line) => line.stations.includes(code));
}

/** Previous/next station codes along the owning line. */
function neighbours(code: string): { prev?: Station; next?: Station } {
  const line = lineFor(code);
  if (!line) return {};
  const i = line.stations.indexOf(code);
  return {
    prev: i > 0 ? SITE_NETWORK.stations[line.stations[i - 1]] : undefined,
    next:
      i >= 0 && i < line.stations.length - 1
        ? SITE_NETWORK.stations[line.stations[i + 1]]
        : undefined,
  };
}

export function generateStaticParams(): ExhibitParams[] {
  return guideSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<ExhibitParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const station = stationForSlug(slug);
  if (!station) return {};
  const post = getPostBySlug(slug, "travel");
  return {
    title: `${station.name} — station exhibit`,
    description: post.excerpt,
  };
}

const EXHIBIT_CSS = `
.jccl-exhibit {
  color: var(--color-ink-muted);
  font-size: 1.0625rem;
  line-height: 1.75;
}
.jccl-exhibit h2 {
  font-family: var(--font-stack-signage);
  font-weight: 700;
  font-size: 1.375rem;
  color: var(--color-ink-signage);
  margin: 2.25em 0 0.75em;
}
.jccl-exhibit h3 {
  font-family: var(--font-stack-signage);
  font-weight: 600;
  font-size: 1.125rem;
  color: var(--color-ink-signage);
  margin: 1.75em 0 0.5em;
}
.jccl-exhibit p { margin: 0 0 1.25em; }
.jccl-exhibit a {
  color: var(--color-accent-base);
  text-decoration: underline;
  text-underline-offset: 3px;
}
.jccl-exhibit strong { color: var(--color-ink-signage); }
.jccl-exhibit ul, .jccl-exhibit ol {
  margin: 0 0 1.25em;
  padding-left: 1.5em;
}
.jccl-exhibit li { margin-bottom: 0.4em; }
.jccl-exhibit li::marker { color: var(--color-ink-faint); }
.jccl-exhibit blockquote {
  margin: 1.5em 0;
  padding: 0.25em 0 0.25em 1.25em;
  border-left: 3px solid var(--color-board-amber);
  color: var(--color-ink-signage);
}
.jccl-exhibit code {
  font-family: var(--font-stack-mono);
  font-size: 0.875em;
  background: var(--color-ground-1);
  border: 1px solid var(--color-ground-line);
  border-radius: 4px;
  padding: 0.1em 0.4em;
}
.jccl-exhibit pre {
  background: var(--color-ground-1);
  border: 1px solid var(--color-ground-line);
  border-radius: var(--layout-radius-plate);
  padding: 1em 1.25em;
  overflow-x: auto;
  margin: 0 0 1.5em;
}
.jccl-exhibit pre code {
  background: none;
  border: none;
  padding: 0;
}
.jccl-exhibit hr {
  border: none;
  border-top: 1px solid var(--color-ground-line);
  margin: 2.5em 0;
}
.jccl-platform-edge {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 12px 24px;
}
.jccl-platform-edge a {
  font-family: var(--font-stack-mono);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  text-decoration: none;
  color: var(--color-accent-base);
}
.jccl-platform-edge a:hover { text-decoration: underline; }
`;

/* Code blocks are lit boards: pinning the night palette keeps code legible on
   the pale day-service paper. Merges any hljs class rehype adds. */
function LitPre({ className, ...props }: ComponentPropsWithoutRef<"pre">) {
  return (
    <pre
      className={className ? `jccl-lit-board ${className}` : "jccl-lit-board"}
      {...props}
    />
  );
}

export default async function ExhibitPage({
  params,
}: {
  params: Promise<ExhibitParams>;
}) {
  const { slug } = await params;
  const station = stationForSlug(slug);
  if (!station || !guideSlugs().includes(slug)) notFound();

  const post = getPostBySlug(slug, "travel");
  const line = lineFor(station.code);
  const note = STATION_NOTES[station.code];
  const { prev, next } = neighbours(station.code);

  return (
    <div className="mx-auto max-w-3xl px-6">
      <style>{EXHIBIT_CSS}</style>

      <header className="pt-14 md:pt-20">
        <p className="jccl-kicker">
          {line?.name ?? "The JccL Line"} · Station {station.code} · Exhibit
        </p>
        <div className="mt-6">
          <ArrivalName name={station.name} className="mb-6" />
          <StationPlate
            name={station.name}
            nameLocal={station.nameLocal}
            nameLocalLang={station.nameLocalLang}
            code={station.code}
            line={line?.id ?? "a"}
            status={station.status}
          />
        </div>
        <div className="jccl-telemetry mt-4 flex flex-wrap gap-x-5 gap-y-1">
          {station.coords ? (
            <span>
              {Math.abs(station.coords.lat).toFixed(4)}°
              {station.coords.lat >= 0 ? "N" : "S"} ·{" "}
              {Math.abs(station.coords.lng).toFixed(4)}°
              {station.coords.lng >= 0 ? "E" : "W"}
            </span>
          ) : null}
          <span>{post.date}</span>
          <span>{post.readTime.toUpperCase()}</span>
          {note ? <span>{note.season.toUpperCase()}</span> : null}
        </div>
        <h1
          className="mt-10 text-3xl font-bold sm:text-4xl"
          style={{ color: "var(--color-ink-signage)", lineHeight: 1.15 }}
        >
          {post.title}
        </h1>
        <p className="mt-3 text-lg" style={{ color: "var(--color-ink-muted)" }}>
          {post.excerpt}
        </p>
      </header>

      {slug === "paris" ? (
        <div className="mt-10">
          <DuotoneImage
            src="/media/samples/paris.jpg"
            alt="The Eiffel Tower over the Seine at dusk, riverboats moored along the bank"
            width={1200}
            height={798}
            line={line?.id ?? "amber"}
            caption="The tower from the river on the first evening — placeholder frame until the real rolls are scanned."
            credit="PHOTO: SAMPLE ASSET (UNSPLASH) · PRODUCTION MEDIA SHIPS FROM R2"
            priority
          />
        </div>
      ) : null}

      <article className="jccl-exhibit jccl-measure mt-10">
        <MDXRemote
          source={post.content}
          components={{ pre: LitPre }}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [rehypeHighlight],
            },
          }}
        />
      </article>

      <footer className="mt-16">
        <div className="mb-4">
          <StationPunch code={station.code} />
        </div>
        <DotMatrixSign text={`THANK YOU FOR VISITING ${station.name.toUpperCase()} · MIND THE GAP`} />
        <nav aria-label="Platform edge" className="jccl-platform-edge mt-6">
          {prev ? (
            <Link href={`/travel/#${prev.code}`}>← {prev.name}</Link>
          ) : (
            <span />
          )}
          <Link href="/travel/">Back to the line</Link>
          {next ? (
            <Link href={`/travel/#${next.code}`}>{next.name} →</Link>
          ) : (
            <span />
          )}
        </nav>
      </footer>
    </div>
  );
}
