# Garden Brain 4.1.0 — Review, Don’t Re-enter

## Implemented and testable now
- AI-first review cards with color-coded confidence bands (no visible percentages).
- Confirm, change, or keep identification pending.
- “Unknown visitor · Identification pending” is a first-class selection.
- Manual metadata form is progressively disclosed instead of dominating capture.
- Recent-entry editor is limited to the two newest published entries for quick oops fixes.
- AI Usage & Value dashboard tracks requests, photos, tokens, outcomes, response time, normal-use baseline, and estimated time saved in this browser.
- Worker returns OpenAI token usage and request timing to the browser.
- Public navigation copy updates: “See What’s Growing,” “Meet the Wildlife,” and a dedicated Garden Walks timeline page.
- Removed the redundant weekly-summary CTA.

## Important limitations
- AI usage statistics are stored in localStorage on the current browser/device. They are not an official billing total and do not follow you across devices. OpenAI’s billing dashboard remains authoritative.
- A future server-side usage ledger requires Cloudflare KV, D1, Analytics Engine, or another durable store.
- Cost is not estimated in dollars in this release because model pricing can change. Token counts are recorded for accurate reconciliation.
- Garden Walk calendar is a useful first pass, not the final visual calendar design.
- Editing from every individual public entity page is not completed in this release; the data/editor foundation remains available through Garden Brain.

## Prerequisites
- Existing OPENAI_API_KEY Worker secret.
- Deploy updated Worker and public files together.
