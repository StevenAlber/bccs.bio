// Checks the built site without a browser. Exit status 1 when a check fails.
//
//   node _src/tools/check.mjs
//
// 1. The generated files are up to date with their sources.
// 2. Every page has one headline, a title and a description of a usable length, an address of its own and
//    link-preview tags.
// 3. Every link inside the site leads to a file that exists, and every #place to an element that exists.
// 4. Nothing is requested from another host (typefaces, scripts, pictures), unless analytics was switched on.
// 5. Claims discipline: the pages of the evidence service carry no area figure other than the stated research
//    area, no percentage other than those quoted from the public record, and none of a list of phrases that
//    would promise more than the record supports.
// 6. Every document of the protocol concept carries its status note exactly once.
// 7. The sitemap lists files that exist, and robots.txt names the sitemap.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SRC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ROOT = path.resolve(SRC, "..");
const site = JSON.parse(fs.readFileSync(path.join(SRC, "site.json"), "utf8"));
const problems = [];
const fail = (where, what) => problems.push(`${where}: ${what}`);

// 1 --------------------------------------------------------------------------------------------------------
try {
  execFileSync(process.execPath, [path.join(SRC, "build.mjs"), "--check"], { stdio: "pipe" });
} catch (err) {
  fail("build", String(err.stdout || err.message).trim());
}

const LEGACY = ["activation-sequence.html", "audit.html", "bioclearing.html", "data-sovereignty.html", "implementation.html", "mint.html", "not-carbon.html", "risk.html", "terms.html", "protocol-home-2026-04.html"];
const htmlFiles = [];
(function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    if (name.startsWith("_") || name.startsWith(".") || name === "node_modules") continue;
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walk(full);
    else if (name.endsWith(".html")) htmlFiles.push(path.relative(ROOT, full).replace(/\\/g, "/"));
  }
})(ROOT);
const fresh = htmlFiles.filter((f) => !LEGACY.includes(f));
const read = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");
const text = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ");

// 2 --------------------------------------------------------------------------------------------------------
const titles = new Map();
for (const f of fresh) {
  const html = read(f);
  const h1 = html.match(/<h1[\s>]/g) ?? [];
  if (h1.length !== 1) fail(f, `${h1.length} main headlines`);
  const title = (html.match(/<title>([^<]*)<\/title>/) ?? [])[1] ?? "";
  if (title.length < 15 || title.length > 70) fail(f, `title of ${title.length} characters: ${title}`);
  if (titles.has(title)) fail(f, `same title as ${titles.get(title)}`);
  titles.set(title, f);
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) ?? [])[1] ?? "";
  const noindex = /<meta name="robots" content="noindex">/.test(html);
  if (!noindex && (desc.length < 70 || desc.length > 170)) fail(f, `description of ${desc.length} characters`);
  if (!noindex && !/<link rel="canonical" href="https:\/\/bccs\.bio\//.test(html)) fail(f, "no canonical address");
  for (const tag of ['property="og:title"', 'property="og:description"', 'property="og:image"', 'name="twitter:card" content="summary_large_image"', 'property="og:image:alt"']) if (!html.includes(tag)) fail(f, `no ${tag}`);
  if (!/<html lang="en-GB">/.test(html)) fail(f, "no language");
  if (!html.includes('<a class="skip" href="#main">')) fail(f, "no skip link");
}

// 3 and 4 --------------------------------------------------------------------------------------------------
const ids = new Map();
const idsOf = (f) => {
  if (!ids.has(f)) ids.set(f, new Set([...read(f).matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  return ids.get(f);
};
const allowedHosts = new Set(["observatory.bccs.bio", "kryonis.global", "basescan.org", "bccs.bio"]);
for (const f of fresh) {
  const html = read(f);
  for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const ref = m[1].replace(/&amp;/g, "&");
    if (ref.startsWith("mailto:") || ref.startsWith("data:")) continue;
    if (/^https?:/.test(ref)) {
      const u = new URL(ref);
      if (u.protocol !== "https:") fail(f, `not https: ${ref}`);
      const isLoad = m[0].trim().startsWith("src=") || /<link[^>]+rel="(stylesheet|preload|icon)"[^>]*$/.test(html.slice(0, m.index).split("\n").pop() ?? "");
      if (isLoad && site.analytics.provider === "none") fail(f, `loads from another host: ${ref}`);
      if (!isLoad && !allowedHosts.has(u.hostname)) fail(f, `links to a host that is not on the list: ${u.hostname}`);
      continue;
    }
    if (ref.startsWith("#")) {
      if (ref.length > 1 && !idsOf(f).has(ref.slice(1))) fail(f, `no element #${ref.slice(1)}`);
      continue;
    }
    if (!ref.startsWith("/")) {
      fail(f, `address is not rooted: ${ref}`);
      continue;
    }
    const u = new URL(ref, "https://bccs.bio");
    let target = decodeURIComponent(u.pathname).replace(/^\//, "");
    if (target === "" || target.endsWith("/")) target += "index.html";
    if (!fs.existsSync(path.join(ROOT, target))) fail(f, `no file ${u.pathname}`);
    else if (u.hash && target.endsWith(".html") && !idsOf(target).has(u.hash.slice(1))) fail(f, `no element ${u.hash} in ${target}`);
  }
  if (/<a [^>]*target="_blank"/.test(html)) fail(f, "a link opens a new window");
}

// 5 --------------------------------------------------------------------------------------------------------
const record = JSON.parse(fs.readFileSync(path.join(SRC, "data", "c01-public-record.json"), "utf8"));
const areaHa = Math.round(record.claim.area_m2_stated / 10000).toLocaleString("en-GB");
// Percentages that occur in the public record's own wording (rules, their details, the accuracy of the reference
// map as quoted in the programme record) and the share of a fee paid on confirmation.
const quoted = new Set(["87.4", "58.1", "60.6", "50"]);
for (const s of record.decision_steps) for (const m of `${s.rule} ${s.detail}`.matchAll(/(\d+(?:\.\d+)?)\s?%/g)) quoted.add(m[1]);
const NEVER = [
  /\b(?:we|is|are|a|fully) guaranteed?\b(?!, or)|\bguarantees\b/i,
  /\bcertified\b(?! archive)/i,
  /\bverified (?:mangrove|extent|area|carbon|forest)/i,
  /(?<!\bnot )(?<!\bnever )\bindependently (?:verified|validated|audited)\b/i,
  /\bpeer[- ]reviewed\b/i,
  /\btechnology readiness\b/i,
  /\bTRL\b/,
  /\bcarbon credits? (?:issued|generated|verified)\b/i,
  /\bour (?:clients|customers|partners)\b/i,
  /\btrusted by\b/i,
  /\bworld['’]s first\b/i,
  /\bofficial partner\b/i,
  /\bbasis points\b/i,
];
const PROTOCOL_WORDS = /\$BCCS|\bDePIN\b|\bstaking\b|\bslashing\b|\btokenomics\b/i;
for (const f of fresh) {
  if (f === "404.html") continue;
  const t = text(read(f).replace(/<footer class="site-foot">[\s\S]*$/, ""));
  for (const m of t.matchAll(/(\d[\d,.]*)\s?(ha|hectares?|km²|km2)\b/g)) if (m[1] !== areaHa) fail(f, `an area figure that is not the stated research area: ${m[0]}`);
  for (const m of t.matchAll(/(\d+(?:\.\d+)?)\s?%/g)) if (!quoted.has(m[1])) fail(f, `a percentage that is not quoted from the record: ${m[0]}`);
  for (const re of NEVER) {
    const m = re.exec(t);
    if (m) fail(f, `a phrase the claims discipline rules out: “${t.slice(Math.max(0, m.index - 40), m.index + 60).trim()}”`);
  }
  if (!["protocol.html", "privacy.html"].includes(f) && PROTOCOL_WORDS.test(t)) fail(f, `protocol vocabulary on a page of the evidence service: ${PROTOCOL_WORDS.exec(t)[0]}`);
}

// 6 --------------------------------------------------------------------------------------------------------
for (const f of LEGACY) {
  const html = read(f);
  const n = (html.match(/<!-- status-note:start/g) ?? []).length;
  if (n !== 1) fail(f, `${n} status notes`);
  if (!/No verification network is operating/.test(html)) fail(f, "the status note does not say that no network operates");
}

// 7 --------------------------------------------------------------------------------------------------------
const sitemap = read("sitemap.xml");
for (const m of sitemap.matchAll(/<loc>https:\/\/bccs\.bio(\/[^<]*)<\/loc>/g)) {
  let target = m[1].replace(/^\//, "");
  if (target === "" || target.endsWith("/")) target += "index.html";
  if (!fs.existsSync(path.join(ROOT, target))) fail("sitemap.xml", `lists ${m[1]}, which does not exist`);
}
for (const f of fresh) {
  if (/noindex/.test(read(f))) continue;
  const loc = "/" + (f === "index.html" ? "" : f.replace(/index\.html$/, ""));
  if (!sitemap.includes(`<loc>https://bccs.bio${loc}</loc>`)) fail("sitemap.xml", `does not list ${loc}`);
}
if (!/Sitemap: https:\/\/bccs\.bio\/sitemap\.xml/.test(read("robots.txt"))) fail("robots.txt", "does not name the sitemap");
for (const f of ["CNAME", "favicon.ico", "favicon.svg", "apple-touch-icon.png", "share-card.png", "404.html"]) if (!fs.existsSync(path.join(ROOT, f))) fail(f, "missing");
if (fs.readFileSync(path.join(ROOT, "CNAME"), "utf8").trim() !== "bccs.bio") fail("CNAME", "changed");

if (problems.length) {
  console.log(problems.map((p) => "FAIL  " + p).join("\n"));
  console.log(`\n${problems.length} problem(s)`);
  process.exit(1);
}
console.log(`ok: ${fresh.length} pages of the evidence service, ${LEGACY.length} documents of the protocol concept, links, addresses, claims discipline, sitemap`);
