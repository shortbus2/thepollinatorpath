# Garden Brain 4.0.0 — AI Foundation

## Major changes

- Photo-first Garden Walk interface with AI identification drafts.
- Worker `/identify` endpoint using OpenAI vision and strict structured output.
- Suggestions for plant, visitor, behavior, confidence, alternatives, grouping, and privacy flags.
- User approval remains authoritative; AI output is stored only as supporting draft metadata.
- Published observations can be edited in place.
- Published observations and their dated observation photos can be deleted with confirmation.
- Existing photos can be retained or removed during editing; new photos can be added.
- Entry-specific fields reset after a successful save.
- Public-photo review checks remain sticky on the current device/session.
- Worker and frontend version advanced to 4.0.0-ai-foundation.

## Deployment requirement

Add an OpenAI API key as a Cloudflare Worker secret:

```bash
cd worker
npx wrangler secret put OPENAI_API_KEY
```

Optional model override:

```toml
[vars]
OPENAI_MODEL = "gpt-4.1-mini"
```

Keep `NOTEBOOK_KEY`, GitHub credentials, and `ALLOWED_ORIGIN` configured as in 3.2.0.

## Testing priorities

1. Blurry and backlit insects.
2. Bee/wasp/fly lookalikes.
3. Multiple photos of one observation.
4. Multiple organisms in one frame.
5. Unknown subjects where the correct result is broad or unidentified.
6. Edit an incorrect subject and preserve existing photos.
7. Remove one photo from an entry.
8. Delete a test entry and verify its observation-photo directory is removed.
9. Confirm privacy checks remain selected during repeated entries.
10. Confirm original narrative remains unchanged.
