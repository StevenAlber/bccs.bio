import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { e, pageHead } from "../lib.mjs";

// The policy of April 2026 for licence applications is kept word for word, as part B of this page.
const legacy = fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "legacy", "privacy-2026-04.html"), "utf8");
const clauses = [...legacy.matchAll(/<h2>([^<]+)<\/h2>\s*<p>([\s\S]*?)<\/p>/g)].map((m) => [m[1].trim(), m[2].trim()]);
if (clauses.length !== 13) throw new Error(`expected the 13 clauses of the April 2026 policy, found ${clauses.length}`);

export default (ctx) => {
  const { site } = ctx;
  const a = site.analytics;
  const counting =
    a.provider === "none" || !a.token
      ? `<p>This site sets no cookies and loads nothing from a third party: no analytics, no fonts, no advertising or social-media code. The hosting provider, GitHub, receives the technical data of every request, including the IP address, as any web host does.</p>`
      : a.provider === "cloudflare"
        ? `<p>This site sets no cookies. Visits are counted with Cloudflare Web Analytics, which loads a small script from Cloudflare and records the page, the referring site, the browser type and the country, without a cookie and without a profile of the visitor. The hosting provider, GitHub, receives the technical data of every request, including the IP address, as any web host does.</p>`
        : a.provider === "plausible"
          ? `<p>This site sets no cookies. Visits are counted with Plausible Analytics, which loads a small script from plausible.io and records the page, the referring site, the browser type and the country, without a cookie and without a profile of the visitor. The hosting provider, GitHub, receives the technical data of every request, including the IP address, as any web host does.</p>`
          : `<p>This site sets no cookies. Visits are counted with GoatCounter on a server we run, which records the page, the referring site, the browser type and the country, without a cookie and without a profile of the visitor. The hosting provider, GitHub, receives the technical data of every request, including the IP address, as any web host does.</p>`;
  const form = site.form.endpoint
    ? `<p>The request form sends what you enter to a form service operated for KRYONIS, which forwards it to ${e(site.contact.email)}. If that service does not confirm receipt, the page shows your request as text for you to send by email instead.</p>`
    : `<p>The request form does not transmit anything. It turns your answers into the text of an email in your own mail program, addressed to ${e(site.contact.email)}. We receive what you choose to send, when you send it.</p>`;
  return {
    path: "privacy.html",
    nav: "privacy",
    priority: "0.2",
    title: "Privacy notice",
    description: "What this site records about a visitor, what happens to a request you send, how long it is kept and how to have it removed.",
    body: `
${pageHead({
  crumbs: [["BCCS", "/"], ["Privacy"]],
  eyebrow: "Privacy",
  title: "What is recorded, and what happens to a request",
  lead: `${e(site.company.legal_name)}, incorporated in ${e(site.company.place)}, is responsible for personal data handled through this site. Part A covers the site and requests for evidence services. Part B is the policy of April 2026 for licence applications under the protocol concept, unchanged.`,
})}

<section class="band">
  <div class="wrap prose">
    <h2 id="a">A. This site and requests for evidence services</h2>
    <h3>Visiting</h3>
    ${counting}
    <p>The readiness checklist keeps your answers in your own browser. They leave it only if you choose to add them to a request.</p>
    <h3>Sending a request</h3>
    ${form}
    <p>A request contains what you put in it: your name, email address, organisation, and what you write about your site and claim. Do not include material you are not entitled to share.</p>
    <h3>What it is used for</h3>
    <p>To answer you, to prepare a scope if you ask for one, and, if you confirm an engagement, to carry it out and invoice it. It is not used for marketing and is not passed to anyone else, except where the law requires it.</p>
    <h3>How long it is kept</h3>
    <p>Correspondence that does not lead to an engagement is deleted within twelve months of the last message. Records of an engagement are kept for as long as accounting and contract law require.</p>
    <h3>Your rights</h3>
    <p>You can ask what is held about you, have it corrected, or have it deleted, by writing to <a href="mailto:${e(site.contact.email)}">${e(site.contact.email)}</a>. If you are in the European Union or the United Kingdom, you also have the right to complain to your data-protection authority.</p>
    <h3>Material you supply for an engagement</h3>
    <p>Data, maps and documents sent for a review or an evidence check are handled under the written scope of that engagement. They stay private unless you release them in writing.</p>

    <h2 id="b">B. Licence applications under the protocol concept (policy of April 2026)</h2>
    <p class="muted small">This part applies only to the application form on <a href="/protocol-home-2026-04.html">the April 2026 home page</a> and to interactions with the contracts described on the <a href="/protocol.html">protocol research</a> page. Its text has not been changed.</p>
    ${clauses.map(([h, p]) => `<h3>${h}</h3>\n    <p>${p}</p>`).join("\n    ")}

    <p class="small muted">Part A last updated ${e(site.updated)}.</p>
  </div>
</section>
`,
  };
};
