import { badge, cta, e, eyebrow, more, out, recordCard } from "../lib.mjs";

export default (ctx) => {
  const { site, record, facts: f } = ctx;
  const p = site.prices;
  return {
    path: "index.html",
    nav: "home",
    priority: "1.0",
    title: "BCCS: re-runnable satellite evidence for mangrove and coastal claims",
    share_title: "Evidence for coastal ecosystem claims that a third party can re-run",
    description: "Independent, re-runnable satellite evidence records for mangrove and coastal ecosystem claims. Fixed scope, written limits, and a live public record to inspect.",
    ld: [{ "@context": "https://schema.org", "@type": "WebSite", name: "BCCS", url: `${site.origin}/`, publisher: { "@id": `${site.origin}/#organisation` } }],
    body: `
<section class="hero">
  <div class="wrap hero__in">
    <div>
      ${eyebrow("BCCS · Evidence services")}
      <h1>Evidence for coastal ecosystem claims that a third party can re-run</h1>
      <p class="lead">${e(record.programme.one_sentence)}</p>
      <p class="actions">
        ${out(`${site.observatory}/`, "Open the live Observatory", "btn btn--light")}
        <a class="btn btn--ghost-light" href="/services.html">Services and prices</a>
      </p>
      <p class="hero__under">One record is public and working today. It ends in a refusal, and it shows why. <a href="/observatory.html">What that record contains</a></p>
    </div>
    ${recordCard(ctx)}
  </div>
</section>

<section class="band" aria-labelledby="why-h">
  <div class="wrap">
    <div class="band__head">
      ${eyebrow("The problem")}
      <h2 id="why-h">An area figure that nobody else can run again is a statement, not evidence</h2>
      <p>Coastal and blue-carbon finance relies on claims about where mangroves are and whether they persist. A restoration report, a monitoring map or a project description gives the hectares. The data and the steps behind the figure are rarely something a funder, a verifier or a journalist can run for themselves.</p>
    </div>
    <div class="grid grid--3">
      <div class="card">
        <h3>Global maps answer a different question</h3>
        <p>Open global maps are valuable, and they are built for the globe. Global Mangrove Watch v3.0 reports an estimated accuracy of 87.4 % for its extent maps and 58.1 % and 60.6 % for its gain and loss classes.</p>
        <p class="small muted">Bunting et al. (2022), Remote Sensing 14, 3657, as quoted in the programme record of the Observatory.</p>
      </div>
      <div class="card">
        <h3>The party that is checked usually pays the checker</h3>
        <p>A verifier is engaged by the project it verifies. A record that anyone can re-run does not ask the reader to trust who paid for it: the inputs, the rule and the computation are there to be repeated.</p>
      </div>
      <div class="card">
        <h3>A method that can only say yes proves little</h3>
        <p>A BCCS record ends in one of three outcomes: supported, with an interval; conflicting; or insufficient evidence. The rule that decides between them is fixed before any data is opened.</p>
      </div>
    </div>
  </div>
</section>

<section class="band band--tint" aria-labelledby="offer-h">
  <div class="wrap">
    <div class="band__head">
      ${eyebrow("What you can commission")}
      <h2 id="offer-h">Three fixed-scope services and one small first step</h2>
      <p>Each ends in a written deliverable. The fee is the same whatever the answer turns out to be.</p>
    </div>
    <div class="grid grid--3">
      <div class="card">
        <p class="card__kicker">One site, one period, one question</p>
        <h3>Site evidence check</h3>
        <p>An independent, dated answer to one area question, from open Sentinel-1 and Sentinel-2 data, under a method you see before the data is opened.</p>
        <p class="card__price"><strong>${e(p.site_check.amount || "Fixed price per site")}</strong>${p.site_check.amount ? "Per site and period, fixed." : "Stated in the written scope before any work starts."} Run as a pilot: the method has one public run and no field validation yet.</p>
        <p class="card__more">${more("/services.html#site-check", "What you receive")}</p>
      </div>
      <div class="card">
        <p class="card__kicker">Before verification, rating or a funding decision</p>
        <h3>Evidence readiness review</h3>
        <p>You send the claims and the material behind them. You receive each claim marked as supported, not supported or not checkable, and the gaps in order of consequence.</p>
        <p class="card__price"><strong>${e(p.review.amount)}</strong>Fixed. Delivered 21 days after the material arrives.</p>
        <p class="card__more">${more("/services.html#review", "What you receive")}</p>
      </div>
      <div class="card">
        <p class="card__kicker">Your records, kept the way ours are</p>
        <h3>Evidence room</h3>
        <p>A dedicated installation of the software behind the Observatory: immutable records, intake that checks every byte, controlled publication, an audit trail and a public reading room.</p>
        <p class="card__price"><strong>By written proposal</strong>One installation per programme. Not a self-service product.</p>
        <p class="card__more">${more("/services.html#room", "What it includes")}</p>
      </div>
    </div>
    <p class="note note--plain" style="margin-top:1.1rem"><strong>Not sure which of these fits?</strong> Put one question in writing and receive a written answer with its reasoning in five working days, for ${e(p.question.amount)}. ${more("/services.html#question", "One question, answered")}</p>
  </div>
</section>

<section class="band band--dark" aria-labelledby="how-h">
  <div class="wrap">
    <div class="band__head">
      ${eyebrow("How a record is made")}
      <h2 id="how-h">The rule comes first. The data comes second.</h2>
    </div>
    <ol class="steps">
      <li><h3>Fix the question</h3><p>The claim, the boundary, the period, the thresholds and the decision rule are written down and hashed. Nothing has been computed yet.</p></li>
      <li><h3>Acquire with receipts</h3><p>Open optical and radar scenes and an external reference map are fetched. Every request is recorded with its size and SHA-256.</p></li>
      <li><h3>Compute offline</h3><p>The measurement runs from the frozen bytes, with no network. Two sensor groups and the reference are compared under the rule from step one.</p></li>
      <li><h3>Decide, including no</h3><p>Each threshold is moved to both ends of its pre-registered bracket. If the answer changes, the outcome is insufficient evidence.</p></li>
      <li><h3>Publish what holds</h3><p>Only an approved set leaves the registry. For a refused result, no extent figure is published at all.</p></li>
    </ol>
    <p style="margin-top:1.75rem">${more("/method.html", "Method and limits in full")}</p>
  </div>
</section>

<section class="band" aria-labelledby="is-h">
  <div class="wrap">
    <div class="band__head">
      ${eyebrow("Read this before you write to us")}
      <h2 id="is-h">What a record is, and what it is not</h2>
    </div>
    <div class="pair">
      <div class="card">
        <h3>A record is</h3>
        <ul class="list-yes">
          <li>A dated statement about one area, one period and one question</li>
          <li>Re-runnable from stored inputs, byte for byte</li>
          <li>Explicit about uncertainty and about what was not examined</li>
          <li>Able to end in “insufficient evidence”</li>
          <li>Marked with who commissioned it and who paid</li>
        </ul>
      </div>
      <div class="card">
        <h3>A record is not</h3>
        <ul class="list-no">
          <li>A certificate, a carbon credit or a rating</li>
          <li>A verification under any carbon or biodiversity standard, or the opinion of an accredited verification body</li>
          <li>Field truth: satellites see canopy, not seedlings, species, biomass or carbon</li>
          <li>A statement about a site today, unless today’s data was commissioned</li>
          <li>Independent scientific validation of the method. That has not started, and the public record says so</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section class="band band--tint" aria-labelledby="who-h">
  <div class="wrap">
    <div class="band__head">
      ${eyebrow("Who it is for")}
      <h2 id="who-h">People who have to act on someone else’s area claim</h2>
      <p>These are intended uses, written as hypotheses in the programme record. BCCS has no customer yet and does not name any.</p>
    </div>
    <div class="grid grid--3">
      <div class="card"><h3>Funders and programmes</h3><p>You release money against restoration or protection milestones, or you evaluate a programme afterwards. You need area evidence that does not come only from the implementer.</p><p class="card__more">${more("/use-cases.html#funders", "For funders")}</p></div>
      <div class="card"><h3>Project developers, verifiers and raters</h3><p>You want to know whether an area claim will survive examination before the verification visit, the rating or the press does the examining.</p><p class="card__more">${more("/use-cases.html#projects", "For projects")}</p></div>
      <div class="card"><h3>Researchers and reporters</h3><p>You publish a figure and want others to be able to re-run it, or you are looking into a figure somebody else published.</p><p class="card__more">${more("/use-cases.html#research", "For research")}</p></div>
    </div>
  </div>
</section>

<section class="band" aria-labelledby="status-h">
  <div class="wrap">
    <div class="band__head">
      ${eyebrow("Where things stand")}
      <h2 id="status-h">What operates, what is being built, what is a concept</h2>
      <p>As of ${e(f.retrieved_day)}. The first two rows can be inspected today. Nothing below them is offered as finished.</p>
    </div>
    <table class="table">
      <thead><tr><th scope="col">Part</th><th scope="col">State</th><th scope="col">What that means</th></tr></thead>
      <tbody>
        <tr><th scope="row">BCCS Evidence Observatory</th><td data-label="State">${badge("PASS", "OPERATING")}</td><td data-label="What that means">Public registry and reading room, private workspace, byte-checked intake, controlled publication. ${out(`${site.observatory}/`, "observatory.bccs.bio")}</td></tr>
        <tr><th scope="row">Demonstrator 001, claim ${e(record.claim.id)}</th><td data-label="State">${badge("PASS", "PUBLISHED")}</td><td data-label="What that means">One pre-registered measurement for one site and one period, measured on ${e(f.measured_day)}. Outcome: ${e(f.outcome_words.toLowerCase())}. ${f.replays_passed} replays passed, all by the programme itself.</td></tr>
        <tr><th scope="row">Independent validation</th><td data-label="State">${badge("NOT_RUN", "NOT STARTED")}</td><td data-label="What that means">No field campaign, no probability reference sample and no external review of the method yet. <a href="/company.html#review">Reviewers are invited</a>.</td></tr>
        <tr><th scope="row">Change between periods, more sites, an evidence API</th><td data-label="State">${badge("NOT_RUN", "IN DEVELOPMENT")}</td><td data-label="What that means">Planned in the programme record. Not funded, not contracted, not under way.</td></tr>
        <tr><th scope="row">Customers and partners</th><td data-label="State">${badge("NOT_RUN", "NONE YET")}</td><td data-label="What that means">The first engagements are run as pilots, at a fixed price agreed in writing.</td></tr>
        <tr><th scope="row">BCCS protocol: identifiers, node network, token</th><td data-label="State">${badge("NOT_RUN", "CONCEPT")}</td><td data-label="What that means">Design documents of April 2026. No verification network operates. <a href="/protocol.html">Status of every part</a></td></tr>
      </tbody>
    </table>
  </div>
</section>

${cta(ctx)}
`,
  };
};
