#!/usr/bin/env node
/**
 * Compiles tokens/tokens.json (DTCG-flavored) into src/styles/tokens.css.
 * Zero-dependency by design (ADR 0005): graduate to Style Dictionary when
 * tokens need multi-platform outputs (e.g. MapLibre style JSON generation).
 *
 * Naming: color.lines.a -> --color-lines-a ; motion.duration.flap -> --motion-duration-flap
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const tokens = JSON.parse(readFileSync(join(root, "tokens/tokens.json"), "utf8"));

const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

/**
 * Flatten nested token groups. Every leaf carries its dark `$value` and,
 * when it theme-switches, a `$light` value. Tokens without `$light` are
 * invariant across both services (night default + day service).
 */
function flatten(node, path = []) {
  const out = [];
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith("$")) continue;
    if (value && typeof value === "object" && "$value" in value) {
      out.push({
        name: `--${[...path, key].map(kebab).join("-")}`,
        dark: value.$value,
        light: "$light" in value ? value.$light : null,
      });
    } else if (value && typeof value === "object") {
      out.push(...flatten(value, [...path, key]));
    }
  }
  return out;
}

const leaves = flatten(tokens);
const invariant = leaves.filter((l) => l.light === null);
const themed = leaves.filter((l) => l.light !== null);

const decls = (list, pick) =>
  list.map((l) => `  ${l.name}: ${pick(l)};`).join("\n");

const banner = `/* GENERATED FILE — do not edit by hand.
 * Source: tokens/tokens.json  ·  Build: pnpm tokens
 * House rule (CLAUDE.md): components consume these vars; raw hex/duration
 * literals in component code fail review.
 *
 * Two services share one system. Night is the default (:root); day service
 * is opted in per prefers-color-scheme or an explicit data-theme on <html>.
 * The lit boards (.jccl-lit-board) pin the night palette so departure
 * displays stay dark-and-amber in daylight — a station board is a lit
 * panel whatever the weather. */`;

const css = `${banner}
:root {
${decls(invariant, (l) => l.dark)}

  /* Night service — the default palette (also SSR / no-JS). */
${decls(themed, (l) => l.dark)}
}

/* Explicit night selection beats the light media query. */
:root[data-theme="dark"] {
${decls(themed, (l) => l.dark)}
}

/* Day service — pale lilac paper. Opted in by OS preference… */
@media (prefers-color-scheme: light) {
  :root:not([data-theme]) {
${decls(themed, (l) => l.light).replace(/^ {2}/gm, "    ")}
  }
}

/* …or by an explicit toggle, which always wins. */
:root[data-theme="light"] {
${decls(themed, (l) => l.light)}
}

/* Lit boards stay on the night palette in both services. */
.jccl-lit-board {
${decls(themed, (l) => l.dark)}
}
`;

mkdirSync(join(root, "src/styles"), { recursive: true });
writeFileSync(join(root, "src/styles/tokens.css"), css);
console.log(
  `tokens.css written (${invariant.length} invariant + ${themed.length} themed)`,
);

/* ------------------------------------------------------------------ *
 * Duotone filter defs — token → SVG asset (WP-core pattern).          *
 * One feColorMatrix(Rec.709 luma) + feComponentTransfer table filter  *
 * per line color (+ board amber), shadows pinned to ground-0. The     *
 * numbers are generated from tokens.json, same contract as tokens.css.*
 * ------------------------------------------------------------------ */

/** #rrggbb -> [r,g,b] each normalized 0..1 with 6dp. */
const hexToUnit = (hex) =>
  [1, 3, 5].map((i) => (Number.parseInt(hex.slice(i, i + 2), 16) / 255).toFixed(6));

const LUMA_709 =
  "0.2126 0.7152 0.0722 0 0 " +
  "0.2126 0.7152 0.0722 0 0 " +
  "0.2126 0.7152 0.0722 0 0 " +
  "0 0 0 1 0";

const shadow = hexToUnit(tokens.color.ground["0"].$value);
const duotoneStops = [
  ...Object.entries(tokens.color.lines).map(([id, t]) => [id, t.$value]),
  ["amber", tokens.color.board.amber.$value],
];

const filterFor = ([id, hex]) => {
  const hi = hexToUnit(hex);
  const table = (ch) => `${shadow[ch]} ${hi[ch]}`;
  return `      <filter
        id="jccl-duo-${id}"
        colorInterpolationFilters="sRGB"
        x="0"
        y="0"
        width="100%"
        height="100%"
      >
        <feColorMatrix type="matrix" values="${LUMA_709}" />
        <feComponentTransfer>
          <feFuncR type="table" tableValues="${table(0)}" />
          <feFuncG type="table" tableValues="${table(1)}" />
          <feFuncB type="table" tableValues="${table(2)}" />
        </feComponentTransfer>
      </filter>`;
};

const defsTsx = `/* GENERATED FILE — do not edit by hand.
 * Source: tokens/tokens.json  ·  Build: pnpm tokens
 * Duotone reference filters (doc 13): luminance → two-stop table ramp
 * from station black to each line color. Mounted once in the root layout.
 * Hidden via 0x0 + absolute — display:none breaks url(#) references. */

export default function DuotoneDefs() {
  return (
    <svg
      aria-hidden="true"
      width="0"
      height="0"
      style={{ position: "absolute", overflow: "hidden" }}
    >
      <defs>
${duotoneStops.map(filterFor).join("\n")}
      </defs>
    </svg>
  );
}
`;

mkdirSync(join(root, "src/components/media"), { recursive: true });
writeFileSync(join(root, "src/components/media/DuotoneDefs.tsx"), defsTsx);
console.log(`DuotoneDefs.tsx written (${duotoneStops.length} filters)`);

/* ------------------------------------------------------------------ *
 * Night-service atlas style — token → MapLibre style JSON (ADR 0006). *
 * A minimal openmaptiles-schema style for the globe atlas (z0–6):     *
 * dark oceans on faintly-lit continents, hairline borders, muted      *
 * country labels. Colors come from tokens.json; tiles/glyphs are      *
 * OpenFreeMap (keyless — the economics decide, doc 07 D4).            *
 * ------------------------------------------------------------------ */

const g = tokens.color.ground;
const atlasStyle = {
  version: 8,
  name: "JccL Night Service",
  metadata: {
    "jccl:generated": "scripts/build-tokens.mjs — edit tokens.json, run pnpm tokens",
  },
  glyphs: "https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf",
  sources: {
    openfreemap: {
      type: "vector",
      url: "https://tiles.openfreemap.org/planet",
    },
  },
  projection: { type: "globe" },
  sky: {
    "atmosphere-blend": ["interpolate", ["linear"], ["zoom"], 0, 0.4, 6, 0],
  },
  light: { anchor: "map", intensity: 0.1 },
  layers: [
    // Land base — the faintly-lit continent plate.
    { id: "land", type: "background", paint: { "background-color": g["2"].$value } },
    {
      id: "water",
      type: "fill",
      source: "openfreemap",
      "source-layer": "water",
      paint: { "fill-color": g["0"].$value },
    },
    {
      id: "boundary-country",
      type: "line",
      source: "openfreemap",
      "source-layer": "boundary",
      filter: ["all", ["==", ["get", "admin_level"], 2], ["!=", ["get", "maritime"], 1]],
      paint: {
        "line-color": g.line.$value,
        "line-width": ["interpolate", ["linear"], ["zoom"], 0, 0.4, 6, 1],
      },
    },
    {
      id: "place-country",
      type: "symbol",
      source: "openfreemap",
      "source-layer": "place",
      filter: ["==", ["get", "class"], "country"],
      minzoom: 1.5,
      maxzoom: 6,
      layout: {
        "text-field": ["get", "name:en"],
        "text-font": ["Noto Sans Regular"],
        "text-size": ["interpolate", ["linear"], ["zoom"], 2, 9, 6, 12],
        "text-transform": "uppercase",
        "text-letter-spacing": 0.12,
      },
      paint: {
        "text-color": tokens.color.ink.faint.$value,
        "text-halo-color": g["0"].$value,
        "text-halo-width": 1,
      },
    },
  ],
};

mkdirSync(join(root, "public/atlas"), { recursive: true });
writeFileSync(
  join(root, "public/atlas/night-service.json"),
  JSON.stringify(atlasStyle, null, 2) + "\n",
);
console.log("atlas night-service.json written");
