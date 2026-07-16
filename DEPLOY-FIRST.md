# Deploy Garden Brain 3.1.2 Regression Hotfix

1. Back up or commit the current repository before copying files.
2. Copy only the files in this hotfix package into the repository root, preserving folder paths.
3. Do **not** replace or delete live data files such as `observations.js`, `image-manifest.js`, `placements.js`, `milestones.js`, or resident data.
4. Commit and push the website changes.
5. Deploy the updated `worker` folder with Wrangler.
6. Wait for GitHub Pages to finish.
7. On iPhone, fully close Safari/Home Screen Garden Brain and reopen it. The new service worker will remove the stale 3.0.1 cache.
8. Confirm the Garden Brain badge reads `site 3.1.2 · helper 3.1.2-regression-hotfix` before testing a photo publish.
