export const FOUNDATION_WRITE_CONTRACT = Object.freeze({
  version: "4.4.0-rc.1",
  environment: "staging",
  branch: "staging/foundation-4.4.0-rc.1",
  baselineCommit: "3e5f427f07c9efa80d518f0f48ad6f2831dc367d",
  stagingIdPrefix: "stg-",
});

const DEFER_ENTITY_KEYS = new Set([
  "media_asset|images/maps/front-aerial-measured.jpg",
  "media_asset|images/maps/front-east-numbered.jpg",
  "media_asset|images/maps/front-landscape-plan.jpg",
  "media_asset|images/maps/front-west-numbered.jpg",
  "media_asset|images/objects/feature-birdbath/hero.jpg",
  "media_asset|images/plants/10/hero.jpg",
  "media_asset|images/plants/11/hero.jpg",
  "media_asset|images/plants/15/hero.jpg",
  "media_asset|images/plants/19/hero.jpg",
  "media_asset|images/plants/2/hero.jpg",
  "media_asset|images/plants/21/hero.jpg",
  "media_asset|images/plants/23/hero.jpg",
  "media_asset|images/plants/25/hero.jpg",
  "media_asset|images/plants/27/hero.jpg",
  "media_asset|images/plants/28/hero.jpg",
  "media_asset|images/plants/30/hero.jpg",
  "media_asset|images/plants/33/hero.jpg",
  "media_asset|images/plants/37/hero.jpg",
  "media_asset|images/plants/38/hero.jpg",
  "media_asset|images/plants/4/hero.jpg",
  "media_asset|images/plants/41/hero.jpg",
  "media_asset|images/plants/49/hero.jpg",
  "media_asset|images/plants/8/hero.jpg",
  "media_asset|images/plants/9/hero.jpg",
  "media_asset|images/wildlife/unknown-pending/hero.jpg",
  "modern_species|big-booty-judy",
  "modern_species|leafcutter-bee-megachilidae",
  "observation|2025-07-24-mrmqszjt",
  "observation|2026-06-05-mrmqc198",
  "observation|2026-07-13-brenda-blanket-flower",
  "observation|2026-07-13-mrjubzhc",
  "observation|2026-07-13-mrjuz62o",
  "observation|2026-07-13-mrjv1r5e",
  "observation|2026-07-13-mrjv4ib9",
  "observation|2026-07-13-mrjv66aa",
  "observation|2026-07-13-mrjvahjq",
  "observation|2026-07-13-mrjvkfnx",
  "observation|2026-07-13-mrjvlmsb",
  "observation|2026-07-13-mrjvnqpv",
  "observation|2026-07-13-mrjvpi34",
  "observation|2026-07-13-mrjvrhu1",
  "observation|2026-07-13-mrjvsbsd",
  "observation|2026-07-13-mrjvtdph",
  "observation|2026-07-13-mrjvut2e",
  "observation|2026-07-13-mrjvwl2h",
  "observation|2026-07-13-mrjvydb7",
  "observation|2026-07-13-mrjvyyvm",
  "observation|2026-07-13-mrmmemqj",
  "observation|2026-07-13-mrmor2tk",
  "observation|2026-07-14-mrjy1kxl",
  "observation|2026-07-14-mrjy2o1q",
  "observation|2026-07-14-mrjy6cso",
  "observation|2026-07-14-mrjy8qzr",
  "observation|2026-07-14-mrmlqfvx",
  "observation|2026-07-14-mrmmbbfd",
  "observation|2026-07-16-mrmulvpf",
  "observation|2026-07-16-mrmunxz8",
  "observation|2026-07-16-mrmuq2xt",
  "observation|2026-07-16-mrmvm6ld",
  "observation|2026-07-17-de9ff3f1-0e55-40f7-9065-80d18e8eeec4",
  "observation|2026-07-18-46f64ffe-5f34-40b9-9168-e15c81afcaf0",
  "observation|2026-07-18-631b3667-2ef8-4386-9f10-8dc044e1d8bc",
  "observation|2026-07-18-5c162e1c-5a0c-4056-be3e-75df42674e2b",
  "observation|2026-07-18-7616b09d-9e28-46f7-85cf-e4f4c29deb2c",
  "observation|2026-07-18-9374b309-68c5-4729-a702-81b2309d8038",
  "observation|2026-07-18-ce732b0c-f86d-4ffb-a1f8-20de09984b50",
  "observation|2026-07-18-d5835b2f-070f-4f03-916a-9108fc4d5bdb",
  "observation|2026-07-19-363e08d7-ad24-4d25-a74f-c409ff84c813",
]);

const QUARANTINE_MEDIA_PATHS = new Set([
  "images/observations/2026/2026-07-21-92011266-0d78-4c03-8986-7ed9e090e4b4/garden-030f38a9-2cd3-4bc5-826f-5a136551235a-2.jpg",
  "images/observations/2026/2026-07-21-92011266-0d78-4c03-8986-7ed9e090e4b4/garden-34dd2e94-42ea-4149-837d-7e6d5f7da2cf-7.jpg",
  "images/observations/2026/2026-07-21-92011266-0d78-4c03-8986-7ed9e090e4b4/garden-7177b3e8-319a-4f8d-83b3-30574a66182b-4.jpg",
  "images/observations/2026/2026-07-21-92011266-0d78-4c03-8986-7ed9e090e4b4/garden-8b22976d-7879-4f9b-94b9-996aa7a2d549-5.jpg",
  "images/observations/2026/2026-07-21-92011266-0d78-4c03-8986-7ed9e090e4b4/garden-96b77f38-ab4b-4ba9-9190-622b7fe950f2-1.jpg",
  "images/observations/2026/2026-07-21-92011266-0d78-4c03-8986-7ed9e090e4b4/garden-aa9c629a-3220-4b8c-8277-6543c3653a2b-3.jpg",
  "images/observations/2026/2026-07-21-92011266-0d78-4c03-8986-7ed9e090e4b4/garden-f2bf660f-8bcf-4b8e-aa07-4d53382f75c7-6.jpg",
  "images/observations/2026/2026-07-21-de8aefa5-743d-49e0-b9fe-d08ed0bca074/garden-01a31ae1-49b4-41a3-9e27-7b8e1df78576-6.jpg",
  "images/observations/2026/2026-07-21-de8aefa5-743d-49e0-b9fe-d08ed0bca074/garden-481a95eb-952c-415b-a9cc-b63d29f4a0f9-7.jpg",
  "images/observations/2026/2026-07-21-de8aefa5-743d-49e0-b9fe-d08ed0bca074/garden-6bf464d5-e8ad-4106-b824-f748e05743ac-4.jpg",
  "images/observations/2026/2026-07-21-de8aefa5-743d-49e0-b9fe-d08ed0bca074/garden-71490035-e770-43de-b78a-b122baaa68df-9.jpg",
  "images/observations/2026/2026-07-21-de8aefa5-743d-49e0-b9fe-d08ed0bca074/garden-bb2d2a92-503b-4fff-927e-e1ef2b4561aa-1.jpg",
  "images/observations/2026/2026-07-21-de8aefa5-743d-49e0-b9fe-d08ed0bca074/garden-befa0525-a58f-48ba-8b68-29611888254a-5.jpg",
  "images/observations/2026/2026-07-21-de8aefa5-743d-49e0-b9fe-d08ed0bca074/garden-c0e70664-add5-4c97-ac8d-fbf5a4216701-3.jpg",
  "images/observations/2026/2026-07-21-de8aefa5-743d-49e0-b9fe-d08ed0bca074/garden-d3356a09-0d2f-4205-ba71-713788f1cc2c-8.jpg",
  "images/observations/2026/2026-07-21-de8aefa5-743d-49e0-b9fe-d08ed0bca074/garden-d9994408-98e9-47b7-8972-8190b2547863-10.jpg",
  "images/observations/2026/2026-07-21-de8aefa5-743d-49e0-b9fe-d08ed0bca074/garden-fad364a6-b156-48db-b89a-2165c032f827-2.jpg",
]);

const APPROVED_UNAVAILABLE_TAXONOMY_HEROES = Object.freeze({
  "broad-tailed-hummingbird": "images/wildlife/broad-tailed-hummingbird/hero.jpg",
  "large-bee-probable-carpenter-or-bumble-bee": "images/wildlife/large-bee-probable-carpenter-or-bumble-bee/hero.jpg",
  "leafcutter-bee": "images/wildlife/brenda/hero.jpg",
  "longhorn-beetle-or-similar-flower-visiting-beetle": "images/wildlife/longhorn-beetle-or-similar-flower-visiting-beetle/hero.jpg",
  "small-bee-likely-a-native-solitary-bee-or-small-generalist-bee": "images/wildlife/small-bee-likely-a-native-solitary-bee-or-small-generalist-bee/hero.jpg",
  "thread-waisted-wasp-likely-genus-ammophila-or-related": "images/wildlife/thread-waisted-wasp-likely-genus-ammophila-or-related/hero.jpg",
  "toad-unresolved": "images/wildlife/toad-unresolved/hero.jpg",
  "white-lined-sphinx": "images/wildlife/white-lined-sphinx/hero.jpg",
});

const FOUNDATION_BASELINE_PLACEMENTS = Object.freeze([
  Object.freeze({ id: "sassy-anchor", kind: "object", objectId: "tree-sassy-pants", map: "front-west", x: 20, y: 31, precision: "surveyed", status: "active" }),
  Object.freeze({ id: "oak-anchor", kind: "object", objectId: "tree-dick", map: "front-east", x: 53, y: 18, precision: "surveyed", status: "active" }),
  Object.freeze({ id: "little-bluestem-west", kind: "plant", plantNumber: 27, map: "front-west", x: 66, y: 33, quantity: 3, shape: "cluster", precision: "confirmed", status: "active" }),
]);

export class ContractError extends Error {
  constructor(code, message, status = 409, details = undefined) {
    super(message);
    this.name = "ContractError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export function normalizeMediaPath(value) {
  return String(value ?? "").trim().replaceAll("\\", "/").replace(/^\.\//, "");
}

export function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

export function isStagingId(id) {
  return String(id ?? "").startsWith(FOUNDATION_WRITE_CONTRACT.stagingIdPrefix);
}

export function assertEnvironment(env) {
  const actual = {
    environment: env.ENVIRONMENT,
    branch: env.GITHUB_BRANCH,
    contractVersion: env.FOUNDATION_CONTRACT_VERSION,
    baselineCommit: env.FOUNDATION_BASELINE_COMMIT,
  };
  const expected = {
    environment: FOUNDATION_WRITE_CONTRACT.environment,
    branch: FOUNDATION_WRITE_CONTRACT.branch,
    contractVersion: FOUNDATION_WRITE_CONTRACT.version,
    baselineCommit: FOUNDATION_WRITE_CONTRACT.baselineCommit,
  };
  if (canonicalJson(actual) !== canonicalJson(expected)) {
    throw new ContractError("STAGING_IDENTITY_MISMATCH", "Worker staging identity does not match the approved Foundation contract", 503, { actual, expected });
  }
  return expected;
}

export function assertBaseRevision(body, currentRevision) {
  if (!body || body.contractVersion !== FOUNDATION_WRITE_CONTRACT.version) {
    throw new ContractError("CONTRACT_VERSION_REQUIRED", `Write requires contractVersion ${FOUNDATION_WRITE_CONTRACT.version}`, 409);
  }
  if (!body.baseRevision || body.baseRevision !== currentRevision) {
    throw new ContractError("STALE_REVISION", "The staging branch changed after this screen was loaded. Refresh before saving.", 409, { expected: currentRevision, received: body?.baseRevision ?? null });
  }
}

export function assertNotDeferred(entityType, id) {
  const key = `${entityType}|${normalizeMediaPath(id)}`;
  if (DEFER_ENTITY_KEYS.has(key)) throw new ContractError("DEFER_PROTECTED", `${key} is protected by an approved DEFER disposition`, 403);
}

export function assertStagingRecord(entityType, record) {
  const id = String(record?.id ?? "");
  if (!id) throw new ContractError("IDENTIFIER_REQUIRED", `${entityType} requires a stable identifier`, 400);
  assertNotDeferred(entityType, id);
  if (!isStagingId(id)) throw new ContractError("FOUNDATION_BASELINE_IMMUTABLE", `${entityType} ${id} is part of the immutable Foundation baseline`, 403);
  return id;
}

export function assertWritableMediaPath(value) {
  const path = normalizeMediaPath(value);
  assertNotDeferred("media_asset", path);
  if (QUARANTINE_MEDIA_PATHS.has(path)) throw new ContractError("QUARANTINE_PROTECTED", `${path} has an approved QUARANTINE disposition`, 403);
  if (!path.startsWith("images/staging/")) throw new ContractError("STAGING_MEDIA_PATH_REQUIRED", "Acceptance-test media must remain under images/staging/", 403, { path });
  return path;
}

export function mergePreservingUnknown(existing, incoming) {
  if (!existing || typeof existing !== "object" || Array.isArray(existing)) return structuredClone(incoming);
  if (!incoming || typeof incoming !== "object" || Array.isArray(incoming)) return structuredClone(incoming);
  const merged = structuredClone(existing);
  for (const [key, value] of Object.entries(incoming)) {
    merged[key] = value && typeof value === "object" && !Array.isArray(value) && merged[key] && typeof merged[key] === "object" && !Array.isArray(merged[key])
      ? mergePreservingUnknown(merged[key], value)
      : structuredClone(value);
  }
  return merged;
}

export function assertCollectionPreserved(before, after, entityType) {
  if (!Array.isArray(before) || !Array.isArray(after)) throw new ContractError("ARRAY_REQUIRED", `${entityType} must be an array`, 400);
  const beforeById = new Map(before.map((record) => [String(record?.id ?? ""), record]));
  const afterById = new Map();
  for (const record of after) {
    const id = String(record?.id ?? "");
    if (!id || afterById.has(id)) throw new ContractError("DUPLICATE_OR_MISSING_ID", `${entityType} contains a duplicate or missing identifier`, 400, { id });
    assertNotDeferred(entityType, id);
    afterById.set(id, record);
  }
  for (const [id, original] of beforeById) {
    const candidate = afterById.get(id);
    if (!candidate) throw new ContractError("OMISSION_IS_NOT_DELETION", `${entityType} ${id} was omitted; omission cannot delete a record`, 403);
    if (!isStagingId(id) && canonicalJson(original) !== canonicalJson(candidate)) {
      throw new ContractError("FOUNDATION_BASELINE_IMMUTABLE", `${entityType} ${id} differs from the immutable Foundation baseline`, 403);
    }
  }
  for (const [id] of afterById) if (!beforeById.has(id) && !isStagingId(id)) {
    throw new ContractError("STAGING_ID_REQUIRED", `New ${entityType} IDs must begin with ${FOUNDATION_WRITE_CONTRACT.stagingIdPrefix}`, 403, { id });
  }
  return true;
}

export function preserveObservationEdit(existing, incoming) {
  assertStagingRecord("observation", incoming);
  const merged = mergePreservingUnknown(existing ?? {}, incoming);
  const previousPhotos = Array.isArray(existing?.photos) ? existing.photos.map(normalizeMediaPath) : [];
  const incomingPhotos = Array.isArray(incoming?.photos) ? incoming.photos : [];
  const retained = incomingPhotos.filter((photo) => typeof photo === "string").map(normalizeMediaPath);
  for (const path of retained) if (!previousPhotos.includes(path)) assertWritableMediaPath(path);
  merged.photos = [...new Set([...previousPhotos, ...retained])];
  merged.id = incoming.id;
  merged.provenance = mergePreservingUnknown(existing?.provenance ?? {}, {
    environment: FOUNDATION_WRITE_CONTRACT.environment,
    contractVersion: FOUNDATION_WRITE_CONTRACT.version,
    baselineCommit: FOUNDATION_WRITE_CONTRACT.baselineCommit,
    recordClass: "staging-acceptance-test",
  });
  return merged;
}

export function classifyTaxonomyHero(taxonomyId, mediaPath, present = false) {
  const path = normalizeMediaPath(mediaPath);
  if (!path) return "none";
  if (present) return "present";
  if (APPROVED_UNAVAILABLE_TAXONOMY_HEROES[taxonomyId] === path) return "approved-unavailable";
  if (QUARANTINE_MEDIA_PATHS.has(path)) return "intentionally-quarantined";
  return "unexplained-missing";
}

export function withRevision(payload, baseRevision) {
  return { ...payload, contractVersion: FOUNDATION_WRITE_CONTRACT.version, baseRevision };
}

export function contractInventory() {
  return Object.freeze({
    deferEntityCount: DEFER_ENTITY_KEYS.size,
    quarantineMediaCount: QUARANTINE_MEDIA_PATHS.size,
    approvedUnavailableHeroCount: Object.keys(APPROVED_UNAVAILABLE_TAXONOMY_HEROES).length,
  });
}

export function foundationBaselinePlacements() {
  return structuredClone(FOUNDATION_BASELINE_PLACEMENTS);
}
