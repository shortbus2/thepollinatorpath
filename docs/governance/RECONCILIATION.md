---
title: "Reconciliation Governance"
document_type: "governance-policy"
governance_version: "1.0.0"
status: "preview"
approval_status: "pending human approval"
effective_date: "TBD"
last_updated: "2026-07-30"
owner: "Historical Curator / Project Owner"
scope: "The Pollinator Path repository and its historical ecological record"
---

# Reconciliation Governance

Purpose: Define the evidence, lifecycle, approvals, and audit controls required to establish a trustworthy historical baseline.

## Governance navigation

[Handbook](./README.md) · [Charter](./PROJECT_CHARTER.md) · [Glossary](./GLOSSARY.md) · [Golden Snapshot](./GOLDEN_SNAPSHOT_SPEC.md) · [Repository Constitution](./REPOSITORY_CONSTITUTION.md) · [Reconciliation](./RECONCILIATION.md) · [Authority Rules](./AUTHORITY_RULES.md) · [Review Policy](./REVIEW_POLICY.md) · [Release Gates](./RELEASE_GATES.md) · [Decision Log](./DECISION_LOG.md) · [Import Policy](./IMPORT_POLICY.md) · [Reconciliation Policies](./RECONCILIATION_POLICIES.md) · [Evidence Index](../evidence/README.md)

## Scope

This policy governs reconciliation of observations, species and identification references, named residents, plants when linked to observations, media, release snapshots, and production history. It applies before historical-import tooling is allowed to write records. It does not itself select records, approve a canonical dataset, or authorize deployment.

Foundation and related policies: [Governance Handbook](./README.md), [Project Charter](./PROJECT_CHARTER.md), [Authority Rules](./AUTHORITY_RULES.md), [Review Policy](./REVIEW_POLICY.md), [Release Gates](./RELEASE_GATES.md), [Decision Log](./DECISION_LOG.md), [Import Policy](./IMPORT_POLICY.md), and [Reconciliation Policies](./RECONCILIATION_POLICIES.md).

## Gate 0 — Historical Integrity

Every release must prove:

- Observation history reconciled
- Species references reconciled
- Media reconciled
- Historical IDs preserved
- Production history accounted for

If any check fails, the release stops. Automated checks may establish evidence, but they do not substitute for human approval of unresolved authority or merge decisions.

## Required evidence sources

- Independently verified deployed production data or a documented human attestation
- Current working tree, without treating uncommitted state as authoritative
- `main`, local beta, and recorded remote-beta refs
- Relevant Git history, including first-seen and last-seen commits
- Release archives and staging snapshots
- Observation, taxonomy, named-resident, plant-link, and media-reference sources
- On-disk original media, paths, sizes, and hashes
- QC, architecture, data-model, release, and deployment documentation
- Prior reconciliation inventories, queues, and approved decision-log entries

Absence from one source is evidence of absence in that source only.

## Reconciliation lifecycle

1. Freeze writes and identify the exact source snapshots.
2. Inventory all evidence without changing IDs or media.
3. Reconcile by stable ID and media path.
4. Classify every item.
5. Prepare a review package with conflicts and provenance.
6. Obtain chat approval for policies and individual decisions.
7. Record approvals in the decision log.
8. Generate a canonical preview only after the required decisions are complete.
9. Validate the preview in staging with rollback readiness.
10. Request separate filesystem permission only when approved changes are ready to apply.
11. Apply only the approved package, show the final diff, and verify all release gates.

## Classification states

- **KEEP:** Retain the entity, ID, or asset unchanged except for approved additive provenance or links.
- **RESTORE:** Reintroduce an evidenced historical entity or link using its original stable ID.
- **MERGE:** Resolve multiple variants field by field, preserving provenance and uncertainty.
- **QUARANTINE:** Preserve evidence outside active publication until a blocking issue is resolved.
- **RETIRE_WITH_RECORD:** Remove from active presentation only after explicit approval while retaining the ID, reason, evidence, and retirement history.
- **HUMAN_DECISION_REQUIRED:** Preserve without choosing when evidence cannot resolve authority, meaning, or identity.

## Approval sequence

1. Approve authority and preservation policies.
2. Verify live production.
3. Approve batch policies for their explicitly mapped entries.
4. Resolve individual observation, taxonomy, resident, and media exceptions.
5. Approve proposed canonical counts and preview scope.
6. Approve implementation after reviewing the complete proposed diff.
7. Grant filesystem permission separately.
8. Approve staging results and rollback plan.
9. Approve production release.

## Canonical baseline criteria

A baseline may be called canonical only when:

- Gate 0 passes with live production independently accounted for.
- Every known stable ID is present, explicitly quarantined, or retired with an approved record.
- Every conflicting variant has an approved field-level disposition.
- Species, resident, plant, location, visit, and media references pass referential checks or remain explicitly unresolved.
- Unknown taxonomy and incomplete observations remain representable.
- Missing and duplicate media have documented non-destructive dispositions.
- Counts, date ranges, source snapshots, provenance, and decision IDs are recorded.
- A reproducible preview and rollback package have passed staging validation.

## Rollback and audit expectations

- Every implementation must map to decision IDs and an approved review package.
- Before/after counts, hashes, changed paths, validation results, and source snapshot IDs must be retained.
- Imports must be reversible by batch where practical.
- Rollback must restore the prior data and references without rewriting historical IDs.
- Final repository diff must match the approved review package; discrepancies require renewed review.
- No commit, release, or deployment may erase the evidence needed to reconstruct the decision.
