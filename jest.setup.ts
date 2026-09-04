import "@testing-library/jest-dom";

// Shared environment mocks (doc 09 §5). jsdom lacks matchMedia; tests default to
// REDUCED motion (matches: true for prefers-reduced-motion queries) so no GSAP
// ScrollTriggers mount. Individual tests may override window.matchMedia.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  configurable: true,
  value: (query: string) => ({
    matches: query.includes("prefers-reduced-motion"),
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

