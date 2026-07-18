import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const GRAPH_ID = 'rafiq-full-private-resource-graph';
const SCHEMA_VERSION = 'cp22.full-private.v1';
const CONTRACT_VERSION = 'RAFIQ_KNOWLEDGE_GRAPHIFY_GRAPH_CONTRACT_V1+CP22-G02';
const ACCESS_LEVEL = 'developer_private';
const OUT_DIR = 'data/graphify/full-private';
const PARTITION_DIR = path.join(OUT_DIR, 'partitions');
const INDEX_DIR = path.join(OUT_DIR, 'indexes');
const MANIFEST_DIR = 'data/manifests';
const CHECKSUM_DIR = 'data/checksums';

function sha256(value) {
  return createHash('sha256').update(value).digest('hex').toUpperCase();
}

function stableJson(value) {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

function safeId(value) {
  return String(value ?? 'unknown')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9:_\-.]+/g, '_')
    .replace(/^_+|_+$/g, '') || 'unknown';
}

function mapReleaseState(status) {
  const raw = String(status ?? '').toLowerCase();
  if (raw.includes('public') && raw.includes('approved')) return 'approved_public';
  if (raw.includes('rejected')) return 'private_blocked';
  return raw.includes('blocked') || raw.includes('staging') || raw.includes('raw') ? 'public_blocked' : 'private_available';
}

function mapReviewState(status) {
  const raw = String(status ?? '').toLowerCase();
  if (raw.includes('approved')) return 'approved_private';
  if (raw.includes('review')) return 'content_review';
  if (raw.includes('blocked') || raw.includes('pending') || raw.includes('staging')) return 'pending';
  return 'pending';
}

function mapQualityState(manifest) {
  const status = String(manifest.status ?? '').toLowerCase();
  const notes = String(manifest.notes ?? '').toLowerCase();
  if (status.includes('quality') || notes.includes('blank') || notes.includes('duplicate') || notes.includes('gap')) return 'warning';
  if (status.includes('validated')) return 'clean';
  return 'unverified';
}

function baseNode({ id, type, label, partition, canonicalRef = null, sourceRefs = [], provenanceRefs = [], releaseStateRefs = [], releaseState = 'public_blocked', reviewState = 'pending', qualityState = 'unverified', metadata = {} }) {
  return {
    id,
    type,
    label,
    partition,
    canonicalRef,
    sourceRefs,
    provenanceRefs,
    releaseStateRefs,
    releaseState,
    reviewState,
    qualityState,
    accessLevel: ACCESS_LEVEL,
    publicSafe: false,
    metadata,
  };
}

function baseEdge({ id, type, from, to, fromPartition, toPartition, status = 'imported', confidence = null, sourceRefs = [], evidenceRefs = [], releaseState = 'public_blocked', reviewState = 'pending', metadata = {} }) {
  return {
    id,
    type,
    from,
    to,
    fromPartition,
    toPartition,
    status,
    confidence,
    sourceRefs,
    evidenceRefs,
    releaseState,
    reviewState,
    accessLevel: ACCESS_LEVEL,
    publicSafe: false,
    metadata,
  };
}

function addNode(nodes, node) {
  if (!nodes.has(node.id)) nodes.set(node.id, node);
}

function addEdge(edges, edge) {
  if (!edges.has(edge.id)) edges.set(edge.id, edge);
}

function parseCsvLine(line) {
  const values = [];
  let current = '';
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"' && line[index + 1] === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === ',' && !quoted) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current);
  return values;
}

function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length === 0) return [];
  const headers = parseCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']));
  });
}

async function readJsonManifests() {
  const files = (await readdir(MANIFEST_DIR)).filter((file) => file.endsWith('.json')).sort();
  const manifests = [];
  for (const file of files) {
    const manifestPath = path.join(MANIFEST_DIR, file).replaceAll('\\', '/');
    const raw = await readFile(manifestPath, 'utf8');
    manifests.push({ file, path: manifestPath, raw, data: JSON.parse(raw) });
  }
  return manifests;
}

async function readOptionalCsv(filePath) {
  try {
    return parseCsv(await readFile(filePath, 'utf8'));
  } catch {
    return [];
  }
}

function sourceIdFromManifest(manifest) {
  return safeId(manifest.sourceId ?? manifest.name);
}

function sourceFamily(sourceId) {
  if (sourceId.startsWith('qul-')) return 'qul';
  if (sourceId.startsWith('tanzil-')) return 'tanzil';
  if (sourceId.startsWith('hadith-')) return 'hadith-acquisition';
  return sourceId.split('-')[0] || sourceId;
}

function releaseNodeForEntity(entityType, entityId, status, metadata = {}) {
  const id = `release_state:${safeId(entityType)}:${safeId(entityId)}:manifest`;
  const releaseState = mapReleaseState(status);
  return baseNode({
    id,
    type: 'entity_release_state',
    label: `${entityType} ${entityId} release state`,
    partition: 'governance',
    canonicalRef: {
      schema: 'manifest',
      table: 'source_manifest_status',
      id: `${entityType}:${entityId}`,
    },
    releaseState,
    reviewState: mapReviewState(status),
    qualityState: 'unverified',
    metadata: {
      entityType,
      entityId,
      technicalStatus: metadata.technicalStatus ?? status ?? 'unknown',
      rightsStatus: metadata.rightsStatus ?? (String(status ?? '').includes('rights') ? 'blocked_or_pending' : 'unknown'),
      attributionStatus: metadata.attributionStatus ?? (String(status ?? '').includes('attribution') ? 'blocked_or_pending' : 'unknown'),
      editorialStatus: metadata.editorialStatus ?? 'unreviewed',
      scholarContentStatus: metadata.scholarContentStatus ?? 'unreviewed',
      publicationStatus: metadata.publicationStatus ?? (releaseState === 'approved_public' ? 'public_candidate' : 'public_blocked'),
      rawStatus: status ?? null,
    },
  });
}

function provenanceNodeForEntity(entityType, entityId, sourceId, snapshotId, manifestPath, metadata = {}) {
  return baseNode({
    id: `provenance:${safeId(entityType)}:${safeId(entityId)}:manifest`,
    type: 'entity_provenance',
    label: `${entityType} ${entityId} manifest provenance`,
    partition: 'governance',
    canonicalRef: {
      schema: 'manifest',
      table: 'source_manifest',
      id: manifestPath,
    },
    sourceRefs: [
      { type: 'source', id: `source:${sourceId}` },
      { type: 'source_snapshot', id: `snapshot:${snapshotId}` },
    ],
    releaseState: 'public_blocked',
    reviewState: 'pending',
    qualityState: 'unverified',
    metadata: {
      entityType,
      entityId,
      stagingTable: null,
      stagingId: null,
      sourceSnapshotId: snapshotId,
      mappingMethod: 'manifest_backbone_export',
      manifestPath,
      ...metadata,
    },
  });
}

async function buildGraph() {
  const manifestInputs = await readJsonManifests();
  const hadithCategoryRows = await readOptionalCsv(path.join(MANIFEST_DIR, 'hadith-acquisition-category-summary-2026-06-14.csv'));
  const hadithSubtreeRows = await readOptionalCsv(path.join(MANIFEST_DIR, 'hadith-raw-subtrees-2026-06-14.csv'));
  const checksumFiles = (await readdir(CHECKSUM_DIR)).sort();

  const sources = { nodes: new Map(), edges: new Map() };
  const governance = { nodes: new Map(), edges: new Map() };
  const sourceFamilies = new Map();

  for (const item of manifestInputs) {
    const manifest = item.data;
    const sourceKey = sourceIdFromManifest(manifest);
    const family = sourceFamily(sourceKey);
    const sourceNodeId = `source:${family}`;
    const snapshotNodeId = `snapshot:${sourceKey}`;
    const manifestNodeId = `manifest:${sourceKey}`;
    const rawNodeId = `raw_object:${sourceKey}:principal`;
    const releaseNode = releaseNodeForEntity('source_snapshot', sourceKey, manifest.status, {
      rightsStatus: String(manifest.status ?? '').includes('rights') ? 'blocked_or_pending' : 'unknown',
      attributionStatus: String(manifest.status ?? '').includes('attribution') ? 'blocked_or_pending' : 'unknown',
    });
    const provenanceNode = provenanceNodeForEntity('source_snapshot', sourceKey, family, sourceKey, item.path, {
      sourceManifestChecksumSha256: sha256(item.raw),
    });

    sourceFamilies.set(family, {
      sourceKey: family,
      name: family === 'qul' ? 'Quranic Universal Library resources' : family === 'tanzil' ? 'Tanzil resources' : family,
      domain: manifest.domain ?? family,
      provider: family === 'qul' ? 'TarteelAI / QUL' : family === 'tanzil' ? 'Tanzil Project' : 'RAFIQ manifest registry',
    });

    addNode(sources.nodes, baseNode({
      id: sourceNodeId,
      type: 'source',
      label: sourceFamilies.get(family).name,
      partition: 'sources',
      canonicalRef: { schema: 'ingest', table: 'source_registry', id: family },
      releaseState: 'public_blocked',
      reviewState: 'pending',
      qualityState: 'unverified',
      metadata: {
        sourceKey: family,
        name: sourceFamilies.get(family).name,
        provider: sourceFamilies.get(family).provider,
        domain: sourceFamilies.get(family).domain,
        authorityClassification: 'manifest_derived',
        activeState: 'active',
      },
    }));

    addNode(sources.nodes, baseNode({
      id: snapshotNodeId,
      type: 'source_snapshot',
      label: manifest.name ?? sourceKey,
      partition: 'sources',
      canonicalRef: { schema: 'ingest', table: 'source_snapshots', id: sourceKey },
      sourceRefs: [{ type: 'source_manifest', path: item.path }],
      provenanceRefs: [provenanceNode.id],
      releaseStateRefs: [releaseNode.id],
      releaseState: mapReleaseState(manifest.status),
      reviewState: mapReviewState(manifest.status),
      qualityState: mapQualityState(manifest),
      metadata: {
        sourceId: family,
        snapshotKey: sourceKey,
        versionLabel: manifest.version ?? manifest.dateAccessed ?? null,
        acquiredAt: manifest.dateAccessed ?? null,
        rightsStatus: String(manifest.status ?? '').includes('rights') ? 'blocked_or_pending' : 'unknown',
        attributionStatus: String(manifest.status ?? '').includes('attribution') ? 'blocked_or_pending' : 'unknown',
        technicalStatus: manifest.status ?? 'unknown',
        publicationStatus: mapReleaseState(manifest.status) === 'approved_public' ? 'public_candidate' : 'public_blocked',
        officialUrl: manifest.officialUrl ?? null,
        licenseUrl: manifest.licenseUrl ?? null,
        licenseName: manifest.licenseName ?? null,
        attribution: manifest.attribution ?? null,
        reviewer: manifest.reviewer ?? null,
        notes: manifest.notes ?? null,
      },
    }));

    addNode(sources.nodes, baseNode({
      id: manifestNodeId,
      type: 'source_manifest',
      label: item.file,
      partition: 'sources',
      canonicalRef: { schema: 'data', table: 'manifests', id: item.path },
      sourceRefs: [{ type: 'source_snapshot', id: snapshotNodeId }],
      provenanceRefs: [provenanceNode.id],
      releaseStateRefs: [releaseNode.id],
      releaseState: mapReleaseState(manifest.status),
      reviewState: mapReviewState(manifest.status),
      qualityState: mapQualityState(manifest),
      metadata: {
        sourceId: sourceKey,
        manifestPath: item.path,
        status: manifest.status ?? 'unknown',
        recordCountExpected: manifest.recordCountExpected ?? null,
        recordCountActual: manifest.recordCountActual ?? null,
        checksumSha256: sha256(item.raw),
        rawFilePath: manifest.rawFilePath ?? null,
      },
    }));

    if (manifest.rawFilePath || manifest.checksumSha256) {
      addNode(sources.nodes, baseNode({
        id: rawNodeId,
        type: 'raw_object',
        label: manifest.rawFilePath ?? `${sourceKey} raw object`,
        partition: 'sources',
        canonicalRef: { schema: 'ingest', table: 'raw_objects', id: `${sourceKey}:principal` },
        sourceRefs: [{ type: 'source_snapshot', id: snapshotNodeId }],
        provenanceRefs: [provenanceNode.id],
        releaseStateRefs: [releaseNode.id],
        releaseState: mapReleaseState(manifest.status),
        reviewState: mapReviewState(manifest.status),
        qualityState: mapQualityState(manifest),
        metadata: {
          snapshotId: sourceKey,
          objectRole: 'principal',
          logicalName: manifest.name ?? sourceKey,
          pathOrObjectKey: manifest.rawFilePath ?? null,
          checksumSha256: manifest.checksumSha256 ?? null,
          byteLength: null,
          mediaType: manifest.format ?? null,
          parseEligibility: 'manifest_registered',
        },
      }));
    }

    addNode(governance.nodes, releaseNode);
    addNode(governance.nodes, provenanceNode);

    addEdge(sources.edges, baseEdge({
      id: `edge:snapshot_of_source:${snapshotNodeId}:${sourceNodeId}:manifest`,
      type: 'snapshot_of_source',
      from: snapshotNodeId,
      to: sourceNodeId,
      fromPartition: 'sources',
      toPartition: 'sources',
      status: 'source_declared',
      sourceRefs: [{ type: 'source_manifest', path: item.path }],
    }));
    addEdge(sources.edges, baseEdge({
      id: `edge:source_manifest_describes_snapshot:${manifestNodeId}:${snapshotNodeId}:manifest`,
      type: 'source_manifest_describes_snapshot',
      from: manifestNodeId,
      to: snapshotNodeId,
      fromPartition: 'sources',
      toPartition: 'sources',
      status: 'source_declared',
      sourceRefs: [{ type: 'source_manifest', path: item.path }],
    }));
    if (manifest.rawFilePath || manifest.checksumSha256) {
      addEdge(sources.edges, baseEdge({
        id: `edge:snapshot_contains_raw_object:${snapshotNodeId}:${rawNodeId}:principal`,
        type: 'snapshot_contains_raw_object',
        from: snapshotNodeId,
        to: rawNodeId,
        fromPartition: 'sources',
        toPartition: 'sources',
        status: 'source_declared',
        sourceRefs: [{ type: 'source_manifest', path: item.path }],
      }));
    }
    for (const target of [snapshotNodeId, manifestNodeId, rawNodeId]) {
      if (!sources.nodes.has(target)) continue;
      addEdge(governance.edges, baseEdge({
        id: `edge:entity_has_release_state:${target}:${releaseNode.id}:manifest`,
        type: 'entity_has_release_state',
        from: target,
        to: releaseNode.id,
        fromPartition: 'sources',
        toPartition: 'governance',
        status: 'imported',
        sourceRefs: [{ type: 'source_manifest', path: item.path }],
        releaseState: releaseNode.releaseState,
        reviewState: releaseNode.reviewState,
      }));
      addEdge(governance.edges, baseEdge({
        id: `edge:entity_has_provenance:${target}:${provenanceNode.id}:manifest`,
        type: 'entity_has_provenance',
        from: target,
        to: provenanceNode.id,
        fromPartition: 'sources',
        toPartition: 'governance',
        status: 'imported',
        sourceRefs: [{ type: 'source_manifest', path: item.path }],
      }));
    }
  }

  for (const checksumFile of checksumFiles) {
    const checksumPath = path.join(CHECKSUM_DIR, checksumFile).replaceAll('\\', '/');
    const raw = await readFile(checksumPath, 'utf8');
    const rows = raw.split(/\r?\n/).filter((line) => line.trim().length > 0);
    addNode(sources.nodes, baseNode({
      id: `checksum_manifest:${safeId(checksumFile)}`,
      type: 'checksum_manifest',
      label: checksumFile,
      partition: 'sources',
      canonicalRef: { schema: 'data', table: 'checksums', id: checksumPath },
      releaseState: 'public_blocked',
      reviewState: 'pending',
      qualityState: 'clean',
      metadata: {
        path: checksumPath,
        checksumCount: rows.length,
        generatedAt: null,
        checksumSha256: sha256(raw),
      },
    }));
  }

  for (const row of hadithCategoryRows) {
    const id = `source:hadith-category:${safeId(row.category)}`;
    addNode(sources.nodes, baseNode({
      id,
      type: 'source',
      label: `Hadith ${row.category}`,
      partition: 'sources',
      canonicalRef: { schema: 'data', table: 'hadith_acquisition_category_summary', id: row.category },
      releaseState: 'public_blocked',
      reviewState: 'pending',
      qualityState: 'unverified',
      metadata: {
        sourceKey: `hadith-category:${row.category}`,
        name: `Hadith ${row.category}`,
        provider: 'RAFIQ hadith acquisition inventory',
        domain: 'hadith',
        authorityClassification: 'inventory_summary',
        activeState: 'active',
        resourceDirectories: Number(row.resource_directories || 0),
        fileCount: Number(row.file_count || 0),
        bytes: Number(row.bytes || 0),
      },
    }));
  }

  for (const row of hadithSubtreeRows.filter((item) => item.category === 'resource')) {
    const resourceKey = safeId(row.resource_path);
    const snapshotNodeId = `snapshot:hadith-resource:${resourceKey}`;
    const releaseNode = releaseNodeForEntity('source_snapshot', `hadith-resource:${resourceKey}`, 'private_acquisition_public_blocked', {
      rightsStatus: 'unresolved',
      attributionStatus: 'pending',
      publicationStatus: 'public_blocked',
    });
    const provenanceNode = provenanceNodeForEntity('source_snapshot', `hadith-resource:${resourceKey}`, 'hadith-acquisition', `hadith-resource:${resourceKey}`, 'data/manifests/hadith-raw-subtrees-2026-06-14.csv', {
      subtreeKey: row.subtree_key,
    });
    addNode(sources.nodes, baseNode({
      id: snapshotNodeId,
      type: 'source_snapshot',
      label: row.resource_path,
      partition: 'sources',
      canonicalRef: { schema: 'data', table: 'hadith_raw_subtrees', id: row.resource_path },
      provenanceRefs: [provenanceNode.id],
      releaseStateRefs: [releaseNode.id],
      releaseState: 'public_blocked',
      reviewState: 'pending',
      qualityState: 'unverified',
      metadata: {
        sourceId: 'hadith-acquisition',
        snapshotKey: `hadith-resource:${resourceKey}`,
        versionLabel: '2026-06-14 raw subtree inventory',
        acquiredAt: '2026-06-14',
        rightsStatus: 'unresolved',
        attributionStatus: 'pending',
        technicalStatus: 'inventoried',
        publicationStatus: 'public_blocked',
        resourcePath: row.resource_path,
        fileCount: Number(row.file_count || 0),
        byteLength: Number(row.bytes || 0),
        aggregateChecksumSha256: row.sha256 || null,
        roleCounts: row.role_counts || null,
      },
    }));
    addNode(governance.nodes, releaseNode);
    addNode(governance.nodes, provenanceNode);
    for (const govNode of [releaseNode, provenanceNode]) {
      addEdge(governance.edges, baseEdge({
        id: `edge:${govNode.type === 'entity_release_state' ? 'entity_has_release_state' : 'entity_has_provenance'}:${snapshotNodeId}:${govNode.id}:hadith-subtree`,
        type: govNode.type === 'entity_release_state' ? 'entity_has_release_state' : 'entity_has_provenance',
        from: snapshotNodeId,
        to: govNode.id,
        fromPartition: 'sources',
        toPartition: 'governance',
        status: 'imported',
        sourceRefs: [{ type: 'source_manifest', path: 'data/manifests/hadith-raw-subtrees-2026-06-14.csv' }],
      }));
    }
  }

  return { sources, governance };
}

function partitionObject(name, data, generatedAt) {
  const nodes = Array.from(data.nodes.values()).sort((a, b) => a.id.localeCompare(b.id));
  const edges = Array.from(data.edges.values()).sort((a, b) => a.id.localeCompare(b.id));
  return {
    schemaVersion: SCHEMA_VERSION,
    graphId: GRAPH_ID,
    partition: name,
    generatedAt,
    nodes,
    edges,
    stats: {
      nodeCount: nodes.length,
      edgeCount: edges.length,
      publicSafeNodeCount: nodes.filter((node) => node.publicSafe).length,
      publicSafeEdgeCount: edges.filter((edge) => edge.publicSafe).length,
    },
  };
}

function makeIndexes(partitions) {
  const nodes = partitions.flatMap((partition) => partition.nodes);
  const edges = partitions.flatMap((partition) => partition.edges);
  const byNodeId = Object.fromEntries(nodes.map((node) => [node.id, {
    id: node.id,
    type: node.type,
    partition: node.partition,
    label: node.label,
    accessLevel: node.accessLevel,
    publicSafe: node.publicSafe,
  }]));
  const byEdgeId = Object.fromEntries(edges.map((edge) => [edge.id, {
    id: edge.id,
    type: edge.type,
    partition: edge.fromPartition === edge.toPartition ? edge.fromPartition : `${edge.fromPartition}->${edge.toPartition}`,
    from: edge.from,
    to: edge.to,
    accessLevel: edge.accessLevel,
    publicSafe: edge.publicSafe,
  }]));
  const byCanonicalRef = {};
  const bySourceId = {};
  const bySnapshotId = {};
  const byReleaseState = {};
  const byReviewState = {};
  const byQualityState = {};
  const publicBoundary = {
    publicSafeNodeCount: 0,
    publicSafeEdgeCount: 0,
    publicSafeNodes: [],
    publicSafeEdges: [],
    blockerCategories: {
      publicBlocked: nodes.filter((node) => node.releaseState === 'public_blocked').length + edges.filter((edge) => edge.releaseState === 'public_blocked').length,
      privateOnly: nodes.length + edges.length,
      approvalMissing: nodes.filter((node) => node.reviewState === 'pending').length + edges.filter((edge) => edge.reviewState === 'pending').length,
    },
  };

  for (const node of nodes) {
    if (node.canonicalRef?.schema && node.canonicalRef?.table && node.canonicalRef?.id) {
      const key = `${node.canonicalRef.schema}.${node.canonicalRef.table}:${node.canonicalRef.id}`;
      byCanonicalRef[key] ??= [];
      byCanonicalRef[key].push(node.id);
    }
    if (node.type === 'source') bySourceId[node.metadata.sourceKey] = node.id;
    if (node.type === 'source_snapshot') bySnapshotId[node.metadata.snapshotKey] = node.id;
    byReleaseState[node.releaseState] ??= [];
    byReleaseState[node.releaseState].push(node.id);
    byReviewState[node.reviewState] ??= [];
    byReviewState[node.reviewState].push(node.id);
    byQualityState[node.qualityState] ??= [];
    byQualityState[node.qualityState].push(node.id);
  }

  return {
    'by-node-id.json': byNodeId,
    'by-edge-id.json': byEdgeId,
    'by-canonical-ref.json': byCanonicalRef,
    'by-source-id.json': bySourceId,
    'by-snapshot-id.json': bySnapshotId,
    'by-release-state.json': byReleaseState,
    'by-review-state.json': byReviewState,
    'by-quality-state.json': byQualityState,
    'public-boundary.json': publicBoundary,
  };
}

async function writeJson(filePath, value) {
  const body = `${JSON.stringify(value, null, 2)}\n`;
  await writeFile(filePath, body, 'utf8');
  return sha256(body);
}

async function main() {
  const generatedAt = new Date().toISOString();
  await mkdir(PARTITION_DIR, { recursive: true });
  await mkdir(INDEX_DIR, { recursive: true });

  const graph = await buildGraph();
  const partitions = [
    partitionObject('sources', graph.sources, generatedAt),
    partitionObject('governance', graph.governance, generatedAt),
  ];

  const partitionDescriptors = [];
  for (const partition of partitions) {
    const outPath = path.join(PARTITION_DIR, `${partition.partition}.json`);
    const checksumSha256 = await writeJson(outPath, partition);
    partitionDescriptors.push({
      name: partition.partition,
      path: `partitions/${partition.partition}.json`,
      nodeCount: partition.stats.nodeCount,
      edgeCount: partition.stats.edgeCount,
      checksumSha256,
      publicSafeNodeCount: partition.stats.publicSafeNodeCount,
      publicSafeEdgeCount: partition.stats.publicSafeEdgeCount,
    });
  }

  const indexes = makeIndexes(partitions);
  const indexDescriptors = [];
  for (const [file, value] of Object.entries(indexes)) {
    const outPath = path.join(INDEX_DIR, file);
    const checksumSha256 = await writeJson(outPath, value);
    indexDescriptors.push({
      name: file.replace(/\.json$/, ''),
      path: `indexes/${file}`,
      checksumSha256,
      entryCount: Array.isArray(value) ? value.length : Object.keys(value).length,
    });
  }

  const counts = {
    totalNodes: partitions.reduce((sum, partition) => sum + partition.stats.nodeCount, 0),
    totalEdges: partitions.reduce((sum, partition) => sum + partition.stats.edgeCount, 0),
    partitions: partitions.length,
    indexes: indexDescriptors.length,
    publicSafeNodes: 0,
    publicSafeEdges: 0,
  };

  const manifest = {
    schemaVersion: SCHEMA_VERSION,
    contractVersion: CONTRACT_VERSION,
    graphId: GRAPH_ID,
    graphKind: 'resource_graph',
    scope: 'CP22-G03 source, provenance, and release backbone from checked-in RAFIQ manifests and inventory files.',
    environment: 'private_local',
    deploymentMode: 'private_local',
    sourceDatabaseSnapshot: 'checked-in-manifest-backbone-no-live-db',
    exportedAt: generatedAt,
    exportedBy: 'scripts/generate_cp22_source_governance_graph.mjs',
    accessLevel: ACCESS_LEVEL,
    publicSafe: false,
    partitions: partitionDescriptors.sort((a, b) => a.name.localeCompare(b.name)),
    indexes: indexDescriptors.sort((a, b) => a.name.localeCompare(b.name)),
    sourceInputs: [
      'data/manifests/*.json',
      'data/manifests/hadith-acquisition-category-summary-2026-06-14.csv',
      'data/manifests/hadith-raw-subtrees-2026-06-14.csv',
      'data/checksums/*',
      'docs/09_sprints/resource_audit_import_prototype/CP22_G02_GRAPH_SCHEMA_EXPANSION_AND_PARTITION_PLAN.md',
    ],
    counts,
    checksums: {
      partitionChecksums: Object.fromEntries(partitionDescriptors.map((item) => [item.name, item.checksumSha256])),
      indexChecksums: Object.fromEntries(indexDescriptors.map((item) => [item.name, item.checksumSha256])),
    },
    warnings: [
      'CP22-G03 exports only the source/governance backbone.',
      'Live database content.entity_provenance and content.entity_release_states rows are not exported because no safe DB snapshot input was provided.',
      'All artifacts are private and publicSafe=false.',
      'Hadith raw object inventory is summarized by subtree, not expanded to every raw object row, to keep CP22-G03 as a backbone checkpoint.',
    ],
  };
  manifest.checksums.graphChecksumSha256 = sha256(stableJson({
    schemaVersion: manifest.schemaVersion,
    graphId: manifest.graphId,
    partitions: manifest.partitions,
    indexes: manifest.indexes,
    sourceInputs: manifest.sourceInputs,
  }));

  const summary = {
    schemaVersion: SCHEMA_VERSION,
    graphId: GRAPH_ID,
    checkpoint: 'CP22-G03',
    status: 'generated',
    generatedAt,
    counts,
    partitionCounts: Object.fromEntries(partitionDescriptors.map((item) => [item.name, { nodes: item.nodeCount, edges: item.edgeCount }])),
    publicBoundary: indexes['public-boundary.json'],
    next: 'CP22-G04 must not start until this backbone verifier passes.',
  };

  await writeJson(path.join(OUT_DIR, 'manifest.json'), manifest);
  await writeJson(path.join(OUT_DIR, 'summary.json'), summary);

  console.log(JSON.stringify({
    status: 'pass',
    checkpoint: 'CP22-G03',
    outputDir: OUT_DIR,
    counts,
  }, null, 2));
}

await main();
