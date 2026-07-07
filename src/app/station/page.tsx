import type { Metadata } from "next";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import StationDemo from "./StationDemo";

export const metadata: Metadata = {
  title: "Platform Preview | The JccL Line",
  description:
    "Preview platform for The JccL Line — train arrival, departures board, and ticket gate.",
  robots: { index: false, follow: false },
};

// Preview route (unlinked): the first composed JccL Line experience.
// Becomes the basis of the real station homepage in Phase 2 (docs/design/10-roadmap.md).
export default function StationPage() {
  return (
    <SmoothScrollProvider>
      <StationDemo />
    </SmoothScrollProvider>
  );
}
