import SplitFlapBoardCard from "./gallery/SplitFlapBoardCard";
import DotMatrixSignCard from "./gallery/DotMatrixSignCard";
import StationPlateCard from "./gallery/StationPlateCard";
import StatusLegendCard from "./gallery/StatusLegendCard";

/**
 * Component gallery — live doc-cards for the transit UI kit, each rendering a
 * real instance of the component from its actual props. Authored one-per-card
 * by a parallel workflow; grows as components are documented.
 */
export default function ComponentGallery() {
  return (
    <div style={{ display: "grid", gap: "2rem" }}>
      <SplitFlapBoardCard />
      <DotMatrixSignCard />
      <StationPlateCard />
      <StatusLegendCard />
    </div>
  );
}
