# Garden Brain 2.1 — One-time automation setup

This connects the private iPhone Field Notebook and Map Editor to GitHub through a Cloudflare Worker. Never place the GitHub token in `field-config.js` or any public repository file.

## You need
- Your GitHub account
- A free Cloudflare account
- Node.js installed on the Windows computer
- Windows PowerShell or Terminal

## 1. Create a fine-grained GitHub token
Create a fine-grained personal access token limited to the `shortbus2/thepollinatorpath` repository.
Repository permission required: **Contents — Read and write**.
Copy the token temporarily. Do not paste it into chat.

## 2. Open Terminal in the worker folder
In File Explorer, open the repository's `worker` folder. Right-click an empty area and choose **Open in Terminal**.

Run:

    npm install
    npx wrangler login

A browser opens. Approve Cloudflare access.

## 3. Add encrypted secrets
Run:

    npx wrangler secret put GITHUB_TOKEN

Paste the GitHub token when prompted.

Create a long private notebook key (a password you will type on your iPhone), then run:

    npx wrangler secret put NOTEBOOK_KEY

Paste that private key when prompted.

## 4. Deploy
Run:

    npm run deploy

Cloudflare prints a URL ending in `.workers.dev`. Copy it.

## 5. Connect the website
Open `field-config.js` in Notepad and change it to:

    window.FIELD_NOTEBOOK_CONFIG = {
      apiUrl: "https://YOUR-WORKER.workers.dev",
      mode: "cloud"
    };

Save. In GitHub Desktop, commit and push the changed file.

## 6. Test
Open:

- `https://thepollinatorpath.co/field-notebook.html`
- `https://thepollinatorpath.co/garden-map-editor.html`

Enter the same private notebook key you stored in Cloudflare.
First test with a harmless map marker or a simple observation without a photo.

## Security notes
- The GitHub token is stored only as an encrypted Cloudflare secret.
- The browser stores your notebook key locally only if you enter it.
- Private notes are intentionally removed before public observation data is written.
- Keep JSON exports as occasional backups even after automation is enabled.
