import type { Metadata } from "next";
import EnamelTrial from "@/components/experiments/EnamelTrial";

export const metadata: Metadata = {
  title: "Depot — enamel trial",
  description: "Depot siding: vitreous-enamel plate texture under evaluation.",
  robots: { index: false, follow: false },
};

/**
 * Standalone preview siding for Trial 03 (enamel texture). The trial also
 * mounts on /depot/experiments/ — this page exists so the treatment can be
 * screenshotted and judged in isolation. Unindexed.
 */
export default function EnamelPreviewPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-24">
      <h1 className="sr-only">Depot trial — enamel plate texture</h1>
      <EnamelTrial />
    </div>
  );
}
