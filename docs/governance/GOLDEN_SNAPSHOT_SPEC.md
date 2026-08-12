---
title: "Golden Snapshot Specification"
document_type: "governance-specification"
governance_version: "1.0.0"
status: "preview"
approval_status: "pending human approval"
effective_date: "TBD"
last_updated: "2026-07-30"
owner: "Historical Curator / Project Owner"
scope: "The Pollinator Path repository and its historical ecological record"
---

# Golden Snapshot Specification

Purpose: Define the minimum contents, identity, validation, and custody of an approved canonical-baseline evidence bundle.


## Governance navigation

[Handbook](./README.md) · [Charter](./PROJECT_CHARTER.md) · [Glossary](./GLOSSARY.md) · [Golden Snapshot](./GOLDEN_SNAPSHOT_SPEC.md) · [Repository Constitution](./REPOSITORY_CONSTITUTION.md) · [Reconciliation](./RECONCILIATION.md) · [Authority Rules](./AUTHORITY_RULES.md) · [Review Policy](./REVIEW_POLICY.md) · [Release Gates](./RELEASE_GATES.md) · [Decision Log](./DECISION_LOG.md) · [Import Policy](./IMPORT_POLICY.md) · [Reconciliation Policies](./RECONCILIATION_POLICIES.md) · [Evidence Index](../evidence/README.md)


## Status and boundary

This specification defines a future artifact. It does not create a golden snapshot or canonical dataset. A snapshot may be generated only after the required reconciliation decisions and review approvals.

## Purpose

A golden snapshot makes the approved historical baseline reproducible and auditable. It proves what was accepted, where it came from, which uncertainty remains, and how later releases can detect loss or drift.

## Required contents

1. Snapshot manifest with schema version, creation timestamp, tool version, and environment.
2. Approved observation, species, named-resident, plant-reference, and media-reference counts.
3. Stable-ID inventories and uniqueness results.
4. Observation date range and date-precision summary.
5. Source inventory with exact Git commits, release/snapshot IDs, production attestation, and filesystem evidence.
6. Cryptographic hashes for every included manifest, dataset preview, and referenced media asset where available.
7. Referential-integrity and missing-reference reports.
8. Duplicate-record and duplicate-media reports.
9. Quarantine and unresolved-item inventories.
10. Applicable policy IDs, decision IDs, approvers, and approval dates.
11. Validation results for Gate 0 and any later gates included.
12. Rollback reference identifying the prior approved snapshot.

## Snapshot identity

Use `golden-snapshot-<release>-YYYY-MM-DD`. Snapshot identifiers must never be reused.

## Immutability

An approved snapshot is immutable. Corrections produce a new snapshot linked to the superseded snapshot and the decision authorizing the change. Existing files, hashes, and decision history remain preserved.

## Data and media treatment

- The snapshot records stable IDs and references; it does not authorize ID changes.
- Observed date remains distinct from snapshot, upload, import, and deployment timestamps.
- Unknown taxonomy and incomplete records remain explicit.
- Media hashes establish byte identity, not permission to consolidate or delete.
- Missing media remains documented rather than silently removed.
- Original media paths remain recorded even if a later approved delivery path is introduced.

## Validation

A candidate golden snapshot must prove:

- expected and actual counts match;
- IDs are unique and historical IDs are preserved;
- references resolve or have an approved unresolved state;
- every included artifact hash verifies;
- production history is independently accounted for;
- all required decisions are logged;
- the bundle can be reproduced from named sources; and
- Gate 0 passes.

Any failure stops snapshot approval.

## Storage and custody

Store durable decision evidence under `docs/evidence/reconciliation/YYYY-MM/<decision-id>/`. Oversized or sensitive evidence may live outside Git only when the repository retains a durable locator and checksum sufficient to locate and verify the approved bundle.

## Approval and use

The project owner or delegated human data steward approves a golden snapshot after reviewing its manifest and Gate 0 evidence. Import, staging, release, and rollback processes must cite the active snapshot ID.
