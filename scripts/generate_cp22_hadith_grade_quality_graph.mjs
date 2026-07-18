import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const GRAPH_ID = 'rafiq-full-private-resource-graph';
const SCHEMA_VERSION = 'cp22.full-private.v1';
const CONTRACT_VERSION = 'RAFIQ_KNOWLEDGE_GRAPHIFY_GRAPH_CONTRACT_V1+CP22-G05';
const ACCESS_LEVEL = 'developer_private';
const OUT_DIR = 'data/graphify/full-private';
const PARTITION_DIR = path.join(OUT_DIR, 'partitions');
const INDEX_DIR = path.join(OUT_DIR, 'indexes');
const MANIFEST_DIR = 'data/manifests';

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
  return String(value ?? 'unknown').trim().toLowerCase().replace(/[^a-z0-9:_\-.]+/g, '_').replace(/^_+|_+$/g, '') || 'unknown';
}

function title(value) {
  return String(value ?? 'unknown').split(/[\/_\-.]+/).filter(Boolean).map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`).join(' ');
}

function parseCsv(raw) {
  const rows = [];
  let field = '';
  let row = [];
  let quoted = false;
  for (let index = 0; index < raw.length; index += 1) {
    const char = raw[index];
    const next = raw[index + 1];
    if (quoted && char === '"' && next === '"') {
      field += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (!quoted && char === ',') {
      row.push(field);
      field = '';
    } else if (!quoted && (char === '\n' || char === '\r')) {
      if (char === '\r' && next === '\n') index += 1;
      row.push(field);
      if (row.some((item) => item.length > 0)) rows.push(row);
      field = '';
      row = [];
    } else {
      field += char;
    }
  }
  row.push(field);
  if (row.some((item) => item.length > 0)) rows.push(row);
  const [headers, ...body] = rows;
  const cleanHeaders = headers.map((header) => header.replace(/^\uFEFF/, ''));
  return body.map((items) => Object.fromEntries(cleanHeaders.map((header, index) => [header, items[index] ?? ''])));
}

async function readCsv(filePath) {
  return parseCsv(await readFile(filePath, 'utf8'));
}

function partition(name) {
  return { name, nodes: new Map(), edges: new Map() };
}

function addNode(map, node) {
  if (!map.has(node.id)) map.set(node.id, node);
}

function addEdge(map, edge) {
  if (!map.has(edge.id)) map.set(edge.id, edge);
}

function resourceKeyFromPath(value) {
  return String(value ?? '').replace(/^data\/raw\/hadith\//, '');
}

function categoryFromResourceKey(resourceKey) {
  return resourceKey.split('/')[0] || 'unknown';
}

function sourceRefs(resourceKey) {
  return [
    { type: 'source', id: `source:hadith-category:${safeId(categoryFromResourceKey(resourceKey))}` },
    { type: 'source_snapshot', id: `snapshot:hadith-resource:${safeId(resourceKey)}` },
  ];
}

function provenanceRef(resourceKey) {
  return `provenance:source_snapshot:hadith-resource:${safeId(resourceKey)}:manifest`;
}

function releaseRef(resourceKey) {
  return `release_state:source_snapshot:hadith-resource:${safeId(resourceKey)}:manifest`;
}

function releaseStateForResource(resourceKey) {
  return categoryFromResourceKey(resourceKey) === 'quarantined' ? 'private_blocked' : 'public_blocked';
}

function reviewStateForResource(resourceKey) {
  const category = categoryFromResourceKey(resourceKey);
  if (category === 'official') return 'content_review';
  if (category === 'verification') return 'technical_review';
  if (category === 'quarantined') return 'rejected';
  return 'pending';
}

function qualityStateForResource(resourceKey, roleCounts = {}) {
  const category = categoryFromResourceKey(resourceKey);
  if (category === 'quarantined') return 'withheld';
  if (category === 'research' || category === 'verification' || Number(roleCounts.payload_unselected ?? 0) > 0) return 'warning';
  return 'unverified';
}

function baseNode({ id, type, label, partition: partitionName, canonicalRef, sourceRefs: refs = [], provenanceRefs = [], releaseStateRefs = [], releaseState = 'public_blocked', reviewState = 'pending', qualityState = 'unverified', metadata = {} }) {
  return { id, type, label, partition: partitionName, canonicalRef, sourceRefs: refs, provenanceRefs, releaseStateRefs, releaseState, reviewState, qualityState, accessLevel: ACCESS_LEVEL, publicSafe: false, metadata };
}

function baseEdge({ id, type, from, to, fromPartition, toPartition, status = 'imported', confidence = null, sourceRefs: refs = [], evidenceRefs = [], releaseState = 'public_blocked', reviewState = 'pending', metadata = {} }) {
  return { id, type, from, to, fromPartition, toPartition, status, confidence, sourceRefs: refs, evidenceRefs, releaseState, reviewState, accessLevel: ACCESS_LEVEL, publicSafe: false, metadata };
}

function roleCounts(row) {
  try {
    return JSON.parse(row.role_counts_json || '{}');
  } catch {
    return {};
  }
}

function parentResourceKey(groupKey, resourceRows) {
  const match = resourceRows
    .map((row) => row.group_key)
    .filter((resourceKey) => groupKey === resourceKey || groupKey.startsWith(`${resourceKey}/`))
    .sort((a, b) => b.length - a.length)[0];
  return match ?? groupKey.split('/').slice(0, 2).join('/');
}

function addHadithResources(hadith, subtreeRows, resourceRows) {
  for (const row of resourceRows) {
    const resourceKey = row.group_key;
    const key = safeId(resourceKey);
    const collectionId = `hadith_collection:${key}`;
    const editionId = `hadith_edition:${key}:inventory`;
    const releaseState = releaseStateForResource(resourceKey);
    const reviewState = reviewStateForResource(resourceKey);
    const qualityState = qualityStateForResource(resourceKey, roleCounts(row));
    const refs = sourceRefs(resourceKey);

    addNode(hadith.nodes, baseNode({
      id: collectionId,
      type: 'hadith_collection',
      label: title(resourceKey),
      partition: 'hadith',
      canonicalRef: { schema: 'data', table: 'hadith_raw_subtrees', id: resourceKey },
      sourceRefs: refs,
      provenanceRefs: [provenanceRef(resourceKey)],
      releaseStateRefs: [releaseRef(resourceKey)],
      releaseState,
      reviewState,
      qualityState,
      metadata: {
        collectionKey: key,
        displayName: title(resourceKey),
        sourceId: `hadith-resource:${key}`,
        languageScope: inferLanguageScope(resourceKey),
        category: categoryFromResourceKey(resourceKey),
        fileCount: Number(row.file_count || 0),
        bytes: Number(row.bytes || 0),
        aggregateSha256: row.aggregate_sha256 || null,
        recordLevelExport: false,
      },
    }));

    addNode(hadith.nodes, baseNode({
      id: editionId,
      type: 'hadith_edition',
      label: `${title(resourceKey)} inventory edition`,
      partition: 'hadith',
      canonicalRef: { schema: 'data', table: 'hadith_raw_subtrees', id: `${resourceKey}:inventory` },
      sourceRefs: refs,
      provenanceRefs: [provenanceRef(resourceKey)],
      releaseStateRefs: [releaseRef(resourceKey)],
      releaseState,
      reviewState,
      qualityState,
      metadata: {
        editionKey: `${key}:inventory`,
        collectionId: key,
        sourceSnapshotId: `hadith-resource:${key}`,
        languageCode: inferLanguageScope(resourceKey),
        aggregateOnly: true,
      },
    }));

    addEdge(hadith.edges, baseEdge({
      id: `edge:hadith_collection_has_edition:${collectionId}:${editionId}:inventory`,
      type: 'hadith_collection_has_edition',
      from: collectionId,
      to: editionId,
      fromPartition: 'hadith',
      toPartition: 'hadith',
      sourceRefs: refs,
      releaseState,
      reviewState,
    }));
  }

  for (const row of subtreeRows.filter((item) => item.level === 'subtree')) {
    const counts = roleCounts(row);
    if (Number(counts.principal ?? 0) < 1) continue;
    const groupKey = row.group_key;
    const resourceKey = parentResourceKey(groupKey, resourceRows);
    const key = safeId(groupKey);
    const resourceId = safeId(resourceKey);
    const editionId = `hadith_edition:${resourceId}:inventory`;
    const bookId = `hadith_book:${key}`;
    const chapterId = `hadith_chapter:${key}:aggregate`;
    const recordId = `hadith_record:${key}:aggregate`;
    const textId = `hadith_text:${key}:aggregate`;
    const referenceId = `hadith_reference:${key}:aggregate`;
    const releaseState = releaseStateForResource(resourceKey);
    const reviewState = reviewStateForResource(resourceKey);
    const qualityState = qualityStateForResource(resourceKey, counts);
    const refs = sourceRefs(resourceKey);

    addNode(hadith.nodes, baseNode({
      id: bookId,
      type: 'hadith_book',
      label: title(groupKey),
      partition: 'hadith',
      canonicalRef: { schema: 'data', table: 'hadith_raw_subtrees', id: groupKey },
      sourceRefs: refs,
      provenanceRefs: [provenanceRef(resourceKey)],
      releaseStateRefs: [releaseRef(resourceKey)],
      releaseState,
      reviewState,
      qualityState,
      metadata: { editionId: resourceId, sourceBookKey: key, bookNumber: null, title: title(groupKey), aggregateOnly: true, principalFileCount: Number(counts.principal ?? 0) },
    }));
    addNode(hadith.nodes, baseNode({
      id: chapterId,
      type: 'hadith_chapter',
      label: `${title(groupKey)} aggregate chapter`,
      partition: 'hadith',
      canonicalRef: { schema: 'data', table: 'hadith_raw_subtrees', id: `${groupKey}:chapter` },
      sourceRefs: refs,
      provenanceRefs: [provenanceRef(resourceKey)],
      releaseStateRefs: [releaseRef(resourceKey)],
      releaseState,
      reviewState,
      qualityState,
      metadata: { bookId: key, sourceChapterKey: `${key}:aggregate`, chapterNumber: null, title: 'Aggregate subtree placeholder', aggregateOnly: true },
    }));
    addNode(hadith.nodes, baseNode({
      id: recordId,
      type: 'hadith_record',
      label: `${title(groupKey)} aggregate record`,
      partition: 'hadith',
      canonicalRef: { schema: 'data', table: 'hadith_raw_subtrees', id: `${groupKey}:record` },
      sourceRefs: refs,
      provenanceRefs: [provenanceRef(resourceKey)],
      releaseStateRefs: [releaseRef(resourceKey)],
      releaseState,
      reviewState,
      qualityState,
      metadata: { editionId: resourceId, sourceHadithKey: `${key}:aggregate`, sourceHadithNumber: null, printedReference: groupKey, aggregateOnly: true, representedPrincipalFiles: Number(counts.principal ?? 0), representedBytes: Number(row.bytes || 0) },
    }));
    addNode(hadith.nodes, baseNode({
      id: textId,
      type: 'hadith_text_version',
      label: `${title(groupKey)} aggregate text version`,
      partition: 'hadith',
      canonicalRef: { schema: 'data', table: 'hadith_raw_subtrees', id: `${groupKey}:text` },
      sourceRefs: refs,
      provenanceRefs: [provenanceRef(resourceKey)],
      releaseStateRefs: [releaseRef(resourceKey)],
      releaseState,
      reviewState,
      qualityState,
      metadata: { hadithRecordId: recordId, languageCode: inferLanguageScope(groupKey), textType: 'aggregate_placeholder', translatorName: null, qualityState, rawTextExported: false },
    }));
    addNode(hadith.nodes, baseNode({
      id: referenceId,
      type: 'hadith_reference',
      label: `${title(groupKey)} inventory reference`,
      partition: 'hadith',
      canonicalRef: { schema: 'data', table: 'hadith_raw_subtrees', id: `${groupKey}:reference` },
      sourceRefs: refs,
      provenanceRefs: [provenanceRef(resourceKey)],
      releaseStateRefs: [releaseRef(resourceKey)],
      releaseState,
      reviewState,
      qualityState,
      metadata: { hadithRecordId: recordId, referenceType: 'raw_subtree_inventory', referenceValue: groupKey, sourceQualified: true },
    }));

    for (const edge of [
      ['hadith_edition_has_book', editionId, bookId, 'hadith', 'hadith'],
      ['hadith_book_has_chapter', bookId, chapterId, 'hadith', 'hadith'],
      ['hadith_chapter_has_record', chapterId, recordId, 'hadith', 'hadith'],
      ['hadith_edition_has_record', editionId, recordId, 'hadith', 'hadith'],
      ['hadith_has_text_version', recordId, textId, 'hadith', 'hadith'],
      ['hadith_has_reference', recordId, referenceId, 'hadith', 'hadith'],
    ]) {
      addEdge(hadith.edges, baseEdge({
        id: `edge:${edge[0]}:${edge[1]}:${edge[2]}:inventory`,
        type: edge[0],
        from: edge[1],
        to: edge[2],
        fromPartition: edge[3],
        toPartition: edge[4],
        sourceRefs: refs,
        releaseState,
        reviewState,
      }));
    }
  }
}

function inferLanguageScope(value) {
  const raw = String(value).toLowerCase();
  if (raw.includes('multilingual')) return 'multi';
  if (raw.includes('/ara-') || raw.includes('arabic') || raw.includes('-ar-')) return 'ar';
  if (raw.includes('/eng-') || raw.includes('english') || raw.includes('-en-')) return 'en';
  if (raw.includes('/ben-')) return 'bn';
  if (raw.includes('/ind-')) return 'id';
  if (raw.includes('/tur-')) return 'tr';
  if (raw.includes('/urd-')) return 'ur';
  return 'unknown';
}

function addGradeAndVerification(hadithGrades, hadith, subtreeRows, resourceRows) {
  const recordIds = new Set(hadith.nodes.keys());
  const gradeRows = subtreeRows.filter((row) => row.level === 'subtree' && row.group_key.includes('fawaz-hadith-api-v1') && Number(roleCounts(row).principal ?? 0) > 0);
  for (const row of gradeRows) {
    const resourceKey = parentResourceKey(row.group_key, resourceRows);
    const groupKey = row.group_key;
    const key = safeId(groupKey);
    const recordId = `hadith_record:${key}:aggregate`;
    if (!recordIds.has(recordId)) continue;
    const assertionId = `grade_assertion:${key}:aggregate`;
    const normalizationId = `grade_normalization:${key}:aggregate`;
    const refs = sourceRefs(resourceKey);
    addNode(hadithGrades.nodes, baseNode({
      id: assertionId,
      type: 'hadith_grade_assertion',
      label: `${title(groupKey)} source grade assertion`,
      partition: 'hadith-grades',
      canonicalRef: { schema: 'data', table: 'hadith_raw_subtrees', id: `${groupKey}:grade` },
      sourceRefs: refs,
      provenanceRefs: [provenanceRef(resourceKey)],
      releaseStateRefs: [releaseRef(resourceKey)],
      releaseState: releaseStateForResource(resourceKey),
      reviewState: 'content_review',
      qualityState: 'warning',
      metadata: { hadithRecordId: recordId, sourceSnapshotId: `hadith-resource:${safeId(resourceKey)}`, graderNameRaw: 'source dataset', rawGrade: null, claimScope: 'aggregate_subtree_grade_capable', rawGradeExported: false },
    }));
    addNode(hadithGrades.nodes, baseNode({
      id: normalizationId,
      type: 'hadith_grade_normalization',
      label: `${title(groupKey)} grade normalization placeholder`,
      partition: 'hadith-grades',
      canonicalRef: { schema: 'data', table: 'hadith_raw_subtrees', id: `${groupKey}:grade-normalization` },
      sourceRefs: refs,
      provenanceRefs: [provenanceRef(resourceKey)],
      releaseStateRefs: [releaseRef(resourceKey)],
      releaseState: releaseStateForResource(resourceKey),
      reviewState: 'content_review',
      qualityState: 'warning',
      metadata: { assertionId, normalizedGrade: 'source_qualified_unexpanded', normalizationVersion: 'cp22-g05-aggregate', reviewStatus: 'requires_record_level_snapshot' },
    }));
    addEdge(hadithGrades.edges, baseEdge({
      id: `edge:hadith_has_grade_assertion:${recordId}:${assertionId}:aggregate`,
      type: 'hadith_has_grade_assertion',
      from: recordId,
      to: assertionId,
      fromPartition: 'hadith',
      toPartition: 'hadith-grades',
      sourceRefs: refs,
      releaseState: releaseStateForResource(resourceKey),
      reviewState: 'content_review',
    }));
    addEdge(hadithGrades.edges, baseEdge({
      id: `edge:grade_assertion_has_normalization:${assertionId}:${normalizationId}:aggregate`,
      type: 'grade_assertion_has_normalization',
      from: assertionId,
      to: normalizationId,
      fromPartition: 'hadith-grades',
      toPartition: 'hadith-grades',
      sourceRefs: refs,
      releaseState: releaseStateForResource(resourceKey),
      reviewState: 'content_review',
    }));
  }

  for (const row of resourceRows.filter((item) => categoryFromResourceKey(item.group_key) === 'verification')) {
    const resourceKey = row.group_key;
    const key = safeId(resourceKey);
    const claimId = `verification_claim:${key}:inventory`;
    const referenceId = `verification_reference:${key}:inventory`;
    const refs = sourceRefs(resourceKey);
    addNode(hadithGrades.nodes, baseNode({
      id: claimId,
      type: 'hadith_verification_claim',
      label: `${title(resourceKey)} verification source`,
      partition: 'hadith-grades',
      canonicalRef: { schema: 'data', table: 'hadith_raw_subtrees', id: `${resourceKey}:verification` },
      sourceRefs: refs,
      provenanceRefs: [provenanceRef(resourceKey)],
      releaseStateRefs: [releaseRef(resourceKey)],
      releaseState: 'public_blocked',
      reviewState: 'technical_review',
      qualityState: 'warning',
      metadata: { hadithRecordId: null, sourceSnapshotId: `hadith-resource:${key}`, claimText: null, rawConclusion: 'verification_source_inventory_only', claimScope: 'source_inventory', reviewStatus: 'requires_per_record_export' },
    }));
    addNode(hadithGrades.nodes, baseNode({
      id: referenceId,
      type: 'hadith_verification_reference',
      label: `${title(resourceKey)} verification reference`,
      partition: 'hadith-grades',
      canonicalRef: { schema: 'data', table: 'hadith_raw_subtrees', id: `${resourceKey}:verification-reference` },
      sourceRefs: refs,
      provenanceRefs: [provenanceRef(resourceKey)],
      releaseStateRefs: [releaseRef(resourceKey)],
      releaseState: 'public_blocked',
      reviewState: 'technical_review',
      qualityState: 'warning',
      metadata: { claimId, referenceText: resourceKey, referenceUrl: null, sourceLabel: title(resourceKey) },
    }));
    addEdge(hadithGrades.edges, baseEdge({
      id: `edge:verification_claim_has_reference:${claimId}:${referenceId}:inventory`,
      type: 'verification_claim_has_reference',
      from: claimId,
      to: referenceId,
      fromPartition: 'hadith-grades',
      toPartition: 'hadith-grades',
      sourceRefs: refs,
      releaseState: 'public_blocked',
      reviewState: 'technical_review',
    }));
  }
}

function addQuality(quality, hadith, hadithGrades, categoryRows, resourceRows, subtreeRows) {
  const targetIds = new Set([...hadith.nodes.keys(), ...hadithGrades.nodes.keys()]);
  const addFinding = ({ id, label, targetId, targetType, severity, code, resolutionStatus, metadata, resourceKey }) => {
    const findingId = `quality_finding:${safeId(id)}`;
    const refs = sourceRefs(resourceKey ?? 'hadith/acquisition');
    addNode(quality.nodes, baseNode({
      id: findingId,
      type: 'validation_finding',
      label,
      partition: 'quality',
      canonicalRef: { schema: 'data', table: 'hadith_quality_inventory', id },
      sourceRefs: refs,
      provenanceRefs: [provenanceRef(resourceKey ?? 'hadith/acquisition')],
      releaseStateRefs: [releaseRef(resourceKey ?? 'hadith/acquisition')],
      releaseState: resourceKey ? releaseStateForResource(resourceKey) : 'public_blocked',
      reviewState: 'technical_review',
      qualityState: severity === 'withheld' ? 'withheld' : 'warning',
      metadata: { targetType, targetId, findingCode: code, severity, resolutionStatus, ...metadata },
    }));
    if (targetIds.has(targetId)) {
      addEdge(quality.edges, baseEdge({
        id: `edge:entity_has_quality_finding:${targetId}:${findingId}:cp22-g05`,
        type: 'entity_has_quality_finding',
        from: targetId,
        to: findingId,
        fromPartition: targetId.startsWith('verification_') || targetId.startsWith('grade_') ? 'hadith-grades' : 'hadith',
        toPartition: 'quality',
        status: 'technical_verified',
        sourceRefs: refs,
        releaseState: resourceKey ? releaseStateForResource(resourceKey) : 'public_blocked',
        reviewState: 'technical_review',
      }));
    }
  };

  for (const row of categoryRows) {
    const targetId = `hadith_collection:${safeId(row.category)}:category-summary`;
    addFinding({
      id: `category:${row.category}`,
      label: `Hadith ${row.category} acquisition category finding`,
      targetId,
      targetType: 'hadith_acquisition_category',
      severity: row.category === 'quarantined' ? 'withheld' : 'warning',
      code: 'hadith_category_inventory_status',
      resolutionStatus: 'open',
      resourceKey: `hadith/${row.category}`,
      metadata: { category: row.category, resourceDirectories: Number(row.resource_directories || 0), fileCount: Number(row.file_count || 0), bytes: Number(row.bytes || 0) },
    });
  }

  for (const row of resourceRows) {
    const resourceKey = row.group_key;
    const category = categoryFromResourceKey(resourceKey);
    if (!['quarantined', 'research', 'verification', 'official'].includes(category)) continue;
    addFinding({
      id: `resource:${resourceKey}`,
      label: `${title(resourceKey)} governance finding`,
      targetId: `hadith_collection:${safeId(resourceKey)}`,
      targetType: 'hadith_collection',
      severity: category === 'quarantined' ? 'withheld' : 'warning',
      code: `hadith_${category}_source_boundary`,
      resolutionStatus: category === 'official' ? 'review_required' : 'open',
      resourceKey,
      metadata: { category, fileCount: Number(row.file_count || 0), bytes: Number(row.bytes || 0), aggregateSha256: row.aggregate_sha256 || null },
    });
  }

  for (const row of subtreeRows.filter((item) => item.level === 'subtree')) {
    const counts = roleCounts(row);
    if (Number(counts.payload_unselected ?? 0) < 1) continue;
    const resourceKey = parentResourceKey(row.group_key, resourceRows);
    addFinding({
      id: `payload-unselected:${row.group_key}`,
      label: `${title(row.group_key)} payload unselected finding`,
      targetId: `hadith_record:${safeId(row.group_key)}:aggregate`,
      targetType: 'hadith_record',
      severity: 'warning',
      code: 'payload_unselected_in_raw_inventory',
      resolutionStatus: 'requires_parser_review',
      resourceKey,
      metadata: { groupKey: row.group_key, roleCounts: counts, aggregateSha256: row.aggregate_sha256 || null },
    });
  }

  addNode(quality.nodes, baseNode({
    id: 'transformation:cp22-g05-hadith-aggregate-export',
    type: 'transformation_event',
    label: 'CP22-G05 hadith aggregate graph export',
    partition: 'quality',
    canonicalRef: { schema: 'scripts', table: 'exporters', id: 'generate_cp22_hadith_grade_quality_graph.mjs' },
    sourceRefs: [{ type: 'source_manifest', path: 'data/manifests/hadith-raw-subtrees-2026-06-14.csv' }],
    provenanceRefs: ['provenance:source_snapshot:hadith-acquisition:manifest'],
    releaseStateRefs: ['release_state:source_snapshot:hadith-acquisition:manifest'],
    releaseState: 'public_blocked',
    reviewState: 'technical_review',
    qualityState: 'warning',
    metadata: { eventType: 'aggregate_graph_export', importRunId: null, method: 'manifest_backed_projection', version: 'CP22-G05', scope: 'hadith_grade_verification_quality' },
  }));
}

function partitionObject(partitionData, generatedAt) {
  const nodes = Array.from(partitionData.nodes.values()).sort((a, b) => a.id.localeCompare(b.id));
  const edges = Array.from(partitionData.edges.values()).sort((a, b) => a.id.localeCompare(b.id));
  return {
    schemaVersion: SCHEMA_VERSION,
    graphId: GRAPH_ID,
    partition: partitionData.name,
    generatedAt,
    nodes,
    edges,
    stats: {
      nodeCount: nodes.length,
      edgeCount: edges.length,
      publicSafeNodeCount: 0,
      publicSafeEdgeCount: 0,
    },
  };
}

async function readExistingPartitions() {
  const names = ['sources', 'governance', 'quran', 'translations', 'tafsir', 'topics'];
  const partitions = [];
  for (const name of names) {
    partitions.push(JSON.parse(await readFile(path.join(PARTITION_DIR, `${name}.json`), 'utf8')));
  }
  return partitions;
}

function makeIndexes(partitions) {
  const nodes = partitions.flatMap((item) => item.nodes);
  const edges = partitions.flatMap((item) => item.edges);
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const byNodeId = Object.fromEntries(nodes.map((node) => [node.id, { id: node.id, type: node.type, partition: node.partition, label: node.label, accessLevel: node.accessLevel, publicSafe: node.publicSafe }]));
  const byEdgeId = Object.fromEntries(edges.map((edge) => [edge.id, { id: edge.id, type: edge.type, partition: edge.fromPartition === edge.toPartition ? edge.fromPartition : `${edge.fromPartition}->${edge.toPartition}`, from: edge.from, to: edge.to, accessLevel: edge.accessLevel, publicSafe: edge.publicSafe }]));
  const byCanonicalRef = {};
  const bySourceId = {};
  const bySnapshotId = {};
  const byAyahKey = {};
  const byHadithKey = {};
  const byTopicKey = {};
  const byReleaseState = {};
  const byReviewState = {};
  const byQualityState = {};

  for (const node of nodes) {
    if (node.canonicalRef?.schema && node.canonicalRef?.table && node.canonicalRef?.id) {
      const key = `${node.canonicalRef.schema}.${node.canonicalRef.table}:${node.canonicalRef.id}`;
      byCanonicalRef[key] ??= [];
      byCanonicalRef[key].push(node.id);
    }
    if (node.type === 'source') bySourceId[node.metadata.sourceKey] = node.id;
    if (node.type === 'source_snapshot') bySnapshotId[node.metadata.snapshotKey] = node.id;
    if (node.type === 'quran_ayah') byAyahKey[node.metadata.verseKey] = { ayahNodeId: node.id, translations: [], tafsir: [], topics: [] };
    if (node.type === 'hadith_record') byHadithKey[node.metadata.sourceHadithKey] = { hadithNodeId: node.id, textVersions: [], references: [], gradeAssertions: [], verificationClaims: [], qualityFindings: [] };
    if (node.type === 'source_topic' || node.type === 'rafiq_theme' || node.type === 'source_ayah_theme_group') byTopicKey[node.id] = { id: node.id, type: node.type, partition: node.partition, label: node.label, publicSafe: node.publicSafe };
    byReleaseState[node.releaseState] ??= [];
    byReleaseState[node.releaseState].push(node.id);
    byReviewState[node.reviewState] ??= [];
    byReviewState[node.reviewState].push(node.id);
    byQualityState[node.qualityState] ??= [];
    byQualityState[node.qualityState].push(node.id);
  }

  for (const edge of edges) {
    if (edge.type === 'ayah_has_translation') {
      const ayah = nodeById.get(edge.from);
      if (ayah?.metadata?.verseKey && byAyahKey[ayah.metadata.verseKey]) byAyahKey[ayah.metadata.verseKey].translations.push(edge.to);
    }
    if (edge.type === 'tafsir_explains_ayah') {
      const ayah = nodeById.get(edge.to);
      if (ayah?.metadata?.verseKey && byAyahKey[ayah.metadata.verseKey]) byAyahKey[ayah.metadata.verseKey].tafsir.push(edge.from);
    }
    if (edge.type === 'hadith_has_text_version' || edge.type === 'hadith_has_reference' || edge.type === 'hadith_has_grade_assertion' || edge.type === 'hadith_has_verification_claim' || edge.type === 'entity_has_quality_finding') {
      const record = nodeById.get(edge.from);
      const key = record?.metadata?.sourceHadithKey;
      if (!key || !byHadithKey[key]) continue;
      if (edge.type === 'hadith_has_text_version') byHadithKey[key].textVersions.push(edge.to);
      if (edge.type === 'hadith_has_reference') byHadithKey[key].references.push(edge.to);
      if (edge.type === 'hadith_has_grade_assertion') byHadithKey[key].gradeAssertions.push(edge.to);
      if (edge.type === 'hadith_has_verification_claim') byHadithKey[key].verificationClaims.push(edge.to);
      if (edge.type === 'entity_has_quality_finding') byHadithKey[key].qualityFindings.push(edge.to);
    }
  }

  return {
    'by-node-id.json': byNodeId,
    'by-edge-id.json': byEdgeId,
    'by-canonical-ref.json': byCanonicalRef,
    'by-source-id.json': bySourceId,
    'by-snapshot-id.json': bySnapshotId,
    'by-ayah-key.json': byAyahKey,
    'by-hadith-key.json': byHadithKey,
    'by-topic-key.json': byTopicKey,
    'by-release-state.json': byReleaseState,
    'by-review-state.json': byReviewState,
    'by-quality-state.json': byQualityState,
    'public-boundary.json': {
      publicSafeNodeCount: 0,
      publicSafeEdgeCount: 0,
      publicSafeNodes: [],
      publicSafeEdges: [],
      blockerCategories: {
        publicBlocked: nodes.filter((node) => node.releaseState === 'public_blocked').length + edges.filter((edge) => edge.releaseState === 'public_blocked').length,
        privateOnly: nodes.length + edges.length,
        approvalMissing: nodes.filter((node) => ['pending', 'technical_review', 'content_review'].includes(node.reviewState)).length + edges.filter((edge) => ['pending', 'technical_review', 'content_review'].includes(edge.reviewState)).length,
        withheld: nodes.filter((node) => node.releaseState === 'private_blocked' || node.qualityState === 'withheld').length + edges.filter((edge) => edge.releaseState === 'private_blocked').length,
      },
    },
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

  const categoryRows = await readCsv(path.join(MANIFEST_DIR, 'hadith-acquisition-category-summary-2026-06-14.csv'));
  const resourceRows = (await readCsv(path.join(MANIFEST_DIR, 'hadith-raw-subtrees-2026-06-14.csv'))).filter((row) => row.level === 'resource');
  const subtreeRows = await readCsv(path.join(MANIFEST_DIR, 'hadith-raw-subtrees-2026-06-14.csv'));

  const hadith = partition('hadith');
  const hadithGrades = partition('hadith-grades');
  const quality = partition('quality');

  addHadithResources(hadith, subtreeRows, resourceRows);
  addGradeAndVerification(hadithGrades, hadith, subtreeRows, resourceRows);
  addQuality(quality, hadith, hadithGrades, categoryRows, resourceRows, subtreeRows);

  const newPartitions = [hadith, hadithGrades, quality].map((item) => partitionObject(item, generatedAt));
  const existingPartitions = await readExistingPartitions();
  const allPartitions = [...existingPartitions, ...newPartitions];

  const partitionDescriptors = [];
  for (const partitionData of newPartitions) {
    const checksumSha256 = await writeJson(path.join(PARTITION_DIR, `${partitionData.partition}.json`), partitionData);
    partitionDescriptors.push({
      name: partitionData.partition,
      path: `partitions/${partitionData.partition}.json`,
      nodeCount: partitionData.stats.nodeCount,
      edgeCount: partitionData.stats.edgeCount,
      checksumSha256,
      publicSafeNodeCount: 0,
      publicSafeEdgeCount: 0,
    });
  }

  const existingManifest = JSON.parse(await readFile(path.join(OUT_DIR, 'manifest.json'), 'utf8'));
  const existingDescriptors = existingManifest.partitions.filter((item) => !partitionDescriptors.some((next) => next.name === item.name));
  const indexes = makeIndexes(allPartitions);
  const indexDescriptors = [];
  for (const [file, value] of Object.entries(indexes)) {
    const checksumSha256 = await writeJson(path.join(INDEX_DIR, file), value);
    indexDescriptors.push({ name: file.replace(/\.json$/, ''), path: `indexes/${file}`, checksumSha256, entryCount: Array.isArray(value) ? value.length : Object.keys(value).length });
  }

  const counts = {
    totalNodes: allPartitions.reduce((sum, item) => sum + item.stats.nodeCount, 0),
    totalEdges: allPartitions.reduce((sum, item) => sum + item.stats.edgeCount, 0),
    partitions: allPartitions.length,
    indexes: indexDescriptors.length,
    publicSafeNodes: 0,
    publicSafeEdges: 0,
  };

  const manifest = {
    ...existingManifest,
    contractVersion: CONTRACT_VERSION,
    checkpoint: 'CP22-G05',
    scope: 'CP22-G05 manifest-backed hadith, grade, verification, and quality aggregate export plus CP22-G04 resource graph.',
    exportedAt: generatedAt,
    exportedBy: 'scripts/generate_cp22_hadith_grade_quality_graph.mjs',
    partitions: [...existingDescriptors, ...partitionDescriptors].sort((a, b) => a.name.localeCompare(b.name)),
    indexes: indexDescriptors.sort((a, b) => a.name.localeCompare(b.name)),
    sourceInputs: Array.from(new Set([...(existingManifest.sourceInputs ?? []), 'data/manifests/hadith-acquisition-category-summary-2026-06-14.csv', 'data/manifests/hadith-raw-subtrees-2026-06-14.csv', 'scripts/generate_cp22_hadith_grade_quality_graph.mjs'])),
    counts,
    warnings: Array.from(new Set([
      ...(existingManifest.warnings ?? []),
      'CP22-G05 exports hadith acquisition resources and subtree aggregate placeholders; it does not export raw hadith text bodies.',
      'CP22-G05 does not claim record-level canonical hadith coverage without a safe content schema snapshot.',
      'Grade assertions and verification claims remain source-qualified and aggregate unless record-level rows are available.',
      'Quarantined and research sources remain private and publicSafe=false.',
    ])),
  };
  manifest.checksums = {
    partitionChecksums: Object.fromEntries(manifest.partitions.map((item) => [item.name, item.checksumSha256])),
    indexChecksums: Object.fromEntries(manifest.indexes.map((item) => [item.name, item.checksumSha256])),
  };
  manifest.checksums.graphChecksumSha256 = sha256(stableJson({ schemaVersion: manifest.schemaVersion, graphId: manifest.graphId, partitions: manifest.partitions, indexes: manifest.indexes, sourceInputs: manifest.sourceInputs }));

  const summary = {
    schemaVersion: SCHEMA_VERSION,
    graphId: GRAPH_ID,
    checkpoint: 'CP22-G05',
    status: 'generated',
    generatedAt,
    counts,
    partitionCounts: Object.fromEntries(allPartitions.map((item) => [item.partition, { nodes: item.stats.nodeCount, edges: item.stats.edgeCount }])),
    publicBoundary: indexes['public-boundary.json'],
    limitations: [
      'Manifest-backed aggregate graph projection; no raw hadith text exported.',
      'Live canonical DB hadith records, text versions, grade assertions, verification claims, provenance, and release rows remain deferred until safe DB snapshot input is available.',
    ],
    next: 'CP22-G06 Guidance Evidence And Validation Links.',
  };

  await writeJson(path.join(OUT_DIR, 'manifest.json'), manifest);
  await writeJson(path.join(OUT_DIR, 'summary.json'), summary);

  console.log(JSON.stringify({ status: 'pass', checkpoint: 'CP22-G05', outputDir: OUT_DIR, counts, partitionCounts: summary.partitionCounts }, null, 2));
}

await main();
