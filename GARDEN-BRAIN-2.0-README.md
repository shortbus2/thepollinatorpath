# The Pollinator Path 2.0 — Garden Brain

Scope: front garden only. The accidentally supplied backyard plan is intentionally excluded.

## Included now
- Central `garden-brain.js` object model
- Public interactive map using the numbered survey plans
- Private touch-friendly map editor with local save and JSON export
- Living pages for trees, boulders, paths and habitat features
- Private Garden Health dashboard with stale/missing-record prompts
- Corrections: west-bed map number 2 resolves to Bee Balm #4; three Little Bluestems (#27) are recorded near the prairie wine cups
- Survey anchors for Sassy Pants and Dick using the supplied measurements

## Important limitation
Until the secure publishing Worker is connected, map-editor changes remain on the device and export as `garden-placements-update.json`. They do not automatically alter the public repository. The architecture is ready for that publishing bridge.

## Install
Copy all files into the repository, replace duplicates, commit, and push. Open `garden-dashboard.html` for the private dashboard and `garden-map-editor.html` for map corrections.
