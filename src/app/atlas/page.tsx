import type { Metadata } from "next";
import { REGISTERED_SLOTS } from "@/lib/media/slots.registry";
import MediaSlot from "@/components/media/MediaSlot";
import ColorTokens from "@/components/atlas/ColorTokens";
import TypeTokens from "@/components/atlas/TypeTokens";
import MotionTokens from "@/components/atlas/MotionTokens";
import LayoutTokens from "@/components/atlas/LayoutTokens";
import ComponentGallery from "@/components/atlas/ComponentGallery";
import ParallaxDemo from "@/components/atlas/ParallaxDemo";
import styles from "./atlas.module.css";

export const metadata: Metadata = {
  title: "Atlas — JccL Line design system",
  description:
    "Living documentation of the JccL Line pilot design system: tokens, components, motion, and the media-slot contract.",
  robots: { index: false, follow: false },
};

/**
 * The Atlas — the design system's living documentation surface (CHARTER T7).
 * Every token, component, motion, and media primitive gets documented here as
 * it lands. v1 documents the media-slot contract with a live gallery: each
 * frame is a real <MediaSlot> rendering its placeholder, proving the media-
 * independent build works end to end in-app.
 */
export default function AtlasPage() {
  return (
    <main className={styles.wrap}>
      <header className={styles.hero}>
        <p className={styles.kicker}>Design System · Atlas</p>
        <h1 className={styles.title}>The JccL Line</h1>
        <p className={styles.lede}>
          Living documentation of the pilot design system. Built
          media-independently — every frame below is a procedural placeholder
          until real media is bound; binding it changes only{" "}
          <code>bindings.ts</code>, never a component.
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.h2}>
          Media slots <span className={styles.count}>{REGISTERED_SLOTS.length}</span>
        </h2>
        <p className={styles.desc}>
          Every declared place a real photo/video will land. Each is a stable id
          with a fixed aspect ratio, so real media drops in with zero layout
          shift. The full spec table is the owner&rsquo;s shopping list in
          docs/pilot/MEDIA_MANIFEST.md.
        </p>
        <div className={styles.grid}>
          {REGISTERED_SLOTS.map((slot) => (
            <figure key={slot.id} className={styles.cell}>
              <MediaSlot slot={slot} />
              <figcaption className={styles.cap}>
                <code>{slot.id}</code>
                <span>
                  {slot.surface} · {slot.kind} · {slot.aspect}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>Tokens</h2>
        <p className={styles.desc}>
          The design language&rsquo;s source of truth — every component draws
          from these, with no hard-coded values. Swatches read live CSS custom
          properties, so they switch with the day/night theme.
        </p>
        <ColorTokens />
        <TypeTokens />
        <MotionTokens />
        <LayoutTokens />
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>Components</h2>
        <p className={styles.desc}>
          The transit UI kit — boards, signs, plates, legends. Each card renders
          a live instance from the real component.
        </p>
        <ComponentGallery />
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>Scene kit — 2.5D Parallax</h2>
        <p className={styles.desc}>
          The Parallax plane of the Layer Model: depth layers at{" "}
          <code>--depth-near/mid/far</code> inside a pointer-tilt rig,
          dependency-free CSS 3D that flattens under reduced-motion. The 3D Stage
          (WebGL) layers behind this — pending the r3f decision in CONVERGENCE.md.
        </p>
        <ParallaxDemo />
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>Motion choreography · 3D Stage</h2>
        <p className={styles.desc}>
          Documented here as each lands — the timeline/scroll choreography
          vocabulary and the WebGL scene primitives. (In progress.)
        </p>
      </section>
    </main>
  );
}
