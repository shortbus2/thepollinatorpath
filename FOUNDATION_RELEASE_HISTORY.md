# Foundation Release History

Purpose: Preserve the auditable lifecycle of the Foundation Reconciliation Release.

Document version: 1.0.0
Last updated: 2026-08-12

| Date | Milestone | Status | Evidence |
|---|---|---|---|
| 2026-07-30 | Governance baseline approved | **COMPLETE** | Governance package and `POL-01` through `POL-07` approval record |
| 2026-07-30 | Production model corrected from assumed `species.js` to deployed `data.js` legacy model | **COMPLETE** | Production profile: `window.PLANTS`, `window.VISITORS`; modern taxonomy `NOT_DEPLOYED` |
| 2026-07-30 | First live-production snapshot | **COMPLETE** | `production-snapshot-2026-07-30-live-01`; 10/10 assets verified |
| 2026-07-30 | `HDR-0236` resolution and Gate 0 | **COMPLETE / PASS** | Verified production identity `5498295761`, commit `69e760cb5d93a2d59d6c17b8ad04b918c0f1f75a` |
| 2026-07-30 | Canonical preview | **COMPLETE** | 293 entities; exactly one disposition per entity |
| 2026-08-12 | Historical Curator decisions and implementation authorization | **COMPLETE** | `FED-2026-08-12-001`, `CUR-AUTH-01` |
| 2026-08-12 | Controlled repository implementation | **COMPLETE THROUGH PHASE 5** | Commits from `6a9bc86` through `cb95c5e` |
| 2026-08-12 | Gate 2 local application validation | **PASS** | 17/17 fixtures; deterministic canonical parity; 12 client surfaces |
| TBD | Gate 1 repository approval | **NOT STARTED** | Requires review of the exact RC diff |
| TBD | Release Candidate approval | **NOT STARTED** | Requires Phase 6 commit and final RC evidence |
| TBD | Staging deployment and validation | **NOT AUTHORIZED** | Separate approval required |
| TBD | Gate 3 and production release | **NOT AUTHORIZED** | Separate approval required |

## Boundary

This history records completed evidence and lifecycle status. It does not authorize tagging, release publication, staging deployment, production changes, or activation of deferred or quarantined entities.
