#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import worker from "../worker/src/worker.js";
import {
  FOUNDATION_WRITE_CONTRACT,
  FOUNDATION_PRODUCTION_CONTRACT,
  classifyTaxonomyHero,
  contractInventory,
  foundationBaselinePlacements,
  withRevision,
} from "../domain/foundation-write-contract.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const API_ROOT = "https://api.github.com/repos/shortbus2/thepollinatorpath";
const ENV = Object.freeze({
  ENVIRONMENT: "staging",
  FOUNDATION_CONTRACT_VERSION: FOUNDATION_WRITE_CONTRACT.version,
  FOUNDATION_BASELINE_COMMIT: FOUNDATION_WRITE_CONTRACT.baselineCommit,
  GITHUB_OWNER: "shortbus2",
  GITHUB_REPO: "thepollinatorpath",
  GITHUB_BRANCH: FOUNDATION_WRITE_CONTRACT.branch,
  GITHUB_TOKEN: "fixture-token",
  NOTEBOOK_KEY: "fixture-key",
  OPENAI_API_KEY: "fixture-ai-key",
  ALLOWED_ORIGIN: "https://thepollinatorpath-staging.pages.dev",
});

const SOURCE_FILES = ["observations.js", "species.js", "residents.js", "image-manifest.js", "placements.js", "milestones.js"];

function response(value, status = 200) {
  return new Response(typeof value === "string" ? value : JSON.stringify(value), { status, headers: { "content-type": "application/json" } });
}

function parseGlobal(text, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = text.match(new RegExp(`window\\.${escaped}\\s*=\\s*([\\s\\S]*?);(?:\\s|$)`));
  if (!match) throw new Error(`Fixture global missing: ${name}`);
  return JSON.parse(match[1]);
}

function createGitHubFixture() {
  const files = Object.fromEntries(SOURCE_FILES.map((filename) => [filename, fs.readFileSync(path.join(ROOT, filename), "utf8")]));
  let revision = FOUNDATION_WRITE_CONTRACT.baselineCommit;
  let sequence = 0;
  const blobs = new Map(), trees = new Map(), commits = [], writes = [];

  async function fetchMock(input, init = {}) {
    const url = typeof input === "string" ? input : input.url;
    const method = String(init.method || (typeof input === "string" ? "GET" : input.method) || "GET").toUpperCase();
    if (url === "https://api.openai.com/v1/responses") return response({ id: "fixture-ai", model: "fixture", output_text: JSON.stringify({ group_together: true, plant: null, visitors: [], behavior: null, memory_summary: "Fixture", overall_confidence: "unidentified", alternatives: [], reasoning: "Fixture", needs_human_review: true, privacy_flags: [] }), usage: {} });
    if (!url.startsWith(API_ROOT)) throw new Error(`Unexpected fixture URL: ${url}`);
    const parsed = new URL(url), endpoint = decodeURIComponent(parsed.pathname.slice(new URL(API_ROOT).pathname.length));
    if (method === "GET" && endpoint.startsWith("/compare/")) return response({ status: revision === FOUNDATION_WRITE_CONTRACT.baselineCommit ? "identical" : "ahead" });
    if (method === "GET" && endpoint.startsWith("/git/ref/heads/")) return response({ object: { sha: revision } });
    if (method === "GET" && endpoint.startsWith("/git/commits/")) return response({ sha: revision, tree: { sha: `tree-${revision}` } });
    if (method === "GET" && endpoint.startsWith("/contents/")) {
      const filename = endpoint.slice("/contents/".length);
      if (!(filename in files)) return response({ message: "Not found" }, 404);
      return response({ content: Buffer.from(files[filename], "utf8").toString("base64") });
    }
    const body = init.body ? JSON.parse(init.body) : {};
    if (method === "POST" && endpoint === "/git/blobs") {
      const sha = `blob-${++sequence}`; blobs.set(sha, body.encoding === "base64" ? Buffer.from(body.content, "base64") : Buffer.from(body.content, "utf8")); return response({ sha }, 201);
    }
    if (method === "POST" && endpoint === "/git/trees") {
      const sha = `tree-${++sequence}`; trees.set(sha, body.tree); return response({ sha }, 201);
    }
    if (method === "POST" && endpoint === "/git/commits") {
      const sha = `fixture-commit-${++sequence}`; commits.push({ sha, parent: body.parents?.[0], tree: body.tree, message: body.message }); return response({ sha }, 201);
    }
    if (method === "PATCH" && endpoint.startsWith("/git/refs/heads/")) {
      assert.equal(body.force, false, "Worker must never force-update the staging branch");
      const commit = commits.find((candidate) => candidate.sha === body.sha); assert.ok(commit, "Fixture commit must exist");
      for (const item of trees.get(commit.tree) || []) {
        assert.notEqual(item.sha, null, `Deletion attempted for ${item.path}`);
        const bytes = item.content !== undefined ? Buffer.from(item.content, "utf8") : blobs.get(item.sha);
        assert.ok(bytes, `Missing blob bytes for ${item.path}`); files[item.path] = bytes.toString("utf8"); writes.push(item.path);
      }
      revision = commit.sha; return response({ ref: `refs/heads/${FOUNDATION_WRITE_CONTRACT.branch}`, object: { sha: revision } });
    }
    throw new Error(`Unhandled fixture request: ${method} ${endpoint}`);
  }
  return { files, fetchMock, get revision() { return revision; }, commits, writes };
}

async function call(fixture, pathname, { method = "GET", body, env = ENV, authenticated = true } = {}) {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = fixture.fetchMock;
  try {
    const headers = new Headers({ origin: "https://thepollinatorpath-staging.pages.dev" });
    if (authenticated) headers.set("authorization", `Bearer ${ENV.NOTEBOOK_KEY}`);
    if (body !== undefined) headers.set("content-type", "application/json");
    const request = new Request(`https://fixture.invalid${pathname}`, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
    const result = await worker.fetch(request, env);
    return { status: result.status, body: await result.json() };
  } finally {
    globalThis.fetch = originalFetch;
  }
}

function current(fixture, filename, globalName) {
  return parseGlobal(fixture.files[filename], globalName);
}

const tests = [];
function test(name, run) { tests.push({ name, run }); }

test("contract inventory matches frozen governance", () => {
  assert.deepEqual(contractInventory(), { deferEntityCount: 68, quarantineMediaCount: 17, approvedUnavailableHeroCount: 8 });
  assert.equal(classifyTaxonomyHero("leafcutter-bee", "images/wildlife/brenda/hero.jpg"), "approved-unavailable");
  assert.equal(classifyTaxonomyHero("stg-new", "images/wildlife/stg-new/hero.jpg"), "unexplained-missing");
});

test("health and garden expose exact staging identity and revision", async () => {
  const fixture = createGitHubFixture();
  const health = await call(fixture, "/health", { authenticated: false }); assert.equal(health.status, 200); assert.equal(health.body.contractVersion, "4.4.0-rc.1"); assert.equal(health.body.branch, FOUNDATION_WRITE_CONTRACT.branch);
  const garden = await call(fixture, "/garden"); assert.equal(garden.status, 200); assert.equal(garden.body.revision, FOUNDATION_WRITE_CONTRACT.baselineCommit); assert.deepEqual(garden.body.placements, foundationBaselinePlacements());
});

test("create, edit, save and read back staging observation while retaining media", async () => {
  const fixture = createGitHubFixture(), id = "stg-2026-08-12-observation-fixture";
  const base = { id, date: "2026-08-12", title: "Fixture", type: "observation", primary: { kind: "visitor", id: "unknown-pending" }, plants: [], visitors: ["unknown-pending"], visitorDetails: [], residents: [], objects: [], areas: [], behaviors: [], confidence: "unidentified", public: true, featured: false, notes: "First", originalNarrative: "First", privacyReview: { completed: true, safeHomepage: false }, photos: [{ name: "fixture.jpg", data: `data:image/jpeg;base64,${Buffer.from("fixture-media").toString("base64")}` }] };
  const created = await call(fixture, "/entry", { method: "POST", body: withRevision(base, fixture.revision) }); assert.equal(created.status, 200); assert.ok(created.body.commitSha);
  const record = current(fixture, "observations.js", "OBSERVATIONS").find((candidate) => candidate.id === id); assert.equal(record.photos.length, 1); assert.match(record.photos[0], /^images\/staging\/observations\//);
  const edited = await call(fixture, "/entry", { method: "PUT", body: withRevision({ ...base, notes: "Edited", originalNarrative: "Edited", photos: [] }, fixture.revision) }); assert.equal(edited.status, 200);
  const after = current(fixture, "observations.js", "OBSERVATIONS").find((candidate) => candidate.id === id); assert.equal(after.notes, "Edited"); assert.deepEqual(after.photos, record.photos); assert.equal(after.provenance.recordClass, "staging-acceptance-test");
  const readBack = await call(fixture, "/garden"); assert.ok(readBack.body.observations.some((candidate) => candidate.id === id && candidate.notes === "Edited"));
});

test("baseline observation edits and destructive deletion are blocked", async () => {
  const fixture = createGitHubFixture(), baseline = current(fixture, "observations.js", "OBSERVATIONS")[0];
  const edit = await call(fixture, "/entry", { method: "PUT", body: withRevision({ ...baseline, title: "Changed", privacyReview: { completed: true }, public: true }, fixture.revision) }); assert.equal(edit.status, 403); assert.equal(edit.body.code, "FOUNDATION_BASELINE_IMMUTABLE");
  const remove = await call(fixture, `/observations/${baseline.id}`, { method: "DELETE" }); assert.equal(remove.status, 403); assert.equal(fixture.writes.length, 0);
});

test("resident relationship and unknown fields survive staging edit", async () => {
  const fixture = createGitHubFixture(), baseline = current(fixture, "residents.js", "GARDEN_RESIDENTS"), id = "stg-resident-fixture";
  const record = { id, name: "Fixture Resident", species: "Fixture bee", speciesId: "leafcutter-bee", confidence: "reasonable", status: "staging-review", public: false, unknownFutureField: { retained: true } };
  let result = await call(fixture, "/residents", { method: "POST", body: withRevision({ residents: [...baseline, record] }, fixture.revision) }); assert.equal(result.status, 200);
  const next = result.body.residents.map((candidate) => candidate.id === id ? { id, name: "Edited Fixture Resident" } : candidate);
  result = await call(fixture, "/residents", { method: "POST", body: withRevision({ residents: next }, fixture.revision) }); assert.equal(result.status, 200);
  const saved = current(fixture, "residents.js", "GARDEN_RESIDENTS").find((candidate) => candidate.id === id); assert.equal(saved.speciesId, "leafcutter-bee"); assert.deepEqual(saved.unknownFutureField, { retained: true });
});

test("taxonomy create and refine preserve relationships while merge remains blocked", async () => {
  const fixture = createGitHubFixture(), baseline = current(fixture, "species.js", "GARDEN_SPECIES"), id = "stg-taxonomy-fixture", at = "2026-08-12T00:00:00.000Z";
  const taxon = { id, name: "Unknown staging visitor", scientificName: "", rank: "unresolved taxon", category: "Wildlife", status: "draft", aliases: [], hero: "", identification: { acceptedIdentificationId: `${id}-ident-1`, acceptedLabel: "Unknown staging visitor", confidence: "unidentified", history: [{ id: `${id}-ident-1`, label: "Unknown staging visitor", confidence: "unidentified", source: "fixture", at, status: "accepted" }] }, parentSpeciesId: null, mergedFrom: [], mergedInto: null, redirectAliases: [], public: false, createdAt: at, updatedAt: at };
  let result = await call(fixture, "/species", { method: "POST", body: withRevision({ species: [...baseline, taxon] }, fixture.revision) }); assert.equal(result.status, 200);
  result = await call(fixture, "/species/refine", { method: "POST", body: withRevision({ speciesId: id, name: "Staging solitary bee", rank: "useful group", confidence: "tentative", parentSpeciesId: "leafcutter-bee", aliases: [], source: "fixture" }, fixture.revision) }); assert.equal(result.status, 200);
  const saved = current(fixture, "species.js", "GARDEN_SPECIES").find((candidate) => candidate.id === id); assert.equal(saved.parentSpeciesId, "leafcutter-bee"); assert.ok(saved.identification.history.length >= 2); assert.equal(saved.hero, "");
  const merge = await call(fixture, "/species/merge", { method: "POST", body: withRevision({ sourceSpeciesId: id, targetSpeciesId: "leafcutter-bee" }, fixture.revision) }); assert.equal(merge.status, 403); assert.equal(merge.body.code, "TAXONOMY_MERGE_BLOCKED");
});

test("placements and milestones preserve baseline records", async () => {
  const fixture = createGitHubFixture();
  let result = await call(fixture, "/placements", { method: "POST", body: withRevision({ placements: [...foundationBaselinePlacements(), { id: "stg-p-fixture", kind: "plant", plantNumber: 1, map: "front-east", x: 1, y: 1, status: "staging-review" }] }, fixture.revision) }); assert.equal(result.status, 200);
  const milestones = current(fixture, "milestones.js", "GARDEN_MILESTONES");
  result = await call(fixture, "/milestones", { method: "POST", body: withRevision({ milestones: [...milestones, { id: "stg-milestone-fixture", date: "2026-08-12", title: "Fixture", public: false }] }, fixture.revision) }); assert.equal(result.status, 200);
});

test("stale writes, malformed sources, DEFER and QUARANTINE fail closed", async () => {
  const fixture = createGitHubFixture(), observations = current(fixture, "observations.js", "OBSERVATIONS");
  const stale = await call(fixture, "/residents", { method: "POST", body: withRevision({ residents: current(fixture, "residents.js", "GARDEN_RESIDENTS") }, "wrong-revision") }); assert.equal(stale.status, 409); assert.equal(stale.body.code, "STALE_REVISION");
  const deferred = await call(fixture, "/entry", { method: "POST", body: withRevision({ id: "2026-07-13-brenda-blanket-flower", date: "2026-07-13", public: true, privacyReview: { completed: true }, photos: [] }, fixture.revision) }); assert.equal(deferred.status, 403); assert.equal(deferred.body.code, "DEFER_PROTECTED");
  const quarantinedPath = observations.flatMap((record) => record.photos || []).find((mediaPath) => mediaPath.includes("2026-07-21-92011266")); assert.ok(quarantinedPath);
  const quarantined = await call(fixture, "/entry", { method: "POST", body: withRevision({ id: "stg-quarantine-fixture", date: "2026-08-12", public: true, privacyReview: { completed: true }, photos: [quarantinedPath] }, fixture.revision) }); assert.equal(quarantined.status, 403); assert.equal(quarantined.body.code, "QUARANTINE_PROTECTED");
  fixture.files["observations.js"] = "window.OBSERVATIONS = not-json;";
  const malformed = await call(fixture, "/garden"); assert.equal(malformed.status, 503); assert.equal(malformed.body.code, "SOURCE_MALFORMED");
});

test("production identity uses the final contract while wrong branches fail closed", async () => {
  const fixture = createGitHubFixture(), env = { ...ENV, ENVIRONMENT: "production", GITHUB_BRANCH: "main", FOUNDATION_CONTRACT_VERSION: FOUNDATION_PRODUCTION_CONTRACT.version, FOUNDATION_BASELINE_COMMIT: FOUNDATION_WRITE_CONTRACT.baselineCommit };
  const health = await call(fixture, "/health", { authenticated: false, env }); assert.equal(health.status, 200); assert.equal(health.body.contractVersion, "4.4.0"); assert.equal(health.body.environment, "production");
  const id = "stg-production-observation-fixture";
  const entry = { id, date: "2026-08-12", title: "Production fixture", type: "observation", primary: { kind: "plant", id: "8" }, plants: [8], visitors: [], visitorDetails: [], residents: [], objects: [], areas: [], behaviors: [], confidence: "confirmed", public: true, featured: false, notes: "Production", originalNarrative: "Production", privacyReview: { completed: true, safeHomepage: false }, photos: [] };
  const created = await call(fixture, "/entry", { method: "POST", body: withRevision(entry, fixture.revision, FOUNDATION_PRODUCTION_CONTRACT.version), env }); assert.equal(created.status, 200);
  const saved = current(fixture, "observations.js", "OBSERVATIONS").find((candidate) => candidate.id === id); assert.equal(saved.provenance.environment, "production"); assert.equal(saved.provenance.recordClass, "garden-brain-managed");
  const wrong = await call(createGitHubFixture(), "/health", { authenticated: false, env: { ...env, GITHUB_BRANCH: "beta-4.3" } }); assert.equal(wrong.status, 503); assert.equal(wrong.body.code, "ENVIRONMENT_IDENTITY_MISMATCH");
});

let passed = 0;
for (const { name, run } of tests) {
  try { await run(); passed += 1; console.log(`PASS ${name}`); }
  catch (error) { console.error(`FAIL ${name}\n${error.stack || error}`); process.exitCode = 1; }
}
console.log(JSON.stringify({ status: process.exitCode ? "FAIL" : "PASS", tests: tests.length, passed }, null, 2));
