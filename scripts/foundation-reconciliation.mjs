#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

export const EXPECTED = Object.freeze({
  canonicalSha256: "49e68a01339647f3da38bb637488ea4399d9b9965500d56457e4ddae19fa8719",
  ledgerSha256: "b8b80b653ecdef96fcb0e6b28bee496f80c7ff1a8cbf4a5d45403f8ea3131446",
  countsSha256: "9466f0f8cae9babcd923f1ff4af731bd29de83d83ff867bb16e003870fb1b7c5",
  productionManifestSha256: "69caf21219b17c53833b576b35b842eac7216b7b6e67382aecf0f71e4d49c20a",
  deploymentId: "5498295761",
  deploymentCommit: "69e760cb5d93a2d59d6c17b8ad04b918c0f1f75a",
  ledgerRows: 293,
  dispositions: Object.freeze({ KEEP: 86, RESTORE: 112, MERGE: 10, DEFER: 68, QUARANTINE: 17 }),
});

const ALLOWED_DISPOSITIONS = new Set(Object.keys(EXPECTED.dispositions));
const EVIDENCE_RELATIVE = path.join("docs", "evidence", "reconciliation", "foundation-4.4.0-rc.1");
const RUNTIME_FILES = Object.freeze(["data.js", "observations.js", "species.js", "residents.js", "image-manifest.js"]);

const APPROVED_OBSERVATION_VARIANTS = Object.freeze({
  "2026-07-17-3fc7c311-0fba-4462-8928-64e84faf746a": "57895f0e4fd704b29e4573f42ba023e7486e4452914d3c9f9be9c7bd69e5f0e7",
  "2026-07-18-ba83f3eb-aa68-4f4e-931b-2243be1f8cf2": "ada06fad3cae169988fcd4a1098218d39c85523b2a0e4ec5d033eac3106b5e9d",
  "2026-07-18-db065ce5-2e37-4ed2-91b2-e7c859b4a344": "908af6f846ae913280657093a9bb8e41be3deddd0266c77be22b5eff13d083d1",
  "2026-07-19-dc4cd81a-e75d-42e7-9a2d-c573d043d7be": "7e13ee4fad956b79e302201a60e120540cce13470010e8a399725a3c8641b17f",
});

const APPROVED_RESIDENT_SPECIES = Object.freeze({
  beth: "broad-tailed-hummingbird",
  brenda: "leafcutter-bee",
  "little-head-todd": "toad-unresolved",
  "big-booty-judy": "toad-unresolved",
});

export class ValidationError extends Error {
  constructor(code, message, details = undefined) {
    super(message);
    this.name = "ValidationError";
    this.code = code;
    this.details = details;
  }
}

export function sha256Bytes(bytes) {
  return crypto.createHash("sha256").update(bytes).digest("hex");
}

export function sha256File(filename) {
  return sha256Bytes(fs.readFileSync(filename));
}

export function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (quoted) {
      if (char === '"' && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') quoted = false;
      else field += char;
    } else if (char === '"') quoted = true;
    else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      field = "";
    } else field += char;
  }
  if (quoted) throw new ValidationError("CSV_UNCLOSED_QUOTE", "CSV contains an unclosed quoted field");
  if (field.length || row.length) {
    row.push(field.replace(/\r$/, ""));
    rows.push(row);
  }
  if (rows.length < 2) throw new ValidationError("CSV_EMPTY", "CSV must contain a header and at least one row");
  const headers = rows[0];
  return rows.slice(1).filter((values) => values.some((value) => value !== "")).map((values, index) => {
    if (values.length !== headers.length) throw new ValidationError("CSV_WIDTH", `CSV row ${index + 2} has ${values.length} fields; expected ${headers.length}`);
    return Object.fromEntries(headers.map((header, column) => [header, values[column]]));
  });
}

export function parseRepositoryGlobals(repoRoot) {
  const context = { window: {} };
  vm.createContext(context);
  for (const filename of RUNTIME_FILES) {
    const absolute = path.join(repoRoot, filename);
    if (!fs.existsSync(absolute)) throw new ValidationError("RUNTIME_FILE_MISSING", `Required runtime file is missing: ${filename}`);
    try {
      vm.runInContext(fs.readFileSync(absolute, "utf8"), context, { filename, timeout: 2000 });
    } catch (error) {
      throw new ValidationError("RUNTIME_PARSE", `Unable to parse ${filename}: ${error.message}`);
    }
  }
  const required = ["PLANTS", "VISITORS", "OBSERVATIONS", "GARDEN_SPECIES", "GARDEN_RESIDENTS", "IMAGE_MANIFEST"];
  for (const globalName of required) {
    if (!(globalName in context.window)) throw new ValidationError("GLOBAL_MISSING", `window.${globalName} is not defined`);
  }
  return structuredClone(context.window);
}

function uniqueBy(items, keyOf, domain) {
  const seen = new Set();
  for (const item of items) {
    const key = String(keyOf(item));
    if (!key || key === "undefined") throw new ValidationError("IDENTIFIER_MISSING", `${domain} contains a record without a stable identifier`);
    if (seen.has(key)) throw new ValidationError("DUPLICATE_ID", `${domain} contains duplicate identifier ${key}`);
    seen.add(key);
  }
  return seen;
}

function selectedObservationRecord(wrapper) {
  const approvedHash = APPROVED_OBSERVATION_VARIANTS[wrapper.id];
  const variant = wrapper.variants.find((candidate) => candidate.sha256 === approvedHash);
  if (!variant) throw new ValidationError("APPROVED_VARIANT_MISSING", `Approved observation variant is missing for ${wrapper.id}`);
  return structuredClone(variant.record);
}

function selectedResidentRecord(wrapper) {
  const speciesId = APPROVED_RESIDENT_SPECIES[wrapper.id];
  const variant = wrapper.variants.find((candidate) => candidate.record?.speciesId === speciesId);
  if (!variant) throw new ValidationError("APPROVED_VARIANT_MISSING", `Approved resident variant is missing for ${wrapper.id}`);
  return structuredClone(variant.record);
}

export function buildApprovedTarget(canonical) {
  const observations = [
    ...canonical.canonical_preview.observations.active.map((entry) => structuredClone(entry.record)),
    ...canonical.canonical_preview.observations.merge_pending.map(selectedObservationRecord),
  ];
  const target = {
    observations,
    modernSpecies: canonical.canonical_preview.modern_species.proposed_active.map((entry) => structuredClone(entry.record)),
    residents: canonical.canonical_preview.residents.map(selectedResidentRecord),
    plants: canonical.canonical_preview.plants.map((entry) => structuredClone(entry.record)),
    legacyVisitors: canonical.canonical_preview.legacy_visitors.map((entry) => structuredClone(entry.record)),
    mediaManifest: structuredClone(canonical.production_baseline.media_manifest),
  };
  uniqueBy(target.observations, (record) => record.id, "observations");
  uniqueBy(target.modernSpecies, (record) => record.id, "modern species");
  uniqueBy(target.residents, (record) => record.id, "residents");
  uniqueBy(target.plants, (record) => record.number ?? record.id, "plants");
  uniqueBy(target.legacyVisitors, (record) => record.id ?? record.slug, "legacy visitors");
  return target;
}

function assertDecisionCoverage(decisionText) {
  const required = [
    ...Array.from({ length: 10 }, (_, index) => `CUR-MRG-${String(index + 1).padStart(2, "0")}`),
    ...Array.from({ length: 4 }, (_, index) => `CUR-TAX-${String(index + 1).padStart(2, "0")}`),
    "CUR-MED-01", "CUR-BAS-01", "CUR-DOC-01", "CUR-NEW-001",
  ];
  const missing = required.filter((decision) => !decisionText.includes(decision));
  if (missing.length) throw new ValidationError("DECISION_MISSING", "Required implementation decisions are missing", missing);
}

function validateLedger(ledger) {
  if (ledger.length !== EXPECTED.ledgerRows) throw new ValidationError("LEDGER_COUNT", `Ledger contains ${ledger.length} rows; expected ${EXPECTED.ledgerRows}`);
  const keys = new Set();
  const counts = Object.fromEntries([...ALLOWED_DISPOSITIONS].map((key) => [key, 0]));
  for (const row of ledger) {
    const key = `${row.entity_type}|${row.entity_id}`;
    if (keys.has(key)) throw new ValidationError("LEDGER_DUPLICATE", `Duplicate ledger entity key: ${key}`);
    keys.add(key);
    if (!ALLOWED_DISPOSITIONS.has(row.canonical_disposition)) throw new ValidationError("DISPOSITION_INVALID", `Invalid disposition ${row.canonical_disposition} for ${key}`);
    counts[row.canonical_disposition] += 1;
    if (row.stable_identifier_preserved !== "yes") throw new ValidationError("IDENTIFIER_REPLACEMENT", `Stable identifier is not preserved for ${key}`);
    if (row.provenance_preserved !== "yes") throw new ValidationError("PROVENANCE_LOSS", `Provenance is not preserved for ${key}`);
    if (["DEFER", "QUARANTINE"].includes(row.canonical_disposition) && row.active_in_preview === "yes") {
      throw new ValidationError("INACTIVE_DISPOSITION_ACTIVE", `${key} is ${row.canonical_disposition} but active in preview`);
    }
  }
  for (const [name, expected] of Object.entries(EXPECTED.dispositions)) {
    if (counts[name] !== expected) throw new ValidationError("DISPOSITION_COUNT", `${name} count is ${counts[name]}; expected ${expected}`);
  }
  return { keys, counts };
}

function validateReferences(repoRoot, target, ledger) {
  const plants = new Set(target.plants.map((record) => String(record.number ?? record.id)));
  const residents = new Set(target.residents.map((record) => String(record.id)));
  const wildlife = new Set([...target.modernSpecies, ...target.legacyVisitors].map((record) => String(record.id ?? record.slug)));
  wildlife.add("unknown-pending");
  const mediaRows = new Map(ledger.filter((row) => row.entity_type === "media_asset").map((row) => [row.entity_id.replaceAll("\\", "/"), row]));
  const media = { present: 0, intentionallyQuarantined: 0, missing: [] };
  for (const observation of target.observations) {
    for (const plantId of observation.plants ?? []) if (!plants.has(String(plantId))) throw new ValidationError("PLANT_REFERENCE", `${observation.id} references unknown plant ${plantId}`);
    for (const residentId of observation.residents ?? []) if (!residents.has(String(residentId))) throw new ValidationError("RESIDENT_REFERENCE", `${observation.id} references unknown resident ${residentId}`);
    for (const visitorId of observation.visitors ?? []) if (!wildlife.has(String(visitorId)) && !residents.has(String(visitorId))) throw new ValidationError("WILDLIFE_REFERENCE", `${observation.id} references unknown wildlife ${visitorId}`);
    for (const photo of observation.photos ?? []) {
      const normalized = String(photo).replaceAll("\\", "/");
      if (fs.existsSync(path.join(repoRoot, ...normalized.split("/")))) media.present += 1;
      else if (mediaRows.get(normalized)?.canonical_disposition === "QUARANTINE") media.intentionallyQuarantined += 1;
      else media.missing.push({ observationId: observation.id, mediaPath: normalized, ledgerDisposition: mediaRows.get(normalized)?.canonical_disposition ?? null });
    }
  }
  if (media.missing.length) throw new ValidationError("ACTIVE_MEDIA_MISSING", "Active observations reference missing media without an approved QUARANTINE disposition", media.missing);
  return media;
}

function compareIds(current, target, keyOf) {
  const currentIds = new Set(current.map((item) => String(keyOf(item))));
  const targetIds = new Set(target.map((item) => String(keyOf(item))));
  return {
    keep: [...targetIds].filter((id) => currentIds.has(id)).sort(),
    add: [...targetIds].filter((id) => !currentIds.has(id)).sort(),
    remove: [...currentIds].filter((id) => !targetIds.has(id)).sort(),
  };
}

function validateCurrentRuntime(globals) {
  uniqueBy(globals.PLANTS, (record) => record.number ?? record.id, "current plants");
  uniqueBy(globals.VISITORS, (record) => record.id ?? record.slug, "current legacy visitors");
  uniqueBy(globals.OBSERVATIONS, (record) => record.id, "current observations");
  uniqueBy(globals.GARDEN_SPECIES, (record) => record.id, "current modern species");
  uniqueBy(globals.GARDEN_RESIDENTS, (record) => record.id, "current residents");
}

export function loadInputs(repoRoot) {
  const evidenceRoot = path.join(repoRoot, EVIDENCE_RELATIVE);
  const paths = {
    canonical: path.join(evidenceRoot, "canonical-preview.json"),
    ledger: path.join(evidenceRoot, "complete-disposition-ledger.csv"),
    counts: path.join(evidenceRoot, "counts-before-after.csv"),
    decisions: path.join(evidenceRoot, "IMPLEMENTATION_DECISIONS.md"),
  };
  for (const [name, filename] of Object.entries(paths)) if (!fs.existsSync(filename)) throw new ValidationError("EVIDENCE_MISSING", `Required ${name} evidence is missing: ${filename}`);
  const hashes = {
    canonical: sha256File(paths.canonical),
    ledger: sha256File(paths.ledger),
    counts: sha256File(paths.counts),
  };
  if (hashes.canonical !== EXPECTED.canonicalSha256) throw new ValidationError("CANONICAL_HASH", "Canonical preview hash mismatch", hashes);
  if (hashes.ledger !== EXPECTED.ledgerSha256) throw new ValidationError("LEDGER_HASH", "Disposition ledger hash mismatch", hashes);
  if (hashes.counts !== EXPECTED.countsSha256) throw new ValidationError("COUNTS_HASH", "Counts ledger hash mismatch", hashes);
  return {
    canonical: JSON.parse(fs.readFileSync(paths.canonical, "utf8")),
    ledger: parseCsv(fs.readFileSync(paths.ledger, "utf8")),
    counts: parseCsv(fs.readFileSync(paths.counts, "utf8")),
    decisions: fs.readFileSync(paths.decisions, "utf8"),
    hashes,
  };
}

export function validateModel({ repoRoot, canonical, ledger, counts, decisions, globals }) {
  assertDecisionCoverage(decisions);
  const ledgerResult = validateLedger(ledger);
  if (canonical.controls?.ledger_entity_count !== EXPECTED.ledgerRows || canonical.controls?.every_source_entity_has_one_disposition !== true) {
    throw new ValidationError("CANONICAL_CONTROLS", "Canonical preview controls do not confirm complete disposition coverage");
  }
  if (canonical.controls?.stable_identifiers_preserved !== true) throw new ValidationError("IDENTIFIER_REPLACEMENT", "Canonical controls do not preserve stable identifiers");
  if (canonical.metadata?.production_manifest_sha256 !== EXPECTED.productionManifestSha256 || canonical.metadata?.deployment_id !== EXPECTED.deploymentId || canonical.metadata?.deployment_commit !== EXPECTED.deploymentCommit) {
    throw new ValidationError("PRODUCTION_SUBSTITUTION", "Canonical production identity differs from the verified live-production baseline");
  }
  if (canonical.metadata?.modern_species_production_status !== "NOT_DEPLOYED") throw new ValidationError("PRODUCTION_SUBSTITUTION", "Modern species must remain recorded as NOT_DEPLOYED in the production baseline");
  if (counts.length !== 7) throw new ValidationError("COUNTS_DOMAIN", `Counts ledger contains ${counts.length} domains; expected 7`);
  validateCurrentRuntime(globals);
  const target = buildApprovedTarget(canonical);
  const media = validateReferences(repoRoot, target, ledger);
  const plan = {
    observations: compareIds(globals.OBSERVATIONS, target.observations, (record) => record.id),
    modernSpecies: compareIds(globals.GARDEN_SPECIES, target.modernSpecies, (record) => record.id),
    residents: compareIds(globals.GARDEN_RESIDENTS, target.residents, (record) => record.id),
    plants: compareIds(globals.PLANTS, target.plants, (record) => record.number ?? record.id),
    legacyVisitors: compareIds(globals.VISITORS, target.legacyVisitors, (record) => record.id ?? record.slug),
  };
  return {
    status: "PASS",
    mode: "dry-run",
    evidence: { ledgerRows: ledger.length, dispositionCounts: ledgerResult.counts },
    targetCounts: {
      observations: target.observations.length,
      modernSpecies: target.modernSpecies.length,
      residents: target.residents.length,
      plants: target.plants.length,
      legacyVisitors: target.legacyVisitors.length,
    },
    media,
    identifierChanges: 0,
    plan,
  };
}

export function runDryRun(repoRoot, fixtureMutator = undefined) {
  const inputs = loadInputs(repoRoot);
  const globals = parseRepositoryGlobals(repoRoot);
  const fixture = { ...inputs, globals };
  if (fixtureMutator) fixtureMutator(fixture);
  const report = validateModel({ repoRoot, ...fixture });
  const normalized = canonicalJson(report);
  return { report, normalized, sha256: sha256Bytes(normalized) };
}

function parseArgs(argv) {
  const options = { repoRoot: path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."), apply: false };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--repo") options.repoRoot = path.resolve(argv[++index]);
    else if (arg === "--apply") options.apply = true;
    else if (arg === "--json") options.json = true;
    else if (["--help", "-h"].includes(arg)) options.help = true;
    else throw new ValidationError("ARGUMENT", `Unknown argument: ${arg}`);
  }
  return options;
}

function main() {
  try {
    const options = parseArgs(process.argv.slice(2));
    if (options.help) {
      console.log("Usage: node scripts/foundation-reconciliation.mjs [--repo PATH] [--json]\nDry-run is the default. --apply is fail-closed until the separately approved data phase.");
      return;
    }
    if (options.apply) throw new ValidationError("APPLY_NOT_AUTHORIZED", "Batch 2 is dry-run only; runtime application is not authorized in this phase");
    const result = runDryRun(options.repoRoot);
    console.log(options.json ? JSON.stringify({ ...result.report, reportSha256: result.sha256 }, null, 2) : result.normalized);
  } catch (error) {
    const failure = { status: "FAIL", code: error.code ?? "UNEXPECTED", message: error.message, details: error.details ?? null };
    console.error(JSON.stringify(failure, null, 2));
    process.exitCode = 1;
  }
}

if (path.resolve(process.argv[1] ?? "") === fileURLToPath(import.meta.url)) main();
