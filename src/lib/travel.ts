export type TravelStatus = "visited" | "onDeck";

export interface TravelLocation {
  id: string;
  name: string;
  status: TravelStatus;
  tags: string[];
  highlight?: string;
  mission?: string;
  season?: string;
  target?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface TravelGuideDraft {
  id: string;
  title: string;
  eta: string;
  status: string;
}

const visitedLocations: TravelLocation[] = [
  {
    id: "kyoto",
    name: "Kyoto, Japan",
    status: "visited",
    season: "Spring 2024",
    highlight: "Temple dawn walks + kaiseki notebook",
    tags: ["Culture", "Food", "Photography"],
    coordinates: { lat: 35.0116, lng: 135.7681 },
  },
  {
    id: "lisbon",
    name: "Lisbon, Portugal",
    status: "visited",
    season: "Autumn 2023",
    highlight: "Analog film crawl through Alfama",
    tags: ["City", "Analog", "Music"],
    coordinates: { lat: 38.7223, lng: -9.1393 },
  },
];

const onDeckLocations: TravelLocation[] = [
  {
    id: "iceland",
    name: "Ring Road, Iceland",
    status: "onDeck",
    target: "Winter 2024",
    mission: "Aurora chase + geothermal field recordings",
    tags: ["Roadtrip", "Nature"],
    coordinates: { lat: 64.9631, lng: -19.0208 },
  },
  {
    id: "seoul",
    name: "Seoul, South Korea",
    status: "onDeck",
    target: "Spring 2025",
    mission: "Cafés, modular synth shops, night markets",
    tags: ["Food", "Music", "City"],
    coordinates: { lat: 37.5665, lng: 126.978 },
  },
];

const guideDrafts: TravelGuideDraft[] = [
  {
    id: "kyoto-guide",
    title: "Kyoto Dawn Blueprint",
    status: "Drafting itinerary & photo map",
    eta: "Guide ETA: Nov 2024",
  },
  {
    id: "lisbon-guide",
    title: "Lisbon Tram Loop",
    status: "Editing film scans & café list",
    eta: "Guide ETA: Dec 2024",
  },
  {
    id: "iceland-route",
    title: "Iceland Ring Road HUD",
    status: "Route planning + packing overlay",
    eta: "Guide ETA: Jan 2025",
  },
];

export function getTravelLocations() {
  return {
    visited: visitedLocations,
    onDeck: onDeckLocations,
  };
}

export function getTravelGuideDrafts() {
  return guideDrafts;
}
