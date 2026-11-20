# bccs.bio: the site of BCCS evidence services

Read `README.md` first. Owner: Steven Alber. Site text and repository documents: English. Conversation with the
owner: Estonian.

- This repository is public. Everything pushed to any branch can be read by anyone. Strategy, prices that the owner
  has not decided, research notes and anything internal belong in the private repository `bccs-d001`
  (`commercial/`), never here.
- `main` is the live site: GitHub Pages publishes it within minutes. Work on a branch; putting a branch into
  service is the owner's action.
- Generated files are never edited by hand. Change `_src/`, run `node _src/build.mjs`, then
  `node _src/tools/check.mjs` and `node _src/tools/browser-check.mjs`, and commit sources and output together.
- The documents of the protocol concept (April 2026) keep their addresses and their text. The build adds a status
  note and nothing else. Removing a document, closing the licence page or changing a price is the owner's decision.
- Figures about the demonstrator come from `_src/data/c01-public-record.json` (`node _src/tools/snapshot.mjs`).
  C-01 is INSUFFICIENT_EVIDENCE: no extent figure or range for the site appears anywhere.
- No external action without a specific instruction: no DNS change, no form-service or analytics account, no
  search-console registration, no message sent through any form.
