---
title: "Foundation Reconciliation Implementation Decisions"
document_type: "immutable implementation decision reference"
record_id: "FED-2026-08-12-001"
status: "approved"
recorded: "2026-08-12"
approval_authority: "Historical Curator / Project Owner"
---

# Foundation Reconciliation Implementation Decisions

## Authority and boundaries

Implementation is authorized from commit `6a26c9f774b53a046d12e691e92196ec5ac88e74` on branch `release/foundation-reconciliation-4.4.0-rc1`. The separately approved handbook commit is `6a9bc86ddc516be5268330cb6d042aa2a44c1ab8`.

Authorization is limited to the accepted canonical preview, its 293-entity disposition ledger, the decisions below, approved governance recording, validation, rollback preparation, and release-candidate preparation. It does not authorize deployment, tags, final release, production changes, direct historical import, identifier changes, unapproved media work, activation of DEFER or QUARANTINE entities, force-push, or history rewriting.

## Exact merge outcomes

| Decision | Entity/key | Approved active outcome |
|---|---|---|
| `CUR-MRG-01` | Observation `2026-07-17-3fc7c311-0fba-4462-8928-64e84faf746a` | Retain later reviewed `aiDraft=null`, `privacyReview.reviewedAt=2026-07-17T04:31:29.758Z`, and `updatedAt=2026-07-17T04:31:30.201Z`. |
| `CUR-MRG-02` | Observation `2026-07-18-ba83f3eb-aa68-4f4e-931b-2243be1f8cf2` | Retain later reviewed `aiDraft=null`, `confidence=confirmed`, `privacyReview.reviewedAt=2026-07-18T02:25:52.916Z`, and `updatedAt=2026-07-18T02:25:53.296Z`. |
| `CUR-MRG-03` | Observation `2026-07-18-db065ce5-2e37-4ed2-91b2-e7c859b4a344` | Retain `aiDraft=null`, `confidence=confirmed`, “seed heads” notes and narrative, `privacyReview.reviewedAt=2026-07-18T02:28:11.922Z`, and `updatedAt=2026-07-18T02:28:12.350Z`. |
| `CUR-MRG-04` | Observation `2026-07-19-dc4cd81a-e75d-42e7-9a2d-c573d043d7be` | Retain later human-reviewed prairie-wine-cups fields, `aiDraft=null`, `setHero=false`, empty species/visitor fields, `privacyReview.reviewedAt=2026-07-19T21:47:01.521Z`, and `updatedAt=2026-07-19T21:47:02.055Z`. |
| `CUR-MRG-05` | Resident `beth` | Add `speciesId=broad-tailed-hummingbird`. |
| `CUR-MRG-06` | Resident `brenda` | Add `speciesId=leafcutter-bee`. |
| `CUR-MRG-07` | Resident `little-head-todd` | Add `speciesId=toad-unresolved`. |
| `CUR-MRG-08` | Resident `big-booty-judy` | Add `speciesId=toad-unresolved`. |
| `CUR-MRG-09` | Manifest key `hero` | Retain the exact two-path production value, ordered with the 2026-07-18 path first and the 2026-07-07 path second. |
| `CUR-MRG-10` | Manifest key `plants` | Retain the exact production object for plant IDs `8`, `10`, and `27`; do not substitute ID `30`. |

Superseded AI variants remain preserved in `canonical-preview.json` and the disposition evidence. They are inactive.

## Taxonomy activations

| Decision | Stable ID | Approved outcome |
|---|---|---|
| `CUR-TAX-01` | `broad-tailed-hummingbird` | Activate the frozen proposed record: Probable Female Broad-tailed Hummingbird; `Selasphorus platycercus`; probable identification; confidence `reasonable`. |
| `CUR-TAX-02` | `leafcutter-bee` | Activate the frozen proposed record: Leafcutter Bee; Family `Megachilidae`; confidence `reasonable`; alias `brenda`. |
| `CUR-TAX-03` | `toad-unresolved` | Activate the frozen unresolved Garden Toad record; species not firmly established; confidence `tentative`. |
| `CUR-TAX-04` | `white-lined-sphinx` | Activate the frozen proposed record: White-lined Sphinx; `Hyles lineata`; confidence `reasonable`. |

Modern taxonomy remains distinct from the legacy `window.VISITORS` domain. Unknown and unresolved taxonomy remain valid states.

## Media, policies, and release decisions

- `CUR-MED-01`: all 17 rows `CDL-0257` through `CDL-0273` remain QUARANTINE with no exceptions.
- `CUR-BAS-01`: implementation base is `6a26c9f774b53a046d12e691e92196ec5ac88e74`; recorded remote beta is comparison evidence only.
- `CUR-DOC-01`: handbook work is preserved in its separate approved commit.
- `CUR-GOV-01`: Gate 0 is PASS.
- `CUR-GOV-02` through `CUR-GOV-08`: `POL-01` through `POL-07` are approved exactly as drafted.
- `CUR-GOV-09`: `HDR-0236` is RESOLVED using snapshot `production-snapshot-2026-07-30-live-01`.
- `CUR-AUTH-01`: controlled implementation and RC preparation are approved; deployment, tag, final release, and production changes remain separate approvals.

## Architecture decision

Garden Brain is an application platform. The website is its first presentation layer. Canonical data, identity, provenance, reconciliation, governance, validation, and business rules remain presentation-independent whenever practical. This constraint does not expand Foundation scope or authorize a native application, API, database, or framework rewrite.

## Stop rule

Any new historical conflict, source-hash mismatch, identifier replacement, or attempted activation of a DEFER or QUARANTINE entity stops implementation and returns to Historical Curator review.
