// Takes the figures and wording this site quotes from the public record of the BCCS Evidence Observatory and
// writes them to _src/data/c01-public-record.json, with the time they were read.
//
//   node _src/tools/snapshot.mjs                 read the live public API (seven GET requests)
//   node _src/tools/snapshot.mjs --from <dir>    read responses saved earlier (evidence.json, claims_c-01.json,
//                                                method.json, inputs.json, acquisition.json, sites_can-gio.json,
//                                                programme.json, status.json and retrieved.txt)
//
// The site states nothing about the record that is not in this file. Nothing is typed in by hand: when the
// Observatory publishes a new record, run this again and rebuild. Only the public API is read; it carries what
// the approved publication set allows and nothing else.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(here, "..", "data", "c01-public-record.json");
const API = "https://observatory.bccs.bio/api/public/";
const ROUTES = { evidence: "evidence", claim: "claims/c-01", method: "method", inputs: "inputs", acquisition: "acquisition", site: "sites/can-gio", programme: "programme", status: "status" };

const fromAt = process.argv.indexOf("--from");
const raw = {};
let retrieved;
if (fromAt > 0) {
  const dir = process.argv[fromAt + 1];
  for (const [key, route] of Object.entries(ROUTES)) raw[key] = JSON.parse(fs.readFileSync(path.join(dir, route.replace("/", "_") + ".json"), "utf8"));
  retrieved = fs.readFileSync(path.join(dir, "retrieved.txt"), "utf8").trim();
} else {
  for (const [key, route] of Object.entries(ROUTES)) {
    const res = await fetch(API + route, { headers: { accept: "application/json" } });
    if (!res.ok) throw new Error(`${route}: HTTP ${res.status}`);
    raw[key] = await res.json();
  }
  retrieved = new Date().toISOString().slice(0, 16).replace("T", " ") + " UTC";
}

const c = raw.claim;
// The programme route answers with the programme record and the gate ledger side by side.
const p = raw.programme.programme ?? raw.programme;
const need = (value, name) => {
  if (value === undefined || value === null) throw new Error(`the public record has no ${name}`);
  return value;
};

const record = {
  retrieved,
  source: API,
  publication: {
    version: need(raw.status.publication?.version, "publication version"),
    status: need(raw.status.publication?.status, "publication status"),
    approved_at: need(raw.status.publication?.approved_at, "approval time"),
  },
  claim: {
    id: need(c.claim_id, "claim id"),
    title: need(c.claim_title, "claim title"),
    type: c.claim_type,
    area_m2_stated: need(c.boundary?.area_m2_stated, "stated area"),
    epoch: need(c.epoch, "epoch"),
    processing_state: need(c.processing_state, "processing state"),
    evidence_outcome: need(c.evidence_outcome, "evidence outcome"),
    reason_codes: need(c.reason_codes, "reason codes"),
    extent_stated: need(c.extent?.stated, "extent flag"),
    extent_explanation: c.extent?.explanation ?? "",
    record_as_of: need(c.record_as_of, "record date"),
    public_statement: need(c.public_statement, "public statement"),
  },
  method: { id: need(c.method?.id, "method id"), sha256: need(c.method?.sha256, "method digest") },
  inputs: {
    scenes_total: need(c.inputs?.scenes_total, "scene count"),
    scenes_admitted: need(c.inputs?.scenes_admitted, "admitted scene count"),
    scenes_used: need(c.inputs?.scenes_used, "used scene count"),
    acquisitions_total: need(c.inputs?.acquisitions_total, "acquisition count"),
    acquisitions_used: need(c.inputs?.acquisitions_used, "used acquisition count"),
    receipts: need(c.inputs?.receipts, "receipt count"),
    bytes_received: need(c.inputs?.bytes_received, "byte count"),
  },
  inventory: { files_listed: need(c.inventory?.files_listed, "inventory size"), files_matching: need(c.inventory?.files_matching, "matching files") },
  decision_steps: need(c.decision_steps, "decision steps").map((s) => ({ step: s.step, rule: s.rule, met: s.met, detail: s.detail })),
  decisions_by_variant: need(c.decision?.decisions_by_variant, "variant decisions"),
  sensitivity: Object.fromEntries(Object.entries(c.sensitivity ?? {}).map(([k, v]) => [k, { rule: v.rule, status: v.status, outcome: v.decision?.outcome ?? null }])),
  replay: need(c.replay, "replay list").map((r) => ({ kind: r.kind, title: r.title, status: r.status, performed_by: r.performed_by, independent: r.independent })),
  review: {
    validation_state: need(c.review?.validation_state, "validation state"),
    gate: c.review?.gate ?? null,
    internal_acceptance: c.review?.internal_acceptance ?? null,
    open_questions: c.review?.open_questions ?? [],
  },
  not_claimed: need(c.not_claimed, "list of what is not claimed"),
  withheld: (c.withheld ?? []).map((w) => ({ field: w.field, reason: w.reason })),
  credits: (c.credits ?? []).map((x) => ({ family: x.family, text: x.text, licence: x.licence ?? null })),
  run: { collected_started_utc: c.run?.collected_started_utc ?? null, assembled_utc: c.run?.assembled_utc ?? null },
  programme: {
    as_of: need(p.as_of, "programme date"),
    one_sentence: need(p.commercial?.one_sentence, "programme sentence"),
    approach: need(p.approach, "approach"),
    independence_limits: need(p.independence_limits, "independence limits"),
    not_claimed: need(p.not_claimed, "programme limits"),
    future: p.future ?? [],
    pilot_start_note: p.pilot?.start_note ?? "",
  },
};

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(record, null, 2) + "\n");
console.log(`wrote ${path.relative(process.cwd(), out)}: outcome ${record.claim.evidence_outcome}, read ${retrieved}`);
