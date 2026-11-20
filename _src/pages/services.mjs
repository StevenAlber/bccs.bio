import { cta, e, out, pageHead } from "../lib.mjs";

export default (ctx) => {
  const { site } = ctx;
  const p = site.prices;
  const amount = (x, fallback) => (x.amount ? `<span class="price__amount">${e(x.amount)}</span>` : `<span class="price__amount price__amount--words">${e(fallback)}</span>`);
  const offers = [
    ["One question, answered in writing", p.question.amount, "A written answer to one question about a claim, a method or a dataset, with the reasoning shown. Delivered in five working days."],
    ["Evidence readiness review", p.review.amount, "A written review of a project’s claims against the material behind them, before verification, rating or a funding decision. Delivered in 21 days."],
  ].filter((o) => o[1]);
  return {
    path: "services.html",
    nav: "services",
    priority: "0.9",
    title: "Services and prices",
    description: "Site evidence checks, evidence readiness reviews and evidence rooms for mangrove and coastal claims. Fixed scope, written deliverables, prices before work starts.",
    ld: [
      {
        "@context": "https://schema.org",
        "@type": "OfferCatalog",
        name: "BCCS evidence services",
        url: `${site.origin}/services.html`,
        itemListElement: offers.map(([name, price, description]) => ({
          "@type": "Offer",
          price: price.replace(/[^0-9.]/g, ""),
          priceCurrency: "USD",
          itemOffered: { "@type": "Service", name, description, provider: { "@id": `${site.origin}/#organisation` } },
        })),
      },
    ],
    body: `
${pageHead({
  crumbs: [["BCCS", "/"], ["Services and prices"]],
  eyebrow: "Services and prices",
  title: "Fixed scope, a written deliverable, a price before work starts",
  lead: "Three services and one small first step. You pay for the record and the work behind it. The fee does not depend on the answer, and a refusal costs the same as a figure.",
})}

<section class="band" aria-label="The services">
  <div class="wrap">

    <article class="service" id="site-check">
      <div class="service__head">
        <p class="eyebrow">One site · one period · one question</p>
        <h2>Site evidence check</h2>
        <p class="service__for">For a funder, a programme or a project that needs an independent, dated answer to one area question.</p>
        <p class="price">${amount(p.site_check, "Fixed price per site and period")}<span class="price__basis">${p.site_check.amount ? "Per site and period. Fixed, and stated in the written scope before any work starts." : "Stated in the written scope before any work starts. No hourly billing."} Run as a pilot.</span></p>
      </div>
      <dl class="spec">
        <dt>You send</dt>
        <dd>The boundary of the area as a file, the period, and the claim in one sentence, for example “mangrove canopy covered this area in the dry season of a given year”. Any map you already rely on.</dd>
        <dt>We do</dt>
        <dd><ul>
          <li>Write the method: the claim, the boundary, the thresholds with their brackets, the tolerances and the decision rule. You receive it and its SHA-256 before any data is opened.</li>
          <li>Acquire Sentinel-2 optical and Sentinel-1 radar scenes and an external reference map, with a receipt for every request.</li>
          <li>Compute offline from the frozen inputs, compare the two sensor groups with each other and with the reference, and repeat the decision at the ends of every bracket.</li>
        </ul></dd>
        <dt>You receive</dt>
        <dd><ul>
          <li>An evidence record: the outcome (supported with an interval, conflicting, or insufficient evidence) and the steps that led to it.</li>
          <li>The inventory of inputs with sizes and digests, and what is needed to re-run the computation.</li>
          <li>A plain-language summary of what the evidence supports, what it does not, and what was not examined.</li>
        </ul>
        <p>The record is yours and stays private unless you release it.</p></dd>
        <dt>Takes</dt>
        <dd>Typically four weeks from an agreed boundary and claim. The written scope gives the date.</dd>
        <dt>Know this first</dt>
        <dd><p>The method that exists today answers one kind of question: mangrove canopy extent in one period, from Sentinel-1 and Sentinel-2, compared with Global Mangrove Watch. It has been run once in public, where it <a href="/observatory.html">refused to give a figure</a>. It has not been validated in the field. A run on your site is a pilot and is described as one.</p>
        <p>Satellites at this resolution see closed canopy. They do not see newly planted seedlings, species, biomass or carbon.</p></dd>
      </dl>
    </article>

    <article class="service" id="review">
      <div class="service__head">
        <p class="eyebrow">Before verification, rating or a funding decision</p>
        <h2>Evidence readiness review</h2>
        <p class="service__for">For carbon, nature-asset and restoration projects whose claims will be examined by a verifier, a rating agency, a funder or the press.</p>
        <p class="price">${amount(p.review, "Fixed price")}<span class="price__basis">Fixed. 50 % on confirmation of scope, 50 % on delivery. The same instrument as ${out(site.company.commissions_page, "KRYONIS commission C-03")}.</span></p>
      </div>
      <dl class="spec">
        <dt>You send</dt>
        <dd>The claims as you make them, and the material behind them: maps, boundaries, monitoring data, method documents, earlier findings.</dd>
        <dt>We do</dt>
        <dd><ul>
          <li>Set each claim against the evidence supplied for it, and note what is missing.</li>
          <li>Try to regenerate the headline figures from what you sent: same data, same steps, same result?</li>
          <li>Check boundaries, dates, versions and provenance. Where the question allows, compare area claims with open satellite sources.</li>
        </ul></dd>
        <dt>You receive</dt>
        <dd><ul>
          <li>A written review in which every claim is marked supported, not supported, or not checkable from the material.</li>
          <li>The gaps in order of consequence, with what to fix, what to prove and what to withdraw.</li>
          <li>A closing exchange in writing with your principals.</li>
        </ul>
        <p>Confidential by default. The document belongs to you.</p></dd>
        <dt>Takes</dt>
        <dd>21 days from receipt of the material.</dd>
        <dt>Know this first</dt>
        <dd>This is a review by an independent specialist, not a verification statement and not an assurance engagement. BCCS is not an accredited validation and verification body and does not replace one.</dd>
      </dl>
    </article>

    <article class="service" id="room">
      <div class="service__head">
        <p class="eyebrow">Your records, kept the way ours are</p>
        <h2>Evidence room</h2>
        <p class="service__for">For a programme, a fund or a research group that must keep its own evidence in a form others can inspect.</p>
        <p class="price">${amount(p.room, "By written proposal")}<span class="price__basis">Set-up and a yearly fee, quoted for your programme after a written exchange about what it must hold.</span></p>
      </div>
      <dl class="spec">
        <dt>What it is</dt>
        <dd>A dedicated installation of the software that runs the ${out(`${site.observatory}/`, "BCCS Evidence Observatory")}, on a server for your programme alone.</dd>
        <dt>It includes</dt>
        <dd><ul>
          <li>A registry of immutable records. A correction is a new record that names the one it replaces.</li>
          <li>Intake that recomputes every size and SHA-256 and refuses a package that does not match itself.</li>
          <li>A private workspace with signed-in roles and an audit trail.</li>
          <li>A publication step: nothing is public until a named person approves the set.</li>
          <li>A public reading room, and a static copy that can be hosted anywhere.</li>
        </ul></dd>
        <dt>Know this first</dt>
        <dd><p>It is one installation per programme, not a self-service product with accounts for many organisations. Record types beyond those of the demonstrator are added as part of the engagement.</p>
        <p>The software has been reviewed and tested by its builder. It has not had an independent security audit.</p></dd>
      </dl>
    </article>

    <article class="service" id="question">
      <div class="service__head">
        <p class="eyebrow">The small first step</p>
        <h2>One question, answered in writing</h2>
        <p class="service__for">For anyone who needs a second opinion on one point before deciding anything larger.</p>
        <p class="price">${amount(p.question, "Fixed price")}<span class="price__basis">Fixed. The same instrument as ${out(site.company.commissions_page, "KRYONIS commission C-00")}.</span></p>
      </div>
      <dl class="spec">
        <dt>You send</dt>
        <dd>One question about a claim, a method or a dataset. “Can this figure be re-run from what the report gives?” “What would a verifier ask about this boundary?” “Is satellite data able to answer this at all?”</dd>
        <dt>You receive</dt>
        <dd>A memo of five to seven pages: the answer, the evidence it rests on, the case against it, and the next decision it opens.</dd>
        <dt>Takes</dt>
        <dd>Five working days from confirmation of scope.</dd>
      </dl>
    </article>

  </div>
</section>

<section class="band band--tint" aria-labelledby="run-h">
  <div class="wrap">
    <div class="split">
      <div>
        <h2 id="run-h">How an engagement runs</h2>
        <ol class="aside-list">
          <li><strong>You write.</strong> A few sentences on the site, the claim and the decision it feeds. No call and no deck are needed.</li>
          <li><strong>You receive a written scope within ${e(site.contact.reply_within)}:</strong> what will be delivered, by which date, at which price. If the question is outside what the evidence can answer, the reply says so and nothing is charged.</li>
          <li><strong>You confirm.</strong> ${e(site.company.legal_name)} (${e(site.company.place)}) sends the invoice. Work starts on confirmation.</li>
          <li><strong>The work is done in writing.</strong> Questions and interim findings reach you by email, so there is a record of what was asked and answered.</li>
          <li><strong>Delivery.</strong> One round of clarification is included.</li>
        </ol>
      </div>
      <div class="card">
        <h3>Terms that do not move</h3>
        <ul class="list-yes">
          <li>The fee never depends on the outcome. Nobody is charged for a favourable conclusion.</li>
          <li>Who commissioned a record and who paid for it is written in the record.</li>
          <li>Your material stays private. Nothing is published without your written release.</li>
          <li>The method is fixed before the data is opened and is not changed afterwards.</li>
          <li>A record is not a certificate and is never sold as one.</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section class="band" aria-labelledby="fit-h">
  <div class="wrap narrow">
    <h2 id="fit-h">When this is not the right service</h2>
    <ul>
      <li><strong>You need a verification statement for a registry.</strong> That takes an accredited validation and verification body. A readiness review can come before it, not instead of it.</li>
      <li><strong>You need survival counts for a planting that is one or two years old.</strong> That is field work. Satellite canopy evidence becomes useful some years after planting.</li>
      <li><strong>You need carbon stock, biomass or biodiversity.</strong> None of these is measured here.</li>
      <li><strong>You need a favourable answer by a date.</strong> The method may refuse, and the fee is the same.</li>
    </ul>
    <p>Not sure which side of the line your question falls on? The <a href="/evidence-readiness-checklist.html">evidence readiness checklist</a> takes five minutes and asks nothing about who you are.</p>
  </div>
</section>

${cta(ctx)}
`,
  };
};
