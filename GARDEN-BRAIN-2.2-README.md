# The Pollinator Path 2.2 — Garden Brain Server

This build replaces one-file-at-a-time publishing with atomic Git commits. One iPhone action can now publish its observation record and every prepared image in one repository commit.

## Backend routes

- `GET /health` — public service check
- `GET /garden` — authenticated Garden Brain snapshot
- `POST /entry` and `POST /observations` — publish one connected observation and its photos
- `POST /placements` — publish map placements
- `POST /milestones` — publish milestones and meaningful firsts
- `POST /objects` — publish named trees, boulders, habitat features, paths, and structures

## Included foundations

- `milestones.js` starts the garden timeline and milestone layer.
- `garden-prompts.js` creates gentle data-quality prompts for missing portraits and stale records.
- Existing Field Notebook and Map Editor endpoints remain compatible.
- Private notes are stripped before public observation data is committed.

## Security

Never store `GITHUB_TOKEN` or `NOTEBOOK_KEY` in the repository. Add them as Cloudflare Worker secrets.
