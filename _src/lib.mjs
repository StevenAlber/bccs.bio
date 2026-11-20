// Helpers and shared pieces of the pages. No dependency: plain Node.

export const e = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** "2026-11-14T17:46:36Z" or "2026-11-14 03:52 UTC" -> "14 November 2026" */
export const day = (iso) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso));
  if (!m) throw new Error(`not a date: ${iso}`);
  return `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]}`;
};

export const int = (n) => Number(n).toLocaleString("en-GB");

/** INSUFFICIENT_EVIDENCE -> INSUFFICIENT EVIDENCE */
export const words = (code) => String(code).replace(/_/g, " ");

export const MARK = `<svg class="mark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" aria-hidden="true" focusable="false"><rect width="32" height="32" rx="6" fill="#0f2d2a"/><path d="M7 21.5c3.2-5.5 6.1-8.2 9-8.2s5.8 2.7 9 8.2" fill="none" stroke="#9be2bd" stroke-width="2.2" stroke-linecap="round"/><path d="M11 21.5c1.7-2.6 3.3-3.9 5-3.9s3.3 1.3 5 3.9" fill="none" stroke="#bb8657" stroke-width="2.2" stroke-linecap="round"/><circle cx="16" cy="9.2" r="1.8" fill="#9be2bd"/></svg>`;

const ARROW_OUT = `<svg class="ico" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false"><path d="M6 3h7v7M13 3 4 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const ARROW = `<svg class="ico" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false"><path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

/** A link that leaves the site says so to a screen reader and shows it with a small arrow. */
export const out = (href, label, cls = "") =>
  `<a${cls ? ` class="${cls}"` : ""} href="${e(href)}" rel="noopener">${label}${ARROW_OUT}<span class="sr"> (opens ${e(new URL(href).hostname)})</span></a>`;

export const more = (href, label, cls = "") => `<a${cls ? ` class="${cls}"` : ""} href="${e(href)}">${label}${ARROW}</a>`;

export const eyebrow = (text) => `<p class="eyebrow">${e(text)}</p>`;

const TONE = { SUPPORTED: "ok", CONFLICTING: "conflict", INSUFFICIENT_EVIDENCE: "refuse", PASS: "ok", NOT_RUN: "pending", NOT_REVIEWED: "pending", SUCCEEDED: "ok" };
export const badge = (code, label) => `<span class="badge badge--${TONE[code] ?? "pending"}">${e(label ?? words(code))}</span>`;

/** The figures of the public record, as words the pages share. */
export function recordFacts(record) {
  const r = record;
  const passed = r.replay.filter((x) => x.status === "PASS").length;
  const independent = r.replay.filter((x) => x.independent).length;
  return {
    retrieved_day: day(r.retrieved),
    retrieved: r.retrieved,
    approved_day: day(r.publication.approved_at),
    measured_day: day(r.claim.record_as_of),
    epoch: `${day(r.claim.epoch.start)} to ${day(r.claim.epoch.end)}`,
    area_ha: int(Math.round(r.claim.area_m2_stated / 10000)),
    scenes_total: int(r.inputs.scenes_total),
    scenes_admitted: int(r.inputs.scenes_admitted),
    acquisitions: int(r.inputs.acquisitions_total),
    receipts: int(r.inputs.receipts),
    bytes: int(r.inputs.bytes_received),
    megabytes: (r.inputs.bytes_received / 1e6).toFixed(1),
    files_listed: int(r.inventory.files_listed),
    files_matching: int(r.inventory.files_matching),
    outcome: r.claim.evidence_outcome,
    outcome_words: words(r.claim.evidence_outcome),
    reason: r.claim.reason_codes.join(", "),
    replays_passed: passed,
    replays_total: r.replay.length,
    replays_independent: independent,
    replays_not_run: r.replay.filter((x) => x.status === "NOT_RUN").length,
    validation: words(r.review.validation_state),
    gate: r.review.gate ? `${r.review.gate.name}: ${r.review.gate.status.toLowerCase()}` : "",
    method_id: r.method.id,
  };
}

/** The record as a card: what the first screen shows instead of a promise. */
export function recordCard(ctx, { compact = false } = {}) {
  const f = ctx.facts;
  const obs = ctx.site.observatory;
  return `<aside class="record${compact ? " record--compact" : ""}" aria-label="The public evidence record of claim ${e(ctx.record.claim.id)}">
  <p class="record__kicker"><span>Evidence record</span><span>Claim ${e(ctx.record.claim.id)}</span></p>
  <p class="record__title">Mangrove canopy extent, Cần Giờ, Viet Nam</p>
  <dl class="record__facts">
    <div><dt>Period</dt><dd>Dry season 2020</dd></div>
    <div><dt>Research area</dt><dd>${f.area_ha} ha</dd></div>
    <div><dt>Optical scenes</dt><dd>${f.scenes_total}, ${f.scenes_admitted} admitted</dd></div>
    <div><dt>Radar acquisitions</dt><dd>${f.acquisitions}</dd></div>
    <div><dt>Request receipts</dt><dd>${f.receipts}</dd></div>
    <div><dt>Method fixed before the data</dt><dd><code>${e(f.method_id)}</code></dd></div>
  </dl>
  <div class="record__outcome">
    <p class="record__label">Evidence outcome</p>
    <p>${badge(f.outcome)}</p>
    <p class="record__note">No extent is claimed. The result changed when the pre-registered thresholds were moved within their brackets, so the method refused.</p>
  </div>
  <p class="record__foot">${out(`${obs}/claims/c-01`, "Read the record")}<span>As published on ${e(f.retrieved_day)}</span></p>
</aside>`;
}

export function cta(ctx, { title = "Have a claim that someone else must be able to check?", text } = {}) {
  const s = ctx.site;
  return `<section class="cta" aria-labelledby="cta-h">
  <div class="wrap cta__in">
    <div>
      <h2 id="cta-h">${e(title)}</h2>
      <p>${text ?? `Describe the site, the claim and the decision it feeds. You receive a written scope with a deliverable, a date and a price within ${e(s.contact.reply_within)}. If open satellite data cannot answer the question, the reply says so.`}</p>
    </div>
    <p class="cta__actions">
      <a class="btn btn--light" href="/contact.html">Request a proposal</a>
      <a class="btn btn--ghost-light" href="mailto:${e(s.contact.email)}">${e(s.contact.email)}</a>
    </p>
  </div>
</section>`;
}

export const crumbs = (items) =>
  `<nav class="crumbs" aria-label="Breadcrumb"><ol>${items
    .map(([label, href], i) => (i === items.length - 1 ? `<li aria-current="page">${e(label)}</li>` : `<li><a href="${e(href)}">${e(label)}</a></li>`))
    .join("")}</ol></nav>`;

export const pageHead = ({ eyebrow: eb, title, lead, crumbs: c }) =>
  `<header class="page-head"><div class="wrap">${c ? crumbs(c) : ""}${eb ? eyebrow(eb) : ""}<h1>${title}</h1>${lead ? `<p class="lead">${lead}</p>` : ""}</div></header>`;
