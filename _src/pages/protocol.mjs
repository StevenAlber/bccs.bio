import { badge, e, out, pageHead } from "../lib.mjs";

export default (ctx) => {
  const { site, record: r } = ctx;
  const c = site.company;
  const anchoring = r.programme.future.find((x) => /attestation/i.test(x));
  const docs = [
    ["BCCS_Whitepaper_v1.0.pdf", "Whitepaper v1.0", "PDF"],
    ["BCCS_Executive_Brief_v3.pdf", "Executive brief v3", "PDF"],
    ["BCCS_BAIN_ID_Specification_v2.0.pdf", "BAIN ID specification v2.0", "PDF"],
    ["BCCS_PoPS_Methodology_v2.0.pdf", "PoPS methodology v2.0", "PDF"],
    ["BCCS_BAIN_Governance_v2.0.pdf", "BAIN governance v2.0", "PDF"],
    ["BCCS_Tokenomics_Litepaper_v2.0.pdf", "Tokenomics litepaper v2.0", "PDF"],
    ["BCCS_Token_Economic_Model_v2.0.pdf", "Token economic model v2.0", "PDF"],
    ["BCCS_Internal_Security_Review_v1.0.pdf", "Internal security review v1.0", "PDF"],
    ["implementation.html", "Implementation architecture", "page"],
    ["data-sovereignty.html", "Data sovereignty architecture", "page"],
    ["activation-sequence.html", "Activation sequence", "page"],
    ["not-carbon.html", "Category and positioning: not a carbon project", "page"],
    ["bioclearing.html", "BioClearing: the clearing layer", "page"],
    ["audit.html", "Internal security review of the contracts", "page"],
    ["mint.html", "Node licence page", "page"],
    ["terms.html", "Protocol terms of service", "page"],
    ["risk.html", "Protocol risk disclosure", "page"],
    ["protocol-home-2026-04.html", "The home page of this site as it was in April 2026", "page"],
  ];
  return {
    path: "protocol.html",
    nav: "protocol",
    priority: "0.4",
    title: "Protocol research (concept): status of every part",
    description: "The BCCS protocol is a design published in April 2026: identifiers, a node network and a token. What is deployed, what operates and what does not.",
    body: `
${pageHead({
  crumbs: [["BCCS", "/"], ["Protocol research"]],
  eyebrow: "Protocol research · concept",
  title: "The BCCS protocol is a design, not an operating network",
  lead: "In April 2026 KRYONIS published a protocol concept: an identifier for biological assets, a network of verification nodes and a token on the Base chain. The documents remain here, unchanged. This page says what state each part is in.",
})}

<section class="band" aria-labelledby="st-h">
  <div class="wrap">
    <div class="note note--refuse" style="margin-bottom:1.5rem">
      <h2 id="st-h" style="font-size:1.3rem">The short version</h2>
      <p>Two contracts are deployed on Base. No verification network operates. No biological asset has been verified through the protocol and no attestation exists. The pages of April 2026 describe the design in the present tense; where they differ from this page, this page and ${out(c.status_page, "the status page of KRYONIS")} take precedence.</p>
    </div>
    <table class="table">
      <thead><tr><th scope="col">Part</th><th scope="col">State</th><th scope="col">What that means</th></tr></thead>
      <tbody>
        <tr><th scope="row">Protocol documents: whitepaper, BAIN ID, PoPS, governance, economic model</th><td data-label="State">${badge("NOT_RUN", "DOCUMENTED")}</td><td data-label="What that means">They describe an architecture and an intent. They are not an account of a running system.</td></tr>
        <tr><th scope="row">$BCCS contract (ERC-20, Base)</th><td data-label="State">${badge("NOT_RUN", "DEPLOYED · NOT OPERATING")}</td><td data-label="What that means">A contract on a public chain. It is not offered as an investment and no public sale is active. ${out("https://basescan.org/address/0xb86174c4c1ca01f0639ce3067306bdf6eeba17a7", "Contract on BaseScan")}</td></tr>
        <tr><th scope="row">Node licence contract (ERC-721, Base)</th><td data-label="State">${badge("NOT_RUN", "DEPLOYED · NOT OPERATING")}</td><td data-label="What that means">A non-transferable credential for a network that does not yet exist. It gives no income and no allocation of any unit, and payments are not refunded. Acquired only by application and approval. ${out("https://basescan.org/address/0x44B46f9D170ae8122cce71332884252934b66FBd", "Contract on BaseScan")}</td></tr>
        <tr><th scope="row">Verification network: nodes, three-tier consensus, slashing</th><td data-label="State">${badge("NOT_RUN", "NOT BUILT")}</td><td data-label="What that means">Planned in the documents. Nothing of it runs.</td></tr>
        <tr><th scope="row">Verification API and BAIN ID registry</th><td data-label="State">${badge("NOT_RUN", "NOT BUILT")}</td><td data-label="What that means">The query and answer shown on the April home page are an illustration of the design. No such service or asset record exists.</td></tr>
        <tr><th scope="row">BioClearing registry</th><td data-label="State">${badge("NOT_RUN", "CONCEPT")}</td><td data-label="What that means">Registry and clearing logic are described. Operation is not claimed.</td></tr>
        <tr><th scope="row">Security of the contracts</th><td data-label="State">${badge("NOT_RUN", "INTERNAL REVIEW ONLY")}</td><td data-label="What that means">Reviewed by KRYONIS itself in April 2026. No independent audit has been done.</td></tr>
        <tr><th scope="row">Anchoring the digests of evidence records on a public chain</th><td data-label="State">${badge("NOT_RUN", "PLANNED")}</td><td data-label="What that means">${e(anchoring ?? "Planned as tamper-evident timestamping of records.")} Not done for any record.</td></tr>
      </tbody>
    </table>
  </div>
</section>

<section class="band band--tint" aria-labelledby="rel-h">
  <div class="wrap">
    <div class="split">
      <div class="prose">
        <h2 id="rel-h">How the concept relates to the evidence service</h2>
        <p>The protocol asks a large question: how could the verified state of a living asset be recorded and relied on between institutions?</p>
        <p>The evidence service answers a smaller and earlier one: for one claim about one area, what does the evidence actually support? The ${out(`${site.observatory}/`, "BCCS Evidence Observatory")} is where that question has been worked through on real data.</p>
        <p>The answer so far is sobering and useful. In the protocol’s own lifecycle the demonstrator site stands at state 01, Unverified: the public record claims no “lifecycle state other than 01 Unverified”, no “completed production PoPS verification” and no “lifecycle transition or a Base attestation”.</p>
        <p>A verification layer is only as good as the evidence underneath it. That is why the evidence work comes first, and why it is offered on its own.</p>
      </div>
      <aside class="card">
        <h3>What an evidence engagement does not involve</h3>
        <ul class="list-no">
          <li>No token and no licence</li>
          <li>No wallet and no blockchain transaction</li>
          <li>No payment other than by invoice</li>
          <li>No reliance on any part of the table above</li>
        </ul>
        <p class="card__more"><a href="/services.html">Services and prices</a></p>
      </aside>
    </div>
  </div>
</section>

<section class="band" aria-labelledby="docs-h">
  <div class="wrap narrow">
    <h2 id="docs-h">The documents of April 2026</h2>
    <p>Kept at their original addresses. Each page carries a note with its status.</p>
    <ul>
      ${docs.map(([href, label, kind]) => `<li><a href="/${e(href)}">${e(label)}</a> <span class="muted small">(${kind})</span></li>`).join("\n      ")}
    </ul>
    <p class="small muted">The protocol is the intellectual property of ${e(c.legal_name)}. Questions about it go to <a href="mailto:${e(site.contact.email)}">${e(site.contact.email)}</a>.</p>
  </div>
</section>
`,
  };
};
