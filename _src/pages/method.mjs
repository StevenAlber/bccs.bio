import { badge, cta, e, out, pageHead } from "../lib.mjs";

export default (ctx) => {
  const { site, record: r, facts: f } = ctx;
  const obs = site.observatory;
  return {
    path: "method.html",
    nav: "method",
    priority: "0.8",
    title: "Method and limits",
    description: "How a BCCS evidence record is made and what it cannot tell you: pre-registration, receipts, replay, the three outcomes, and why a hash match is not validation.",
    body: `
${pageHead({
  crumbs: [["BCCS", "/"], ["Method and limits"]],
  eyebrow: "Method and limits",
  title: "How a record is made, and what it cannot tell you",
  lead: "The value of a record lies in what it lets a stranger check. This page describes the mechanism and then spends as long on its limits.",
})}

<section class="band" aria-labelledby="axes-h">
  <div class="wrap">
    <div class="band__head">
      <h2 id="axes-h">Four things that are kept apart</h2>
      <p>Most confusion about “verified” data comes from folding these into one word. In a BCCS record each has its own field and its own value.</p>
    </div>
    <table class="table">
      <thead><tr><th scope="col">Axis</th><th scope="col">The question it answers</th><th scope="col">Demonstrator 001 today</th></tr></thead>
      <tbody>
        <tr><th scope="row">Processing state</th><td data-label="The question it answers">Did the computation run to its end?</td><td data-label="Demonstrator 001 today">${badge(r.claim.processing_state)}</td></tr>
        <tr><th scope="row">Evidence outcome</th><td data-label="The question it answers">What does the evidence support under the rule fixed beforehand?</td><td data-label="Demonstrator 001 today">${badge(f.outcome)}</td></tr>
        <tr><th scope="row">Replay</th><td data-label="The question it answers">Does the computation give the same result when run again, and who ran it?</td><td data-label="Demonstrator 001 today">${f.replays_passed} passed, ${f.replays_not_run} not run, ${f.replays_independent} independent</td></tr>
        <tr><th scope="row">Independent review</th><td data-label="The question it answers">Has someone outside the programme examined the method and the result?</td><td data-label="Demonstrator 001 today">${badge(r.review.validation_state)}</td></tr>
      </tbody>
    </table>
    <p class="small muted" style="margin-top:.75rem">A run that succeeds can still end in a refusal, and a result that replays perfectly can still be wrong. ${out(`${obs}/claims/c-01`, "See all four on the live record")}</p>
  </div>
</section>

<section class="band band--tint" aria-labelledby="words-h" id="words">
  <div class="wrap">
    <div class="band__head">
      <h2 id="words-h">Five words that are not synonyms</h2>
      <p>A hash match is not a replay. A replay is not validation. Validation by the author is not independent review. None of them is certification.</p>
    </div>
    <table class="table">
      <thead><tr><th scope="col">Word</th><th scope="col">What it establishes</th><th scope="col">What it does not</th><th scope="col">BCCS today</th></tr></thead>
      <tbody>
        <tr><th scope="row">Integrity</th><td data-label="What it establishes">These are the same bytes that were recorded: sizes and SHA-256 digests match.</td><td data-label="What it does not">That the bytes are right, or mean what is said of them.</td><td data-label="BCCS today">In place: ${f.files_matching} of ${f.files_listed} files match.</td></tr>
        <tr><th scope="row">Reproducibility</th><td data-label="What it establishes">The same inputs and the same code give the same result again.</td><td data-label="What it does not">That the method measures the thing it names.</td><td data-label="BCCS today">Shown by the programme’s own runs. A full recomputation on the public server has not been run.</td></tr>
        <tr><th scope="row">Validity</th><td data-label="What it establishes">The method measures what it claims to, within a stated error, tested against data it was not built on.</td><td data-label="What it does not">That every later run is right.</td><td data-label="BCCS today">Not established. There is no probability reference sample and no field campaign.</td></tr>
        <tr><th scope="row">Independent review</th><td data-label="What it establishes">A qualified party with no stake has examined method and result and put their name to a report.</td><td data-label="What it does not">A guarantee, or conformity with a standard.</td><td data-label="BCCS today">Not started. <a href="/company.html#review">Reviewers are invited.</a></td></tr>
        <tr><th scope="row">Certification</th><td data-label="What it establishes">An accredited body attests conformity with a named standard.</td><td data-label="What it does not">Anything outside that standard’s scope.</td><td data-label="BCCS today">None, and none is offered. BCCS is not a verification body.</td></tr>
      </tbody>
    </table>
  </div>
</section>

<section class="band" aria-labelledby="mech-h">
  <div class="wrap">
    <div class="split">
      <div class="prose">
        <h2 id="mech-h">The mechanism</h2>
        <h3>The rule is registered before the result exists</h3>
        <p>The claim, the area boundary, the period, the thresholds with a bracket around each, the tolerances and the decision rule are written into one method file. Its SHA-256 is recorded before any measurement is computed. That is what shows the rule was not adjusted once the answer was known.</p>
        <h3>Every request leaves a receipt</h3>
        <p>Each call to a data source is recorded when it is made: what was asked, when, what came back, its size and its digest. Demonstrator 001 holds ${f.receipts} of them. The inputs are then frozen.</p>
        <h3>The computation replays offline</h3>
        <p>The measurement runs from the stored bytes inside an environment with no network, so it cannot quietly fetch something newer. Run again from the same bytes, it must give the same record.</p>
        <h3>Two sensor groups and an external reference</h3>
        <p>Optical evidence (Sentinel-2) and radar evidence (Sentinel-1) are computed separately and compared with each other and with a published reference map, Global Mangrove Watch. Agreement has to hold within tolerances that were fixed beforehand.</p>
        <p>The reference is the version named in the method file: for Demonstrator 001, Global Mangrove Watch version 3.0. A different version would be a new method version with its own registration, not an edit of this one.</p>
        <h3>Three outcomes, one of which is no</h3>
        <ul>
          <li>${badge("SUPPORTED")} with an interval, when the groups and the reference agree and the decision survives every bracket.</li>
          <li>${badge("CONFLICTING")} when the evidence groups disagree beyond the tolerance.</li>
          <li>${badge("INSUFFICIENT_EVIDENCE")} when coverage is too thin, or when the answer depends on where inside its bracket a threshold sits.</li>
        </ul>
        <p>Refusing to conclude is a designed result, not a failure.</p>
        <h3>Publication is a separate decision</h3>
        <p>Nothing in the registry is public until a named person approves a publication set. For a refused result the programme publishes no extent figure and no map from which one could be read.</p>
        <p>${out(`${obs}/method`, "The pre-registered method on the Observatory")}</p>
      </div>
      <aside class="card" aria-labelledby="lim-h">
        <h2 id="lim-h" style="font-size:1.35rem">How independent the evidence is</h2>
        <p class="small muted">From the programme record, word for word:</p>
        <ul class="list-no">
          ${r.programme.independence_limits.map((x) => `<li>${e(x)}</li>`).join("\n          ")}
        </ul>
      </aside>
    </div>
  </div>
</section>

<section class="band band--tint" aria-labelledby="cant-h">
  <div class="wrap">
    <div class="band__head">
      <h2 id="cant-h">What satellite evidence of this kind cannot do</h2>
    </div>
    <div class="grid grid--3">
      <div class="card"><h3>See what is under the canopy</h3><p>Pixels of 10 to 20 metres show closed canopy. Seedlings, sparse young plantations, species and the condition of individual trees are invisible at this scale.</p></div>
      <div class="card"><h3>Measure carbon or biodiversity</h3><p>An extent is an area. Biomass, carbon stock, species richness and ecosystem health need other measurements, most of them on the ground.</p></div>
      <div class="card"><h3>Replace the tide table and the boots</h3><p>Tidal state changes what a sensor sees on a mudflat. Compositing over many dates and a tide sensitivity reduce the effect; they do not remove it. Field truth remains field truth.</p></div>
    </div>
    <div class="note" style="margin-top:1.25rem">
      <h3>What would change this picture</h3>
      <p>The programme record sets out the work: ${e(r.programme.future.find((x) => /validation/i.test(x)) ?? "independent validation in the field")}</p>
      <p class="small muted">${e(r.programme.pilot_start_note)}</p>
    </div>
  </div>
</section>

${cta(ctx, { title: "Think the method is wrong somewhere?", text: "Say where. The method file, the decision steps and the public inputs are open, and a qualified reviewer can be given the withheld files under a short agreement. Criticism that holds is published with the record." })}
`,
  };
};
