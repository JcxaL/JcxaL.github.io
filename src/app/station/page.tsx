import type { Metadata } from "next";
import StationDemo from "./StationDemo";

export const metadata: Metadata = {
  title: "Platform Preview | The JccL Line",
  description:
    "Preview platform for The JccL Line — train arrival, departures board, and ticket gate.",
  robots: { index: false, follow: false },
};

// Preview route: the first composed JccL Line scene experiment. The root
// layout provides SmoothScrollProvider; site chrome self-suppresses here.
export default function StationPage() {
  return <StationDemo />;
}
