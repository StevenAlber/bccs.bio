// Builds the site into the repository root, where GitHub Pages serves it from.
//
//   node _src/build.mjs            write the pages
//   node _src/build.mjs --check    write nothing; exit 1 if a generated file differs from what is on disk
//
// Sources are in _src/ (GitHub Pages does not serve directories whose name starts with an underscore):
//   site.json                      addresses, the contact address, the form service, analytics, prices
//   data/c01-public-record.json    the figures and wording quoted from the Observatory (tools/snapshot.mjs)
//   pages/**.mjs                   one module per page
//   assets/                        stylesheet, script, typefaces
//   legacy/                        the home page of April 2026, kept as it was
//
// The documents of the protocol concept (April 2026) stay at their addresses. The build only puts a status
// note into them, between two marker comments, so it can be run any number of times.
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { MARK, e, out, recordFacts } from "./lib.mjs";

const SRC = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SRC, "..");
const CHECK = process.argv.includes("--check");

const site = JSON.parse(fs.readFileSync(path.join(SRC, "site.json"), "utf8"));
const record = JSON.parse(fs.readFileSync(path.join(SRC, "data", "c01-public-record.json"), "utf8"));
const facts = recordFacts(record);

const written = new Map();
const put = (rel, content) => written.set(rel, Buffer.isBuffer(content) ? content : Buffer.from(content, "utf8"));

// ---- assets ---------------------------------------------------------------------------------------------
const hash = (buf) => crypto.createHash("sha256").update(buf).digest("hex").slice(0, 10);
const css = fs.readFileSync(path.join(SRC, "assets", "site.css"));
const js = fs.readFileSync(path.join(SRC, "assets", "site.js"));
put("assets/site.css", css);
put("assets/site.js", js);
for (const f of fs.readdirSync(path.join(SRC, "assets", "fonts"))) put(`assets/fonts/${f}`, fs.readFileSync(path.join(SRC, "assets", "fonts", f)));
for (const f of fs.existsSync(path.join(SRC, "assets", "img")) ? fs.readdirSync(path.join(SRC, "assets", "img")) : []) put(`assets/img/${f}`, fs.readFileSync(path.join(SRC, "assets", "img", f)));
// Files that must sit at the root: icons and the picture of a link preview.
for (const f of fs.existsSync(path.join(SRC, "assets", "root")) ? fs.readdirSync(path.join(SRC, "assets", "root")) : []) put(f, fs.readFileSync(path.join(SRC, "assets", "root", f)));
const CSS_URL = `/assets/site.css?v=${hash(css)}`;
const JS_URL = `/assets/site.js?v=${hash(js)}`;
const shareCard = written.get("share-card.png");
const SHARE_URL = shareCard ? `${site.origin}/share-card.png?v=${hash(shareCard)}` : null;

// ---- layout ---------------------------------------------------------------------------------------------
const NAV = [
  ["observatory", "/observatory.html", "Live record"],
  ["services", "/services.html", "Services and prices"],
  ["method", "/method.html", "Method and limits"],
  ["use-cases", "/use-cases.html", "Who it is for"],
  ["insights", "/insights/", "Notes"],
  ["company", "/company.html", "Company"],
];

function analytics() {
  const a = site.analytics;
  if (a.provider === "none" || !a.token) return "";
  if (a.provider === "cloudflare") return `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token":"${e(a.token)}"}'></script>`;
  if (a.provider === "plausible") return `<script defer data-domain="${e(a.token)}" src="https://plausible.io/js/script.outbound-links.js"></script>`;
  if (a.provider === "goatcounter") return `<script data-goatcounter="${e(a.token)}" async src="${e(new URL("/count.js", a.token).href)}"></script>`;
  throw new Error(`unknown analytics provider: ${a.provider}`);
}

function layout(page) {
  const url = `${site.origin}${page.path === "index.html" ? "/" : "/" + page.path.replace(/index\.html$/, "")}`;
  const title = page.path === "index.html" ? page.title : `${page.title} · ${site.name}`;
  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${site.origin}/#organisation`,
      name: site.name,
      legalName: site.company.legal_name,
      url: `${site.origin}/`,
      logo: `${site.origin}/apple-touch-icon.png`,
      email: site.contact.email,
      description: "Re-runnable satellite evidence records for mangrove and coastal ecosystem claims.",
      parentOrganization: { "@type": "Organization", name: site.company.legal_name, url: `${site.company.parent_site}/` },
      sameAs: [`${site.observatory}/`, `${site.company.parent_site}/`],
    },
    ...(page.ld ?? []),
  ];
  const meta = [
    `<meta charset="utf-8">`,
    `<meta name="viewport" content="width=device-width, initial-scale=1">`,
    `<title>${e(title)}</title>`,
    `<meta name="description" content="${e(page.description)}">`,
    page.noindex ? `<meta name="robots" content="noindex">` : `<link rel="canonical" href="${e(url)}">`,
    `<meta name="color-scheme" content="light">`,
    `<meta name="theme-color" content="#0f2d2a">`,
    site.verification.google ? `<meta name="google-site-verification" content="${e(site.verification.google)}">` : "",
    site.verification.bing ? `<meta name="msvalidate.01" content="${e(site.verification.bing)}">` : "",
    `<meta property="og:type" content="${page.article ? "article" : "website"}">`,
    `<meta property="og:site_name" content="${e(site.name)}">`,
    `<meta property="og:locale" content="en_GB">`,
    `<meta property="og:title" content="${e(page.share_title ?? page.title)}">`,
    `<meta property="og:description" content="${e(page.description)}">`,
    `<meta property="og:url" content="${e(url)}">`,
    SHARE_URL ? `<meta property="og:image" content="${e(SHARE_URL)}">\n<meta property="og:image:type" content="image/png">\n<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">\n<meta property="og:image:alt" content="${e(SHARE_ALT)}">` : "",
    `<meta name="twitter:card" content="${SHARE_URL ? "summary_large_image" : "summary"}">`,
    `<meta name="twitter:title" content="${e(page.share_title ?? page.title)}">`,
    `<meta name="twitter:description" content="${e(page.description)}">`,
    SHARE_URL ? `<meta name="twitter:image" content="${e(SHARE_URL)}">\n<meta name="twitter:image:alt" content="${e(SHARE_ALT)}">` : "",
    `<link rel="icon" href="/favicon.ico" sizes="32x32">`,
    `<link rel="icon" href="/favicon.svg" type="image/svg+xml">`,
    `<link rel="apple-touch-icon" href="/apple-touch-icon.png">`,
    `<link rel="preload" href="/assets/fonts/fraunces-latin-opsz-normal.woff2" as="font" type="font/woff2" crossorigin>`,
    // Before the stylesheet, so that a narrow window never shows the open menu and then closes it.
    `<script>document.documentElement.className="js"</script>`,
    `<link rel="stylesheet" href="${CSS_URL}">`,
    `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, "\\u003c")}</script>`,
  ]
    .filter(Boolean)
    .join("\n");

  const nav = NAV.map(([key, href, label]) => `<li><a href="${href}"${page.nav === key ? ' aria-current="page"' : ""}>${e(label)}</a></li>`).join("");

  return `<!doctype html>
<html lang="${e(site.language)}">
<head>
${meta}
</head>
<body${page.body_class ? ` class="${e(page.body_class)}"` : ""}>
<a class="skip" href="#main">Skip to content</a>
<header class="site-head">
  <div class="wrap site-head__in">
    <a class="brand" href="/"${page.path === "index.html" ? ' aria-current="page"' : ""}>${MARK}<span class="brand__name">BCCS</span><span class="brand__what">Evidence services</span></a>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="site-nav"><span class="menu-btn__bars" aria-hidden="true"></span><span class="menu-btn__label">Menu</span></button>
    <nav id="site-nav" class="site-nav" aria-label="Main">
      <ul>${nav}</ul>
      <a class="btn btn--small" href="/contact.html"${page.nav === "contact" ? ' aria-current="page"' : ""}>Request a proposal</a>
    </nav>
  </div>
</header>
<main id="main" tabindex="-1">
${page.body}
</main>
<footer class="site-foot">
  <div class="wrap site-foot__in">
    <div class="site-foot__who">
      <p class="site-foot__brand">${MARK}<span>BCCS</span></p>
      <p>Evidence records for coastal ecosystem claims: fixed before the data is opened, stored with their digests, re-runnable, and able to refuse.</p>
      <p>${e(site.company.legal_name)}, ${e(site.company.place)}.<br><a href="mailto:${e(site.contact.email)}">${e(site.contact.email)}</a></p>
    </div>
    <nav aria-label="Evidence services">
      <h2>Evidence services</h2>
      <ul>
        <li><a href="/observatory.html">The live record</a></li>
        <li><a href="/services.html">Services and prices</a></li>
        <li><a href="/method.html">Method and limits</a></li>
        <li><a href="/use-cases.html">Who it is for</a></li>
        <li><a href="/evidence-readiness-checklist.html">Evidence readiness checklist</a></li>
        <li><a href="/contact.html">Request a proposal</a></li>
      </ul>
    </nav>
    <nav aria-label="Reading">
      <h2>Reading</h2>
      <ul>
        <li><a href="/insights/">Notes</a></li>
        <li>${out(`${site.observatory}/`, "BCCS Evidence Observatory")}</li>
        <li><a href="/protocol.html">Protocol research (concept)</a></li>
        <li>${out(`${site.company.parent_site}/`, "KRYONIS")}</li>
      </ul>
    </nav>
    <nav aria-label="Company">
      <h2>Company</h2>
      <ul>
        <li><a href="/company.html">Who does the work</a></li>
        <li><a href="/company.html#review">Review this work</a></li>
        <li><a href="/privacy.html">Privacy</a></li>
        <li><a href="/terms.html">Protocol terms</a></li>
        <li><a href="/risk.html">Protocol risk disclosure</a></li>
      </ul>
    </nav>
  </div>
  <div class="wrap site-foot__base">
    <p>An evidence record is not a certificate, a carbon credit, a verification under any standard or independent scientific validation. <a href="/method.html#words">What the words mean</a>.</p>
    <p>© 2026 ${e(site.company.legal_name)} · Page updated ${e(page.updated ?? site.updated)}</p>
  </div>
</footer>
<script defer src="${JS_URL}"></script>
${analytics()}
</body>
</html>
`;
}

const SHARE_ALT = "BCCS. Evidence for coastal ecosystem claims that a third party can re-run, and that refuses when it should.";

// ---- pages ----------------------------------------------------------------------------------------------
const pagesDir = path.join(SRC, "pages");
const modules = [];
(function walk(dir) {
  for (const name of fs.readdirSync(dir).sort()) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walk(full);
    else if (name.endsWith(".mjs")) modules.push(full);
  }
})(pagesDir);

const ctx = { site, record, facts, obs: (p = "") => `${site.observatory}/${p}` };
const pages = [];
for (const file of modules) {
  const mod = await import(pathToFileURL(file).href);
  const page = mod.default(ctx);
  for (const key of ["path", "title", "description", "body"]) if (!page[key]) throw new Error(`${path.relative(SRC, file)}: no ${key}`);
  pages.push(page);
  put(page.path, layout(page));
}

// ---- the protocol concept: the documents stay, each says what it is ---------------------------------------
const LEGACY = ["activation-sequence.html", "audit.html", "bioclearing.html", "data-sovereignty.html", "implementation.html", "mint.html", "not-carbon.html", "risk.html", "terms.html"];
const OPEN = "<!-- status-note:start (written by _src/build.mjs) -->";
const CLOSE = "<!-- status-note:end -->";
const statusNote = (file) => {
  const sale = file === "mint.html" || file === "protocol-home-2026-04.html";
  return `${OPEN}
<style>
.bccs-status{position:fixed;left:0;right:0;bottom:0;z-index:2147483000;background:#fff3d1;color:#3d2a00;border-top:2px solid #e3c36d;font:500 14px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;padding:10px 16px;box-shadow:0 -6px 20px rgba(0,0,0,.25)}
.bccs-status p{margin:0 auto;max-width:1100px}
.bccs-status strong{font-weight:700}
.bccs-status a{color:#3d2a00;text-decoration:underline;text-underline-offset:2px;font-weight:600;white-space:nowrap}
body{padding-bottom:96px}
@media (max-width:640px){.bccs-status{font-size:13px;padding:9px 12px}body{padding-bottom:150px}}
@media print{.bccs-status{position:static}}
</style>
<aside class="bccs-status" role="note" aria-label="Status of this page">
<p><strong>Protocol concept, April 2026.</strong> This page describes a design. No verification network is operating and no asset has been verified through it.${sale ? " A licence gives no income and no refund." : ""} <a href="/protocol.html">Status of every part</a> · <a href="/">What works today</a></p>
</aside>
${CLOSE}`;
};
const withNote = (html, file) => {
  const stripped = html.replace(new RegExp(`${OPEN.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[\\s\\S]*?${CLOSE}\\n?`), "");
  const at = stripped.search(/<body[^>]*>/i);
  if (at < 0) throw new Error(`${file}: no <body>`);
  const end = at + stripped.slice(at).match(/<body[^>]*>/i)[0].length;
  return `${stripped.slice(0, end)}\n${statusNote(file)}\n${stripped.slice(end).replace(/^\n/, "")}`;
};
for (const file of LEGACY) put(file, withNote(fs.readFileSync(path.join(ROOT, file), "utf8"), file));
// The home page of April 2026, byte for byte apart from the note and a canonical address of its own.
{
  const old = fs.readFileSync(path.join(SRC, "legacy", "index-2026-04-24.html"), "utf8");
  const moved = old
    .replace('<meta property="og:url" content="https://bccs.bio">', '<meta property="og:url" content="https://bccs.bio/protocol-home-2026-04.html">\n<link rel="canonical" href="https://bccs.bio/protocol-home-2026-04.html">')
    .replace('<a href="#" class="nav-logo">BCCS</a>', '<a href="/" class="nav-logo">BCCS</a>');
  if (moved === old) throw new Error("the April home page no longer matches what the build expects");
  put("protocol-home-2026-04.html", withNote(moved, "protocol-home-2026-04.html"));
}

// ---- files for crawlers -------------------------------------------------------------------------------
const listed = [
  ...pages.filter((p) => !p.noindex).map((p) => [p.path === "index.html" ? "/" : "/" + p.path.replace(/index\.html$/, ""), p.updated ?? site.updated, p.priority ?? "0.7"]),
  ...LEGACY.filter((f) => f !== "mint.html").map((f) => ["/" + f, "2026-04-24", "0.2"]),
  ["/protocol-home-2026-04.html", "2026-04-24", "0.2"],
];
put(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${listed
    .map(([loc, mod, pri]) => `  <url><loc>${site.origin}${loc}</loc><lastmod>${mod}</lastmod><priority>${pri}</priority></url>`)
    .join("\n")}\n</urlset>\n`,
);
put("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${site.origin}/sitemap.xml\n`);

// ---- write or compare ------------------------------------------------------------------------------------
let changed = 0;
for (const [rel, buf] of written) {
  const file = path.join(ROOT, rel);
  const same = fs.existsSync(file) && fs.readFileSync(file).equals(buf);
  if (same) continue;
  changed++;
  if (CHECK) console.log(`differs: ${rel}`);
  else {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, buf);
  }
}
if (CHECK && changed) {
  console.log(`${changed} generated file(s) differ from the sources. Run: node _src/build.mjs`);
  process.exit(1);
}
console.log(CHECK ? `up to date: ${written.size} files` : `built ${written.size} files (${changed} written), record read ${record.retrieved}`);
