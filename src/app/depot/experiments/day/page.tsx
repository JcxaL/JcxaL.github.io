import type { Metadata } from "next";
import GlassTrial from "@/components/experiments/GlassTrial";

export const metadata: Metadata = {
  title: "Depot — glass vs solid trial",
  description:
    "Isolated siding for Trial 02: day-service floating chrome, glass vs solid paper, viewed on its own.",
  robots: { index: false, follow: false },
};

/**
 * Isolated siding for Trial 02 so the glass-vs-solid chrome decision can be
 * judged (and screenshotted) without the rest of the experiments wall around
 * it. The trial also mounts on /depot/experiments/ alongside its siblings.
 */
export default function GlassTrialPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-14 md:pt-20">
      <p className="jccl-kicker">The JccL Line · Depot — isolated siding</p>
      <h1 className="sr-only">Depot trial — day-service chrome, glass vs solid</h1>
      <GlassTrial />
    </div>
  );
}
