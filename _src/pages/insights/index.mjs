import { cta, pageHead } from "../../lib.mjs";

export default (ctx) => ({
  path: "insights/index.html",
  nav: "insights",
  priority: "0.6",
  title: "Notes on evidence for ecosystem claims",
  description: "Short, sourced notes on what makes an environmental claim checkable: a worked refusal from real data, the vocabulary of verification, and a readiness checklist.",
  body: `
${pageHead({
  crumbs: [["BCCS", "/"], ["Notes"]],
  eyebrow: "Notes",
  title: "Notes on evidence for ecosystem claims",
  lead: "Written from the records, not from opinion. Each note says what it rests on and can be checked against the Observatory.",
})}

<section class="band">
  <div class="wrap narrow">
    <ul class="toc">
      <li><a href="/insights/what-a-refusal-looks-like.html"><p class="eyebrow">Demonstrator 001 · 20 November 2026</p><h2>What a refusal looks like</h2><p>A real measurement ran without error and declined to give a figure. What happened at each step, and why that is the result worth showing first.</p></a></li>
      <li><a href="/insights/integrity-is-not-validity.html"><p class="eyebrow">Vocabulary · 20 November 2026</p><h2>Integrity is not validity</h2><p>A hash match, a replay, a validation, an independent review and a certificate establish five different things. The questions to ask when someone says “verified”.</p></a></li>
      <li><a href="/evidence-readiness-checklist.html"><p class="eyebrow">Tool</p><h2>Evidence readiness checklist</h2><p>Twelve points that decide whether an area claim can be checked by someone else. Five minutes, nothing sent anywhere.</p></a></li>
    </ul>
  </div>
</section>

${cta(ctx)}
`,
});
