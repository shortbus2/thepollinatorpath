import {
  ContractError,
  FOUNDATION_WRITE_CONTRACT,
  assertBaseRevision,
  assertCollectionPreserved,
  assertEnvironment,
  assertStagingRecord,
  assertWritableMediaPath,
  classifyTaxonomyHero,
  contractInventory,
  foundationBaselinePlacements,
  isStagingId,
  mergePreservingUnknown,
  normalizeMediaPath,
  preserveObservationEdit,
} from "../../domain/foundation-write-contract.mjs";

const API_VERSION = "2022-11-28";
const MAX_PHOTOS = 20;
const MAX_BASE64_CHARS = 12_000_000;
const workerVersion = (env) => env.ENVIRONMENT === "production" ? "4.4.0-foundation-write" : "4.4.0-rc.1-foundation-staging-write";
const contractVersion = (env) => String(env.FOUNDATION_CONTRACT_VERSION || FOUNDATION_WRITE_CONTRACT.version);
const writeProvenance = (env) => ({
  environment: String(env.ENVIRONMENT || "staging"),
  contractVersion: contractVersion(env),
  baselineCommit: String(env.FOUNDATION_BASELINE_COMMIT || FOUNDATION_WRITE_CONTRACT.baselineCommit),
  recordClass: env.ENVIRONMENT === "production" ? "garden-brain-managed" : "staging-acceptance-test",
});

const json = (value, status = 200, headers = {}) => new Response(JSON.stringify(value), {
  status,
  headers: {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
    "referrer-policy": "no-referrer",
    ...headers,
  },
});

function cors(env, request) {
  const origin = request.headers.get("origin") || "";
  const allowed = String(env.ALLOWED_ORIGIN || "").split(",").map(x => x.trim()).filter(Boolean);
  const accepted = !origin || allowed.includes(origin);
  return {
    "access-control-allow-origin": accepted ? origin : (allowed[0] || "null"),
    "access-control-allow-headers": "authorization,content-type",
    "access-control-allow-methods": "GET,POST,PUT,DELETE,OPTIONS",
    vary: "Origin",
  };
}

async function authenticated(request, env) {
  const supplied = request.headers.get("authorization") || "";
  const expected = `Bearer ${env.NOTEBOOK_KEY || ""}`;
  const encoder = new TextEncoder();
  const [left, right] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(supplied)),
    crypto.subtle.digest("SHA-256", encoder.encode(expected)),
  ]);
  const a = new Uint8Array(left), b = new Uint8Array(right);
  let mismatch = a.length ^ b.length;
  for (let index = 0; index < Math.min(a.length, b.length); index += 1) mismatch |= a[index] ^ b[index];
  return mismatch === 0 && Boolean(env.NOTEBOOK_KEY);
}
const safeSlug = (value, fallback = "entry") => String(value || fallback).toLowerCase().replace(/[^a-z0-9.-]+/g, "-").replace(/^-|-$/g, "").slice(0, 96) || fallback;
function utf8FromBase64(value) {
  const binary = atob(String(value || "").replace(/\n/g, ""));
  return new TextDecoder().decode(Uint8Array.from(binary, c => c.charCodeAt(0)));
}

async function github(env, path, init = {}) {
  const response = await fetch(`https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}${path}`, {
    ...init,
    headers: {
      accept: "application/vnd.github+json",
      authorization: `Bearer ${env.GITHUB_TOKEN}`,
      "x-github-api-version": API_VERSION,
      "user-agent": "pollinator-path-garden-brain",
      ...(init.headers || {}),
    },
  });
  if (!response.ok) throw new ContractError("GITHUB_REQUEST_FAILED", `GitHub request failed with status ${response.status}`, response.status === 409 || response.status === 422 ? 409 : 502);
  return response;
}

async function branchState(env, verifyBaseline = true) {
  assertEnvironment(env);
  const branch = String(env.GITHUB_BRANCH || "main").replace(/^refs\/heads\//, "");
  const ref = await (await github(env, `/git/ref/heads/${encodeURIComponent(branch)}`)).json();
  const commitSha = ref.object.sha;
  const commit = await (await github(env, `/git/commits/${commitSha}`)).json();
  if (verifyBaseline) {
    const comparison = await (await github(env, `/compare/${encodeURIComponent(env.FOUNDATION_BASELINE_COMMIT)}...${encodeURIComponent(branch)}`)).json();
    if (!['identical', 'ahead'].includes(comparison.status)) throw new ContractError("BASELINE_NOT_ANCESTOR", "The staging data branch is not descended from the approved Foundation baseline", 503, { status: comparison.status });
  }
  return { branch, commitSha, treeSha: commit.tree.sha };
}

async function getTextFile(env, path) {
  const branch = String(env.GITHUB_BRANCH || "main").replace(/^refs\/heads\//, "");
  const response = await fetch(`https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/${path}?ref=${encodeURIComponent(branch)}`, {
    headers: {
      accept: "application/vnd.github+json",
      authorization: `Bearer ${env.GITHUB_TOKEN}`,
      "x-github-api-version": API_VERSION,
      "user-agent": "pollinator-path-garden-brain",
    },
  });
  if (response.status === 404) throw new ContractError("SOURCE_FILE_MISSING", `Required staging source file is missing: ${path}`, 503);
  if (!response.ok) throw new ContractError("GITHUB_READ_FAILED", `GitHub could not read ${path} (${response.status})`, 502);
  return utf8FromBase64((await response.json()).content);
}

async function commitOnce(env, files, message, expectedRevision) {
  if (!files.length) throw Error("No files supplied for commit");
  const { branch, commitSha, treeSha } = await branchState(env);
  if (commitSha !== expectedRevision) throw new ContractError("STALE_REVISION", "The staging branch changed before the write could be committed", 409, { expected: expectedRevision, actual: commitSha });
  const tree = [];
  for (const file of files) {
    if (file.encoding === "base64") {
      const blob = await (await github(env, "/git/blobs", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ content: file.content, encoding: "base64" }),
      })).json();
      tree.push({ path: file.path, mode: "100644", type: "blob", sha: blob.sha });
    } else {
      tree.push({ path: file.path, mode: "100644", type: "blob", content: file.content });
    }
  }
  const newTree = await (await github(env, "/git/trees", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ base_tree: treeSha, tree }),
  })).json();
  const newCommit = await (await github(env, "/git/commits", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ message, tree: newTree.sha, parents: [commitSha] }),
  })).json();
  await github(env, `/git/refs/heads/${encodeURIComponent(branch)}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ sha: newCommit.sha, force: false }),
  });
  return { commitSha: newCommit.sha, changedFiles: files.length };
}

async function atomicCommit(env, files, message, expectedRevision) {
  const seen = new Set();
  for (const file of files) {
    if (!file?.path || seen.has(file.path)) throw new ContractError("DUPLICATE_WRITE_PATH", "A commit contains a missing or duplicate path", 500, { path: file?.path ?? null });
    if (file.delete) throw new ContractError("DESTRUCTIVE_WRITE_BLOCKED", `Deletion is blocked during Foundation staging acceptance: ${file.path}`, 403);
    seen.add(file.path);
  }
  return commitOnce(env, files, message, expectedRevision);
}

function parseWindowValue(text, name, expectedType) {
  if (!text) throw new ContractError("SOURCE_EMPTY", `Required source for window.${name} is empty`, 503);
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = text.match(new RegExp(`window\\.${escaped}\\s*=\\s*([\\s\\S]*?);(?:\\s|$)`));
  if (!match) throw new ContractError("GLOBAL_MISSING", `Required window.${name} assignment is missing`, 503);
  let value;
  try { value = JSON.parse(match[1]); } catch (error) { throw new ContractError("SOURCE_MALFORMED", `window.${name} is not valid JSON: ${error.message}`, 503); }
  if (expectedType === "array" && !Array.isArray(value)) throw new ContractError("SOURCE_TYPE", `window.${name} must be an array`, 503);
  if (expectedType === "object" && (!value || typeof value !== "object" || Array.isArray(value))) throw new ContractError("SOURCE_TYPE", `window.${name} must be an object`, 503);
  return value;
}
const parseArray = (text, name) => parseWindowValue(text, name, "array");
const parseObject = (text, name) => parseWindowValue(text, name, "object");
const serialize = (name, value, comment = "") => `${comment ? `// ${comment}\n` : ""}window.${name} = ${JSON.stringify(value, null, 2)};\n`;
function cleanPublicEntry(entry, photoPaths) {
  const clean = { ...entry, photos: photoPaths, updatedAt: new Date().toISOString() };
  delete clean.privateNotes; delete clean.rawPhotos; delete clean.notebookKey;
  delete clean.baseRevision; delete clean.contractVersion;
  return clean;
}

function makeSpeciesRecord(detail, entry, env) {
  const id = safeSlug(detail.speciesId || detail.id || detail.label, "wildlife");
  assertStagingRecord("modern_species", { id });
  const now = new Date().toISOString();
  const identificationId = `${id}-ident-${crypto.randomUUID()}`;
  return {
    id,
    name: detail.label || id,
    scientificName: detail.suggestedScientificName || "",
    rank: "species-or-useful-group",
    category: detail.category || "Wildlife",
    icon: /bird/i.test(detail.category||"") ? "🐦" : /moth|butter/i.test(detail.category||"") ? "🦋" : /toad|frog/i.test(detail.category||"") ? "🐸" : "🐝",
    status: "published",
    aliases: [],
    summary: `First documented in ${entry.title || "a Garden Walk"}.`,
    story: detail.evidence || "This staging acceptance record can grow after curator review.",
    hero: "",
    identification: { acceptedIdentificationId: identificationId, acceptedLabel: detail.label || id, confidence: detail.confidenceBand || detail.confidence || "tentative", history: [{ id: identificationId, at: now, label: detail.label || id, scientificName: detail.suggestedScientificName || "", rank: "species-or-useful-group", confidence: detail.confidenceBand || detail.confidence || "tentative", source: "Human-reviewed staging observation", sourceObservationId: entry.id, note: detail.evidence || "", status: "accepted" }] },
    parentSpeciesId: null, mergedFrom: [], mergedInto: null, redirectAliases: [],
    public: false,
    provenance: writeProvenance(env),
    createdAt: now,
    updatedAt: now
  };
}
function mergeSpecies(existing, incoming) {
  const found = existing.find(x => x.id === incoming.id);
  if (!found) return [incoming, ...existing];
  assertStagingRecord("modern_species", found);
  const history=[...(found.identification?.history||[])];
  for(const item of (incoming.identification?.history||[])) if(!history.some(h=>h.id===item.id)) history.push(item);
  found.aliases=[...new Set([...(found.aliases||[]),...(incoming.aliases||[])])];
  found.identification={...(found.identification||incoming.identification),history};
  for(const key of ['name','scientificName','rank','category','icon','status','summary','story','hero','public']) if((found[key]===undefined||found[key]===null||found[key]==='')&&incoming[key]!==undefined) found[key]=incoming[key];
  found.updatedAt=new Date().toISOString();
  return existing;
}


function normalizeSpeciesRecord(record) {
  const at = record.updatedAt || record.createdAt || new Date().toISOString();
  const identificationId = `${record.id}-ident-${crypto.randomUUID()}`;
  return {
    ...record,
    aliases: Array.isArray(record.aliases) ? record.aliases : [],
    mergedFrom: [],
    redirectAliases: [],
    parentSpeciesId: null,
    mergedInto: null,
    identification: {
      acceptedIdentificationId: identificationId,
      acceptedLabel: record.name,
      confidence: "tentative",
      history: [{ id: identificationId, label: record.name, scientificName: record.scientificName || "", rank: record.rank || "unresolved taxon", confidence: "tentative", source: "Staging acceptance test", sourceObservationId: null, note: "", at, status: "accepted" }],
    },
  };
}
function resolveMergedId(species, id) { let current = id, seen = new Set(); while (current && !seen.has(current)) { seen.add(current); const record = species.find(s => s.id === current); if (!record?.mergedInto) break; current = record.mergedInto; } return current || id; }
async function refineSpecies(env, body) {
  if (!body?.speciesId) throw Error("Missing speciesId");
  const state = await branchState(env);
  assertBaseRevision(body, state.commitSha, contractVersion(env));
  assertStagingRecord("modern_species", { id: body.speciesId });
  let species = parseArray(await getTextFile(env, "species.js"), "GARDEN_SPECIES");
  let record = species.find(s => s.id === body.speciesId);
  const now = new Date().toISOString();
  if (!record) { record = normalizeSpeciesRecord({ id: safeSlug(body.speciesId || body.name, "wildlife"), name: body.name || body.speciesId, scientificName: "", rank: "unresolved taxon", category: "Wildlife", icon: "🐾", status: "draft", aliases: [], summary: "", story: "", hero: `images/wildlife/${safeSlug(body.speciesId || body.name, "wildlife")}/hero.jpg`, public: false, createdAt: now, updatedAt: now }); species.unshift(record); }
  assertStagingRecord("modern_species", record);
  record.hero = record.hero && normalizeMediaPath(record.hero).startsWith("images/staging/") ? normalizeMediaPath(record.hero) : "";
  record.provenance = mergePreservingUnknown(record.provenance || {}, writeProvenance(env));
  if (record.mergedInto) throw Error(`This record was merged into ${record.mergedInto}. Refine the surviving record instead.`);
  const history = record.identification.history;
  history.forEach(h => h.status = "superseded");
  const identificationId = `${record.id}-ident-${crypto.randomUUID()}`;
  const next = { id: identificationId, label: body.name || record.name, scientificName: body.scientificName ?? record.scientificName ?? "", rank: body.rank || record.rank || "unresolved taxon", confidence: body.confidence || record.identification.confidence || "tentative", source: body.source || "User approved", sourceObservationId: null, note: body.note || "", at: now, status: "accepted" };
  history.push(next);
  Object.assign(record, { name: next.label, scientificName: next.scientificName, rank: next.rank, category: body.category || record.category || "Wildlife", parentSpeciesId: body.parentSpeciesId || null, aliases: [...new Set([...(record.aliases || []), ...(Array.isArray(body.aliases) ? body.aliases : [])])], identification: { acceptedIdentificationId: identificationId, acceptedLabel: next.label, confidence: next.confidence, history }, updatedAt: now, public: false, status: record.status === "draft" ? "staging-review" : record.status });
  const result = await atomicCommit(env, [{ path: "species.js", content: serialize("GARDEN_SPECIES", species, "Persistent wildlife species and useful taxon records. Managed by Garden Brain."), encoding: "utf8" }], `Garden Brain staging: refine ${record.name}`, state.commitSha);
  return { ...result, species };
}
async function mergeSpeciesRecords(env, body) {
  throw new ContractError("TAXONOMY_MERGE_BLOCKED", "Taxonomy merges require a separate Historical Curator decision and are blocked during staging acceptance", 403, { sourceSpeciesId: body?.sourceSpeciesId ?? null, targetSpeciesId: body?.targetSpeciesId ?? null });
}

async function publishObservation(env, entry) {
  if (!entry?.id || !entry?.date) throw Error("Missing entry id or date");
  const state = await branchState(env);
  assertBaseRevision(entry, state.commitSha, contractVersion(env));
  assertStagingRecord("observation", entry);
  if (entry.public !== true) throw Error("Private entries cannot be published to the public repository");
  if (!entry.privacyReview?.completed) throw Error("Privacy review is required before publication");
  const incoming = Array.isArray(entry.photos) ? entry.photos : [];
  if (incoming.length > MAX_PHOTOS) throw Error(`Maximum ${MAX_PHOTOS} photos per entry`);

  let observations = parseArray(await getTextFile(env, "observations.js"), "OBSERVATIONS");
  let species = parseArray(await getTextFile(env, "species.js"), "GARDEN_SPECIES");
  const previous = observations.find(x => x.id === entry.id);
  const previousPaths = Array.isArray(previous?.photos) ? previous.photos : [];
  const files = [], photoPaths = [...previousPaths];
  const manifest = parseObject(await getTextFile(env, "image-manifest.js"), "IMAGE_MANIFEST");
  manifest.hero = Array.isArray(manifest.hero) ? manifest.hero : [];
  manifest.plants = manifest.plants && typeof manifest.plants === "object" ? manifest.plants : {};
  manifest.wildlife = manifest.wildlife && typeof manifest.wildlife === "object" ? manifest.wildlife : {};
  let manifestChanged = false, speciesChanged = false;

  // Resolve/create wildlife records before processing portraits so the primary subject has a stable ID.
  const speciesIds = new Set(Array.isArray(entry.species) ? entry.species : []);
  const createdIds = new Set();
  for (const detail of (entry.visitorDetails || [])) {
    if (detail.status === "create-species" || detail.disposition === "new") {
      const record = makeSpeciesRecord(detail, entry, env);
      species = mergeSpecies(species, record);
      speciesChanged = true;
      detail.speciesId = record.id;
      detail.id = record.id;
      detail.status = "linked";
      createdIds.add(record.id);
      speciesIds.add(record.id);
    } else if (detail.speciesId) speciesIds.add(resolveMergedId(species, detail.speciesId));
  }
  if (entry.primary?.kind === "visitor") {
    const match=(entry.visitorDetails||[]).find(d=>d.id===entry.primary.id||d.speciesId===entry.primary.id);
    if(match?.speciesId) entry.primary.id=resolveMergedId(species,match.speciesId);
    else if(entry.primary.id==='unknown-pending'){
      const linked=(entry.visitorDetails||[]).filter(d=>d.status==='linked'&&d.speciesId);
      if(linked.length===1)entry.primary.id=resolveMergedId(species,linked[0].speciesId);
    }
  }
  entry.visitors=[...new Set((entry.visitors||[]).map(id=>resolveMergedId(species,id)).filter(Boolean))];
  entry.species = [...speciesIds].map(id=>resolveMergedId(species,id));

  for (let i = 0; i < incoming.length; i++) {
    const photo = incoming[i];
    if (typeof photo === "string") {
      const retained = normalizeMediaPath(photo);
      if (!previousPaths.map(normalizeMediaPath).includes(retained)) assertWritableMediaPath(retained);
      if (!photoPaths.includes(retained)) photoPaths.push(retained);
      continue;
    }
    const raw = String(photo?.data || "").split(",")[1];
    if (!raw) continue;
    if (raw.length > MAX_BASE64_CHARS) throw Error("A prepared photo is too large");
    const folder = `images/staging/observations/${String(entry.date).slice(0, 4)}/${safeSlug(entry.id)}`;
    const filename = safeSlug(photo.name || `photo-${i + 1}.jpg`, `${i + 1}.jpg`);
    const path = `${folder}/${filename.endsWith(".jpg") ? filename : filename + ".jpg"}`;
    files.push({ path, content: raw, encoding: "base64" });
    photoPaths.push(path);

    if (photo.hero) {
      const primary = entry.primary || {};
      let heroFolder = "", group = "", key = "";
      if (primary.kind === "plant") throw new ContractError("FOUNDATION_HERO_IMMUTABLE", "Foundation plant heroes cannot be replaced during staging acceptance", 403);
      if (["visitor", "resident"].includes(primary.kind)) {
        if (!isStagingId(primary.id)) throw new ContractError("FOUNDATION_HERO_IMMUTABLE", "Foundation wildlife heroes cannot be replaced during staging acceptance", 403);
        heroFolder = `images/staging/wildlife/${safeSlug(primary.id)}`; group = "wildlife"; key = String(primary.id);
      }
      if (primary.kind === "object") throw new ContractError("FOUNDATION_HERO_IMMUTABLE", "Foundation object heroes cannot be replaced during staging acceptance", 403);
      if (heroFolder) {
        const heroPath = `${heroFolder}/hero.jpg`;
        files.push({ path: heroPath, content: raw, encoding: "base64" });
        if (group) { manifest[group][key] = { ...(manifest[group][key] || {}), hero: heroPath }; manifestChanged = true; }
        if(group==='wildlife'){
          const record=species.find(x=>x.id===key);
          if(record){assertStagingRecord("modern_species",record);record.hero=heroPath;record.updatedAt=new Date().toISOString();speciesChanged=true;}
        }
      }
    }
    if (entry.featured && entry.privacyReview?.safeHomepage && i === 0 && !manifest.hero.includes(path)) {
      manifest.hero.unshift(path); manifest.hero = manifest.hero.slice(0, 12); manifestChanged = true;
    }
  }

  const publicEntry = cleanPublicEntry(preserveObservationEdit(previous, entry, writeProvenance(env)), [...new Set(photoPaths)]);
  observations = observations.filter(x => x.id !== publicEntry.id);
  observations.unshift(publicEntry);
  files.push({ path: "observations.js", content: serialize("OBSERVATIONS", observations), encoding: "utf8" });
  if (speciesChanged) files.push({ path: "species.js", content: serialize("GARDEN_SPECIES", species, "Persistent wildlife species and useful taxon records. Managed by Garden Brain."), encoding: "utf8" });
  if (manifestChanged) files.push({ path: "image-manifest.js", content: serialize("IMAGE_MANIFEST", manifest, "Automatically maintained by Garden Brain publishing."), encoding: "utf8" });
  const result=await atomicCommit(env, files, `Garden Brain staging: ${previous ? "edit" : "publish"} ${entry.title || entry.id}`, state.commitSha);
  return {...result, observation:publicEntry, createdSpecies:[...createdIds]};
}
async function deleteObservation(env, id) {
  throw new ContractError("DESTRUCTIVE_OPERATION_BLOCKED", "Observation deletion is blocked during Foundation staging acceptance", 403, { observationId: id || null });
}

async function identifyPhotos(env, body) {
  const startedAt = Date.now();
  if (!env.OPENAI_API_KEY) throw Error("AI identification is not configured. Add OPENAI_API_KEY to the Worker secrets.");
  const images = Array.isArray(body.images) ? body.images.slice(0, 8) : [];
  if (!images.length) throw Error("Add at least one photo to identify");
  const context = body.context || {};
  const content = [{
    type: "input_text",
    text: `You are Garden Brain, the cautious identification assistant for a private wildlife garden journal in Mead, Colorado. Analyze these photos as one Garden Walk memory. Identify the likely plant and EVERY visibly distinct wildlife type in the photos, not just the most obvious visitor. Group at the simplest useful level (for example leafcutter bee, honey bee, paper wasp) rather than forcing exact species. Never claim individual identity from appearance alone. Never force certainty; prefer broad truthful labels when evidence is weak. Existing garden plants: ${JSON.stringify(context.plants || [])}. Existing wildlife pages/residents: ${JSON.stringify(context.visitors || [])}. Return one plant suggestion, a list of distinct visitor suggestions, a behavior summary, a warm concise memory summary, confidence, alternatives, whether the photos belong together, and concise evidence-based reasoning. Use a human Garden Brain voice: warm, curious, honest, occasionally lightly amused, never clinical.`,
  }];
  for (const image of images) content.push({ type: "input_image", image_url: image, detail: "high" });
  const schema = {
    type: "object",
    additionalProperties: false,
    properties: {
      group_together: { type: "boolean" },
      plant: { type: ["object", "null"], additionalProperties: false, properties: { label: { type: "string" }, existing_id: { type: ["string", "null"] }, confidence: { type: "number" } }, required: ["label", "existing_id", "confidence"] },
      visitors: { type: "array", maxItems: 12, items: { type: "object", additionalProperties: false, properties: { label: { type: "string" }, existing_id: { type: ["string", "null"] }, category: { type: "string" }, confidence: { type: "number" }, evidence: { type: "string" } }, required: ["label", "existing_id", "category", "confidence", "evidence"] } },
      behavior: { type: ["string", "null"] },
      memory_summary: { type: "string" },
      overall_confidence: { type: "string", enum: ["confirmed", "probable", "tentative", "unidentified"] },
      alternatives: { type: "array", items: { type: "string" }, maxItems: 5 },
      reasoning: { type: "string" },
      needs_human_review: { type: "boolean" },
      privacy_flags: { type: "array", items: { type: "string" } },
    },
    required: ["group_together", "plant", "visitors", "behavior", "memory_summary", "overall_confidence", "alternatives", "reasoning", "needs_human_review", "privacy_flags"],
  };
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { authorization: `Bearer ${env.OPENAI_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({
      model: env.OPENAI_MODEL || "gpt-4.1-mini",
      input: [{ role: "user", content }],
      text: { format: { type: "json_schema", name: "garden_identification", strict: true, schema } },
    }),
  });
  if (!response.ok) throw Error(`AI identification failed (${response.status}): ${await response.text()}`);
  const result = await response.json();
  const text = result.output_text || result.output?.flatMap(x => x.content || []).find(x => x.type === "output_text")?.text;
  if (!text) throw Error("AI returned no identification draft");
  return { identification: JSON.parse(text), usage: result.usage || null, model: result.model || env.OPENAI_MODEL || "gpt-4.1-mini", elapsedMs: Date.now() - startedAt, requestId: result.id || null };
}

function parsePlacements(text) {
  if (text.includes("window.GARDEN_PLACEMENTS = window.GARDEN_PLACEMENTS || window.GARDEN_BRAIN.placements")) return foundationBaselinePlacements();
  return parseArray(text, "GARDEN_PLACEMENTS");
}

async function publishArray(env, { path, variable, items, message, comment, body, entityType, responseKey = entityType, parser = parseArray }) {
  if (!Array.isArray(items)) throw Error("Expected an array");
  const state = await branchState(env);
  assertBaseRevision(body, state.commitSha, contractVersion(env));
  const current = parser(await getTextFile(env, path), variable);
  const currentById = new Map(current.map((record) => [String(record.id), record]));
  const merged = items.map((record) => currentById.has(String(record?.id)) ? mergePreservingUnknown(currentById.get(String(record.id)), record) : record);
  assertCollectionPreserved(current, merged, entityType);
  const result = await atomicCommit(env, [{ path, content: serialize(variable, merged, comment), encoding: "utf8" }], message, state.commitSha);
  return { ...result, [responseKey]: merged };
}

export default {
  async fetch(request, env) {
    const headers = cors(env, request);
    if (request.method === "OPTIONS") return new Response(null, { headers });
    const url = new URL(request.url);
    try {
      const identity = assertEnvironment(env);
      if (url.pathname === "/health" && request.method === "GET") return json({ ok: true, service: "Pollinator Path Garden Brain", version: workerVersion(env), contractVersion: identity.contractVersion, environment: identity.environment, branch: identity.branch, baselineCommit: identity.baselineCommit, protections: contractInventory(), aiConfigured: Boolean(env.OPENAI_API_KEY) }, 200, headers);
      if (!(await authenticated(request, env))) return json({ error: "Unauthorized", code: "UNAUTHORIZED" }, 401, headers);
      if (url.pathname === "/garden" && request.method === "GET") {
        const state = await branchState(env);
        const [p, o, m, r, s] = await Promise.all([getTextFile(env, "placements.js"), getTextFile(env, "observations.js"), getTextFile(env, "milestones.js"), getTextFile(env, "residents.js"), getTextFile(env, "species.js")]);
        return json({ contractVersion: identity.contractVersion, revision: state.commitSha, branch: state.branch, placements: parsePlacements(p), observations: parseArray(o, "OBSERVATIONS"), milestones: parseArray(m, "GARDEN_MILESTONES"), residents: parseArray(r, "GARDEN_RESIDENTS"), species: parseArray(s, "GARDEN_SPECIES") }, 200, headers);
      }
      if (url.pathname === "/identify" && request.method === "POST") return json({ ok: true, ...await identifyPhotos(env, await request.json()) }, 200, headers);
      if (["/entry", "/observations"].includes(url.pathname) && ["POST", "PUT"].includes(request.method)) return json({ ok: true, ...await publishObservation(env, await request.json()) }, 200, headers);
      if (url.pathname.startsWith("/observations/") && request.method === "DELETE") return json({ ok: true, ...await deleteObservation(env, decodeURIComponent(url.pathname.split("/").pop())) }, 200, headers);
      if (url.pathname === "/placements" && request.method === "POST") { const b = await request.json(); return json({ ok: true, ...await publishArray(env, { path: "placements.js", variable: "GARDEN_PLACEMENTS", items: b.placements, body: b, entityType: "placements", parser: parsePlacements, message: "Garden Brain staging: publish map placements", comment: "Automatically published by the Garden Map Editor." }) }, 200, headers); }
      if (url.pathname === "/residents" && request.method === "POST") { const b = await request.json(); return json({ ok: true, ...await publishArray(env, { path: "residents.js", variable: "GARDEN_RESIDENTS", items: b.residents, body: b, entityType: "named_resident", responseKey: "residents", message: "Garden Brain staging: update residents", comment: "Editable named garden residents." }) }, 200, headers); }
      if (url.pathname === "/species" && request.method === "GET") { const state = await branchState(env); const s = await getTextFile(env, "species.js"); return json({ ok:true, contractVersion:identity.contractVersion, revision: state.commitSha, species:parseArray(s,"GARDEN_SPECIES") },200,headers); }
      if (url.pathname === "/species" && request.method === "POST") { const b = await request.json(); return json({ ok: true, ...await publishArray(env, { path: "species.js", variable: "GARDEN_SPECIES", items: b.species, body: b, entityType: "modern_species", message: "Garden Brain staging: update wildlife species", comment: "Persistent wildlife species and useful taxon records. Managed by Garden Brain." }) }, 200, headers); }
      if (url.pathname === "/species/refine" && request.method === "POST") return json({ ok:true, ...await refineSpecies(env, await request.json()) },200,headers);
      if (url.pathname === "/species/merge" && request.method === "POST") return json({ ok:true, ...await mergeSpeciesRecords(env, await request.json()) },200,headers);
      if (url.pathname === "/milestones" && request.method === "POST") { const b = await request.json(); return json({ ok: true, ...await publishArray(env, { path: "milestones.js", variable: "GARDEN_MILESTONES", items: b.milestones, body: b, entityType: "milestone", message: "Garden Brain staging: update milestones", comment: "Garden milestones and meaningful firsts." }) }, 200, headers); }
      return json({ error: "Not found" }, 404, headers);
    } catch (error) { return json({ error: error.message, code: error.code || "UNEXPECTED", details: error.details || null }, error.status || 500, headers); }
  },
};
