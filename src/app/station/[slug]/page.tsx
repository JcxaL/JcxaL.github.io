import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "next-view-transitions";
import MediaSlot from "@/components/media/MediaSlot";
import { STATION_HERO, STATION_AMBIENT } from "@/lib/media/slots.registry";
import styles from "./station.module.css";

interface StationParams {
  slug: string;
}

interface Exhibit {
  title: string;
  code: string;
  region: string;
  hook: string;
  note: string[];
  facts: { k: string; v: string }[];
}

/**
 * Station exhibit — the third flagship surface (CHARTER §0): a single
 * destination as an immersive room (hero + long-form field note + ambient
 * media). Built media-independently: the two media slots render placeholders
 * until real assets bind. Content is inline placeholder prose so the room is
 * navigable now; a full station-content pipeline is a later unit.
 */
const STATIONS: Record<string, Exhibit> = {
  paris: {
    title: "Paris",
    code: "A01",
    region: "Western Europe · France",
    hook: "Western terminus of the Atlantic line — a week chasing golden-hour light across the arrondissements.",
    note: [
      "Placeholder field note. The exhibit is built; the words and photographs arrive at convergence. What lives here is the shape of the room — a hero plate, this column of prose, a facts rail, and an ambient loop — all reserved at their true proportions so nothing shifts when the real rolls are scanned.",
      "The week ran on one rule: be somewhere with a camera before the city woke. The tower at 6am, Montmartre's cobbles still wet, the Marais between the medieval and the boutique. Each morning a different neighbourhood; each evening the Seine.",
      "When the media binds, the hero above fills with the establishing frame and the ambient panel to the side plays a silent eight-second loop of the platform. Until then, the placeholders hold their place — the design is complete, waiting only on the pictures.",
    ],
    facts: [
      { k: "LINE", v: "Atlantic (A)" },
      { k: "STATUS", v: "In service" },
      { k: "WINDOW", v: "Jan 2024" },
      { k: "FRAMES", v: "Pending" },
    ],
  },
};

export function generateStaticParams(): StationParams[] {
  return Object.keys(STATIONS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<StationParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = STATIONS[slug];
  if (!s) return { title: "Station — The JccL Line" };
  return {
    title: `${s.title} — The JccL Line`,
    description: s.hook,
    robots: { index: false, follow: false },
  };
}

export default async function StationExhibit({
  params,
}: {
  params: Promise<StationParams>;
}) {
  const { slug } = await params;
  const s = STATIONS[slug];
  if (!s) notFound();

  return (
    <main className={styles.room}>
      <Link href="/travel/" className={styles.back}>
        ← All lines
      </Link>

      <header className={styles.plate}>
        <span className={styles.code}>{s.code}</span>
        <h1 className={styles.title}>{s.title}</h1>
        <span className={styles.region}>{s.region}</span>
      </header>
      <p className={styles.hook}>{s.hook}</p>

      <div className={styles.hero}>
        <MediaSlot slot={STATION_HERO} />
      </div>

      <div className={styles.body}>
        <article className={styles.note}>
          {s.note.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </article>

        <aside className={styles.aside}>
          <div className={styles.facts}>
            {s.facts.map((f) => (
              <div key={f.k} className={styles.fact}>
                <span>{f.k}</span>
                <b>{f.v}</b>
              </div>
            ))}
          </div>
          <figure className={styles.ambient}>
            <MediaSlot slot={STATION_AMBIENT} />
            <figcaption>Ambient — platform loop</figcaption>
          </figure>
        </aside>
      </div>
    </main>
  );
}
