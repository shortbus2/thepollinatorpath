---
title: "Decision Log"
document_type: "governance-policy"
governance_version: "1.0.0"
status: "preview"
approval_status: "pending human approval"
effective_date: "TBD"
last_updated: "2026-07-30"
owner: "Historical Curator / Project Owner"
scope: "The Pollinator Path repository and its historical ecological record"
---

# Decision Log

Purpose: Provide a durable, append-only structure linking governance approvals to evidence and implementation.

## Governance navigation

[Handbook](./README.md) · [Charter](./PROJECT_CHARTER.md) · [Glossary](./GLOSSARY.md) · [Golden Snapshot](./GOLDEN_SNAPSHOT_SPEC.md) · [Repository Constitution](./REPOSITORY_CONSTITUTION.md) · [Reconciliation](./RECONCILIATION.md) · [Authority Rules](./AUTHORITY_RULES.md) · [Review Policy](./REVIEW_POLICY.md) · [Release Gates](./RELEASE_GATES.md) · [Decision Log](./DECISION_LOG.md) · [Import Policy](./IMPORT_POLICY.md) · [Reconciliation Policies](./RECONCILIATION_POLICIES.md) · [Evidence Index](../evidence/README.md)

## Logging rules

- Append decisions; do not rewrite prior entries to change historical meaning.
- Corrections use a new decision that supersedes the earlier decision by ID.
- Use one stable ID in the form `DEC-YYYY-NNNN`.
- Link policy approvals to every covered review ID.
- Use `Not implemented`, `Preview prepared`, `Staged`, `Released`, `Rolled back`, or `Superseded` for implementation status.
- A blank approver is not approval.

## Decision index

| Decision ID | Date | Policy or entity affected | Decision | Approver | Implementation status | Related commit or release |
|---|---|---|---|---|---|---|
| `DEC-2026-0001` | 2026-07-30 | Gate 0; HDR-0236 | Record Gate 0 PASS and HDR-0236 RESOLVED from verified live-production evidence | Historical Curator / Project Owner | Not implemented | Foundation Reconciliation Release |
| `DEC-2026-0002` | 2026-07-30 | `POL-01` through `POL-07` | Approve all seven reconciliation policies exactly as drafted | Historical Curator / Project Owner | Not implemented | Foundation Reconciliation Release |
| `DEC-2026-0003` | 2026-07-30 | `CUR-MRG-01` through `CUR-MRG-10` | Approve the exact merge outcomes recorded in `FED-2026-08-12-001` | Historical Curator / Project Owner | Not implemented | Foundation Reconciliation Release |
| `DEC-2026-0004` | 2026-07-30 | `CUR-TAX-01` through `CUR-TAX-04` | Activate the four frozen taxonomy records as proposed | Historical Curator / Project Owner | Not implemented | Foundation Reconciliation Release |
| `DEC-2026-0005` | 2026-07-30 | `CUR-MED-01` | Keep all 17 listed media rows QUARANTINE with no exceptions | Historical Curator / Project Owner | Not implemented | Foundation Reconciliation Release |
| `DEC-2026-0006` | 2026-07-30 | `CUR-BAS-01`; `CUR-DOC-01` | Use base `6a26c9f774b53a046d12e691e92196ec5ac88e74`; preserve handbook work in its separate commit | Historical Curator / Project Owner | Implemented | `6a9bc86ddc516be5268330cb6d042aa2a44c1ab8` |
| `DEC-2026-0007` | 2026-08-12 | `ADR-GB-001` | Garden Brain is an application platform; the website is its first presentation layer | Historical Curator / Project Owner | Not implemented | Foundation Reconciliation Release |
| `DEC-2026-0008` | 2026-08-12 | `CUR-AUTH-01` | Authorize controlled implementation and RC preparation only; deployment, tags, and release remain separate | Historical Curator / Project Owner | Not implemented | `FICR-2026-08-12-001` |
| `DEC-2026-0009` | 2026-08-12 | `CUR-NEW-001` | Keep approved observations active while preserving their explicitly quarantined media references as intentionally unavailable | Historical Curator / Project Owner | Not implemented | Foundation Reconciliation Release |

The exact field values, taxonomy records, media scope, source hashes, and authorization boundaries for these index entries are preserved in [Foundation implementation decisions](../evidence/reconciliation/foundation-4.4.0-rc.1/IMPLEMENTATION_DECISIONS.md). This index is not a substitute for that exact record.

## Decision entry template

### DEC-YYYY-NNNN — Short title

- **Date:** YYYY-MM-DD
- **Policy or entity affected:** Policy ID, review IDs, and/or stable entity IDs
- **Evidence reviewed:** Exact paths, refs, commits, snapshots, hashes, and review-package version
- **Decision:** Approved choice stated precisely
- **Rationale:** Why the evidence supports this choice and what uncertainty remains
- **Approver:** Human name or documented approval identity
- **Implementation status:** Not implemented
- **Related commit or release:** None
- **Supersedes:** None
- **Follow-up or expiry:** None

## Batch-policy entry template

### DEC-YYYY-NNNN — Approve POL-XX

- **Date:** YYYY-MM-DD
- **Policy or entity affected:** `POL-XX`; review IDs: _enumerate every ID_
- **Evidence reviewed:** Policy-grouped queue, source inventory, reconciliation CSVs, and relevant exception documents
- **Decision:** Approve the existing recommendation exactly as written for the listed review IDs
- **Rationale:** _Required_
- **Approver:** _Required_
- **Implementation status:** Not implemented
- **Related commit or release:** None
