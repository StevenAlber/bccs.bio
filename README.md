# bccs.bio

The site of BCCS evidence services, a programme of KRYONIS Sovereign Systems Limited. Static pages served by
GitHub Pages from the root of the `main` branch.

## What is where

| Path | What it is |
|---|---|
| `index.html`, `observatory.html`, `services.html`, `method.html`, `use-cases.html`, `company.html`, `protocol.html`, `contact.html`, `privacy.html`, `evidence-readiness-checklist.html`, `insights/`, `404.html`, `sitemap.xml`, `robots.txt`, `assets/`, icons, `share-card.png` | Generated. Do not edit by hand: the next build overwrites them. |
| `_src/` | The sources of the generated files. Not served (GitHub Pages skips names that start with an underscore). |
| `activation-sequence.html`, `audit.html`, `bioclearing.html`, `data-sovereignty.html`, `implementation.html`, `mint.html`, `not-carbon.html`, `terms.html`, `risk.html`, the PDFs, `og-image.png`, `steven-alber.jpeg` | The documents of the protocol concept, April 2026, at their original addresses. The build writes one thing into each page: a status note, between two marker comments. |
| `protocol-home-2026-04.html` | The home page as it was in April 2026, generated from `_src/legacy/index-2026-04-24.html` with the same status note. |
| `_archive/` | Working notes of April 2026 that used to be served from the root. |

## Changing the site

```
node _src/build.mjs                    # writes the pages; needs Node 18 or later and nothing else
node _src/tools/check.mjs              # links, titles, addresses, claims discipline, sitemap
node _src/tools/browser-check.mjs      # every page at eight widths, the menu, the form, the checklist (needs Playwright)
```

- Text and structure: `_src/pages/*.mjs`, one module per page. Shared pieces: `_src/lib.mjs`.
- The contact address, the form service, analytics, search-console tags and prices: `_src/site.json`.
- Appearance: `_src/assets/site.css`. Behaviour: `_src/assets/site.js`.
- Figures and wording quoted from the Observatory: `_src/data/c01-public-record.json`, written by
  `node _src/tools/snapshot.mjs`, which reads the Observatory's public interface. Nothing is typed in by hand.
- The picture of a link preview and the icons: `node _src/tools/make-share-images.mjs` (needs Playwright).

Commit the sources and the generated files together. GitHub Pages publishes whatever is on `main`.

## Rules the checks hold

- The pages of the evidence service state nothing about the demonstrator that is not in the Observatory's public
  record, and no area figure other than the stated research area. For a refused result there is no extent.
- Integrity, reproducibility, validity, independent review and certification are five different things and are
  never used for one another.
- What operates, what is being built and what is a concept are kept apart. The protocol documents describe a
  design; every one of them says so.
- No page of the evidence service loads anything from another host, sets a cookie, or mentions a token.
- A form says what it does. With no form service configured it writes an email for the visitor to send; it never
  reports a delivery that did not happen.

## Typefaces

Fraunces and JetBrains Mono, served from this site under the SIL Open Font License 1.1; the licence texts are in
`assets/fonts/`.
