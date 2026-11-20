import { cta, e, more, out, pageHead } from "../lib.mjs";

export default (ctx) => {
  const { site } = ctx;
  return {
    path: "use-cases.html",
    nav: "use-cases",
    priority: "0.8",
    title: "Who it is for: funders, projects, researchers",
    description: "Where a re-runnable area record helps: funding against mangrove restoration milestones, preparing for verification or rating, publishing figures others can re-run.",
    body: `
${pageHead({
  crumbs: [["BCCS", "/"], ["Who it is for"]],
  eyebrow: "Who it is for",
  title: "Three situations where someone must act on an area claim",
  lead: "These are the uses BCCS was built for. They are hypotheses, stated as such in the programme record: there is no customer yet, and none is named here.",
})}

<section class="band" id="funders" aria-labelledby="fu-h">
  <div class="wrap">
    <div class="split">
      <div class="prose">
        <p class="eyebrow">Funders, development programmes, evaluators</p>
        <h2 id="fu-h">You release money against a restoration or protection milestone</h2>
        <p>The implementer reports the hectares. You have the report, perhaps a map, and a deadline. An evaluation years later may find that the area standing is a fraction of the area reported, and by then the money has moved.</p>
        <h3>What a record adds</h3>
        <ul>
          <li>An area check that does not come from the implementer and that your own evaluator can re-run.</li>
          <li>A date and a validity window: the record says which period it covers and nothing about any other.</li>
          <li>An explicit outcome. If the satellite evidence cannot settle the question, you are told that instead of being given a number.</li>
        </ul>
        <h3>Where it stops</h3>
        <p>A planting that is one or two years old does not show as canopy from orbit. For early survival you need field counts. A record becomes informative for established stands, for baselines before a project starts, and for loss.</p>
        <p>${more("/services.html#site-check", "Site evidence check")} · ${more("/contact.html?need=site-check", "Ask about a site")}</p>
      </div>
      <aside class="card">
        <h3>A question worth asking your implementer</h3>
        <p>“If we handed your area figure, your boundary file and your data to a stranger, could they arrive at the same number without calling you?”</p>
        <p class="small muted">If the answer is no, the figure rests on trust. That may be acceptable. It should be a decision and not an accident.</p>
      </aside>
    </div>
  </div>
</section>

<section class="band band--tint" id="projects" aria-labelledby="pr-h">
  <div class="wrap">
    <div class="split">
      <div class="prose">
        <p class="eyebrow">Project developers, verification bodies, rating agencies, insurers</p>
        <h2 id="pr-h">You want to know whether a claim will survive examination</h2>
        <p>A verification visit, a rating and an investigative article all do the same thing to a project: they test its claims against whatever evidence can be found. It is cheaper to run that test yourself, first.</p>
        <h3>What a review adds</h3>
        <ul>
          <li>Every claim set against the evidence supplied for it: supported, not supported, or not checkable.</li>
          <li>An attempt to regenerate the headline figures from your own material.</li>
          <li>The gaps in order of consequence, so that the fixing starts with what matters.</li>
        </ul>
        <h3>Where it stops</h3>
        <p>BCCS is not an accredited validation and verification body. A review prepares for verification and cannot stand in for it. It does not apply a registry’s methodology on the registry’s behalf, and it does not involve a field visit.</p>
        <p>${more("/services.html#review", "Evidence readiness review")} · ${more("/evidence-readiness-checklist.html", "Try the checklist first")}</p>
      </div>
      <aside class="card">
        <h3>For those who examine</h3>
        <p>If you verify, rate or insure projects, a re-runnable area record is a second line of evidence that did not originate with the project. It costs you nothing to read, and you can repeat it.</p>
        <p class="small muted">A record states who commissioned it and who paid.</p>
      </aside>
    </div>
  </div>
</section>

<section class="band" id="research" aria-labelledby="re-h">
  <div class="wrap">
    <div class="split">
      <div class="prose">
        <p class="eyebrow">Research groups, NGOs, journalists</p>
        <h2 id="re-h">You publish a figure, or you are checking one</h2>
        <p>A reviewer asks how the map was made. A reader asks whether the number can be trusted. A year later a colleague asks which version of the data was used. A record answers all three with files.</p>
        <h3>What a record adds</h3>
        <ul>
          <li>Inputs frozen with their digests, so “which data” has one answer.</li>
          <li>A method registered before the result, so “was it tuned” has one answer.</li>
          <li>A public page others can cite, and a computation they can repeat.</li>
        </ul>
        <h3>Where it stops</h3>
        <p>A record is not peer review and does not make a method valid. It makes the work inspectable, which is what a reviewer needs in order to start.</p>
        <p>${out(`${site.observatory}/evidence`, "See the evidence explorer")} · ${more("/services.html#room", "Evidence room for a programme")}</p>
      </div>
      <aside class="card">
        <h3>Looking into someone else’s figure?</h3>
        <p>Start with <a href="/services.html#question">one question in writing</a>: can this figure be re-run from what was published, and if not, what is missing?</p>
        <p class="small muted">An answer of “it cannot be checked” is a finding, and often the important one.</p>
      </aside>
    </div>
  </div>
</section>

${cta(ctx)}
`,
  };
};
