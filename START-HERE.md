# Start Here

> **Purpose:** Orient new human and AI contributors before they inspect, document, or change The Pollinator Path.
>
> **Document version:** 1.0.0
>
> **Last updated:** 2026-07-30

## Rule Zero

> **Never lose information that represents a real observation.**

This rule applies to prose, structured records, photographs, identifiers, taxonomy, confidence, dates, places, and ecological context. When new information arrives, merge it. Do not regenerate the past or replace a historical record with a cleaner-looking one.

## What this project is

The Pollinator Path is a living record of a real habitat garden and the life connected to it. It brings together:

- direct garden and wildlife observations;
- photographs and other supporting evidence;
- plant, resident, visitor, place, and taxonomy records;
- seasonal and long-term ecological change;
- stewardship choices and their consequences;
- personal memory, names, humor, and meaning; and
- a curated public story intended to invite curiosity.

Garden Brain supports private noticing and memory. The Pollinator Path presents deliberately reviewed public material. The boundary between them is foundational.

## What this project is not

The project is not:

- a generic species database;
- an inventory whose item count matters more than accuracy;
- a place to manufacture observations from plausible text or images;
- an automated publishing pipeline without human judgment;
- a renovation portfolio centered on appearance alone;
- a substitute for scientific evidence or expert identification; or
- a reason to erase human stories in pursuit of sterile data.

## Project priorities

When priorities compete, use this order:

1. Preserve real observations and their history.
2. Protect private information and production stability.
3. Represent evidence and uncertainty honestly.
4. Preserve ecological and human context.
5. Keep the experience accessible and maintainable.
6. Improve presentation and convenience.
7. Add volume only when it does not weaken the priorities above.

## Reading order

1. [README](README.md) — mission and contributor orientation.
2. [Project Philosophy](PROJECT_PHILOSOPHY.md) — why the project exists.
3. [Design Principles](docs/DESIGN_PRINCIPLES.md) — how decisions are evaluated.
4. [Architecture](docs/ARCHITECTURE.md) — how the current repository is organized.
5. [Data Model](docs/DATA_MODEL.md) — what the records mean and how they relate.
6. [AI Guardrails](docs/AI_GUARDRAILS.md) — boundaries for AI-assisted work.
7. [Release Process](docs/RELEASE_PROCESS.md) — how changes reach production.

Then read the durable [Project Decisions](DECISIONS.md), [Security and Privacy Architecture](SECURITY-PRIVACY.md), and the release-specific documents relevant to the task.

## Before changing anything

- Confirm which branch and environment are in scope.
- Inspect existing documentation and history before creating a competing source of truth.
- Identify records and media that could be affected.
- Distinguish observed facts from interpretation and generated suggestions.
- Make the smallest change that satisfies the need.
- Explain assumptions, risks, validation, and unresolved questions.
- Do not commit, deploy, publish, or modify production without explicit human approval.

If a change could discard information and the correct merge is unclear, stop and ask.

## Where questions belong

- Product and ecological intent: [Project Philosophy](PROJECT_PHILOSOPHY.md)
- Approved durable decisions: [DECISIONS.md](DECISIONS.md)
- Technical boundaries: [Architecture](docs/ARCHITECTURE.md)
- Entity meaning and integrity: [Data Model](docs/DATA_MODEL.md)
- AI behavior: [AI Guardrails](docs/AI_GUARDRAILS.md)
- Privacy: [Security and Privacy Architecture](SECURITY-PRIVACY.md)
- Promotion and rollback: [Release Process](docs/RELEASE_PROCESS.md)
