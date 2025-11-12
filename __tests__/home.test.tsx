import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("Home Page", () => {
  it("emphasizes the travel section as active", () => {
    render(<Home />);

    const travelLink = screen.getByRole("link", { name: /Travel/i });
    expect(travelLink).toBeInTheDocument();
    expect(screen.getByText(/Build in progress/i)).toBeInTheDocument();
  });

  it("keeps standby sections non-interactive", () => {
    render(<Home />);

    expect(
      screen.queryByRole("link", { name: /Music/i })
    ).not.toBeInTheDocument();
  });
});
