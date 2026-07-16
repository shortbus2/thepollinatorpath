# Garden Brain 3.1.1 — Testing Bug Fixes

## Fixed

- Plant Garden Walks now default to **Confirmed**; wildlife and named residents remain **Reasonable confidence** by default.
- Corrected the Worker parser that reads `observations.js`, `residents.js`, `placements.js`, and `milestones.js`. This prevents current repository data from appearing empty or being replaced during a publish.
- Publishing a master portrait now updates `image-manifest.js` in the same atomic GitHub commit. Portrait reminders should clear after the new deployment is available, and plant pages can immediately resolve the new hero image.
- Named-resident portraits use the wildlife image collection and update its manifest entry.
- Updated the public wording from **Garden Journal** to **Garden Walks**.
- Corrected **Crusher Fine Loop** to **Flagstone Path**.
- Bumped the service-worker cache so iPhone Safari/Home Screen testing receives the corrected JavaScript instead of stale cached files.

## Deploy

1. Replace the website files in the repository with this build.
2. Deploy the updated `worker` folder.
3. Pull the resulting repository changes before making laptop edits after a phone publish.
4. On iPhone, close and reopen the Home Screen app once after GitHub Pages finishes deploying.
