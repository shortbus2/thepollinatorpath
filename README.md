# The Pollinator Path

> **Purpose:** Introduce the project, its mission, its documentation, and the responsibilities of contributors.
>
> **Document version:** 1.0.0
>
> **Last updated:** 2026-07-30

The Pollinator Path is a living ecological garden documentation project. It records a real habitat garden: its plants, wildlife observations, seasonal changes, stewardship decisions, and the relationships that develop between people and the natural world.

It is more than a website and more than a species database. The software exists to help preserve evidence, memory, context, and wonder without allowing the machinery to become more important than the garden.

> Take care of your little piece of the world in a way that allows others to thrive alongside you.

## Mission

The project helps people notice, remember, understand, and share what happens in one small habitat over time. It aims to:

- preserve real observations and their ecological context;
- document how plants, wildlife, weather, and stewardship interact;
- distinguish evidence, identification, uncertainty, and interpretation;
- make the public garden story welcoming, useful, and human;
- demonstrate that beauty and habitat can thrive together; and
- encourage others to become curious about their own piece of the world.

## Rule Zero

**Never lose information that represents a real observation.**

Observations are primary historical records. Photos support observations. New information must be merged into the record; it must not silently replace observations, identities, taxonomy history, confidence, dates, locations, or ecological context.

## Start here

New contributors should begin with [START-HERE.md](START-HERE.md), then follow this reading order:

1. [Project Philosophy](PROJECT_PHILOSOPHY.md)
2. [Design Principles](docs/DESIGN_PRINCIPLES.md)
3. [Architecture](docs/ARCHITECTURE.md)
4. [Data Model](docs/DATA_MODEL.md)
5. [AI Guardrails](docs/AI_GUARDRAILS.md)
6. [Release Process](docs/RELEASE_PROCESS.md)

Supporting project records include:

- [Project Decisions](DECISIONS.md)
- [Security and Privacy Architecture](SECURITY-PRIVACY.md)
- [Roadmap](ROADMAP.md)
- [Changelog](CHANGELOG.md)
- [Current stable-test checklist](docs/QC.md)
- [Existing AI guidelines](docs/AI_GUIDELINES.md)

Release-specific files remain historical evidence. Do not rewrite an old release note or checklist to describe a newer release.

## Contributor orientation

Before making a change:

1. Inspect the repository and the relevant historical documents.
2. Identify the source records that the change could affect.
3. Preserve originals and merge new information.
4. Keep uncertainty visible and explain consequential decisions.
5. Validate locally, then use staging for release review.
6. Obtain human approval before committing, publishing, deploying, or changing production.

Documentation, code, structured records, and media serve different roles. A change to one can create integrity obligations in the others. See the [Architecture](docs/ARCHITECTURE.md), [Data Model](docs/DATA_MODEL.md), and [Release Process](docs/RELEASE_PROCESS.md) before changing behavior or data.

## AI contributor notice

AI assistants are contributors, not authorities. They may help organize evidence, suggest cautious identifications, explain alternatives, and improve writing. They must preserve original observations and human voice, state uncertainty honestly, and leave publication and release decisions to people.

AI assistants must follow [AI Guardrails](docs/AI_GUARDRAILS.md) and the existing [AI Guidelines](docs/AI_GUIDELINES.md). They may not fabricate observations, replace datasets, delete media, commit without approval, deploy without approval, or modify production.

## Current implementation

The repository currently contains a static, mobile-oriented public site and Garden Brain tools. It includes:

- a public homepage and ecological story pages;
- a searchable plant directory and reusable plant profiles;
- a schematic garden map;
- Garden Walk capture, review, and publishing interfaces;
- observation, species, resident, object, placement, and image-manifest records;
- a browser-based photo preparation workflow; and
- a Cloudflare Worker used for guarded publishing and AI-assisted workflows.

The current implementation is described more fully in [Architecture](docs/ARCHITECTURE.md). Version-specific behavior belongs in the changelog and release notes rather than in this overview.

## Working with plant and media records

Plant information is currently represented in `data.js`, with related placement and image-manifest records elsewhere in the repository. Before editing plant content, inspect all references to the plant identifier and preserve its history, names, status, location, and ecological context.

Media is stored under `images/`. Plant and wildlife hero/gallery images use subject-oriented paths, while Garden Walk photographs use observation-oriented paths. The local uploader prepares web-sized JPEG copies and updates the image manifest. Original photographs should remain outside destructive automated workflows.

Photos are evidence supporting observations. A photo path or portrait may change, but that must never erase the observation it supports.

## Local review

Because the public site is static, it can be reviewed with a local web server. Some Garden Brain actions depend on the configured Worker and must be tested only against the intended environment.

Run the repository's static link audit with:

```bash
node scripts/link-audit.mjs .
```

Use the applicable release checklist for behavioral testing. The current release-candidate checklist is [TEST-4.3.2-RC1.md](TEST-4.3.2-RC1.md); it is a historical, version-specific document and should be replaced by a new checklist when a new candidate is prepared.

## Publishing

Do not publish by copying files directly into production as an unreviewed step. Follow the [Release Process](docs/RELEASE_PROCESS.md):

1. validate the candidate and its data;
2. review it in staging;
3. verify rollback readiness;
4. obtain explicit human approval; and
5. promote the exact approved candidate.

Production stability is more important than release speed.
