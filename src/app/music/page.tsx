import type { Metadata } from "next";
import UnderConstructionStation from "@/components/transit/UnderConstructionStation";

export const metadata: Metadata = {
  title: "Music — under construction",
  description:
    "Music station (D01) is under construction. An instrument workshop and listening room open here in 2026. Please mind the hoarding.",
};

export default function MusicPage() {
  return (
    <UnderConstructionStation
      name="Music"
      code="D01"
      line="d"
      plans="An instrument workshop and listening room are taking shape behind this hoarding; when it opens, passengers are welcome to sit a while and hear what the operator has been playing."
    />
  );
}
