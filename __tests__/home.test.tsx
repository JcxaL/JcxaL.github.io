import { render, screen, within } from "@testing-library/react";
import { ViewTransitions } from "next-view-transitions";
import Home from "@/app/page";

// Concourse uses next/navigation for ticket boarding + map deep links.
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => "/",
}));

describe("Home (concourse)", () => {
  it("signs the station in the brand voice", () => {
    render(<ViewTransitions><Home /></ViewTransitions>);

    expect(
      screen.getByRole("heading", { level: 1, name: /The JccL\s*Line/i }),
    ).toBeInTheDocument();
  });

  it("boards Travel from the departures board", () => {
    render(<ViewTransitions><Home /></ViewTransitions>);

    const board = screen.getByRole("navigation", { name: /Departures/i });
    const travel = within(board).getByRole("link", {
      name: /Travel — platform 1, Boarding/i,
    });
    // next/link normalizes the trailing slash away outside the real build.
    expect(travel.getAttribute("href")).toMatch(/^\/travel\/?$/);
  });

  it("keeps under-construction stations visible and reachable", () => {
    render(<ViewTransitions><Home /></ViewTransitions>);

    const board = screen.getByRole("navigation", { name: /Departures/i });
    for (const name of ["Photography", "Music", "Design"]) {
      const link = within(board).getByRole("link", {
        name: new RegExp(`${name} — platform \\d+, Under construction`, "i"),
      });
      expect(link).toBeInTheDocument();
    }
  });

  it("offers the concourse ticket for boarding", () => {
    render(<ViewTransitions><Home /></ViewTransitions>);

    expect(screen.getByTestId("jccl-ticket")).toBeInTheDocument();
    expect(
      screen.getByRole("slider", { name: /Insert ticket to board/i }),
    ).toBeInTheDocument();
  });

  it("renders the network map with the status legend", () => {
    render(<ViewTransitions><Home /></ViewTransitions>);

    expect(screen.getByTestId("transit-diagram")).toBeInTheDocument();
    const legend = screen.getByRole("list", { name: /Status legend/i });
    for (const word of ["VISITED", "IN PROGRESS", "PLANNING"]) {
      expect(within(legend).getByText(word)).toBeInTheDocument();
    }
  });
});
