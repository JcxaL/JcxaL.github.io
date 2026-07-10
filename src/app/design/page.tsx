import type { Metadata } from "next";
import UnderConstructionStation from "@/components/transit/UnderConstructionStation";

export const metadata: Metadata = {
  title: "Design — under construction",
  description:
    "Design station (E01) is under construction. A map room and drawing office open here in 2026. Please mind the hoarding.",
};

export default function DesignPage() {
  return (
    <UnderConstructionStation
      name="Design"
      code="E01"
      line="e"
      plans="A map room and drawing office are under fit-out behind this hoarding; when it opens, the network’s diagrams, marks and working drawings will be laid out on the tables."
    />
  );
}
