import { pageHead } from "../lib.mjs";

export default () => ({
  path: "404.html",
  nav: "",
  noindex: true,
  title: "Page not found",
  description: "This address does not lead to a page on bccs.bio.",
  body: `
${pageHead({ eyebrow: "404", title: "There is no page at this address", lead: "The address may be mistyped, or the page may have moved when the site was rebuilt." })}
<section class="band">
  <div class="wrap narrow">
    <ul>
      <li><a href="/">Start page</a></li>
      <li><a href="/observatory.html">The live evidence record</a></li>
      <li><a href="/services.html">Services and prices</a></li>
      <li><a href="/protocol.html">Protocol research and the documents of April 2026</a></li>
      <li><a href="/contact.html">Request a proposal</a></li>
    </ul>
  </div>
</section>
`,
});
