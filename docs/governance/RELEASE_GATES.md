---
title: "Release Gates"
document_type: "governance-policy"
governance_version: "1.0.0"
status: "preview"
approval_status: "pending human approval"
effective_date: "TBD"
last_updated: "2026-07-30"
owner: "Historical Curator / Project Owner"
scope: "The Pollinator Path repository and its historical ecological record"
---

# Release Gates

Purpose: Define mandatory evidence and stop conditions from historical reconciliation through production approval.

## Governance navigation

[Handbook](./README.md) · [Charter](./PROJECT_CHARTER.md) · [Glossary](./GLOSSARY.md) · [Golden Snapshot](./GOLDEN_SNAPSHOT_SPEC.md) · [Repository Constitution](./REPOSITORY_CONSTITUTION.md) · [Reconciliation](./RECONCILIATION.md) · [Authority Rules](./AUTHORITY_RULES.md) · [Review Policy](./REVIEW_POLICY.md) · [Release Gates](./RELEASE_GATES.md) · [Decision Log](./DECISION_LOG.md) · [Import Policy](./IMPORT_POLICY.md) · [Reconciliation Policies](./RECONCILIATION_POLICIES.md) · [Evidence Index](../evidence/README.md)

## Approval principle

Tools may collect evidence and run checks. They do not provide human approval. The project owner or an explicitly delegated human reviewer approves unresolved decisions and release progression.

## Gate 0 — Historical Integrity

Required evidence:

- Observation history reconciled
- Species references reconciled
- Media reconciled
- Historical IDs preserved
- Production history independently accounted for
- Conflicting variants and quarantined evidence recorded
- Approved policy and entity decisions linked in the decision log

Approval: Historical Curator / Project Owner.

Stop conditions: any missing reconciliation proof, unverified production, unexplained ID loss, unresolved destructive proposal, or decision not tied to evidence.

## Gate 1 — Repository Integrity

Required evidence:

- Cleanly identified baseline commit and branch/ref state
- Repository status reviewed before and after changes
- Only approved paths changed
- No accidental application, data, media, deployment, or configuration changes
- Final diff matches the approved review package
- No unapproved commit, pull, push, merge, rebase, or generated/vendor material

Approval: human repository reviewer; automated checks provide supporting evidence.

Stop conditions: unexpected paths, undocumented generated files, changed IDs outside scope, unreviewed diff, or uncertain Git state.

## Gate 2 — Application Integrity

Required evidence:

- Relevant automated checks pass
- Observation, taxonomy, resident, plant, location, visit, and media references validate
- Unknown and incomplete states render safely
- Date semantics distinguish observed date from upload/import time
- Accessibility and critical user workflows are verified
- No regression in existing historical presentation

Approval: human reviewer after test evidence; automated tests cannot approve exceptions.

Stop conditions: failed critical test, broken reference, historical loss, incorrect uncertainty handling, or unexplained behavior change.

## Gate 3 — Release Integrity

Required evidence:

- Staging matches the approved release candidate
- Data and media counts reconcile to the approved baseline
- Rollback procedure and prior-state artifact are available
- Release notes identify decisions, migrations, and known limitations
- Production deployment requires explicit human approval
- Post-deployment verification plan is ready

Approval: Historical Curator / Project Owner.

Stop conditions: Gate 0–2 not passed, staging mismatch, missing rollback, absent human approval, or direct production import.

## Gate sequencing

Gates are sequential. A later gate cannot waive an earlier failure. Any newly discovered discrepancy reopens the relevant earlier gate and stops release progression.
