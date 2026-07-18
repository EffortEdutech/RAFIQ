#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const OUT_DIR = 'data/retrieval/cp24';
const GRAPH_DIR = 'data/graphify/full-private';
const VAULT_DIR = 'data/vault/full-private';
const MAX_DEPTH = 2;
const MAX_INITIAL_CANDIDATES = 8;
const MAX_EXPANDED_CANDIDATES = 12;
const MAX_GRAPH_NODES = 40;
const MAX_GRAPH_EDGES = 80;
const MAX_EVIDENCE_ROUTE_ITEMS = 12;
const MAX_VAULT_PACK_REFS = 8;

function sha256(value) {
  return createHash('sha256').update(value).digest('hex').toUpperCase();
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, 'utf8'));
}

async function writeJson(filePath, value) {
  const body = `${JSON.stringify(value, null, 2)}\n`;
  await writeFile(filePath, body, 'utf8');
  return sha256(body);
}

function canonicalRefString(ref, fallback) {
  if (ref?.schema && ref?.table && ref?.id) return `${ref.schema}.${ref.table}:${ref.id}`;
  return fallback;
}

function refId(ref) {
  if (typeof ref === 'string') return ref;
  if (ref?.id) return ref.id;
  if (ref?.path) return ref.path;
  return String(ref ?? '');
}

function unique(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function contentTypeFor(node) {
  if (!node) return 'validation_finding';
  if (node.type === 'quran_ayah') return 'quran_ayah';
  if (node.type === 'quran_ayah_text') return 'quran_ayah_text';
  if (node.type === 'translation_text') return 'translation_text';
  if (node.type === 'tafsir_passage') return 'tafsir_passage';
  if (node.type === 'hadith_record') return 'hadith_record';
  if (node.type === 'hadith_text_version') return 'hadith_text_version';
  if (node.type === 'hadith_grade_assertion') return 'hadith_grade_assertion';
  if (node.type === 'hadith_verification_claim') return 'hadith_verification_claim';
  if (node.type === 'source_topic' || node.type === 'source_ayah_theme_group' || node.type === 'rafiq_theme') return 'source_topic';
  if (node.type === 'source' || node.type === 'source_snapshot') return 'source';
  if (node.type === 'cp21c_case' || node.type === 'private_answer_validation_run') return 'validation_finding';
  return 'review_workflow';
}

function routeRoleFor(contentType, fixtureId) {
  if (fixtureId.includes('public-boundary')) return 'public_boundary_context';
  if (fixtureId.includes('safety-escalation')) return 'escalation_context';
  if (contentType === 'quran_ayah' || contentType === 'quran_ayah_text') return 'quran_anchor';
  if (contentType === 'translation_text') return 'translation_context';
  if (contentType === 'tafsir_passage') return 'tafsir_context';
  if (contentType === 'hadith_grade_assertion') return 'hadith_grade_context';
  if (contentType === 'hadith_record' || contentType === 'hadith_text_version') return 'hadith_support';
  if (contentType === 'source_topic') return 'topic_context';
  if (contentType === 'source') return 'source_context';
  if (contentType === 'validation_finding') return 'validation_context';
  return 'quality_context';
}

function rankingSignalsFor(node, fixture, hasRequiredRefs) {
  const signals = ['graph_neighbor_available'];
  if (fixture.graphMode === 'rank_and_explain') signals.unshift('text_match');
  if (node?.sourceRefs?.length) signals.push('source_refs_complete');
  else signals.push('missing_source_ref');
  if (node?.provenanceRefs?.length) signals.push('provenance_refs_complete');
  else signals.push('missing_provenance_ref');
  if (node?.releaseStateRefs?.length) signals.push('release_refs_complete');
  else signals.push('missing_release_ref');
  if (node?.qualityState === 'warning') signals.push('quality_warning');
  if (node?.releaseState === 'public_blocked') signals.push('release_blocker');
  if (node?.type === 'tafsir_passage') signals.push('ayah_tafsir_adjacency');
  if (node?.type === 'translation_text') signals.push('translation_edition_available');
  if (node?.type === 'hadith_record' || node?.type === 'hadith_grade_assertion') signals.push('hadith_grade_context');
  if (node?.type === 'source_ayah_theme_group' || node?.type === 'source_topic') signals.push('topic_candidate_match');
  if (fixture.fixtureId.includes('validation')) signals.push('validation_history');
  if (fixture.fixtureId.includes('safety-escalation')) signals.push('escalation_sensitive_intent');
  if (!hasRequiredRefs) signals.push('release_blocker');
  return unique(signals);
}

function selectionFor(node, fixture, hasRequiredRefs) {
  if (fixture.fixtureId.includes('safety-escalation')) return 'requires_escalation';
  if (fixture.fixtureId.includes('hadith-grade-escalation')) return 'requires_escalation';
  if (fixture.fixtureId.includes('source-gap')) return 'requires_review';
  if (!node) return 'rejected';
  if (node.publicSafe !== false) return 'rejected';
  if (!hasRequiredRefs) return 'requires_review';
  if (node.qualityState === 'withheld' || node.reviewState === 'rejected') return 'rejected';
  if (node.qualityState === 'warning' || ['pending', 'technical_review', 'content_review', 'scholar_review'].includes(node.reviewState)) return 'requires_review';
  return 'selected';
}

function buildCandidate(node, fixture, graphEdgeIds, vaultPackIds) {
  const hasRequiredRefs = Boolean(
    node &&
      (node.sourceRefs ?? []).length > 0 &&
      (node.provenanceRefs ?? []).length > 0 &&
      (node.releaseStateRefs ?? []).length > 0,
  );
  const selectionState = selectionFor(node, fixture, hasRequiredRefs);
  const contentType = contentTypeFor(node);
  const rankingSignals = rankingSignalsFor(node, fixture, hasRequiredRefs);
  const selected = selectionState === 'selected';
  return {
    candidateId: `candidate:${fixture.fixtureId}:${node?.id ?? 'unresolved'}`,
    fixtureId: fixture.fixtureId,
    canonicalRef: canonicalRefString(node?.canonicalRef, node?.id ?? fixture.seedDescription),
    contentType,
    graphNodeIds: node ? [node.id] : [],
    graphEdgeIds: graphEdgeIds.slice(0, 8),
    sourceIds: unique((node?.sourceRefs ?? []).map(refId)),
    provenanceIds: unique(node?.provenanceRefs ?? []),
    releaseStateIds: unique(node?.releaseStateRefs ?? []),
    qualityState: node?.qualityState ?? 'unverified',
    reviewState: node?.reviewState ?? 'technical_review',
    publicSafe: false,
    vaultPackIds: vaultPackIds.slice(0, MAX_VAULT_PACK_REFS),
    rankingSignals,
    rankingExplanations: rankingSignals.map((signal) => ({
      signal,
      weight: signal.startsWith('missing_') || signal === 'release_blocker' ? -1 : 1,
      scoreImpact: signal.startsWith('missing_') || signal === 'release_blocker' ? -10 : 5,
      explanation: `Operational ${signal.replaceAll('_', ' ')} signal for private retrieval review.`,
      authorityBoundary: 'operational_relevance_only',
    })),
    ordinaryScore: selected ? 80 : selectionState === 'requires_review' ? 45 : null,
    escalationOutcome: selectionState === 'requires_escalation' ? (fixture.intent === 'crisis' ? 'safety_escalation' : 'scholar_escalation') : null,
    selectionState,
    selectionReason: selected
      ? 'Selected for private candidate review because the graph node resolved and no hard stop condition was triggered.'
      : 'Held from selected evidence because CP24-G03 enforces private review, escalation, or missing-reference boundaries.',
    rejectionReason: selectionState === 'rejected' ? 'Graph node unresolved or blocked by hard stop condition.' : null,
  };
}

function makeRouteItem(candidate) {
  return {
    routeItemId: `route-item:${candidate.candidateId}`,
    candidateId: candidate.candidateId,
    role: routeRoleFor(candidate.contentType, candidate.fixtureId),
    canonicalRef: candidate.canonicalRef,
    graphNodeIds: candidate.graphNodeIds,
    graphEdgeIds: candidate.graphEdgeIds,
    sourceIds: candidate.sourceIds,
    provenanceIds: candidate.provenanceIds,
    releaseStateIds: candidate.releaseStateIds,
    vaultPackIds: candidate.vaultPackIds,
    selectionState: candidate.selectionState,
    selectionReason: candidate.selectionReason,
    validationImpact: candidate.selectionState === 'selected' ? 'supports' : candidate.selectionState === 'requires_escalation' ? 'escalates' : 'warns',
  };
}

function fixtureDefinitions(indexes) {
  const ayah = indexes.byAyahKey['1:1'];
  const hadithSupport = indexes.byHadithKey['collections_abdullah-naseer-six-books_src:aggregate'];
  const hadithGrade = indexes.byHadithKey['collections_fawaz-hadith-api-v1_database_linebyline:aggregate'];
  const topicId = indexes.byTopicKey['source_ayah_theme_group:qul-ayah-themes-62:1']?.id ?? Object.keys(indexes.byTopicKey)[0];
  return [
    {
      fixtureId: 'cp24-fixture-quran-anchor-001',
      queryText: 'private fixture for Quran anchor retrieval',
      intent: 'guidance',
      domain: 'quran',
      graphMode: 'rank_and_explain',
      seedDescription: 'ayah key 1:1',
      seedNodeIds: [ayah.ayahNodeId],
      requiresCompleteRefs: true,
    },
    {
      fixtureId: 'cp24-fixture-translation-context-001',
      queryText: 'private fixture for translation context retrieval',
      intent: 'learning',
      domain: 'translation',
      graphMode: 'expand_candidates',
      seedDescription: 'first translation for ayah 1:1',
      seedNodeIds: [ayah.translations[0]],
      requiresCompleteRefs: true,
    },
    {
      fixtureId: 'cp24-fixture-tafsir-context-001',
      queryText: 'private fixture for tafsir context retrieval',
      intent: 'learning',
      domain: 'tafsir',
      graphMode: 'expand_candidates',
      seedDescription: 'first tafsir passage for ayah 1:1',
      seedNodeIds: [ayah.tafsir[0]],
      requiresCompleteRefs: true,
    },
    {
      fixtureId: 'cp24-fixture-hadith-support-001',
      queryText: 'private fixture for hadith support retrieval',
      intent: 'guidance',
      domain: 'hadith',
      graphMode: 'rank_and_explain',
      seedDescription: 'abdullah naseer six books aggregate hadith key',
      seedNodeIds: [hadithSupport.hadithNodeId],
      requiresCompleteRefs: true,
    },
    {
      fixtureId: 'cp24-fixture-hadith-grade-escalation-001',
      queryText: 'private fixture for hadith grade escalation',
      intent: 'search',
      domain: 'hadith',
      graphMode: 'explain_only',
      seedDescription: 'fawaz linebyline aggregate grade assertion',
      seedNodeIds: [hadithGrade.gradeAssertions[0]],
      requiresCompleteRefs: true,
    },
    {
      fixtureId: 'cp24-fixture-topic-001',
      queryText: 'private fixture for topic graph expansion',
      intent: 'search',
      domain: 'topic',
      graphMode: 'expand_candidates',
      seedDescription: 'QUL ayah theme group 1',
      seedNodeIds: [topicId],
      requiresCompleteRefs: true,
    },
    {
      fixtureId: 'cp24-fixture-validation-history-001',
      queryText: 'private fixture for validation history retrieval',
      intent: 'search',
      domain: 'validation',
      graphMode: 'explain_only',
      seedDescription: 'CP21C validation case CP21C-AY-001',
      seedNodeIds: ['cp21c_case:cp21c-ay-001'],
      requiresCompleteRefs: true,
    },
    {
      fixtureId: 'cp24-fixture-source-gap-001',
      queryText: 'private fixture for missing source/provenance/release references',
      intent: 'search',
      domain: 'source',
      graphMode: 'rank_and_explain',
      seedDescription: 'intentional unresolved missing-reference candidate',
      seedNodeIds: ['unresolved:cp24-source-gap'],
      requiresCompleteRefs: true,
    },
    {
      fixtureId: 'cp24-fixture-public-boundary-001',
      queryText: 'private fixture for public boundary proof',
      intent: 'search',
      domain: 'validation',
      graphMode: 'explain_only',
      seedDescription: 'public boundary index and manifest counts',
      seedNodeIds: ['cp21c_case:cp21c-ay-002'],
      requiresCompleteRefs: true,
    },
    {
      fixtureId: 'cp24-fixture-safety-escalation-001',
      queryText: 'private fixture for crisis intent escalation boundary',
      intent: 'crisis',
      domain: 'validation',
      graphMode: 'explain_only',
      seedDescription: 'CP21C escalation case CP21C-BL-001',
      seedNodeIds: ['cp21c_case:cp21c-bl-001'],
      requiresCompleteRefs: true,
    },
  ];
}

async function loadGraph() {
  const graphManifest = await readJson(path.join(GRAPH_DIR, 'manifest.json'));
  const vaultManifest = await readJson(path.join(VAULT_DIR, 'manifest.json'));
  const partitions = [];
  for (const descriptor of graphManifest.partitions) {
    partitions.push(await readJson(path.join(GRAPH_DIR, descriptor.path)));
  }
  const nodes = new Map();
  const edges = new Map();
  const adjacency = new Map();
  for (const partition of partitions) {
    for (const node of partition.nodes) nodes.set(node.id, node);
    for (const edge of partition.edges) {
      edges.set(edge.id, edge);
      adjacency.set(edge.from, [...(adjacency.get(edge.from) ?? []), edge]);
      adjacency.set(edge.to, [...(adjacency.get(edge.to) ?? []), edge]);
    }
  }
  const indexes = {
    byAyahKey: await readJson(path.join(GRAPH_DIR, 'indexes/by-ayah-key.json')),
    byHadithKey: await readJson(path.join(GRAPH_DIR, 'indexes/by-hadith-key.json')),
    byTopicKey: await readJson(path.join(GRAPH_DIR, 'indexes/by-topic-key.json')),
    publicBoundary: await readJson(path.join(GRAPH_DIR, 'indexes/public-boundary.json')),
  };
  const vaultPacksByNode = new Map();
  for (const artifact of vaultManifest.artifacts ?? []) {
    for (const graphNodeId of artifact.graphNodeIds ?? []) {
      vaultPacksByNode.set(graphNodeId, [...(vaultPacksByNode.get(graphNodeId) ?? []), artifact.artifactId]);
    }
  }
  return { graphManifest, vaultManifest, nodes, edges, adjacency, indexes, vaultPacksByNode };
}

function expandGraph(seedNodeIds, graph) {
  const resolvedSeedNodeIds = seedNodeIds.filter((id) => graph.nodes.has(id));
  const unresolvedSeedNodeIds = seedNodeIds.filter((id) => !graph.nodes.has(id));
  const queue = resolvedSeedNodeIds.map((id) => ({ id, depth: 0 }));
  const visited = new Map(resolvedSeedNodeIds.map((id) => [id, 0]));
  const expandedEdgeIds = new Set();
  const stopConditions = [];

  while (queue.length > 0 && visited.size < MAX_GRAPH_NODES && expandedEdgeIds.size < MAX_GRAPH_EDGES) {
    const current = queue.shift();
    if (!current) break;
    const node = graph.nodes.get(current.id);
    if (!node) continue;
    if (current.depth >= MAX_DEPTH) {
      stopConditions.push({ nodeId: current.id, reason: 'max_depth_reached', depth: current.depth });
      continue;
    }
    if (node.qualityState === 'withheld' || node.reviewState === 'rejected') {
      stopConditions.push({ nodeId: current.id, reason: 'rejected_or_withheld_node', depth: current.depth });
      continue;
    }
    for (const edge of graph.adjacency.get(current.id) ?? []) {
      if (expandedEdgeIds.size >= MAX_GRAPH_EDGES) break;
      if (edge.status === 'rejected' || edge.status === 'retired') {
        stopConditions.push({ edgeId: edge.id, reason: 'rejected_or_retired_edge', depth: current.depth });
        continue;
      }
      expandedEdgeIds.add(edge.id);
      const nextId = edge.from === current.id ? edge.to : edge.from;
      if (!visited.has(nextId) && visited.size < MAX_GRAPH_NODES) {
        visited.set(nextId, current.depth + 1);
        queue.push({ id: nextId, depth: current.depth + 1 });
      }
    }
  }

  if (unresolvedSeedNodeIds.length > 0) {
    for (const nodeId of unresolvedSeedNodeIds) stopConditions.push({ nodeId, reason: 'unresolved_seed_node', depth: 0 });
  }
  if (visited.size >= MAX_GRAPH_NODES) stopConditions.push({ reason: 'max_graph_nodes_cap_reached', cap: MAX_GRAPH_NODES });
  if (expandedEdgeIds.size >= MAX_GRAPH_EDGES) stopConditions.push({ reason: 'max_graph_edges_cap_reached', cap: MAX_GRAPH_EDGES });

  return {
    resolvedSeedNodeIds,
    unresolvedSeedNodeIds,
    nodeIds: Array.from(visited.keys()).slice(0, MAX_GRAPH_NODES),
    edgeIds: Array.from(expandedEdgeIds).slice(0, MAX_GRAPH_EDGES),
    stopConditions,
    maxDepthReached: Math.max(0, ...Array.from(visited.values())),
  };
}

function fixtureResult(fixture, graph) {
  const expansion = expandGraph(fixture.seedNodeIds, graph);
  const vaultPackIds = unique(expansion.nodeIds.flatMap((nodeId) => graph.vaultPacksByNode.get(nodeId) ?? [])).slice(0, MAX_VAULT_PACK_REFS);
  const initialCandidates = fixture.seedNodeIds.slice(0, MAX_INITIAL_CANDIDATES).map((nodeId) => {
    const node = graph.nodes.get(nodeId);
    const edgeIds = expansion.edgeIds.filter((edgeId) => {
      const edge = graph.edges.get(edgeId);
      return edge?.from === nodeId || edge?.to === nodeId;
    });
    return buildCandidate(node, fixture, edgeIds, vaultPackIds);
  });
  const expandedCandidates = expansion.nodeIds
    .filter((nodeId) => !fixture.seedNodeIds.includes(nodeId))
    .slice(0, MAX_EXPANDED_CANDIDATES)
    .map((nodeId) => buildCandidate(graph.nodes.get(nodeId), fixture, expansion.edgeIds, unique(graph.vaultPacksByNode.get(nodeId) ?? [])));
  const allCandidates = [...initialCandidates, ...expandedCandidates];
  const selectedCandidateIds = allCandidates.filter((item) => item.selectionState === 'selected').map((item) => item.candidateId);
  const heldCandidateIds = allCandidates.filter((item) => item.selectionState === 'held').map((item) => item.candidateId);
  const rejectedCandidateIds = allCandidates.filter((item) => item.selectionState === 'rejected').map((item) => item.candidateId);
  const requiresReviewCandidateIds = allCandidates.filter((item) => item.selectionState === 'requires_review').map((item) => item.candidateId);
  const requiresEscalationCandidateIds = allCandidates.filter((item) => item.selectionState === 'requires_escalation').map((item) => item.candidateId);
  const routeItems = allCandidates.map(makeRouteItem).slice(0, MAX_EVIDENCE_ROUTE_ITEMS);

  return {
    fixtureId: fixture.fixtureId,
    request: {
      queryText: fixture.queryText,
      fixtureId: fixture.fixtureId,
      intent: fixture.intent,
      language: 'en',
      domain: fixture.domain,
      graphMode: fixture.graphMode,
      graphExpansion: {
        maxDepth: MAX_DEPTH,
        allowedNodeTypes: [],
        allowedEdgeTypes: [],
        requireSourceRefs: true,
        requireProvenanceRefs: true,
        requireReleaseRefs: true,
        includeVaultPackRefs: true,
      },
      releaseBoundary: {
        mode: 'private_internal',
        allowPublicBlocked: true,
        allowRejected: false,
        publicSafeOnly: false,
      },
      qualityBoundary: {
        allowWarning: true,
        allowWithheld: false,
        requireReviewForWarning: true,
      },
      outputCaps: {
        maxInitialCandidates: MAX_INITIAL_CANDIDATES,
        maxExpandedCandidates: MAX_EXPANDED_CANDIDATES,
        maxGraphNodes: MAX_GRAPH_NODES,
        maxGraphEdges: MAX_GRAPH_EDGES,
        maxEvidenceRouteItems: MAX_EVIDENCE_ROUTE_ITEMS,
        maxVaultPackRefs: MAX_VAULT_PACK_REFS,
      },
    },
    seed: {
      description: fixture.seedDescription,
      requestedNodeIds: fixture.seedNodeIds,
      resolvedNodeIds: expansion.resolvedSeedNodeIds,
      unresolvedNodeIds: expansion.unresolvedSeedNodeIds,
    },
    candidates: allCandidates,
    selectedCandidateIds,
    heldCandidateIds,
    rejectedCandidateIds,
    requiresReviewCandidateIds,
    requiresEscalationCandidateIds,
    graphExpansion: {
      maxDepth: MAX_DEPTH,
      maxDepthReached: expansion.maxDepthReached,
      graphNodeIds: expansion.nodeIds,
      graphEdgeIds: expansion.edgeIds,
      nodeCount: expansion.nodeIds.length,
      edgeCount: expansion.edgeIds.length,
      stopConditions: expansion.stopConditions,
    },
    vaultPackIds,
    evidenceRoute: {
      evidenceRouteId: `evidence-route:${fixture.fixtureId}`,
      retrievalTraceId: `retrieval-trace:${fixture.fixtureId}`,
      queryText: fixture.queryText,
      intent: fixture.intent,
      domain: fixture.domain,
      graphMode: fixture.graphMode,
      selectedEvidence: routeItems.filter((item) => item.selectionState === 'selected'),
      rejectedEvidence: routeItems.filter((item) => ['rejected', 'requires_review'].includes(item.selectionState)),
      escalationEvidence: routeItems.filter((item) => item.selectionState === 'requires_escalation'),
      validationGateResults: [],
      escalationOutcomes: unique(allCandidates.map((item) => item.escalationOutcome)),
      reviewQueueItemIds: [],
      remediationIds: [],
      createdAt: new Date().toISOString(),
    },
    publicBoundary: {
      privateOnly: true,
      publicSafeCandidateCount: 0,
      publicSafeGraphNodeCount: graph.graphManifest.counts.publicSafeNodes,
      publicSafeGraphEdgeCount: graph.graphManifest.counts.publicSafeEdges,
      publicSafeVaultArtifactCount: graph.vaultManifest.counts.publicSafeArtifacts,
      publicReleaseApproved: false,
      publicRouteExposed: false,
    },
  };
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const generatedAt = new Date().toISOString();
  const graph = await loadGraph();
  const fixtures = fixtureDefinitions(graph.indexes).map((fixture) => fixtureResult(fixture, graph));
  const artifact = {
    schemaVersion: 'cp24.candidate-expansion.v1',
    checkpoint: 'CP24-G03',
    generatedAt,
    generatedBy: 'scripts/generate_cp24_candidate_graph_expansion.mjs',
    privateOnly: true,
    publicReleaseApproved: false,
    sourceGraph: {
      graphId: graph.graphManifest.graphId,
      graphChecksumSha256: graph.graphManifest.checksums.graphChecksumSha256,
      nodeCount: graph.graphManifest.counts.totalNodes,
      edgeCount: graph.graphManifest.counts.totalEdges,
      publicSafeNodeCount: graph.graphManifest.counts.publicSafeNodes,
      publicSafeEdgeCount: graph.graphManifest.counts.publicSafeEdges,
    },
    sourceVault: {
      vaultId: graph.vaultManifest.vaultId,
      artifactCount: graph.vaultManifest.counts.artifacts,
      publicSafeArtifactCount: graph.vaultManifest.counts.publicSafeArtifacts,
    },
    outputCaps: {
      maxInitialCandidates: MAX_INITIAL_CANDIDATES,
      maxExpandedCandidates: MAX_EXPANDED_CANDIDATES,
      maxGraphDepth: MAX_DEPTH,
      maxGraphNodes: MAX_GRAPH_NODES,
      maxGraphEdges: MAX_GRAPH_EDGES,
      maxEvidenceRouteItems: MAX_EVIDENCE_ROUTE_ITEMS,
      maxVaultPackRefs: MAX_VAULT_PACK_REFS,
    },
    fixtures,
    summary: {
      fixtureCount: fixtures.length,
      candidateCount: fixtures.reduce((sum, item) => sum + item.candidates.length, 0),
      selectedCandidateCount: fixtures.reduce((sum, item) => sum + item.selectedCandidateIds.length, 0),
      requiresReviewCandidateCount: fixtures.reduce((sum, item) => sum + item.requiresReviewCandidateIds.length, 0),
      requiresEscalationCandidateCount: fixtures.reduce((sum, item) => sum + item.requiresEscalationCandidateIds.length, 0),
      rejectedCandidateCount: fixtures.reduce((sum, item) => sum + item.rejectedCandidateIds.length, 0),
      unresolvedSeedCount: fixtures.reduce((sum, item) => sum + item.seed.unresolvedNodeIds.length, 0),
      publicSafeCandidateCount: 0,
    },
    publicBoundary: {
      privateOnly: true,
      publicSafeCandidateCount: 0,
      publicSafeGraphNodeCount: graph.graphManifest.counts.publicSafeNodes,
      publicSafeGraphEdgeCount: graph.graphManifest.counts.publicSafeEdges,
      publicSafeVaultArtifactCount: graph.vaultManifest.counts.publicSafeArtifacts,
      publicReleaseApproved: false,
      publicRouteExposed: false,
    },
  };
  const artifactPath = path.join(OUT_DIR, 'candidate-expansion.json');
  const checksumSha256 = await writeJson(artifactPath, artifact);
  const manifest = {
    schemaVersion: 'cp24.retrieval-artifact-manifest.v1',
    checkpoint: 'CP24-G03',
    generatedAt,
    privateOnly: true,
    publicReleaseApproved: false,
    artifactPaths: {
      candidateExpansion: 'data/retrieval/cp24/candidate-expansion.json',
    },
    checksums: {
      candidateExpansionSha256: checksumSha256,
    },
    counts: artifact.summary,
    sourceGraph: artifact.sourceGraph,
    sourceVault: artifact.sourceVault,
    verifier: {
      command: 'node scripts/check_cp24_g03_candidate_graph_expansion.mjs',
      status: 'pending',
    },
  };
  await writeJson(path.join(OUT_DIR, 'manifest.json'), manifest);
  console.log(JSON.stringify({ status: 'pass', checkpoint: 'CP24-G03', outputDir: OUT_DIR, counts: artifact.summary }, null, 2));
}

await main();
