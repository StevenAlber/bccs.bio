import { badge, cta, e, out, pageHead } from "../../lib.mjs";

export default (ctx) => {
  const { site, record: r, facts: f } = ctx;
  const obs = site.observatory;
  const step = (n) => r.decision_steps.find((s) => s.step === n);
  // This note describes one result. If the record no longer reads this way, the note must be rewritten, not rebuilt.
  const v = r.decisions_by_variant;
  const holds = r.claim.evidence_outcome === "INSUFFICIENT_EVIDENCE" && [1, 2, 3, 4].every((n) => step(n).met === true) && step(5).met === false && v.primary === "SUPPORTED" && v.mvi_low === "SUPPORTED" && v.vh_low === "SUPPORTED" && v.mvi_high === "CONFLICTING" && v.vh_high === "CONFLICTING" && r.inputs.acquisitions_used === r.inputs.acquisitions_total;
  if (!holds) throw new Error("the public record no longer matches what this note says about it");
  const title = "What a refusal looks like";
  const description = `A real measurement of the Cần Giờ mangroves ran without error and declined to give a figure. What happened at each step, and why that is the result worth showing first.`;
  const url = `${site.origin}/insights/what-a-refusal-looks-like.html`;
  return {
    path: "insights/what-a-refusal-looks-like.html",
    nav: "insights",
    article: true,
    updated: "2026-11-20",
    title,
    description,
    ld: [{ "@context": "https://schema.org", "@type": "Article", headline: title, description, datePublished: "2026-11-20", dateModified: "2026-11-20", author: { "@id": `${site.origin}/#organisation` }, publisher: { "@id": `${site.origin}/#organisation` }, mainEntityOfPage: url }],
    body: `
${pageHead({
  crumbs: [["BCCS", "/"], ["Notes", "/insights/"], [title]],
  eyebrow: "Note · Demonstrator 001",
  title,
  lead: `On ${e(f.measured_day)} a measurement of the 2020 mangrove canopy of a ${f.area_ha} ha area in Cần Giờ, Viet Nam, finished without an error and declined to give an answer. This note walks through what happened, using only what the public record shows.`,
})}

<article class="band">
  <div class="wrap prose">
    <h2>What was asked</h2>
    <p>The claim was narrow on purpose: the extent of mangrove canopy inside one fixed boundary during one dry season, ${e(f.epoch)}. The boundary, the thresholds, the tolerances and the rule for deciding were written into a method file, and that file was hashed, before any result was computed.</p>
    <p>The evidence came in two groups, optical scenes from Sentinel-2 and radar acquisitions from Sentinel-1, and was compared with an external reference, Global Mangrove Watch. ${f.scenes_total} optical scenes were found for the period and ${f.scenes_admitted} passed the admission rules; all ${f.acquisitions} radar acquisitions were used. Every request to a data source left a receipt: ${f.receipts} in all.</p>

    <h2>Four steps passed</h2>
    <table class="table">
      <thead><tr><th scope="col">Step</th><th scope="col">Rule</th><th scope="col">What the record shows</th></tr></thead>
      <tbody>
        ${[1, 2, 3, 4].map((n) => `<tr><td class="num" data-label="Step">${String(n).padStart(2, "0")}</td><th scope="row">${e(step(n).rule)}</th><td data-label="What the record shows">${e(step(n).detail)}</td></tr>`).join("\n        ")}
      </tbody>
    </table>
    <p>At this point most pipelines would stop and report. The primary decision was ${badge("SUPPORTED")}: the two sensor groups agreed with each other and with the reference, within the tolerance set in advance.</p>

    <h2>The fifth step did not</h2>
    <p>The rule: <em>${e(step(5).rule)}</em>.</p>
    <p>The record: ${e(step(5).detail)}.</p>
    <p>So the outcome is ${badge(f.outcome)}, with the reason code <code>${e(f.reason)}</code>, and step six, which would have stated an interval, never ran.</p>

    <h2>What a threshold bracket is</h2>
    <p>A satellite does not label pixels “mangrove”. It returns numbers: how green and wet the surface looks in optical bands, how strongly it scatters a radar pulse. A threshold turns each number into a yes or a no.</p>
    <p>There is no single correct threshold. Two careful analysts would pick slightly different values and both could defend their choice. The bracket is the range of defensible choices, registered before the data is opened.</p>
    <p>If the conclusion is the same everywhere inside the bracket, it belongs to the site. If it flips somewhere inside the bracket, it belongs to the analyst. Here it flipped at the upper end of both brackets.</p>

    <h2>Why not publish the primary figure with a caveat?</h2>
    <p>Because figures travel and caveats do not. A number with a footnote in a record becomes a number without one in a slide, a proposal or a headline.</p>
    <p>The programme’s rule is therefore blunt. For a refused result no extent figure or range is published, including the values of the individual evidence groups and any map from which they could be read. The files exist and their digests are public, so a reviewer who is given access can confirm they hold the same bytes.</p>

    <h2>What this does and does not tell you</h2>
    <ul>
      <li><strong>It shows that the refusal works on real data.</strong> The mechanism was not staged; it was registered in advance and it fired.</li>
      <li><strong>It does not show that the method is right.</strong> A method can refuse for good reasons and still be poor. No field data and no independent reviewer have tested it yet. The record says “${e(f.validation.toLowerCase())}”.</li>
      <li><strong>It says nothing about the mangroves of Cần Giờ,</strong> in 2020 or now, and nothing against the reference map.</li>
      <li><strong>It tells you what “supported” will mean</strong> when a BCCS record carries that word: that the answer survived every pre-registered attempt to move it.</li>
    </ul>

    <h2>What happens next</h2>
    <p>The next step is an open decision, published with the claim:</p>
    <ul>
      ${r.review.open_questions.slice(1).map((q) => `<li>${e(q)}</li>`).join("\n      ")}
    </ul>
    <p>Whichever is chosen, the 2020 result is not edited. A new attempt would be a new, separately versioned measurement with its own method file.</p>

    <p class="actions">${out(`${obs}/claims/c-01`, "Read the claim on the Observatory", "btn")} <a class="btn btn--ghost" href="/observatory.html">The record in summary</a></p>
    <p class="article-meta">Published ${e("20 November 2026")}. Figures quoted from the Observatory’s public record as read on ${e(f.retrieved)}.</p>
  </div>
</article>

${cta(ctx)}
`,
  };
};
