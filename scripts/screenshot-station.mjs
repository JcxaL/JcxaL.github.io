#!/usr/bin/env node
/**
 * Vision-verification capture for /station (doc 08 §3).
 * Serves out/ must already be running (see CONTRIBUTING). Usage:
 *   node scripts/screenshot-station.mjs <baseURL> <outDir>
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const base = process.argv[2] ?? "http://127.0.0.1:3311";
const outDir = process.argv[3] ?? "screenshots";
mkdirSync(outDir, { recursive: true });

const exe = process.env.CHROMIUM_PATH; // optional override
const browser = await chromium.launch(exe ? { executablePath: exe } : {});

async function shot(name, { viewport, reducedMotion = "no-preference", actions }) {
  const ctx = await browser.newContext({ viewport, reducedMotion });
  const page = await ctx.newPage();
  await page.goto(`${base}/station/?e2e=1`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  if (actions) await actions(page);
  await page.waitForTimeout(400);
  await page.screenshot({ path: join(outDir, `${name}.png`) });
  await ctx.close();
  console.log(`captured ${name}`);
}

const desktop = { width: 1440, height: 900 };
const mobile = { width: 390, height: 844 };

// Beat 1 at three scrub positions (scroll drives the timeline — truthful posing).
await shot("arrival-0", { viewport: desktop });
await shot("arrival-mid", {
  viewport: desktop,
  actions: async (p) => {
    await p.evaluate(() => {
      const sec = document.querySelector('[aria-label="Platform 1 — train arriving"]');
      window.scrollTo({ top: sec.offsetTop + sec.scrollHeight * 0.45, behavior: "instant" });
    });
    await p.waitForTimeout(700);
  },
});
await shot("arrival-done", {
  viewport: desktop,
  actions: async (p) => {
    await p.evaluate(() => {
      const sec = document.querySelector('[aria-label="Platform 1 — train arriving"]');
      window.scrollTo({ top: sec.offsetTop + sec.scrollHeight * 0.9, behavior: "instant" });
    });
    await p.waitForTimeout(700);
  },
});

// Beat 2+3: departures hall and ticket gate (scroll to them), then punched state.
await shot("hall", {
  viewport: desktop,
  actions: async (p) => {
    await p.getByLabel("Departures").scrollIntoViewIfNeeded();
    await p.waitForSelector('[data-settled="true"]', { timeout: 8000 }).catch(() => {});
    await p.waitForTimeout(300);
  },
});
await shot("ticket-punched", {
  viewport: desktop,
  actions: async (p) => {
    await p.getByLabel("Ticket gate").scrollIntoViewIfNeeded();
    const range = p.getByLabel("Insert ticket to board");
    await range.evaluate((el) => {
      const input = el;
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
      setter.call(input, "100");
      input.dispatchEvent(new Event("change", { bubbles: true }));
    });
    await p.waitForTimeout(500);
  },
});

// Reduced motion: the whole settled composition.
await shot("reduced-motion", { viewport: desktop, reducedMotion: "reduce" });

// Mobile.
await shot("mobile-top", { viewport: mobile });
await shot("mobile-hall", {
  viewport: mobile,
  actions: async (p) => {
    await p.getByLabel("Departures").scrollIntoViewIfNeeded();
    await p.waitForSelector('[data-settled="true"]', { timeout: 8000 }).catch(() => {});
    await p.waitForTimeout(300);
  },
});

await browser.close();
console.log("done");
