import { cta, e, out, pageHead } from "../../lib.mjs";

export default (ctx) => {
  const { site, record: r, facts: f } = ctx;
  const title = "Integrity is not validity";
  const description = "A hash match, a replay, a validation, an independent review and a certificate establish five different things. What each proves about environmental data.";
  const url = `${site.origin}/insights/integrity-is-not-validity.html`;
  const anchoring = r.programme.future.find((x) => /attestation/i.test(x));
  return {
    path: "insights/integrity-is-not-validity.html",
    nav: "insights",
    article: true,
    updated: "2026-11-20",
    title,
    description,
    ld: [{ "@context": "https://schema.org", "@type": "Article", headline: title, description, datePublished: "2026-11-20", dateModified: "2026-11-20", author: { "@id": `${site.origin}/#organisation` }, publisher: { "@id": `${site.origin}/#organisation` }, mainEntityOfPage: url }],
    body: `
${pageHead({
  crumbs: [["BCCS", "/"], ["Notes", "/insights/"], [title]],
  eyebrow: "Note · Vocabulary",
  title,
  lead: "“Verified” is used for at least five different things. Each is worth having. None of them implies the next. Here is what each one establishes, with the questions to ask when someone uses the word.",
})}

<article class="band">
  <div class="wrap prose">
    <h2>1. Integrity: these are the same bytes</h2>
    <p>A cryptographic digest such as SHA-256 is a fingerprint of a file. If the digest recorded last month matches the digest computed today, the file has not changed.</p>
    <p>That is all it says. A blurred photograph with a perfect digest is still blurred. A map drawn from the wrong boundary keeps its digest for ever.</p>
    <p class="note"><strong>Ask:</strong> a digest of what, recorded when, and by whom?</p>

    <h2>2. Reproducibility: the computation repeats</h2>
    <p>If the same inputs and the same code give the same output on another machine, the result does not depend on someone’s laptop or on a download that has since changed.</p>
    <p>A wrong formula repeats perfectly. Reproducibility removes accident and carelessness from the list of worries. It does not touch the question of whether the method measures the thing it names.</p>
    <p class="note"><strong>Ask:</strong> who re-ran it? From stored inputs or from a fresh download? Was it the author?</p>

    <h2>3. Validity: the method measures what it claims</h2>
    <p>This takes data the method was not built on: field plots, a higher-resolution reference, a probability sample with a stated error. Validity comes with numbers, and with a scope: valid for this kind of site, at this resolution, in this season.</p>
    <p>For Demonstrator 001 this has not been done, and its record states that no error-adjusted area estimate exists because there is no probability reference sample.</p>
    <p class="note"><strong>Ask:</strong> validated against what, where, and with what error?</p>

    <h2>4. Independent review: someone else looked</h2>
    <p>An outsider with the competence and without a stake examines the method and the result and signs a report. A review by the team that did the work is useful, and it is something else.</p>
    <p>The demonstrator’s record separates the two in so many words: “${e(r.review.internal_acceptance?.note ?? "")}”</p>
    <p class="note"><strong>Ask:</strong> who reviewed it, who paid them, and can I read the report?</p>

    <h2>5. Certification: an accredited body attests conformity</h2>
    <p>A validation and verification body that is accredited for a standard states that a project conforms to that standard. It is a formal act with liability attached, and it covers what the standard covers.</p>
    <p>BCCS does not certify anything and is not a verification body.</p>
    <p class="note"><strong>Ask:</strong> conformity with which standard, by a body accredited by whom?</p>

    <h2>Where a blockchain fits</h2>
    <p>Writing a file’s digest to a public chain gives the digest a timestamp that is hard to forge. It shows that the file existed in that form at that time.</p>
    <p>It belongs under integrity, the first of the five. It adds nothing to the other four. ${anchoring ? `The BCCS programme plans to use it in exactly that sense and says so: “${e(anchoring)}”` : ""}</p>

    <h2>The five, applied to one record</h2>
    <table class="table">
      <thead><tr><th scope="col">Word</th><th scope="col">Demonstrator 001</th></tr></thead>
      <tbody>
        <tr><th scope="row">Integrity</th><td data-label="Demonstrator 001">${f.files_matching} of ${f.files_listed} files match their recorded digests.</td></tr>
        <tr><th scope="row">Reproducibility</th><td data-label="Demonstrator 001">${f.replays_passed} replays passed, all performed by the programme itself; ${f.replays_not_run} not run.</td></tr>
        <tr><th scope="row">Validity</th><td data-label="Demonstrator 001">Not established.</td></tr>
        <tr><th scope="row">Independent review</th><td data-label="Demonstrator 001">${e(f.validation.charAt(0) + f.validation.slice(1).toLowerCase())}.</td></tr>
        <tr><th scope="row">Certification</th><td data-label="Demonstrator 001">None, and none sought.</td></tr>
      </tbody>
    </table>
    <p>A record that fills in the first two rows and leaves the last three honest is worth more than a certificate that blurs all five into one word.</p>

    <p class="actions">${out(`${site.observatory}/claims/c-01`, "See the four axes on the live record", "btn")} <a class="btn btn--ghost" href="/method.html">Method and limits</a></p>
    <p class="article-meta">Published 20 November 2026.</p>
  </div>
</article>

${cta(ctx)}
`,
  };
};
