# The Pollinator Path Field Notebook — v10

## What is already working

- Mobile-first field notebook page at `field-notebook.html`
- Take/select iPhone photos, including HEIC
- Client-side conversion to JPG, orientation correction, resizing to 1600 px, and compression
- Primary subject plus connected plants and wildlife visitors
- Public and private notes, confidence, behavior/stage, garden area, homepage feature flag
- Master-image selection
- Every public observation is designed to populate all connected plant and wildlife journals
- Offline mode creates a downloadable entry package and keeps a lightweight draft on the iPhone
- Desktop bridge at `import-field-entry.html`
- Installable Home Screen web app shell
- Deployable Cloudflare Worker under `/worker` for true one-tap iPhone publishing

## Why one setup step is still required

A GitHub Pages site cannot securely write back to its own repository. The Worker holds the GitHub token as an encrypted secret and accepts authenticated entries from the iPhone form.

## Cloud publishing setup

1. Create a fine-grained GitHub token limited to the `thepollinatorpath` repository with **Contents: Read and write**.
2. Create a free Cloudflare account and install Node.js on the computer used for setup.
3. Open a terminal in the `worker` folder and run:
   - `npm install`
   - `npx wrangler login`
   - `npx wrangler secret put GITHUB_TOKEN`
   - `npx wrangler secret put NOTEBOOK_KEY`
   - `npm run deploy`
4. Copy the deployed Worker URL into `field-config.js` and change `mode` to `cloud`.
5. Commit and push the repository.
6. On iPhone, open `field-notebook.html`, enter the same Notebook Key, then use **Share → Add to Home Screen**.

## Data behavior

Each entry is stored once in `observations.js`. Plant pages and wildlife pages filter that same record by their relationships. A Brenda-on-Blanket-Flower entry therefore appears on Brenda's page and Blanket Flower #8 without duplicating the observation.

## Current first-build limitation

The Worker uses GitHub's file-content API, so an entry with multiple images may create several small commits. This is reliable and simple for the first build. A later version can switch to one atomic Git commit and add a private edit/delete dashboard.
