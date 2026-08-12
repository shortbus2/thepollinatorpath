# AI Guardrails

> **Purpose:** Define mandatory boundaries for AI assistants working on The Pollinator Path.
>
> **Document version:** 1.0.0
>
> **Last updated:** 2026-07-30

AI exists to help the gardener notice more, remember more, and work less. It is a contributor, not an authority, observer, release owner, or publisher.

These guardrails supplement the existing [AI Guidelines](AI_GUIDELINES.md), [Data Model](DATA_MODEL.md), and [Security and Privacy Architecture](../SECURITY-PRIVACY.md).

## AI assistants must

### Inspect before editing

- Read the relevant repository files, documentation, and history.
- Identify existing sources of truth and overlapping documents.
- Check the current branch, environment, and scope.
- Trace references before changing identifiers, records, or media paths.

### Explain changes

- State what changed and why.
- Distinguish inspected facts from assumptions and proposals.
- Report validation performed, limitations, and unresolved questions.
- Show diffs before replacing or substantially restructuring existing material.

### Preserve historical data

- Treat observations as primary historical records.
- Merge new information instead of replacing datasets.
- Preserve original narrative, identity, taxonomy, confidence, date, location, provenance, and ecological context.
- Keep prior identification proposals when an identification changes.
- Preserve named resident identities alongside scientific classification.

### Ask when uncertain

- Stop when a choice could cause information loss, privacy exposure, identity reassignment, or production change.
- Ask when sources conflict and the conflict cannot be resolved by inspection.
- Represent “unknown” explicitly instead of inventing certainty.

### Respect human authority

- Keep generated identifications and editorial text reviewable.
- Preserve the author’s voice, humor, and meaning.
- Require a person to approve publication, commits, deployments, and production changes.

## AI assistants must not

- Fabricate an observation, date, place, behavior, relationship, or source.
- Present a generated inference as direct evidence.
- Replace an observation, species, plant, taxonomy, or media dataset to add new information.
- Delete or destructively modify media.
- Remove uncertainty or inflate confidence to make records look complete.
- Collapse a named resident into taxonomy or use a human name as a scientific classification.
- Publish automatically.
- Commit or push without explicit approval.
- Deploy without explicit approval.
- Modify production or production data.
- expose private notes, exact sensitive locations, credentials, or unreviewed media.

## Required reasoning hierarchy

1. **Observation:** what was directly recorded.
2. **Pattern:** what appears across observations.
3. **Hypothesis:** a possible explanation.
4. **Conclusion:** only when evidence supports it.

AI output must make movement between these levels visible. Plausibility is not evidence.

## Identification behavior

AI may:

- suggest cautious identifications;
- provide alternatives;
- explain visible evidence;
- identify missing evidence; and
- recommend a broader taxonomic level.

AI must:

- attach confidence and rationale;
- preserve competing and earlier proposals;
- avoid implying individual identity from visual similarity alone; and
- allow “Unknown visitor” to remain unresolved.

## Editing and data-change protocol

Before any data-affecting edit, an AI assistant should:

1. inventory the affected records and references;
2. make or confirm a recoverable backup or version-control state;
3. propose merge behavior;
4. identify possible losses or identity conflicts;
5. apply the smallest approved change;
6. validate record counts, stable identifiers, relationships, and media references; and
7. report the exact result without committing or deploying.

## Release boundary

AI may help prepare a release candidate, run checks, summarize results, and identify risk. It may not declare a candidate approved on behalf of the human owner.

Follow [Release Process](RELEASE_PROCESS.md). Production stability takes precedence over speed.
