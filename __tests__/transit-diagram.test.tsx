import { render, screen, fireEvent } from "@testing-library/react";
import TransitDiagram from "@/components/transit/TransitDiagram";
import StationPlate from "@/components/transit/StationPlate";
import CodeDisc from "@/components/transit/CodeDisc";
import { DEMO_NETWORK } from "@/lib/transit/fixtures";

// DEMO_NETWORK shape: 2 lines, 8 unique stations (X01 shared), 1 interchange.
const UNIQUE_STATIONS = 8;
const INTERCHANGE_MEMBERS = 1;

describe("TransitDiagram", () => {
  it("renders the svg root with role img and a count-based aria-label", () => {
    render(<TransitDiagram network={DEMO_NETWORK} />);
    const svg = screen.getByTestId("transit-diagram");
    expect(svg).toHaveAttribute("role", "img");
    expect(svg).toHaveAttribute(
      "aria-label",
      "Transit diagram of The JccL Line: 2 lines, 8 stations.",
    );
  });

  it("renders one node group per unique station", () => {
    const { container } = render(<TransitDiagram network={DEMO_NETWORK} />);
    const groups = container.querySelectorAll('[data-testid^="station-"]');
    // station-node-* circles live inside station-* groups; count groups only.
    const stationGroups = Array.from(groups).filter((el) =>
      /^station-[A-Z]\d+$/.test(el.getAttribute("data-testid") ?? ""),
    );
    expect(stationGroups).toHaveLength(UNIQUE_STATIONS);
    // Interchange members are drawn as a capsule, not a circle node.
    const nodes = container.querySelectorAll(
      '[data-testid^="station-node-"]',
    );
    expect(nodes).toHaveLength(UNIQUE_STATIONS - INTERCHANGE_MEMBERS);
  });

  it("renders one octilinear path per line with the line color token", () => {
    render(<TransitDiagram network={DEMO_NETWORK} />);
    const pathA = screen.getByTestId("line-path-a");
    const pathB = screen.getByTestId("line-path-b");
    expect(pathA).toHaveAttribute("stroke", "var(--color-lines-a)");
    expect(pathB).toHaveAttribute("stroke", "var(--color-lines-b)");
    expect(pathA).toHaveAttribute("stroke-width", "6");
    expect(pathA).toHaveAttribute("stroke-linecap", "round");
    // A02 (5,1) -> A03 (7,2) requires a Beck elbow: diagonal to (6,2) then
    // straight — the path must contain that elbow point (grid * 48).
    expect(pathA.getAttribute("d")).toContain("L 288 96 L 336 96");
  });

  it("marks planning stations with a dashed ring", () => {
    render(<TransitDiagram network={DEMO_NETWORK} />);
    expect(screen.getByTestId("station-node-A04")).toHaveAttribute(
      "stroke-dasharray",
      "3 3",
    );
    expect(screen.getByTestId("station-node-A01")).not.toHaveAttribute(
      "stroke-dasharray",
    );
  });

  it("renders an interchange capsule instead of separate circles", () => {
    render(<TransitDiagram network={DEMO_NETWORK} />);
    const capsule = screen.getByTestId("interchange-X01");
    expect(capsule.tagName.toLowerCase()).toBe("rect");
    expect(capsule).toHaveAttribute("stroke", "var(--color-ink-signage)");
    expect(capsule).toHaveAttribute("rx", "12");
    expect(
      screen.queryByTestId("station-node-X01"),
    ).not.toBeInTheDocument();
  });

  it("renders a board-amber halo only around currentCode", () => {
    const { rerender } = render(
      <TransitDiagram network={DEMO_NETWORK} currentCode="A03" />,
    );
    const halo = screen.getByTestId("current-halo");
    expect(halo).toHaveAttribute("stroke", "var(--color-board-amber)");
    expect(screen.getByTestId("station-A03")).toContainElement(halo);

    rerender(<TransitDiagram network={DEMO_NETWORK} />);
    expect(screen.queryByTestId("current-halo")).not.toBeInTheDocument();
  });

  it("fires onStationClick via click and keyboard", () => {
    const onStationClick = jest.fn();
    render(
      <TransitDiagram network={DEMO_NETWORK} onStationClick={onStationClick} />,
    );
    const tokyo = screen.getByRole("button", { name: "Tokyo, station A01" });
    expect(tokyo).toHaveAttribute("tabindex", "0");

    fireEvent.click(tokyo);
    expect(onStationClick).toHaveBeenCalledWith("A01");

    onStationClick.mockClear();
    fireEvent.keyDown(tokyo, { key: "Enter" });
    expect(onStationClick).toHaveBeenCalledWith("A01");

    onStationClick.mockClear();
    fireEvent.keyDown(tokyo, { key: " " });
    expect(onStationClick).toHaveBeenCalledWith("A01");

    onStationClick.mockClear();
    fireEvent.keyDown(tokyo, { key: "Escape" });
    expect(onStationClick).not.toHaveBeenCalled();
  });

  it("renders no buttons when onStationClick is absent", () => {
    render(<TransitDiagram network={DEMO_NETWORK} />);
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("toggles station labels with showLabels", () => {
    const { rerender } = render(<TransitDiagram network={DEMO_NETWORK} />);
    expect(screen.getByText("Kyoto")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();

    rerender(<TransitDiagram network={DEMO_NETWORK} showLabels={false} />);
    expect(screen.queryByText("Kyoto")).not.toBeInTheDocument();
    expect(screen.queryByText("Home")).not.toBeInTheDocument();
  });
});

describe("StationPlate", () => {
  it("renders name, local name (lang=zh), status word, and code disc", () => {
    render(
      <StationPlate
        name="Kyoto"
        nameLocal="京都"
        code="A02"
        line="a"
        status="progress"
      />,
    );
    expect(screen.getByText("Kyoto")).toBeInTheDocument();
    const local = screen.getByText("京都");
    expect(local).toHaveAttribute("lang", "zh");
    // Status is color + word, never color alone.
    expect(screen.getByText("In progress")).toBeInTheDocument();
    expect(screen.getByLabelText("Station A02")).toBeInTheDocument();
  });

  it("omits local name and status chip when not provided", () => {
    render(<StationPlate name="Lisbon" code="B01" line="b" />);
    expect(screen.getByText("Lisbon")).toBeInTheDocument();
    expect(screen.queryByText("Visited")).not.toBeInTheDocument();
    expect(screen.queryByText("In progress")).not.toBeInTheDocument();
    expect(screen.queryByText("Planning")).not.toBeInTheDocument();
  });
});

describe("CodeDisc", () => {
  it("exposes the station code via aria-label", () => {
    render(<CodeDisc code="A03" line="a" />);
    const disc = screen.getByLabelText("Station A03");
    expect(disc).toBeInTheDocument();
    expect(disc).toHaveStyle({ width: "34px", height: "34px" });
  });

  it("scales with the size prop", () => {
    render(<CodeDisc code="B02" line="b" size={48} />);
    expect(screen.getByLabelText("Station B02")).toHaveStyle({
      width: "48px",
      height: "48px",
    });
  });
});
