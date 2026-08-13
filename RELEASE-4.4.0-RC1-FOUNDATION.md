# The Pollinator Path 4.4.0 RC1 — Foundation Reconciliation

## Status

Release Candidate preparation. Gate 2 local application validation is PASS. Staging, tagging, release publication, and production deployment are not authorized.

## Objective

Establish a trustworthy, auditable canonical garden baseline before future historical-import work or broader Garden Brain application development.

## Included

- Governance and evidence directories with durable authority, review, release-gate, reconciliation, and import policies.
- Immutable production-baseline and canonical-preview evidence.
- A complete 293-entity disposition ledger.
- Fail-closed reconciliation and validation tooling with 17 fixtures.
- Approved active projections: 23 observations, 8 modern taxonomy records, 4 residents, 45 plants, and 4 legacy visitors.
- Ten exact Historical Curator merge outcomes.
- Modern taxonomy availability through the current website entrypoints and offline cache.
- Exact classification for 17 quarantined observation media references and eight approved unavailable taxonomy hero references.

## Integrity result

- Dispositions: KEEP 86, RESTORE 112, MERGE 10, DEFER 68, QUARANTINE 17.
- Unique entity keys: 293; duplicate keys: 0.
- Replacement identifiers: 0.
- Provenance failures: 0.
- Active DEFER entities: 0.
- Active QUARANTINE entities: 0.
- Observation media: 64 present, 17 intentionally quarantined, 0 unexplained missing.
- Taxonomy heroes: 0 present, 8 approved unavailable, 0 intentionally quarantined, 0 unexplained missing.
- Production snapshot: 10/10 assets rehashed successfully.

## Application validation

- 17/17 fixtures pass.
- Three repeated canonical validation runs are deterministic.
- JavaScript syntax, local HTML references, navigation, and documentation links pass.
- Twelve public and Garden Brain client surfaces start without page-level errors.
- The service worker caches `species.js`, retrieves it offline, and contains no canonical business rules.
- Modern `window.GARDEN_SPECIES` remains distinct from legacy `window.VISITORS`.

## Architecture

Garden Brain remains an application platform; the website is its first presentation layer. Canonical evidence, stable identity, provenance, reconciliation, governance, and validation remain outside page-specific UI logic whenever practical. This candidate introduces no API, database, native client, authentication redesign, or application framework.

## Explicitly deferred or excluded

- 68 DEFER entities remain inactive.
- 17 QUARANTINE media rows remain inactive and are not imported.
- Historical-import implementation and bulk migration are not included.
- No media bytes are added, deleted, renamed, moved, consolidated, or recompressed.
- No production snapshot, Git history, tag, release, staging environment, or production environment is modified by RC preparation.

## Known presentation warnings

- Eight taxonomy hero paths are preserved as curator-approved unavailable presentation metadata.
- Five inherited plant-card fallback paths may request absent noncanonical hero images; this is documented UI debt outside the Foundation reconciliation scope.
- Existing UI version strings outside the approved Phase 6 path set may still display 4.3.2 until separately reviewed.

## Rollback

Each implementation phase is an independent commit. Roll back by reverting the failing logical commit or the Phase 6 release-metadata commit. Do not force-push, rewrite history, alter evidence, or delete media. The accepted production snapshot remains immutable.

## Remaining approvals

1. Review and commit Phase 6 documentation, version metadata, and checksums.
2. Complete Gate 1 repository review against the exact RC commit.
3. Authorize and validate staging separately.
4. Complete Gate 3 before any tag, release publication, or production action.
