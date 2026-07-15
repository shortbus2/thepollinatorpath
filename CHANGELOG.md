# Changelog

## 3.2.2 — Mobile Navigation & Garden Brain UI Hotfix

### Fixed
- Replaced the oversized mobile menu with the approved right-side drawer and hid floating actions while it is open.
- Fixed the Garden Brain hero call-to-action whose white label disappeared against its white button.
- Retained the mutable-data cache refresh, homepage privacy checklist synchronization, and Publishing Passphrase wording from v3.2.1.

## 3.2.1 — Mobile Navigation & Publishing Refresh Hotfix

### Fixed
- Replaced the oversized mobile navigation card with a right-side drawer.
- Drawer closes on selection, backdrop tap, Escape, and desktop resize.
- Floating Field Notebook and Search Plants controls hide while navigation is open.
- Prevented stale service-worker copies of observations, placements, residents, and image manifests from masking new publishes.
- Homepage-wide privacy approval now synchronizes the detailed checklist.

### Changed
- Renamed the map editor’s “Notebook key” to “Publishing passphrase.”

All meaningful product changes are recorded here by release.

## [3.2.0] — 2026-07-15 — Ecological Storytelling

### Added

- **A Yard Becoming Habitat** public page with a restrained one-before / one-now photo structure.
- Ecological transformation language centered on: **Not “look what we did.” Look what is thriving now.**
- Wildlife evidence following the transformation photographs.
- Per-plant **What to look for** section.
- Host-plant tag support, initially populated conservatively for milkweeds and pussytoes.
- Repository governance documents: `RELEASE.md`, `ROADMAP.md`, `DECISIONS.md`, `CHANGELOG.md`, and `VERSION`.

### Changed

- Plant directory now sorts alphabetically by the owner’s preferred common name while retaining map numbers.
- Common names now follow the master plant list. *Monarda fistulosa* is displayed as **Bee Balm**, not Wild Bergamot.
- Homepage welcome/entrance message is more prominent.
- Field Notebook describes a single-entry workflow: Garden Walk captures the experience; Garden Brain updates connected records.
- Plant observations default to confirmed plant identity; wildlife identification remains conservatively set to reasonable confidence.

### Fixed

- Expanded mobile navigation remains in page flow rather than covering homepage content.
- Floating Field Notebook and plant-search controls receive improved mobile spacing to reduce overlap.
- Dashboard cards remain clickable.

### Retained and verified in the build

- Progress Update event type.
- Separate camera and existing-photo controls.
- Per-plant master portrait, gallery, and dated observation history.
- Show All task view.
- Named resident support.
- Private-first Garden Walks and explicit public publishing review.
- Separate Safe for Homepage approval.
- Fresh web-image generation that strips embedded metadata.
- Randomized public filenames.
- Worker-side prevention of private records entering the public repository.

### Known issues / required QC

- Replace transformation-page photo placeholders with the matching real photographs.
- Complete iPhone/Safari device testing.
- Test HEIC conversion and both image-input paths.
- Test the deployed Worker/GitHub public-publishing path.
- Continue personalizing generated What to look for text.
- Audit remaining preferred common names and host-plant relationships.
