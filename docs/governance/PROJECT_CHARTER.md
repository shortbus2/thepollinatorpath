---
title: "Project Charter"
document_type: "governance-policy"
governance_version: "1.0.0"
status: "preview"
approval_status: "pending human approval"
effective_date: "TBD"
last_updated: "2026-07-30"
owner: "Historical Curator / Project Owner"
scope: "The Pollinator Path repository and its historical ecological record"
---

# Project Charter

Purpose: State the enduring mission, scope, authority boundaries, and stewardship commitments of The Pollinator Path.

## Governance navigation

[Handbook](./README.md) · [Charter](./PROJECT_CHARTER.md) · [Glossary](./GLOSSARY.md) · [Golden Snapshot](./GOLDEN_SNAPSHOT_SPEC.md) · [Repository Constitution](./REPOSITORY_CONSTITUTION.md) · [Reconciliation](./RECONCILIATION.md) · [Authority Rules](./AUTHORITY_RULES.md) · [Review Policy](./REVIEW_POLICY.md) · [Release Gates](./RELEASE_GATES.md) · [Decision Log](./DECISION_LOG.md) · [Import Policy](./IMPORT_POLICY.md) · [Reconciliation Policies](./RECONCILIATION_POLICIES.md) · [Evidence Index](../evidence/README.md)

## Mission

The Pollinator Path documents a real habitat garden: its wildlife observations, seasonal changes, plant evolution, stewardship decisions, and the relationship between people and the natural world.

Its guiding principle is:

> Take care of your little piece of the world in a way that allows others to thrive alongside you.

## What the project protects

- Real observations as primary historical records
- Photos and other media as supporting evidence
- Observation dates distinct from upload, import, and publication dates
- Stable observation, taxonomy, resident, plant, visit, location, and media references
- Identification uncertainty, confidence, and “Unknown visitor” states
- Named garden residents as human meaning that supplements, but does not replace, taxonomy
- Plant, habitat, seasonal, and stewardship history
- Production stability, staging review, rollback readiness, and human approval

## Governance scope

This handbook governs historical reconciliation, source authority, review and approval, release gates, decision logging, and historical-import boundaries. It applies to human contributors, automated tools, AI assistants, importers, release processes, and future maintainers.

## Authority boundaries

- Evidence-gathering tools may inspect, compare, classify, and report.
- Automated checks may verify mechanical requirements.
- Tools and checks may not approve unresolved authority, identity, taxonomy, merge, deletion, release, or production decisions.
- Human approval must be explicit, scoped, and tied to a visible review package.
- Filesystem or service permission is technical access, not substantive approval.
- Production modification and deployment require separate explicit human approval.

## Non-negotiable commitments

1. Never lose information that represents a real observation.
2. Preserve stable historical IDs.
3. Merge new information; do not replace historical meaning.
4. Prefer honest uncertainty over fabricated precision.
5. Do not infer authority from recency or record count.
6. Preserve orphaned and duplicate media until its meaning is reviewed.
7. Do not delete, rewrite identity, or deploy without explicit approval and rollback readiness.
8. Stop a release whenever a required integrity gate fails.

## Stewardship standard

Technical convenience must not outrank ecological truth or historical continuity. Beauty and habitat, science and curiosity, taxonomy and human meaning may coexist. Small spaces matter, and their histories deserve careful preservation.

## Governance changes

Changes to this charter require review-first presentation, explicit human approval, a durable decision-log entry, and a final diff that matches the approved package. A permission prompt alone cannot amend the charter.
## Foundational archive principles

- The project must not depend on human memory for historical correctness.
- Significant historical decisions must be reproducible from documented evidence.
- Software serves the historical archive, not the reverse.
- Unknown identification is valid.
- Historical IDs are immutable.
- No media is deleted merely because it is duplicated, orphaned, or absent from the current dataset.
- Deferred records must remain preserved and recoverable.
