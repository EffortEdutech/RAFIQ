import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const GRAPH_ID = 'rafiq-full-private-resource-graph';
const SCHEMA_VERSION = 'cp22.full-private.v1';
const CONTRACT_VERSION = 'RAFIQ_KNOWLEDGE_GRAPHIFY_GRAPH_CONTRACT_V1+CP22-G06';
const ACCESS_LEVEL = 'developer_private';
const OUT_DIR = 'data/graphify/full-private';
const PARTITION_DIR = path.join(OUT_DIR, 'partitions');
const INDEX_DIR = path.join(OUT_DIR, 'indexes');
const CP21C_DIR = 'data/graphify/cp21c';
const CP21C_VAULT_DIR = 'data/vault/cp21c/ranking-cases';

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

function baseNode({ id, type, label, partition, canonicalRef, sourceRefs = [], provenanceRefs = [], releaseStateRefs = [], releaseState = 'private_available', reviewState = 'technical_review', qualityState = 'unverified', metadata = {} }) {
  return { id, type, label, partition, canonicalRef, sourceRefs, provenanceRefs, releaseStateRefs, releaseState, reviewState, qualityState, accessLevel: ACCESS_LEVEL, publicSafe: false, metadata };
}

function baseEdge({ id, type, from, to, fromPartition, toPartition, status = 'imported', confidence = null, sourceRefs = [], evidenceRefs = [], releaseState = 'private_available', reviewState = 'technical_review', metadata = {} }) {
  return { id, type, from, to, fromPartition, toPartition, status, confidence, sourceRefs, evidenceRefs, releaseState, reviewState, accessLevel: ACCESS_LEVEL, publicSafe: false, metadata };
}

function addNode(map, node) {
  if (!map.has(node.id)) map.set(node.id, node);
}

function addEdge(map, edge) {
  if (!map.has(edge.id)) map.set(edge.id, edge);
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, 'utf8'));
}

function artifactRefs() {
  return [{ type: 'cp21c_artifact', id: 'cp21c-resource-graphify-evidence-v1' }];
}

function provenanceRefs() {
  return ['provenance:cp21c:evidence:artifact'];
}

function releaseRefs() {
  return ['release_state:cp21c:evidence:private'];
}

function reviewStateForCase(caseData) {
  const status = caseData.session?.verification?.reviewStatus ?? caseData.session?.riskAssessment?.escalationRoute;
  if (String(status).includes('escalation')) return 'scholar_review';
  return 'technical_review';
}

function qualityStateForCase(caseResult) {
  if (!caseResult) return 'unverified';
  if ((caseResult.failedSignals ?? []).length > 0) return 'warning';
  return 'clean';
}

function evidenceItems(caseData) {
  const sessionEvidence = caseData.session?.verification?.evidence ?? [];
  const sourceMapResults = caseData.session?.sourceMap?.firstSearchResults ?? [];
  const sourceSearchResults = caseData.sourceSearch?.firstResults ?? [];
  return [
    ...sessionEvidence.map((item, index) => ({ kind: 'verification_evidence', index, item })),
    ...sourceMapResults.map((item, index) => ({ kind: 'source_map_result', index, item })),
    ...sourceSearchResults.map((item, index) => ({ kind: 'source_search_result', index, item })),
  ];
}

function ayahNodeFromEvidence(item) {
  const verseKey = item?.reference?.verseKey ?? item?.target?.verseKey;
  if (!/^\d+:\d+$/.test(String(verseKey ?? ''))) return null;
  return `ayah:${verseKey}`;
}

function hadithNodeFromEvidence(item) {
  const hadithRecordId = item?.reference?.hadithRecordId ?? item?.target?.hadithRecordId;
  if (!hadithRecordId) return null;
  return `hadith_record:cp21c:${safeId(hadithRecordId)}`;
}

function buildProductEvidence(productEvidence, cp21cReference, evidence, rankingSummary, existingNodeIds) {
  const rankingByCase = new Map((rankingSummary.caseResults ?? []).map((item) => [item.caseId, item]));

  for (const caseData of evidence.cases ?? []) {
    const caseId = safeId(caseData.caseId);
    const caseResult = rankingByCase.get(caseData.caseId);
    const session = caseData.session;
    const sourceSearch = caseData.sourceSearch;
    const refs = artifactRefs();
    const reviewState = reviewStateForCase(caseData);
    const qualityState = qualityStateForCase(caseResult);
    const caseNodeId = `cp21c_case:${caseId}`;

    addNode(cp21cReference.nodes, baseNode({
      id: caseNodeId,
      type: 'cp21c_case',
      label: `${caseData.caseId} ${caseData.caseType}`,
      partition: 'cp21c-reference',
      canonicalRef: { schema: 'data', table: 'cp21c_cases', id: caseData.caseId },
      sourceRefs: refs,
      provenanceRefs: provenanceRefs(),
      releaseStateRefs: releaseRefs(),
      releaseState: 'private_available',
      reviewState,
      qualityState,
      metadata: {
        caseId: caseData.caseId,
        caseType: caseData.caseType,
        status: session?.status ?? sourceSearch?.pagination?.status ?? 'collected',
        score: caseResult?.score ?? null,
        riskCategory: session?.riskAssessment?.riskClass ?? caseData.scoringMode,
        caseGroup: caseData.caseGroup,
        scoringMode: caseData.scoringMode,
        publicSafe: false,
      },
    }));

    const traceId = session?.sourceMap?.retrievalTraceId ?? sourceSearch?.retrievalTrace?.retrievalTraceId;
    let retrievalNodeId = null;
    if (traceId) {
      retrievalNodeId = `retrieval_trace:${safeId(traceId)}`;
      addNode(productEvidence.nodes, baseNode({
        id: retrievalNodeId,
        type: 'private_retrieval_trace',
        label: `${caseData.caseId} retrieval trace`,
        partition: 'product-evidence',
        canonicalRef: { schema: 'content', table: 'private_retrieval_traces', id: traceId },
        sourceRefs: refs,
        provenanceRefs: provenanceRefs(),
        releaseStateRefs: releaseRefs(),
        releaseState: 'private_available',
        reviewState,
        qualityState,
        metadata: {
          queryTextHash: sha256(caseData.endpoint ?? JSON.stringify(caseData.input ?? caseData.sourceSearch?.query ?? caseData.caseId)).slice(0, 24),
          queryMode: caseData.caseType,
          totalResults: session?.sourceMap?.searchResultCount ?? sourceSearch?.pagination?.total ?? evidenceItems(caseData).length,
          reviewStatus: session?.verification?.reviewStatus ?? 'unreviewed',
          createdAt: session?.createdAt ?? evidence.collectedAt,
          caseId: caseData.caseId,
        },
      }));
      addEdge(cp21cReference.edges, baseEdge({
        id: `edge:cp21c_case_uses_evidence:${caseNodeId}:${retrievalNodeId}:retrieval`,
        type: 'cp21c_case_uses_evidence',
        from: caseNodeId,
        to: retrievalNodeId,
        fromPartition: 'cp21c-reference',
        toPartition: 'product-evidence',
        sourceRefs: refs,
        evidenceRefs: [caseData.caseId],
        releaseState: 'private_available',
        reviewState,
      }));
    }

    const draftNodeId = `answer_draft:${caseId}`;
    const guidedRunNodeId = `guided_answer_run:${caseId}`;
    const validationNodeId = `answer_validation_run:${caseId}`;
    addNode(productEvidence.nodes, baseNode({
      id: draftNodeId,
      type: 'private_answer_draft',
      label: `${caseData.caseId} answer draft evidence`,
      partition: 'product-evidence',
      canonicalRef: { schema: 'content', table: 'private_answer_drafts', id: caseData.caseId },
      sourceRefs: refs,
      provenanceRefs: provenanceRefs(),
      releaseStateRefs: releaseRefs(),
      releaseState: 'private_available',
      reviewState,
      qualityState,
      metadata: { retrievalTraceId: traceId ?? null, draftStatus: session?.status ?? sourceSearch?.pagination?.status ?? 'collected', validationGateSummary: session?.verification?.status ?? null, reviewStatus: session?.verification?.reviewStatus ?? 'unreviewed' },
    }));
    addNode(productEvidence.nodes, baseNode({
      id: guidedRunNodeId,
      type: 'private_guided_answer_run',
      label: `${caseData.caseId} guided answer run`,
      partition: 'product-evidence',
      canonicalRef: { schema: 'content', table: 'private_guided_answer_runs', id: caseData.caseId },
      sourceRefs: refs,
      provenanceRefs: provenanceRefs(),
      releaseStateRefs: releaseRefs(),
      releaseState: 'private_available',
      reviewState,
      qualityState,
      metadata: { answerDraftId: draftNodeId, promptClass: caseData.caseType, riskState: session?.riskAssessment?.riskClass ?? 'source_search', reviewStatus: session?.verification?.reviewStatus ?? 'unreviewed' },
    }));
    addNode(productEvidence.nodes, baseNode({
      id: validationNodeId,
      type: 'private_answer_validation_run',
      label: `${caseData.caseId} validation gates`,
      partition: 'product-evidence',
      canonicalRef: { schema: 'content', table: 'private_answer_validation_runs', id: caseData.caseId },
      sourceRefs: refs,
      provenanceRefs: provenanceRefs(),
      releaseStateRefs: releaseRefs(),
      releaseState: 'private_available',
      reviewState,
      qualityState,
      metadata: {
        guidedAnswerRunId: guidedRunNodeId,
        validationStatus: session?.verification?.status ?? (caseResult?.pass === true ? 'pass' : 'collected'),
        reviewerActionStatus: session?.verification?.requiresScholarReview ? 'escalation_required' : 'unreviewed',
        evidenceCount: session?.verification?.evidenceCount ?? caseResult?.evidenceState?.evidenceCount ?? evidenceItems(caseData).length,
        quranEvidenceCount: session?.verification?.quranEvidenceCount ?? caseResult?.evidenceState?.quranEvidenceCount ?? null,
        sunnahEvidenceCount: session?.verification?.sunnahEvidenceCount ?? caseResult?.evidenceState?.sunnahEvidenceCount ?? null,
        failedSignals: caseResult?.failedSignals ?? [],
      },
    }));

    if (retrievalNodeId) {
      addEdge(productEvidence.edges, baseEdge({
        id: `edge:answer_draft_uses_retrieval_trace:${draftNodeId}:${retrievalNodeId}:cp21c`,
        type: 'answer_draft_uses_retrieval_trace',
        from: draftNodeId,
        to: retrievalNodeId,
        fromPartition: 'product-evidence',
        toPartition: 'product-evidence',
        sourceRefs: refs,
        releaseState: 'private_available',
        reviewState,
      }));
    }
    addEdge(productEvidence.edges, baseEdge({
      id: `edge:guided_answer_uses_draft:${guidedRunNodeId}:${draftNodeId}:cp21c`,
      type: 'guided_answer_uses_draft',
      from: guidedRunNodeId,
      to: draftNodeId,
      fromPartition: 'product-evidence',
      toPartition: 'product-evidence',
      sourceRefs: refs,
      releaseState: 'private_available',
      reviewState,
    }));
    addEdge(productEvidence.edges, baseEdge({
      id: `edge:answer_validation_checks_guided_answer:${validationNodeId}:${guidedRunNodeId}:cp21c`,
      type: 'answer_validation_checks_guided_answer',
      from: validationNodeId,
      to: guidedRunNodeId,
      fromPartition: 'product-evidence',
      toPartition: 'product-evidence',
      sourceRefs: refs,
      releaseState: 'private_available',
      reviewState,
    }));
    addEdge(cp21cReference.edges, baseEdge({
      id: `edge:cp21c_case_uses_evidence:${caseNodeId}:${validationNodeId}:validation`,
      type: 'cp21c_case_uses_evidence',
      from: caseNodeId,
      to: validationNodeId,
      fromPartition: 'cp21c-reference',
      toPartition: 'product-evidence',
      sourceRefs: refs,
      evidenceRefs: [caseData.caseId],
      releaseState: 'private_available',
      reviewState,
    }));

    for (const evidenceItem of evidenceItems(caseData)) {
      const item = evidenceItem.item;
      const documentId = `search_document:${caseId}:${safeId(evidenceItem.kind)}:${evidenceItem.index + 1}`;
      const targetNodeId = ayahNodeFromEvidence(item) ?? hadithNodeFromEvidence(item);
      const targetResolves = targetNodeId && existingNodeIds.has(targetNodeId);
      addNode(productEvidence.nodes, baseNode({
        id: documentId,
        type: 'private_search_document',
        label: `${caseData.caseId} ${evidenceItem.kind} ${evidenceItem.index + 1}`,
        partition: 'product-evidence',
        canonicalRef: { schema: 'data', table: 'cp21c_evidence_items', id: `${caseData.caseId}:${evidenceItem.kind}:${evidenceItem.index + 1}` },
        sourceRefs: refs,
        provenanceRefs: provenanceRefs(),
        releaseStateRefs: releaseRefs(),
        releaseState: item?.publicReleaseStatus === 'blocked_pending_approval' ? 'public_blocked' : 'private_available',
        reviewState,
        qualityState: targetNodeId && !targetResolves ? 'warning' : qualityState,
        metadata: {
          documentType: evidenceItem.kind,
          entityType: item?.domain ?? item?.resultId?.split(':')[0] ?? 'unknown',
          entityId: item?.citationId ?? item?.resultId ?? targetNodeId ?? null,
          searchLanguage: caseData.session?.need?.requestedLanguage ?? 'en',
          reviewStatus: session?.verification?.reviewStatus ?? 'unreviewed',
          targetNodeId: targetResolves ? targetNodeId : null,
          unresolvedTargetNodeId: targetNodeId && !targetResolves ? targetNodeId : null,
          verseKey: item?.reference?.verseKey ?? item?.target?.verseKey ?? null,
          route: item?.target?.route ?? null,
          score: item?.score ?? null,
        },
      }));
      if (retrievalNodeId) {
        addEdge(productEvidence.edges, baseEdge({
          id: `edge:retrieval_trace_uses_document:${retrievalNodeId}:${documentId}:${evidenceItem.kind}-${evidenceItem.index + 1}`,
          type: 'retrieval_trace_uses_document',
          from: retrievalNodeId,
          to: documentId,
          fromPartition: 'product-evidence',
          toPartition: 'product-evidence',
          sourceRefs: refs,
          evidenceRefs: [caseData.caseId],
          releaseState: 'private_available',
          reviewState,
        }));
      }
      addEdge(cp21cReference.edges, baseEdge({
        id: `edge:cp21c_case_uses_evidence:${caseNodeId}:${documentId}:${evidenceItem.kind}-${evidenceItem.index + 1}`,
        type: 'cp21c_case_uses_evidence',
        from: caseNodeId,
        to: documentId,
        fromPartition: 'cp21c-reference',
        toPartition: 'product-evidence',
        sourceRefs: refs,
        evidenceRefs: [caseData.caseId],
        releaseState: 'private_available',
        reviewState,
      }));
      if (targetResolves) {
        const targetPartition = targetNodeId.startsWith('ayah:') ? 'quran' : 'hadith';
        addEdge(productEvidence.edges, baseEdge({
          id: `edge:search_document_represents_entity:${documentId}:${targetNodeId}:${evidenceItem.kind}-${evidenceItem.index + 1}`,
          type: 'search_document_represents_entity',
          from: documentId,
          to: targetNodeId,
          fromPartition: 'product-evidence',
          toPartition: targetPartition,
          status: 'derived_candidate',
          sourceRefs: refs,
          evidenceRefs: [caseData.caseId],
          releaseState: 'public_blocked',
          reviewState,
          metadata: { authorityBoundary: 'retrieval_evidence_not_religious_authority' },
        }));
        if (retrievalNodeId) {
          addEdge(productEvidence.edges, baseEdge({
            id: `edge:retrieval_trace_cites_entity:${retrievalNodeId}:${targetNodeId}:${evidenceItem.kind}-${evidenceItem.index + 1}`,
            type: 'retrieval_trace_cites_entity',
            from: retrievalNodeId,
            to: targetNodeId,
            fromPartition: 'product-evidence',
            toPartition: targetPartition,
            status: 'derived_candidate',
            sourceRefs: refs,
            evidenceRefs: [caseData.caseId],
            releaseState: 'public_blocked',
            reviewState,
            metadata: { authorityBoundary: 'retrieval_evidence_not_religious_authority' },
          }));
        }
      }
    }
  }
}

async function addVaultNotes(cp21cReference) {
  const files = (await readdir(CP21C_VAULT_DIR)).filter((file) => file.endsWith('.md')).sort();
  for (const file of files) {
    const raw = await readFile(path.join(CP21C_VAULT_DIR, file), 'utf8');
    const caseId = file.replace(/\.md$/, '').toUpperCase();
    const noteId = `vault_note:cp21c:${safeId(caseId)}`;
    const caseNodeId = `cp21c_case:${safeId(caseId)}`;
    addNode(cp21cReference.nodes, baseNode({
      id: noteId,
      type: 'vault_note',
      label: `${caseId} vault note`,
      partition: 'cp21c-reference',
      canonicalRef: { schema: 'data', table: 'vault_cp21c', id: `data/vault/cp21c/ranking-cases/${file}` },
      sourceRefs: [{ type: 'vault_note', path: `data/vault/cp21c/ranking-cases/${file}` }],
      provenanceRefs: provenanceRefs(),
      releaseStateRefs: releaseRefs(),
      releaseState: 'private_available',
      reviewState: 'technical_review',
      qualityState: 'clean',
      metadata: { artifactType: 'cp21c_ranking_case_note', artifactId: caseId, sourceGraphId: 'cp21c-resource-graph-v1', status: 'generated', publicSafe: false, byteLength: Buffer.byteLength(raw) },
    }));
    if (cp21cReference.nodes.has(caseNodeId)) {
      addEdge(cp21cReference.edges, baseEdge({
        id: `edge:vault_note_describes:${noteId}:${caseNodeId}:cp21c`,
        type: 'vault_note_describes',
        from: noteId,
        to: caseNodeId,
        fromPartition: 'cp21c-reference',
        toPartition: 'cp21c-reference',
        sourceRefs: [{ type: 'vault_note', path: `data/vault/cp21c/ranking-cases/${file}` }],
        releaseState: 'private_available',
        reviewState: 'technical_review',
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
    stats: { nodeCount: nodes.length, edgeCount: edges.length, publicSafeNodeCount: 0, publicSafeEdgeCount: 0 },
  };
}

async function readExistingPartitions() {
  const names = ['sources', 'governance', 'quran', 'translations', 'tafsir', 'topics', 'hadith', 'hadith-grades', 'quality'];
  const partitions = [];
  for (const name of names) partitions.push(await readJson(path.join(PARTITION_DIR, `${name}.json`)));
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
    if (node.type === 'quran_ayah') byAyahKey[node.metadata.verseKey] = { ayahNodeId: node.id, translations: [], tafsir: [], topics: [], retrievalEvidence: [] };
    if (node.type === 'hadith_record') byHadithKey[node.metadata.sourceHadithKey] = { hadithNodeId: node.id, textVersions: [], references: [], gradeAssertions: [], verificationClaims: [], qualityFindings: [], retrievalEvidence: [] };
    if (node.type === 'source_topic' || node.type === 'rafiq_theme' || node.type === 'source_ayah_theme_group') byTopicKey[node.id] = { id: node.id, type: node.type, partition: node.partition, label: node.label, publicSafe: node.publicSafe };
    byReleaseState[node.releaseState] ??= [];
    byReleaseState[node.releaseState].push(node.id);
    byReviewState[node.reviewState] ??= [];
    byReviewState[node.reviewState].push(node.id);
    byQualityState[node.qualityState] ??= [];
    byQualityState[node.qualityState].push(node.id);
  }

  for (const edge of edges) {
    const from = nodeById.get(edge.from);
    const to = nodeById.get(edge.to);
    if (edge.type === 'ayah_has_translation' && byAyahKey[from?.metadata?.verseKey]) byAyahKey[from.metadata.verseKey].translations.push(edge.to);
    if (edge.type === 'tafsir_explains_ayah' && byAyahKey[to?.metadata?.verseKey]) byAyahKey[to.metadata.verseKey].tafsir.push(edge.from);
    if (edge.type === 'retrieval_trace_cites_entity' && to?.type === 'quran_ayah' && byAyahKey[to.metadata.verseKey]) byAyahKey[to.metadata.verseKey].retrievalEvidence.push(edge.from);
    if (['hadith_has_text_version', 'hadith_has_reference', 'hadith_has_grade_assertion', 'hadith_has_verification_claim', 'entity_has_quality_finding', 'retrieval_trace_cites_entity'].includes(edge.type)) {
      const record = edge.type === 'retrieval_trace_cites_entity' ? to : from;
      const key = record?.metadata?.sourceHadithKey;
      if (!key || !byHadithKey[key]) continue;
      if (edge.type === 'hadith_has_text_version') byHadithKey[key].textVersions.push(edge.to);
      if (edge.type === 'hadith_has_reference') byHadithKey[key].references.push(edge.to);
      if (edge.type === 'hadith_has_grade_assertion') byHadithKey[key].gradeAssertions.push(edge.to);
      if (edge.type === 'hadith_has_verification_claim') byHadithKey[key].verificationClaims.push(edge.to);
      if (edge.type === 'entity_has_quality_finding') byHadithKey[key].qualityFindings.push(edge.to);
      if (edge.type === 'retrieval_trace_cites_entity') byHadithKey[key].retrievalEvidence.push(edge.from);
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
        approvalMissing: nodes.filter((node) => ['pending', 'technical_review', 'content_review', 'scholar_review'].includes(node.reviewState)).length + edges.filter((edge) => ['pending', 'technical_review', 'content_review', 'scholar_review'].includes(edge.reviewState)).length,
        escalationBoundary: nodes.filter((node) => node.type === 'private_answer_validation_run' && String(node.metadata.validationStatus).includes('escalation')).length,
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
  const evidence = await readJson(path.join(CP21C_DIR, 'evidence.json'));
  const rankingSummary = await readJson(path.join(CP21C_DIR, 'ranking-summary.json'));
  const existingPartitions = await readExistingPartitions();
  const existingNodeIds = new Set(existingPartitions.flatMap((partition) => partition.nodes.map((node) => node.id)));

  const productEvidence = { name: 'product-evidence', nodes: new Map(), edges: new Map() };
  const cp21cReference = { name: 'cp21c-reference', nodes: new Map(), edges: new Map() };
  buildProductEvidence(productEvidence, cp21cReference, evidence, rankingSummary, existingNodeIds);
  await addVaultNotes(cp21cReference);

  const newPartitions = [productEvidence, cp21cReference].map((item) => partitionObject(item, generatedAt));
  const allPartitions = [...existingPartitions, ...newPartitions];
  const partitionDescriptors = [];
  for (const partitionData of newPartitions) {
    const checksumSha256 = await writeJson(path.join(PARTITION_DIR, `${partitionData.partition}.json`), partitionData);
    partitionDescriptors.push({ name: partitionData.partition, path: `partitions/${partitionData.partition}.json`, nodeCount: partitionData.stats.nodeCount, edgeCount: partitionData.stats.edgeCount, checksumSha256, publicSafeNodeCount: 0, publicSafeEdgeCount: 0 });
  }

  const existingManifest = await readJson(path.join(OUT_DIR, 'manifest.json'));
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
    checkpoint: 'CP22-G06',
    scope: 'CP22-G06 guidance evidence, validation links, product-evidence, and CP21C reference export plus CP22-G05 resource graph.',
    exportedAt: generatedAt,
    exportedBy: 'scripts/generate_cp22_guidance_evidence_graph.mjs',
    partitions: [...existingDescriptors, ...partitionDescriptors].sort((a, b) => a.name.localeCompare(b.name)),
    indexes: indexDescriptors.sort((a, b) => a.name.localeCompare(b.name)),
    sourceInputs: Array.from(new Set([...(existingManifest.sourceInputs ?? []), 'data/graphify/cp21c/cases.json', 'data/graphify/cp21c/evidence.json', 'data/graphify/cp21c/ranking-summary.json', 'data/vault/cp21c/ranking-cases/*.md', 'scripts/generate_cp22_guidance_evidence_graph.mjs'])),
    counts,
    warnings: Array.from(new Set([
      ...(existingManifest.warnings ?? []),
      'CP22-G06 exports private CP21C product evidence as derived validation evidence, not as public guidance.',
      'Retrieval and validation evidence links do not upgrade candidate routes into religious authority.',
      'Live product-evidence database rows remain deferred until a safe content schema snapshot is available.',
      'CP21C reference partition remains prototype evidence and is not the full RAFIQ resource graph.',
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
    checkpoint: 'CP22-G06',
    status: 'generated',
    generatedAt,
    counts,
    partitionCounts: Object.fromEntries(allPartitions.map((item) => [item.partition, { nodes: item.stats.nodeCount, edges: item.stats.edgeCount }])),
    publicBoundary: indexes['public-boundary.json'],
    limitations: [
      'CP21C product-evidence graph projection; no live product-evidence DB rows exported.',
      'Retrieval evidence links are private validation links, not authoritative religious guidance.',
    ],
    next: 'CP22-G07 Vault Packs.',
  };
  await writeJson(path.join(OUT_DIR, 'manifest.json'), manifest);
  await writeJson(path.join(OUT_DIR, 'summary.json'), summary);
  console.log(JSON.stringify({ status: 'pass', checkpoint: 'CP22-G06', outputDir: OUT_DIR, counts, partitionCounts: summary.partitionCounts }, null, 2));
}

await main();
