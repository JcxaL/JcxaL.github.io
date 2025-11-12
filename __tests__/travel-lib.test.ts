import { getTravelGuideDrafts, getTravelLocations } from "@/lib/travel";

describe("travel data helpers", () => {
  it("returns grouped travel locations", () => {
    const locations = getTravelLocations();
    expect(locations.visited).toHaveLength(2);
    expect(locations.onDeck).toHaveLength(2);
    expect(
      locations.visited.find((loc) => loc.id === "kyoto")
    ).toMatchObject({
      status: "visited",
      coordinates: { lat: 35.0116, lng: 135.7681 },
    });
  });

  it("exposes guide drafts with schedule metadata", () => {
    const guides = getTravelGuideDrafts();
    expect(guides).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "iceland-route",
          eta: expect.stringContaining("2025"),
        }),
      ])
    );
  });
});
