// Checks the built site in a browser (Chromium through Playwright). Exit status 1 when a check fails.
//
//   node _src/tools/browser-check.mjs
//   AXE=/path/to/axe-core/axe.min.js node _src/tools/browser-check.mjs     also runs the accessibility rules
//
// It serves the repository root itself, the way GitHub Pages does, and looks at every page at eight widths from
// 320 to 1440 pixels: nothing may be wider than the window, the main headline must be on the first screen, no
// request may fail or go to another host, and the console must stay silent. It then uses the menu, the request
// form (both ways of sending, with the form service played by the test) and the checklist as a visitor would.
import fs from "node:fs";
import http from "node:http";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const { chromium } = createRequire(import.meta.url)("playwright");
const site = JSON.parse(fs.readFileSync(path.join(ROOT, "_src", "site.json"), "utf8"));
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".jpeg": "image/jpeg", ".ico": "image/x-icon", ".woff2": "font/woff2", ".xml": "application/xml", ".txt": "text/plain; charset=utf-8", ".pdf": "application/pdf" };
const server = http.createServer((req, res) => {
  let rel = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (rel.endsWith("/")) rel += "index.html";
  let file = path.join(ROOT, rel);
  let status = 200;
  if (!file.startsWith(ROOT) || rel.split("/").some((s) => s.startsWith("_") || s.startsWith(".")) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    status = 404;
    file = path.join(ROOT, "404.html");
  }
  res.writeHead(status, { "content-type": TYPES[path.extname(file)] ?? "application/octet-stream", "cache-control": "no-store" });
  res.end(fs.readFileSync(file));
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const origin = `http://127.0.0.1:${server.address().port}`;

const FRESH = ["", "observatory.html", "services.html", "method.html", "use-cases.html", "company.html", "protocol.html", "contact.html", "privacy.html", "evidence-readiness-checklist.html", "insights/", "insights/what-a-refusal-looks-like.html", "insights/integrity-is-not-validity.html", "no-such-page.html"];
const LEGACY = ["protocol-home-2026-04.html", "mint.html", "not-carbon.html", "terms.html"];
const WIDTHS = [320, 360, 390, 430, 768, 1024, 1280, 1440];
const problems = [];
let checks = 0;
const ok = (cond, what) => {
  checks++;
  if (!cond) problems.push(what);
};

const browser = await chromium.launch();
const watch = (page, label, allowHosts = []) => {
  const seen = [];
  page.on("console", (m) => m.type() === "error" && !/Failed to load resource.*404/.test(m.text()) && seen.push(`console: ${m.text()}`));
  page.on("pageerror", (e) => seen.push(`script error: ${e.message}`));
  page.on("requestfailed", (r) => seen.push(`request failed: ${r.url()}`));
  page.on("request", (r) => {
    const u = new URL(r.url());
    if (u.origin !== origin && u.protocol !== "data:" && !allowHosts.includes(u.hostname)) seen.push(`request to another host: ${r.url()}`);
  });
  return () => {
    for (const s of seen.splice(0)) problems.push(`${label}: ${s}`);
  };
};

try {
  // ---- every page at every width ---------------------------------------------------------------------------
  for (const width of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width, height: 800 } });
    const page = await ctx.newPage();
    // The documents of April 2026 ask Google for their typefaces; that is theirs, and is not judged here.
    await ctx.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.fulfill({ status: 200, contentType: "text/css", body: "" }));
    const flush = watch(page, `${width}px`, ["fonts.googleapis.com", "fonts.gstatic.com"]);
    for (const p of [...FRESH, ...LEGACY]) {
      const res = await page.goto(`${origin}/${p}`, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      const fresh = FRESH.includes(p);
      const label = `${width}px /${p}`;
      ok(p === "no-such-page.html" ? res.status() === 404 : res.status() === 200, `${label}: status ${res.status()}`);
      const m = await page.evaluate(() => {
        const de = document.documentElement;
        const clipped = [...document.querySelectorAll(".stats dd, .badge, .record__facts dd, .table td, .table th, .btn, .price__amount, .site-nav a, .card h3, h1, h2")]
          // Text that is hidden from sight on purpose (headings for screen readers, table heads on a phone) is 1px wide.
          .filter((el) => el.offsetParent !== null && el.getBoundingClientRect().width > 4 && !el.closest(".sr") && el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).display !== "inline")
          .map((el) => `${el.tagName.toLowerCase()}.${el.className} “${el.textContent.trim().slice(0, 30)}”`);
        const h1 = document.querySelector("h1");
        return { scrollW: de.scrollWidth, clientW: de.clientWidth, clipped, h1Top: h1 ? h1.getBoundingClientRect().top : null, h1Count: document.querySelectorAll("h1").length };
      });
      if (fresh) {
        ok(m.scrollW <= m.clientW, `${label}: the page is ${m.scrollW}px wide in a ${m.clientW}px window`);
        ok(m.clipped.length === 0, `${label}: text does not fit: ${m.clipped.slice(0, 3).join(", ")}`);
        ok(m.h1Count === 1 && m.h1Top < 800, `${label}: the main headline is at ${Math.round(m.h1Top)}px`);
      } else {
        const note = await page.evaluate(() => {
          const el = document.querySelector(".bccs-status");
          if (!el) return null;
          const r = el.getBoundingClientRect();
          // In page coordinates: where the last piece of content ends, and where the note's top edge lies once
          // the page is scrolled to its end.
          const last = [...document.body.children].filter((c) => c !== el && c.tagName !== "SCRIPT" && c.tagName !== "STYLE" && c.getBoundingClientRect().height > 0).pop();
          const lastBottom = last ? last.getBoundingClientRect().bottom + scrollY : 0;
          return { top: r.top, bottom: r.bottom, height: r.height, win: innerHeight, lastBottom, noteTopAtEnd: document.documentElement.scrollHeight - r.height, text: el.textContent };
        });
        ok(note && note.bottom <= note.win + 1 && note.top > note.win / 2, `${label}: the status note is not at the foot of the window`);
        ok(note && /No verification network is operating/.test(note.text), `${label}: the status note does not say that no network operates`);
        ok(note && note.lastBottom <= note.noteTopAtEnd + 1, `${label}: the status note covers the end of the page (${Math.round(note?.lastBottom)} > ${Math.round(note?.noteTopAtEnd)})`);
      }
      flush();
    }
    await ctx.close();
  }

  // ---- menu -------------------------------------------------------------------------------------------------
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 800 } });
    const page = await ctx.newPage();
    const flush = watch(page, "menu");
    await page.goto(`${origin}/services.html`, { waitUntil: "networkidle" });
    ok(await page.locator(".menu-btn").isVisible(), "menu: no menu button on a phone");
    ok(!(await page.locator("#site-nav").isVisible()), "menu: the menu is open before it is asked for");
    await page.locator(".menu-btn").click();
    ok(await page.locator("#site-nav").isVisible(), "menu: the button does not open the menu");
    ok((await page.locator(".menu-btn").getAttribute("aria-expanded")) === "true", "menu: aria-expanded is not true when open");
    ok((await page.locator('#site-nav a[aria-current="page"]').textContent()) === "Services and prices", "menu: the current page is not marked");
    await page.keyboard.press("Escape");
    ok(!(await page.locator("#site-nav").isVisible()), "menu: Escape does not close the menu");
    await page.setViewportSize({ width: 1280, height: 800 });
    ok((await page.locator("#site-nav").isVisible()) && !(await page.locator(".menu-btn").isVisible()), "menu: wide window does not show the navigation in line");
    await page.goto(`${origin}/method.html`, { waitUntil: "networkidle" });
    await page.keyboard.press("Tab");
    ok(await page.evaluate(() => document.activeElement?.classList.contains("skip")), "keyboard: the first stop is not the skip link");
    await page.keyboard.press("Enter");
    ok(await page.evaluate(() => document.activeElement?.id === "main" || location.hash === "#main"), "keyboard: the skip link does not lead to the content");
    flush();
    await ctx.close();
    // Without scripts the navigation is simply there.
    const plain = await browser.newContext({ viewport: { width: 390, height: 800 }, javaScriptEnabled: false });
    const p2 = await plain.newPage();
    await p2.goto(`${origin}/services.html`);
    ok(await p2.locator("#site-nav").isVisible(), "no scripts: the navigation is hidden");
    ok((await p2.locator("main h1").count()) === 1 && (await p2.locator(".service").count()) === 4, "no scripts: the page content is missing");
    await plain.close();
  }

  // ---- the request form ---------------------------------------------------------------------------------------
  const fill = async (page) => {
    await page.fill("#f-name", "Test Person");
    await page.fill("#f-email", "test.person@example.org");
    await page.fill("#f-institution", "Example Programme");
    await page.selectOption("#f-need", "site-check");
    await page.fill("#f-message", "A 900 ha coastal area. The claim is the canopy extent in the dry season of 2024; the result feeds a milestone payment.");
  };
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 800 } });
    const page = await ctx.newPage();
    const flush = watch(page, "form");
    await page.goto(`${origin}/contact.html?need=review`, { waitUntil: "networkidle" });
    ok((await page.inputValue("#f-need")) === "review", "form: the request named in the address is not selected");
    await page.locator('button[type="submit"]').click();
    ok((await page.locator('.field .error:not(:empty)').count()) === 4, "form: an empty form does not name its four missing answers");
    ok(await page.evaluate(() => document.activeElement?.id === "f-name"), "form: the first missing answer does not get the focus");
    await fill(page);
    await page.fill("#f-email", "not-an-address");
    await page.locator('button[type="submit"]').click();
    ok((await page.locator("#f-email-error").textContent()).length > 0, "form: a wrong email address is accepted");
    await page.fill("#f-email", "test.person@example.org");
    await page.fill("#f-website", "http://spam.example");
    await page.waitForTimeout(3100);
    await page.locator('button[type="submit"]').click();
    ok(/did not go through/.test(await page.locator("#enquiry-status").textContent()), "form: the hidden field does not stop a robot");
    ok((await page.locator("#enquiry-status a[data-open]").count()) === 0, "form: a robot is offered the email text");
    await page.fill("#f-website", "");
    await page.locator('button[type="submit"]').click();
    if (!site.form.endpoint) {
      const href = await page.locator("#enquiry-status a[data-open]").getAttribute("href");
      ok(href && href.startsWith(`mailto:${site.contact.email}?subject=`) && href.includes("body="), "form: no email is prepared");
      const pre = await page.locator("#enquiry-status pre").textContent();
      ok(/Example Programme/.test(pre) && /milestone payment/.test(pre) && /Site evidence check/.test(pre) && pre.includes(`To: ${site.contact.email}`), "form: the prepared text lacks the answers");
      ok(/has not been sent yet/.test(await page.locator("#enquiry-status").textContent()), "form: it does not say that nothing was sent");
      ok(await page.evaluate(() => document.activeElement?.classList.contains("draft")), "form: the prepared text does not get the focus");
    }
    flush();
    await ctx.close();
  }
  // The same form with a form service configured: the test plays the service.
  for (const works of [true, false]) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();
    let received = null;
    await ctx.route(`${origin}/contact.html`, async (route) => {
      const res = await route.fetch();
      route.fulfill({ response: res, body: (await res.text()).replace(/data-endpoint="[^"]*"/, 'data-endpoint="https://forms.test/submit"') });
    });
    await ctx.route("https://forms.test/submit", (route) => {
      received = JSON.parse(route.request().postData());
      route.fulfill({ status: works ? 200 : 500, contentType: "application/json", headers: { "access-control-allow-origin": "*" }, body: JSON.stringify({ ok: works }) });
    });
    await page.goto(`${origin}/contact.html`, { waitUntil: "networkidle" });
    await fill(page);
    await page.waitForTimeout(3100);
    await page.locator('button[type="submit"]').click();
    await page.waitForFunction(() => document.getElementById("enquiry-status").textContent.length > 10);
    const said = await page.locator("#enquiry-status").textContent();
    ok(received && received.form === "bccs-enquiry" && received.email === "test.person@example.org" && received.need === "site-check" && !("website" in received), `form service (${works ? "working" : "failing"}): the service did not receive the request`);
    if (works) {
      ok(/Received\./.test(said) && (await page.inputValue("#f-name")) === "", "form service: no acknowledgement after a confirmed delivery");
    } else {
      ok(/did not confirm receipt/.test(said) && (await page.locator("#enquiry-status a[data-open]").count()) === 1, "form service: a failed delivery is not turned into an email to send");
      ok((await page.inputValue("#f-name")) === "Test Person", "form service: the answers are lost after a failed delivery");
    }
    await ctx.close();
  }

  // ---- the checklist --------------------------------------------------------------------------------------------
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 800 } });
    const page = await ctx.newPage();
    const flush = watch(page, "checklist");
    await page.goto(`${origin}/evidence-readiness-checklist.html`, { waitUntil: "networkidle" });
    ok((await page.locator("[data-item]").count()) === 12, "checklist: not twelve points");
    for (const [q, v] of [["q1", "yes"], ["q2", "yes"], ["q3", "no"], ["q7", "partly"]]) await page.locator(`input[name="${q}"][value="${v}"]`).check({ force: true });
    await page.locator('form[data-checklist] button[type="submit"]').click();
    const summary = await page.locator("#checklist-result").textContent();
    ok(/2 of 12 points are in place/.test(summary) && /Not answered \(8\)/.test(summary) && /Not in place \(1\)/.test(summary) && /Partly in place \(1\)/.test(summary), "checklist: the summary does not count the answers");
    ok(/not an assessment/.test(summary), "checklist: the summary does not say what it is");
    await page.locator("#checklist-send").click();
    await page.waitForURL(/contact\.html/);
    const msg = await page.inputValue("#f-message");
    ok(/Evidence readiness checklist/.test(msg) && /Not in place:/.test(msg) && (await page.inputValue("#f-need")) === "review", "checklist: the summary does not arrive in the request");
    flush();
    await ctx.close();
  }

  // ---- accessibility rules ----------------------------------------------------------------------------------
  if (process.env.AXE) {
    const axe = fs.readFileSync(process.env.AXE, "utf8");
    for (const width of [390, 1280]) {
      const ctx = await browser.newContext({ viewport: { width, height: 800 } });
      const page = await ctx.newPage();
      for (const p of FRESH.filter((x) => x !== "no-such-page.html")) {
        await page.goto(`${origin}/${p}`, { waitUntil: "networkidle" });
        await page.evaluate(() => document.fonts.ready);
        if (width === 390 && p === "") await page.locator(".menu-btn").click();
        await page.addScriptTag({ content: axe });
        const res = await page.evaluate(() => window.axe.run(document, { runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"] }));
        ok(res.violations.length === 0, `accessibility ${width}px /${p}: ${res.violations.map((v) => `${v.id} (${v.impact}, ${v.nodes.length}): ${v.nodes[0].target.join(" ")}`).join("; ")}`);
      }
      await ctx.close();
    }
  }
} finally {
  await browser.close();
  server.close();
}

if (problems.length) {
  console.log(problems.map((p) => "FAIL  " + p).join("\n"));
  console.log(`\n${problems.length} of ${checks} checks failed`);
  process.exit(1);
}
console.log(`ok: ${checks} checks${process.env.AXE ? ", accessibility rules included" : " (accessibility rules not run: set AXE)"}`);
