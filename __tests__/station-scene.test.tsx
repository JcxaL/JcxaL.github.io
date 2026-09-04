import { render, screen } from "@testing-library/react";
import StationScene from "@/components/scene/StationScene";
import { SCENE_DEPTHS, TRAIN_PARKED_X } from "@/components/scene/layers";

/** The seven parallax depths the rig reads, as rendered attribute strings. */
const DEPTH_ATTRS = ["0.05", "0.15", "0.5", "0.7", "0.8", "0.9", "1"];

const trainGroup = (container: HTMLElement) =>
  container.querySelector(`g[data-depth="${SCENE_DEPTHS.train}"]`);

describe("StationScene", () => {
  it("renders a responsive svg with the station name in the aria-label", () => {
    render(<StationScene stationName="Kyoto" />);
    const svg = screen.getByTestId("station-scene");
    expect(svg.tagName.toLowerCase()).toBe("svg");
    expect(svg).toHaveAttribute("role", "img");
    expect(svg).toHaveAttribute("aria-label", "Kyoto platform, The JccL Line");
    expect(svg).toHaveAttribute("viewBox", "0 0 1600 900");
    expect(svg).toHaveAttribute("preserveAspectRatio", "xMidYMid slice");
  });

  it("falls back to a generic platform label without a station name", () => {
    render(<StationScene />);
    expect(screen.getByTestId("station-scene")).toHaveAttribute(
      "aria-label",
      "Station platform, The JccL Line",
    );
  });

  it("renders every scene layer, queryable by its data-depth", () => {
    const { container } = render(<StationScene />);
    for (const depth of DEPTH_ATTRS) {
      expect(container.querySelector(`g[data-depth="${depth}"]`)).not.toBeNull();
    }
  });

  it("marks every depth-tagged group decorative (aria-hidden)", () => {
    const { container } = render(<StationScene />);
    const groups = Array.from(container.querySelectorAll("[data-depth]"));
    // Seven layers plus the destination strip placeholder.
    expect(groups.length).toBeGreaterThanOrEqual(DEPTH_ATTRS.length);
    for (const group of groups) {
      expect(group).toHaveAttribute("aria-hidden", "true");
    }
  });

  it("renders more than 3 train windows", () => {
    render(<StationScene />);
    expect(screen.getAllByTestId("train-window").length).toBeGreaterThan(3);
  });

  it("paints the livery stripe with the line color token", () => {
    const { rerender } = render(<StationScene line="a" />);
    expect(screen.getByTestId("livery-stripe")).toHaveAttribute(
      "fill",
      "var(--color-lines-a)",
    );
    rerender(<StationScene line="c" />);
    expect(screen.getByTestId("livery-stripe")).toHaveAttribute(
      "fill",
      "var(--color-lines-c)",
    );
  });

  it("moves the train group transform with trainX", () => {
    const { container, rerender } = render(<StationScene trainX={320} />);
    const before = trainGroup(container)?.getAttribute("transform");
    expect(before).toContain("translate(320");

    rerender(<StationScene trainX={960} />);
    const after = trainGroup(container)?.getAttribute("transform");
    expect(after).toContain("translate(960");
    expect(after).not.toBe(before);
  });

  it("parks the train at the platform by default", () => {
    const { container } = render(<StationScene />);
    expect(trainGroup(container)?.getAttribute("transform")).toContain(
      `translate(${TRAIN_PARKED_X}`,
    );
  });

  it("lightsOn toggles the headlight, its glow, and the cabin glow", () => {
    const { rerender } = render(<StationScene lightsOn />);
    expect(screen.getByTestId("train-headlight")).toHaveAttribute(
      "fill",
      "var(--color-board-amber)",
    );
    expect(screen.getByTestId("headlight-glow")).toBeInTheDocument();
    expect(screen.getAllByTestId("window-glow").length).toBeGreaterThan(3);

    rerender(<StationScene lightsOn={false} />);
    expect(screen.getByTestId("train-headlight")).toHaveAttribute(
      "fill",
      "var(--color-board-amber-dim)",
    );
    expect(screen.queryByTestId("headlight-glow")).not.toBeInTheDocument();
    expect(screen.queryAllByTestId("window-glow")).toHaveLength(0);
  });

  it("renders the aria-hidden destination strip placeholder", () => {
    render(<StationScene />);
    const strip = screen.getByTestId("destination-strip");
    expect(strip).toHaveAttribute("aria-hidden", "true");
    // It rides with the canopy under the parallax rig.
    expect(strip).toHaveAttribute("data-depth", String(SCENE_DEPTHS.canopy));
  });

  it("keeps the scene silent for assistive tech apart from the image label", () => {
    render(<StationScene stationName="Lisbon" />);
    // The only accessible node is the labelled image itself.
    expect(
      screen.getByRole("img", { name: "Lisbon platform, The JccL Line" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("group")).not.toBeInTheDocument();
  });
});
