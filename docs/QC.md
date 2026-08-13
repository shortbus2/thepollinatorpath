# Stable Test QC

## Foundation Release Gate 2 — automated evidence

- [x] Frozen canonical preview, disposition ledger, and counts hashes match.
- [x] All 293 entity dispositions are accounted for exactly once.
- [x] Duplicate entity keys and replacement identifiers equal zero.
- [x] Provenance failures equal zero.
- [x] Active DEFER and QUARANTINE entities equal zero.
- [x] Runtime observations, modern taxonomy, residents, plants, legacy visitors, and media manifest match the approved target exactly.
- [x] Observation media reports 64 present, 17 intentionally quarantined, and zero unexplained missing.
- [x] Taxonomy heroes report 0 present, 8 approved unavailable, 0 intentionally quarantined, and 0 unexplained missing.
- [x] All 17 fail-closed fixtures pass and three repeated validation runs are deterministic.
- [x] JavaScript syntax, HTML asset/navigation references, and documentation links pass.
- [x] Twelve local browser surfaces start without page exceptions or failed local requests.
- [x] Service-worker install, activation, cache rotation, and offline taxonomy retrieval pass.
- [x] Service-worker code remains infrastructure-only.
- [x] Production snapshot anchors rehash 10 of 10 and production remains unchanged.

Gate 2 recommendation recorded on 2026-08-12: **PASS**. Staging and production remain separate approvals.

## Public site
- [ ] Mobile menu expands in page flow and closes correctly.
- [ ] Homepage works with zero, one, and several hero images.
- [ ] This Week in the Garden handles an empty week gracefully.

## Garden Brain
- [ ] CTA text is visible.
- [ ] Dashboard metrics link correctly.
- [ ] Gentle nudges and All Tasks use the same task engine.
- [ ] Resident add/edit publishes and reloads.

## Garden Walk
- [ ] Camera and library choices both work on iPhone.
- [ ] Related-subject controls are usable on mobile.
- [ ] Plant confidence defaults to Confirmed.
- [ ] Wildlife/resident confidence defaults to Probable.
- [ ] Confirm all checks selects only the five core checks.
- [ ] Homepage approval remains an independent decision.
- [ ] Photo publish succeeds and updates observations/manifest.
- [ ] Failed publishing leaves live data unchanged.
