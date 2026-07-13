# Garden Brain 2.2 — one-time deployment

You are currently at Cloudflare's **Create a Worker** screen, but this project is deployed from PowerShell so Cloudflare receives the complete Garden Brain code rather than a starter template.

## 1. Put 2.2 in the repository

Extract the ZIP and replace the files in the cloned `thepollinatorpath` repository. Commit and push with:

    Install Garden Brain Server 2.2

## 2. Open PowerShell in the Worker folder

In GitHub Desktop choose **Repository → Show in Explorer**. Open the `worker` folder. Click the File Explorer address bar, type `powershell`, and press Enter.

Run:

    npm install
    npx wrangler login

Approve the Cloudflare authorization page that opens.

## 3. Create a fine-grained GitHub token

Create a fine-grained personal access token restricted to `shortbus2/thepollinatorpath`, with repository permission **Contents: Read and write**. Never paste the token into chat or a repository file.

## 4. Store both secrets in Cloudflare

Run:

    npx wrangler secret put GITHUB_TOKEN

Paste the GitHub token when prompted.

Choose a long private Garden Brain password, then run:

    npx wrangler secret put NOTEBOOK_KEY

Paste that password when prompted.

## 5. Deploy

Run:

    npm run deploy

Wrangler will print a URL ending in `.workers.dev`.

## 6. Connect the public site

Open `field-config.js` and set:

    window.FIELD_NOTEBOOK_CONFIG = {
      apiUrl: "https://YOUR-WORKER.workers.dev",
      mode: "cloud"
    };

Commit and push only this non-secret Worker URL.

## 7. Test safely

First visit the Worker URL followed by `/health`. It should report Garden Brain version 2.2. Then open the live Map Editor and publish one harmless marker adjustment. Finally create one observation without a photograph.

Keep JSON export available as an occasional backup, not as the normal workflow.
