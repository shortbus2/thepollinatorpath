# Garden Brain 3.0

This release connects the mobile-first Garden Brain interface to the deployed Cloudflare Worker.

## What is new

- `garden-brain.html`: private command center and connection status.
- `field-notebook.html`: rebuilt iPhone-first publishing interface.
- Direct secure publishing to the Worker at the configured workers.dev URL.
- Connection test before publishing.
- Named garden objects can be primary or related subjects.
- Private notes remain only on the device and are never committed to the public repository.
- Master portraits are saved in addition to dated journal copies.
- Worker health response reports version 3.0.

## Install

Copy all files into the repository, replace existing files, commit, and push.
Then redeploy the Worker from the `worker` folder:

    npx wrangler deploy

Your existing `GITHUB_TOKEN` and `NOTEBOOK_KEY` secrets remain attached to the Worker.

Open:

- `/garden-brain.html`
- `/field-notebook.html`

Enter the Garden Brain key and use **Test connection** before the first real entry.


## Version 3.0.2 resident publishing

Garden Residents now load from and publish to `residents.js` through the secure Worker. Deploy the updated Worker before using the resident editor. Phone edits become GitHub commits, so use **Fetch origin / Pull** in GitHub Desktop before editing the source on the laptop.
