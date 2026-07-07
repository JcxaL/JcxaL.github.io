/**
 * Departure-board components: SplitFlapBoard + DotMatrixSign.
 * jsdom has no matchMedia by default — the components must treat that as
 * reduced motion. Tests mock it explicitly for both branches.
 */

import { act, render } from "@testing-library/react";
import SplitFlapBoard from "@/components/transit/SplitFlapBoard";
import DotMatrixSign from "@/components/transit/DotMatrixSign";

const FLAP_FALLBACK_MS = 90;

/** Install a matchMedia mock; `reduced` drives prefers-reduced-motion. */
const mockMatchMedia = (reduced: boolean): void => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: query.includes("prefers-reduced-motion") ? reduced : false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
};

const removeMatchMedia = (): void => {
  Reflect.deleteProperty(window, "matchMedia");
};

/** Visible characters of a row's flap cells, nbsp-padding stripped. */
const rowGlyphs = (row: HTMLElement): string => {
  const glyphs = Array.from(row.querySelectorAll(".jccl-splitflap-glyph"));
  return glyphs
    .map((g) => g.textContent ?? "")
    .join("")
    .replace(/\u00a0/g, " ")
    .trimEnd();
};

afterEach(() => {
  removeMatchMedia();
  jest.useRealTimers();
});

describe("SplitFlapBoard", () => {
  const rows = [
    { label: "PLAT 2", text: "KYOTO" },
    { text: "MIND THE GAP" },
  ];

  it("renders every row with its settled text in an aria-label", () => {
    mockMatchMedia(false);
    jest.useFakeTimers();
    const { getByLabelText } = render(<SplitFlapBoard rows={rows} />);

    expect(getByLabelText("PLAT 2: KYOTO")).toBeInTheDocument();
    expect(getByLabelText("MIND THE GAP")).toBeInTheDocument();
  });

  it("cycles, then settles to the target text left-to-right (fake timers)", () => {
    mockMatchMedia(false);
    jest.useFakeTimers();
    const { container, getByLabelText } = render(<SplitFlapBoard rows={rows} />);

    // Mid-cycle: not settled yet.
    act(() => {
      jest.advanceTimersByTime(FLAP_FALLBACK_MS * 3);
    });
    expect(container.querySelector('[data-settled="true"]')).toBeNull();

    // Longest row is 12 chars -> 5 lead steps + 11 stagger steps = 16 steps.
    act(() => {
      jest.advanceTimersByTime(FLAP_FALLBACK_MS * 30);
    });

    const root = container.querySelector(".jccl-splitflap");
    expect(root).toHaveAttribute("data-settled", "true");
    expect(rowGlyphs(getByLabelText("PLAT 2: KYOTO"))).toBe("KYOTO");
    expect(rowGlyphs(getByLabelText("MIND THE GAP"))).toBe("MIND THE GAP");
  });

  it("keeps flap cells aria-hidden while exposing row text", () => {
    mockMatchMedia(false);
    jest.useFakeTimers();
    const { getByLabelText } = render(<SplitFlapBoard rows={rows} />);

    const row = getByLabelText("PLAT 2: KYOTO");
    const cells = row.querySelector(".jccl-splitflap-cells");
    expect(cells).toHaveAttribute("aria-hidden", "true");
    // Every flap cell lives inside an aria-hidden container.
    const allCells = row.querySelectorAll(".jccl-splitflap-cell");
    expect(allCells.length).toBeGreaterThan(0);
    allCells.forEach((cell) => {
      expect(cell.closest('[aria-hidden="true"]')).not.toBeNull();
    });
  });

  it("announces the settled board via an aria-live polite region", () => {
    mockMatchMedia(false);
    jest.useFakeTimers();
    const { container } = render(<SplitFlapBoard rows={rows} />);

    const live = container.querySelector('[aria-live="polite"]');
    expect(live).toBeInTheDocument();
    expect(live).toHaveTextContent("");

    act(() => {
      jest.advanceTimersByTime(FLAP_FALLBACK_MS * 30);
    });

    expect(live).toHaveTextContent("PLAT 2: KYOTO. MIND THE GAP");
  });

  it("renders settled text instantly under prefers-reduced-motion", () => {
    mockMatchMedia(true);
    jest.useFakeTimers();
    const { container, getByLabelText } = render(<SplitFlapBoard rows={rows} />);

    // No timers advanced: already settled.
    const root = container.querySelector(".jccl-splitflap");
    expect(root).toHaveAttribute("data-settled", "true");
    expect(rowGlyphs(getByLabelText("PLAT 2: KYOTO"))).toBe("KYOTO");
    expect(
      container.querySelector('[aria-live="polite"]'),
    ).toHaveTextContent("PLAT 2: KYOTO. MIND THE GAP");
  });

  it("defaults to the reduced-motion branch when matchMedia is unavailable", () => {
    // jsdom default: window.matchMedia === undefined.
    jest.useFakeTimers();
    const { container, getByLabelText } = render(<SplitFlapBoard rows={rows} />);

    expect(
      container.querySelector(".jccl-splitflap"),
    ).toHaveAttribute("data-settled", "true");
    expect(rowGlyphs(getByLabelText("MIND THE GAP"))).toBe("MIND THE GAP");
  });
});

describe("DotMatrixSign", () => {
  const notice = "THIS IS A KYOTO-BOUND SERVICE";

  it("exposes the text via aria-label and hides the rendered strip", () => {
    const { getByLabelText, container } = render(<DotMatrixSign text={notice} />);

    expect(getByLabelText(notice)).toBeInTheDocument();
    const viewport = container.querySelector(".jccl-dotmatrix-viewport");
    expect(viewport).toHaveAttribute("aria-hidden", "true");
    // Static sign: a single copy, no marquee attribute.
    expect(container.querySelectorAll(".jccl-dotmatrix-copy")).toHaveLength(1);
    expect(container.querySelector("[data-marquee]")).toBeNull();
  });

  it("adds [data-marquee] and a duplicated aria-hidden strip when marquee", () => {
    const { container, getByLabelText } = render(
      <DotMatrixSign text={notice} marquee />,
    );

    const root = getByLabelText(notice);
    expect(root).toHaveAttribute("data-marquee", "true");

    const copies = container.querySelectorAll(".jccl-dotmatrix-copy");
    expect(copies).toHaveLength(2);
    copies.forEach((copy) => {
      expect(copy.textContent).toBe(notice);
      // Both copies sit inside the aria-hidden viewport.
      expect(copy.closest('[aria-hidden="true"]')).not.toBeNull();
    });
  });

  it("merges a custom className onto the root", () => {
    const { getByLabelText } = render(
      <DotMatrixSign text={notice} className="hall-sign" />,
    );
    expect(getByLabelText(notice)).toHaveClass("jccl-dotmatrix", "hall-sign");
  });
});
