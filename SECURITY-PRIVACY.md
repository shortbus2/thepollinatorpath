# Security and Privacy Architecture

## Core boundary

**Garden Brain is private memory. The Pollinator Path is the curated public story.**

This release treats the GitHub Pages repository as public. Therefore, private entries and original photos are never uploaded to that repository.

## Current safeguards

- Public publishing is opt-in and off by default.
- The Worker rejects any entry that is not explicitly marked public.
- A completed manual privacy review is required before public publishing.
- Homepage-featured photos require separate “Safe for Homepage” approval.
- Browser-side image preparation redraws every image onto a new canvas and exports a fresh JPEG. This discards EXIF, GPS, device model, original timestamps, and embedded thumbnails.
- Public filenames are randomized by the Worker and do not preserve phone filenames or capture times.
- Private notes and drafts stay in the browser’s local storage and are not sent to GitHub.
- The Worker strips private workflow fields before writing `observations.js`.
- Worker responses use `no-store`, `nosniff`, and `no-referrer` headers.

## Important current limitation

Device-local drafts are not a durable cross-device private archive. Clearing browser data can remove them, and photos are not copied into Garden Brain private storage. The originals remain in the phone’s Photos library.

A true cross-device private Garden Brain requires a separate authenticated private datastore and private object storage. Do not use the public GitHub repository for raw originals, exact private maps, maintenance notes, or unpublished observations.

## Visual privacy

Metadata removal cannot hide visible information inside the pixels. Before publishing, review for:

- house numbers, street signs, mail, labels, and QR codes
- license plates and identifying vehicle details
- faces, people, windows, screens, and reflections
- neighboring homes and recognizable street geometry
- access details, travel plans, and predictable routines in captions

Automated visual detection and permission-based blurring are not active in this release. The interface is ready for that future service, but it must not claim a scan occurred until a real vision endpoint is deployed.

## Credentials

- Keep `GITHUB_TOKEN` and `NOTEBOOK_KEY` only as encrypted Cloudflare Worker secrets.
- Never commit secrets, `.env` files, private keys, or tokens to GitHub.
- Use a fine-grained GitHub token restricted to this repository and only the contents permissions required for publishing.
- Rotate the Garden Brain key after suspected disclosure.
- Pull remote changes in GitHub Desktop before editing locally.
