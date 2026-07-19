# Garden Brain 4.3.0 Beta 3 — Living Stories

## Implemented
- Persistent `species.js` taxon records.
- Named residents link to species through `speciesId`.
- One observation can link multiple species through `visitorDetails` and `species`.
- New approved wildlife records are created by the Cloudflare Worker and committed atomically with the observation.
- `/garden` returns species; `/species` supports GET and authenticated POST.
- Public wildlife pages derive timelines, plants visited, behaviors, locations, photos, and named residents from observations.
- Garden Walk memory previews show four photos plus `+N more`.
- Observation pages use a condensed “Moments from this visit” preview.

## Test status
- JavaScript syntax checked locally.
- Static link audit run locally.
- Worker publishing logic inspected and syntax checked.
- Cloudflare/GitHub/R2 integration NOT executed here because secrets and a staging deployment are intentionally absent.

## Known limitations
- Create/link/defer/ignore works in the existing review UI; a dedicated merge editor is not yet included.
- Identification refinement history is stored, but no full taxonomy editor is included.
- Gallery curation uses first-four ordering; AI quality scoring and duplicate clustering are deferred.
- Desktop/mobile hero authoring UI is deferred from this beta.

## Required staging test
Deploy the included Worker to a staging Worker configured for a non-production GitHub branch. Publish an observation containing a known resident plus a new species, reload on a second browser, and verify that `species.js`, `observations.js`, and public living pages persist correctly.
