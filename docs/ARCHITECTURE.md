# Architecture

> **Purpose:** Describe the repository’s current technical shape, data flow, media handling, and environment boundaries without treating implementation details as permanent.
>
> **Document version:** 1.0.0
>
> **Last updated:** 2026-07-30

## Architectural intent

Garden Brain is an application platform. The website is its first presentation layer. Canonical garden data, stable identity, provenance, reconciliation, governance, validation, and business rules remain presentation-independent whenever practical. Browser globals are compatibility adapters for the current website, not the sole canonical authority. This Foundation release does not introduce an API, database, native client, authentication redesign, or application framework.

The central flow is:

> Garden Walk → Garden Brain private memory → organization and review → privacy review → explicitly published material → The Pollinator Path public story.

Garden Brain remembers. The Pollinator Path curates. The current public repository is suitable only for explicitly published records. Device-only drafts are not a durable private archive, and a future private storage layer must remain separate from the public repository.

See [Project Philosophy](../PROJECT_PHILOSOPHY.md), [Data Model](DATA_MODEL.md), and [Security and Privacy Architecture](../SECURITY-PRIVACY.md) for the values and integrity constraints behind this boundary.

## Repository architecture

Repository inspection currently shows a static web application with browser-side JavaScript, file-backed records, an image library, documentation, utility scripts, and a Cloudflare Worker.

### Public presentation layer

Root-level HTML, CSS, and JavaScript provide the public website and Garden Brain interfaces. Observed responsibilities include:

- homepage and ecological storytelling;
- plant, wildlife, resident, observation, object, and map views;
- Garden Walk capture and review;
- taxonomy administration;
- task and dashboard interfaces; and
- browser-side media preparation.

There is no inspected evidence of a conventional compiled frontend build step. Contributors should verify this assumption if a future branch introduces one.

### Domain and interaction layer

Browser JavaScript connects interface behavior to file-backed project records. Responsibilities are distributed across purpose-specific scripts rather than a single application framework.

Important rule: file format does not reduce historical importance. JavaScript data files containing observations, identities, or plant history are records, not disposable generated assets.

### Data layer

Repository inspection identifies root-level record files including:

- `observations.js`
- `species.js`
- `data.js`
- `residents.js`
- `objects.js`
- `placements.js`
- `image-manifest.js`

Additional files may also contain domain information. The conceptual model and integrity rules are documented in [DATA_MODEL.md](DATA_MODEL.md).

**Inspection placeholder:** document the authoritative writer, schema/version strategy, and merge behavior for each record file after those paths are traced and approved.

### Service layer

The `worker/` directory contains a Cloudflare Worker used for guarded publishing and AI-assisted requests. Inspected configuration distinguishes staging settings and a production-oriented configuration.

The Worker must enforce the private/public boundary and must not be treated as permission to publish automatically. Secrets belong in environment secret storage, not in tracked files.

**Inspection placeholder:** document each public Worker endpoint, its authentication requirements, allowed origins, validation behavior, and repository-write scope after a focused security review.

### Documentation and operational records

The repository contains:

- durable decisions and project principles;
- security and privacy guidance;
- release notes and changelogs;
- version-specific verification checklists;
- roadmaps and known limitations; and
- repository-export guidance.

Historical documents should remain historical. New states should be documented in new release records rather than by silently rewriting prior evidence.

## Data flow

The intended high-level flow is:

1. A person notices and records a Garden Walk event.
2. Garden Brain holds the private memory and supporting material.
3. Human and optional AI review organize subjects, identification proposals, confidence, narrative, and relationships.
4. The person completes an explicit privacy and publication review.
5. The publishing service validates the approved payload.
6. Public records and prepared media are written to the public repository.
7. The static site presents the curated public story.

At every step, the original observation remains primary. Identification, narrative polish, portrait selection, and public presentation are related records or views; none may erase the underlying event.

**Inspection placeholder:** confirm which private draft fields remain browser-local, which fields reach the Worker, and which sanitized fields are committed publicly for the current release.

## Media handling

The repository stores public media under `images/`, using subject-oriented and observation-oriented paths. The browser uploader can prepare web-sized JPEG copies and update `image-manifest.js`.

Architectural constraints:

- Photos support observations; they are not the primary historical entity.
- Media changes must preserve observation links.
- Original photographs must not be destructively modified by an automated workflow.
- Metadata removal does not replace visual privacy review.
- Portrait selection is presentation metadata and must not reassign or delete subject relationships.
- Missing or intentionally unpublished media must degrade safely.

See [Security and Privacy Architecture](../SECURITY-PRIVACY.md) for current safeguards and limitations.

## Environments

### Local

Local development is used for inspection, documentation, static review, and isolated testing. A local web server is preferable to opening files directly when browser behavior depends on origin rules.

Local work must not assume that production data or secrets are available. Environment-specific actions should identify their target visibly.

**Inspection placeholder:** record the approved local startup commands and any required non-secret environment variables.

### Staging

Staging is the release-candidate review environment. Repository inspection shows a staging Worker configuration targeting the beta branch and staging origins.

Staging is used to validate behavior, data integrity, media publishing, privacy gates, and regression risk without changing production. A release candidate is not approved merely because it was deployed to staging.

**Inspection placeholder:** record the canonical staging URLs, branch protections, and deployment trigger after ownership is confirmed.

### Production

Production is the public, stable experience. It must change only through the approved [Release Process](RELEASE_PROCESS.md).

Production promotion requires validated artifacts, completed human review, data and media integrity checks, rollback readiness, and explicit approval. Production must never be used as an exploratory test environment.

**Inspection placeholder:** record the canonical production branch, deployment trigger, and rollback operator after they are confirmed.

## Cross-cutting constraints

- Preserve historical records and identifiers.
- Merge new information; do not replace datasets.
- Keep uncertainty and confidence explicit.
- Separate private memory from public story.
- Require human approval for publication and production changes.
- Prefer production stability over release speed.
- Keep implementation documentation tied to inspected evidence.
- Keep canonical domain rules out of the service worker; `sw.js` is limited to caching, asset lifecycle, and offline behavior.
- Preserve interfaces that can later serve desktop, mobile, tablet, local-first, API-backed, or other clients without replacing stable IDs.

## Foundation reconciliation implementation

The Foundation candidate keeps immutable reconciliation evidence under `docs/evidence/reconciliation/foundation-4.4.0-rc.1/`. The website consumes active file-backed projections while the canonical preview, disposition ledger, source hashes, and implementation decisions remain separate audit assets.

- `data.js` retains the plant and legacy `window.VISITORS` domains.
- `species.js` supplies the distinct modern `window.GARDEN_SPECIES` domain.
- `observations.js`, `residents.js`, and `image-manifest.js` retain their established browser adapters.
- `scripts/foundation-reconciliation.mjs` validates the active projection against frozen evidence without changing runtime data.
- `sw.js` caches `species.js` for offline use but contains no canonical taxonomy or reconciliation rules.

The verified production snapshot remains historical evidence of the legacy deployed model. It is not overwritten by the Foundation candidate.

For contributor behavior, continue with [START-HERE](../START-HERE.md), [Design Principles](DESIGN_PRINCIPLES.md), and [AI Guardrails](AI_GUARDRAILS.md).
