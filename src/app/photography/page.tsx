import type { Metadata } from "next";
import UnderConstructionStation from "@/components/transit/UnderConstructionStation";

export const metadata: Metadata = {
  title: "Photography — under construction",
  description:
    "Photography station (C01) is under construction. A darkroom and gallery hall open here in 2026. Please mind the hoarding.",
};

export default function PhotographyPage() {
  return (
    <UnderConstructionStation
      name="Photography"
      code="C01"
      line="c"
      plans="A darkroom and gallery hall are being fitted out behind this hoarding; when it comes down, prints from across the network will hang the length of the platform."
    />
  );
}
