import { e, pageHead } from "../lib.mjs";

export default (ctx) => {
  const { site } = ctx;
  const direct = Boolean(site.form.endpoint);
  const opt = '<span class="opt">(optional)</span>';
  return {
    path: "contact.html",
    nav: "contact",
    priority: "0.8",
    title: "Request a proposal",
    description: "Describe the site, the claim and the decision it feeds. A written scope with a deliverable, a date and a price follows within two working days.",
    body: `
${pageHead({
  crumbs: [["BCCS", "/"], ["Request a proposal"]],
  eyebrow: "Request a proposal",
  title: "Tell us the site, the claim and the decision",
  lead: `A few sentences are enough. You receive a written scope with a deliverable, a date and a price within ${e(site.contact.reply_within)}. If the question is one that open satellite evidence cannot answer, the reply says so.`,
})}

<section class="band" aria-label="Request form">
  <div class="wrap">
    <div class="split">
      <div>
        <form class="form" data-enquiry data-endpoint="${e(site.form.endpoint)}" data-email="${e(site.contact.email)}" data-reply="${e(site.contact.reply_within)}" novalidate>
          <div class="form__row">
            <div class="field"><label for="f-name">Your name</label><input id="f-name" name="name" type="text" autocomplete="name" required aria-describedby="f-name-error"><span class="error" id="f-name-error" aria-live="polite"></span></div>
            <div class="field"><label for="f-email">Work email</label><input id="f-email" name="email" type="email" autocomplete="email" inputmode="email" required aria-describedby="f-email-error"><span class="error" id="f-email-error" aria-live="polite"></span></div>
          </div>
          <div class="form__row">
            <div class="field"><label for="f-institution">Organisation</label><input id="f-institution" name="institution" type="text" autocomplete="organization" required aria-describedby="f-institution-error"><span class="error" id="f-institution-error" aria-live="polite"></span></div>
            <div class="field"><label for="f-need">What you are asking for</label>
              <select id="f-need" name="need">
                <option value="unsure">Not sure yet</option>
                <option value="site-check">Site evidence check</option>
                <option value="review">Evidence readiness review</option>
                <option value="room">Evidence room for a programme</option>
                <option value="question">One question, answered in writing</option>
                <option value="review-us">I would like to review your method</option>
                <option value="other">Something else</option>
              </select>
            </div>
          </div>
          <div class="field">
            <label for="f-message">The site, the claim and the decision it feeds</label>
            <span class="hint" id="f-message-hint">For example: where the area is and roughly how large, what is being claimed about it and for which period, who has to decide what on the strength of it.</span>
            <textarea id="f-message" name="message" required aria-describedby="f-message-hint f-message-error"></textarea>
            <span class="error" id="f-message-error" aria-live="polite"></span>
          </div>
          <details class="more">
            <summary>Add details if you have them <span class="opt">(all optional)</span></summary>
            <div class="form__row">
              <div class="field"><label for="f-role">Your role ${opt}</label><input id="f-role" name="role" type="text" autocomplete="organization-title"></div>
              <div class="field"><label for="f-use">What the result is for ${opt}</label>
              <select id="f-use" name="use">
                <option value="">Choose if it applies</option>
                <option value="funding">A funding decision or a milestone payment</option>
                <option value="verification">Preparing for verification or a rating</option>
                <option value="monitoring">Our own monitoring and reporting</option>
                <option value="research">Research or publication</option>
                <option value="other">Something else</option>
              </select>
            </div>
            </div>
            <div class="form__row">
              <div class="field"><label for="f-region">Country or region of the site ${opt}</label><input id="f-region" name="region" type="text"></div>
              <div class="field"><label for="f-sites">Number of sites ${opt}</label>
              <select id="f-sites" name="sites">
                <option value="">Choose if it applies</option>
                <option value="1">One</option>
                <option value="2-5">Two to five</option>
                <option value="6-20">Six to twenty</option>
                <option value="20+">More than twenty</option>
              </select>
            </div>
            </div>
            <div class="form__row">
              <div class="field"><label for="f-timeline">When you need it ${opt}</label>
              <select id="f-timeline" name="timeline">
                <option value="">Choose if it applies</option>
                <option value="month">Within a month</option>
                <option value="quarter">Within three months</option>
                <option value="later">Later</option>
                <option value="exploring">Exploring, no date</option>
              </select>
            </div>
              <div class="field"><label for="f-budget">Budget band ${opt}</label>
              <select id="f-budget" name="budget">
                <option value="">Prefer not to say</option>
                <option value="under-1k">Under USD 1,000</option>
                <option value="1k-5k">USD 1,000 to 5,000</option>
                <option value="5k-20k">USD 5,000 to 20,000</option>
                <option value="over-20k">Over USD 20,000</option>
              </select>
            </div>
            </div>
          </details>
          <div class="trap" aria-hidden="true"><label for="f-website">Leave this field empty</label><input id="f-website" name="website" type="text" tabindex="-1" autocomplete="off"></div>
          <div class="form__foot">
            <button class="btn" type="submit">${direct ? "Send the request" : "Write the request as an email"}</button>
            <p>${direct ? `Your request goes to ${e(site.contact.email)}.` : `This puts your answers into an email addressed to ${e(site.contact.email)}, which you send from your own mail. Nothing is transmitted by this page.`} How it is handled: <a href="/privacy.html">privacy</a>.</p>
          </div>
          <div class="form__status" id="enquiry-status" role="status" aria-live="polite"></div>
          <noscript><p class="note note--refuse">This form needs JavaScript. Without it, write to <a href="mailto:${e(site.contact.email)}">${e(site.contact.email)}</a> with the same points.</p></noscript>
        </form>
      </div>
      <aside>
        <div class="card" style="margin-bottom:1.1rem">
          <h2 style="font-size:1.35rem">Or write directly</h2>
          <p><a href="mailto:${e(site.contact.email)}"><strong>${e(site.contact.email)}</strong></a></p>
          <p class="small muted">${e(site.company.legal_name)}, ${e(site.company.place)}. Correspondence is in writing; a call can follow once the question is clear.</p>
        </div>
        <div class="card">
          <h2 style="font-size:1.35rem">What happens next</h2>
          <ol class="aside-list">
            <li>You receive a written reply within ${e(site.contact.reply_within)}.</li>
            <li>If the question fits, the reply is a one-page scope: deliverable, date, price.</li>
            <li>If it does not fit, the reply says why, and where you might turn instead.</li>
            <li>Nothing is charged and nothing starts until you confirm the scope in writing.</li>
          </ol>
          <p class="small muted">If no reply arrives in that time, something failed on our side. Please write again to the address above.</p>
        </div>
      </aside>
    </div>
  </div>
</section>
`,
  };
};
