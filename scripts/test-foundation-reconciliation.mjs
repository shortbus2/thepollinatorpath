#!/usr/bin/env node

import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runDryRun, ValidationError } from "./foundation-reconciliation.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tests = [];

function test(name, body) {
  tests.push({ name, body });
}

function expectFailure(code, mutator) {
  assert.throws(() => runDryRun(repoRoot, mutator), (error) => error instanceof ValidationError && error.code === code);
}

test("valid canonical dry run", () => {
  const result = runDryRun(repoRoot);
  assert.equal(result.report.status, "PASS");
  assert.equal(result.report.evidence.ledgerRows, 293);
  assert.equal(result.report.identifierChanges, 0);
  assert.equal(result.report.media.taxonomyHeroes.present, 0);
  assert.equal(result.report.media.taxonomyHeroes.approvedUnavailable, 8);
  assert.equal(result.report.media.taxonomyHeroes.intentionallyQuarantined, 0);
  assert.deepEqual(result.report.media.taxonomyHeroes.missing, []);
});

test("repeated dry runs are deterministic", () => {
  assert.equal(runDryRun(repoRoot).sha256, runDryRun(repoRoot).sha256);
});

test("duplicate ledger entity fails closed", () => expectFailure("LEDGER_DUPLICATE", (fixture) => {
  fixture.ledger[1] = structuredClone(fixture.ledger[0]);
}));

test("invalid disposition fails closed", () => expectFailure("DISPOSITION_INVALID", (fixture) => {
  fixture.ledger[0].canonical_disposition = "INVENTED";
}));

test("replacement identifier fails closed", () => expectFailure("IDENTIFIER_REPLACEMENT", (fixture) => {
  fixture.ledger[0].stable_identifier_preserved = "no";
}));

test("unresolved merge decision fails closed", () => expectFailure("DECISION_MISSING", (fixture) => {
  fixture.decisions = fixture.decisions.replaceAll("CUR-MRG-01", "REMOVED-MRG-01");
}));

test("unavailable taxonomy hero decision fails closed when missing", () => expectFailure("DECISION_MISSING", (fixture) => {
  fixture.decisions = fixture.decisions.replaceAll("CUR-NEW-002", "REMOVED-NEW-002");
}));

test("active deferred entity fails closed", () => expectFailure("INACTIVE_DISPOSITION_ACTIVE", (fixture) => {
  const row = fixture.ledger.find((candidate) => candidate.canonical_disposition === "DEFER");
  row.active_in_preview = "yes";
}));

test("unclassified missing media fails closed", () => expectFailure("ACTIVE_MEDIA_MISSING", (fixture) => {
  const record = fixture.canonical.canonical_preview.observations.active[0].record;
  record.photos = [...(record.photos ?? []), "images/observations/not-approved/missing.jpg"];
}));

test("approved quarantined media is intentionally unavailable", () => {
  const result = runDryRun(repoRoot);
  assert.equal(result.report.media.intentionallyQuarantined, 17);
  assert.deepEqual(result.report.media.missing, []);
});

test("unclassified missing taxonomy hero fails closed", () => expectFailure("ACTIVE_TAXONOMY_HERO_MISSING", (fixture) => {
  fixture.canonical.canonical_preview.modern_species.proposed_active[0].record.hero = "images/wildlife/not-approved/hero.jpg";
}));

test("present active taxonomy hero is valid", () => {
  const result = runDryRun(repoRoot, (fixture) => {
    fixture.canonical.canonical_preview.modern_species.proposed_active[0].record.hero = "images/maps/front-aerial-measured.jpg";
  });
  assert.equal(result.report.media.taxonomyHeroes.present, 1);
  assert.equal(result.report.media.taxonomyHeroes.approvedUnavailable, 7);
  assert.deepEqual(result.report.media.taxonomyHeroes.missing, []);
});

test("quarantined taxonomy hero follows existing quarantine semantics", () => {
  const result = runDryRun(repoRoot, (fixture) => {
    fixture.canonical.canonical_preview.modern_species.proposed_active[0].record.hero = "images/observations/2026/2026-07-21-92011266-0d78-4c03-8986-7ed9e090e4b4/garden-030f38a9-2cd3-4bc5-826f-5a136551235a-2.jpg";
  });
  assert.equal(result.report.media.taxonomyHeroes.intentionallyQuarantined, 1);
  assert.equal(result.report.media.taxonomyHeroes.approvedUnavailable, 7);
  assert.deepEqual(result.report.media.taxonomyHeroes.missing, []);
});

test("invalid plant reference fails closed", () => expectFailure("PLANT_REFERENCE", (fixture) => {
  fixture.canonical.canonical_preview.observations.active[0].record.plants = ["not-a-plant"];
}));

test("production substitution fails closed", () => expectFailure("PRODUCTION_SUBSTITUTION", (fixture) => {
  fixture.canonical.metadata.deployment_id = "comparison-source";
}));

test("duplicate target ID fails closed", () => expectFailure("DUPLICATE_ID", (fixture) => {
  fixture.canonical.canonical_preview.observations.active.push(structuredClone(fixture.canonical.canonical_preview.observations.active[0]));
}));

test("duplicate current runtime ID fails closed", () => expectFailure("DUPLICATE_ID", (fixture) => {
  fixture.globals.OBSERVATIONS.push(structuredClone(fixture.globals.OBSERVATIONS[0]));
}));

let failures = 0;
for (const entry of tests) {
  try {
    entry.body();
    console.log(`PASS ${entry.name}`);
  } catch (error) {
    failures += 1;
    console.error(`FAIL ${entry.name}: ${error.stack ?? error.message}`);
  }
}

console.log(`\n${tests.length - failures}/${tests.length} tests passed`);
if (failures) process.exitCode = 1;
