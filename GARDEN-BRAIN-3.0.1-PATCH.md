# Garden Brain 3.0.1 connection patch

This patch fixes the secure connection test failing after successful authentication.

The cause was the legacy `placements.js` bridge: it contains a JavaScript expression rather than a JSON array. The Worker tried to parse it as JSON and failed the entire `/garden` request. Authentication itself was already working.

## Install

1. Copy the contents of this package into the repository root and replace existing files.
2. Commit and push: `Fix Garden Brain connection parsing`
3. From the repository `worker` folder run: `npx wrangler deploy`
4. Hard-refresh the Field Notebook and test the connection again.

Your Cloudflare secrets do not need to be changed.
