# Project Decisions

This file is the durable record of approved design and architecture decisions. New decisions should be appended; old decisions should not be silently rewritten.

## D-001 — Private memory versus public story

**Date:** 2026-07-14  
**Status:** Approved and foundational

**Decision:** Garden Brain is the owner’s private memory. The Pollinator Path is the curated public story.

**Reason:** Private observations can remain candid and complete without automatically becoming public content. Public material can be intentionally selected, privacy-reviewed, and shaped into a coherent ecological story.

---

## D-002 — Keep the joy

**Date:** 2026-07-15  
**Status:** Approved and foundational

**Decision:** The primary capture workflow must feel like noticing and remembering the garden, not maintaining multiple databases.

**Implementation rule:** The owner records what happened once. Garden Brain determines which plant, wildlife, resident, place, journal, recap, and timeline records should be updated.

---

## D-003 — Keep the discipline

**Date:** 2026-07-15  
**Status:** Approved and foundational

**Decision:** Conversations generate ideas, but the repository preserves decisions, releases, known issues, and future work.

**Implementation rule:** Every release must include a version, changelog, release summary, roadmap status, and known issues.

---

## D-004 — Owner-preferred common names

**Date:** 2026-07-15  
**Status:** Approved and implemented in 3.2.0

**Decision:** The owner’s master plant list controls the common name shown throughout the site. Botanical names remain the authoritative species identifier.

**Example:** *Monarda fistulosa* is **Bee Balm** throughout the site, even when outside sources use Wild Bergamot.

---

## D-005 — Plant-list browsing order

**Date:** 2026-07-15  
**Status:** Approved and implemented in 3.2.0

**Decision:** Public plant listings are alphabetized by common name. Map numbers remain visible as location references but do not control list order.

---

## D-006 — Ecological transformation, not renovation portfolio

**Date:** 2026-07-15  
**Status:** Approved and implemented in 3.2.0

**Decision:** Before/current photographs communicate ecological change rather than documenting construction steps.

**Framing:** Not “look what we did.” **Look what is thriving now.**

**Page structure:** One wide starting photograph, one matching current photograph, then evidence of wildlife, habitat function, and biodiversity.

---

## D-007 — Garden Walk versus records

**Date:** 2026-07-15  
**Status:** Approved and implemented conceptually in 3.2.0

**Decision:** A Garden Walk is the user-facing experience and chronological field note. Records are Garden Brain’s structured, connected memory. The user should not have to decide which database receives an observation.

---

## D-008 — Privacy-first publishing

**Date:** 2026-07-14  
**Status:** Approved and implemented

**Decision:** Garden Walks remain private by default. Public publication requires explicit review, public-photo privacy approval, and separate approval for homepage imagery. Private content must be blocked from public repository publication at the Worker layer.
