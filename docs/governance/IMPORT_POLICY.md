---
title: "Historical Import Policy"
document_type: "governance-policy"
governance_version: "1.0.0"
status: "preview"
approval_status: "pending human approval"
effective_date: "TBD"
last_updated: "2026-07-30"
owner: "Historical Curator / Project Owner"
scope: "The Pollinator Path repository and its historical ecological record"
---

# Historical Import Policy

Purpose: Constrain historical-import preparation and execution so imported evidence cannot overwrite or misdate garden history.

## Governance navigation

[Handbook](./README.md) · [Charter](./PROJECT_CHARTER.md) · [Glossary](./GLOSSARY.md) · [Golden Snapshot](./GOLDEN_SNAPSHOT_SPEC.md) · [Repository Constitution](./REPOSITORY_CONSTITUTION.md) · [Reconciliation](./RECONCILIATION.md) · [Authority Rules](./AUTHORITY_RULES.md) · [Review Policy](./REVIEW_POLICY.md) · [Release Gates](./RELEASE_GATES.md) · [Decision Log](./DECISION_LOG.md) · [Import Policy](./IMPORT_POLICY.md) · [Reconciliation Policies](./RECONCILIATION_POLICIES.md) · [Evidence Index](../evidence/README.md)

## Boundaries

Historical import may add approved, reconciled records through a reviewed framework. It may not perform a bulk migration merely because the framework exists. It may not rewrite existing IDs, replace datasets, invent missing metadata, reorganize the existing media library, or import directly to production.

## Dry-run requirement

Every import must first run in preview mode without writes. The report must list proposed records, skipped records, duplicates, warnings, failures, unresolved references, missing media, conflicting dates, and generated IDs.

## Provenance requirements

Preserve, when available:

- source collection or folder;
- original filename and original relative path;
- import batch ID;
- observed date and date precision;
- source context and source record ID;
- import timestamp as distinct from observed date;
- importer version;
- original metadata and transformations;
- decision IDs authorizing inclusion.

Missing provenance remains explicitly unknown; it must not be inferred.

## IDs

- Existing IDs are immutable.
- Imported records use a documented deterministic or collision-resistant rule approved before implementation. Import batches use `import-batch-YYYY-MM-DD-NNN`.
- Re-running a batch must not create new identities for the same source record.
- ID collisions stop the affected record and require review.

## Duplicate handling

- Detect record duplicates through stable source keys, IDs, and documented fingerprints.
- Detect media duplicates with cryptographic hashes plus path and provenance context.
- Byte identity does not authorize deletion or path consolidation.
- Potential duplicates are reported, skipped or quarantined according to the approved policy, and retained for review.

## Missing media

Missing media references are quarantined or represented through an approved unavailable-media state. The importer must not fabricate files, substitute similarly named assets, or discard the reference.

## Rollback by batch

Each write-capable import must use an import batch ID and produce a manifest of every created or changed record and link. Rollback should reverse only that batch where practical, preserve pre-existing records, and retain an audit record of both import and rollback.

## Staging validation

No real historical import may bypass staging. Staging checks include counts, unique IDs, provenance, observed-date semantics, unresolved taxonomy, referential integrity, media availability, duplicate reports, user-visible behavior, and rollback rehearsal.

## Approval gates

1. Gate 0 passes and the canonical baseline is approved.
2. Dry-run report is reviewed.
3. Human approval authorizes the exact batch.
4. Separate filesystem or service permission may then be granted.
5. Staging validation passes.
6. Human release approval is obtained.

There is no direct production import.
