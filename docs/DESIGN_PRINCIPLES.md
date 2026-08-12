# Design Principles

> **Purpose:** Define the standards used to evaluate product, content, data, and technical decisions.
>
> **Document version:** 1.0.0
>
> **Last updated:** 2026-07-30

## Evidence over assumptions

Begin with what was actually observed. Keep generated suggestions, patterns, hypotheses, and conclusions visibly distinct.

- Cite or preserve the evidence behind an identification.
- Use the narrowest claim the evidence supports.
- Do not turn plausible text into a historical fact.
- Make consequential decisions explainable.

## Preserve history

The project gains value over time only if earlier records remain trustworthy.

- Merge new information instead of replacing datasets.
- Preserve original observations, narrative, dates, locations, confidence, and taxonomy history.
- Make corrections additive and attributable.
- Keep historical release documents intact.

See [Data Model](DATA_MODEL.md) for entity-specific integrity rules.

## Design for uncertainty

Uncertainty is information.

- “Unknown visitor” is a valid result.
- Confidence should be explicit and understandable.
- Interfaces should allow an identification to be proposed, revised, or rejected.
- A complete-looking catalog is not worth false certainty.
- Show people what evidence could strengthen or weaken a claim.

## Ecological value

Features should help someone notice, understand, remember, protect, or wonder about the living system.

- Center relationships and habitat function, not only inventories.
- Preserve seasonal and stewardship context.
- Avoid design choices that expose sensitive habitat or private location details.
- Prefer meaningful ecological signals over vanity metrics.

## Human-friendly design

The project serves people without stripping away personality.

- Use clear language and gentle orientation.
- Preserve names, humor, and original voice.
- Let human-readable resident names supplement scientific classification.
- Reduce the feeling of maintaining multiple databases.
- Make the technology recede so the garden remains the focus.

## Accessibility

The public story and contributor tools should be usable by people with varied devices, abilities, and familiarity.

- Use semantic structure and meaningful labels.
- Support keyboard and assistive-technology use.
- Maintain readable contrast, type, spacing, and touch targets.
- Do not rely on color, imagery, hover, or jargon alone.
- Provide useful text alternatives and safe fallbacks.
- Include mobile behavior in release verification.

## Maintainability

Clarity protects both the software and the history it carries.

- Prefer explicit, inspectable behavior over hidden coupling.
- Keep a single documented responsibility for each record or process.
- Avoid duplicating sources of truth.
- Record durable decisions and version-specific changes in the appropriate documents.
- Keep tests and verification proportional to the risk of the change.
- Leave the repository easier for the next contributor to understand.

## Production stability

Production is a public trust boundary, not a test environment.

- Validate locally and review in staging.
- Verify data and media integrity before promotion.
- Prepare rollback before release.
- Require explicit human approval.
- Prefer a delayed release to an irreversible loss.

## Decision test

Before approving a change, ask:

1. What real evidence does this preserve or clarify?
2. Could it erase or detach historical information?
3. Does it represent uncertainty honestly?
4. Does it support ecological understanding and human meaning?
5. Is it accessible and maintainable?
6. Has it been validated with a safe rollback path?

Continue with [Project Philosophy](../PROJECT_PHILOSOPHY.md), [AI Guardrails](AI_GUARDRAILS.md), and [Release Process](RELEASE_PROCESS.md).
