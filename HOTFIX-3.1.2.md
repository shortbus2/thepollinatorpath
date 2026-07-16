# Garden Brain 3.1.2 — Regression Hotfix

## Why this build exists

The previous package was generated from the older 3.0.1 source archive and unintentionally reintroduced previously fixed UI and publishing defects. This hotfix restores those fixes without replacing live repository data files.

## Fixed

- Mobile navigation now expands in normal page flow and no longer covers the homepage hero.
- Garden Walk CTA text is visible; the global white-text button rule can no longer erase it.
- Privacy review includes a working **Confirm all privacy checks** action and a clear/reset action.
- Related-subject checkboxes use full-width, mobile-friendly rows.
- Photo selection again provides separate **Take a Photo** and **Choose Existing Photos** controls.
- Gentle nudges now account for missing map placements, sparse observations, unobserved plants, and unobserved named places—not only portraits.
- Added a complete **Garden Tasks** page.
- Dashboard metrics are clickable.
- The displayed site version is 3.1.2 and the helper version is shown separately.
- Worker publishing retries safe fast-forward commits when GitHub returns `422 Reference cannot be updated`.
- Worker parser correctly preserves existing arrays instead of treating valid repository data as empty.
- Master portraits update `image-manifest.js` in the same atomic commit.
- Service worker is network-first and deletes old caches to prevent stale 3.0.1 JavaScript from lingering on iPhone.

## Critical deployment rule

This package intentionally excludes live mutable data files from the patch folder. Do not overwrite `observations.js`, `image-manifest.js`, `placements.js`, `milestones.js`, or resident data with an older ZIP. Those files are the current garden record.
