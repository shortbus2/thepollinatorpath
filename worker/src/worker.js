const API_VERSION = "2022-11-28";
const MAX_PHOTOS = 20;
const MAX_BASE64_CHARS = 12_000_000;
const WORKER_VERSION = "4.3.2-rc.1-species-integrity";

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

const authenticated = (request, env) => request.headers.get("authorization") === `Bearer ${env.NOTEBOOK_KEY}`;
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
  if (!response.ok) throw new Error(`GitHub ${response.status}: ${await response.text()}`);
  return response;
}

async function branchState(env) {
  const branch = String(env.GITHUB_BRANCH || "main").replace(/^refs\/heads\//, "");
  const ref = await (await github(env, `/git/ref/heads/${encodeURIComponent(branch)}`)).json();
  const commitSha = ref.object.sha;
  const commit = await (await github(env, `/git/commits/${commitSha}`)).json();
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
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`GitHub ${response.status}: ${await response.text()}`);
  return utf8FromBase64((await response.json()).content);
}

async function commitOnce(env, files, message) {
  if (!files.length) throw Error("No files supplied for commit");
  const { branch, commitSha, treeSha } = await branchState(env);
  const tree = [];
  for (const file of files) {
    if (file.delete) {
      tree.push({ path: file.path, mode: "100644", type: "blob", sha: null });
    } else if (file.encoding === "base64") {
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

async function atomicCommit(env, files, message) {
  let last;
  for (let attempt = 1; attempt <= 6; attempt++) {
    try { return await commitOnce(env, files, message); }
    catch (error) {
      last = error;
      const retry = /GitHub 409|GitHub 422|Reference cannot be updated|is at [a-f0-9]+ but expected/i.test(String(error.message || error));
      if (!retry || attempt === 6) break;
      await new Promise(r => setTimeout(r, 300 * 2 ** (attempt - 1) + Math.floor(Math.random() * 250)));
    }
  }
  throw last;
}

function parseWindowValue(text, name, fallback) {
  if (!text) return fallback;
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = text.match(new RegExp(`window\\.${escaped}\\s*=\\s*([\\s\\S]*?);(?:\\s|$)`));
  if (!match) return fallback;
  try { return JSON.parse(match[1]); } catch { return fallback; }
}
const parseArray = (text, name) => { const x = parseWindowValue(text, name, []); return Array.isArray(x) ? x : []; };
const parseObject = (text, name) => { const x = parseWindowValue(text, name, {}); return x && typeof x === "object" && !Array.isArray(x) ? x : {}; };
const serialize = (name, value, comment = "") => `${comment ? `// ${comment}\n` : ""}window.${name} = ${JSON.stringify(value, null, 2)};\n`;
function cleanPublicEntry(entry, photoPaths) {
  const clean = { ...entry, photos: photoPaths, updatedAt: new Date().toISOString() };
  delete clean.privateNotes; delete clean.rawPhotos; delete clean.notebookKey;
  return clean;
}

function makeSpeciesRecord(detail, entry) {
  const id = safeSlug(detail.speciesId || detail.id || detail.label, "wildlife");
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
    story: detail.evidence || "This living page will grow as more observations are connected.",
    hero: `images/wildlife/${id}/hero.jpg`,
    identification: { acceptedIdentificationId: `${id}-ident-${Date.now()}`, acceptedLabel: detail.label || id, confidence: detail.confidenceBand || detail.confidence || "tentative", history: [{ id: `${id}-ident-${Date.now()}`, at: new Date().toISOString(), label: detail.label || id, scientificName: detail.suggestedScientificName || "", rank: "species-or-useful-group", confidence: detail.confidenceBand || detail.confidence || "tentative", source: "Garden Brain observation review", sourceObservationId: entry.id, note: detail.evidence || "", status: "accepted" }] },
    parentSpeciesId: null, mergedFrom: [], mergedInto: null, redirectAliases: [],
    public: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}
function mergeSpecies(existing, incoming) {
  const found = existing.find(x => x.id === incoming.id);
  if (!found) return [incoming, ...existing];
  // Existing populated records always win. Publishing a new observation may add history,
  // aliases or missing fields, but must never erase an established story, portrait or taxonomy.
  const history=[...(found.identification?.history||[])];
  for(const item of (incoming.identification?.history||[])) if(!history.some(h=>h.id===item.id)) history.push(item);
  found.aliases=[...new Set([...(found.aliases||[]),...(incoming.aliases||[])])];
  found.identification={...(found.identification||incoming.identification),history};
  for(const key of ['name','scientificName','rank','category','icon','status','summary','story','hero','public']) if((found[key]===undefined||found[key]===null||found[key]==='')&&incoming[key]!==undefined) found[key]=incoming[key];
  found.updatedAt=new Date().toISOString();
  return existing;
}


function normalizeSpeciesRecord(record) {
  const s = { ...record };
  s.aliases = Array.isArray(s.aliases) ? s.aliases : [];
  s.mergedFrom = Array.isArray(s.mergedFrom) ? s.mergedFrom : [];
  s.redirectAliases = Array.isArray(s.redirectAliases) ? s.redirectAliases : [];
  s.parentSpeciesId = s.parentSpeciesId || null;
  s.mergedInto = s.mergedInto || null;
  const history = Array.isArray(s.identification?.history) ? s.identification.history.map((h, i) => ({ id: h.id || `${s.id}-ident-${i + 1}`, label: h.label || s.name, scientificName: h.scientificName ?? s.scientificName ?? "", rank: h.rank || s.rank || "unresolved taxon", confidence: h.confidence || s.identification?.confidence || "tentative", source: h.source || "Legacy record", sourceObservationId: h.sourceObservationId || null, note: h.note || "", at: h.at || s.updatedAt || s.createdAt || new Date().toISOString(), status: h.status || "superseded" })) : [];
  if (!history.length) history.push({ id: `${s.id}-ident-1`, label: s.name, scientificName: s.scientificName || "", rank: s.rank || "unresolved taxon", confidence: s.identification?.confidence || "tentative", source: "Legacy record migration", sourceObservationId: null, note: "", at: s.updatedAt || s.createdAt || new Date().toISOString(), status: "accepted" });
  history.forEach(h => h.status = "superseded"); history[history.length - 1].status = "accepted";
  s.identification = { acceptedIdentificationId: s.identification?.acceptedIdentificationId || history[history.length - 1].id, acceptedLabel: s.identification?.acceptedLabel || history[history.length - 1].label, confidence: s.identification?.confidence || history[history.length - 1].confidence, history };
  return s;
}
function resolveMergedId(species, id) { let current = id, seen = new Set(); while (current && !seen.has(current)) { seen.add(current); const record = species.find(s => s.id === current); if (!record?.mergedInto) break; current = record.mergedInto; } return current || id; }
async function refineSpecies(env, body) {
  if (!body?.speciesId) throw Error("Missing speciesId");
  let species = parseArray(await getTextFile(env, "species.js"), "GARDEN_SPECIES").map(normalizeSpeciesRecord);
  let record = species.find(s => s.id === body.speciesId);
  const now = new Date().toISOString();
  if (!record) { record = normalizeSpeciesRecord({ id: safeSlug(body.speciesId || body.name, "wildlife"), name: body.name || body.speciesId, scientificName: "", rank: "unresolved taxon", category: "Wildlife", icon: "🐾", status: "draft", aliases: [], summary: "", story: "", hero: `images/wildlife/${safeSlug(body.speciesId || body.name, "wildlife")}/hero.jpg`, public: false, createdAt: now, updatedAt: now }); species.unshift(record); }
  if (record.mergedInto) throw Error(`This record was merged into ${record.mergedInto}. Refine the surviving record instead.`);
  const history = record.identification.history;
  history.forEach(h => h.status = "superseded");
  const identificationId = `${record.id}-ident-${Date.now()}`;
  const next = { id: identificationId, label: body.name || record.name, scientificName: body.scientificName ?? record.scientificName ?? "", rank: body.rank || record.rank || "unresolved taxon", confidence: body.confidence || record.identification.confidence || "tentative", source: body.source || "User approved", sourceObservationId: null, note: body.note || "", at: now, status: "accepted" };
  history.push(next);
  Object.assign(record, { name: next.label, scientificName: next.scientificName, rank: next.rank, category: body.category || record.category || "Wildlife", parentSpeciesId: body.parentSpeciesId || null, aliases: [...new Set([...(record.aliases || []), ...(Array.isArray(body.aliases) ? body.aliases : [])])], identification: { acceptedIdentificationId: identificationId, acceptedLabel: next.label, confidence: next.confidence, history }, updatedAt: now, public: body.public ?? record.public ?? true, status: record.status === "draft" ? "published" : record.status });
  const result = await atomicCommit(env, [{ path: "species.js", content: serialize("GARDEN_SPECIES", species, "Persistent wildlife species and useful taxon records. Managed by Garden Brain."), encoding: "utf8" }], `Garden Brain: refine ${record.name}`);
  return { ...result, species };
}
async function mergeSpeciesRecords(env, body) {
  const sourceId = body?.sourceSpeciesId, targetId = body?.targetSpeciesId;
  if (!sourceId || !targetId) throw Error("Choose both source and target species records");
  if (sourceId === targetId) throw Error("A species record cannot be merged into itself");
  let species = parseArray(await getTextFile(env, "species.js"), "GARDEN_SPECIES").map(normalizeSpeciesRecord);
  let observations = parseArray(await getTextFile(env, "observations.js"), "OBSERVATIONS");
  let residents = parseArray(await getTextFile(env, "residents.js"), "GARDEN_RESIDENTS");
  const source = species.find(s => s.id === sourceId), target = species.find(s => s.id === targetId);
  if (!source || !target) throw Error("Source or target species record was not found");
  if (source.mergedInto) throw Error(`Source is already merged into ${source.mergedInto}`);
  if (target.mergedInto) throw Error("Target must be an active surviving record");
  if (resolveMergedId(species, targetId) === sourceId) throw Error("This merge would create a circular redirect");
  const now = new Date().toISOString();
  const combinedHistory = [...(target.identification.history || []), ...(source.identification.history || []).map(h => ({ ...h, note: [h.note, `Merged from ${source.id}`].filter(Boolean).join(" · ") }))].sort((a,b)=>String(a.at).localeCompare(String(b.at)));
  combinedHistory.forEach(h => h.status = "superseded");
  const acceptedId = target.identification.acceptedIdentificationId || combinedHistory.at(-1)?.id;
  const accepted = combinedHistory.find(h => h.id === acceptedId) || combinedHistory.at(-1); if (accepted) accepted.status = "accepted";
  target.aliases = [...new Set([...(target.aliases || []), source.name, source.scientificName, ...(source.aliases || [])].filter(Boolean))];
  target.redirectAliases = [...new Set([...(target.redirectAliases || []), source.id, ...(source.redirectAliases || [])])];
  target.mergedFrom = [...new Set([...(target.mergedFrom || []), source.id, ...(source.mergedFrom || [])])];
  target.identification = { acceptedIdentificationId: accepted?.id || acceptedId, acceptedLabel: accepted?.label || target.name, confidence: accepted?.confidence || target.identification.confidence, history: combinedHistory };
  target.updatedAt = now;
  source.mergedInto = target.id; source.status = "merged"; source.public = false; source.updatedAt = now;
  observations = observations.map(o => { const x = { ...o }; x.species = [...new Set((x.species || []).map(id => id === source.id ? target.id : id))]; x.visitorDetails = (x.visitorDetails || []).map(d => d.speciesId === source.id ? { ...d, speciesId: target.id, id: d.id === source.id ? target.id : d.id } : d); return x; });
  residents = residents.map(r => r.speciesId === source.id ? { ...r, speciesId: target.id, updatedAt: now } : r);
  const files = [
    { path: "species.js", content: serialize("GARDEN_SPECIES", species, "Persistent wildlife species and useful taxon records. Managed by Garden Brain."), encoding: "utf8" },
    { path: "observations.js", content: serialize("OBSERVATIONS", observations), encoding: "utf8" },
    { path: "residents.js", content: serialize("GARDEN_RESIDENTS", residents), encoding: "utf8" }
  ];
  const result = await atomicCommit(env, files, `Garden Brain: merge ${source.name} into ${target.name}`);
  return { ...result, species, observations, residents, redirect: { from: source.id, to: target.id } };
}

async function publishObservation(env, entry) {
  if (!entry?.id || !entry?.date) throw Error("Missing entry id or date");
  if (entry.public !== true) throw Error("Private entries cannot be published to the public repository");
  if (!entry.privacyReview?.completed) throw Error("Privacy review is required before publication");
  const incoming = Array.isArray(entry.photos) ? entry.photos : [];
  if (incoming.length > MAX_PHOTOS) throw Error(`Maximum ${MAX_PHOTOS} photos per entry`);

  let observations = parseArray(await getTextFile(env, "observations.js"), "OBSERVATIONS");
  let species = parseArray(await getTextFile(env, "species.js"), "GARDEN_SPECIES").map(normalizeSpeciesRecord);
  const previous = observations.find(x => x.id === entry.id);
  const previousPaths = Array.isArray(previous?.photos) ? previous.photos : [];
  const files = [], photoPaths = [];
  const manifest = parseObject(await getTextFile(env, "image-manifest.js"), "IMAGE_MANIFEST");
  manifest.hero = Array.isArray(manifest.hero) ? manifest.hero : [];
  manifest.plants = manifest.plants && typeof manifest.plants === "object" ? manifest.plants : {};
  manifest.wildlife = manifest.wildlife && typeof manifest.wildlife === "object" ? manifest.wildlife : {};
  let manifestChanged = false;

  // Resolve/create wildlife records before processing portraits so the primary subject has a stable ID.
  const speciesIds = new Set(Array.isArray(entry.species) ? entry.species : []);
  const createdIds = new Set();
  for (const detail of (entry.visitorDetails || [])) {
    if (detail.status === "create-species" || detail.disposition === "new") {
      const record = makeSpeciesRecord(detail, entry);
      species = mergeSpecies(species, record);
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
    if (typeof photo === "string") { photoPaths.push(photo); continue; }
    const raw = String(photo?.data || "").split(",")[1];
    if (!raw) continue;
    if (raw.length > MAX_BASE64_CHARS) throw Error("A prepared photo is too large");
    const folder = `images/observations/${String(entry.date).slice(0, 4)}/${safeSlug(entry.id)}`;
    const filename = safeSlug(photo.name || `photo-${i + 1}.jpg`, `${i + 1}.jpg`);
    const path = `${folder}/${filename.endsWith(".jpg") ? filename : filename + ".jpg"}`;
    files.push({ path, content: raw, encoding: "base64" });
    photoPaths.push(path);

    if (photo.hero) {
      const primary = entry.primary || {};
      let heroFolder = "", group = "", key = "";
      if (primary.kind === "plant") { heroFolder = `images/plants/${safeSlug(primary.id)}`; group = "plants"; key = String(primary.id); }
      if (["visitor", "resident"].includes(primary.kind)) { heroFolder = `images/wildlife/${safeSlug(primary.id)}`; group = "wildlife"; key = String(primary.id); }
      if (primary.kind === "object") heroFolder = `images/objects/${safeSlug(primary.id)}`;
      if (heroFolder) {
        const heroPath = `${heroFolder}/hero.jpg`;
        files.push({ path: heroPath, content: raw, encoding: "base64" });
        if (group) { manifest[group][key] = { ...(manifest[group][key] || {}), hero: heroPath }; manifestChanged = true; }
        if(group==='wildlife'){
          const record=species.find(x=>x.id===key);
          if(record){record.hero=heroPath;record.updatedAt=new Date().toISOString();}
        }
      }
    }
    if (entry.featured && entry.privacyReview?.safeHomepage && i === 0 && !manifest.hero.includes(path)) {
      manifest.hero.unshift(path); manifest.hero = manifest.hero.slice(0, 12); manifestChanged = true;
    }
  }

  const removed = previousPaths.filter(path => !photoPaths.includes(path));
  removed.forEach(path => files.push({ path, delete: true }));
  if (removed.length) {
    manifest.hero = manifest.hero.filter(path => !removed.includes(path));
    manifestChanged = true;
  }

  const publicEntry = cleanPublicEntry(entry, photoPaths);
  observations = observations.filter(x => x.id !== publicEntry.id);
  observations.unshift(publicEntry);
  files.push({ path: "observations.js", content: serialize("OBSERVATIONS", observations), encoding: "utf8" });
  files.push({ path: "species.js", content: serialize("GARDEN_SPECIES", species, "Persistent wildlife species and useful taxon records. Managed by Garden Brain."), encoding: "utf8" });
  if (manifestChanged) files.push({ path: "image-manifest.js", content: serialize("IMAGE_MANIFEST", manifest, "Automatically maintained by Garden Brain publishing."), encoding: "utf8" });
  const result=await atomicCommit(env, files, `Garden Brain: ${previous ? "edit" : "publish"} ${entry.title || entry.id}`);
  return {...result, observation:publicEntry, createdSpecies:[...createdIds]};
}
async function deleteObservation(env, id) {
  if (!id) throw Error("Missing observation id");
  let observations = parseArray(await getTextFile(env, "observations.js"), "OBSERVATIONS");
  let species = parseArray(await getTextFile(env, "species.js"), "GARDEN_SPECIES");
  const target = observations.find(x => x.id === id);
  if (!target) throw Error("Observation not found");
  observations = observations.filter(x => x.id !== id);
  const files = [{ path: "observations.js", content: serialize("OBSERVATIONS", observations), encoding: "utf8" }];
  const paths = Array.isArray(target.photos) ? target.photos : [];
  paths.forEach(path => files.push({ path, delete: true }));
  const manifest = parseObject(await getTextFile(env, "image-manifest.js"), "IMAGE_MANIFEST");
  const before = Array.isArray(manifest.hero) ? manifest.hero.length : 0;
  manifest.hero = (Array.isArray(manifest.hero) ? manifest.hero : []).filter(path => !paths.includes(path));
  if (manifest.hero.length !== before) files.push({ path: "image-manifest.js", content: serialize("IMAGE_MANIFEST", manifest, "Automatically maintained by Garden Brain publishing."), encoding: "utf8" });
  return atomicCommit(env, files, `Garden Brain: delete ${target.title || id}`);
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

async function publishArray(env, { path, variable, items, message, comment }) {
  if (!Array.isArray(items)) throw Error("Expected an array");
  return atomicCommit(env, [{ path, content: serialize(variable, items, comment), encoding: "utf8" }], message);
}

export default {
  async fetch(request, env) {
    const headers = cors(env, request);
    if (request.method === "OPTIONS") return new Response(null, { headers });
    const url = new URL(request.url);
    if (url.pathname === "/health" && request.method === "GET") return json({ ok: true, service: "Pollinator Path Garden Brain", version: WORKER_VERSION, aiConfigured: Boolean(env.OPENAI_API_KEY) }, 200, headers);
    if (!authenticated(request, env)) return json({ error: "Unauthorized" }, 401, headers);
    try {
      if (url.pathname === "/garden" && request.method === "GET") {
        const [p, o, m, r, s] = await Promise.all([getTextFile(env, "placements.js"), getTextFile(env, "observations.js"), getTextFile(env, "milestones.js"), getTextFile(env, "residents.js"), getTextFile(env, "species.js")]);
        return json({ placements: parseArray(p, "GARDEN_PLACEMENTS"), observations: parseArray(o, "OBSERVATIONS"), milestones: parseArray(m, "GARDEN_MILESTONES"), residents: parseArray(r, "GARDEN_RESIDENTS"), species: parseArray(s, "GARDEN_SPECIES") }, 200, headers);
      }
      if (url.pathname === "/identify" && request.method === "POST") return json({ ok: true, ...await identifyPhotos(env, await request.json()) }, 200, headers);
      if (["/entry", "/observations"].includes(url.pathname) && ["POST", "PUT"].includes(request.method)) return json({ ok: true, ...await publishObservation(env, await request.json()) }, 200, headers);
      if (url.pathname.startsWith("/observations/") && request.method === "DELETE") return json({ ok: true, ...await deleteObservation(env, decodeURIComponent(url.pathname.split("/").pop())) }, 200, headers);
      if (url.pathname === "/placements" && request.method === "POST") { const b = await request.json(); return json({ ok: true, ...await publishArray(env, { path: "placements.js", variable: "GARDEN_PLACEMENTS", items: b.placements, message: "Garden Brain: publish map placements", comment: "Automatically published by the Garden Map Editor." }) }, 200, headers); }
      if (url.pathname === "/residents" && request.method === "POST") { const b = await request.json(); return json({ ok: true, ...await publishArray(env, { path: "residents.js", variable: "GARDEN_RESIDENTS", items: b.residents, message: "Garden Brain: update residents", comment: "Editable named garden residents." }) }, 200, headers); }
      if (url.pathname === "/species" && request.method === "GET") { const s = await getTextFile(env, "species.js"); return json({ ok:true, species:parseArray(s,"GARDEN_SPECIES") },200,headers); }
      if (url.pathname === "/species" && request.method === "POST") { const b = await request.json(); return json({ ok: true, ...await publishArray(env, { path: "species.js", variable: "GARDEN_SPECIES", items: b.species, message: "Garden Brain: update wildlife species", comment: "Persistent wildlife species and useful taxon records. Managed by Garden Brain." }) }, 200, headers); }
      if (url.pathname === "/species/refine" && request.method === "POST") return json({ ok:true, ...await refineSpecies(env, await request.json()) },200,headers);
      if (url.pathname === "/species/merge" && request.method === "POST") return json({ ok:true, ...await mergeSpeciesRecords(env, await request.json()) },200,headers);
      if (url.pathname === "/milestones" && request.method === "POST") { const b = await request.json(); return json({ ok: true, ...await publishArray(env, { path: "milestones.js", variable: "GARDEN_MILESTONES", items: b.milestones, message: "Garden Brain: update milestones", comment: "Garden milestones and meaningful firsts." }) }, 200, headers); }
      return json({ error: "Not found" }, 404, headers);
    } catch (error) { return json({ error: error.message }, 500, headers); }
  },
};
