# Garden Brain 4.3.1 Beta 4 — Taxonomy & Merge Tools

## Implemented
- Admin-only visual taxonomy manager at `taxonomy-admin.html`.
- Worker-backed identification refinement that appends history rather than overwriting it.
- Parent-taxon, rank, confidence, aliases, scientific name, and identification notes.
- Visual duplicate merge preview with observation, photo-reference, and resident impact counts.
- Atomic Worker merge of `species.js`, `observations.js`, and `residents.js`.
- Losing species IDs remain stored as private redirect records through `mergedInto`.
- Survivor records retain merged aliases, redirect IDs, and both identification histories.
- Living Stories resolves merged IDs so old observation links continue to reach the survivor.
- Circular merges, self-merges, and refinement of retired records are blocked.

## Not implemented in this beta
- External taxonomy-database lookup or automatic synonym authority.
- AI-proposed merge decisions without user approval.
- Undo button in the UI. Git history remains the rollback mechanism.
- Full image duplicate clustering or AI hero-image ranking.

## Tests performed locally
- JavaScript syntax checks for all project `.js` files and Worker source.
- HTML link/script reference audit.
- Static migration verification for all bundled species records.

## Requires staging verification
- Real Cloudflare Worker authentication.
- Atomic GitHub commit behavior on the configured staging branch.
- Cross-device persistence after refine and merge.
- Cloudflare/GitHub conflict retry under simultaneous edits.
