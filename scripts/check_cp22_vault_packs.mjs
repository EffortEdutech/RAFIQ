import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

const VAULT_DIR = 'data/vault/full-private';
const GRAPH_DIR = 'data/graphify/full-private';

const REQUIRED_FRONT_MATTER = [
  'artifact_id',
  'artifact_type',
  'title',
  'status',
  'environment',
  'access_level',
  'public_safe',
  'generated_at',
  'generated_by',
  'source_graph_id',
  'canonical_refs',
  'source_refs',
  'graph_node_ids',
  'release_state',
  'review_state',
  'quality_state',
];

const REQUIRED_SECTIONS = [
  'Summary',
  'Canonical References',
  'Source And Attribution',
  'Evidence Graph',
  'Quality And Review State',
  'Release Boundary',
  'Open Questions Or Blockers',
];

const REQUIRED_CATEGORIES = [
  'sources',
  'quran',
  'tafsir',
  'hadith',
  'topics',
  'governance',
  'quality',
  'validation',
  'release-gates',
];

const REQUIRED_ARTIFACT_TYPES = [
  'ayah_study_pack',
  'tafsir_passage_pack',
  'hadith_verification_pack',
  'theme_guidance_pack',
  'source_approval_pack',
  'guidance_evidence_pack',
  'release_gate_pack',
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex').toUpperCase();
}

function parseFrontMatter(content, file) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  assert(match, `${file} missing YAML front matter`);
  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const index = line.indexOf(':');
    if (index === -1) continue;
    data[line.slice(0, index).trim()] = line.slice(index + 1).trim();
  }
  return data;
}

function scalar(value) {
  return String(value ?? '').replace(/^"|"$/g, '');
}

function parseInlineArray(value) {
  const text = String(value ?? '').trim();
  if (text === '[]') return [];
  assert(text.startsWith('[') && text.endsWith(']'), `expected inline array, got ${text}`);
  return [...text.matchAll(/"((?:\\"|[^"])*)"/g)].map((match) => match[1].replace(/\\"/g, '"'));
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, 'utf8'));
}

const vaultManifest = await readJson(path.join(VAULT_DIR, 'manifest.json'));
const graphManifest = await readJson(path.join(GRAPH_DIR, 'manifest.json'));
const byNodeId = await readJson(path.join(GRAPH_DIR, 'indexes/by-node-id.json'));

assert(vaultManifest.schemaVersion === 'cp22.full-private-vault.v1', 'unexpected vault schemaVersion');
assert(vaultManifest.checkpoint === 'CP22-G07', 'vault checkpoint must be CP22-G07');
assert(vaultManifest.sourceGraphId === graphManifest.graphId, 'vault sourceGraphId must match graph manifest');
assert(vaultManifest.sourceGraphCheckpoint === 'CP22-G06', 'vault must be generated from CP22-G06 source graph');
assert(vaultManifest.publicSafe === false, 'vault manifest publicSafe must be false');
assert(vaultManifest.requiredBoundary?.vaultArtifactsAreCanonicalSourceData === false, 'vault must not be canonical source data');
assert(vaultManifest.requiredBoundary?.rawTextBodiesExported === false, 'vault must not export raw text bodies');
assert(vaultManifest.requiredBoundary?.publicReleaseApproved === false, 'vault must not approve public release');
assert(vaultManifest.requiredBoundary?.publicSafeArtifactsAllowed === false, 'vault must not allow public-safe artifacts in CP22-G07');

const artifacts = vaultManifest.artifacts ?? [];
assert(artifacts.length > 0, 'vault manifest has no artifacts');
assert(vaultManifest.counts?.artifacts === artifacts.length, 'artifact count mismatch');
assert(vaultManifest.counts?.publicSafeArtifacts === 0, 'public-safe artifact count must be zero');

const categories = new Set(artifacts.map((artifact) => artifact.category));
for (const category of REQUIRED_CATEGORIES) {
  assert(categories.has(category), `missing vault category ${category}`);
  assert((vaultManifest.categoryCounts?.[category] ?? 0) > 0, `category ${category} has no count`);
}

const artifactTypes = new Set(artifacts.map((artifact) => artifact.artifactType));
for (const artifactType of REQUIRED_ARTIFACT_TYPES) {
  assert(artifactTypes.has(artifactType), `missing artifact type ${artifactType}`);
}

const seenPaths = new Set();
const unresolvedNodeIds = [];
let publicSafeArtifacts = 0;
let canonicalBoundaryMentions = 0;
let checkedMarkdownCount = 0;
let graphNodeReferenceCount = 0;

for (const artifact of artifacts) {
  assert(!seenPaths.has(artifact.path), `duplicate artifact path ${artifact.path}`);
  seenPaths.add(artifact.path);
  assert(artifact.publicSafe === false, `${artifact.path} manifest publicSafe must be false`);
  assert(Array.isArray(artifact.graphNodeIds), `${artifact.path} missing graphNodeIds array`);
  assert(Array.isArray(artifact.canonicalRefs), `${artifact.path} missing canonicalRefs array`);
  assert(Array.isArray(artifact.sourceRefs), `${artifact.path} missing sourceRefs array`);
  assert(artifact.canonicalRefs.length > 0, `${artifact.path} must include canonical refs`);

  const fullPath = path.join(VAULT_DIR, artifact.path);
  const content = await readFile(fullPath, 'utf8');
  assert(sha256(content) === artifact.checksumSha256, `${artifact.path} checksum mismatch`);

  const frontMatter = parseFrontMatter(content, artifact.path);
  for (const field of REQUIRED_FRONT_MATTER) {
    assert(Object.prototype.hasOwnProperty.call(frontMatter, field), `${artifact.path} missing front matter field ${field}`);
  }

  for (const section of REQUIRED_SECTIONS) {
    assert(content.includes(`## ${section}`), `${artifact.path} missing section ${section}`);
  }

  assert(scalar(frontMatter.artifact_id) === artifact.artifactId, `${artifact.path} artifact_id mismatch`);
  assert(scalar(frontMatter.artifact_type) === artifact.artifactType, `${artifact.path} artifact_type mismatch`);
  assert(scalar(frontMatter.environment) === 'private_local', `${artifact.path} environment must be private_local`);
  assert(scalar(frontMatter.access_level) === 'developer_private', `${artifact.path} access_level must be developer_private`);
  assert(frontMatter.public_safe === 'false', `${artifact.path} public_safe must be false`);
  assert(scalar(frontMatter.source_graph_id) === graphManifest.graphId, `${artifact.path} source_graph_id mismatch`);

  const graphNodeIds = parseInlineArray(frontMatter.graph_node_ids);
  assert(graphNodeIds.length === artifact.graphNodeIds.length, `${artifact.path} graph_node_ids count mismatch`);
  for (const nodeId of graphNodeIds) {
    if (!byNodeId[nodeId]) unresolvedNodeIds.push(`${artifact.path}:${nodeId}`);
  }
  graphNodeReferenceCount += graphNodeIds.length;

  const canonicalRefs = parseInlineArray(frontMatter.canonical_refs);
  const sourceRefs = parseInlineArray(frontMatter.source_refs);
  assert(canonicalRefs.length > 0, `${artifact.path} front matter must include canonical refs`);
  assert(sourceRefs.length > 0, `${artifact.path} front matter must include source refs`);

  if (frontMatter.public_safe === 'true') publicSafeArtifacts += 1;
  if (content.includes('not canonical source data')) canonicalBoundaryMentions += 1;
  assert(content.includes('must not be exposed through'), `${artifact.path} must state public exposure boundary`);
  checkedMarkdownCount += 1;
}

assert(unresolvedNodeIds.length === 0, `unresolved graph node IDs: ${unresolvedNodeIds.slice(0, 10).join(', ')}`);
assert(publicSafeArtifacts === 0, 'no markdown artifact may be public_safe=true');
assert(canonicalBoundaryMentions === checkedMarkdownCount, 'every markdown artifact must state non-canonical boundary');
assert(graphNodeReferenceCount > 0, 'vault must reference graph node IDs');
assert(vaultManifest.counts.graphNodesReferenced > 0, 'vault manifest must count graph nodes referenced');

console.log(JSON.stringify({
  status: 'pass',
  checkpoint: vaultManifest.checkpoint,
  vaultDir: VAULT_DIR,
  artifactCount: checkedMarkdownCount,
  categories: [...categories].sort(),
  artifactTypes: [...artifactTypes].sort(),
  publicSafeArtifacts,
  graphNodesReferenced: vaultManifest.counts.graphNodesReferenced,
  graphNodeReferenceCount,
}, null, 2));
