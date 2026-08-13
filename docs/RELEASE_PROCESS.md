# Release Process

> **Purpose:** Define the minimum workflow for preparing, verifying, approving, promoting, and rolling back a release.
>
> **Document version:** 1.0.0
>
> **Last updated:** 2026-07-30

Production stability is more important than rapid releases. A release is complete only when the exact approved candidate has passed validation, staging review, integrity checks, rollback preparation, and human approval.

This document defines the durable process. Version-specific release notes and checklists provide the concrete evidence for an individual candidate.

## Roles

- **Release owner:** identifies scope, resolves blockers, and requests approval.
- **Reviewer:** verifies behavior, data integrity, privacy, accessibility, and release evidence.
- **Approver:** explicitly authorizes production promotion.
- **AI assistant:** may inspect, prepare, validate, and report; it may not approve, commit, push, deploy, or modify production without explicit authorization.

One person may hold multiple human roles, but approval must still be conscious and recorded.

## 1. Define the candidate

- Assign a unique version or release-candidate identifier.
- State scope, intended behavior, known limitations, and deferred work.
- Identify the source branch and exact commit.
- Create a version-specific release note and verification checklist.
- Confirm that unrelated work is excluded.
- Record data migrations or merge operations explicitly.

Do not reuse an old checklist as though it proves a new candidate.

## 2. Prepare safely

- Confirm the working tree and branch.
- Synchronize with the intended remote before packaging or promotion.
- Preserve a recoverable pre-release state.
- Inspect all changed files.
- Verify that secrets, local caches, dependencies, and private material are not unintentionally included.
- Do not commit, push, or deploy without the applicable approval.

## 3. Local validation

Run checks appropriate to the candidate, including:

- syntax and static link checks;
- targeted functional tests;
- responsive and accessibility review;
- privacy-boundary checks;
- structured-record parsing;
- reference and identifier validation; and
- review of the complete candidate diff.

Local validation does not substitute for staging.

## 4. Data integrity checks

Before staging and again before production:

- Compare observation counts and stable identifiers with the approved baseline.
- Confirm that no historical observation disappeared.
- Confirm that new records were merged rather than substituted for an existing dataset.
- Verify dates, locations, narratives, confidence, and ecological context.
- Verify identification and taxonomy history, aliases, merges, and redirects.
- Confirm named residents remain linked to, but distinct from, taxonomy.
- Check bidirectional relationships among observations, visits, plants, residents, locations, and taxa.
- Review every intentional deletion or consolidation individually.

Any unexplained loss is a release blocker.

## 5. Media integrity checks

- Verify that referenced public files exist.
- Identify orphaned files and distinguish intentional retention from packaging errors.
- Confirm observation-to-photo relationships.
- Verify portraits and gallery images point to the intended subject.
- Confirm that changing a portrait did not change observation ownership or linked subjects.
- Verify derivative preparation without modifying originals.
- Complete human visual privacy review.
- Confirm homepage eligibility remains a separate approval.

Missing media may degrade safely only when the product and release scope explicitly allow it.

Classify unavailable media rather than treating every absent byte identically:

- missing required media is a validation failure;
- media with an approved `QUARANTINE` disposition may remain referenced but inactive;
- an exact curator-approved optional presentation reference may remain unavailable under its recorded classification;
- no generic exception permits unexplained missing media.

## 6. Stage the exact candidate

- Deploy only to the staging environment.
- Record the staged branch, commit, version, URLs, and deployment time.
- Confirm staging services and origins point to staging resources.
- Keep production unchanged.
- Do not make undocumented fixes directly in the staged artifact; create a new candidate when the artifact changes.

## 7. Staging verification

Complete the version-specific checklist, including:

- critical user journeys;
- mobile and desktop behavior;
- accessibility and safe fallbacks;
- Garden Walk capture and review;
- AI unavailable/error behavior;
- privacy and publication gates;
- observation, species, plant, resident, and taxonomy integrity;
- edit propagation;
- media publication and failure atomicity;
- browser-console and service errors; and
- regression checks against production.

Record who tested, when, where, and the result. An unchecked item is not evidence of a pass.

## 8. Prepare rollback

Before approval, document:

- the current production branch, commit, and version;
- the exact action required to restore them;
- any data or media changes that are not reversed by code rollback;
- who can perform rollback;
- post-rollback verification; and
- conditions that trigger rollback.

Rollback instructions must be usable under pressure and must not depend on reconstructing the prior state from memory.

## 9. Production approval

Provide the approver with:

- candidate version and exact commit;
- candidate-to-production diff summary;
- completed verification checklist;
- data and media integrity results;
- known limitations and accepted risks;
- rollback plan; and
- confirmation that staging represents the exact candidate.

Production promotion requires explicit human approval. Silence, a successful staging deployment, or an AI recommendation is not approval.

## 10. Promote and verify

- Promote the exact approved candidate.
- Avoid rebuilding from changed or unverified source.
- Record the production deployment result.
- Run a focused production smoke test.
- Confirm version, critical pages, data visibility, media, privacy boundaries, and service health.
- Roll back promptly if release criteria fail.

## 11. Close the release

- Record the released version and commit.
- Publish or update the changelog and release summary.
- Preserve the completed checklist and approval evidence.
- Record known issues and deferred work without rewriting historical results.
- Confirm the repository is clean and documentation links remain valid.

## Minimum release evidence

A release record is incomplete without:

- unique version;
- source branch and commit;
- scope and known limitations;
- completed staging checklist;
- data-integrity result;
- media-integrity result;
- rollback plan;
- explicit approval; and
- production verification result.

## Foundation release gates

- **Gate 0 — Historical Integrity:** production history, IDs, species references, observations, and media evidence reconcile.
- **Gate 1 — Repository Integrity:** the exact candidate diff, path scope, hashes, and clean state receive human review.
- **Gate 2 — Application Integrity:** automated and browser validation prove canonical parity, safe media classifications, domain separation, and current-client behavior.
- **Gate 3 — Release Integrity:** the exact RC, tag proposal, deployment sequence, rollback target, and staging evidence receive explicit approval.

A passed earlier gate does not authorize a later lifecycle action. Staging, tag creation, release publication, production authorization, and production deployment remain distinct approvals.

See [Architecture](ARCHITECTURE.md), [Data Model](DATA_MODEL.md), [AI Guardrails](AI_GUARDRAILS.md), and the current version-specific verification checklist.

## Default post-Foundation release workflow

After the Foundation release, treat the website and its persistence Worker as one versioned Garden Brain service contract while keeping their deployment controls separate. The default workflow is:

1. **Plan the integrated contract.** Identify Pages changes, Worker changes, target data branch, protected canonical states, migration needs, and rollback controls before implementation.
2. **Implement in a review-first branch.** Keep canonical rules in presentation-independent domain modules. Browser code and Worker routes consume the shared contract as adapters; neither becomes the only definition of a business rule.
3. **Run one integrated validation command.** The Foundation validator performs deterministic canonical checks, JavaScript syntax checks, write-contract fixtures, version/branch parity, Git-blob checksum validation, and unexpected-path detection. It may emit both machine-readable JSON and a compact human summary.
4. **Package deterministically.** Build Pages artifacts from committed Git blobs, validate every packaged member and the embedded checksum manifest, and record the exact Pages artifact hash. Package the Worker from the same reviewed contract version without changing canonical data.
5. **Deploy to isolated staging with independent rollback controls.** Record the active Pages deployment and Worker deployment before changing either. Deploy only the approved artifacts and target only the approved staging data branch.
6. **Validate the complete staging experience.** Test read and persistent create/edit/save/read-back workflows, stale-write protection, protected-state failures, offline behavior, Pages/Worker contract identity, and rollback. Production promotion remains a separate approval.

The automated validation must stop on any unexpected tracked deletion, rename, move, missing protected state, checksum mismatch, contract-version mismatch, branch-target mismatch, or nondeterministic output. Automation records evidence; it does not grant approval or weaken review-first requirements.
