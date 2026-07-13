const API_VERSION = "2026-03-10";
const MAX_PHOTOS = 20;
const MAX_BASE64_CHARS = 12_000_000;

const json = (value, status = 200, headers = {}) => new Response(JSON.stringify(value), {
  status,
  headers: { "content-type": "application/json; charset=utf-8", ...headers },
});

function cors(env, request) {
  const origin = request.headers.get("origin") || "";
  const allowed = String(env.ALLOWED_ORIGIN || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const accepted = !origin || allowed.includes(origin);
  return {
    "access-control-allow-origin": accepted ? origin : (allowed[0] || "null"),
    "access-control-allow-headers": "authorization,content-type",
    "access-control-allow-methods": "GET,POST,OPTIONS",
    vary: "Origin",
  };
}

function authenticated(request, env) {
  return request.headers.get("authorization") === `Bearer ${env.NOTEBOOK_KEY}`;
}

function safeSlug(value, fallback = "entry") {
  return String(value || fallback)
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 96) || fallback;
}

function base64FromUtf8(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function utf8FromBase64(value) {
  const binary = atob(value.replace(/\n/g, ""));
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
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
  if (!response.ok) {
    throw new Error(`GitHub ${response.status}: ${await response.text()}`);
  }
  return response;
}

async function getBranchState(env) {
  const branch = env.GITHUB_BRANCH || "main";
  const ref = await (await github(env, `/git/ref/heads/${encodeURIComponent(branch)}`)).json();
  const commitSha = ref.object.sha;
  const commit = await (await github(env, `/git/commits/${commitSha}`)).json();
  return { branch, commitSha, treeSha: commit.tree.sha };
}

async function getTextFile(env, path) {
  const branch = env.GITHUB_BRANCH || "main";
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
  const file = await response.json();
  return utf8FromBase64(file.content);
}

async function atomicCommit(env, files, message) {
  if (!Array.isArray(files) || files.length === 0) throw new Error("No files supplied for commit");
  const { branch, commitSha, treeSha } = await getBranchState(env);
  const tree = files.map((file) => ({
    path: file.path,
    mode: "100644",
    type: "blob",
    content: file.encoding === "base64" ? undefined : file.content,
  }));

  // Git tree API cannot accept base64 via content, so create binary blobs first.
  for (let index = 0; index < files.length; index += 1) {
    if (files[index].encoding !== "base64") continue;
    const blob = await (await github(env, "/git/blobs", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ content: files[index].content, encoding: "base64" }),
    })).json();
    tree[index] = { path: files[index].path, mode: "100644", type: "blob", sha: blob.sha };
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

function parseWindowArray(text, variableName) {
  if (!text) return [];
  const escaped = variableName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = text.match(new RegExp(`window\\.${escaped}\\s*=\\s*([\\s\\S]*);\\s*$`));
  if (!match) return [];
  const parsed = JSON.parse(match[1]);
  return Array.isArray(parsed) ? parsed : [];
}

function serializeWindowArray(variableName, value, comment = "") {
  const heading = comment ? `// ${comment}\n` : "";
  return `${heading}window.${variableName} = ${JSON.stringify(value, null, 2)};\n`;
}

function validatePlacements(placements) {
  if (!Array.isArray(placements) || placements.length > 1000) throw new Error("Invalid placements payload");
  const ids = new Set();
  for (const placement of placements) {
    if (!placement || !placement.id || !["plant", "object"].includes(placement.kind) || !placement.map) {
      throw new Error(`Invalid placement: ${placement?.id || "unknown"}`);
    }
    if (ids.has(placement.id)) throw new Error(`Duplicate placement id: ${placement.id}`);
    ids.add(placement.id);
    if (typeof placement.x !== "number" || typeof placement.y !== "number" || placement.x < 0 || placement.x > 100 || placement.y < 0 || placement.y > 100) {
      throw new Error(`Placement coordinates out of range: ${placement.id}`);
    }
  }
}

function cleanPublicEntry(entry, photoPaths) {
  const clean = { ...entry, photos: photoPaths };
  delete clean.privateNotes;
  delete clean.notebookKey;
  delete clean.rawPhotos;
  return clean;
}

async function publishObservation(env, entry) {
  if (!entry.id || !entry.date) throw new Error("Missing entry id or date");
  const photos = Array.isArray(entry.photos) ? entry.photos : [];
  if (photos.length > MAX_PHOTOS) throw new Error(`Maximum ${MAX_PHOTOS} photos per entry`);

  const files = [];
  const photoPaths = [];
  for (let index = 0; index < photos.length; index += 1) {
    const photo = photos[index];
    const raw = String(photo.data || "").split(",")[1];
    if (!raw) continue;
    if (raw.length > MAX_BASE64_CHARS) throw new Error("A prepared photo is too large");
    const primary = entry.primary || {};
    const journalFolder = `images/observations/${String(entry.date).slice(0, 4)}/${safeSlug(entry.id)}`;
    const filename = safeSlug(photo.name || `${entry.date}-${index + 1}.jpg`, `${index + 1}.jpg`);
    const journalPath = `${journalFolder}/${filename.endsWith(".jpg") ? filename : `${filename}.jpg`}`;
    files.push({ path: journalPath, content: raw, encoding: "base64" });
    photoPaths.push(journalPath);

    // A master portrait is an additional copy. The dated journal image remains,
    // so replacing a portrait never erases the observation history.
    if (photo.hero) {
      let heroFolder = "";
      if (primary.kind === "plant") heroFolder = `images/plants/${safeSlug(primary.id)}`;
      if (primary.kind === "visitor") heroFolder = `images/wildlife/${safeSlug(primary.id)}`;
      if (primary.kind === "object") heroFolder = `images/objects/${safeSlug(primary.id)}`;
      if (heroFolder) files.push({ path: `${heroFolder}/hero.jpg`, content: raw, encoding: "base64" });
    }
  }

  const current = await getTextFile(env, "observations.js");
  let observations = parseWindowArray(current, "OBSERVATIONS");
  const publicEntry = cleanPublicEntry(entry, photoPaths);
  observations = observations.filter((item) => item.id !== publicEntry.id);
  observations.unshift(publicEntry);
  files.push({ path: "observations.js", content: serializeWindowArray("OBSERVATIONS", observations), encoding: "utf8" });

  return atomicCommit(env, files, `Garden Brain: ${entry.title || entry.id}`);
}

async function publishArray(env, { path, variable, items, message, comment }) {
  if (!Array.isArray(items)) throw new Error("Expected an array");
  return atomicCommit(env, [{ path, content: serializeWindowArray(variable, items, comment), encoding: "utf8" }], message);
}

export default {
  async fetch(request, env) {
    const headers = cors(env, request);
    if (request.method === "OPTIONS") return new Response(null, { headers });
    const url = new URL(request.url);

    if (url.pathname === "/health" && request.method === "GET") {
      return json({ ok: true, service: "Pollinator Path Garden Brain", version: "3.0" }, 200, headers);
    }
    if (!authenticated(request, env)) return json({ error: "Unauthorized" }, 401, headers);

    try {
      if (url.pathname === "/garden" && request.method === "GET") {
        const [placements, observations, milestones] = await Promise.all([
          getTextFile(env, "placements.js"),
          getTextFile(env, "observations.js"),
          getTextFile(env, "milestones.js"),
        ]);
        return json({
          placements: parseWindowArray(placements, "GARDEN_PLACEMENTS"),
          observations: parseWindowArray(observations, "OBSERVATIONS"),
          milestones: parseWindowArray(milestones, "GARDEN_MILESTONES"),
        }, 200, headers);
      }

      if ((url.pathname === "/entry" || url.pathname === "/observations") && request.method === "POST") {
        const result = await publishObservation(env, await request.json());
        return json({ ok: true, ...result }, 200, headers);
      }

      if (url.pathname === "/placements" && request.method === "POST") {
        const body = await request.json();
        validatePlacements(body.placements);
        const result = await publishArray(env, {
          path: "placements.js",
          variable: "GARDEN_PLACEMENTS",
          items: body.placements,
          message: "Garden Brain: publish map placements",
          comment: "Automatically published by the Garden Map Editor.",
        });
        return json({ ok: true, count: body.placements.length, ...result }, 200, headers);
      }

      if (url.pathname === "/milestones" && request.method === "POST") {
        const body = await request.json();
        const result = await publishArray(env, {
          path: "milestones.js",
          variable: "GARDEN_MILESTONES",
          items: body.milestones,
          message: "Garden Brain: update milestones",
          comment: "Garden milestones and meaningful firsts.",
        });
        return json({ ok: true, count: body.milestones.length, ...result }, 200, headers);
      }

      if (url.pathname === "/objects" && request.method === "POST") {
        const body = await request.json();
        const result = await publishArray(env, {
          path: "garden-objects.js",
          variable: "GARDEN_OBJECTS",
          items: body.objects,
          message: "Garden Brain: update garden objects",
          comment: "Named trees, boulders, habitat features, paths, and structures.",
        });
        return json({ ok: true, count: body.objects.length, ...result }, 200, headers);
      }

      return json({ error: "Not found" }, 404, headers);
    } catch (error) {
      return json({ error: error.message }, 500, headers);
    }
  },
};
