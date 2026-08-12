#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ValidationError, runDryRun, sha256File } from "./foundation-reconciliation.mjs";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  const options = { repoRoot: path.resolve(SCRIPT_DIR, ".."), repeat: 2 };
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === "--repo") options.repoRoot = path.resolve(argv[++index]);
    else if (argv[index] === "--repeat") options.repeat = Number(argv[++index]);
    else if (["--help", "-h"].includes(argv[index])) options.help = true;
    else throw new ValidationError("ARGUMENT", `Unknown argument: ${argv[index]}`);
  }
  if (!Number.isInteger(options.repeat) || options.repeat < 2) throw new ValidationError("ARGUMENT", "--repeat must be an integer of at least 2");
  return options;
}

function runtimeHashes(repoRoot) {
  return Object.fromEntries(["data.js", "observations.js", "species.js", "residents.js", "image-manifest.js"].map((filename) => [filename, sha256File(path.join(repoRoot, filename))]));
}

function main() {
  try {
    const options = parseArgs(process.argv.slice(2));
    if (options.help) {
      console.log("Usage: node scripts/validate-foundation-release.mjs [--repo PATH] [--repeat N]");
      return;
    }
    const before = runtimeHashes(options.repoRoot);
    const runs = Array.from({ length: options.repeat }, () => runDryRun(options.repoRoot));
    const after = runtimeHashes(options.repoRoot);
    if (JSON.stringify(before) !== JSON.stringify(after)) throw new ValidationError("RUNTIME_MUTATION", "Dry-run validation changed a runtime file");
    if (new Set(runs.map((run) => run.sha256)).size !== 1) throw new ValidationError("NONDETERMINISTIC", "Repeated dry runs produced different reports");
    console.log(JSON.stringify({
      status: "PASS",
      mode: "validation",
      deterministicRuns: runs.length,
      reportSha256: runs[0].sha256,
      runtimeFilesUnchanged: true,
      runtimeHashes: after,
      validation: runs[0].report,
    }, null, 2));
  } catch (error) {
    console.error(JSON.stringify({ status: "FAIL", code: error.code ?? "UNEXPECTED", message: error.message, details: error.details ?? null }, null, 2));
    process.exitCode = 1;
  }
}

main();
