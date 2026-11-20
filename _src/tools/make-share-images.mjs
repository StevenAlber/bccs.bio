// Draws the pictures that other sites and phones show for a link to bccs.bio, into _src/assets/root/:
//
//   share-card.png        1200 x 630, the picture of a link preview (Open Graph, X card)
//   apple-touch-icon.png  180 x 180, the icon of a bookmark or home-screen entry on iOS
//   favicon.ico           32 and 16 px, for browsers that do not take the SVG icon
//   favicon.svg           the mark on its tile
//
//   node _src/tools/make-share-images.mjs      (needs Playwright with Chromium; the build itself does not)
//
// The files are committed; the build copies them. Run this again only when the words or the mark change. The
// pictures hold the name, the headline and the mark, in the typefaces the site serves. They carry no figure and
// no outcome: a picture cannot follow the registry, so nothing that a later record could change is drawn into
// it. Lines on a picture end without a full stop. The mark is the one of the BCCS Evidence Observatory.
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const src = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { chromium } = createRequire(import.meta.url)("playwright");
const out = path.join(src, "assets", "root");
const fonts = path.join(src, "assets", "fonts");

const LATIN = "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD";
// The font files go into the page itself: a page that is not served from anywhere may not load files by address.
const face = (family, file, weight) => `@font-face { font-family: "${family}"; font-style: normal; font-weight: ${weight}; src: url("data:font/woff2;base64,${fs.readFileSync(path.join(fonts, file)).toString("base64")}") format("woff2"); unicode-range: ${LATIN}; }`;
const FACES = [face("Fraunces Variable", "fraunces-latin-opsz-normal.woff2", "100 900"), face("JetBrains Mono Variable", "jetbrains-mono-latin-wght-normal.woff2", "100 800")].join("\n");

const ARCS = `<path d="M7 21.5c3.2-5.5 6.1-8.2 9-8.2s5.8 2.7 9 8.2" fill="none" stroke="#9be2bd" stroke-width="2.2" stroke-linecap="round"/><path d="M11 21.5c1.7-2.6 3.3-3.9 5-3.9s3.3 1.3 5 3.9" fill="none" stroke="#bb8657" stroke-width="2.2" stroke-linecap="round"/><circle cx="16" cy="9.2" r="1.8" fill="#9be2bd"/>`;
const TILE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#0f2d2a"/>${ARCS}</svg>`;

const CARD = `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>
${FACES}
* { box-sizing: border-box; margin: 0; }
html, body { width: 1200px; height: 630px; }
body { position: relative; overflow: hidden; background: #0f2d2a; color: #f1f5f0; font-family: "Fraunces Variable", serif; }
.motif { position: absolute; right: -262px; bottom: -240px; width: 760px; height: 760px; opacity: 0.1; }
.frame { position: absolute; inset: 0; padding: 64px 76px 60px; display: flex; flex-direction: column; }
.brand { display: flex; align-items: center; gap: 20px; }
.brand svg { width: 64px; height: 64px; border-radius: 13px; background: #153b37; }
.bccs { font-family: "JetBrains Mono Variable", monospace; font-size: 21px; font-weight: 500; letter-spacing: 0.24em; color: #9be2bd; line-height: 1.2; }
.name { font-size: 31px; font-weight: 520; line-height: 1.2; }
h1 { margin-top: auto; max-width: 1000px; font-size: 68px; line-height: 1.07; letter-spacing: -0.022em; font-weight: 430; color: #ffffff; }
.rule { margin-top: 44px; width: 76px; height: 3px; background: #bb8657; }
.foot { margin-top: 22px; display: flex; justify-content: space-between; align-items: baseline; font-family: "JetBrains Mono Variable", monospace; font-size: 21px; letter-spacing: 0.1em; }
.where { text-transform: uppercase; color: #b9cbc4; }
.site { color: #9be2bd; letter-spacing: 0.04em; }
</style></head><body>
<svg class="motif" viewBox="5 6 22 18" aria-hidden="true">${ARCS}</svg>
<div class="frame">
  <div class="brand"><svg viewBox="0 0 32 32" aria-hidden="true">${ARCS}</svg><div><div class="bccs">BCCS</div><div class="name">Evidence services</div></div></div>
  <h1>Evidence for coastal ecosystem claims that a third party can re-run</h1>
  <div class="rule"></div>
  <div class="foot"><span class="where">Fixed before the data · Re-runnable · Able to refuse</span><span class="site">bccs.bio</span></div>
</div>
</body></html>`;

// The mark on its tile, filling the picture: iOS rounds the corners itself, so the tile is square here.
const ICON = `<!doctype html><html><head><meta charset="utf-8"><style>* { margin: 0; } html, body { width: 100%; height: 100%; background: #0f2d2a; } svg { display: block; width: 100%; height: 100%; }</style></head><body><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">${ARCS}</svg></body></html>`;
// For the small icon the tile keeps its rounded corners on a transparent ground, as in favicon.svg.
const SMALL = `<!doctype html><html><head><meta charset="utf-8"><style>* { margin: 0; } html, body { width: 100%; height: 100%; background: transparent; } svg { display: block; width: 100%; height: 100%; }</style></head><body>${TILE}</body></html>`;

/** An .ico file that holds PNG pictures, which every current browser reads. */
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  const entries = [];
  let offset = 6 + 16 * images.length;
  for (const { size, png } of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size, 0);
    entry.writeUInt8(size, 1);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += png.length;
    entries.push(entry);
  }
  return Buffer.concat([header, ...entries, ...images.map((i) => i.png)]);
}

const browser = await chromium.launch();
try {
  const shot = async (html, width, height, transparent = false) => {
    const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    await page.setContent(html, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    const faces = await page.evaluate(() => [...document.fonts].map((f) => `${f.family}: ${f.status}`));
    if (faces.some((f) => f.endsWith("error"))) throw new Error("a typeface did not load: " + faces.join("; "));
    // Text must have been set in the site's typefaces and not in a fallback of this machine.
    if (faces.length > 0 && !faces.some((f) => f.endsWith("loaded"))) throw new Error("no typeface was used: " + faces.join("; "));
    const png = await page.screenshot({ type: "png", omitBackground: transparent });
    await ctx.close();
    return png;
  };
  fs.mkdirSync(out, { recursive: true });
  const card = await shot(CARD, 1200, 630);
  fs.writeFileSync(path.join(out, "share-card.png"), card);
  const touch = await shot(ICON, 180, 180);
  fs.writeFileSync(path.join(out, "apple-touch-icon.png"), touch);
  const small = [];
  for (const size of [16, 32]) small.push({ size, png: await shot(SMALL, size, size, true) });
  fs.writeFileSync(path.join(out, "favicon.ico"), ico(small));
  fs.writeFileSync(path.join(out, "favicon.svg"), TILE + "\n");
  console.log(`share-card.png ${card.length} bytes, apple-touch-icon.png ${touch.length} bytes, favicon.ico ${fs.statSync(path.join(out, "favicon.ico")).size} bytes`);
} finally {
  await browser.close();
}
