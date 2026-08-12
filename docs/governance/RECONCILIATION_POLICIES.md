---
title: "Reconciliation Policies"
document_type: "governance-policy"
governance_version: "1.0.0"
status: "preview"
approval_status: "pending human approval"
effective_date: "TBD"
last_updated: "2026-07-30"
owner: "Historical Curator / Project Owner"
scope: "The Pollinator Path repository and its historical ecological record"
---

# Reconciliation Policies

Purpose: Convert the seven approved-together workflow candidates into durable, numbered policy definitions without changing their recommendations.

## Governance navigation

[Handbook](./README.md) · [Charter](./PROJECT_CHARTER.md) · [Glossary](./GLOSSARY.md) · [Golden Snapshot](./GOLDEN_SNAPSHOT_SPEC.md) · [Repository Constitution](./REPOSITORY_CONSTITUTION.md) · [Reconciliation](./RECONCILIATION.md) · [Authority Rules](./AUTHORITY_RULES.md) · [Review Policy](./REVIEW_POLICY.md) · [Release Gates](./RELEASE_GATES.md) · [Decision Log](./DECISION_LOG.md) · [Import Policy](./IMPORT_POLICY.md) · [Reconciliation Policies](./RECONCILIATION_POLICIES.md) · [Evidence Index](../evidence/README.md)

## Interpretation

The **Default action** in each policy is copied verbatim from the policy-grouped review queue. Supporting controls describe how to apply that recommendation safely; they do not strengthen, weaken, or reinterpret it. Policy approval remains separate from implementation approval.

## POL-01 — Preserve and defer weak-authority records

- **Policy ID:** POL-01
- **Title:** Preserve and defer weak-authority records
- **Scope:** Weak-authority observations and records whose activation is not supported strongly enough.
- **Trigger conditions:** The record exists only in weak evidence or remains unresolved after source comparison.
- **Default action:** Retain in the evidence ledger and defer activation until authority is confirmed.
- **Prohibited actions:** Activation, deletion, ID rewrite, or invented supporting metadata.
- **Evidence requirements:** Git provenance, source inventory, first/last-seen commits, linked media, and authority status.
- **Exceptions:** A later verified strong source or explicit retirement evidence moves the item to individual review.
- **Human approval required:** Yes. Batch policy approval is required before this recommendation may be used in a canonical preview or implementation package.
- **Decision may be deferred:** Yes.
- **Mapped review-entry count:** 41
- **Mapped review IDs:** HDR-0001, HDR-0002, HDR-0005, HDR-0006, HDR-0007, HDR-0008, HDR-0009, HDR-0010, HDR-0011, HDR-0012, HDR-0013, HDR-0014, HDR-0015, HDR-0016, HDR-0017, HDR-0018, HDR-0019, HDR-0020, HDR-0021, HDR-0022, HDR-0023, HDR-0024, HDR-0025, HDR-0026, HDR-0027, HDR-0028, HDR-0029, HDR-0030, HDR-0037, HDR-0038, HDR-0039, HDR-0040, HDR-0046, HDR-0048, HDR-0050, HDR-0051, HDR-0052, HDR-0053, HDR-0055, HDR-0056, HDR-0058

## POL-02 — Preserve historical media and defer record linkage

- **Policy ID:** POL-02
- **Title:** Preserve historical media and defer record linkage
- **Scope:** Present media linked to historical observations that are not yet reconciled.
- **Trigger conditions:** The asset exists and has record evidence, but its historical observation is not approved.
- **Default action:** Retain in place and restore/link only with its reconciled historical observation; do not rename.
- **Prohibited actions:** Rename, move, delete, consolidate, or link to a different observation by inference.
- **Evidence requirements:** Path, hash, folder evidence, candidate observation IDs, and observation reconciliation.
- **Exceptions:** Missing files use POL-05; unreferenced files use POL-04.
- **Human approval required:** Yes. Batch policy approval is required before this recommendation may be used in a canonical preview or implementation package.
- **Decision may be deferred:** Yes.
- **Mapped review-entry count:** 94
- **Mapped review IDs:** HDR-0073, HDR-0074, HDR-0075, HDR-0076, HDR-0077, HDR-0078, HDR-0079, HDR-0080, HDR-0081, HDR-0082, HDR-0083, HDR-0084, HDR-0085, HDR-0086, HDR-0087, HDR-0088, HDR-0089, HDR-0090, HDR-0091, HDR-0092, HDR-0093, HDR-0094, HDR-0095, HDR-0096, HDR-0097, HDR-0098, HDR-0099, HDR-0100, HDR-0101, HDR-0102, HDR-0103, HDR-0104, HDR-0105, HDR-0106, HDR-0107, HDR-0108, HDR-0109, HDR-0110, HDR-0111, HDR-0112, HDR-0113, HDR-0114, HDR-0115, HDR-0116, HDR-0117, HDR-0118, HDR-0119, HDR-0120, HDR-0121, HDR-0122, HDR-0123, HDR-0124, HDR-0125, HDR-0126, HDR-0127, HDR-0128, HDR-0129, HDR-0130, HDR-0131, HDR-0132, HDR-0133, HDR-0134, HDR-0135, HDR-0136, HDR-0137, HDR-0138, HDR-0139, HDR-0140, HDR-0141, HDR-0142, HDR-0143, HDR-0144, HDR-0145, HDR-0146, HDR-0147, HDR-0148, HDR-0149, HDR-0150, HDR-0151, HDR-0152, HDR-0153, HDR-0154, HDR-0155, HDR-0156, HDR-0157, HDR-0158, HDR-0159, HDR-0160, HDR-0161, HDR-0162, HDR-0163, HDR-0164, HDR-0165, HDR-0166

## POL-03 — Preserve all byte-identical media paths

- **Policy ID:** POL-03
- **Title:** Preserve all byte-identical media paths
- **Scope:** Byte-identical media groups.
- **Trigger conditions:** Two or more media paths share the same cryptographic hash.
- **Default action:** Preserve every path. Record whether files are intentional copies, alternate exports, or accidental duplicates before any future consolidation proposal.
- **Prohibited actions:** Deletion, consolidation, renaming, or assuming duplicate meaning from byte identity.
- **Evidence requirements:** Full paths, sizes, hashes, observation associations, and provenance context.
- **Exceptions:** Any later consolidation proposal requires a new individual review and rollback plan.
- **Human approval required:** Yes. Batch policy approval is required before this recommendation may be used in a canonical preview or implementation package.
- **Decision may be deferred:** Yes.
- **Mapped review-entry count:** 32
- **Mapped review IDs:** HDR-0204, HDR-0205, HDR-0206, HDR-0207, HDR-0208, HDR-0209, HDR-0210, HDR-0211, HDR-0212, HDR-0213, HDR-0214, HDR-0215, HDR-0216, HDR-0217, HDR-0218, HDR-0219, HDR-0220, HDR-0221, HDR-0222, HDR-0223, HDR-0224, HDR-0225, HDR-0226, HDR-0227, HDR-0228, HDR-0229, HDR-0230, HDR-0231, HDR-0232, HDR-0233, HDR-0234, HDR-0235

## POL-04 — Preserve unreferenced media as unlinked evidence

- **Policy ID:** POL-04
- **Title:** Preserve unreferenced media as unlinked evidence
- **Scope:** On-disk media with no parsed observation reference.
- **Trigger conditions:** The asset exists but no inspected observation snapshot directly references it.
- **Default action:** Classify as unlinked evidence; preserve in place and investigate folder/date/EXIF context. Do not delete.
- **Prohibited actions:** Deletion, invented observation links, renaming, moving, or metadata fabrication.
- **Evidence requirements:** Path, folder/date evidence, hash, candidate IDs, Git/media history, and available metadata.
- **Exceptions:** A verified observation link moves the asset to the applicable reconciliation decision.
- **Human approval required:** Yes. Batch policy approval is required before this recommendation may be used in a canonical preview or implementation package.
- **Decision may be deferred:** Yes.
- **Mapped review-entry count:** 25
- **Mapped review IDs:** HDR-0068, HDR-0069, HDR-0070, HDR-0071, HDR-0072, HDR-0184, HDR-0185, HDR-0186, HDR-0187, HDR-0188, HDR-0189, HDR-0190, HDR-0191, HDR-0192, HDR-0193, HDR-0194, HDR-0195, HDR-0196, HDR-0197, HDR-0198, HDR-0199, HDR-0200, HDR-0201, HDR-0202, HDR-0203

## POL-05 — Quarantine missing media references

- **Policy ID:** POL-05
- **Title:** Quarantine missing media references
- **Scope:** Referenced media paths whose files are not present.
- **Trigger conditions:** A parsed observation references a path that cannot be found in inspected media sources.
- **Default action:** Do not write a record using this path; locate the missing asset or document an approved unavailable-media state.
- **Prohibited actions:** Substituting a similar file, fabricating an asset, dropping the reference, or writing as though media exists.
- **Evidence requirements:** Exact missing path, referring observation IDs, source refs, release archives, and search record.
- **Exceptions:** A recovered byte-verified original may be reviewed under the appropriate media policy.
- **Human approval required:** Yes. Batch policy approval is required before this recommendation may be used in a canonical preview or implementation package.
- **Decision may be deferred:** Yes.
- **Mapped review-entry count:** 17
- **Mapped review IDs:** HDR-0167, HDR-0168, HDR-0169, HDR-0170, HDR-0171, HDR-0172, HDR-0173, HDR-0174, HDR-0175, HDR-0176, HDR-0177, HDR-0178, HDR-0179, HDR-0180, HDR-0181, HDR-0182, HDR-0183

## POL-06 — Queue strong observation restorations conditionally

- **Policy ID:** POL-06
- **Title:** Queue strong observation restorations conditionally
- **Scope:** Strong-source observations absent from the current candidate state.
- **Trigger conditions:** An observation is supported by main, recorded remote beta, RC1, or staging evidence and is classified RESTORE.
- **Default action:** Approve restoration in a future preview with the stable ID preserved, subject to source/deployment confirmation.
- **Prohibited actions:** Immediate dataset write, ID change, silent field replacement, or bypassing production/source confirmation.
- **Evidence requirements:** Stable ID, all supporting sources, first/last-seen commits, field variants, and media links.
- **Exceptions:** Any variant conflict is excluded and reviewed individually under POL-08.
- **Human approval required:** Yes. Batch policy approval is required before this recommendation may be used in a canonical preview or implementation package.
- **Decision may be deferred:** No, according to the mapped review entries.
- **Mapped review-entry count:** 16
- **Mapped review IDs:** HDR-0003, HDR-0004, HDR-0031, HDR-0032, HDR-0033, HDR-0034, HDR-0035, HDR-0036, HDR-0041, HDR-0042, HDR-0044, HDR-0045, HDR-0047, HDR-0049, HDR-0060, HDR-0061

## POL-07 — Queue recoverable taxonomy records under existing IDs

- **Policy ID:** POL-07
- **Title:** Queue recoverable taxonomy records under existing IDs
- **Scope:** Recoverable taxonomy records absent from the current taxonomy.
- **Trigger conditions:** A species entry is supported historically and recommended for restoration under its existing ID.
- **Default action:** Restore under the existing ID after confirming the most complete historical fields.
- **Prohibited actions:** New ID assignment, certainty inflation, alias loss, resident-name substitution, or publication without taxonomy review.
- **Evidence requirements:** Historical species records, observation references, resident mappings, names, aliases, confidence, and source provenance.
- **Exceptions:** Resident/species collisions and historical-only authority conflicts remain individual decisions.
- **Human approval required:** Yes. Batch policy approval is required before this recommendation may be used in a canonical preview or implementation package.
- **Decision may be deferred:** Yes.
- **Mapped review-entry count:** 4
- **Mapped review IDs:** HDR-0063, HDR-0064, HDR-0066, HDR-0067
