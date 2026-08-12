---
title: "Governance Glossary"
document_type: "governance-reference"
governance_version: "1.0.0"
status: "preview"
approval_status: "pending human approval"
effective_date: "TBD"
last_updated: "2026-07-30"
owner: "Historical Curator / Project Owner"
scope: "The Pollinator Path repository and its historical ecological record"
---

# Governance Glossary

Purpose: Define the shared terms used in historical reconciliation, review, import, and release governance.


## Governance navigation

[Handbook](./README.md) · [Charter](./PROJECT_CHARTER.md) · [Glossary](./GLOSSARY.md) · [Golden Snapshot](./GOLDEN_SNAPSHOT_SPEC.md) · [Repository Constitution](./REPOSITORY_CONSTITUTION.md) · [Reconciliation](./RECONCILIATION.md) · [Authority Rules](./AUTHORITY_RULES.md) · [Review Policy](./REVIEW_POLICY.md) · [Release Gates](./RELEASE_GATES.md) · [Decision Log](./DECISION_LOG.md) · [Import Policy](./IMPORT_POLICY.md) · [Reconciliation Policies](./RECONCILIATION_POLICIES.md) · [Evidence Index](../evidence/README.md)


## Terms

### Approval

An explicit human decision tied to a visible scope and review package. Technical permission is not approval.

### Authority

The evidentiary weight assigned to a source for a specific claim. Authority is contextual; no source is automatically authoritative for every field.

### Canonical baseline

The approved, reproducible historical state against which future observation, taxonomy, resident, plant, and media changes are reconciled. A baseline is not canonical until Gate 0 passes.

### Classification state

One of `KEEP`, `RESTORE`, `MERGE`, `QUARANTINE`, `RETIRE_WITH_RECORD`, or `HUMAN_DECISION_REQUIRED`.

### Decision ID

A stable identifier for an approval or exception recorded in [DECISION_LOG.md](./DECISION_LOG.md), normally `DEC-YYYY-NNNN`.

### Evidence package

A read-only collection of source inventories, comparisons, hashes, counts, conflicts, risks, recommendations, and unresolved questions prepared for review.

### Gate 0

The Historical Integrity gate. It requires observation, species, media, ID, and production history reconciliation before release progression.

### Golden snapshot

A versioned, immutable evidence bundle that records the approved canonical baseline and the proofs needed to reproduce and validate it.

### Historical import

The controlled addition of approved historical records while retaining observed date, precision, provenance, stable identities, and uncertainty separately from import time.

### Human decision

A substantive choice by an authorized human reviewer. Automated checks may support but cannot make this choice.

### Named resident

A human-readable identity for a recurring garden resident. It supplements taxonomy and does not replace scientific classification.

### Original media

The preserved file as received or captured, together with its path and available metadata. It is evidence but does not prove undocumented context.

### Production snapshot

A read-only capture or human-attested representation of deployed production at a specific time. A repository branch alone is not an independently verified production snapshot.

### Provenance

The source, history, transformations, timestamps, batch, tool version, and decisions that explain where a record or asset came from.

### Quarantine

A preserved state that prevents unsafe activation while retaining evidence for later review. Quarantine is not deletion.

### Reconciliation

The process of comparing evidence by stable identity, documenting conflict, classifying every item, and obtaining approval before producing a canonical baseline.

### Review package

The substantive material shown before any write request: paths, statuses, proposed content or diffs, evidence, assumptions, risks, validation, and untouched areas.

### Stable historical ID

An identity already associated with a historical entity. It is immutable even when the entity is restored, merged, quarantined, or retired with a record.
