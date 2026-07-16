# Deploy Garden Brain 3.2.0 Stable Test

This is a coherent stability release, not a hotfix.

## Safe overwrite
Copy the contents of this folder over the current repository and choose **Replace** for conflicts.

The package intentionally does **not** contain these live-data files, so Windows cannot overwrite them:

- `data.js`
- `observations.js`
- `image-manifest.js`
- `placements.js`
- `milestones.js`
- anything inside `images/`

`residents.js` is included because it is the new shared resident data file. If the current repository already has a newer customized `residents.js`, keep that one and copy the other files.

The existing `vendor/` directory is unchanged and should remain in place.

## Deployment order

1. Commit or back up the current repository.
2. Copy this package into the repository root and replace conflicting application files.
3. Commit and push the website changes.
4. Deploy the included `worker` directory with Wrangler.
5. Wait for GitHub Pages to finish.
6. Fully close Safari or the Home Screen app once, then reopen it.
7. Confirm Garden Brain reports `site 3.2.0 stable test · helper 3.2.0-stable-test`.

## First tests

1. Open and close the mobile public menu. It must expand in page flow.
2. Confirm the Garden Walk CTA text is visible.
3. Confirm Gentle Nudges and All Tasks agree.
4. Tap **Confirm standard privacy checks**. The five standard checks should select; homepage approval should remain separate.
5. Publish one small test photo without selecting homepage feature.
6. Confirm the observation appears and the Worker does not return GitHub 422.
7. Publish a master portrait and confirm its portrait task clears after deployment.
