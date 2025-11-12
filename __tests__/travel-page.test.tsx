import { render, screen } from "@testing-library/react";
import Travel from "@/app/travel/page";

describe("Travel Page", () => {
  it("lists visited destinations from the shared data source", () => {
    render(<Travel />);

    expect(
      screen.getByRole("heading", { name: /Kyoto, Japan/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Lisbon, Portugal/i })
    ).toBeInTheDocument();
  });

  it("surfaces authoring status for guide drafts", () => {
    render(<Travel />);

    expect(
      screen.getByText(/Kyoto Dawn Blueprint/i)
    ).toBeInTheDocument();
    const draftBadges = screen.getAllByText(/Draft Mode/i);
    expect(draftBadges).toHaveLength(3);
  });
});
