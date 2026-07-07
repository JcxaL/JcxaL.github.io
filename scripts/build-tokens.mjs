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

/** Flatten nested token groups into [cssVarName, value] pairs. */
function flatten(node, path = []) {
  const out = [];
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith("$")) continue;
    if (value && typeof value === "object" && "$value" in value) {
      out.push([`--${[...path, key].map(kebab).join("-")}`, value.$value]);
    } else if (value && typeof value === "object") {
      out.push(...flatten(value, [...path, key]));
    }
  }
  return out;
}

const pairs = flatten(tokens);
const banner = `/* GENERATED FILE — do not edit by hand.
 * Source: tokens/tokens.json  ·  Build: pnpm tokens
 * House rule (CLAUDE.md): components consume these vars; raw hex/duration
 * literals in component code fail review. */`;

const css = `${banner}\n:root {\n${pairs
  .map(([k, v]) => `  ${k}: ${v};`)
  .join("\n")}\n}\n`;

mkdirSync(join(root, "src/styles"), { recursive: true });
writeFileSync(join(root, "src/styles/tokens.css"), css);
console.log(`tokens.css written (${pairs.length} tokens)`);
