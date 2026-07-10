import type { Metadata } from "next";
import Concourse from "@/components/concourse/Concourse";

export const metadata: Metadata = {
  title: "The JccL Line — a travel network by JccL",
  description:
    "The concourse of The JccL Line: departures to travel journals, field notes, photography and more. A personal museum of places, entered through the Metro.",
};

export default function Home() {
  return <Concourse />;
}
