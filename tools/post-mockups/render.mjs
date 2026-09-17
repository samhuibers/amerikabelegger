/*
 * Renders posts.html into the eight media thumbnails in public/images.
 *
 * These are mock-ups of social posts, not photographs — see
 * docs/IMAGE-CREDITS.md. Edit posts.html, re-run, commit the JPGs.
 *
 *   npm install --no-save playwright && npx playwright install chromium
 *   node tools/post-mockups/render.mjs
 *
 * Playwright is deliberately not a project dependency: this runs by hand when
 * the art changes, never as part of a build.
 */

import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, "posts.html");
const out = join(here, "..", "..", "public", "images");

const shots = {
  s1: "post-youtube-index",
  s2: "post-tiktok-smallcap",
  s3: "post-x-chips",
  s4: "post-substack-margins",
  s5: "post-instagram-warning",
  s6: "post-x-rates",
  s7: "post-youtube-revisions",
  s8: "post-instagram-week",
};

const browser = await chromium.launch();
// 2x, so a 512x768 shot lands at 1024x1536 — sharp on a retina tile.
const page = await browser.newPage({
  viewport: { width: 1200, height: 900 },
  deviceScaleFactor: 2,
});

await page.goto(pathToFileURL(source).href, { waitUntil: "networkidle" });
await page.waitForTimeout(600);

for (const [id, name] of Object.entries(shots)) {
  await page.locator(`#${id}`).screenshot({
    path: join(out, `${name}.jpg`),
    type: "jpeg",
    quality: 88,
  });
  console.log("wrote", name);
}

await browser.close();
