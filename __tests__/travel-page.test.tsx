import { render, screen, within } from "@testing-library/react";
import TravelPage from "@/app/travel/page";

describe("Travel (line guide)", () => {
  it("titles the line guide", () => {
    render(<TravelPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: /Travel/i }),
    ).toBeInTheDocument();
  });

  it("renders a plate for every destination station", () => {
    render(<TravelPage />);

    for (const code of ["A01", "A02", "B01", "B02", "B03"]) {
      expect(screen.getByTestId(`station-plate-${code}`)).toBeInTheDocument();
    }
  });

  it("links stations with a guide and marks the rest in production", () => {
    render(<TravelPage />);

    const paris = screen.getByRole("link", {
      name: /Paris — guide in service/i,
    });
    // next/link normalizes the trailing slash away outside the real build.
    expect(paris.getAttribute("href")).toMatch(/^\/travel\/paris\/?$/);

    // Stations without written guides stay honest, unlinked cards.
    expect(screen.getAllByText(/Guide in production/i).length).toBeGreaterThan(0);
    expect(
      screen.queryByRole("link", { name: /Kyoto — guide in service/i }),
    ).not.toBeInTheDocument();
  });

  it("shows the network diagram with line strips per line", () => {
    render(<TravelPage />);

    expect(screen.getByTestId("transit-diagram")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /East Asia Line/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Atlantic Line/i }),
    ).toBeInTheDocument();

    // The interchange renders as the origin of each strip.
    const strips = screen.getAllByText(/ALL LINES BEGIN HERE/i);
    expect(strips).toHaveLength(2);
  });

  it("prints provenance telemetry (season + coordinates)", () => {
    render(<TravelPage />);

    const kyoto = screen.getByTestId("strip-A01");
    expect(within(kyoto).getByText(/SPRING 2024/i)).toBeInTheDocument();
    expect(within(kyoto).getByText(/35\.0116/)).toBeInTheDocument();
  });
});
