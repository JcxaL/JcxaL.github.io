/**
 * StationDemo smoke tests (reduced-motion path — jsdom has no matchMedia,
 * so usePrefersReducedMotion defaults to reduced and no GSAP triggers mount).
 */
import { render, screen, fireEvent } from "@testing-library/react";
import StationDemo from "@/app/station/StationDemo";
import { _clearRegistry, registerTimeline, isE2E } from "@/lib/animation/motionRegistry";

describe("StationDemo (reduced motion)", () => {
  it("renders the three beats: scene, departures, ticket gate", () => {
    render(<StationDemo />);
    expect(screen.getByTestId("station-scene")).toBeInTheDocument();
    expect(screen.getByLabelText("Departures")).toBeInTheDocument();
    expect(screen.getByLabelText("Ticket gate")).toBeInTheDocument();
    // Reduced-motion copy replaces the scroll prompt.
    expect(screen.getByText(/Doors are open/)).toBeInTheDocument();
  });

  it("reveals the network diagram after the ticket is punched", () => {
    render(<StationDemo />);
    expect(screen.queryByTestId("network-reveal")).not.toBeInTheDocument();

    const range = screen.getByLabelText("Insert ticket to board");
    fireEvent.change(range, { target: { value: "100" } });

    expect(screen.getByTestId("network-reveal")).toBeInTheDocument();
    expect(screen.getByTestId("transit-diagram")).toBeInTheDocument();
  });

  it("shows bilingual station plates with correct lang tags", () => {
    const { container } = render(<StationDemo />);
    const ja = container.querySelector('[lang="ja"]');
    const zh = container.querySelector('[lang="zh-Hant"]');
    expect(ja).toHaveTextContent("京都");
    expect(zh).toHaveTextContent("香港");
  });
});

describe("motionRegistry", () => {
  afterEach(() => _clearRegistry());

  it("seeks a registered timeline when exposed", () => {
    process.env.NEXT_PUBLIC_E2E = "1";
    const tl = { progress: jest.fn(), pause: jest.fn() };
    const unregister = registerTimeline("demo", tl);

    expect(isE2E()).toBe(true);
    expect(window.__motion?.has("demo")).toBe(true);
    expect(window.__motion?.seek("demo", 0.5)).toBe(true);
    expect(tl.pause).toHaveBeenCalled();
    expect(tl.progress).toHaveBeenCalledWith(0.5);

    unregister();
    expect(window.__motion?.has("demo")).toBe(false);
    expect(window.__motion?.seek("demo", 1)).toBe(false);
    delete process.env.NEXT_PUBLIC_E2E;
  });

  it("clamps seek progress into [0, 1]", () => {
    process.env.NEXT_PUBLIC_E2E = "1";
    const tl = { progress: jest.fn(), pause: jest.fn() };
    registerTimeline("clamp", tl);
    window.__motion?.seek("clamp", 7);
    expect(tl.progress).toHaveBeenCalledWith(1);
    delete process.env.NEXT_PUBLIC_E2E;
  });
});
