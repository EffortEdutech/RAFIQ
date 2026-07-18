import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const GRAPH_ID = 'rafiq-full-private-resource-graph';
const SCHEMA_VERSION = 'cp22.full-private.v1';
const CONTRACT_VERSION = 'RAFIQ_KNOWLEDGE_GRAPHIFY_GRAPH_CONTRACT_V1+CP22-G04';
const ACCESS_LEVEL = 'developer_private';
const OUT_DIR = 'data/graphify/full-private';
const PARTITION_DIR = path.join(OUT_DIR, 'partitions');
const INDEX_DIR = path.join(OUT_DIR, 'indexes');
const MANIFEST_DIR = 'data/manifests';

const SURAH_COUNTS = [
  7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128, 111, 110, 98,
  135, 112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73, 54, 45, 83, 182, 88, 75,
  85, 54, 53, 89, 59, 37, 35, 38, 29, 18, 45, 60, 49, 62, 55, 78, 96, 29, 22, 24, 13,
  14, 11, 11, 18, 12, 12, 30, 52, 52, 44, 28, 28, 20, 56, 40, 31, 50, 40, 46, 42, 29,
  19, 36, 25, 22, 17, 19, 26, 30, 20, 15, 21, 11, 8, 8, 19, 5, 8, 8, 11, 11, 8, 3,
  9, 5, 4, 7, 3, 6, 3, 5, 4, 5, 6,
];

const SURAH_NAMES = [
  'Al-Fatihah', 'Al-Baqarah', 'Ali Imran', 'An-Nisa', 'Al-Maidah', 'Al-Anam', 'Al-Araf',
  'Al-Anfal', 'At-Tawbah', 'Yunus', 'Hud', 'Yusuf', 'Ar-Rad', 'Ibrahim', 'Al-Hijr',
  'An-Nahl', 'Al-Isra', 'Al-Kahf', 'Maryam', 'Taha', 'Al-Anbiya', 'Al-Hajj',
  'Al-Muminun', 'An-Nur', 'Al-Furqan', 'Ash-Shuara', 'An-Naml', 'Al-Qasas',
  'Al-Ankabut', 'Ar-Rum', 'Luqman', 'As-Sajdah', 'Al-Ahzab', 'Saba', 'Fatir', 'Ya-Sin',
  'As-Saffat', 'Sad', 'Az-Zumar', 'Ghafir', 'Fussilat', 'Ash-Shura', 'Az-Zukhruf',
  'Ad-Dukhan', 'Al-Jathiyah', 'Al-Ahqaf', 'Muhammad', 'Al-Fath', 'Al-Hujurat', 'Qaf',
  'Adh-Dhariyat', 'At-Tur', 'An-Najm', 'Al-Qamar', 'Ar-Rahman', 'Al-Waqiah', 'Al-Hadid',
  'Al-Mujadilah', 'Al-Hashr', 'Al-Mumtahanah', 'As-Saff', 'Al-Jumuah', 'Al-Munafiqun',
  'At-Taghabun', 'At-Talaq', 'At-Tahrim', 'Al-Mulk', 'Al-Qalam', 'Al-Haqqah',
  'Al-Maarij', 'Nuh', 'Al-Jinn', 'Al-Muzzammil', 'Al-Muddaththir', 'Al-Qiyamah',
  'Al-Insan', 'Al-Mursalat', 'An-Naba', 'An-Naziat', 'Abasa', 'At-Takwir', 'Al-Infitar',
  'Al-Mutaffifin', 'Al-Inshiqaq', 'Al-Buruj', 'At-Tariq', 'Al-Ala', 'Al-Ghashiyah',
  'Al-Fajr', 'Al-Balad', 'Ash-Shams', 'Al-Layl', 'Ad-Duha', 'Ash-Sharh', 'At-Tin',
  'Al-Alaq', 'Al-Qadr', 'Al-Bayyinah', 'Az-Zalzalah', 'Al-Adiyat', 'Al-Qariah',
  'At-Takathur', 'Al-Asr', 'Al-Humazah', 'Al-Fil', 'Quraysh', 'Al-Maun', 'Al-Kawthar',
  'Al-Kafirun', 'An-Nasr', 'Al-Masad', 'Al-Ikhlas', 'Al-Falaq', 'An-Nas',
];

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

function mapReleaseState(status) {
  const raw = String(status ?? '').toLowerCase();
  if (raw.includes('approved') && raw.includes('public')) return 'approved_public';
  if (raw.includes('blocked') || raw.includes('staging') || raw.includes('raw')) return 'public_blocked';
  return 'private_available';
}

function mapReviewState(status) {
  const raw = String(status ?? '').toLowerCase();
  if (raw.includes('review')) return 'content_review';
  if (raw.includes('approved')) return 'approved_private';
  return 'pending';
}

function mapQualityState(manifest) {
  const raw = `${manifest.status ?? ''} ${manifest.notes ?? ''}`.toLowerCase();
  if (raw.includes('quality') || raw.includes('blank') || raw.includes('duplicate') || raw.includes('gap')) return 'warning';
  if (raw.includes('validated') || raw.includes('staging')) return 'clean';
  return 'unverified';
}

function sourceRefs(sourceId) {
  return [{ type: 'source_snapshot', id: `snapshot:${safeId(sourceId)}` }];
}

function provenanceRef(entityType, sourceId) {
  return `provenance:source_snapshot:${safeId(sourceId)}:manifest`;
}

function releaseRef(sourceId) {
  return `release_state:source_snapshot:${safeId(sourceId)}:manifest`;
}

function baseNode({ id, type, label, partition, canonicalRef, sourceRefs = [], provenanceRefs = [], releaseStateRefs = [], releaseState = 'public_blocked', reviewState = 'pending', qualityState = 'unverified', metadata = {} }) {
  return { id, type, label, partition, canonicalRef, sourceRefs, provenanceRefs, releaseStateRefs, releaseState, reviewState, qualityState, accessLevel: ACCESS_LEVEL, publicSafe: false, metadata };
}

function baseEdge({ id, type, from, to, fromPartition, toPartition, status = 'imported', confidence = null, sourceRefs = [], evidenceRefs = [], releaseState = 'public_blocked', reviewState = 'pending', metadata = {} }) {
  return { id, type, from, to, fromPartition, toPartition, status, confidence, sourceRefs, evidenceRefs, releaseState, reviewState, accessLevel: ACCESS_LEVEL, publicSafe: false, metadata };
}

function addNode(map, node) {
  if (!map.has(node.id)) map.set(node.id, node);
}

function addEdge(map, edge) {
  if (!map.has(edge.id)) map.set(edge.id, edge);
}

async function readJsonManifests() {
  const files = (await readdir(MANIFEST_DIR)).filter((file) => file.endsWith('.json')).sort();
  const manifests = [];
  for (const file of files) {
    const manifestPath = path.join(MANIFEST_DIR, file).replaceAll('\\', '/');
    const data = JSON.parse(await readFile(manifestPath, 'utf8'));
    manifests.push({ file, path: manifestPath, data });
  }
  return manifests;
}

function partition(name) {
  return { name, nodes: new Map(), edges: new Map() };
}

function allAyahs() {
  const ayahs = [];
  let globalAyahNumber = 1;
  SURAH_COUNTS.forEach((ayahCount, index) => {
    const surahNumber = index + 1;
    for (let ayahNumber = 1; ayahNumber <= ayahCount; ayahNumber += 1) {
      ayahs.push({ surahNumber, ayahNumber, ayahId: globalAyahNumber, verseKey: `${surahNumber}:${ayahNumber}` });
      globalAyahNumber += 1;
    }
  });
  return ayahs;
}

function addQuranIdentities(quran) {
  for (let index = 0; index < SURAH_COUNTS.length; index += 1) {
    const surahNumber = index + 1;
    const surahId = `surah:${surahNumber}`;
    addNode(quran.nodes, baseNode({
      id: surahId,
      type: 'quran_surah',
      label: `${surahNumber}. ${SURAH_NAMES[index]}`,
      partition: 'quran',
      canonicalRef: { schema: 'content', table: 'quran_surahs', id: String(surahNumber) },
      releaseState: 'private_available',
      reviewState: 'not_required',
      qualityState: 'clean',
      metadata: { surahNumber, name: SURAH_NAMES[index], ayahCount: SURAH_COUNTS[index] },
    }));
  }

  for (const ayah of allAyahs()) {
    const ayahNodeId = `ayah:${ayah.surahNumber}:${ayah.ayahNumber}`;
    const surahId = `surah:${ayah.surahNumber}`;
    addNode(quran.nodes, baseNode({
      id: ayahNodeId,
      type: 'quran_ayah',
      label: `Quran ${ayah.verseKey}`,
      partition: 'quran',
      canonicalRef: { schema: 'content', table: 'quran_ayahs', id: String(ayah.ayahId) },
      releaseState: 'private_available',
      reviewState: 'not_required',
      qualityState: 'clean',
      metadata: { surahNumber: ayah.surahNumber, ayahNumber: ayah.ayahNumber, verseKey: ayah.verseKey, globalAyahNumber: ayah.ayahId },
    }));
    addEdge(quran.edges, baseEdge({
      id: `edge:surah_contains_ayah:${surahId}:${ayahNodeId}:identity`,
      type: 'surah_contains_ayah',
      from: surahId,
      to: ayahNodeId,
      fromPartition: 'quran',
      toPartition: 'quran',
      status: 'technical_verified',
      releaseState: 'private_available',
      reviewState: 'not_required',
    }));
  }
}

function addQuranTextEditions(quran, manifests) {
  const quranManifests = manifests.filter(({ data }) => data.domain === 'quran' && Number(data.recordCountActual) === 6236 && (data.sourceId.includes('script') || data.sourceId.includes('uthmani')));
  for (const { data } of quranManifests) {
    const sourceId = safeId(data.sourceId);
    const editionId = `quran_text_edition:${sourceId}`;
    const releaseState = mapReleaseState(data.status);
    const reviewState = mapReviewState(data.status);
    const qualityState = mapQualityState(data);
    addNode(quran.nodes, baseNode({
      id: editionId,
      type: 'quran_text_edition',
      label: data.name,
      partition: 'quran',
      canonicalRef: { schema: 'content', table: 'quran_text_editions', id: sourceId },
      sourceRefs: sourceRefs(sourceId),
      provenanceRefs: [provenanceRef('source_snapshot', sourceId)],
      releaseStateRefs: [releaseRef(sourceId)],
      releaseState,
      reviewState,
      qualityState,
      metadata: { editionKey: sourceId, sourceSnapshotId: sourceId, script: data.name, orthography: data.format ?? null, language: 'ar' },
    }));
    for (const ayah of allAyahs()) {
      const ayahNodeId = `ayah:${ayah.surahNumber}:${ayah.ayahNumber}`;
      const textId = `quran_text:${ayah.ayahId}:${sourceId}`;
      addNode(quran.nodes, baseNode({
        id: textId,
        type: 'quran_ayah_text',
        label: `Quran ${ayah.verseKey} text (${sourceId})`,
        partition: 'quran',
        canonicalRef: { schema: 'content', table: 'quran_ayah_texts', id: `${ayah.ayahId}:${sourceId}` },
        sourceRefs: sourceRefs(sourceId),
        provenanceRefs: [provenanceRef('source_snapshot', sourceId)],
        releaseStateRefs: [releaseRef(sourceId)],
        releaseState,
        reviewState,
        qualityState,
        metadata: { ayahId: ayah.ayahId, editionId: sourceId, scriptLabel: sourceId, bismillahBehavior: 'source_specific', endMarkerBehavior: 'source_specific' },
      }));
      addEdge(quran.edges, baseEdge({
        id: `edge:ayah_has_text_version:${ayahNodeId}:${textId}:${sourceId}`,
        type: 'ayah_has_text_version',
        from: ayahNodeId,
        to: textId,
        fromPartition: 'quran',
        toPartition: 'quran',
        status: 'imported',
        sourceRefs: sourceRefs(sourceId),
        releaseState,
        reviewState,
      }));
      addEdge(quran.edges, baseEdge({
        id: `edge:quran_text_uses_edition:${textId}:${editionId}:${sourceId}`,
        type: 'quran_text_uses_edition',
        from: textId,
        to: editionId,
        fromPartition: 'quran',
        toPartition: 'quran',
        status: 'imported',
        sourceRefs: sourceRefs(sourceId),
        releaseState,
        reviewState,
      }));
    }
  }
}

function addTranslations(translations, manifests) {
  const translationManifests = manifests.filter(({ data }) => data.domain === 'quran_translation' && Number(data.recordCountActual) === 6236);
  for (const { data } of translationManifests) {
    const sourceId = safeId(data.sourceId);
    const releaseState = mapReleaseState(data.status);
    const reviewState = mapReviewState(data.status);
    const qualityState = mapQualityState(data);
    const editionId = `translation_edition:${sourceId}`;
    const languageCode = sourceId.includes('-ms-') || sourceId.includes('malay') ? 'ms' : sourceId.includes('-id-') ? 'id' : 'en';
    addNode(translations.nodes, baseNode({
      id: editionId,
      type: 'translation_edition',
      label: data.name,
      partition: 'translations',
      canonicalRef: { schema: 'content', table: 'translation_editions', id: sourceId },
      sourceRefs: sourceRefs(sourceId),
      provenanceRefs: [provenanceRef('source_snapshot', sourceId)],
      releaseStateRefs: [releaseRef(sourceId)],
      releaseState,
      reviewState,
      qualityState,
      metadata: { editionKey: sourceId, languageCode, translatorName: data.attribution ?? null, publisherName: data.name, sourceSnapshotId: sourceId },
    }));
    for (const ayah of allAyahs()) {
      const textId = `translation_text:${sourceId}:${ayah.ayahId}`;
      const ayahNodeId = `ayah:${ayah.surahNumber}:${ayah.ayahNumber}`;
      addNode(translations.nodes, baseNode({
        id: textId,
        type: 'translation_text',
        label: `Translation ${ayah.verseKey} (${sourceId})`,
        partition: 'translations',
        canonicalRef: { schema: 'content', table: 'translation_texts', id: `${sourceId}:${ayah.ayahId}` },
        sourceRefs: sourceRefs(sourceId),
        provenanceRefs: [provenanceRef('source_snapshot', sourceId)],
        releaseStateRefs: [releaseRef(sourceId)],
        releaseState,
        reviewState,
        qualityState,
        metadata: { editionId: sourceId, ayahId: ayah.ayahId, languageCode, variantType: 'manifest_projected', hasFootnotes: false },
      }));
      addEdge(translations.edges, baseEdge({
        id: `edge:ayah_has_translation:${ayahNodeId}:${textId}:${sourceId}`,
        type: 'ayah_has_translation',
        from: ayahNodeId,
        to: textId,
        fromPartition: 'quran',
        toPartition: 'translations',
        status: 'imported',
        sourceRefs: sourceRefs(sourceId),
        releaseState,
        reviewState,
      }));
      addEdge(translations.edges, baseEdge({
        id: `edge:translation_uses_edition:${textId}:${editionId}:${sourceId}`,
        type: 'translation_uses_edition',
        from: textId,
        to: editionId,
        fromPartition: 'translations',
        toPartition: 'translations',
        status: 'imported',
        sourceRefs: sourceRefs(sourceId),
        releaseState,
        reviewState,
      }));
    }
  }
}

function addTafsir(tafsir, manifests) {
  const tafsirManifests = manifests.filter(({ data }) => data.domain === 'tafsir' && Number(data.recordCountActual) === 6236);
  for (const { data } of tafsirManifests) {
    const sourceId = safeId(data.sourceId);
    const releaseState = mapReleaseState(data.status);
    const reviewState = mapReviewState(data.status);
    const qualityState = mapQualityState(data);
    const editionId = `tafsir_edition:${sourceId}`;
    const languageCode = sourceId.includes('arabic') ? 'ar' : 'en';
    addNode(tafsir.nodes, baseNode({
      id: editionId,
      type: 'tafsir_edition',
      label: data.name,
      partition: 'tafsir',
      canonicalRef: { schema: 'content', table: 'tafsir_editions', id: sourceId },
      sourceRefs: sourceRefs(sourceId),
      provenanceRefs: [provenanceRef('source_snapshot', sourceId)],
      releaseStateRefs: [releaseRef(sourceId)],
      releaseState,
      reviewState,
      qualityState,
      metadata: { editionKey: sourceId, sourceSnapshotId: sourceId, languageCode, authorName: data.name, translatorName: null },
    }));
    for (const ayah of allAyahs()) {
      const passageId = `tafsir_passage:${sourceId}:${ayah.ayahId}`;
      const ayahNodeId = `ayah:${ayah.surahNumber}:${ayah.ayahNumber}`;
      addNode(tafsir.nodes, baseNode({
        id: passageId,
        type: 'tafsir_passage',
        label: `Tafsir ${ayah.verseKey} (${sourceId})`,
        partition: 'tafsir',
        canonicalRef: { schema: 'content', table: 'tafsir_passages', id: `${sourceId}:${ayah.ayahId}` },
        sourceRefs: sourceRefs(sourceId),
        provenanceRefs: [provenanceRef('source_snapshot', sourceId)],
        releaseStateRefs: [releaseRef(sourceId)],
        releaseState,
        reviewState,
        qualityState,
        metadata: { editionId: sourceId, fromAyahId: ayah.ayahId, toAyahId: ayah.ayahId, languageCode, blankTextFlag: sourceId.includes('saadi') ? 'source_may_include_blank_records' : false },
      }));
      addEdge(tafsir.edges, baseEdge({
        id: `edge:tafsir_passage_uses_edition:${passageId}:${editionId}:${sourceId}`,
        type: 'tafsir_passage_uses_edition',
        from: passageId,
        to: editionId,
        fromPartition: 'tafsir',
        toPartition: 'tafsir',
        status: 'imported',
        sourceRefs: sourceRefs(sourceId),
        releaseState,
        reviewState,
      }));
      addEdge(tafsir.edges, baseEdge({
        id: `edge:tafsir_explains_ayah:${passageId}:${ayahNodeId}:${sourceId}`,
        type: 'tafsir_explains_ayah',
        from: passageId,
        to: ayahNodeId,
        fromPartition: 'tafsir',
        toPartition: 'quran',
        status: 'imported',
        sourceRefs: sourceRefs(sourceId),
        releaseState,
        reviewState,
      }));
    }
  }
}

function addTopics(topics, manifests) {
  const topicManifest = manifests.find(({ data }) => data.sourceId === 'qul-topics-45')?.data;
  const themeManifest = manifests.find(({ data }) => data.sourceId === 'qul-ayah-themes-62')?.data;
  if (topicManifest) {
    const sourceId = safeId(topicManifest.sourceId);
    const taxonomyId = `source_taxonomy:${sourceId}`;
    addNode(topics.nodes, baseNode({
      id: taxonomyId,
      type: 'source_taxonomy',
      label: topicManifest.name,
      partition: 'topics',
      canonicalRef: { schema: 'content', table: 'source_taxonomies', id: sourceId },
      sourceRefs: sourceRefs(sourceId),
      provenanceRefs: [provenanceRef('source_snapshot', sourceId)],
      releaseStateRefs: [releaseRef(sourceId)],
      releaseState: mapReleaseState(topicManifest.status),
      reviewState: mapReviewState(topicManifest.status),
      qualityState: mapQualityState(topicManifest),
      metadata: { taxonomyKey: sourceId, sourceSnapshotId: sourceId, namespace: 'qul-topics', languageCode: 'en' },
    }));
    const count = Number(topicManifest.recordCountActual ?? 0);
    for (let index = 1; index <= count; index += 1) {
      const topicId = `source_topic:${sourceId}:${index}`;
      addNode(topics.nodes, baseNode({
        id: topicId,
        type: 'source_topic',
        label: `QUL topic ${index}`,
        partition: 'topics',
        canonicalRef: { schema: 'content', table: 'source_topics', id: `${sourceId}:${index}` },
        sourceRefs: sourceRefs(sourceId),
        provenanceRefs: [provenanceRef('source_snapshot', sourceId)],
        releaseStateRefs: [releaseRef(sourceId)],
        releaseState: mapReleaseState(topicManifest.status),
        reviewState: mapReviewState(topicManifest.status),
        qualityState: mapQualityState(topicManifest),
        metadata: { taxonomyId: sourceId, sourceTopicKey: String(index), label: null, namespace: 'qul-topics', languageCode: 'en', labelUnavailableReason: 'raw_topic_labels_not_available_in_checked_in_manifest_export' },
      }));
      addEdge(topics.edges, baseEdge({
        id: `edge:taxonomy_contains_topic:${taxonomyId}:${topicId}:manifest`,
        type: 'taxonomy_contains_topic',
        from: taxonomyId,
        to: topicId,
        fromPartition: 'topics',
        toPartition: 'topics',
        status: 'imported',
        sourceRefs: sourceRefs(sourceId),
        releaseState: mapReleaseState(topicManifest.status),
        reviewState: mapReviewState(topicManifest.status),
      }));
    }
  }
  if (themeManifest) {
    const sourceId = safeId(themeManifest.sourceId);
    const groupCount = Number(themeManifest.recordCountExpected ?? 0);
    for (let index = 1; index <= groupCount; index += 1) {
      addNode(topics.nodes, baseNode({
        id: `source_ayah_theme_group:${sourceId}:${index}`,
        type: 'source_ayah_theme_group',
        label: `QUL ayah theme group ${index}`,
        partition: 'topics',
        canonicalRef: { schema: 'content', table: 'source_ayah_theme_groups', id: `${sourceId}:${index}` },
        sourceRefs: sourceRefs(sourceId),
        provenanceRefs: [provenanceRef('source_snapshot', sourceId)],
        releaseStateRefs: [releaseRef(sourceId)],
        releaseState: mapReleaseState(themeManifest.status),
        reviewState: mapReviewState(themeManifest.status),
        qualityState: 'warning',
        metadata: { sourceSnapshotId: sourceId, sourceRange: null, themeText: null, totalAyahs: null, duplicateGroupState: 'manifest_notes_duplicate_pairs_and_gaps' },
      }));
    }
  }
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
  const names = ['sources', 'governance'];
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
  }

  return {
    'by-node-id.json': byNodeId,
    'by-edge-id.json': byEdgeId,
    'by-canonical-ref.json': byCanonicalRef,
    'by-source-id.json': bySourceId,
    'by-snapshot-id.json': bySnapshotId,
    'by-ayah-key.json': byAyahKey,
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
        approvalMissing: nodes.filter((node) => node.reviewState === 'pending').length + edges.filter((edge) => edge.reviewState === 'pending').length,
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
  const manifests = await readJsonManifests();

  const quran = partition('quran');
  const translations = partition('translations');
  const tafsir = partition('tafsir');
  const topics = partition('topics');

  addQuranIdentities(quran);
  addQuranTextEditions(quran, manifests);
  addTranslations(translations, manifests);
  addTafsir(tafsir, manifests);
  addTopics(topics, manifests);

  const newPartitions = [quran, translations, tafsir, topics].map((item) => partitionObject(item, generatedAt));
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
    scope: 'CP22-G04 manifest-backed Quran, translation, tafsir, and topic graph export plus CP22-G03 source/governance backbone.',
    exportedAt: generatedAt,
    exportedBy: 'scripts/generate_cp22_quran_translation_tafsir_topics_graph.mjs',
    partitions: [...existingDescriptors, ...partitionDescriptors].sort((a, b) => a.name.localeCompare(b.name)),
    indexes: indexDescriptors.sort((a, b) => a.name.localeCompare(b.name)),
    sourceInputs: Array.from(new Set([...(existingManifest.sourceInputs ?? []), 'data/manifests/quran-translation-tafsir-topic manifests', 'scripts/generate_cp22_quran_translation_tafsir_topics_graph.mjs'])),
    counts,
    warnings: Array.from(new Set([
      ...(existingManifest.warnings ?? []),
      'CP22-G04 does not export Quran, translation, or tafsir text bodies from raw files or live DB rows.',
      'Topic labels and ayah links are placeholder identities when only manifest counts are available.',
      'All Quran, translation, tafsir, and topic nodes remain private and publicSafe=false.',
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
    checkpoint: 'CP22-G04',
    status: 'generated',
    generatedAt,
    counts,
    partitionCounts: Object.fromEntries(allPartitions.map((item) => [item.partition, { nodes: item.stats.nodeCount, edges: item.stats.edgeCount }])),
    publicBoundary: indexes['public-boundary.json'],
    limitations: [
      'Manifest-backed graph projection; no raw source text exported.',
      'Live canonical DB provenance and release rows remain deferred until safe DB snapshot input is available.',
    ],
    next: 'CP22-G05 Hadith, Grade, Verification, And Quality Export.',
  };

  await writeJson(path.join(OUT_DIR, 'manifest.json'), manifest);
  await writeJson(path.join(OUT_DIR, 'summary.json'), summary);

  console.log(JSON.stringify({ status: 'pass', checkpoint: 'CP22-G04', outputDir: OUT_DIR, counts, partitionCounts: summary.partitionCounts }, null, 2));
}

await main();
