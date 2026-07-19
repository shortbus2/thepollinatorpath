# Repository Export Checklist

Before sharing a repository snapshot, exclude:

- `.git/`, `.github/` when history/workflows are not needed
- `node_modules/` and `worker/node_modules/`
- `.wrangler/` and `worker/.wrangler/`
- `.env`, `.env.*`, `.dev.vars`, and local secret files
- `dist/`, `build/`, `coverage/`, `.cache/`, logs, and temporary backups
- private keys and certificates (`*.pem`, `*.key`, `*.p12`, `*.pfx`)

Review `wrangler.toml` and `worker/wrangler*.toml`: configuration is expected; secret values are not.

Search before zipping for `OPENAI_API_KEY`, `GITHUB_TOKEN`, `NOTEBOOK_KEY`, `PASSWORD`, `SECRET`, `PRIVATE KEY`, `Bearer`, and `Authorization` and verify results contain names/placeholders only—not actual credentials.
