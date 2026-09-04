import { render, screen, fireEvent } from "@testing-library/react";
import Ticket, { type TicketStop } from "@/components/transit/Ticket";

const STOPS: TicketStop[] = [
  { code: "A01", name: "Tokyo", status: "visited" },
  { code: "A02", name: "Kyoto", status: "progress" },
  { code: "A03", name: "Osaka", status: "planning" },
];

const getSlider = () =>
  screen.getByRole("slider", {
    name: "Insert ticket to board",
  }) as HTMLInputElement;

describe("Ticket", () => {
  it("renders the strip, holder, stations, and status words", () => {
    render(<Ticket holder="ALVIN" stations={STOPS} />);

    expect(
      screen.getByText("THE JccL LINE · SINGLE JOURNEY"),
    ).toBeInTheDocument();
    expect(screen.getByText("PASSENGER")).toBeInTheDocument();
    expect(screen.getByText("ALVIN")).toBeInTheDocument();

    // Every stop: name + status word (status is never color alone).
    expect(screen.getByText("Tokyo")).toBeInTheDocument();
    expect(screen.getByText("Kyoto")).toBeInTheDocument();
    expect(screen.getByText("Osaka")).toBeInTheDocument();
    expect(screen.getByText("Visited")).toBeInTheDocument();
    expect(screen.getByText("In progress")).toBeInTheDocument();
    expect(screen.getByText("Planning")).toBeInTheDocument();

    // The stub invitation, and no punched state yet.
    expect(screen.getByText("INSERT TO BOARD →")).toBeInTheDocument();
    expect(screen.queryByText("VALIDATED")).not.toBeInTheDocument();
    expect(screen.getByTestId("jccl-ticket")).not.toHaveAttribute(
      "data-punched",
    );
  });

  it("defaults the holder to GUEST", () => {
    render(<Ticket stations={STOPS} />);
    expect(screen.getByText("GUEST")).toBeInTheDocument();
  });

  it("colors each stop dot from the status token", () => {
    render(<Ticket stations={STOPS} />);
    const row = screen.getByTestId("ticket-stop-A02");
    const dot = row.querySelector('[aria-hidden="true"]');
    expect(dot).toHaveStyle({
      backgroundColor: "var(--color-status-progress)",
    });
  });

  it("exposes the hidden range input with the boarding aria-label", () => {
    render(<Ticket stations={STOPS} />);
    const slider = getSlider();
    expect(slider).toHaveAttribute("type", "range");
    expect(slider.value).toBe("0");
    expect(slider).toHaveAttribute(
      "aria-valuetext",
      "Ticket ready. Slide right or press Enter to insert.",
    );
  });

  it("punches when the range value commits at 100 via a change event", () => {
    const onPunch = jest.fn();
    render(<Ticket stations={STOPS} onPunch={onPunch} />);

    fireEvent.change(getSlider(), { target: { value: "100" } });

    expect(screen.getByTestId("jccl-ticket")).toHaveAttribute(
      "data-punched",
      "true",
    );
    expect(onPunch).toHaveBeenCalledTimes(1);
    expect(screen.getByText("VALIDATED")).toBeInTheDocument();
    // System-voice announcement in the polite live region.
    expect(
      screen.getByText("Ticket validated. Doors opening."),
    ).toBeInTheDocument();

    // Further change events are no-ops once punched.
    fireEvent.change(getSlider(), { target: { value: "0" } });
    expect(onPunch).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("jccl-ticket")).toHaveAttribute(
      "data-punched",
      "true",
    );
  });

  it("punches exactly at the 60 threshold", () => {
    const onPunch = jest.fn();
    render(<Ticket stations={STOPS} onPunch={onPunch} />);
    fireEvent.change(getSlider(), { target: { value: "60" } });
    expect(onPunch).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("jccl-ticket")).toHaveAttribute(
      "data-punched",
      "true",
    );
  });

  it("does not punch below the threshold and springs back on release", () => {
    const onPunch = jest.fn();
    render(<Ticket stations={STOPS} onPunch={onPunch} />);
    const slider = getSlider();

    fireEvent.change(slider, { target: { value: "30" } });
    expect(onPunch).not.toHaveBeenCalled();
    expect(screen.getByTestId("jccl-ticket")).not.toHaveAttribute(
      "data-punched",
    );
    expect(screen.queryByText("VALIDATED")).not.toBeInTheDocument();
    expect(slider).toHaveAttribute("aria-valuetext", "Ticket 30% inserted");

    // Releasing the pointer below 60 springs the stub back to 0.
    fireEvent.pointerUp(slider);
    expect(slider.value).toBe("0");
    expect(onPunch).not.toHaveBeenCalled();
  });

  it("punches on a simple click of the stub, firing onPunch once", () => {
    const onPunch = jest.fn();
    render(<Ticket stations={STOPS} onPunch={onPunch} />);

    const stub = screen.getByTestId("ticket-stub");
    fireEvent.click(stub);

    expect(screen.getByTestId("jccl-ticket")).toHaveAttribute(
      "data-punched",
      "true",
    );
    expect(onPunch).toHaveBeenCalledTimes(1);

    // A second tap on an already-validated ticket does nothing.
    fireEvent.click(stub);
    expect(onPunch).toHaveBeenCalledTimes(1);
  });

  it("punches on Enter on the range input", () => {
    const onPunch = jest.fn();
    render(<Ticket stations={STOPS} onPunch={onPunch} />);
    fireEvent.keyDown(getSlider(), { key: "Enter" });
    expect(onPunch).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("jccl-ticket")).toHaveAttribute(
      "data-punched",
      "true",
    );
  });

  it("renders the validated state when the controlled punched prop is set", () => {
    render(<Ticket stations={STOPS} punched />);

    expect(screen.getByTestId("jccl-ticket")).toHaveAttribute(
      "data-punched",
      "true",
    );
    expect(screen.getByText("VALIDATED")).toBeInTheDocument();
    expect(screen.queryByText("INSERT TO BOARD →")).not.toBeInTheDocument();
    expect(getSlider()).toHaveAttribute("aria-valuetext", "Ticket validated");
  });

  it("stays unpunched under controlled punched=false but still reports the attempt", () => {
    const onPunch = jest.fn();
    const { rerender } = render(
      <Ticket stations={STOPS} punched={false} onPunch={onPunch} />,
    );

    fireEvent.click(screen.getByTestId("ticket-stub"));
    expect(onPunch).toHaveBeenCalledTimes(1);
    // Controlled: the parent owns the state, so the ticket stays unpunched.
    expect(screen.getByTestId("jccl-ticket")).not.toHaveAttribute(
      "data-punched",
    );

    rerender(<Ticket stations={STOPS} punched onPunch={onPunch} />);
    expect(screen.getByTestId("jccl-ticket")).toHaveAttribute(
      "data-punched",
      "true",
    );
    expect(screen.getByText("VALIDATED")).toBeInTheDocument();
  });

  it("starts validated with defaultPunched (uncontrolled)", () => {
    render(<Ticket stations={STOPS} defaultPunched />);
    expect(screen.getByTestId("jccl-ticket")).toHaveAttribute(
      "data-punched",
      "true",
    );
    expect(screen.getByText("VALIDATED")).toBeInTheDocument();
  });
});
