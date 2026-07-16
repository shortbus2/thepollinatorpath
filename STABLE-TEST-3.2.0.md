# The Pollinator Path 3.2.0 Stable Test

This is a coherent stability release, not a hotfix.

## Mutable files to preserve from the current repository
- observations.js
- image-manifest.js
- placements.js
- milestones.js

The deployment package intentionally omits those files. `residents.js` is included because it is a new shared data file; review it before replacing an existing customized copy.

## Deploy
1. Commit or back up the current repository.
2. Copy this package over the repository.
3. Deploy the `worker` directory.
4. Wait for GitHub Pages.
5. Fully close and reopen Safari/Home Screen app once.
6. Confirm: `site 3.2.0 stable test · helper 3.2.0-stable-test`.
