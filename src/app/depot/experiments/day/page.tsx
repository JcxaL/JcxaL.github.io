import type { Metadata } from "next";
import DayServiceTrial from "@/components/experiments/DayServiceTrial";

export const metadata: Metadata = {
  title: "Depot — day service trial",
  description:
    "Isolated siding for Trial 02: the day-service light-theme ramp, viewed on its own.",
  robots: { index: false, follow: false },
};

/**
 * Isolated siding for Trial 02 so the day ramp can be judged (and
 * screenshotted) without the rest of the experiments wall around it.
 * The trial also mounts on /depot/experiments/ alongside its siblings.
 */
export default function DayServiceTrialPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-14 md:pt-20">
      <p className="jccl-kicker">The JccL Line · Depot — isolated siding</p>
      <h1 className="sr-only">Depot trial — day service theme ramp</h1>
      <DayServiceTrial />
    </div>
  );
}
