---
title: "Authority Rules"
document_type: "governance-policy"
governance_version: "1.0.0"
status: "preview"
approval_status: "pending human approval"
effective_date: "TBD"
last_updated: "2026-07-30"
owner: "Historical Curator / Project Owner"
scope: "The Pollinator Path repository and its historical ecological record"
---

# Authority Rules

Purpose: Define how evidence is weighed without allowing recency, size, or convenience to erase historical information.

## Governance navigation

[Handbook](./README.md) · [Charter](./PROJECT_CHARTER.md) · [Glossary](./GLOSSARY.md) · [Golden Snapshot](./GOLDEN_SNAPSHOT_SPEC.md) · [Repository Constitution](./REPOSITORY_CONSTITUTION.md) · [Reconciliation](./RECONCILIATION.md) · [Authority Rules](./AUTHORITY_RULES.md) · [Review Policy](./REVIEW_POLICY.md) · [Release Gates](./RELEASE_GATES.md) · [Decision Log](./DECISION_LOG.md) · [Import Policy](./IMPORT_POLICY.md) · [Reconciliation Policies](./RECONCILIATION_POLICIES.md) · [Evidence Index](../evidence/README.md)

## Core rules

1. **Newer is not automatically authoritative.** A newer snapshot may contain regressions, partial uploads, or full-array replacement.
2. **Larger is not automatically authoritative.** Higher counts may include duplicates, drafts, or records not approved for publication.
3. **Production is strong evidence, not self-authenticating truth.** Deployed production must be independently captured or human-attested and compared with repository history.
4. **Stable historical IDs are immutable.** Reconciliation may restore, link, classify, or merge fields; it may not silently rewrite identity.
5. **Original media is evidence.** File existence, path, folder date, hash, and metadata may support a record, but they do not authorize invented dates, taxa, locations, residents, or narratives.
6. **Unknown taxonomy is valid.** “Unknown visitor,” uncertain identification, incomplete classification, and confidence-qualified labels must remain representable.
7. **Conflicting variants require explicit merge review.** No whole-record winner may be selected silently.
8. **Absence is not deletion authority.** No observation, species, resident, plant link, media asset, or historical reference may be deleted solely because it is absent from the current dataset.

## Evidence strength

Evidence should be considered cumulatively:

- Independently verified production is strong deployment evidence.
- A release archive is strong historical evidence when its release status is documented.
- Git history is strong existence and provenance evidence but does not alone prove deployment.
- Current branches are candidate states, not automatic authorities.
- Media that exists at a historically meaningful path is strong evidence of an asset and possible event, but not of undocumented semantics.
- Folder names, timestamps, and filenames are corroborating evidence, not sufficient authority by themselves.
- Human recollection may resolve context when recorded as an attestation with date, scope, and approver.

## Conflict resolution

- Preserve all source values and source locations during review.
- Prefer additive merge structures when values can coexist.
- Preserve uncertainty rather than manufacture precision.
- Escalate incompatible identity, date, taxonomy, or provenance claims to an individual decision.
- Record every accepted exception in [DECISION_LOG.md](./DECISION_LOG.md).

## Prohibited shortcuts

- Choosing the newest or largest file without record-level evidence
- Treating a branch name as proof of live deployment
- Replacing an array because one source appears more complete
- Renumbering records to avoid collisions
- Inferring taxonomy from filenames alone
- Consolidating byte-identical files without provenance review
- Deleting orphaned media
## Production evidence preference

Use the strongest safely obtainable production evidence in this order:

1. Read-only exported production dataset and media manifest
2. Deployment snapshot with independently verified checksums
3. Human attestation only when technical export is impossible

Repository `main` is never substituted for an independently verified live-production snapshot.
