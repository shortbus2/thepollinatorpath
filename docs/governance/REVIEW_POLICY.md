---
title: "Review Policy"
document_type: "governance-policy"
governance_version: "1.0.0"
status: "preview"
approval_status: "pending human approval"
effective_date: "TBD"
last_updated: "2026-07-30"
owner: "Historical Curator / Project Owner"
scope: "The Pollinator Path repository and its historical ecological record"
---

# Review Policy

Purpose: Separate substantive human review from technical permission and require exact verification before and after repository changes.

## Governance navigation

[Handbook](./README.md) · [Charter](./PROJECT_CHARTER.md) · [Glossary](./GLOSSARY.md) · [Golden Snapshot](./GOLDEN_SNAPSHOT_SPEC.md) · [Repository Constitution](./REPOSITORY_CONSTITUTION.md) · [Reconciliation](./RECONCILIATION.md) · [Authority Rules](./AUTHORITY_RULES.md) · [Review Policy](./REVIEW_POLICY.md) · [Release Gates](./RELEASE_GATES.md) · [Decision Log](./DECISION_LOG.md) · [Import Policy](./IMPORT_POLICY.md) · [Reconciliation Policies](./RECONCILIATION_POLICIES.md) · [Evidence Index](../evidence/README.md)

## Review-first workflow

1. Inspect the authoritative repository and relevant external evidence read-only.
2. Prepare changes outside the repository.
3. Present a complete review package.
4. Wait for explicit approval in chat.
5. Only after approval, request the minimum filesystem permission required.
6. Apply only the approved changes.
7. Show repository status and final diff.
8. State whether the applied result differs from the approved package.

## Batch-policy approval

A batch policy may be approved once for every explicitly listed review ID when:

- all entries share the same recommendation and safest choice;
- the scope and trigger are explicit;
- exceptions are excluded;
- approval does not silently resolve deferred entity-level questions; and
- the approval is recorded with the policy ID, mapped review IDs, approver, and date.

Batch approval does not authorize implementation unless the implementation package is separately reviewed.

## Individual decision review

Individual review is required for conflicting observation variants, identity collisions, unresolved taxonomy authority, live-production verification, or any exception to an approved batch policy. Each decision must preserve exact evidence and available choices without silently selecting a variant.

## Required review package

- Exact repository-relative paths and NEW, MODIFIED, MOVED, or DELETED status
- Purpose and concise diff summary for every file
- Full unified diff for existing files
- Complete proposed content for new files
- Source snapshot IDs and evidence locations
- Record counts, stable IDs, media paths, and validation results affected
- Assumptions, placeholders, unresolved questions, risks, and rollback plan
- Explicit list of files and areas that will not be touched
- Mapping to governance policy and decision IDs

## Chat approval versus filesystem permission

Chat approval is the substantive authorization of a visible review package. Filesystem permission is a technical capability grant that may be requested only after substantive approval. Granting filesystem permission does not approve content, scope, policy, a merge decision, a commit, or a deployment.

## Permission prompts

A permission prompt must never be treated as:

- the review package;
- approval of an unseen diff;
- approval of reconciliation decisions;
- authorization to broaden scope; or
- authorization to commit, push, merge, rebase, or deploy.

## Final-diff verification

After applying an approved package:

- run repository status;
- show the complete final diff;
- compare changed paths and content with the approved package;
- identify any difference, including formatting-only differences;
- rerun required validation and release gates; and
- do not commit or push without separate explicit instruction.
