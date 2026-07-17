# Garden Brain 4.2.0 — The Garden Comes Alive

## Release goal
Make the everyday Garden Walk feel clean and rewarding: upload photos, review what Garden Brain noticed, and publish a connected memory.

## Implemented and testable

- Photo-first **Upload today’s walk** screen.
- Advanced metadata, connection settings, privacy details, and recent-entry tools are collapsed until needed.
- AI identification now requests **all visibly distinct wildlife types** in a photo set rather than returning only one visitor.
- Each suggested visitor can be:
  - linked to an existing wildlife page,
  - proposed as a new wildlife page,
  - kept as a visitor still being identified, or
  - excluded from the memory.
- Published observations preserve structured `visitorDetails` so new sightings have a home even before a hand-authored catalog profile exists.
- **Meet the Wildlife** dynamically includes wildlife discovered through observations, named residents, and existing catalog records.
- Wildlife pages dynamically gather linked plants and observations.
- Plant-page visitor rows are links rather than dead icons.
- New canonical **Observation page** with linked plants, linked wildlife, full photo viewing, and an Edit action.
- Plant journals and Garden Walk entries link to their Observation page.
- Weekly-summary chips now link to plant and wildlife pages.
- Compact photo grids prevent large uploads from taking over a page.
- Every displayed thumbnail opens a full-screen viewer with previous/next controls.
- A static link-audit script is included at `scripts/link-audit.mjs`.

## Important limits

- A daily upload is still saved as one Garden Walk memory. The release can preserve multiple wildlife species inside that memory, but it does not yet split one upload into multiple independent memories automatically.
- “Create a new wildlife page” creates a structured wildlife relationship through the observation. It does not yet open a full species editor before publication.
- AI can recognize several visible wildlife types, but it may still miss tiny, blurred, hidden, or visually similar visitors. Human review remains required.
- Historical archive grouping by EXIF date is intentionally out of scope.
- Living Biographies, seasonal compilation, environmental integrations, video support, and stewardship analytics remain future work.
- Existing OpenAI and Cloudflare configuration is still required. The key remains a Worker secret and is not included in this release.

## Deployment

Deploy the public files and the Worker together. The Worker response schema changed from one `visitor` to a `visitors` array, so mixing old and new versions will break AI review.
