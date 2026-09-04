import { render, screen, within } from "@testing-library/react";
import { ViewTransitions } from "next-view-transitions";
import DepartureBoard, {
  type Departure,
} from "@/components/transit/DepartureBoard";

const DEPARTURES: Departure[] = [
  {
    href: "/travel/",
    destination: "Travel",
    due: "NOW",
    platform: "1",
    statusWord: "Boarding",
    tone: "boarding",
  },
  {
    href: "/music/",
    destination: "Music",
    due: "2026",
    platform: "6",
    statusWord: "Under construction",
    tone: "works",
  },
];

// The view-transition Link resolves next/navigation's router internally.
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), prefetch: jest.fn() }),
  usePathname: () => "/",
}));

describe("DepartureBoard", () => {
  it("announces each service as one link (no nested links)", () => {
    render(<ViewTransitions><DepartureBoard departures={DEPARTURES} /></ViewTransitions>);

    const board = screen.getByRole("navigation", { name: /Departures/i });
    const links = within(board).getAllByRole("link");
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAccessibleName("Travel — platform 1, Boarding");
    expect(links[1]).toHaveAccessibleName(
      "Music — platform 6, Under construction",
    );
  });

  it("keeps the printed columns decorative (status = word in the label)", () => {
    render(<ViewTransitions><DepartureBoard departures={DEPARTURES} /></ViewTransitions>);

    // Column cells are aria-hidden; the link's aria-label carries the meaning.
    const travel = screen.getByTestId("departure-travel");
    const cells = travel.querySelectorAll("[aria-hidden='true']");
    expect(cells.length).toBeGreaterThanOrEqual(4);
  });

  it("renders a distinct status shape per tone, never color alone", () => {
    render(<ViewTransitions><DepartureBoard departures={DEPARTURES} /></ViewTransitions>);

    const boarding = screen.getByTestId("departure-travel");
    const works = screen.getByTestId("departure-music");
    // boarding = filled disc; works = crossed square — different geometry.
    expect(boarding.querySelector("svg circle[fill]")).not.toBeNull();
    expect(works.querySelector("svg rect")).not.toBeNull();
  });
});
