# The Pollinator Path v3.2.2 — Mobile Navigation & Garden Brain UI Hotfix

## Status
Release candidate for QC.

## Purpose
A focused patch release that removes the oversized mobile homepage menu, fixes the invisible Garden Brain call-to-action label, and carries forward the publishing/privacy reliability fixes from v3.2.1. No major feature work is included.

## Included
- Right-side mobile navigation drawer with dimmed backdrop.
- Drawer closes after navigation, backdrop tap, Escape, or desktop resize.
- Floating Field Notebook and Search Plants controls hide while navigation is open.
- Fixed the blank white button in Garden Brain: **＋ Start a Garden Walk** is now visible and keyboard-focusable.
- Mutable public data bypasses stale service-worker cache so newly published homepage photos, placements, residents, and image manifests refresh more reliably.
- Homepage safety approval completes/clears its supporting privacy checklist.
- Map editor label changed from **Notebook key** to **Publishing passphrase** with clearer guidance.

## Still open
- Full iPhone/Safari and desktop browser QC.
- Public map publish/update bug must be verified against the deployed Worker and public map.
- New public visual map supplied by the owner.
- Named-tree cleanup: merge Dick/Heritage Oak and add missing Blue Spruce records.
