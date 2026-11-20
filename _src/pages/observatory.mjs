import { badge, cta, e, out, pageHead, words } from "../lib.mjs";

export default (ctx) => {
  const { site, record: r, facts: f } = ctx;
  const obs = site.observatory;
  const met = (v) => (v === true ? badge("PASS", "MET") : v === false ? badge("INSUFFICIENT_EVIDENCE", "NOT MET") : badge("NOT_RUN", "NOT APPLICABLE"));
  const variantNames = { primary: "Primary thresholds", mvi_low: "Optical threshold at the low end", mvi_high: "Optical threshold at the high end", vh_low: "Radar threshold at the low end", vh_high: "Radar threshold at the high end" };
  for (const key of Object.keys(r.decisions_by_variant)) if (!variantNames[key]) throw new Error(`no label for variant ${key}`);
  // "3 give “supported”, 2 give “conflicting”", counted from the record.
  const counts = {};
  for (const v of Object.values(r.decisions_by_variant)) counts[v] = (counts[v] ?? 0) + 1;
  const tally = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([v, n], i) => `${i === 0 ? ["Zero", "One", "Two", "Three", "Four", "Five"][n] ?? n : ["zero", "one", "two", "three", "four", "five"][n] ?? n} give${n === 1 ? "s" : ""} “${words(v).toLowerCase()}”`)
    .join(", ");
  return {
    path: "observatory.html",
    nav: "observatory",
    priority: "0.9",
    title: "The live record: Demonstrator 001, Cần Giờ mangroves",
    description: `A working, public evidence record: ${f.scenes_total} optical scenes, ${f.acquisitions} radar acquisitions and ${f.receipts} request receipts for the Cần Giờ mangroves in 2020, ending in a documented refusal.`,
    body: `
${pageHead({
  crumbs: [["BCCS", "/"], ["The live record"]],
  eyebrow: "BCCS Evidence Observatory · Demonstrator 001",
  title: "A working evidence record, open to inspection",
  lead: `The Observatory is in service at ${out(`${obs}/`, "observatory.bccs.bio")}. It holds one real measurement, with every input, the rule that was fixed beforehand, and the reason the method declined to give a figure. This page says what you will find there. The figures below are quoted from its public record as published on ${e(f.retrieved_day)}.`,
})}

<section class="band" aria-labelledby="st-h">
  <div class="wrap">
    <h2 id="st-h" class="sr">The record’s own statement</h2>
    <blockquote class="quote">
      <p>${e(r.claim.public_statement)}</p>
      <footer>The public statement of claim ${e(r.claim.id)}, as approved for release. ${out(`${obs}/claims/c-01`, "Read the claim")}</footer>
    </blockquote>
    <dl class="stats">
      <div><dt>Research area</dt><dd>${f.area_ha} ha<small>fixed and hashed before any measurement</small></dd></div>
      <div><dt>Period measured</dt><dd>Dry season 2020<small>${e(f.epoch)}</small></dd></div>
      <div><dt>Sentinel-2 optical scenes</dt><dd>${f.scenes_total}<small>${f.scenes_admitted} admitted by the pre-registered rules</small></dd></div>
      <div><dt>Sentinel-1 radar acquisitions</dt><dd>${f.acquisitions}<small>all used</small></dd></div>
      <div><dt>Request receipts</dt><dd>${f.receipts}<small>one per request to a data source</small></dd></div>
      <div><dt>Frozen input</dt><dd>${f.megabytes} MB<small>${f.bytes} bytes received and stored</small></dd></div>
      <div><dt>Files in the inventory</dt><dd>${f.files_matching} of ${f.files_listed}<small>match their recorded SHA-256</small></dd></div>
      <div class="stats__wide"><dt>Evidence outcome</dt><dd style="font-size:1.05rem;padding-top:.3rem">${badge(f.outcome)}<small>reason code ${e(f.reason)}</small></dd></div>
    </dl>
    <p class="actions">
      ${out(`${obs}/`, "Open the Observatory", "btn")}
      ${out(`${obs}/claims/c-01`, "Claim " + e(r.claim.id), "btn btn--ghost")}
      ${out(`${obs}/evidence`, "Evidence explorer", "btn btn--ghost")}
      ${out(`${obs}/method`, "The pre-registered method", "btn btn--ghost")}
      ${out(`${obs}/sites/can-gio`, "The site", "btn btn--ghost")}
    </p>
  </div>
</section>

<section class="band band--tint" aria-labelledby="dec-h">
  <div class="wrap">
    <div class="band__head">
      <h2 id="dec-h">How the method arrived at a refusal</h2>
      <p>Six steps, fixed in method <code>${e(r.method.id)}</code> before the data was opened. The first four were met. The fifth was not, so the sixth never produced a figure.</p>
    </div>
    <table class="table">
      <thead><tr><th scope="col">Step</th><th scope="col">Rule fixed beforehand</th><th scope="col">Met</th><th scope="col">What the record shows</th></tr></thead>
      <tbody>
        ${r.decision_steps
          .map((s) => `<tr><td class="num" data-label="Step">${String(s.step).padStart(2, "0")}</td><th scope="row">${e(s.rule)}</th><td data-label="Met">${met(s.met)}</td><td data-label="What the record shows">${e(s.detail)}</td></tr>`)
          .join("\n        ")}
      </tbody>
    </table>
    <div class="grid grid--2" style="margin-top:1.25rem">
      <div class="card">
        <h3>The same decision, five ways</h3>
        <p>The thresholds were registered with a bracket around each. The decision was repeated with each threshold at the end of its bracket.</p>
        <ul class="list-plain">
          ${Object.entries(r.decisions_by_variant)
            .sort(([a], [b]) => Object.keys(variantNames).indexOf(a) - Object.keys(variantNames).indexOf(b))
            .map(([k, v]) => `<li><span>${e(variantNames[k])}</span>${badge(v)}</li>`)
            .join("\n          ")}
        </ul>
        <p class="small muted" style="margin-top:.75rem">${tally}. The rule asks for the same decision in all ${Object.keys(r.decisions_by_variant).length}.</p>
      </div>
      <div class="card">
        <h3>Why this is the useful result</h3>
        <p>With the primary thresholds alone the method would have reported “supported” and given an interval. The pre-registered robustness step is what stopped it.</p>
        <p>A reader of the record can see that a different, defensible choice of threshold changes the answer. That is information a single figure would have hidden.</p>
        <p>Two further sensitivity runs, registered in advance, gave the same outcome: ${Object.values(r.sensitivity).map((s) => e(s.rule.replace(/^IC-\d+: /, ""))).join("; and ")}.</p>
      </div>
    </div>
  </div>
</section>

<section class="band" aria-labelledby="rep-h">
  <div class="wrap">
    <div class="band__head">
      <h2 id="rep-h">What has been re-run, and by whom</h2>
      <p>${f.replays_passed} of ${f.replays_total} listed replays passed. ${f.replays_independent === 0 ? "None of them is independent: each was performed by the programme itself." : `${f.replays_independent} were performed independently.`} A replay shows that the computation repeats. It does not show that the method measures the right thing.</p>
    </div>
    <table class="table">
      <thead><tr><th scope="col">Replay</th><th scope="col">Result</th><th scope="col">Performed by</th><th scope="col">Independent</th></tr></thead>
      <tbody>
        ${r.replay.map((x) => `<tr><th scope="row">${e(x.title)}</th><td data-label="Result">${badge(x.status)}</td><td data-label="Performed by">${e(x.performed_by)}</td><td data-label="Independent">${x.independent ? "Yes" : "No"}</td></tr>`).join("\n        ")}
      </tbody>
    </table>
    <div class="note note--refuse" style="margin-top:1.25rem">
      <h3>Independent review: ${e(f.validation.toLowerCase())}</h3>
      <p>${e(r.review.internal_acceptance?.note ?? "")} ${r.review.gate ? `The programme’s gate “${e(r.review.gate.name)}” is ${e(r.review.gate.status.toLowerCase())}.` : ""} <a href="/company.html#review">How to review this work</a></p>
    </div>
  </div>
</section>

<section class="band band--tint" aria-labelledby="not-h">
  <div class="wrap">
    <div class="pair">
      <div>
        <h2 id="not-h">What the record does not claim</h2>
        <p>Listed in the record itself, word for word:</p>
        <ul class="list-no">
          ${r.not_claimed.map((x) => `<li>${e(x.charAt(0).toUpperCase() + x.slice(1))}</li>`).join("\n          ")}
        </ul>
      </div>
      <div>
        <h2>What is held back, and why</h2>
        <p>The method refused to state an extent. Under the programme’s claims discipline, nothing that would amount to an extent is published for a refused result.</p>
        <ul class="list-no">
          ${r.withheld.map((w) => `<li><strong>${e(w.field)}.</strong> ${e(w.reason)}</li>`).join("\n          ")}
        </ul>
        <p class="small muted">The SHA-256 of each withheld file is public, so a reviewer who is given access can confirm they hold the same bytes.</p>
      </div>
    </div>
  </div>
</section>

<section class="band" aria-labelledby="next-h">
  <div class="wrap narrow">
    <h2 id="next-h">What happens to this claim next</h2>
    <p>The next step is an open decision in the programme, published with the record:</p>
    <ul>
      ${r.review.open_questions.slice(1).map((q) => `<li>${e(q)}</li>`).join("\n      ")}
    </ul>
    <p>Until that decision is taken and recorded, the outcome stands as it is. No threshold is adjusted after the fact, and no new method version is evaluated on data that was already seen.</p>
    <h3>Data and credit</h3>
    <ul class="small">
      ${r.credits.map((c) => `<li>${e(c.text)}</li>`).join("\n      ")}
    </ul>
    <p class="small muted">Publication set ${e(String(r.publication.version))}, approved on ${e(f.approved_day)}. Figures on this page were read from the Observatory’s public interface on ${e(f.retrieved)}; the Observatory is the authority if the two ever differ.</p>
  </div>
</section>

${cta(ctx, { title: "Want a record like this for a site you are responsible for?", text: "A site evidence check uses the same steps on your boundary, your period and your question. The method is sent to you, hashed, before any data is opened." })}
`,
  };
};
