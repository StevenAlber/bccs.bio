import { cta, e, out, pageHead } from "../lib.mjs";

export default (ctx) => {
  const { site, record: r } = ctx;
  const c = site.company;
  const by = r.review.internal_acceptance?.by;
  return {
    path: "company.html",
    nav: "company",
    priority: "0.6",
    title: "Company: who does the work",
    description: "Who is behind BCCS evidence services: the company, the founder, how the work is done, what BCCS is not, and an open invitation to review the method.",
    body: `
${pageHead({
  crumbs: [["BCCS", "/"], ["Company"]],
  eyebrow: "Company",
  title: "Who does the work, and how",
  lead: "A buyer should know who they are dealing with before they write. This page is the plain account, including the parts a larger firm would leave out.",
})}

<section class="band" aria-labelledby="who-h">
  <div class="wrap">
    <div class="split">
      <div class="prose">
        <h2 id="who-h">The company</h2>
        <p>BCCS is a programme of <strong>${e(c.legal_name)}</strong>, incorporated in ${e(c.place)}. Contracts and invoices are in that company’s name.</p>
        <p>The founder is <strong>${e(c.founder)}</strong>, who directs strategy and the programme. The company is small. There is no sales team: the person who answers your message is the person responsible for the work.</p>

        <h2>How the work is done</h2>
        <p>Much of the engineering is done by software agents working under written instructions, in stages that each leave their own records: a method file, the runs of an automated test system, an acceptance note. The public record says so itself. The internal acceptance of Demonstrator 001 is attributed to “${e(by ?? "the programme")}”.</p>
        <p>That is the reason a record is built the way it is. It does not ask you to trust who or what did the computing. The inputs, the rule and the steps are stored so that someone else can do it again.</p>

        <h2>What BCCS is not</h2>
        <ul>
          <li>Not an accredited validation and verification body, and not seeking to act as one.</li>
          <li>Not a laboratory, a university group or a standards body.</li>
          <li>Not independently validated: no outside scientist has yet reviewed the method. See below.</li>
          <li>Not a company with customers to point to. There are none yet, and the programme record says so.</li>
        </ul>

        <h2>Independence and money</h2>
        <ul>
          <li>The fee for a record never depends on its outcome.</li>
          <li>Who commissioned a record and who paid for it is written in the record.</li>
          <li>Payment is by invoice. No part of an evidence engagement involves a token, a licence or a blockchain transaction.</li>
          <li>KRYONIS also publishes a protocol concept that includes a token and node licences. It is described, with the state of every part, on the <a href="/protocol.html">protocol research</a> page. The evidence service does not depend on it.</li>
        </ul>

        <h2>The name</h2>
        <p>Earlier documents expand the letters BCCS in more than one way. On this site BCCS is used as a name, and the service is described by what it does.</p>
      </div>
      <aside>
        <div class="card" style="margin-bottom:1.1rem">
          <h3>At a glance</h3>
          <dl class="spec" style="grid-template-columns:minmax(0,1fr)">
            <dt style="border:0;padding-bottom:0">Legal entity</dt><dd style="padding-top:.2rem">${e(c.legal_name)}</dd>
            <dt style="border:0;padding-bottom:0">Jurisdiction</dt><dd style="padding-top:.2rem">${e(c.place)}</dd>
            <dt style="border:0;padding-bottom:0">Write to</dt><dd style="padding-top:.2rem"><a href="mailto:${e(site.contact.email)}">${e(site.contact.email)}</a></dd>
            <dt style="border:0;padding-bottom:0">Reply</dt><dd style="padding-top:.2rem">In writing, within ${e(site.contact.reply_within)}</dd>
            <dt style="border:0;padding-bottom:0">Parent site</dt><dd style="padding-top:.2rem;border:0">${out(`${c.parent_site}/`, "kryonis.global")}</dd>
          </dl>
        </div>
        <div class="card">
          <h3>Other things KRYONIS publishes</h3>
          <p class="small">KRYONIS is a studio with several lines of work. Its own account of which parts operate and which do not is at ${out(c.status_page, "Operating Status &amp; Proof")}.</p>
        </div>
      </aside>
    </div>
  </div>
</section>

<section class="band band--tint" id="review" aria-labelledby="rev-h">
  <div class="wrap">
    <div class="band__head">
      <p class="eyebrow">An open invitation</p>
      <h2 id="rev-h">Review this work</h2>
      <p>The one thing this programme cannot give itself is an independent opinion. If you work in remote sensing, mangrove ecology, measurement and verification, or research reproducibility, you are invited to find what is wrong with Demonstrator 001.</p>
    </div>
    <div class="grid grid--3">
      <div class="card">
        <h3>What is open now</h3>
        <ul>
          <li>The pre-registered method file and its digest</li>
          <li>The decision steps and every variant’s decision</li>
          <li>The receipt of every request to a data source</li>
          <li>The inventory of frozen inputs</li>
        </ul>
        <p class="card__more">${out(`${site.observatory}/evidence`, "Evidence explorer")}</p>
      </div>
      <div class="card">
        <h3>What a reviewer can be given</h3>
        <p>The withheld files: the class maps of each evidence group, the agreement table and the canonical result record. They are held back from the public because the method refused to state an extent. A reviewer receives them under a short written agreement.</p>
      </div>
      <div class="card">
        <h3>What happens to a review</h3>
        <p>It is recorded with the claim, whatever it concludes, under your name if you wish. External review is budgeted in the programme plan, which is not funded; until it is, a review is unpaid. Nobody is paid for a favourable one.</p>
      </div>
    </div>
    <p class="actions"><a class="btn" href="/contact.html?need=review-us">Offer a review</a> ${out(`${site.observatory}/claims/c-01`, "Read the claim first", "btn btn--ghost")}</p>
  </div>
</section>

${cta(ctx)}
`,
  };
};
