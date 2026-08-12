---
title: "Foundation Production Baseline"
document_type: "immutable evidence reference"
status: "verified and accepted"
captured: "2026-07-31"
approved: "2026-07-30"
owner: "Historical Curator / Project Owner"
---

# Foundation Production Baseline

## Purpose

This document identifies the verified live-production snapshot accepted as the historical baseline for the Foundation Reconciliation Release. It records identity only. Production bytes remain in the read-only external evidence package and are not copied into this repository.

## Deployment identity

- Snapshot: `production-snapshot-2026-07-30-live-01`
- Deployment ID: `5498295761`
- Deployed commit: `69e760cb5d93a2d59d6c17b8ad04b918c0f1f75a`
- Deployment ref: `main`
- Deployment environment: `github-pages`
- Capture manifest SHA-256: `69caf21219b17c53833b576b35b842eac7216b7b6e67382aecf0f71e4d49c20a`
- Application identity SHA-256: `3f87657a9586fdfa684bffca47d6c93f3d183b4592d2ed9a5788a8246554774d`
- Capture verifier result: PASS

## Captured asset profile

| Asset | Live source | HTTP status | Bytes | SHA-256 |
|---|---|---:|---:|---|
| `index.html` | `https://www.thepollinatorpath.co/` | 200 | 9013 | `3145fda4d97b87f2b1664f16f83bf86305f819dbe3871d293fd881e01df3bd1e` |
| `plants.html` | `https://www.thepollinatorpath.co/plants.html` | 200 | 2115 | `f879049abb12119781c74acbdeaa700023bf6d825e91399722afbf82d4608fa4` |
| `visitors.html` | `https://www.thepollinatorpath.co/visitors.html` | 200 | 1893 | `4265a64cb8d679b356e713aeb0cdd9df03261cd4c6cb43b4bbe6c6d1cd3b7e93` |
| `garden-walks.html` | `https://www.thepollinatorpath.co/garden-walks.html` | 200 | 2080 | `bcb63244ed596520d454374166e321e00907cf44a48e4168fd25a7739faae558` |
| `data.js` | `https://www.thepollinatorpath.co/data.js` | 200 | 33607 | `4d0030e074252a6de46afe60cb3eb224e075205805427b644cdb5c66311cbfb9` |
| `observations.js` | `https://www.thepollinatorpath.co/observations.js` | 200 | 5439 | `491a7d62b4c6973d4c6875369dddf5d6b360933c6dd3a912669737f6b795b189` |
| `residents.js` | `https://www.thepollinatorpath.co/residents.js` | 200 | 1024 | `4eb88d0edf872518d577d57e5b2b1307f73fb8410bb5c2f9059380205b7c1d9c` |
| `image-manifest.js` | `https://www.thepollinatorpath.co/image-manifest.js` | 200 | 668 | `98ac38c7da203fdaf10b4aef6b9d7d0700b2f0073ff09f632ee0a31114c6d00f` |
| `species.js.http-404` | `https://www.thepollinatorpath.co/species.js` | 404 | 9379 | `b620507312c5e97566a3c6cfaf99144fefc18a0da7d941401dfa0f5f58fb0368` |
| `application-identity.json` | `github-pages-deployment://production/5498295761` | N/A | 3023 | `3f87657a9586fdfa684bffca47d6c93f3d183b4592d2ed9a5788a8246554774d` |

## Deployed data model

- `data.js` supplies `window.PLANTS` and the distinct legacy wildlife domain `window.VISITORS`.
- `observations.js` supplies `window.OBSERVATIONS`.
- `residents.js` supplies `window.GARDEN_RESIDENTS`.
- `image-manifest.js` supplies the approved media manifest global.
- Modern taxonomy was `NOT_DEPLOYED`; the captured `species.js` request returned HTTP 404 and captured entrypoints contained no `species.js` reference.

Repository files, beta refs, staging, RC1, archives, and Git history are comparison evidence only and are never substitutes for this live-production capture.
