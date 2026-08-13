# Data Model

> **Purpose:** Define the project’s conceptual entities, relationships, and historical-integrity rules independently of any one file format.
>
> **Document version:** 1.0.0
>
> **Last updated:** 2026-07-30

## Foundational rule

An observation is the primary historical record. A photo is evidence that supports an observation. Taxonomy, identification, narrative, and presentation may evolve, but they must remain connected to the event as it was recorded.

**Never lose information that represents a real observation.**

This is a conceptual model. Current storage mappings should be verified against the repository before implementation changes. See [Architecture](ARCHITECTURE.md).

## Observation

An **Observation** records something noticed at a particular time and place.

It may include:

- a stable identifier;
- date and, when appropriate, time;
- location or habitat zone;
- original narrative and later editorial versions;
- observed subjects and behaviors;
- environmental or seasonal context;
- supporting photos;
- privacy and publication state; and
- links to identification proposals and related records.

Integrity rules:

- An observation must not be deleted or replaced because an identification changes.
- Original narrative must remain recoverable when polished or summarized text is added.
- Dates, locations, confidence, and context must not be silently regenerated.
- Corrections should be attributable and preserve prior meaning.
- Public presentation state is not ownership of the underlying historical record.

## Photo

A **Photo** is evidence supporting one or more observations. It may also serve as a current portrait or gallery image for a plant, taxon, or named resident.

Integrity rules:

- A photo must remain linked to the observation that gives it context.
- Portrait selection must not imply that the photo is the entity itself.
- Refiling or resizing media must preserve provenance and relationships.
- Original files must not be destructively altered by routine automation.
- Privacy review applies to visible content even after metadata removal.
- Deleting or replacing a public derivative requires checking every reference.

## Taxon

A **Taxon** represents a scientific classification or the narrowest useful group supported by evidence. It may be a species, genus, family, or intentionally broader grouping.

It may include:

- a stable identifier;
- accepted and alternate labels;
- scientific name and rank;
- category;
- taxonomy history;
- merge or redirect history; and
- public descriptive material.

Integrity rules:

- A taxon record must not be overwritten by a newly generated candidate.
- Narrower classification requires evidence; broader uncertainty is valid.
- Merges must retain aliases, redirects, prior identifications, and provenance.
- Human-readable resident names supplement taxonomy and do not replace it.

## Identification

An **Identification** relates an observation to a taxon or proposed taxon. It represents a claim, not the observation itself.

It may include:

- proposed label and scientific name;
- confidence level or band;
- supporting evidence;
- source and reviewer;
- status such as proposed, accepted, revised, or rejected;
- timestamp; and
- links to earlier or later proposals.

Integrity rules:

- Identification history is append-oriented.
- A revised identification must not erase the previous proposal or confidence.
- Generated suggestions remain suggestions until human review.
- “Unknown visitor” is a valid state.
- Confidence must reflect evidence, not the desire for a complete catalog.

## Visit

A **Visit** groups related observations from one outing or coherent encounter. “Garden Walk” is the current user-facing expression of this concept.

A visit may include:

- a stable identifier;
- start date/time and optional end;
- one or more locations;
- a personal narrative;
- multiple observations and photos; and
- privacy and publication decisions.

Integrity rules:

- Grouping must not collapse distinct observations into one indistinguishable record.
- Splitting or regrouping should preserve original membership history.
- A visit’s narrative does not replace the individual evidence attached to observations.

**Inspection placeholder:** confirm whether Visit currently has a distinct persisted identifier or is represented through observation grouping.

## Location

A **Location** identifies a garden area, habitat zone, or other meaningful place.

It may include:

- a stable identifier and human-readable name;
- map position or geometry;
- habitat description;
- privacy/public precision;
- parent or neighboring locations; and
- location history.

Integrity rules:

- Public location detail must respect privacy and habitat sensitivity.
- Renaming a place must preserve its identity and historical references.
- Movement of a plant or observation does not rewrite where earlier events occurred.

**Inspection placeholder:** reconcile current map zones, plant locations, areas, objects, and future first-class Garden Places into an approved location model.

## Plant Record

A **Plant Record** represents an individual plant, planting, cultivar grouping, or other approved garden subject.

It may include:

- stable map or record identifiers;
- owner-preferred common name;
- botanical name and cultivar;
- origin or classification badges;
- location and placement history;
- establishment, status, and stewardship history;
- bloom, habitat, and wildlife relationships;
- narratives, notes, and media; and
- links to observations.

Integrity rules:

- Botanical classification remains distinct from the owner-preferred display name.
- Cultivar and species distinctions must not be flattened.
- Relocation, loss, replacement, or status change must be recorded as history.
- A current portrait or current status must not erase earlier states.
- Observation links must survive plant-record editing or merging.

## Named resident identity

A recurring individual may have a human-readable identity such as Beth, Brenda, Saul, or Big Booty Judy.

The named identity links human memory to observations and one or more cautious taxonomic identifications. It does not assert that every similar organism is the same individual, and it does not replace scientific classification.

## Relationship summary

- A Visit groups one or more Observations.
- An Observation occurs at a Location.
- An Observation may concern Plant Records, named residents, objects, or other subjects.
- Photos support Observations and may additionally serve presentation roles.
- Identifications connect Observations to Taxa with evidence and confidence.
- Taxa and Identifications accumulate history rather than replacing it.
- Locations and Plant Records maintain their own change history while retaining links to past Observations.

## Global integrity rules

1. Prefer stable identifiers over display text as relationship keys.
2. Merge records explicitly; never replace an entire dataset to add one record.
3. Preserve original values and provenance when correcting or enriching data.
4. Validate references in both directions before release.
5. Treat empty, unknown, and uncertain as meaningful states.
6. Separate private records from public representations.
7. Require human review for destructive, identity-changing, or public actions.

## Reconciliation state and provenance

The Foundation implementation uses five evidence dispositions without turning them into taxonomy or observation attributes:

- **KEEP:** retain the approved active value and stable identifier.
- **RESTORE:** restore the approved strong-source record without replacing its identifier.
- **MERGE:** activate only the exact approved field outcome while preserving source variants.
- **DEFER:** preserve the evidence but keep the entity inactive.
- **QUARANTINE:** preserve the relationship and evidence without activating or importing the media.

Every one of the 293 reconciled entities has exactly one ledger disposition. The ledger and canonical preview are evidence assets; the current website arrays are active presentation projections.

### Media availability states

- A missing observation photo is a validation failure unless its exact media ledger row is `QUARANTINE`.
- The 17 approved quarantined observation-media paths remain referenced for historical integrity and inactive as media assets.
- Taxonomy `hero` paths are optional presentation metadata. The eight ID-and-path pairs in `CUR-NEW-002` may remain as approved unavailable references without importing bytes.
- An unlisted missing active taxonomy hero remains a validation failure.
- Availability classification never authorizes fabrication, substitution, renaming, movement, or deletion of media.

See [Design Principles](DESIGN_PRINCIPLES.md), [AI Guardrails](AI_GUARDRAILS.md), and [Release Process](RELEASE_PROCESS.md).
