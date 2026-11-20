import { e, pageHead } from "../lib.mjs";

const GROUPS = [
  [
    "The claim",
    [
      ["The claim is one sentence with a quantity, a place and a period", "A claim that cannot be stated in one sentence cannot be tested in one piece."],
      ["The boundary exists as a file, with a version and a date", "Most disputes about area begin with two parties measuring different shapes."],
      ["It is written down what the claim does not cover", "Readers assume the widest meaning unless they are told the narrow one."],
    ],
  ],
  [
    "The data",
    [
      ["Every dataset behind the figure is listed with its source, date and version", "“Satellite data” is not a source. A scene identifier is."],
      ["The files are stored, and you can show they have not changed", "A checksum recorded at the time is enough. A fresh download later is a different input."],
      ["A third party could obtain the same inputs without asking you", "If the inputs live only with the author, nobody else can repeat the work."],
    ],
  ],
  [
    "The method",
    [
      ["The method was written down before the result was produced", "Otherwise nobody, including you, can show that it was not adjusted to fit."],
      ["Thresholds and other choices are stated, with the reason for each", "Every threshold is a choice. An unstated choice looks like a hidden one."],
      ["The figure has been regenerated from the stored inputs by someone who did not produce it", "This is the difference between “we computed” and “it can be computed”."],
      ["Uncertainty is given as a range, and the main choices have been varied to see if the answer holds", "A single number with no range claims a precision nobody has."],
    ],
  ],
  [
    "Review",
    [
      ["Someone outside the project has examined the method and the result", "Internal checks catch slips. They do not supply independence."],
      ["It is recorded who commissioned and who paid for the work behind the figure", "Readers will ask. It is better that the record answers first."],
    ],
  ],
];

export default (ctx) => {
  let n = 0;
  return {
    path: "evidence-readiness-checklist.html",
    nav: "insights",
    priority: "0.7",
    title: "Evidence readiness checklist for area claims",
    description: "Twelve points that decide whether an area claim about a forest, mangrove or restoration site can be checked by someone else. Free, five minutes, nothing is sent anywhere.",
    body: `
${pageHead({
  crumbs: [["BCCS", "/"], ["Notes", "/insights/"], ["Evidence readiness checklist"]],
  eyebrow: "Tool",
  title: "Could someone else check your area claim?",
  lead: "Twelve points, in four groups. Answer for one claim: the hectares in a report, a baseline, a restoration milestone. Your answers stay in this browser. Nothing is sent anywhere unless you decide to add the summary to a request.",
})}

<section class="band">
  <div class="wrap narrow">
    <form data-checklist novalidate>
      ${GROUPS.map(
        ([name, items]) => `<fieldset class="check-group">
        <legend>${e(name)}</legend>
        ${items
          .map(([text, why]) => {
            n += 1;
            const id = `q${n}`;
            return `<div class="check-item" data-item="${e(text)}" role="group" aria-labelledby="${id}-t">
          <div><p id="${id}-t"><strong>${n}.</strong> ${e(text)}</p><p class="why">${e(why)}</p></div>
          <div class="choice">
            <label><input type="radio" name="${id}" value="yes"><span>Yes</span></label>
            <label><input type="radio" name="${id}" value="partly"><span>Partly</span></label>
            <label><input type="radio" name="${id}" value="no"><span>No</span></label>
          </div>
        </div>`;
          })
          .join("\n        ")}
      </fieldset>`,
      ).join("\n      ")}
      <p class="actions" style="margin-top:0"><button class="btn" type="submit">Show the summary</button></p>
      <noscript><p class="note note--refuse">The summary needs JavaScript. The twelve points above are the whole checklist and can be used as they stand.</p></noscript>
    </form>

    <div class="result" id="checklist-result" tabindex="-1" hidden style="margin-top:1.5rem">
      <h2>Your summary</h2>
      <div data-out></div>
      <div class="note note--plain">
        <p><strong>What this is.</strong> A structured list of your own answers. It carries no score and no judgement of your project, and it says nothing about whether the claim is true.</p>
      </div>
      <p class="actions"><a class="btn" id="checklist-send" href="/contact.html?need=review&amp;from=checklist">Add this to a request</a> <a class="btn btn--ghost" href="/services.html#review">What a readiness review covers</a></p>
    </div>

    <div class="prose" style="margin-top:2.5rem">
      <h2>How to read the result</h2>
      <p>Points one to six are housekeeping. They cost time, not expertise, and a project can usually put them right itself.</p>
      <p>Points seven to ten are where claims fail under examination. A method written after the result, an unvaried threshold, a figure only its author has produced: these are what a verifier, a rating analyst or a journalist will find.</p>
      <p>Points eleven and twelve cannot be fixed from the inside. They need someone else.</p>
      <p>The checklist follows the way the <a href="/method.html">BCCS method</a> treats its own records, including the parts where the demonstrator still answers “no”.</p>
    </div>
  </div>
</section>
`,
  };
};
