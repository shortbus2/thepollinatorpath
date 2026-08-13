#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { ValidationError, runDryRun, sha256File } from "./foundation-reconciliation.mjs";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  const options = { repoRoot: path.resolve(SCRIPT_DIR, ".."), repeat: 2, workerContract: false, report: null, summary: null, gitExe: process.env.GIT_EXE || "git" };
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === "--repo") options.repoRoot = path.resolve(argv[++index]);
    else if (argv[index] === "--repeat") options.repeat = Number(argv[++index]);
    else if (argv[index] === "--worker-contract") options.workerContract = true;
    else if (argv[index] === "--report") options.report = path.resolve(argv[++index]);
    else if (argv[index] === "--summary") options.summary = path.resolve(argv[++index]);
    else if (argv[index] === "--git-exe") options.gitExe = path.resolve(argv[++index]);
    else if (["--help", "-h"].includes(argv[index])) options.help = true;
    else throw new ValidationError("ARGUMENT", `Unknown argument: ${argv[index]}`);
  }
  if (!Number.isInteger(options.repeat) || options.repeat < 2) throw new ValidationError("ARGUMENT", "--repeat must be an integer of at least 2");
  return options;
}

const EXPECTED_ALIGNMENT_PATHS = new Set([
  "docs/RELEASE_PROCESS.md",
  "domain/foundation-write-contract.mjs",
  "field-config.js",
  "field-notebook.js",
  "garden-map-editor.js",
  "garden-residents.js",
  "residents-editor.js",
  "scripts/test-foundation-write-contract.mjs",
  "scripts/validate-foundation-release.mjs",
  "taxonomy-admin.js",
  "worker/package.json",
  "worker/src/worker.js",
  "worker/wrangler.staging.toml",
]);

function run(command, args, cwd, label) {
  const result = spawnSync(command, args, { cwd, encoding: "utf8", windowsHide: true, maxBuffer: 64 * 1024 * 1024 });
  if (result.error || result.status !== 0) throw new ValidationError("COMMAND_FAILED", `${label} failed`, { command, args, status: result.status, stderr: result.stderr, error: result.error?.message });
  return result.stdout;
}

function sha256Bytes(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function validateSyntax(repoRoot) {
  const files = [
    "domain/foundation-write-contract.mjs", "worker/src/worker.js", "scripts/test-foundation-write-contract.mjs",
    "field-config.js", "field-notebook.js", "garden-map-editor.js", "garden-residents.js", "residents-editor.js", "taxonomy-admin.js",
  ];
  for (const file of files) run(process.execPath, ["--check", file], repoRoot, `JavaScript syntax: ${file}`);
  return { filesChecked: files.length, failures: 0 };
}

function validateContractMetadata(repoRoot) {
  const required = {
    "field-config.js": ["4.4.0-rc.1", "environment: \"staging\"", "destructiveWrites: false"],
    "worker/wrangler.staging.toml": ["4.4.0-rc.1", "staging/foundation-4.4.0-rc.1", "3e5f427f07c9efa80d518f0f48ad6f2831dc367d"],
    "worker/src/worker.js": ["foundation-write-contract.mjs"],
  };
  for (const [file, values] of Object.entries(required)) {
    const text = fs.readFileSync(path.join(repoRoot, file), "utf8");
    for (const value of values) if (!text.includes(value)) throw new ValidationError("CONTRACT_METADATA", `${file} does not contain required contract value: ${value}`);
  }
  return { filesChecked: Object.keys(required).length, status: "PASS" };
}

function validateWorkerContract(repoRoot) {
  const output = run(process.execPath, ["scripts/test-foundation-write-contract.mjs"], repoRoot, "Foundation staging write-contract fixtures");
  const result = JSON.parse(output.slice(output.lastIndexOf("{\n")));
  if (result.status !== "PASS" || result.tests !== result.passed) throw new ValidationError("WORKER_CONTRACT", "Foundation staging write-contract fixtures did not all pass", result);
  return result;
}

function gitEvidence(options) {
  if (!fs.existsSync(path.join(options.repoRoot, ".git"))) return { status: "NOT_AVAILABLE", warning: "The validation mirror has no Git metadata; run again in the repository before commit and after commit." };
  const head = run(options.gitExe, ["rev-parse", "HEAD"], options.repoRoot, "Resolve Git HEAD").trim();
  const porcelain = run(options.gitExe, ["status", "--porcelain=v1", "--untracked-files=all"], options.repoRoot, "Inspect Git status");
  const changed = porcelain.split(/\r?\n/).filter(Boolean).map((line) => ({ status: line.slice(0, 2), path: line.slice(3).replaceAll("\\", "/") }));
  const destructive = changed.filter((item) => item.status.includes("D") || item.status.includes("R"));
  if (destructive.length) throw new ValidationError("UNEXPECTED_DESTRUCTIVE_PATH", "A tracked deletion or rename is an immediate stop condition", destructive);
  const unexpected = changed.filter((item) => !EXPECTED_ALIGNMENT_PATHS.has(item.path));
  if (unexpected.length) throw new ValidationError("UNEXPECTED_PATH", "Working tree contains paths outside the approved alignment set", unexpected);

  const manifestText = run(options.gitExe, ["show", `${head}:SHA256SUMS.txt`], options.repoRoot, "Read committed checksum manifest");
  const rows = manifestText.split(/\r?\n/).filter(Boolean).map((line) => {
    const match = line.match(/^([0-9a-f]{64})  (.+)$/);
    if (!match) throw new ValidationError("MANIFEST_FORMAT", `Malformed SHA256SUMS row: ${line}`);
    return { expected: match[1], path: match[2] };
  });
  let matched = 0;
  for (const row of rows) {
    const blob = spawnSync(options.gitExe, ["show", `${head}:${row.path}`], { cwd: options.repoRoot, encoding: null, windowsHide: true, maxBuffer: 128 * 1024 * 1024 });
    if (blob.status !== 0 || sha256Bytes(blob.stdout) !== row.expected) throw new ValidationError("GIT_BLOB_CHECKSUM", `Committed blob does not match SHA256SUMS.txt: ${row.path}`);
    matched += 1;
  }
  return { status: "PASS", head, changed, unexpectedPaths: 0, destructivePaths: 0, manifestRows: rows.length, manifestMatches: matched, manifestAuthority: "committed-git-blobs" };
}

function runtimeHashes(repoRoot) {
  return Object.fromEntries(["data.js", "observations.js", "species.js", "residents.js", "image-manifest.js"].map((filename) => [filename, sha256File(path.join(repoRoot, filename))]));
}

function writeReports(options, report) {
  if (options.report) fs.writeFileSync(options.report, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  if (options.summary) {
    const lines = [
      `Foundation validation: ${report.status}`,
      `Canonical dry-run: ${report.foundation.validation.gateRecommendation}`,
      `Write-contract fixtures: ${report.workerContract?.passed ?? "not requested"}/${report.workerContract?.tests ?? "not requested"}`,
      `Git integrity: ${report.git.status}`,
      `Warnings: ${report.warnings.length}`,
    ];
    fs.writeFileSync(options.summary, `${lines.join("\n")}\n`, "utf8");
  }
}

function main() {
  try {
    const options = parseArgs(process.argv.slice(2));
    if (options.help) {
      console.log("Usage: node scripts/validate-foundation-release.mjs [--repo PATH] [--repeat N] [--worker-contract] [--git-exe PATH] [--report PATH] [--summary PATH]");
      return;
    }
    const before = runtimeHashes(options.repoRoot);
    const runs = Array.from({ length: options.repeat }, () => runDryRun(options.repoRoot));
    const after = runtimeHashes(options.repoRoot);
    if (JSON.stringify(before) !== JSON.stringify(after)) throw new ValidationError("RUNTIME_MUTATION", "Dry-run validation changed a runtime file");
    if (new Set(runs.map((run) => run.sha256)).size !== 1) throw new ValidationError("NONDETERMINISTIC", "Repeated dry runs produced different reports");
    const git = gitEvidence(options);
    const report = {
      status: "PASS",
      mode: "validation",
      foundation: { deterministicRuns: runs.length, reportSha256: runs[0].sha256, runtimeFilesUnchanged: true, runtimeHashes: after, validation: runs[0].report },
      syntax: validateSyntax(options.repoRoot),
      contractMetadata: validateContractMetadata(options.repoRoot),
      workerContract: options.workerContract ? validateWorkerContract(options.repoRoot) : null,
      git,
      warnings: git.warning ? [git.warning] : [],
    };
    writeReports(options, report);
    console.log(JSON.stringify(report, null, 2));
  } catch (error) {
    console.error(JSON.stringify({ status: "FAIL", code: error.code ?? "UNEXPECTED", message: error.message, details: error.details ?? null }, null, 2));
    process.exitCode = 1;
  }
}

main();
