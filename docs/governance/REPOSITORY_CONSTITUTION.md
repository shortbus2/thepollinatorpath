---
title: "Repository Constitution"
document_type: "governance-constitution"
governance_version: "1.0.0"
status: "preview"
approval_status: "pending human approval"
effective_date: "TBD"
last_updated: "2026-07-30"
owner: "Historical Curator / Project Owner"
scope: "The Pollinator Path repository and its historical ecological record"
---

# Repository Constitution

Purpose: Establish the highest-level rules governing repository history, protected information, review, automation, and release conduct.


## Governance navigation

[Handbook](./README.md) · [Charter](./PROJECT_CHARTER.md) · [Glossary](./GLOSSARY.md) · [Golden Snapshot](./GOLDEN_SNAPSHOT_SPEC.md) · [Repository Constitution](./REPOSITORY_CONSTITUTION.md) · [Reconciliation](./RECONCILIATION.md) · [Authority Rules](./AUTHORITY_RULES.md) · [Review Policy](./REVIEW_POLICY.md) · [Release Gates](./RELEASE_GATES.md) · [Decision Log](./DECISION_LOG.md) · [Import Policy](./IMPORT_POLICY.md) · [Reconciliation Policies](./RECONCILIATION_POLICIES.md) · [Evidence Index](../evidence/README.md)


## Constitutional rule

> Never lose information that represents a real observation.

This rule governs interpretation of every lower-level policy.

## Protected historical information

The following may not be silently overwritten, discarded, or regenerated as replacement truth:

- observations and observed dates;
- wildlife identities and named-resident mappings;
- plant and habitat history;
- taxonomy and identification history;
- confidence, uncertainty, and unknown states;
- locations, visits, and ecological context;
- original media, paths, and provenance; and
- release, reconciliation, and decision history.

## Order of authority

1. Explicit human approval tied to preserved evidence
2. This constitution and the [Project Charter](./PROJECT_CHARTER.md)
3. Approved governance policies and decision-log entries
4. Verified production, Git, release, staging, and media evidence as evaluated under [Authority Rules](./AUTHORITY_RULES.md)
5. Implementation convenience

No lower level may waive a higher-level protection.

## Repository conduct

- Inspect before editing.
- Prepare reviewable changes outside the repository first.
- Preserve unrelated worktree changes.
- Apply only explicitly approved paths and content.
- Treat chat approval as substantive review and filesystem permission as technical access.
- Show final repository status and diff after applying.
- Do not commit, push, merge, rebase, deploy, or modify production without separate explicit instruction.
- Do not use a permission prompt as approval of content or scope.

## Data and identity

- Observations are the primary historical records; photos support them.
- Stable historical IDs are immutable.
- New information is merged with provenance rather than replacing history.
- Unknown identification is valid.
- Human-readable resident names supplement taxonomy.
- No dataset is canonical merely because it is newer or larger.

## Media

- Original media is preserved as evidence.
- Orphaned media is classified, not deleted.
- Duplicate hashes do not authorize consolidation.
- Media paths may not be reorganized during reconciliation without a separately approved migration.
- Media cannot supply metadata that the evidence does not contain.

## Automation and AI

Automation and AI may inspect, compare, validate, draft, and report. They may not fabricate observations, approve unresolved decisions, replace datasets, delete media, rewrite IDs, modify production, or deploy without human approval.

## Releases

Release gates are sequential. Failure of any gate stops progression. Production stability, staging review, validation, rollback readiness, and human approval take precedence over release speed.

## Amendments

An amendment requires:

1. a preview outside the repository;
2. a complete unified diff and impact statement;
3. explicit human approval in chat;
4. a decision-log entry;
5. separate write permission;
6. a final-diff verification; and
7. a related commit or release reference after separately approved implementation.
## Foundation Reconciliation commitments

The archive must remain correct without relying on human memory. Significant historical decisions must be reproducible from evidence. Software and schemas serve the archive; the archive is not rewritten to satisfy current software. Deferred records remain preserved and recoverable.
