import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { access, readFile, readdir } from 'fs/promises';
import { join } from 'path';
import type {
  GuidanceSession,
  GuidanceSessionEntryPoint,
  GuidanceSessionLearningPath,
  GuidanceSessionQuranAnchor,
  GuidanceSessionRequest,
  GuidanceSessionResponse,
  GuidanceSessionRiskAssessment,
  GuidanceSessionSunnahSupport,
  GuidanceResearchSuggestion,
  HadithCollectionsResponse,
  HadithDetailResponse,
  HadithRecordsResponse,
  PrivateAnswerDraftResponse,
  PrivateAnswerValidationRunResponse,
  PrivateCp23RemediationItem,
  PrivateCp23ReviewAuditEvent,
  PrivateCp23ValidationImpact,
  PrivateCp24EvidenceCandidate,
  PrivateCp24EvidenceRoute,
  PrivateCp24EvidenceRouteItem,
  PrivateCp24GraphAwareRetrievalRequest,
  PrivateCp24GraphAwareRetrievalResponse,
  PrivateCp24GraphMode,
  PrivateCp24OutputCaps,
  PrivateCp24RetrievalDomain,
  PrivateCp24RetrievalIntent,
  PrivateCp24ReviewState,
  PrivateCp24ReviewerHandoff,
  PrivateCp24SelectionState,
  PrivateCp24ValidationHandoff,
  PrivateCp25PublicBoundary,
  PrivateCp25RemediationState,
  PrivateCp25ReviewAuditEvent,
  PrivateCp25ReviewerAction,
  PrivateCp25ReviewerActionRequest,
  PrivateCp25ReviewerActionResponse,
  PrivateCp25ReviewerActionValidation,
  PrivateCp25ReviewerRole,
  PrivateCp25ReviewQueueItem,
  PrivateCp25ReviewStatus,
  PrivateCp25WorkbenchStateResponse,
  PrivateCp26PublicBoundaryStatus,
  PrivateCp26RefreshStatus,
  PrivateCp26SnapshotStatusResponse,
  PrivateCp26UnresolvedReference,
  PrivateCp27InternalUiInspectionResponse,
  PrivateCp27PublicBoundaryStatus,
  PrivateGuidedAnswerResponse,
  PrivateKnowledgeGraphifyCp21cResponse,
  PrivateKnowledgeGraphifyCp22Response,
  PrivateCp23EvidenceCandidate,
  PrivateCp23EvidenceRouteItem,
  PrivateCp23ReviewQueueItem,
  PrivateCp23ReviewerExports,
  PrivateCp23SelectionState,
  PrivateSearchResult,
  PrivateSourceSearchGroup,
  PrivateSourceSearchGroupKey,
  PrivateSourceSearchResponse,
  RafiqDeepLink,
  PrivateModelAdapterRunResponse,
  PrivateModelAdapterStatusResponse,
  PrivateRetrievalTraceResponse,
  PrivateReviewQueueItemResponse,
  PrivateReviewQueueResponse,
  PrivateReviewWorkbenchCp23Response,
  PrivateSearchResponse,
  PrivateSourceDetailResponse,
  QuranSurahResponse,
  QuranSurahAyah,
  TafsirStudyResponse,
} from '@rafiq/shared';
import { PrivateContentRepository } from './private-content.repository.js';

type HadithTextVersion = HadithDetailResponse['textVersions'][number];
type HadithTextQualitySeverity = NonNullable<HadithTextVersion['qualitySeverity']>;
type HadithTextQualityFlag = NonNullable<HadithTextVersion['qualityFlags']>[number];

type QuranOptions = {
  quran?: string;
  translation?: string;
  tafsir?: string;
};

type HadithListOptions = {
  collection?: string;
  language?: string;
  limit?: number;
  offset?: number;
};

type SearchOptions = {
  q: string;
  domain?: string;
  limit?: number;
  offset?: number;
};

type SourceSearchOptions = SearchOptions;

type Cp24GraphAwareRetrievalApiRequest = {
  queryText: string;
  fixtureId?: string;
  intent?: string;
  language?: string;
  domain?: string;
  graphMode?: string;
  limit?: number;
  offset?: number;
  maxDepth?: number;
};

type ReviewQueueOptions = {
  status?: string;
  queueType?: string;
  limit?: number;
  offset?: number;
};

type AnswerDraftOptions = {
  q: string;
  intent?: string;
  language?: string;
  domain?: string;
  limit?: number;
};

type AnswerValidationRunOptions = {
  guidedAnswerId: string;
  modelAdapterRunId?: string;
  candidateAnswer?: string;
};

type Cp22GraphNode = {
  id: string;
  type: string;
  label: string;
  partition: string;
  canonicalRef?: unknown;
  sourceRefs?: unknown[];
  provenanceRefs?: string[];
  releaseStateRefs?: string[];
  releaseState?: string;
  reviewState?: string;
  qualityState?: string;
  accessLevel?: string;
  publicSafe?: boolean;
  metadata?: Record<string, unknown>;
};

type Cp22GraphEdge = {
  id: string;
  type: string;
  from: string;
  to: string;
  fromPartition?: string;
  toPartition?: string;
  releaseState?: string;
  reviewState?: string;
  accessLevel?: string;
  publicSafe?: boolean;
  sourceRefs?: unknown[];
  evidenceRefs?: string[];
  metadata?: Record<string, unknown>;
};

type Cp22Partition = {
  nodes?: Cp22GraphNode[];
  edges?: Cp22GraphEdge[];
};

type Cp22GraphManifest = {
  graphId: string;
  checkpoint: string;
  counts: {
    totalNodes: number;
    totalEdges: number;
    partitions: number;
    indexes: number;
    publicSafeNodes: number;
    publicSafeEdges: number;
  };
  checksums?: {
    graphChecksumSha256?: string;
  };
  partitions: Array<{
    name: string;
    path: string;
    nodeCount: number;
    edgeCount: number;
    checksumSha256: string;
    publicSafeNodeCount: number;
    publicSafeEdgeCount: number;
  }>;
  indexes: Array<{
    name: string;
    path: string;
    entryCount: number;
  }>;
};

type Cp22VaultManifest = {
  vaultId: string;
  checkpoint: string;
  counts: {
    artifacts: number;
    categories: number;
    publicSafeArtifacts: number;
    graphNodesReferenced: number;
  };
  categoryCounts: Record<string, number>;
  artifacts: Array<{
    artifactId: string;
    artifactType: string;
    title: string;
    category: string;
    path: string;
    publicSafe: boolean;
    graphNodeIds: string[];
    canonicalRefs: string[];
    sourceRefs: string[];
  }>;
};

type Cp24RetrievalManifest = {
  checkpoint: string;
  artifactPaths: {
    candidateExpansion?: string;
    rankingSelection?: string;
    validationHandoff?: string;
  };
  checksums: {
    rankingSelectionSha256?: string;
    validationHandoffSha256?: string;
  };
  counts: {
    validationHandoff?: {
      remediationCount?: number;
      highOrCriticalRemediationCount?: number;
      publicSafeRouteItemCount?: number;
    };
  };
  sourceGraph: {
    graphId: string;
    graphChecksumSha256: string;
    nodeCount: number;
    edgeCount: number;
    publicSafeNodeCount: number;
    publicSafeEdgeCount: number;
  };
  sourceVault: {
    vaultId: string;
    artifactCount: number;
    publicSafeArtifactCount: number;
  };
};

type Cp24RankingFixture = {
  fixtureId: string;
  query: PrivateCp24GraphAwareRetrievalRequest;
  rankedCandidates: PrivateCp24EvidenceCandidate[];
};

type Cp24RankingSelectionArtifact = {
  schemaVersion: string;
  checkpoint: 'CP24-G04';
  fixtures: Cp24RankingFixture[];
};

type Cp24ValidationRemediationItem = {
  remediationId: string;
  evidenceRouteId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  issueType: string;
  targetGraphNodeIds: string[];
  targetCanonicalRefs: string[];
  recommendedOwner: string;
  recommendedAction: string;
  blockingStatus: string;
  publicReleaseApproved: false;
};

type Cp24ValidationRoute = {
  fixtureId: string;
  evidenceRoute: PrivateCp24EvidenceRoute;
  validationHandoff: PrivateCp24ValidationHandoff;
  remediationItems: Cp24ValidationRemediationItem[];
};

type Cp24ValidationHandoffArtifact = {
  schemaVersion: string;
  checkpoint: 'CP24-G05';
  privateOnly: true;
  publicReleaseApproved: false;
  routes: Cp24ValidationRoute[];
  summary: {
    publicSafeRouteItemCount: number;
  };
  publicBoundary: {
    privateOnly: true;
    publicSafeRouteItemCount: 0;
    publicReleaseApproved: false;
    publicRouteExposed: false;
  };
};

type Cp25AuditDecisionLedgerManifest = {
  checkpoint: 'CP25-A04';
  counts: {
    queueItemCount: number;
    remediationStateCount: number;
    auditEventCount: number;
    publicSafeCandidateCount: 0;
    publicSafeRouteItemCount: 0;
  };
  publicBoundary: PrivateCp25PublicBoundary;
};

type Cp25TransitionRulesArtifact = {
  schemaVersion: string;
  checkpoint: 'CP25-A04';
  actionTargetStatus: Record<PrivateCp25ReviewerAction, PrivateCp25ReviewStatus>;
  allowedTransitions: Record<string, string[]>;
  publicBoundary: PrivateCp25PublicBoundary;
};

type Cp26LatestSnapshotPointer = {
  snapshotBatchId: string;
  manifestPath: string;
  manifestSha256: string;
};

type Cp26LatestRefreshPointer = {
  refreshRunId: string;
  refreshRunPath: string;
  refreshRunSha256: string;
};

type Cp26LatestDiffPointer = {
  proofId: string;
  manifestPath: string;
  manifestSha256: string;
};

type Cp26SnapshotManifestSummary = {
  snapshotBatchId: string;
  checkpoint: string;
  generatedAt: string;
  checksumLedgerPath: string;
  checksumLedgerSha256: string;
  counts: {
    sourceGroupCount: number;
    snapshotArtifactCount: number;
    unresolvedReferenceCount: number;
    highOrCriticalBlockerCount: number;
    publicSafeSnapshotRowCount: 0;
    publicSafeGraphNodeCount: 0;
    publicSafeGraphEdgeCount: 0;
    publicSafeVaultArtifactCount: 0;
  };
};

type Cp26ChecksumLedgerSummary = {
  counts: {
    totalEntries: number;
    newCount: number;
    unchangedCount: number;
    changedCount: number;
    removedCount: number;
    missingCount: number;
    staleCount: number;
  };
};

type Cp26RefreshRunSummary = {
  refreshRunId: string;
  status: PrivateCp26RefreshStatus;
  unresolvedReferenceReportPath: string;
  counts: {
    refreshedOutputCount: number;
    unresolvedReferenceCount: number;
    highOrCriticalBlockerCount: number;
  };
};

type Cp26DiffProofSummary = {
  proofId: string;
  artifactPaths: {
    rollbackManifest: string;
  };
  counts: {
    totalChecksumEntryCount: number;
    unchangedCount: number;
    addedCount: number;
    changedCount: number;
    removedCount: number;
    staleArtifactCount: number;
    mismatchedArtifactCount: number;
    detectedMismatchProbeCount: number;
  };
};

type Cp26UnresolvedReferenceSummary = {
  counts: {
    total: number;
    blocking: number;
    reviewRequired: number;
    highOrCritical: number;
  };
  references: PrivateCp26UnresolvedReference[];
};

type Cp26RollbackSummary = {
  rollbackManifestId: string;
  rollbackTarget: 'generated_private_artifacts_only';
  restoreSteps: Array<{
    stepId: string;
    action: string;
    targetPath: string;
    priorChecksumSha256: string;
    notes: string;
  }>;
};

type Cp27PublicBoundarySummary = {
  privateOnly: true;
  publicReleaseApproved: false;
  publicRouteExposed: false;
  publicSafeChangeRequested: false;
  publicSafeSnapshotRowCount: 0;
  publicSafeGraphNodeCount: 0;
  publicSafeGraphEdgeCount: 0;
  publicSafeVaultArtifactCount: 0;
  publicSafeRetrievalCandidateCount: 0;
  publicSafeRouteItemCount: 0;
  publicSafeReviewItemCount: 0;
  publicSafeAuditEventCount: 0;
  message: string;
};

type Cp27CountsSummary = {
  totalNodes: number;
  totalEdges: number;
  partitions: number;
  indexes: number;
  sourceGroupCount: number;
  mappedSourceGroupCount: number;
  deferredItemCount: number;
  blockedItemCount: number;
  unresolvedReferenceCount: number;
  highOrCriticalBlockerCount: number;
  publicSafeNodes: 0;
  publicSafeEdges: 0;
};

type Cp27LatestGraphPointer = {
  checkpoint: 'CP27-G03';
  graphId: string;
  manifestPath: string;
  manifestSha256: string;
  summaryPath: string;
  checksumLedgerPath: string;
  checksumLedgerSha256: string;
  counts: Cp27CountsSummary;
  publicBoundary: Cp27PublicBoundarySummary;
};

type Cp27PartitionSummary = {
  name: string;
  path: string;
  nodeCount: number;
  edgeCount: number;
  checksumSha256: string;
  publicSafeNodeCount: 0;
  publicSafeEdgeCount: 0;
};

type Cp27IndexSummary = {
  name: string;
  path: string;
  checksumSha256: string;
  entryCount: number;
};

type Cp27GraphSummary = {
  partitionSummary: Cp27PartitionSummary[];
  indexSummary: Cp27IndexSummary[];
};

type Cp27LatestVaultPointer = {
  checkpoint: 'CP27-G04';
  vaultId: string;
  manifestPath: string;
  manifestSha256: string;
  summaryPath: string;
  checksumLedgerPath: string;
  checksumLedgerSha256: string;
  counts: {
    artifacts: number;
    categories: number;
    graphNodesReferenced: number;
    sourceGraphNodes: number;
    sourceGraphEdges: number;
    publicSafeArtifacts: 0;
  };
  publicBoundary: Cp27PublicBoundarySummary;
};

type Cp27VaultSummary = {
  categoryCounts: Record<string, number>;
};

type Cp27LatestDiffPointer = {
  proofId: string;
  checkpoint: 'CP27-G05';
  manifestPath: string;
  manifestSha256: string;
  counts: {
    graphBaselineNodes: number;
    graphRefreshedNodes: number;
    graphBaselineEdges: number;
    graphRefreshedEdges: number;
    vaultBaselineArtifacts: number;
    vaultRefreshedArtifacts: number;
    matchedCount: number;
    addedCount: number;
    removedCount: number;
    changedCount: number;
    deferredCount: number;
    blockedCount: number;
    unresolvedReferenceCount: number;
    highOrCriticalBlockerCount: number;
  };
  publicBoundary: Cp27PublicBoundarySummary;
};

type ExpandedGuidanceNeed = {
  confidence: number;
  reason: string;
  searchInput: string;
  theme: string;
};

type RiskPrecheck = GuidanceSessionRiskAssessment & {
  hardEscalation: boolean;
};

const SAFETY_TERMS = [
  'harm myself',
  'hurt myself',
  'kill myself',
  'suicide',
  'end my life',
  'self harm',
  'self-harm',
  'abuse',
  'emergency',
  'crisis',
  'violence',
];

const MEDICAL_LEGAL_TERMS = [
  'stop my medication',
  'medication',
  'medicine',
  'doctor',
  'diagnosis',
  'treatment',
  'therapy',
  'hospital',
  'legal',
  'lawyer',
  'court',
  'lawsuit',
];

const SCHOLAR_ESCALATION_TERMS = [
  'halal',
  'haram',
  'fatwa',
  'ruling',
  'divorce',
  'talaq',
  'inheritance',
  'business contract',
  'contract',
  'riba',
  'interest',
  'loan',
  'mortgage',
  'zakat',
  'marriage dispute',
  'nikah',
  'worship ruling',
];

const DEFAULT_NOTICE = {
  label: 'UNAPPROVED CONTENT - NOT FOR PUBLICATION',
  message:
    'Private RAFIQ development and testing only. Do not expose through public API, public app, exports, or AI answers until approval gates pass.',
  rightsStatus: 'pending',
  attributionStatus: 'pending',
  editorialStatus: 'unreviewed',
  scholarContentStatus: 'unreviewed',
  publicationStatus: 'private_only',
};

const CP21C_MATRIX_PATH = 'data/graphify/cp21c/cases.json';
const CP21C_EVIDENCE_PATH = 'data/graphify/cp21c/evidence.json';
const CP21C_GRAPH_PATH = 'data/graphify/cp21c/resource-graph.json';
const CP21C_RANKING_SUMMARY_PATH = 'data/graphify/cp21c/ranking-summary.json';
const CP21C_VAULT_PACK_DIR = 'data/vault/cp21c/ranking-cases';
const CP22_GRAPH_MANIFEST_PATH = 'data/graphify/full-private/manifest.json';
const CP22_GRAPH_SUMMARY_PATH = 'data/graphify/full-private/summary.json';
const CP22_GRAPH_DIR = 'data/graphify/full-private';
const CP22_VAULT_MANIFEST_PATH = 'data/vault/full-private/manifest.json';
const CP22_VAULT_DIR = 'data/vault/full-private';
const CP23_REVIEW_EXPORT_MANIFEST_PATH = 'data/review/cp23/manifest.json';
const CP23_REVIEW_AUDIT_EXPORT_PATH = 'data/review/cp23/audit-trail-export.json';
const CP23_REVIEW_REMEDIATION_EXPORT_PATH = 'data/review/cp23/remediation-export.json';
const CP24_RETRIEVAL_MANIFEST_PATH = 'data/retrieval/cp24/manifest.json';
const CP24_RANKING_SELECTION_PATH = 'data/retrieval/cp24/ranking-selection.json';
const CP24_VALIDATION_HANDOFF_PATH = 'data/retrieval/cp24/validation-handoff.json';
const CP25_REVIEW_QUEUE_PATH = 'data/review/cp25/review-queue.json';
const CP25_REMEDIATION_STATE_PATH = 'data/review/cp25/remediation-state.json';
const CP25_AUDIT_EVENTS_PATH = 'data/review/cp25/audit-events.json';
const CP25_AUDIT_LEDGER_MANIFEST_PATH = 'data/review/cp25/audit-decision-ledger-manifest.json';
const CP25_TRANSITION_RULES_PATH = 'data/review/cp25/transition-rules.json';
const CP26_LATEST_SNAPSHOT_PATH = 'data/snapshots/cp26/latest-manifest.json';
const CP26_LATEST_REFRESH_PATH = 'data/snapshots/cp26/latest-refresh.json';
const CP26_LATEST_DIFF_PATH = 'data/snapshots/cp26/latest-diff.json';
const CP27_LATEST_GRAPH_PATH = 'data/graphify/cp27-refresh/latest-graph.json';
const CP27_LATEST_VAULT_PATH = 'data/vault/cp27-refresh/latest-vault.json';
const CP27_LATEST_DIFF_PATH = 'data/graphify/cp27-refresh/latest-diff.json';
const CP27_LATEST_UI_PROOF_PATH = 'data/graphify/cp27-refresh/latest-internal-ui-proof.json';

const CP24_DEFAULT_OUTPUT_CAPS: PrivateCp24OutputCaps = {
  maxInitialCandidates: 8,
  maxExpandedCandidates: 12,
  maxGraphNodes: 40,
  maxGraphEdges: 80,
  maxEvidenceRouteItems: 12,
  maxVaultPackRefs: 8,
};

async function readJsonArtifact<T>(artifactPath: string): Promise<T> {
  return JSON.parse(await readFile(await resolveArtifactPath(artifactPath), 'utf8')) as T;
}

async function readOptionalJsonArtifact<T>(artifactPath: string): Promise<T | null> {
  try {
    return await readJsonArtifact<T>(artifactPath);
  } catch {
    return null;
  }
}

async function resolveArtifactPath(artifactPath: string): Promise<string> {
  const candidates = [
    artifactPath,
    join('..', '..', artifactPath),
  ];
  for (const candidate of candidates) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      // Try the next candidate.
    }
  }
  return artifactPath;
}

function compactArtifactPreview(content: string, maxLength = 420): string {
  const cleaned = content
    .replace(/^---[\s\S]*?---\s*/m, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  if (cleaned.length <= maxLength) return cleaned;
  return `${cleaned.slice(0, maxLength).trim()}...`;
}

function markdownHeadings(content: string): string[] {
  return content
    .split(/\r?\n/)
    .filter((line) => /^##?\s+/.test(line))
    .map((line) => line.replace(/^#+\s+/, '').trim())
    .slice(0, 10);
}

function caseVaultPackPath(caseId: string): string {
  return `${CP21C_VAULT_PACK_DIR}/${caseId.toLowerCase()}.md`;
}

function graphRefToString(ref: unknown): string | null {
  if (!ref) return null;
  if (typeof ref === 'string') return ref;
  if (typeof ref !== 'object') return String(ref);
  const value = ref as Record<string, unknown>;
  const schemaRef = [value.schema, value.table, value.id].filter(Boolean).join(':');
  if (schemaRef) return schemaRef;
  const typedRef = [value.type, value.id].filter(Boolean).join(':');
  return typedRef || JSON.stringify(value);
}

function graphRefsToStrings(refs: unknown): string[] {
  if (!Array.isArray(refs)) return [];
  return refs.map(graphRefToString).filter((item): item is string => Boolean(item));
}

function countByField<T>(items: T[], key: (item: T) => string | undefined): Record<string, number> {
  return items.reduce<Record<string, number>>((counts, item) => {
    const value = key(item) ?? 'unknown';
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}

function lookupNodeIds(value: unknown): string[] {
  if (!value) return [];
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === 'string');
  if (typeof value !== 'object') return [];
  const item = value as Record<string, unknown>;
  const ids = [
    item.id,
    item.nodeId,
    item.ayahNodeId,
    item.hadithNodeId,
    item.hadithRecordNodeId,
  ].filter((entry): entry is string => typeof entry === 'string');
  return ids;
}

function uniqueStrings(items: Array<string | null | undefined>): string[] {
  return [...new Set(items.filter((item): item is string => Boolean(item)))];
}

function cp24Literal<T extends string>(value: string | undefined, allowed: readonly T[], fallback: T): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

function cp24Caps(request: Cp24GraphAwareRetrievalApiRequest, fixture: Cp24RankingFixture): PrivateCp24OutputCaps {
  const fixtureCaps = fixture.query.outputCaps ?? CP24_DEFAULT_OUTPUT_CAPS;
  const maxExpandedCandidates = Math.min(fixtureCaps.maxExpandedCandidates, CP24_DEFAULT_OUTPUT_CAPS.maxExpandedCandidates);
  const requestedLimit = request.limit ?? fixtureCaps.maxInitialCandidates;
  return {
    maxInitialCandidates: Math.min(requestedLimit, fixtureCaps.maxInitialCandidates, CP24_DEFAULT_OUTPUT_CAPS.maxInitialCandidates),
    maxExpandedCandidates,
    maxGraphNodes: Math.min(fixtureCaps.maxGraphNodes, CP24_DEFAULT_OUTPUT_CAPS.maxGraphNodes),
    maxGraphEdges: Math.min(fixtureCaps.maxGraphEdges, CP24_DEFAULT_OUTPUT_CAPS.maxGraphEdges),
    maxEvidenceRouteItems: Math.min(fixtureCaps.maxEvidenceRouteItems, CP24_DEFAULT_OUTPUT_CAPS.maxEvidenceRouteItems),
    maxVaultPackRefs: Math.min(fixtureCaps.maxVaultPackRefs, CP24_DEFAULT_OUTPUT_CAPS.maxVaultPackRefs),
  };
}

function cp24BoundRoute(
  route: PrivateCp24EvidenceRoute,
  caps: PrivateCp24OutputCaps,
  graphMode: PrivateCp24GraphMode,
): PrivateCp24EvidenceRoute {
  const selectedEvidence = route.selectedEvidence.slice(0, caps.maxEvidenceRouteItems);
  const remainingAfterSelected = Math.max(0, caps.maxEvidenceRouteItems - selectedEvidence.length);
  const escalationEvidence = route.escalationEvidence.slice(0, remainingAfterSelected);
  const remainingAfterEscalation = Math.max(0, remainingAfterSelected - escalationEvidence.length);
  const rejectedEvidence = route.rejectedEvidence.slice(0, remainingAfterEscalation);
  const routeItemIds = new Set([
    ...selectedEvidence,
    ...escalationEvidence,
    ...rejectedEvidence,
  ].map((item) => item.routeItemId));

  return {
    ...route,
    graphMode,
    selectedEvidence,
    rejectedEvidence,
    escalationEvidence,
    validationGateResults: route.validationGateResults.map((result) => ({
      ...result,
      evidenceRouteItemIds: result.evidenceRouteItemIds.filter((id) => routeItemIds.has(id)),
    })),
  };
}

function cp24BoundValidationHandoff(
  handoff: PrivateCp24ValidationHandoff,
  route: PrivateCp24EvidenceRoute,
  remediations: Cp24ValidationRemediationItem[],
): PrivateCp24ValidationHandoff {
  return {
    ...handoff,
    selectedEvidenceRouteItemIds: route.selectedEvidence.map((item) => item.routeItemId),
    selectedCanonicalRefs: route.selectedEvidence.map((item) => item.canonicalRef),
    selectedGraphNodeIds: uniqueStrings(route.selectedEvidence.flatMap((item) => item.graphNodeIds)),
    citedSourceIds: uniqueStrings(route.selectedEvidence.flatMap((item) => item.sourceIds)),
    missingCitationIds: route.rejectedEvidence.map((item) => item.routeItemId),
    unresolvedReferenceIds: route.rejectedEvidence
      .filter((item) => item.graphNodeIds.length === 0 || item.sourceIds.length === 0 || item.provenanceIds.length === 0 || item.releaseStateIds.length === 0)
      .map((item) => item.candidateId),
    remediationIds: remediations.map((item) => item.remediationId),
    publicReleaseApproved: false,
  };
}

function cp24ReviewerRole(owner: string): PrivateCp24ReviewerHandoff['requiredReviewerRoles'][number] {
  if (['technical_reviewer', 'knowledge_editor', 'scholar_reviewer', 'product_owner', 'admin', 'developer_private'].includes(owner)) {
    return owner as PrivateCp24ReviewerHandoff['requiredReviewerRoles'][number];
  }
  return 'technical_reviewer';
}

function cp24RouteItemIds(route: PrivateCp24EvidenceRoute): Set<string> {
  return new Set([
    ...route.selectedEvidence,
    ...route.rejectedEvidence,
    ...route.escalationEvidence,
  ].map((item) => item.routeItemId));
}

function cp24ReviewerHandoff(
  route: PrivateCp24EvidenceRoute,
  remediations: Cp24ValidationRemediationItem[],
): PrivateCp24ReviewerHandoff {
  const now = new Date().toISOString();
  const routeItemIds = cp24RouteItemIds(route);
  const routeItems = [
    ...route.selectedEvidence,
    ...route.rejectedEvidence,
    ...route.escalationEvidence,
  ];
  const routeItemForRemediation = (item: Cp24ValidationRemediationItem): PrivateCp24EvidenceRouteItem | undefined =>
    routeItems.find((routeItem) => item.targetCanonicalRefs.includes(routeItem.canonicalRef));
  const boundedRemediations = remediations.filter((item) => routeItemIds.size === 0 || routeItemForRemediation(item));
  const queueItems = boundedRemediations.map((item): PrivateCp23ReviewQueueItem => {
    const routeItem = routeItemForRemediation(item);
    return {
      queueItemId: `review-queue:${item.remediationId}`,
      queueType: item.issueType === 'escalation_required' ? 'cp24_escalation' : 'cp24_validation_handoff',
      subjectType: item.issueType,
      subjectId: routeItem?.candidateId ?? item.targetCanonicalRefs[0] ?? item.remediationId,
      title: `CP24 review: ${item.issueType}`,
      summary: item.recommendedAction,
      severity: item.severity,
      reviewStatus: 'queued',
      assignedRole: cp24ReviewerRole(item.recommendedOwner),
      sourceIds: routeItem?.sourceIds ?? [],
      graphNodeIds: item.targetGraphNodeIds.slice(0, 8),
      graphEdgeIds: routeItem?.graphEdgeIds?.slice(0, 8) ?? [],
      vaultPackIds: routeItem?.vaultPackIds?.slice(0, 8) ?? [],
      evidenceRouteIds: [item.evidenceRouteId],
      remediationIds: [item.remediationId],
      createdAt: now,
      updatedAt: now,
    };
  });
  const remediationItems = boundedRemediations.map((item): PrivateCp23RemediationItem => {
    const routeItem = routeItemForRemediation(item);
    return {
      remediationId: item.remediationId,
      queueItemId: `review-queue:${item.remediationId}`,
      subjectType: item.issueType,
      subjectId: routeItem?.candidateId ?? item.targetCanonicalRefs[0] ?? item.remediationId,
      reason: item.recommendedAction,
      severity: item.severity,
      issueType: item.issueType,
      canonicalRefs: item.targetCanonicalRefs,
      sourceIds: routeItem?.sourceIds ?? [],
      requiredAction: item.recommendedAction,
      verificationMethod: 'node scripts\\check_cp24_g06_private_api_prototype.mjs',
      blockingStatus: item.blockingStatus,
      closurePath: 'Resolve the CP24 validation handoff remediation, regenerate artifacts, and rerun CP24 verification.',
      closureNotes: null,
      graphNodeIds: item.targetGraphNodeIds.slice(0, 8),
      graphEdgeIds: routeItem?.graphEdgeIds?.slice(0, 8) ?? [],
      vaultPackIds: routeItem?.vaultPackIds?.slice(0, 8) ?? [],
      ownerRole: cp24ReviewerRole(item.recommendedOwner),
      status: 'open',
    };
  });
  const auditEvents = queueItems.map((item): PrivateCp23ReviewAuditEvent => ({
    auditEventId: `cp24-audit:${item.queueItemId}`,
    eventType: 'cp24_private_api_handoff_previewed',
    actorRole: 'system_prototype',
    action: 'queue_for_validation_review',
    fromStatus: 'candidate',
    toStatus: item.reviewStatus,
    reviewerRole: item.assignedRole,
    reviewerId: null,
    subjectType: item.subjectType,
    subjectId: item.subjectId,
    evidenceRouteId: route.evidenceRouteId,
    queueItemId: item.queueItemId,
    sourceIds: item.sourceIds,
    graphNodeIds: item.graphNodeIds,
    graphEdgeIds: item.graphEdgeIds,
    vaultPackIds: item.vaultPackIds,
    remediationIds: item.remediationIds,
    notes: 'Read-only CP24-G06 private API prototype handoff; no reviewer action is persisted.',
    createdAt: now,
  }));

  return {
    queueItems,
    remediationItems,
    auditEvents,
    requiredReviewerRoles: uniqueStrings(queueItems.map((item) => cp24ReviewerRole(item.assignedRole))) as PrivateCp24ReviewerHandoff['requiredReviewerRoles'],
    openBlockingRemediationCount: remediationItems.filter((item) => item.blockingStatus?.includes('blocking') || ['high', 'critical'].includes(item.severity)).length,
  };
}

function cp25PublicBoundary(message: string): PrivateCp25PublicBoundary {
  return {
    privateOnly: true,
    publicReleaseApproved: false,
    publicRouteExposed: false,
    publicSafeChangeRequested: false,
    publicSafeCandidateCount: 0,
    publicSafeRouteItemCount: 0,
    publicSafeGraphNodeCount: 0,
    publicSafeGraphEdgeCount: 0,
    publicSafeVaultArtifactCount: 0,
    message,
  };
}

function cp26PublicBoundary(message: string): PrivateCp26PublicBoundaryStatus {
  return {
    privateOnly: true,
    publicReleaseApproved: false,
    publicRouteExposed: false,
    publicSafeChangeRequested: false,
    publicSafeSnapshotRowCount: 0,
    publicSafeGraphNodeCount: 0,
    publicSafeGraphEdgeCount: 0,
    publicSafeVaultArtifactCount: 0,
    publicSafeRetrievalCandidateCount: 0,
    publicSafeRouteItemCount: 0,
    publicSafeReviewItemCount: 0,
    publicSafeAuditEventCount: 0,
    message,
  };
}

function cp27PublicBoundary(message: string): PrivateCp27PublicBoundaryStatus {
  return {
    privateOnly: true,
    publicReleaseApproved: false,
    publicRouteExposed: false,
    publicSafeChangeRequested: false,
    publicSafeSnapshotRowCount: 0,
    publicSafeGraphNodeCount: 0,
    publicSafeGraphEdgeCount: 0,
    publicSafeVaultArtifactCount: 0,
    publicSafeRetrievalCandidateCount: 0,
    publicSafeRouteItemCount: 0,
    publicSafeReviewItemCount: 0,
    publicSafeAuditEventCount: 0,
    message,
  };
}

function cp25NotesRequired(
  queueItem: PrivateCp25ReviewQueueItem,
  action: PrivateCp25ReviewerAction,
): boolean {
  return (
    action !== 'claim' ||
    queueItem.notesRequired ||
    ['high', 'critical'].includes(queueItem.severity) ||
    [
      'request_scholar_review',
      'request_product_owner_review',
      'request_remediation',
      'approve_private',
      'mark_public_candidate',
      'reject',
      'defer',
      'retire',
    ].includes(action)
  );
}

function cp25ValidateReviewerAction(
  request: PrivateCp25ReviewerActionRequest,
  queueItem: PrivateCp25ReviewQueueItem,
  transitionRules: Cp25TransitionRulesArtifact,
): PrivateCp25ReviewerActionValidation {
  const toStatus = transitionRules.actionTargetStatus[request.action] ?? 'rejected';
  const notesRequired = cp25NotesRequired(queueItem, request.action);
  const missingRequiredNotes = notesRequired && !String(request.notes ?? '').trim();
  const invalidTransition = !(transitionRules.allowedTransitions[request.fromStatus] ?? []).includes(toStatus);
  const blockedReasons = [
    invalidTransition ? `Transition ${request.fromStatus} -> ${toStatus} is not allowed.` : null,
    missingRequiredNotes ? 'Required notes are missing.' : null,
    request.boundaryAcknowledgement?.privateOnly !== true ? 'Private-only acknowledgement is required.' : null,
    request.boundaryAcknowledgement?.publicReleaseApproved !== false ? 'Public release approval is outside CP25.' : null,
    request.boundaryAcknowledgement?.publicSafeChangeRequested !== false ? 'Public-safe change requests are outside CP25.' : null,
    request.subjectType !== queueItem.subjectType ? 'Request subjectType does not match the queue item.' : null,
    request.subjectId !== queueItem.subjectId ? 'Request subjectId does not match the queue item.' : null,
    request.reviewerRole !== queueItem.assignedRole ? 'Reviewer role does not match the assigned queue role.' : null,
  ].filter((item): item is string => Boolean(item));

  return {
    allowed: blockedReasons.length === 0,
    toStatus,
    notesRequired,
    missingRequiredNotes,
    invalidTransition,
    blockedReasons,
    publicBoundary: cp25PublicBoundary('CP25-A05 validates private reviewer actions only. Public release remains blocked.'),
  };
}

function nodeCanonicalRef(node: Cp22GraphNode): string {
  return graphRefToString(node.canonicalRef) ?? node.id;
}

function edgeIdsForNode(edges: Cp22GraphEdge[], nodeId: string, limit = 4): string[] {
  return edges
    .filter((edge) => edge.from === nodeId || edge.to === nodeId)
    .slice(0, limit)
    .map((edge) => edge.id);
}

function vaultPackIdsForNode(vaultManifest: Cp22VaultManifest, nodeId: string, limit = 3): string[] {
  return vaultManifest.artifacts
    .filter((artifact) => artifact.graphNodeIds.includes(nodeId))
    .slice(0, limit)
    .map((artifact) => artifact.artifactId);
}

function candidateFromNode(
  node: Cp22GraphNode,
  edges: Cp22GraphEdge[],
  vaultManifest: Cp22VaultManifest,
  selectionState: PrivateCp23SelectionState,
  selectionReason: string,
  rankingSignals: string[],
): PrivateCp23EvidenceCandidate {
  return {
    candidateId: `cp23-candidate:${node.id}`,
    canonicalRef: nodeCanonicalRef(node),
    contentType: node.type,
    graphNodeIds: [node.id],
    graphEdgeIds: edgeIdsForNode(edges, node.id, 4),
    sourceIds: graphRefsToStrings(node.sourceRefs).slice(0, 6),
    provenanceIds: (node.provenanceRefs ?? []).slice(0, 6),
    releaseStateIds: (node.releaseStateRefs ?? []).slice(0, 6),
    qualityState: node.qualityState ?? 'unknown',
    reviewState: node.reviewState ?? 'unknown',
    publicSafe: false,
    vaultPackIds: vaultPackIdsForNode(vaultManifest, node.id, 3),
    rankingSignals,
    selectionState,
    selectionReason,
  };
}

function routeItemFromCandidate(
  candidate: PrivateCp23EvidenceCandidate,
  role: string,
  validationImpact: PrivateCp23EvidenceRouteItem['validationImpact'],
): PrivateCp23EvidenceRouteItem {
  return {
    routeItemId: `cp23-route-item:${candidate.candidateId}`,
    role,
    canonicalRef: candidate.canonicalRef,
    graphNodeIds: candidate.graphNodeIds,
    graphEdgeIds: candidate.graphEdgeIds,
    sourceIds: candidate.sourceIds,
    provenanceIds: candidate.provenanceIds,
    releaseStateIds: candidate.releaseStateIds,
    vaultPackIds: candidate.vaultPackIds,
    selectionState: candidate.selectionState,
    selectionReason: candidate.selectionReason,
    validationImpact,
  };
}

function isGuidanceSessionEntryPoint(value: string): value is GuidanceSessionEntryPoint {
  return ['today', 'ask', 'quran_ayah', 'hadith_record', 'learn_theme', 'growth_resume'].includes(value);
}

function firstSentence(text?: string | null): string {
  const cleaned = text?.replace(/\s+/g, ' ').trim();
  if (!cleaned) return 'Read the Quran anchor slowly, then carry one small action.';
  const [sentence] = cleaned.split(/(?<=[.!?])\s+/);
  return sentence || cleaned;
}

function compactHadithMeaning(text?: string | null): string {
  const cleaned = text
    ?.replace(/\s+/g, ' ')
    .replace(/\b(\w+)\s+\1\b/gi, '$1')
    .trim();
  if (!cleaned) return 'A related narration is available. Open it with reliability notes before applying it.';
  const sentence = firstSentence(cleaned);
  const looksDamaged =
    /\bthe\s+the\b/i.test(text ?? '') ||
    /\bprayer\s+prayer\b/i.test(text ?? '') ||
    /\bdid reply to him but\b/i.test(text ?? '') ||
    sentence.length > 240;
  if (looksDamaged) {
    return 'A related narration is available for this practice. Open the narration study room and read it with reliability notes before applying it.';
  }
  return sentence;
}

function isLatinText(text: string): boolean {
  return /[A-Za-z]/.test(text);
}

function qualityFlagsForHadithText(
  text?: string | null,
  languageCode?: string | null,
): HadithTextQualityFlag[] {
  const cleaned = text?.replace(/\s+/g, ' ').trim() ?? '';
  const flags: HadithTextQualityFlag[] = [];
  if (!cleaned) {
    flags.push('blank_text');
    return flags;
  }

  const latin = isLatinText(cleaned);
  if (
    latin &&
    (/\bdid reply to him but\b/i.test(cleaned) ||
      /\bnarrated\s+narrated\b/i.test(cleaned) ||
      /\bmercy\s+mercy\b/i.test(cleaned) ||
      /\bprayer\s+prayer\b/i.test(cleaned) ||
      /\bthe\s+the\b/i.test(cleaned))
  ) {
    flags.push('known_broken_phrase');
  }
  if (latin && /\b([A-Za-z]{4,})\s+\1\b/i.test(cleaned)) {
    flags.push('repeated_word');
  }
  if (languageCode !== 'ar' && cleaned.length < 24) {
    flags.push('suspicious_short');
  }
  if (languageCode !== 'ar' && cleaned.length > 4000) {
    flags.push('suspicious_long');
  }
  return Array.from(new Set(flags));
}

function severityForHadithQuality(flags: HadithTextQualityFlag[]): HadithTextQualitySeverity {
  if (flags.includes('blank_text') || flags.includes('known_broken_phrase')) return 'withheld';
  if (flags.length > 0) return 'review';
  return 'ok';
}

function hadithQualitySummary(flags: HadithTextQualityFlag[], severity: HadithTextQualitySeverity): string {
  if (severity === 'ok') return 'Text passed the automated meaning-quality scan.';
  if (severity === 'withheld') {
    return 'Meaning text is withheld until review because the automated scan found damaged wording.';
  }
  return 'Meaning text should be reviewed before it is used as public guidance.';
}

function resultVerseKey(result?: PrivateSearchResult | null): string | undefined {
  return result?.reference.verseKey ?? result?.target.verseKey ?? undefined;
}

function resultSurahNumber(result?: PrivateSearchResult | null): number | undefined {
  return result?.reference.surahNumber ?? result?.target.surahNumber ?? undefined;
}

function resultAyahNumber(result?: PrivateSearchResult | null): number | undefined {
  return result?.reference.ayahNumber ?? result?.target.ayahNumber ?? undefined;
}

function resultHadithRecordId(result: PrivateSearchResult): string | null {
  return result.reference.hadithRecordId ?? result.target.hadithRecordId ?? null;
}

function normalizeSearchDomainForRpc(domain?: string): string {
  const normalized = (domain ?? 'all').toLowerCase();
  if (normalized === 'topic') return 'topics';
  if (normalized === 'ayah_theme' || normalized === 'theme') return 'themes';
  if (normalized === 'translation' || normalized === 'verification') return 'all';
  if (['all', 'quran', 'tafsir', 'topics', 'themes', 'hadith'].includes(normalized)) return normalized;
  return 'all';
}

function sourceGroupKeyForResult(result: PrivateSearchResult): PrivateSourceSearchGroupKey {
  if (result.domain === 'topic') return 'topics';
  if (result.domain === 'ayah_theme') return 'themes';
  if (result.domain === 'verification') return 'verification';
  return result.domain;
}

function parseAyahReference(input: string): { surahNumber: number; ayahNumber: number; verseKey: string } | null {
  const match = input.trim().match(/^(\d{1,3})\s*:\s*(\d{1,3})$/);
  if (!match) return null;
  const surahNumber = Number(match[1]);
  const ayahNumber = Number(match[2]);
  if (!Number.isInteger(surahNumber) || !Number.isInteger(ayahNumber)) return null;
  if (surahNumber < 1 || surahNumber > 114 || ayahNumber < 1 || ayahNumber > 286) return null;
  return { surahNumber, ayahNumber, verseKey: `${surahNumber}:${ayahNumber}` };
}

function sourceSearchRoute(query: string, domain = 'all'): string {
  const params = new URLSearchParams({ q: query, domain });
  return `/sources?${params.toString()}`;
}

function sourceDetailRoute(target?: { entityType: string; entityId: string } | null): string | null {
  if (!target) return null;
  const params = new URLSearchParams({ entityType: target.entityType, entityId: target.entityId });
  return `/source-detail?${params.toString()}`;
}

function ayahStudyRoute(surahNumber: number, ayahNumber: number): string {
  return `/quran/${surahNumber}/${ayahNumber}`;
}

function tafsirStudyRoute(passageId?: string | null): string | null {
  return passageId ? `/tafsir/${passageId}` : null;
}

function sourceResultStudyRoute(result: PrivateSearchResult): string {
  if (result.domain === 'tafsir' && result.target.passageId) {
    return tafsirStudyRoute(result.target.passageId) ?? result.target.route;
  }
  const surahNumber = resultSurahNumber(result);
  const ayahNumber = resultAyahNumber(result);
  if (surahNumber && ayahNumber && ['quran', 'translation', 'ayah_theme'].includes(result.domain)) {
    return ayahStudyRoute(surahNumber, ayahNumber);
  }
  return result.target.route;
}

const INTENT_EXPANSIONS: Array<{
  keywords: string[];
  theme: string;
  searchInput: string;
  reason: string;
}> = [
  {
    keywords: ['gratitude', 'grateful', 'thankful', 'shukr', 'syukur'],
    theme: 'Gratitude',
    searchInput: 'gratitude',
    reason: 'Matched gratitude language to the known Quran theme.',
  },
  {
    keywords: ['patience', 'patient', 'sabr', 'difficult conversation', 'hard conversation', 'argument'],
    theme: 'Patience',
    searchInput: 'patience',
    reason: 'Matched difficult interaction language to the known patience theme.',
  },
  {
    keywords: ['rizq', 'provision', 'sustenance', 'income', 'money', 'job', 'nafkah'],
    theme: 'Provision',
    searchInput: 'provision',
    reason: 'Matched provision anxiety language to a broader Quran search theme.',
  },
  {
    keywords: ['anxious', 'anxiety', 'worried', 'worry', 'fear', 'afraid', 'overwhelmed'],
    theme: 'Trust',
    searchInput: 'guidance',
    reason: 'Matched anxiety language to guidance and reliance-oriented Quran evidence.',
  },
  {
    keywords: ['angry', 'anger', 'temper', 'frustrated', 'resentment'],
    theme: 'Restraint',
    searchInput: 'patience',
    reason: 'Matched anger language to patience and restraint evidence.',
  },
  {
    keywords: ['prayer', 'salah', 'solat', 'pray', 'khushu', 'focus'],
    theme: 'Prayer',
    searchInput: 'prayer',
    reason: 'Matched worship language to prayer evidence.',
  },
  {
    keywords: ['intention', 'intentions', 'niyyah', 'niat', 'sincerity', 'ikhlas'],
    theme: 'Intention',
    searchInput: 'intention',
    reason: 'Matched intention language to sincerity and action evidence.',
  },
  {
    keywords: ['mercy', 'rahmah', 'gentle', 'kindness', 'forgive', 'forgiveness'],
    theme: 'Mercy',
    searchInput: 'mercy',
    reason: 'Matched mercy language to the known Quran theme.',
  },
  {
    keywords: ['tawbah', 'taubah', 'repent', 'repentance', 'guilt', 'guilty', 'sin', 'sins'],
    theme: 'Tawbah',
    searchInput: 'mercy',
    reason: 'Matched repentance and guilt language to mercy evidence with Quran tafsir support.',
  },
  {
    keywords: ['unmotivated', 'motivation', 'spiritually tired', 'spiritual tired', 'spiritual low', 'low iman'],
    theme: 'Spiritual Motivation',
    searchInput: 'guidance',
    reason: 'Matched spiritual motivation language to guidance evidence.',
  },
  {
    keywords: ['hope', 'hard week', 'hard day', 'rough week', 'rough day', 'discouraged', 'despair'],
    theme: 'Hope',
    searchInput: 'hope',
    reason: 'Matched hope and discouragement language to hope evidence.',
  },
  {
    keywords: ['lost', 'confused', 'guidance', 'guide', 'direction', 'decision'],
    theme: 'Guidance',
    searchInput: 'guidance',
    reason: 'Matched direction-seeking language to guidance evidence.',
  },
];

function normalizeInput(value: string): string {
  return value.toLowerCase().replace(/\s+/g, ' ').trim();
}

function matchedTerms(normalized: string, terms: string[]): string[] {
  return terms.filter((term) => normalized.includes(term));
}

function ordinaryRiskAssessment(): RiskPrecheck {
  return {
    hardEscalation: false,
    riskClass: 'ordinary_reflection',
    responseState: 'approved',
    summary: 'Ordinary reflection request can continue through Quran-first retrieval.',
    matchedTerms: [],
    escalationRoute: 'none',
    userBoundary: 'RAFIQ can offer sourced reflection, not a ruling.',
  };
}

function assessGuidanceRisk(input: string): RiskPrecheck {
  const normalized = normalizeInput(input);
  const safetyMatches = matchedTerms(normalized, SAFETY_TERMS);
  if (safetyMatches.length > 0) {
    return {
      hardEscalation: true,
      riskClass: 'safety_escalation',
      responseState: 'safety_escalation',
      summary: 'Safety or crisis language detected before guidance assembly.',
      matchedTerms: safetyMatches,
      escalationRoute: 'safety',
      userBoundary:
        'This may involve immediate safety. RAFIQ will not spiritualize a crisis or give ordinary advice; seek urgent local help or trusted professional support now.',
    };
  }

  const medicalLegalMatches = matchedTerms(normalized, MEDICAL_LEGAL_TERMS);
  if (medicalLegalMatches.length > 0) {
    return {
      hardEscalation: true,
      riskClass: 'medical_legal',
      responseState: 'safety_escalation',
      summary: 'Medical or legal advice language detected before guidance assembly.',
      matchedTerms: medicalLegalMatches,
      escalationRoute: 'professional',
      userBoundary:
        'This needs qualified professional advice. RAFIQ can support remembrance and source study, but it must not replace a doctor, lawyer, emergency service, or qualified local authority.',
    };
  }

  const scholarMatches = matchedTerms(normalized, SCHOLAR_ESCALATION_TERMS);
  if (scholarMatches.length > 0) {
    return {
      hardEscalation: true,
      riskClass: 'scholar_escalation',
      responseState: 'scholar_escalation',
      summary: 'Ruling-sensitive language detected before guidance assembly.',
      matchedTerms: scholarMatches,
      escalationRoute: 'scholar',
      userBoundary:
        'This may require a qualified scholar who understands the full situation. RAFIQ will not issue a ruling, fatwa, or personal legal/religious decision.',
    };
  }

  return ordinaryRiskAssessment();
}

function expandGuidanceNeed(input: string): ExpandedGuidanceNeed {
  const normalized = normalizeInput(input);
  const exactTheme =
    INTENT_EXPANSIONS.find((item) => normalized === item.theme.toLowerCase()) ??
    INTENT_EXPANSIONS.find((item) => normalized === item.searchInput);
  if (exactTheme) {
    return {
      confidence: 1,
      reason: exactTheme.reason,
      searchInput: exactTheme.searchInput,
      theme: exactTheme.theme,
    };
  }

  const match = INTENT_EXPANSIONS.find((item) =>
    item.keywords.some((keyword) => normalized.includes(keyword)),
  );
  if (match) {
    return {
      confidence: 0.82,
      reason: match.reason,
      searchInput: match.searchInput,
      theme: match.theme,
    };
  }

  return {
    confidence: 0.45,
    reason: 'No deterministic theme expansion matched; using the original input.',
    searchInput: input,
    theme: input,
  };
}

@Injectable()
export class PrivateContentService {
  constructor(private readonly repository: PrivateContentRepository) {}

  getQuranSurah(
    surahNumber: number,
    options: QuranOptions,
  ): Promise<QuranSurahResponse> {
    return this.repository.getQuranSurah(surahNumber, options);
  }

  listHadithCollections(): Promise<HadithCollectionsResponse> {
    return this.repository.listHadithCollections();
  }

  listHadithRecords(options: HadithListOptions): Promise<HadithRecordsResponse> {
    return this.repository.listHadithRecords(options);
  }

  async getHadithRecord(hadithRecordId: string): Promise<HadithDetailResponse> {
    return this.enrichHadithTextQuality(await this.repository.getHadithRecord(hadithRecordId));
  }

  getTafsirPassage(passageId: string): Promise<TafsirStudyResponse> {
    return this.repository.getTafsirPassage(passageId);
  }

  searchContent(options: SearchOptions): Promise<PrivateSearchResponse> {
    return this.repository.searchContent(options);
  }

  async searchSources(options: SourceSearchOptions): Promise<PrivateSourceSearchResponse> {
    const requestedDomain = options.domain ?? 'all';
    const rpcDomain = normalizeSearchDomainForRpc(requestedDomain);
    const ayahReferenceResults = await this.createAyahReferenceSourceResults(options.q, requestedDomain);
    const search = await this.repository.searchContent({
      q: options.q,
      domain: rpcDomain,
      limit: options.limit ?? 30,
      offset: options.offset ?? 0,
    });
    const enrichedResults = this.dedupeSourceSearchResults([...ayahReferenceResults, ...search.results])
      .map((result) => this.enrichSourceSearchResult(result, options.q))
      .sort((first, second) => this.sourceSearchRank(second, requestedDomain) - this.sourceSearchRank(first, requestedDomain));
    const filteredResults = this.filterSourceSearchResults(enrichedResults, requestedDomain);
    const groups = this.groupSourceSearchResults(filteredResults);

    return {
      notice: search.notice,
      query: {
        text: search.query.text,
        domain: requestedDomain,
        mode: 'sources',
      },
      pagination: {
        ...search.pagination,
        total: filteredResults.length,
      },
      facets: this.facetsForSourceGroups(groups),
      retrievalTrace: search.retrievalTrace,
      groups,
      results: filteredResults,
    };
  }

  getRetrievalTrace(traceId: string): Promise<PrivateRetrievalTraceResponse> {
    return this.repository.getRetrievalTrace(traceId);
  }

  getSourceDetail(
    entityType: string,
    entityId: string,
  ): Promise<PrivateSourceDetailResponse> {
    return this.repository
      .getSourceDetail(entityType, entityId)
      .then((response) => this.enrichSourceDetailForStudy(response));
  }

  async getKnowledgeGraphifyCp21c(): Promise<PrivateKnowledgeGraphifyCp21cResponse> {
    const [matrix, evidence, graph, rankingSummary, vaultPackDir] = await Promise.all([
      readJsonArtifact<{
        cases: Array<{
          caseId: string;
          caseGroup: string;
          caseType: string;
          scoringMode?: string;
          critical?: boolean;
          input?: { text?: string };
        }>;
        coverage?: {
          ordinaryRankingCaseCount?: number;
          separateEscalationCaseCount?: number;
        };
      }>(CP21C_MATRIX_PATH),
      readJsonArtifact<{
        summary?: {
          totalCases?: number;
          errorCount?: number;
        };
        cases?: Array<{
          caseId: string;
          endpoint?: string;
          session?: {
            sessionId?: string;
            status?: string;
            need?: {
              detectedTheme?: string;
              detectedIntent?: string;
            };
            riskAssessment?: {
              riskClass?: string;
            };
            verification?: {
              status?: string;
              evidenceCount?: number;
              evidence?: Array<{
                citationId?: string;
                domain?: string;
                reference?: { verseKey?: string | null };
              }>;
            };
            quranAnchor?: {
              verseKey?: string;
            } | null;
            tafsirStep?: {
              route?: string | null;
            } | null;
            sourceMap?: {
              sourceSearchRoute?: string | null;
            };
          };
        }>;
      }>(CP21C_EVIDENCE_PATH),
      readJsonArtifact<{
        manifest?: { graphId?: string };
        summary?: {
          nodeCount?: number;
          edgeCount?: number;
          publicSafeNodeCount?: number;
          publicSafeEdgeCount?: number;
        };
        nodes?: Array<{
          id: string;
          type: string;
          label: string;
          releaseState?: string;
          reviewState?: string;
          qualityState?: string;
          publicSafe?: boolean;
        }>;
        edges?: Array<{
          id: string;
          type: string;
          from: string;
          to: string;
          releaseState?: string;
          publicSafe?: boolean;
        }>;
      }>(CP21C_GRAPH_PATH),
      readJsonArtifact<{
        status?: string;
        gates?: {
          ordinaryAverageMinimum?: number;
          ordinaryAverageScore?: number;
          ordinaryAveragePass?: boolean;
          criticalCaseMinimum?: number;
          criticalCaseMinimumPass?: boolean;
        };
        ordinarySummary?: {
          caseCount?: number;
          lowScoringCaseCount?: number;
        };
        escalationSummary?: {
          caseCount?: number;
          boundaryPassCount?: number;
        };
        lowScoringCases?: Array<{
          caseId: string;
          caseGroup: string;
          score: number;
          threshold: number;
          failedSignals: string[];
        }>;
        remediationList?: Array<{
          caseId: string;
          caseGroup: string;
          signal: string;
          remediation: string;
          severity: string;
        }>;
        caseResults?: Array<{
          caseId: string;
          caseGroup: string;
          caseType: string;
          scoringMode: string;
          critical: boolean;
          score: number;
          pass: boolean;
          threshold: number;
        }>;
      }>(CP21C_RANKING_SUMMARY_PATH),
      resolveArtifactPath(CP21C_VAULT_PACK_DIR),
    ]);
    const vaultPackFiles = await readdir(vaultPackDir);
    const vaultPackContents = await Promise.all(
      vaultPackFiles
        .filter((file) => file.endsWith('.md'))
        .map(async (file) => ({
          file,
          content: await readFile(join(vaultPackDir, file), 'utf8'),
        })),
    );
    const publicSafePackCount = 0;
    const ordinaryCaseCount =
      matrix.coverage?.ordinaryRankingCaseCount ??
      matrix.cases.filter((item) => item.scoringMode !== 'separate_escalation').length;
    const escalationCaseCount =
      matrix.coverage?.separateEscalationCaseCount ??
      matrix.cases.filter((item) => item.scoringMode === 'separate_escalation').length;
    const evidenceByCaseId = new Map((evidence.cases ?? []).map((item) => [item.caseId, item]));
    const scoreByCaseId = new Map((rankingSummary.caseResults ?? []).map((item) => [item.caseId, item]));
    const nodeById = new Map((graph.nodes ?? []).map((node) => [node.id, node]));
    const typeCounts = (graph.nodes ?? []).reduce<Record<string, number>>((counts, node) => {
      counts[node.type] = (counts[node.type] ?? 0) + 1;
      return counts;
    }, {});
    const caseExplorer = matrix.cases.map((matrixCase) => {
      const evidenceCase = evidenceByCaseId.get(matrixCase.caseId);
      const scoreCase = scoreByCaseId.get(matrixCase.caseId);
      const quranAnchor = evidenceCase?.session?.quranAnchor?.verseKey ?? null;
      const graphNodeIds = [
        `ranking_case:${matrixCase.caseId}`,
        evidenceCase?.session?.sessionId ? `guidance_session:${evidenceCase.session.sessionId}` : null,
        quranAnchor ? `ayah:${quranAnchor}` : null,
        ...(evidenceCase?.session?.verification?.evidence ?? [])
          .slice(0, 4)
          .map((item) => item.citationId)
          .filter(Boolean),
      ].filter((item): item is string => Boolean(item));

      return {
        caseId: matrixCase.caseId,
        caseGroup: matrixCase.caseGroup,
        caseType: matrixCase.caseType,
        scoringMode: scoreCase?.scoringMode ?? matrixCase.scoringMode ?? 'ordinary_ranking',
        critical: Boolean(scoreCase?.critical ?? matrixCase.critical),
        prompt: matrixCase.input?.text ?? evidenceCase?.endpoint ?? matrixCase.caseId,
        status: evidenceCase?.session?.status ?? null,
        riskClass: evidenceCase?.session?.riskAssessment?.riskClass ?? null,
        verificationStatus: evidenceCase?.session?.verification?.status ?? null,
        score: scoreCase?.score ?? null,
        pass: scoreCase?.pass ?? null,
        threshold: scoreCase?.threshold ?? null,
        detectedTheme: evidenceCase?.session?.need?.detectedTheme ?? null,
        detectedIntent: evidenceCase?.session?.need?.detectedIntent ?? null,
        evidenceCount:
          evidenceCase?.session?.verification?.evidenceCount ??
          evidenceCase?.session?.verification?.evidence?.length ??
          0,
        quranAnchor,
        tafsirRoute: evidenceCase?.session?.tafsirStep?.route ?? null,
        sourceSearchRoute: evidenceCase?.session?.sourceMap?.sourceSearchRoute ?? null,
        graphNodeIds,
        vaultPackPath: caseVaultPackPath(matrixCase.caseId),
      };
    });
    const connectedNodeIds = new Set(caseExplorer.flatMap((item) => item.graphNodeIds));
    const nodeSamples = Array.from(connectedNodeIds)
      .map((id) => nodeById.get(id))
      .filter((node): node is NonNullable<typeof node> => Boolean(node))
      .slice(0, 12)
      .map((node) => ({
        nodeId: node.id,
        type: node.type,
        label: node.label,
        releaseState: node.releaseState ?? 'unknown',
        reviewState: node.reviewState ?? 'unknown',
        qualityState: node.qualityState ?? 'unknown',
        publicSafe: Boolean(node.publicSafe),
      }));
    const edgeSamples = (graph.edges ?? [])
      .filter((edge) => connectedNodeIds.has(edge.from) || connectedNodeIds.has(edge.to))
      .slice(0, 16)
      .map((edge) => ({
        edgeId: edge.id,
        type: edge.type,
        from: edge.from,
        to: edge.to,
        releaseState: edge.releaseState ?? 'unknown',
        publicSafe: Boolean(edge.publicSafe),
      }));
    const vaultScoreByCaseId = new Map(caseExplorer.map((item) => [item.caseId, item]));
    const vaultPacks = vaultPackContents.map(({ file, content }) => {
      const caseId = file.replace(/\.md$/i, '').toUpperCase();
      const explorerCase = vaultScoreByCaseId.get(caseId);
      return {
        caseId,
        title: `CP21C Ranking Case ${caseId}`,
        path: `${CP21C_VAULT_PACK_DIR}/${file}`,
        score: explorerCase?.score ?? null,
        pass: explorerCase?.pass ?? null,
        publicSafe: false,
        preview: compactArtifactPreview(content),
        headings: markdownHeadings(content),
      };
    });

    return {
      notice: DEFAULT_NOTICE,
      verifier: {
        status: 'pass',
        command: 'node scripts\\check_cp21c_resource_graphify.mjs',
        checkpoint: 'CP21C-G06',
      },
      artifactPaths: {
        matrix: CP21C_MATRIX_PATH,
        evidence: CP21C_EVIDENCE_PATH,
        graph: CP21C_GRAPH_PATH,
        rankingSummary: CP21C_RANKING_SUMMARY_PATH,
        vaultPacks: CP21C_VAULT_PACK_DIR,
      },
      scaleBoundary: {
        isFullRafiqResourceGraph: false,
        message:
          'CP21C is a private ranking-evidence prototype slice, not the full RAFIQ Quran, tafsir, translation, hadith, topic, provenance, review, and release-state graph.',
      },
      matrix: {
        caseCount: evidence.summary?.totalCases ?? matrix.cases.length,
        ordinaryCaseCount,
        escalationCaseCount,
      },
      graph: {
        graphId: graph.manifest?.graphId ?? 'cp21c-resource-graph-v1',
        nodeCount: graph.summary?.nodeCount ?? 0,
        edgeCount: graph.summary?.edgeCount ?? 0,
        publicSafeNodeCount: graph.summary?.publicSafeNodeCount ?? 0,
        publicSafeEdgeCount: graph.summary?.publicSafeEdgeCount ?? 0,
      },
      vault: {
        packCount: vaultPackFiles.filter((file) => file.endsWith('.md')).length,
        publicSafePackCount,
      },
      rankingSummary: {
        status: rankingSummary.status ?? 'unknown',
        ordinaryAverageScore: rankingSummary.gates?.ordinaryAverageScore ?? 0,
        ordinaryAverageMinimum: rankingSummary.gates?.ordinaryAverageMinimum ?? 85,
        ordinaryAveragePass: rankingSummary.gates?.ordinaryAveragePass ?? false,
        criticalCaseMinimum: rankingSummary.gates?.criticalCaseMinimum ?? 75,
        criticalCaseMinimumPass: rankingSummary.gates?.criticalCaseMinimumPass ?? false,
        lowScoringCaseCount: rankingSummary.ordinarySummary?.lowScoringCaseCount ?? 0,
        remediationCount: rankingSummary.remediationList?.length ?? 0,
      },
      escalation: {
        caseCount: rankingSummary.escalationSummary?.caseCount ?? escalationCaseCount,
        boundaryPassCount: rankingSummary.escalationSummary?.boundaryPassCount ?? 0,
      },
      caseExplorer,
      graphExplorer: {
        nodeSamples,
        edgeSamples,
        typeCounts,
      },
      vaultExplorer: {
        packs: vaultPacks,
      },
      lowScoringCases: rankingSummary.lowScoringCases ?? [],
      remediationList: rankingSummary.remediationList ?? [],
      publicSafeBoundary: {
        publicSafe: false,
        publicReleaseApproved: false,
        message:
          'All CP21C graph, vault, evidence, and score artifacts remain private. Passing CP21C does not approve public release.',
      },
    };
  }

  async getKnowledgeGraphifyCp22(): Promise<PrivateKnowledgeGraphifyCp22Response> {
    const [manifest, _summary, vaultManifest] = await Promise.all([
      readJsonArtifact<Cp22GraphManifest>(CP22_GRAPH_MANIFEST_PATH),
      readJsonArtifact<unknown>(CP22_GRAPH_SUMMARY_PATH),
      readJsonArtifact<Cp22VaultManifest>(CP22_VAULT_MANIFEST_PATH),
    ]);
    const partitions = await Promise.all(
      manifest.partitions.map(async (partition) => ({
        summary: partition,
        artifact: await readJsonArtifact<Cp22Partition>(join(CP22_GRAPH_DIR, partition.path)),
      })),
    );
    const [byAyahKey, byHadithKey, bySourceId, byTopicKey] = await Promise.all([
      readJsonArtifact<Record<string, {
        ayahNodeId?: string;
        translations?: string[];
        tafsir?: string[];
        topics?: string[];
        retrievalEvidence?: string[];
      }>>(join(CP22_GRAPH_DIR, 'indexes/by-ayah-key.json')),
      readJsonArtifact<Record<string, {
        hadithNodeId?: string;
        hadithRecordNodeId?: string;
        textVersions?: string[];
        references?: string[];
        gradeAssertions?: string[];
        verificationClaims?: string[];
        qualityFindings?: string[];
      }>>(join(CP22_GRAPH_DIR, 'indexes/by-hadith-key.json')),
      readJsonArtifact<Record<string, unknown>>(join(CP22_GRAPH_DIR, 'indexes/by-source-id.json')),
      readJsonArtifact<Record<string, unknown>>(join(CP22_GRAPH_DIR, 'indexes/by-topic-key.json')),
    ]);

    const allNodes = partitions.flatMap((partition) => partition.artifact.nodes ?? []);
    const allEdges = partitions.flatMap((partition) => partition.artifact.edges ?? []);
    const nodeToExplorer = (node: Cp22GraphNode) => ({
      nodeId: node.id,
      type: node.type,
      label: node.label,
      partition: node.partition,
      canonicalRef: graphRefToString(node.canonicalRef),
      sourceRefs: graphRefsToStrings(node.sourceRefs),
      provenanceRefs: node.provenanceRefs ?? [],
      releaseStateRefs: node.releaseStateRefs ?? [],
      releaseState: node.releaseState ?? 'unknown',
      reviewState: node.reviewState ?? 'unknown',
      qualityState: node.qualityState ?? 'unknown',
      accessLevel: node.accessLevel ?? 'developer_private',
      publicSafe: Boolean(node.publicSafe),
      metadata: node.metadata ?? {},
    });
    const edgeToExplorer = (edge: Cp22GraphEdge) => ({
      edgeId: edge.id,
      type: edge.type,
      from: edge.from,
      to: edge.to,
      fromPartition: edge.fromPartition ?? null,
      toPartition: edge.toPartition ?? null,
      releaseState: edge.releaseState ?? 'unknown',
      reviewState: edge.reviewState ?? 'unknown',
      accessLevel: edge.accessLevel ?? 'developer_private',
      publicSafe: Boolean(edge.publicSafe),
      sourceRefs: graphRefsToStrings(edge.sourceRefs),
      evidenceRefs: edge.evidenceRefs ?? [],
      metadata: edge.metadata ?? {},
    });

    const partitionExplorer = partitions.map(({ summary, artifact }) => {
      const nodes = artifact.nodes ?? [];
      const edges = artifact.edges ?? [];
      return {
        ...summary,
        nodeSamples: nodes.slice(0, 18).map(nodeToExplorer),
        edgeSamples: edges.slice(0, 18).map(edgeToExplorer),
        nodeTypeCounts: countByField(nodes, (node) => node.type),
        edgeTypeCounts: countByField(edges, (edge) => edge.type),
      };
    });

    const lookupPaths = [
      ...Object.entries(byAyahKey).slice(0, 8).map(([key, value]) => ({
        lookupType: 'ayah' as const,
        key,
        label: `Quran ${key}`,
        graphNodeIds: [
          value.ayahNodeId,
          ...(value.translations ?? []).slice(0, 2),
          ...(value.tafsir ?? []).slice(0, 2),
          ...(value.topics ?? []).slice(0, 2),
          ...(value.retrievalEvidence ?? []).slice(0, 2),
        ].filter((item): item is string => Boolean(item)),
        route: `/quran/${key.replace(':', '/')}`,
      })),
      ...Object.entries(byHadithKey).slice(0, 8).map(([key, value]) => ({
        lookupType: 'hadith' as const,
        key,
        label: key,
        graphNodeIds: [
          value.hadithNodeId,
          value.hadithRecordNodeId,
          ...(value.textVersions ?? []).slice(0, 2),
          ...(value.references ?? []).slice(0, 2),
          ...(value.gradeAssertions ?? []).slice(0, 2),
          ...(value.verificationClaims ?? []).slice(0, 2),
          ...(value.qualityFindings ?? []).slice(0, 2),
        ].filter((item): item is string => Boolean(item)),
        route: null,
      })),
      ...Object.entries(bySourceId).slice(0, 8).map(([key, value]) => ({
        lookupType: 'source' as const,
        key,
        label: key,
        graphNodeIds: lookupNodeIds(value).slice(0, 8),
        route: `/source-detail?entityType=source&entityId=${encodeURIComponent(key)}`,
      })),
      ...Object.entries(byTopicKey).slice(0, 8).map(([key, value]) => ({
        lookupType: 'topic' as const,
        key,
        label: key,
        graphNodeIds: lookupNodeIds(value).slice(0, 8),
        route: `/sources?q=${encodeURIComponent(key)}&domain=topics`,
      })),
    ];

    const vaultPacks = await Promise.all(
      vaultManifest.artifacts.slice(0, 48).map(async (artifact) => {
        const content = await readFile(await resolveArtifactPath(join(CP22_VAULT_DIR, artifact.path)), 'utf8');
        return {
          artifactId: artifact.artifactId,
          artifactType: artifact.artifactType,
          title: artifact.title,
          category: artifact.category,
          path: `${CP22_VAULT_DIR}/${artifact.path}`,
          publicSafe: artifact.publicSafe,
          graphNodeIds: artifact.graphNodeIds.slice(0, 12),
          canonicalRefs: artifact.canonicalRefs.slice(0, 12),
          sourceRefs: artifact.sourceRefs.slice(0, 12),
          preview: compactArtifactPreview(content),
          headings: markdownHeadings(content),
        };
      }),
    );

    return {
      notice: DEFAULT_NOTICE,
      verifier: {
        status: 'pass',
        command: 'node scripts\\check_cp22_vault_packs.mjs',
        checkpoint: 'CP22-G08',
      },
      artifactPaths: {
        graphManifest: CP22_GRAPH_MANIFEST_PATH,
        graphSummary: CP22_GRAPH_SUMMARY_PATH,
        graphPartitions: `${CP22_GRAPH_DIR}/partitions`,
        graphIndexes: `${CP22_GRAPH_DIR}/indexes`,
        vaultManifest: CP22_VAULT_MANIFEST_PATH,
        vaultPacks: `${CP22_VAULT_DIR}/packs`,
      },
      graph: {
        graphId: manifest.graphId,
        checkpoint: manifest.checkpoint,
        nodeCount: manifest.counts.totalNodes,
        edgeCount: manifest.counts.totalEdges,
        partitionCount: manifest.counts.partitions,
        indexCount: manifest.counts.indexes,
        publicSafeNodeCount: manifest.counts.publicSafeNodes,
        publicSafeEdgeCount: manifest.counts.publicSafeEdges,
        sourceGraphChecksumSha256: manifest.checksums?.graphChecksumSha256 ?? null,
      },
      vault: {
        vaultId: vaultManifest.vaultId,
        checkpoint: vaultManifest.checkpoint,
        artifactCount: vaultManifest.counts.artifacts,
        categoryCount: vaultManifest.counts.categories,
        publicSafeArtifactCount: vaultManifest.counts.publicSafeArtifacts,
        graphNodesReferenced: vaultManifest.counts.graphNodesReferenced,
      },
      partitionExplorer: {
        partitions: partitionExplorer,
        selectedByDefault: 'quran',
      },
      graphExplorer: {
        typeCounts: countByField(allNodes, (node) => node.type),
        releaseStateCounts: countByField(allNodes, (node) => node.releaseState),
        reviewStateCounts: countByField(allNodes, (node) => node.reviewState),
        qualityStateCounts: countByField(allNodes, (node) => node.qualityState),
        publicBoundary: {
          publicSafeNodes: manifest.counts.publicSafeNodes,
          publicSafeEdges: manifest.counts.publicSafeEdges,
          publicReleaseApproved: false,
        },
      },
      lookupPaths,
      vaultExplorer: {
        categoryCounts: vaultManifest.categoryCounts,
        packs: vaultPacks,
      },
      publicSafeBoundary: {
        publicSafe: false,
        publicReleaseApproved: false,
        message:
          'CP22 full-private graph and vault outputs are internal inspection artifacts. They remain private and do not approve public RAFIQ release.',
      },
    };
  }

  async getReviewWorkbenchCp23(): Promise<PrivateReviewWorkbenchCp23Response> {
    const [manifest, vaultManifest, reviewerExportManifest, reviewerAuditExport, reviewerRemediationExport] = await Promise.all([
      readJsonArtifact<Cp22GraphManifest>(CP22_GRAPH_MANIFEST_PATH),
      readJsonArtifact<Cp22VaultManifest>(CP22_VAULT_MANIFEST_PATH),
      readOptionalJsonArtifact<PrivateCp23ReviewerExports['manifest']>(CP23_REVIEW_EXPORT_MANIFEST_PATH),
      readOptionalJsonArtifact<PrivateCp23ReviewerExports['auditTrail']>(CP23_REVIEW_AUDIT_EXPORT_PATH),
      readOptionalJsonArtifact<PrivateCp23ReviewerExports['remediation']>(CP23_REVIEW_REMEDIATION_EXPORT_PATH),
    ]);
    const partitions = await Promise.all(
      manifest.partitions.map(async (partition) => (
        readJsonArtifact<Cp22Partition>(join(CP22_GRAPH_DIR, partition.path))
      )),
    );
    const allNodes = partitions.flatMap((partition) => partition.nodes ?? []);
    const allEdges = partitions.flatMap((partition) => partition.edges ?? []);
    const firstNodeOfType = (types: string[]) => (
      allNodes.find((node) => types.includes(node.type) && !node.publicSafe)
    );

    const selectedNodes = uniqueStrings([
      firstNodeOfType(['quran_ayah_text', 'quran_ayah'])?.id,
      firstNodeOfType(['tafsir_passage'])?.id,
      firstNodeOfType(['hadith_record', 'hadith_text_version'])?.id,
    ]).map((nodeId) => allNodes.find((node) => node.id === nodeId)).filter((node): node is Cp22GraphNode => Boolean(node));
    const reviewNodes = allNodes
      .filter((node) => !node.publicSafe)
      .filter((node) => {
        const reviewState = node.reviewState ?? '';
        const qualityState = node.qualityState ?? '';
        return reviewState !== 'approved' || ['review', 'withheld', 'warning', 'unknown'].includes(qualityState);
      })
      .slice(0, 3);
    const escalationNodes = allNodes
      .filter((node) => !node.publicSafe)
      .filter((node) => ['hadith_grade_assertion', 'verification_claim', 'quality_finding'].includes(node.type))
      .slice(0, 2);

    const candidates = [
      ...selectedNodes.map((node) => candidateFromNode(
        node,
        allEdges,
        vaultManifest,
        'selected',
        'Selected because it is a primary graph-linked source candidate with provenance, release, and vault context available for reviewer inspection.',
        ['canonical_ref_match', 'source_provenance_present', 'vault_pack_available'],
      )),
      ...reviewNodes.map((node) => candidateFromNode(
        node,
        allEdges,
        vaultManifest,
        'requires_review',
        'Held for reviewer attention because CP23 cannot treat pending review or non-ok quality state as answer-ready evidence.',
        ['quality_state_warning', 'review_state_pending', 'graph_context_available'],
      )),
      ...escalationNodes.map((node) => candidateFromNode(
        node,
        allEdges,
        vaultManifest,
        'requires_escalation',
        'Escalated because grade, verification, or quality assertions require specialized review before guidance use.',
        ['verification_sensitive', 'scholar_review_required', 'not_public_safe'],
      )),
    ].slice(0, 8);

    const selectedCandidates = candidates.filter((candidate) => candidate.selectionState === 'selected').slice(0, 3);
    const reviewCandidates = candidates.filter((candidate) => candidate.selectionState === 'requires_review').slice(0, 3);
    const escalationCandidates = candidates.filter((candidate) => candidate.selectionState === 'requires_escalation').slice(0, 2);
    const now = new Date().toISOString();
    const evidenceRouteId = 'cp23-route:prototype-graph-aware-guidance';
    const reviewQueueItems: PrivateCp23ReviewQueueItem[] = [
      ...reviewCandidates.map((candidate, index) => ({
        queueItemId: `cp23-review:${index + 1}:${candidate.graphNodeIds[0]}`,
        queueType: 'evidence_candidate_review',
        subjectType: candidate.contentType,
        subjectId: candidate.graphNodeIds[0],
        title: `Review evidence candidate: ${candidate.canonicalRef}`,
        summary: candidate.selectionReason,
        severity: index === 0 ? 'medium' as const : 'low' as const,
        reviewStatus: 'queued',
        assignedRole: 'content_reviewer',
        sourceIds: candidate.sourceIds,
        graphNodeIds: candidate.graphNodeIds,
        graphEdgeIds: candidate.graphEdgeIds,
        vaultPackIds: candidate.vaultPackIds,
        evidenceRouteIds: [evidenceRouteId],
        remediationIds: [`cp23-remediation:${index + 1}:${candidate.graphNodeIds[0]}`],
        createdAt: now,
        updatedAt: now,
      })),
      ...escalationCandidates.map((candidate, index) => ({
        queueItemId: `cp23-escalation:${index + 1}:${candidate.graphNodeIds[0]}`,
        queueType: 'scholar_or_quality_escalation',
        subjectType: candidate.contentType,
        subjectId: candidate.graphNodeIds[0],
        title: `Escalate evidence candidate: ${candidate.canonicalRef}`,
        summary: candidate.selectionReason,
        severity: 'high' as const,
        reviewStatus: 'queued',
        assignedRole: 'scholar_reviewer',
        sourceIds: candidate.sourceIds,
        graphNodeIds: candidate.graphNodeIds,
        graphEdgeIds: candidate.graphEdgeIds,
        vaultPackIds: candidate.vaultPackIds,
        evidenceRouteIds: [evidenceRouteId],
        remediationIds: [`cp23-remediation:escalation-${index + 1}:${candidate.graphNodeIds[0]}`],
        createdAt: now,
        updatedAt: now,
      })),
    ].slice(0, 8);
    const remediationItems = reviewQueueItems.slice(0, 8).map((item) => ({
      remediationId: item.remediationIds[0],
      queueItemId: item.queueItemId,
      subjectType: item.subjectType,
      subjectId: item.subjectId,
      issueType: item.assignedRole === 'scholar_reviewer' ? 'scholar_or_verification_review' : 'candidate_quality_review',
      canonicalRefs: [item.subjectId],
      sourceIds: item.sourceIds,
      reason: item.summary,
      severity: item.severity,
      requiredAction:
        item.assignedRole === 'scholar_reviewer'
          ? 'Specialist reviewer must confirm grade, verification, or quality assertion before it can support a guidance answer.'
          : 'Content reviewer must confirm source, provenance, release state, and text quality before answer use.',
      verificationMethod: 'node scripts\\check_cp23_reviewer_exports.mjs after export generation',
      blockingStatus: item.assignedRole === 'scholar_reviewer' ? 'blocks_guidance_use' : 'blocks_public_release',
      closurePath: 'Resolve the queue item, rerun CP23 verification, and record reviewer closure notes.',
      closureNotes: null,
      graphNodeIds: item.graphNodeIds,
      graphEdgeIds: item.graphEdgeIds,
      vaultPackIds: item.vaultPackIds,
      ownerRole: item.assignedRole,
      status: 'open',
    }));
    const reviewerExports =
      reviewerExportManifest && reviewerAuditExport && reviewerRemediationExport
        ? {
            manifest: reviewerExportManifest,
            auditTrail: reviewerAuditExport.slice(0, 8),
            remediation: reviewerRemediationExport.slice(0, 8),
          }
        : null;

    return {
      notice: DEFAULT_NOTICE,
      verifier: {
        status: 'pass',
        command: reviewerExports
          ? 'node scripts\\check_cp23_reviewer_exports.mjs'
          : 'node scripts\\check_cp23_private_prototype.mjs',
        checkpoint: reviewerExports ? 'CP23-A07' : 'CP23-A06',
      },
      prototype: {
        checkpoint: 'CP23-A06',
        implementationMode: 'bounded_private_read_only',
        codeMutatesCanonicalContent: false,
        publicReleaseApproved: false,
        graphId: manifest.graphId,
        graphChecksumSha256: manifest.checksums?.graphChecksumSha256 ?? null,
        sourceCheckpoint: manifest.checkpoint,
        apiRoute: '/api/private-content/review-workbench/cp23',
        uiRoute: '/review-workbench',
      },
      retrieval: {
        graphMode: 'rank_and_explain',
        requestDefaults: {
          maxInitialCandidates: 8,
          maxExpandedCandidates: 8,
          maxEvidenceRouteItems: 8,
          requirePublicSafeFalse: true,
        },
        graphProof: {
          graphNodeCount: manifest.counts.totalNodes,
          graphEdgeCount: manifest.counts.totalEdges,
          vaultPackCount: vaultManifest.counts.artifacts,
          publicSafeNodeCount: manifest.counts.publicSafeNodes,
          publicSafeEdgeCount: manifest.counts.publicSafeEdges,
          publicSafeArtifactCount: vaultManifest.counts.publicSafeArtifacts,
        },
        candidates,
        selectedCandidateIds: selectedCandidates.map((candidate) => candidate.candidateId),
        rejectedCandidateIds: [],
        requiresReviewCandidateIds: [...reviewCandidates, ...escalationCandidates].map((candidate) => candidate.candidateId),
      },
      evidenceRoutes: [
        {
          evidenceRouteId,
          retrievalTraceId: 'cp23-trace:prototype-graph-aware-guidance',
          queryText: 'Prototype graph-aware evidence route using CP22 private graph and vault artifacts.',
          intent: 'guidance_retrieval_review',
          domain: 'all',
          graphMode: 'rank_and_explain',
          selectedEvidence: selectedCandidates.map((candidate) => routeItemFromCandidate(candidate, 'supporting_evidence', 'supports')),
          rejectedEvidence: reviewCandidates.map((candidate) => routeItemFromCandidate(candidate, 'held_candidate', 'warns')),
          escalationEvidence: escalationCandidates.map((candidate) => routeItemFromCandidate(candidate, 'escalation_candidate', 'escalates')),
          validationGateResults: [
            {
              gate: 'source_provenance_linked',
              status: selectedCandidates.every((candidate) => candidate.sourceIds.length > 0) ? 'pass' : 'review_required',
              graphLinked: true,
              notes: 'Selected candidates expose source refs, graph node ids, and vault pack ids for reviewer inspection.',
            },
            {
              gate: 'public_safe_boundary',
              status: 'blocked_for_public_release',
              graphLinked: true,
              notes: 'CP23-A06 remains private-only; public-safe candidate count is zero.',
            },
            {
              gate: 'review_escalation_boundary',
              status: reviewQueueItems.length > 0 ? 'review_required' : 'pass',
              graphLinked: true,
              notes: 'Pending quality, release, or specialist review candidates are separated from selected evidence.',
            },
          ],
          answerDraftId: null,
          guidedAnswerId: null,
          modelAdapterRunId: null,
          answerValidationRunId: null,
          reviewQueueItemIds: reviewQueueItems.map((item) => item.queueItemId),
          createdAt: now,
        },
      ],
      reviewWorkbench: {
        route: '/review-workbench',
        queueSummary: countByField(reviewQueueItems, (item) => item.queueType),
        roleSummary: countByField(reviewQueueItems, (item) => item.assignedRole),
        items: reviewQueueItems,
        screenMap: [
          'retrieval_trace_summary',
          'evidence_route_inspector',
          'candidate_review_queue',
          'remediation_handoff',
          'audit_preview',
        ],
      },
      remediationItems,
      auditEvents: reviewQueueItems.slice(0, 8).map((item) => ({
        auditEventId: `cp23-audit:${item.queueItemId}`,
        eventType: 'prototype_queue_item_created',
        actorRole: 'system_prototype',
        action: 'queue_for_review',
        fromStatus: 'candidate',
        toStatus: item.reviewStatus,
        reviewerRole: item.assignedRole,
        reviewerId: null,
        subjectType: item.subjectType,
        subjectId: item.subjectId,
        evidenceRouteId,
        queueItemId: item.queueItemId,
        sourceIds: item.sourceIds,
        graphNodeIds: item.graphNodeIds,
        graphEdgeIds: item.graphEdgeIds,
        vaultPackIds: item.vaultPackIds,
        remediationIds: item.remediationIds,
        notes: 'Read-only CP23-A06 audit preview generated from CP22 artifacts; not persisted as a reviewer action.',
        createdAt: now,
      })),
      reviewerExports: reviewerExports ?? undefined,
      uiPayloadBoundary: {
        route: '/review-workbench',
        payloadBoundary: 'bounded prototype payload derived from CP22 full-private graph and vault artifacts',
        graphNodesExposedToUi: 'candidate-linked node ids only; no full graph dump',
        maxCandidates: 8,
        maxEvidenceRoutes: 1,
        maxQueueItems: 8,
        maxRemediationItems: 8,
      },
      publicSafeBoundary: {
        publicSafe: false,
        publicReleaseApproved: false,
        publicSafeCandidateCount: 0,
        message:
          'CP23-A06 is a private reviewer prototype. It does not expose a public RAFIQ graph, does not approve evidence for public answers, and does not mutate canonical content.',
      },
    };
  }

  async createGraphAwareRetrievalCp24(
    request: Cp24GraphAwareRetrievalApiRequest,
  ): Promise<PrivateCp24GraphAwareRetrievalResponse> {
    if (!request.queryText?.trim()) {
      throw new BadRequestException('queryText is required for CP24 graph-aware retrieval.');
    }

    const [manifest, cp22Manifest, rankingSelection, validationHandoff] = await Promise.all([
      readJsonArtifact<Cp24RetrievalManifest>(CP24_RETRIEVAL_MANIFEST_PATH),
      readJsonArtifact<Cp22GraphManifest>(CP22_GRAPH_MANIFEST_PATH),
      readJsonArtifact<Cp24RankingSelectionArtifact>(CP24_RANKING_SELECTION_PATH),
      readJsonArtifact<Cp24ValidationHandoffArtifact>(CP24_VALIDATION_HANDOFF_PATH),
    ]);
    if (manifest.checkpoint !== 'CP24-G05' || validationHandoff.checkpoint !== 'CP24-G05') {
      throw new BadRequestException('CP24-G05 validation handoff artifacts must exist before the G06 private API prototype can run.');
    }
    if (!validationHandoff.privateOnly || validationHandoff.publicBoundary.publicRouteExposed) {
      throw new BadRequestException('CP24 private boundary artifact is invalid.');
    }

    const requestedFixtureId = request.fixtureId?.trim();
    const fixture =
      (requestedFixtureId
        ? rankingSelection.fixtures.find((item) => item.fixtureId === requestedFixtureId)
        : null) ??
      rankingSelection.fixtures.find((item) => item.query.queryText.toLowerCase().includes(request.queryText.toLowerCase().trim())) ??
      rankingSelection.fixtures[0];
    if (!fixture) {
      throw new BadRequestException('No CP24 retrieval fixtures are available.');
    }
    if (requestedFixtureId && fixture.fixtureId !== requestedFixtureId) {
      throw new BadRequestException(`Unknown CP24 fixtureId: ${requestedFixtureId}`);
    }

    const validationRoute = validationHandoff.routes.find((item) => item.fixtureId === fixture.fixtureId);
    if (!validationRoute) {
      throw new BadRequestException(`No CP24 validation handoff route exists for fixtureId: ${fixture.fixtureId}`);
    }

    const intent = cp24Literal<PrivateCp24RetrievalIntent>(
      request.intent,
      ['guidance', 'learning', 'search', 'reflection', 'journal', 'ruling', 'medical', 'legal', 'crisis', 'other'],
      fixture.query.intent ?? 'guidance',
    );
    const domain = cp24Literal<PrivateCp24RetrievalDomain>(
      request.domain,
      ['all', 'quran', 'translation', 'tafsir', 'hadith', 'source', 'topic', 'validation'],
      fixture.query.domain ?? 'all',
    );
    const graphMode = cp24Literal<PrivateCp24GraphMode>(
      request.graphMode,
      ['off', 'explain_only', 'expand_candidates', 'rank_and_explain'],
      fixture.query.graphMode,
    );
    const caps = cp24Caps(request, fixture);
    const offset = request.offset ?? 0;
    const candidateLimit = Math.min(caps.maxExpandedCandidates, request.limit ?? caps.maxInitialCandidates);
    const candidates = fixture.rankedCandidates.slice(offset, offset + candidateLimit).map((candidate) => ({
      ...candidate,
      graphNodeIds: candidate.graphNodeIds.slice(0, caps.maxGraphNodes),
      graphEdgeIds: candidate.graphEdgeIds.slice(0, caps.maxGraphEdges),
      vaultPackIds: candidate.vaultPackIds.slice(0, caps.maxVaultPackRefs),
      publicSafe: false as const,
    })) as PrivateCp24EvidenceCandidate[];
    const evidenceRoute = cp24BoundRoute(validationRoute.evidenceRoute, caps, graphMode);
    const routeItemIds = cp24RouteItemIds(evidenceRoute);
    const remediations = validationRoute.remediationItems
      .filter((item) => {
        const relatedRouteItem = [
          ...validationRoute.evidenceRoute.selectedEvidence,
          ...validationRoute.evidenceRoute.rejectedEvidence,
          ...validationRoute.evidenceRoute.escalationEvidence,
        ].find((routeItem) => item.targetCanonicalRefs.includes(routeItem.canonicalRef));
        return relatedRouteItem ? routeItemIds.has(relatedRouteItem.routeItemId) : true;
      })
      .slice(0, caps.maxEvidenceRouteItems);
    const validation = cp24BoundValidationHandoff(validationRoute.validationHandoff, evidenceRoute, remediations);
    const reviewerHandoff = cp24ReviewerHandoff(evidenceRoute, remediations);
    const graphNodeIds = uniqueStrings([
      ...candidates.flatMap((candidate) => candidate.graphNodeIds),
      ...evidenceRoute.selectedEvidence.flatMap((item) => item.graphNodeIds),
      ...evidenceRoute.rejectedEvidence.flatMap((item) => item.graphNodeIds),
      ...evidenceRoute.escalationEvidence.flatMap((item) => item.graphNodeIds),
    ]);
    const graphEdgeIds = uniqueStrings([
      ...candidates.flatMap((candidate) => candidate.graphEdgeIds),
      ...evidenceRoute.selectedEvidence.flatMap((item) => item.graphEdgeIds),
      ...evidenceRoute.rejectedEvidence.flatMap((item) => item.graphEdgeIds),
      ...evidenceRoute.escalationEvidence.flatMap((item) => item.graphEdgeIds),
    ]);
    const vaultPackIds = uniqueStrings([
      ...candidates.flatMap((candidate) => candidate.vaultPackIds),
      ...evidenceRoute.selectedEvidence.flatMap((item) => item.vaultPackIds),
      ...evidenceRoute.rejectedEvidence.flatMap((item) => item.vaultPackIds),
      ...evidenceRoute.escalationEvidence.flatMap((item) => item.vaultPackIds),
    ]);
    const candidateIdsByState = (state: PrivateCp24SelectionState) =>
      candidates.filter((candidate) => candidate.selectionState === state).map((candidate) => candidate.candidateId);

    return {
      notice: DEFAULT_NOTICE,
      checkpoint: 'CP24-G06',
      route: 'POST /api/private-content/graph-aware-retrieval/cp24',
      retrievalTraceId: evidenceRoute.retrievalTraceId,
      graphMode,
      query: {
        text: request.queryText,
        fixtureId: fixture.fixtureId,
        intent,
        domain,
        language: request.language ?? fixture.query.language ?? null,
      },
      outputCaps: caps,
      candidates,
      selectedCandidateIds: candidateIdsByState('selected'),
      heldCandidateIds: candidateIdsByState('held'),
      rejectedCandidateIds: candidateIdsByState('rejected'),
      requiresReviewCandidateIds: candidateIdsByState('requires_review'),
      requiresEscalationCandidateIds: candidateIdsByState('requires_escalation'),
      evidenceRoute: {
        ...evidenceRoute,
        queryText: request.queryText,
        intent,
        domain,
        graphMode,
      },
      validationHandoff: validation,
      reviewerHandoff,
      graphProof: {
        graphId: 'rafiq-full-private-resource-graph',
        graphChecksumSha256: manifest.sourceGraph.graphChecksumSha256,
        vaultId: 'rafiq-full-private-knowledge-vault',
        sourceCheckpoint: 'CP22-G10',
        partitionNames: cp22Manifest.partitions.map((partition) => partition.name),
        indexNames: cp22Manifest.indexes.map((index) => index.name),
        resolvedGraphNodeCount: graphNodeIds.length,
        resolvedGraphEdgeCount: graphEdgeIds.length,
        resolvedVaultPackCount: vaultPackIds.length,
      },
      publicBoundary: {
        privateOnly: true,
        publicSafeCandidateCount: 0,
        publicSafeGraphNodeCount: 0,
        publicSafeGraphEdgeCount: 0,
        publicSafeVaultArtifactCount: 0,
        publicReleaseApproved: false,
        publicRouteExposed: false,
        message:
          'CP24-G06 exposes only a bounded private graph-aware retrieval prototype response. It does not approve public release or expose the full RAFIQ resource graph.',
      },
    };
  }

  async getReviewerWorkbenchCp25(): Promise<PrivateCp25WorkbenchStateResponse> {
    const [manifest, queueItems, remediationStates, auditEvents] = await Promise.all([
      readJsonArtifact<Cp25AuditDecisionLedgerManifest>(CP25_AUDIT_LEDGER_MANIFEST_PATH),
      readJsonArtifact<PrivateCp25ReviewQueueItem[]>(CP25_REVIEW_QUEUE_PATH),
      readJsonArtifact<PrivateCp25RemediationState[]>(CP25_REMEDIATION_STATE_PATH),
      readJsonArtifact<PrivateCp25ReviewAuditEvent[]>(CP25_AUDIT_EVENTS_PATH),
    ]);
    if (manifest.checkpoint !== 'CP25-A04' || manifest.publicBoundary.publicRouteExposed) {
      throw new BadRequestException('CP25-A04 audit decision ledger artifacts must exist before the A05 private API prototype can run.');
    }

    return {
      notice: DEFAULT_NOTICE,
      checkpoint: 'CP25-A05',
      route: 'GET /api/private-content/reviewer-workbench/cp25',
      sourceCheckpoint: 'CP24-G09',
      queueItems: queueItems.slice(0, 72),
      remediationStates: remediationStates.slice(0, 72),
      auditEvents: auditEvents.slice(0, 72),
      counts: {
        queueItemCount: queueItems.length,
        remediationStateCount: remediationStates.length,
        auditEventCount: auditEvents.length,
        highOrCriticalCount: queueItems.filter((item) => ['high', 'critical'].includes(item.severity)).length,
        openBlockingCount: remediationStates.filter((item) => item.blockingStatus === 'blocking').length,
        publicSafeCandidateCount: 0,
        publicSafeRouteItemCount: 0,
      },
      publicBoundary: cp25PublicBoundary(
        'CP25-A05 exposes bounded private reviewer workbench state only. It does not publish content or mark artifacts public-safe.',
      ),
    };
  }

  async getCp26SnapshotStatus(): Promise<PrivateCp26SnapshotStatusResponse> {
    const [latestSnapshot, latestRefresh, latestDiff] = await Promise.all([
      readJsonArtifact<Cp26LatestSnapshotPointer>(CP26_LATEST_SNAPSHOT_PATH),
      readJsonArtifact<Cp26LatestRefreshPointer>(CP26_LATEST_REFRESH_PATH),
      readJsonArtifact<Cp26LatestDiffPointer>(CP26_LATEST_DIFF_PATH),
    ]);
    const [snapshotManifest, refreshRun, diffProof] = await Promise.all([
      readJsonArtifact<Cp26SnapshotManifestSummary>(latestSnapshot.manifestPath),
      readJsonArtifact<Cp26RefreshRunSummary>(latestRefresh.refreshRunPath),
      readJsonArtifact<Cp26DiffProofSummary>(latestDiff.manifestPath),
    ]);
    const [checksumLedger, unresolvedReport, rollbackManifest] = await Promise.all([
      readJsonArtifact<Cp26ChecksumLedgerSummary>(snapshotManifest.checksumLedgerPath),
      readJsonArtifact<Cp26UnresolvedReferenceSummary>(refreshRun.unresolvedReferenceReportPath),
      readJsonArtifact<Cp26RollbackSummary>(diffProof.artifactPaths.rollbackManifest),
    ]);

    return {
      notice: DEFAULT_NOTICE,
      checkpoint: 'CP26-S06',
      route: 'GET /api/private-content/snapshots/cp26',
      sourceCheckpoint: 'CP26-S05',
      snapshot: {
        snapshotBatchId: snapshotManifest.snapshotBatchId,
        checkpoint: snapshotManifest.checkpoint,
        generatedAt: snapshotManifest.generatedAt,
        manifestPath: latestSnapshot.manifestPath,
        manifestSha256: latestSnapshot.manifestSha256,
        checksumLedgerPath: snapshotManifest.checksumLedgerPath,
        checksumLedgerSha256: snapshotManifest.checksumLedgerSha256,
        sourceGroupCount: snapshotManifest.counts.sourceGroupCount,
        snapshotArtifactCount: snapshotManifest.counts.snapshotArtifactCount,
        unresolvedReferenceCount: snapshotManifest.counts.unresolvedReferenceCount,
        highOrCriticalBlockerCount: snapshotManifest.counts.highOrCriticalBlockerCount,
        publicSafeSnapshotRowCount: 0,
        publicSafeGraphNodeCount: 0,
        publicSafeGraphEdgeCount: 0,
        publicSafeVaultArtifactCount: 0,
      },
      checksum: {
        totalEntries: checksumLedger.counts.totalEntries,
        newCount: checksumLedger.counts.newCount,
        unchangedCount: checksumLedger.counts.unchangedCount,
        changedCount: checksumLedger.counts.changedCount,
        removedCount: checksumLedger.counts.removedCount,
        missingCount: checksumLedger.counts.missingCount,
        staleCount: checksumLedger.counts.staleCount,
      },
      refresh: {
        refreshRunId: refreshRun.refreshRunId,
        status: refreshRun.status,
        refreshRunPath: latestRefresh.refreshRunPath,
        refreshRunSha256: latestRefresh.refreshRunSha256,
        refreshedOutputCount: refreshRun.counts.refreshedOutputCount,
        unresolvedReferenceCount: refreshRun.counts.unresolvedReferenceCount,
        highOrCriticalBlockerCount: refreshRun.counts.highOrCriticalBlockerCount,
      },
      diff: {
        proofId: diffProof.proofId,
        manifestPath: latestDiff.manifestPath,
        manifestSha256: latestDiff.manifestSha256,
        totalChecksumEntryCount: diffProof.counts.totalChecksumEntryCount,
        unchangedCount: diffProof.counts.unchangedCount,
        addedCount: diffProof.counts.addedCount,
        changedCount: diffProof.counts.changedCount,
        removedCount: diffProof.counts.removedCount,
        staleArtifactCount: diffProof.counts.staleArtifactCount,
        mismatchedArtifactCount: diffProof.counts.mismatchedArtifactCount,
        detectedMismatchProbeCount: diffProof.counts.detectedMismatchProbeCount,
      },
      unresolved: {
        reportPath: refreshRun.unresolvedReferenceReportPath,
        total: unresolvedReport.counts.total,
        blocking: unresolvedReport.counts.blocking,
        reviewRequired: unresolvedReport.counts.reviewRequired,
        highOrCritical: unresolvedReport.counts.highOrCritical,
        samples: unresolvedReport.references.slice(0, 4),
      },
      rollback: {
        manifestPath: diffProof.artifactPaths.rollbackManifest,
        rollbackManifestId: rollbackManifest.rollbackManifestId,
        rollbackTarget: rollbackManifest.rollbackTarget,
        restoreStepCount: rollbackManifest.restoreSteps.length,
      },
      publicBoundary: cp26PublicBoundary(
        'CP26-S06 exposes bounded private snapshot status only. Public release remains blocked and full source, graph, vault, review, and audit dumps are not sent to the client.',
      ),
    };
  }

  async getKnowledgeGraphifyCp27(): Promise<PrivateCp27InternalUiInspectionResponse> {
    const [latestGraph, latestVault, latestDiff] = await Promise.all([
      readJsonArtifact<Cp27LatestGraphPointer>(CP27_LATEST_GRAPH_PATH),
      readJsonArtifact<Cp27LatestVaultPointer>(CP27_LATEST_VAULT_PATH),
      readJsonArtifact<Cp27LatestDiffPointer>(CP27_LATEST_DIFF_PATH),
    ]);
    const [graphSummary, vaultSummary] = await Promise.all([
      readJsonArtifact<Cp27GraphSummary>(latestGraph.summaryPath),
      readJsonArtifact<Cp27VaultSummary>(latestVault.summaryPath),
    ]);

    return {
      notice: DEFAULT_NOTICE,
      checkpoint: 'CP27-G06',
      route: 'GET /api/private-content/knowledge-graphify/cp27',
      sourceCheckpoints: {
        graph: 'CP27-G03',
        vault: 'CP27-G04',
        diff: 'CP27-G05',
      },
      verifier: {
        status: 'pass',
        command: 'node scripts\\check_cp27_g06_internal_ui_proof.mjs',
        checkpoint: 'CP27-G06',
      },
      graph: {
        graphId: latestGraph.graphId,
        manifest: {
          path: latestGraph.manifestPath,
          sha256: latestGraph.manifestSha256,
        },
        summaryPath: latestGraph.summaryPath,
        checksumLedger: {
          path: latestGraph.checksumLedgerPath,
          sha256: latestGraph.checksumLedgerSha256,
        },
        nodeCount: latestGraph.counts.totalNodes,
        edgeCount: latestGraph.counts.totalEdges,
        partitionCount: latestGraph.counts.partitions,
        indexCount: latestGraph.counts.indexes,
        sourceGroupCount: latestGraph.counts.sourceGroupCount,
        mappedSourceGroupCount: latestGraph.counts.mappedSourceGroupCount,
        deferredItemCount: latestGraph.counts.deferredItemCount,
        blockedItemCount: latestGraph.counts.blockedItemCount,
        unresolvedReferenceCount: latestGraph.counts.unresolvedReferenceCount,
        highOrCriticalBlockerCount: latestGraph.counts.highOrCriticalBlockerCount,
        publicSafeNodeCount: 0,
        publicSafeEdgeCount: 0,
        partitions: graphSummary.partitionSummary,
        indexes: graphSummary.indexSummary,
      },
      vault: {
        vaultId: latestVault.vaultId,
        manifest: {
          path: latestVault.manifestPath,
          sha256: latestVault.manifestSha256,
        },
        summaryPath: latestVault.summaryPath,
        checksumLedger: {
          path: latestVault.checksumLedgerPath,
          sha256: latestVault.checksumLedgerSha256,
        },
        artifactCount: latestVault.counts.artifacts,
        categoryCount: latestVault.counts.categories,
        graphNodesReferenced: latestVault.counts.graphNodesReferenced,
        sourceGraphNodes: latestVault.counts.sourceGraphNodes,
        sourceGraphEdges: latestVault.counts.sourceGraphEdges,
        publicSafeArtifactCount: 0,
        categoryCounts: vaultSummary.categoryCounts,
      },
      diff: {
        proofId: latestDiff.proofId,
        manifest: {
          path: latestDiff.manifestPath,
          sha256: latestDiff.manifestSha256,
        },
        graphBaselineNodes: latestDiff.counts.graphBaselineNodes,
        graphRefreshedNodes: latestDiff.counts.graphRefreshedNodes,
        graphBaselineEdges: latestDiff.counts.graphBaselineEdges,
        graphRefreshedEdges: latestDiff.counts.graphRefreshedEdges,
        vaultBaselineArtifacts: latestDiff.counts.vaultBaselineArtifacts,
        vaultRefreshedArtifacts: latestDiff.counts.vaultRefreshedArtifacts,
        matchedCount: latestDiff.counts.matchedCount,
        addedCount: latestDiff.counts.addedCount,
        removedCount: latestDiff.counts.removedCount,
        changedCount: latestDiff.counts.changedCount,
        deferredCount: latestDiff.counts.deferredCount,
        blockedCount: latestDiff.counts.blockedCount,
        unresolvedReferenceCount: latestDiff.counts.unresolvedReferenceCount,
        highOrCriticalBlockerCount: latestDiff.counts.highOrCriticalBlockerCount,
      },
      responseBoundary: {
        fullGraphDumpIncluded: false,
        fullVaultDumpIncluded: false,
        rawSourceTextIncluded: false,
        maxPartitionRowsReturned: graphSummary.partitionSummary.length,
        maxIndexRowsReturned: graphSummary.indexSummary.length,
        maxVaultCategoryRowsReturned: Object.keys(vaultSummary.categoryCounts).length,
        message:
          'CP27-G06 returns bounded inspection summaries only. Full graph partitions, index bodies, vault pack Markdown, and raw source text are not sent to the client.',
      },
      artifactPaths: {
        latestGraphPointer: CP27_LATEST_GRAPH_PATH,
        latestVaultPointer: CP27_LATEST_VAULT_PATH,
        latestDiffPointer: CP27_LATEST_DIFF_PATH,
        graphSummary: latestGraph.summaryPath,
        vaultSummary: latestVault.summaryPath,
        diffManifest: latestDiff.manifestPath,
        internalUiProof: CP27_LATEST_UI_PROOF_PATH,
      },
      publicBoundary: cp27PublicBoundary(
        'CP27-G06 exposes bounded private graph/vault inspection only. Public release remains blocked and public-safe counts remain zero.',
      ),
    };
  }

  async createReviewerWorkbenchCp25Action(
    request: PrivateCp25ReviewerActionRequest,
  ): Promise<PrivateCp25ReviewerActionResponse> {
    if (!request.queueItemId?.trim()) {
      throw new BadRequestException('queueItemId is required for CP25 reviewer actions.');
    }
    if (!request.action?.trim()) {
      throw new BadRequestException('action is required for CP25 reviewer actions.');
    }

    const [queueItems, remediationStates, transitionRules] = await Promise.all([
      readJsonArtifact<PrivateCp25ReviewQueueItem[]>(CP25_REVIEW_QUEUE_PATH),
      readJsonArtifact<PrivateCp25RemediationState[]>(CP25_REMEDIATION_STATE_PATH),
      readJsonArtifact<Cp25TransitionRulesArtifact>(CP25_TRANSITION_RULES_PATH),
    ]);
    const queueItem = queueItems.find((item) => item.queueItemId === request.queueItemId);
    if (!queueItem) {
      throw new BadRequestException(`Unknown CP25 queueItemId: ${request.queueItemId}`);
    }
    const remediationState =
      (request.remediationId
        ? remediationStates.find((item) => item.remediationId === request.remediationId)
        : null) ??
      remediationStates.find((item) => item.queueItemId === queueItem.queueItemId) ??
      null;
    if (request.remediationId && remediationState?.queueItemId !== queueItem.queueItemId) {
      throw new BadRequestException('CP25 remediationId does not belong to the requested queue item.');
    }

    const normalizedRequest: PrivateCp25ReviewerActionRequest = {
      ...request,
      remediationId: remediationState?.remediationId ?? request.remediationId ?? null,
      reviewerId: request.reviewerId ?? null,
      notes: request.notes ?? null,
      affectedSourceIds: request.affectedSourceIds ?? queueItem.sourceIds,
      affectedGraphNodeIds: request.affectedGraphNodeIds ?? queueItem.graphNodeIds,
      affectedGraphEdgeIds: request.affectedGraphEdgeIds ?? queueItem.graphEdgeIds,
      affectedVaultPackIds: request.affectedVaultPackIds ?? queueItem.vaultPackIds,
      affectedEvidenceRouteIds: request.affectedEvidenceRouteIds ?? queueItem.evidenceRouteIds,
      affectedRouteItemIds: request.affectedRouteItemIds ?? queueItem.routeItemIds,
      affectedCandidateIds: request.affectedCandidateIds ?? queueItem.candidateIds,
      affectedRemediationIds: request.affectedRemediationIds ?? queueItem.remediationIds,
      boundaryAcknowledgement: request.boundaryAcknowledgement ?? {
        privateOnly: true,
        publicReleaseApproved: false,
        publicSafeChangeRequested: false,
      },
    };
    const validation = cp25ValidateReviewerAction(normalizedRequest, queueItem, transitionRules);
    const auditEvent: PrivateCp25ReviewAuditEvent = {
      auditEventId: `cp25-a05-audit-preview:${randomUUID()}`,
      queueItemId: queueItem.queueItemId,
      remediationId: remediationState?.remediationId ?? null,
      action: normalizedRequest.action,
      fromStatus: normalizedRequest.fromStatus,
      toStatus: validation.toStatus,
      reviewerRole: normalizedRequest.reviewerRole,
      reviewerId: normalizedRequest.reviewerId,
      notes:
        normalizedRequest.notes?.trim() ||
        (validation.allowed
          ? 'CP25-A05 private API action preview.'
          : `CP25-A05 blocked action preview: ${validation.blockedReasons.join(' ')}`),
      sourceIds: normalizedRequest.affectedSourceIds,
      graphNodeIds: normalizedRequest.affectedGraphNodeIds,
      graphEdgeIds: normalizedRequest.affectedGraphEdgeIds,
      vaultPackIds: normalizedRequest.affectedVaultPackIds,
      evidenceRouteIds: normalizedRequest.affectedEvidenceRouteIds,
      routeItemIds: normalizedRequest.affectedRouteItemIds,
      candidateIds: normalizedRequest.affectedCandidateIds,
      remediationIds: normalizedRequest.affectedRemediationIds,
      publicReleaseApproved: false,
      createdAt: new Date().toISOString(),
    };

    return {
      notice: DEFAULT_NOTICE,
      checkpoint: 'CP25-A05',
      route: 'POST /api/private-content/reviewer-workbench/cp25/actions',
      request: normalizedRequest,
      validation,
      queueItem,
      remediationState,
      auditEvent,
      publicBoundary: cp25PublicBoundary(
        'CP25-A05 validates a private reviewer action and returns an audit-event preview only. No public release or public-safe state changes are allowed.',
      ),
    };
  }

  listReviewQueue(options: ReviewQueueOptions): Promise<PrivateReviewQueueResponse> {
    return this.repository.listReviewQueue(options);
  }

  getReviewQueueItem(queueItemId: string): Promise<PrivateReviewQueueItemResponse> {
    return this.repository.getReviewQueueItem(queueItemId);
  }

  createAnswerDraft(options: AnswerDraftOptions): Promise<PrivateAnswerDraftResponse> {
    return this.repository.createAnswerDraft(options);
  }

  getAnswerDraft(answerDraftId: string): Promise<PrivateAnswerDraftResponse> {
    return this.repository.getAnswerDraft(answerDraftId);
  }

  createGuidedAnswer(options: AnswerDraftOptions): Promise<PrivateGuidedAnswerResponse> {
    return this.repository.createGuidedAnswer(options);
  }

  getGuidedAnswer(guidedAnswerId: string): Promise<PrivateGuidedAnswerResponse> {
    return this.repository.getGuidedAnswer(guidedAnswerId);
  }

  async createGuidanceSession(
    request: GuidanceSessionRequest,
  ): Promise<GuidanceSessionResponse> {
    const entryPoint = isGuidanceSessionEntryPoint(request.entryPoint)
      ? request.entryPoint
      : 'ask';
    const language = request.language ?? 'en';
    const domain = request.domain ?? 'all';
    const expandedNeed = expandGuidanceNeed(request.input);
    const riskPrecheck = assessGuidanceRisk(request.input);
    if (riskPrecheck.hardEscalation) {
      return {
        notice: DEFAULT_NOTICE,
        session: this.createEscalationGuidanceSession(
          request,
          entryPoint,
          language,
          domain,
          expandedNeed,
          riskPrecheck,
        ),
      };
    }
    const anchoredHadith =
      entryPoint === 'hadith_record' && request.hadithRecordId
        ? this.enrichHadithTextQuality(await this.repository.getHadithRecord(request.hadithRecordId))
        : null;
    const search = await this.repository.searchContent({
      q: expandedNeed.searchInput,
      domain,
      limit: 8,
      offset: 0,
    });
    const guided = await this.repository.createGuidedAnswer({
      q: expandedNeed.searchInput,
      intent: entryPoint,
      language,
      domain,
      limit: 6,
    });

    const quranAnchor = await this.createQuranAnchor(request, search.results, expandedNeed.searchInput, domain);
    const sunnahSupport = this.createSunnahSupport(search.results, anchoredHadith);
    const evidence = guided.guidedAnswer?.evidencePrompt ?? guided.answerDraft?.evidenceItems ?? [];
    const initialResponseState =
      guided.guidedAnswer?.responseState ?? guided.answerDraft?.responseState ?? 'blocked';
    const riskAssessment = this.createResolvedRiskAssessment(
      request.input,
      entryPoint,
      initialResponseState,
      quranAnchor,
      sunnahSupport,
      evidence.length,
    );
    const responseState = riskAssessment.responseState;
    const now = new Date().toISOString();
    const sessionId = randomUUID();
    const guidanceMessage = this.createGuidanceMessage(
      quranAnchor,
      sunnahSupport,
      guided.answerDraft?.draftAnswer,
    );

    const session: GuidanceSession = {
      sessionId,
      status:
        responseState === 'blocked' || responseState === 'source_unavailable'
          ? 'blocked_no_evidence'
          : responseState === 'scholar_escalation'
            ? 'scholar_escalation'
            : responseState === 'safety_escalation'
              ? 'safety_escalation'
            : 'ready',
      createdAt: now,
      updatedAt: now,
      need: {
        rawInput: request.input,
        entryPoint,
        detectedTheme: anchoredHadith?.record.collectionName ?? search.results[0]?.title ?? expandedNeed.theme,
        detectedIntent: `${guided.answerDraft?.detectedIntent ?? entryPoint}:${expandedNeed.theme}`,
        requestedLanguage: language,
        domainFilter: domain,
      },
      quranAnchor,
      sunnahSupport,
      verification: {
        status: responseState,
        summary: this.verificationSummary(
          responseState,
          evidence.length,
          quranAnchor,
          sunnahSupport.length,
          expandedNeed,
        ),
        evidenceCount: evidence.length,
        quranEvidenceCount: evidence.filter((item) =>
          ['quran', 'tafsir', 'topic', 'ayah_theme'].includes(item.domain),
        ).length,
        sunnahEvidenceCount: evidence.filter((item) => item.domain === 'hadith').length,
        requiresScholarReview: responseState === 'scholar_escalation' || responseState === 'safety_escalation',
        reviewStatus: guided.guidedAnswer?.reviewStatus ?? guided.answerDraft?.reviewStatus ?? 'unreviewed',
        evidence,
      },
      riskAssessment,
      guidance: {
        title: quranAnchor ? `Guidance from ${quranAnchor.verseKey}` : 'Guidance needs stronger evidence',
        message: guidanceMessage,
        reflectionPrompt: quranAnchor
          ? `What is ${quranAnchor.verseKey} asking me to notice today?`
          : 'What question should I bring back with clearer context?',
        action: {
          actionId: `${sessionId}:action`,
          label: quranAnchor
            ? 'Read the Quran anchor once more, then choose one small act of obedience.'
            : 'Ask again with one clearer detail before acting.',
          completed: false,
        },
        nextStep: {
          label: quranAnchor ? 'Read Quran anchor' : 'Refine question',
          route: quranAnchor ? ayahStudyRoute(quranAnchor.surahNumber, quranAnchor.ayahNumber) : '/answer',
          reason: quranAnchor ? 'Quran remains the first anchor for the session.' : 'The session needs stronger evidence.',
        },
      },
      learningPath: this.createLearningPath(quranAnchor, sunnahSupport, sessionId),
      researchSuggestions: [
        ...(quranAnchor?.researchSuggestions ?? []),
        ...sunnahSupport.flatMap((support) => support.researchSuggestions ?? []),
      ],
      memory: {
        saved: false,
        reflectionText: null,
        journalEntryId: null,
        resumedFromSessionId: request.resumeSessionId ?? null,
      },
      sourceMap: {
        retrievalTraceId: search.retrievalTrace.traceId ?? guided.answerDraft?.retrievalTraceId ?? null,
        searchResults: search.results,
        sourceTargets: [
          quranAnchor?.sourceDetailTarget,
          ...sunnahSupport.map((support) => support.sourceDetailTarget),
        ].filter((target): target is NonNullable<typeof target> => Boolean(target)),
        sourceSearchRoute: sourceSearchRoute(expandedNeed.searchInput, domain),
      },
    };

    return {
      notice: guided.notice ?? search.notice ?? DEFAULT_NOTICE,
      session,
    };
  }

  private createEscalationGuidanceSession(
    request: GuidanceSessionRequest,
    entryPoint: GuidanceSessionEntryPoint,
    language: string,
    domain: string,
    expandedNeed: ExpandedGuidanceNeed,
    riskAssessment: RiskPrecheck,
  ): GuidanceSession {
    const now = new Date().toISOString();
    const sessionId = randomUUID();
    const isScholar = riskAssessment.responseState === 'scholar_escalation';
    const isProfessional = riskAssessment.escalationRoute === 'professional';
    const title = isScholar
      ? 'Ask a qualified scholar'
      : isProfessional
        ? 'Get qualified help first'
        : 'Safety comes first';
    const nextLabel = isScholar ? 'Prepare question for scholar' : 'Seek help now';

    return {
      sessionId,
      status: riskAssessment.responseState === 'scholar_escalation' ? 'scholar_escalation' : 'safety_escalation',
      createdAt: now,
      updatedAt: now,
      need: {
        rawInput: request.input,
        entryPoint,
        detectedTheme: expandedNeed.theme,
        detectedIntent: `${riskAssessment.riskClass}:${expandedNeed.theme}`,
        requestedLanguage: language,
        domainFilter: domain,
      },
      quranAnchor: null,
      sunnahSupport: [],
      verification: {
        status: riskAssessment.responseState,
        summary: riskAssessment.summary,
        evidenceCount: 0,
        quranEvidenceCount: 0,
        sunnahEvidenceCount: 0,
        requiresScholarReview: true,
        reviewStatus: 'escalation_required',
        evidence: [],
      },
      riskAssessment,
      guidance: {
        title,
        message: riskAssessment.userBoundary,
        reflectionPrompt: isScholar
          ? 'What facts and context should a qualified scholar know before giving advice?'
          : 'Who can I contact now for immediate, qualified support?',
        action: {
          actionId: `${sessionId}:action`,
          label: isScholar
            ? 'Write the context clearly and ask a qualified scholar before acting.'
            : 'Contact a trusted person, local professional, or emergency service before acting.',
          completed: false,
        },
        nextStep: {
          label: nextLabel,
          route: '/answer',
          reason: riskAssessment.summary,
        },
      },
      learningPath: this.createLearningPath(null, [], sessionId),
      researchSuggestions: [],
      memory: {
        saved: false,
        reflectionText: null,
        journalEntryId: null,
        resumedFromSessionId: request.resumeSessionId ?? null,
      },
      sourceMap: {
        retrievalTraceId: null,
        searchResults: [],
        sourceTargets: [],
        sourceSearchRoute: sourceSearchRoute(expandedNeed.searchInput, domain),
      },
    };
  }

  private createResolvedRiskAssessment(
    input: string,
    entryPoint: GuidanceSessionEntryPoint,
    responseState: GuidanceSession['verification']['status'],
    quranAnchor: GuidanceSessionQuranAnchor | null,
    sunnahSupport: GuidanceSessionSunnahSupport[],
    evidenceCount: number,
  ): GuidanceSessionRiskAssessment {
    if (responseState === 'blocked' || responseState === 'source_unavailable' || evidenceCount === 0) {
      return {
        riskClass: 'no_evidence',
        responseState: responseState === 'approved' ? 'source_unavailable' : responseState,
        summary: 'No sufficient verified evidence was selected for this wording.',
        matchedTerms: [],
        escalationRoute: 'source_search',
        userBoundary: 'RAFIQ should not answer this as guidance until stronger source evidence is available.',
      };
    }

    if (responseState === 'scholar_escalation' || responseState === 'safety_escalation') {
      const precheck = assessGuidanceRisk(input);
      return {
        ...precheck,
        responseState,
        summary: precheck.summary,
      };
    }

    const primarySunnah = sunnahSupport[0];
    const primaryGrade = primarySunnah?.gradeLabel?.toLowerCase() ?? '';
    const unverifiedHadith =
      entryPoint === 'hadith_record' &&
      primarySunnah &&
      (!primarySunnah.gradeLabel ||
        primaryGrade.includes('not listed') ||
        primaryGrade.includes('unknown') ||
        primaryGrade.includes('weak') ||
        primaryGrade.includes('fabricated') ||
        !primarySunnah.narrationText);
    if (unverifiedHadith) {
      return {
        riskClass: 'weak_or_unverified_hadith',
        responseState: 'approved_with_disclaimer',
        summary: 'Primary Hadith support requires caution because grade/text verification is incomplete.',
        matchedTerms: [primarySunnah.gradeLabel ?? 'grade unavailable'],
        escalationRoute: 'scholar',
        userBoundary:
          'Read this narration with its reference and verification note visible. Do not use it as a standalone ruling or forward it without qualified review.',
      };
    }

    return {
      ...ordinaryRiskAssessment(),
      responseState,
      summary: quranAnchor
        ? 'Ordinary reflection request passed into sourced Quran-first guidance.'
        : 'Ordinary request did not force a Quran anchor.',
    };
  }

  private async createQuranAnchor(
    request: GuidanceSessionRequest,
    results: PrivateSearchResult[],
    expandedInput: string,
    domain: string,
  ): Promise<GuidanceSessionQuranAnchor | null> {
    const quranResult =
      results.find((result) => ['quran', 'tafsir', 'ayah_theme'].includes(result.domain)) ?? null;
    const fallbackQuranResult = quranResult || domain === 'hadith'
      ? null
      : (await this.repository.searchContent({
          q: expandedInput,
          domain: 'quran',
          limit: 3,
          offset: 0,
        })).results.find((result) => ['quran', 'tafsir', 'ayah_theme'].includes(result.domain)) ?? null;
    const selectedQuranResult = quranResult ?? fallbackQuranResult;
    const surahNumber = request.quran?.surahNumber ?? resultSurahNumber(selectedQuranResult);
    if (!surahNumber) return null;

    const surah = await this.repository.getQuranSurah(surahNumber, {});
    const verseKey = request.quran?.verseKey ?? resultVerseKey(selectedQuranResult);
    const ayahNumber = request.quran?.ayahNumber ?? resultAyahNumber(selectedQuranResult);
    const ayah =
      surah.ayahs.find((item) => (verseKey ? item.verseKey === verseKey : false)) ??
      surah.ayahs.find((item) => (ayahNumber ? item.ayahNumber === ayahNumber : false)) ??
      surah.ayahs[0];
    if (!ayah) return null;

    const tafsirPassage = ayah.tafsirPassages.find((passage) => !passage.blankText);
    const tafsir = tafsirPassage?.text ?? null;
    const tafsirTarget = tafsirPassage?.sourceDetailTarget ?? null;
    const quranSourceTarget = ayah.quranTextSourceDetailTarget ?? ayah.sourceDetailTarget ?? null;
    const deepLinks: RafiqDeepLink[] = [
      {
        linkId: `${ayah.verseKey}:read-ayah`,
        label: 'Read ayah',
        kind: 'read_ayah',
        route: ayahStudyRoute(ayah.surahNumber, ayah.ayahNumber),
        sourceDetailTarget: quranSourceTarget,
        guidanceTarget: {
          entryPoint: 'quran_ayah',
          input: ayah.verseKey,
          domain: 'quran',
          quran: {
            surahNumber: ayah.surahNumber,
            ayahNumber: ayah.ayahNumber,
            verseKey: ayah.verseKey,
          },
        },
      },
      {
        linkId: `${ayah.verseKey}:open-tafsir`,
        label: 'Open tafsir',
        kind: 'open_tafsir',
        route: tafsirStudyRoute(tafsirPassage?.passageId) ?? ayahStudyRoute(ayah.surahNumber, ayah.ayahNumber),
        sourceDetailTarget: tafsirTarget,
        guidanceTarget: null,
      },
      {
        linkId: `${ayah.verseKey}:related-quran`,
        label: 'Search related Quran',
        kind: 'related_quran',
        route: sourceSearchRoute(ayah.verseKey, 'quran'),
        sourceDetailTarget: null,
        guidanceTarget: null,
      },
      {
        linkId: `${ayah.verseKey}:find-sunnah`,
        label: 'Find Sunnah support',
        kind: 'find_sunnah',
        route: sourceSearchRoute(ayah.verseKey, 'hadith'),
        sourceDetailTarget: null,
        guidanceTarget: null,
      },
    ];
    const researchSuggestions: GuidanceResearchSuggestion[] = [
      {
        suggestionId: `${ayah.verseKey}:translation`,
        kind: 'translation',
        label: 'Compare translations',
        query: ayah.verseKey,
        route: sourceSearchRoute(ayah.verseKey, 'translation'),
        sourceDetailTarget: ayah.translation?.sourceDetailTarget ?? null,
      },
      {
        suggestionId: `${ayah.verseKey}:tafsir`,
        kind: 'tafsir',
        label: 'Compare tafsir sources',
        query: ayah.verseKey,
        route: sourceSearchRoute(ayah.verseKey, 'tafsir'),
        sourceDetailTarget: tafsirTarget,
      },
      {
        suggestionId: `${ayah.verseKey}:sunnah`,
        kind: 'sunnah',
        label: 'Find Sunnah support',
        query: ayah.verseKey,
        route: sourceSearchRoute(ayah.verseKey, 'hadith'),
        sourceDetailTarget: null,
      },
    ];
    return {
      verseKey: ayah.verseKey,
      surahNumber: ayah.surahNumber,
      ayahNumber: ayah.ayahNumber,
      arabicText: ayah.quranText,
      translationText: ayah.translation?.text ?? null,
      simpleMeaning: firstSentence(ayah.translation?.text ?? tafsir ?? selectedQuranResult?.snippet),
      tafsirSummary: tafsir ? firstSentence(tafsir) : null,
      sourceDetailTarget: quranSourceTarget,
      deepLinks,
      researchSuggestions,
      ayah,
    };
  }

  private createSunnahSupport(
    results: PrivateSearchResult[],
    anchoredHadith?: HadithDetailResponse | null,
  ): GuidanceSessionSunnahSupport[] {
    const anchor = anchoredHadith ? this.createAnchoredSunnahSupport(anchoredHadith) : null;
    const anchoredRecordId = anchoredHadith?.record.hadithRecordId ?? null;
    const related = results
      .filter((result) => result.domain === 'hadith')
      .filter((result) => resultHadithRecordId(result) !== anchoredRecordId)
      .sort((first, second) => {
        const firstSameCollection = first.reference.collectionKey === anchoredHadith?.record.collectionKey ? 1 : 0;
        const secondSameCollection = second.reference.collectionKey === anchoredHadith?.record.collectionKey ? 1 : 0;
        if (firstSameCollection !== secondSameCollection) return secondSameCollection - firstSameCollection;
        return (second.score ?? 0) - (first.score ?? 0);
      })
      .slice(0, anchor ? 1 : 2)
      .map((result) => {
        const hadithRecordId = resultHadithRecordId(result);
        const collectionKey = result.reference.collectionKey ?? result.target.collectionKey ?? null;
        const sourceDetailTarget = hadithRecordId
          ? { entityType: 'hadith_record', entityId: hadithRecordId }
          : null;

        return {
          supportId: result.resultId,
          title: result.title,
          narrationText: result.snippet,
          reference:
            result.reference.collectionKey || result.reference.hadithRecordId
              ? [result.reference.collectionKey, result.target.sourceHadithNumber].filter(Boolean).join(' ')
              : null,
          collectionKey,
          gradeLabel: null,
          verificationSummary: 'Check the narration reference and reliability note before practice or sharing.',
          practiceConnection: compactHadithMeaning(result.snippet),
          sourceDetailTarget,
          deepLinks: this.createSunnahDeepLinks({
            supportId: result.resultId,
            title: result.title,
            hadithRecordId,
            collectionKey,
            sourceDetailTarget,
            queryText: result.title,
          }),
          researchSuggestions: this.createSunnahResearchSuggestions({
            supportId: result.resultId,
            queryText: result.title,
            sourceDetailTarget,
          }),
        };
      });

    return [anchor, ...related].filter((support): support is GuidanceSessionSunnahSupport => Boolean(support));
  }

  private createAnchoredSunnahSupport(detail: HadithDetailResponse): GuidanceSessionSunnahSupport {
    const preferredText =
      detail.textVersions.find((version) => version.languageCode === 'en' && version.qualitySeverity !== 'withheld') ??
      detail.textVersions.find((version) => version.languageCode === 'ms' && version.qualitySeverity !== 'withheld') ??
      detail.textVersions.find((version) => version.languageCode === 'id' && version.qualitySeverity !== 'withheld') ??
      detail.textVersions.find((version) => version.languageCode !== 'ar' && version.qualitySeverity !== 'withheld') ??
      detail.textVersions.find((version) => version.languageCode === 'ar' && version.qualitySeverity !== 'withheld') ??
      detail.textVersions[0] ??
      null;
    const textWithheld = preferredText?.qualitySeverity === 'withheld';
    const grade = detail.gradeAssertions[0];
    const claim = detail.verificationClaims[0];
    const reference = [
      detail.record.collectionKey,
      detail.record.printedReference ??
        detail.record.sourceHadithNumber ??
        detail.record.sourceArabicNumber,
    ].filter(Boolean).join(' ');

    return {
      supportId: `hadith-record:${detail.record.hadithRecordId}`,
      title: detail.record.collectionName ?? detail.record.collectionKey,
      narrationText: textWithheld ? null : preferredText?.fullText ?? null,
      reference: reference || detail.record.sourceHadithKey,
      collectionKey: detail.record.collectionKey,
      gradeLabel: grade?.normalizedLabel ?? grade?.rawGrade ?? null,
      verificationSummary:
        claim?.claimText ??
        claim?.rawConclusion ??
        (grade?.reviewStatus ? `Reliability note: ${grade.reviewStatus}.` : 'No additional verification note is attached yet. Read with care.'),
      practiceConnection: textWithheld
        ? 'A related narration is available, but its meaning text needs review. Open the narration study room and keep the reliability note visible before applying it.'
        : compactHadithMeaning(preferredText?.fullText),
      sourceDetailTarget: detail.record.sourceDetailTarget ?? { entityType: 'hadith_record', entityId: detail.record.hadithRecordId },
      deepLinks: this.createSunnahDeepLinks({
        supportId: `hadith-record:${detail.record.hadithRecordId}`,
        title: detail.record.collectionName ?? detail.record.collectionKey,
        hadithRecordId: detail.record.hadithRecordId,
        collectionKey: detail.record.collectionKey,
        sourceDetailTarget: detail.record.sourceDetailTarget ?? { entityType: 'hadith_record', entityId: detail.record.hadithRecordId },
        queryText: preferredText?.fullText ?? detail.record.sourceHadithKey,
      }),
      researchSuggestions: this.createSunnahResearchSuggestions({
        supportId: `hadith-record:${detail.record.hadithRecordId}`,
        queryText: preferredText?.fullText ?? detail.record.sourceHadithKey,
        sourceDetailTarget: detail.record.sourceDetailTarget ?? { entityType: 'hadith_record', entityId: detail.record.hadithRecordId },
      }),
      record: {
        hadithRecordId: detail.record.hadithRecordId,
        collectionKey: detail.record.collectionKey,
        collectionName: detail.record.collectionName,
        editionKey: detail.record.editionKey,
        sourceHadithKey: detail.record.sourceHadithKey,
        sourceHadithNumber: detail.record.sourceHadithNumber,
        sourceUrn: detail.record.sourceUrn,
        printedReference: detail.record.printedReference,
        previewText: textWithheld ? undefined : preferredText?.fullText,
        previewLanguageCode: preferredText?.languageCode,
        gradeSummary: detail.gradeAssertions.map((item) => ({
          graderNameRaw: item.graderNameRaw,
          rawGrade: item.rawGrade,
          normalizedLabel: item.normalizedLabel,
          claimScope: item.claimScope,
          reviewStatus: item.reviewStatus,
        })),
      },
    };
  }

  private createSunnahDeepLinks(options: {
    supportId: string;
    title: string;
    hadithRecordId?: string | null;
    collectionKey?: string | null;
    sourceDetailTarget?: { entityType: string; entityId: string } | null;
    queryText: string;
  }): RafiqDeepLink[] {
    const sourceRoute = sourceDetailRoute(options.sourceDetailTarget);
    return [
      {
        linkId: `${options.supportId}:open-narration`,
        label: 'Open narration',
        kind: 'open_narration',
        route: options.hadithRecordId ? `/hadith/${options.hadithRecordId}` : '/hadith',
        sourceDetailTarget: options.sourceDetailTarget ?? null,
        guidanceTarget: options.hadithRecordId
          ? {
              entryPoint: 'hadith_record',
              input: options.title,
              domain: 'hadith',
              hadithRecordId: options.hadithRecordId,
            }
          : null,
      },
      {
        linkId: `${options.supportId}:related-narrations`,
        label: 'Related narrations',
        kind: 'related_narrations',
        route: sourceSearchRoute(options.queryText, 'hadith'),
        sourceDetailTarget: null,
        guidanceTarget: null,
      },
      {
        linkId: `${options.supportId}:check-verification`,
        label: 'Check verification',
        kind: 'check_verification',
        route: sourceRoute ?? sourceSearchRoute(options.queryText, 'verification'),
        sourceDetailTarget: options.sourceDetailTarget ?? null,
        guidanceTarget: null,
      },
      {
        linkId: `${options.supportId}:quran-connection`,
        label: 'Search Quran connection',
        kind: 'search_quran_connection',
        route: sourceSearchRoute(options.queryText, 'quran'),
        sourceDetailTarget: null,
        guidanceTarget: null,
      },
    ];
  }

  private createSunnahResearchSuggestions(options: {
    supportId: string;
    queryText: string;
    sourceDetailTarget?: { entityType: string; entityId: string } | null;
  }): GuidanceResearchSuggestion[] {
    return [
      {
        suggestionId: `${options.supportId}:related-hadith`,
        kind: 'sunnah',
        label: 'Study related narrations',
        query: options.queryText,
        route: sourceSearchRoute(options.queryText, 'hadith'),
        sourceDetailTarget: options.sourceDetailTarget ?? null,
      },
      {
        suggestionId: `${options.supportId}:quran-link`,
        kind: 'quran',
        label: 'Search Quran connection',
        query: options.queryText,
        route: sourceSearchRoute(options.queryText, 'quran'),
        sourceDetailTarget: null,
      },
      {
        suggestionId: `${options.supportId}:verification`,
        kind: 'verification',
        label: 'Review verification evidence',
        query: options.queryText,
        route: sourceSearchRoute(options.queryText, 'verification'),
        sourceDetailTarget: options.sourceDetailTarget ?? null,
      },
    ];
  }

  private enrichSourceSearchResult(result: PrivateSearchResult, query: string): PrivateSearchResult {
    const studyRoute = sourceResultStudyRoute(result);
    const routedResult: PrivateSearchResult = {
      ...result,
      target: {
        ...result.target,
        route: studyRoute,
      },
    };
    const guidanceTarget = this.createSourceResultGuidanceTarget(result, query);
    return {
      ...routedResult,
      deepLinks: this.createSourceResultDeepLinks(routedResult, query, guidanceTarget),
      openGuidanceTarget: guidanceTarget,
    };
  }

  private async createAyahReferenceSourceResults(
    query: string,
    domain: string,
  ): Promise<PrivateSearchResult[]> {
    const reference = parseAyahReference(query);
    if (!reference) return [];

    const normalizedDomain = domain.toLowerCase();
    const include = (resultDomain: PrivateSearchResult['domain']) =>
      normalizedDomain === 'all' ||
      normalizedDomain === resultDomain ||
      (normalizedDomain === 'translation' && resultDomain === 'translation') ||
      (normalizedDomain === 'quran' && resultDomain === 'quran') ||
      (normalizedDomain === 'tafsir' && resultDomain === 'tafsir');

    const surah = await this.repository.getQuranSurah(reference.surahNumber, {});
    const ayah = surah.ayahs.find((item) => item.ayahNumber === reference.ayahNumber);
    if (!ayah) return [];

    const results: PrivateSearchResult[] = [];
    if (include('quran')) results.push(this.createAyahQuranSearchResult(ayah));
    if (ayah.translation && include('translation')) results.push(this.createAyahTranslationSearchResult(ayah));
    const tafsir = ayah.tafsirPassages.find((passage) => !passage.blankText);
    if (tafsir && include('tafsir')) results.push(this.createAyahTafsirSearchResult(ayah, tafsir));
    return results;
  }

  private createAyahQuranSearchResult(ayah: QuranSurahAyah): PrivateSearchResult {
    return {
      domain: 'quran',
      resultId: `quran-reference:${ayah.verseKey}`,
      title: ayah.verseKey,
      subtitle: 'Quran ayah',
      snippet: ayah.quranText,
      score: 99,
      reference: {
        surahNumber: ayah.surahNumber,
        ayahNumber: ayah.ayahNumber,
        verseKey: ayah.verseKey,
        hadithRecordId: null,
        collectionKey: null,
      },
      target: {
          route: ayahStudyRoute(ayah.surahNumber, ayah.ayahNumber),
        surahNumber: ayah.surahNumber,
        ayahNumber: ayah.ayahNumber,
        verseKey: ayah.verseKey,
      },
    };
  }

  private createAyahTranslationSearchResult(ayah: QuranSurahAyah): PrivateSearchResult {
    return {
      domain: 'translation',
      resultId: `translation-reference:${ayah.verseKey}:${ayah.translation?.translationTextId ?? 'default'}`,
      title: `${ayah.verseKey} translation`,
      subtitle: ayah.translation?.variantType ?? 'Translation',
      snippet: ayah.translation?.text ?? '',
      score: 98,
      reference: {
        surahNumber: ayah.surahNumber,
        ayahNumber: ayah.ayahNumber,
        verseKey: ayah.verseKey,
        hadithRecordId: null,
        collectionKey: null,
      },
      target: {
        route: ayahStudyRoute(ayah.surahNumber, ayah.ayahNumber),
        surahNumber: ayah.surahNumber,
        ayahNumber: ayah.ayahNumber,
        verseKey: ayah.verseKey,
        translationTextId: ayah.translation?.translationTextId ?? null,
        languageCode: 'en',
      },
    };
  }

  private createAyahTafsirSearchResult(
    ayah: QuranSurahAyah,
    tafsir: QuranSurahAyah['tafsirPassages'][number],
  ): PrivateSearchResult {
    return {
      domain: 'tafsir',
      resultId: `tafsir-reference:${tafsir.passageId}`,
      title: `Tafsir ${ayah.verseKey}`,
      subtitle: tafsir.sourceRole ?? 'Tafsir context',
      snippet: tafsir.text,
      score: 97,
      reference: {
        surahNumber: ayah.surahNumber,
        ayahNumber: ayah.ayahNumber,
        verseKey: ayah.verseKey,
        hadithRecordId: null,
        collectionKey: null,
      },
      target: {
        route: tafsirStudyRoute(tafsir.passageId) ?? ayahStudyRoute(ayah.surahNumber, ayah.ayahNumber),
        surahNumber: ayah.surahNumber,
        ayahNumber: ayah.ayahNumber,
        verseKey: ayah.verseKey,
        passageId: tafsir.passageId,
      },
    };
  }

  private dedupeSourceSearchResults(results: PrivateSearchResult[]): PrivateSearchResult[] {
    const seen = new Set<string>();
    return results.filter((result) => {
      const verseKey = result.reference.verseKey ?? result.target.verseKey ?? null;
      const dedupeKey =
        result.domain === 'quran' && verseKey
          ? `quran:${verseKey}`
          : result.resultId;
      if (seen.has(dedupeKey)) return false;
      seen.add(dedupeKey);
      return true;
    });
  }

  private createSourceResultGuidanceTarget(
    result: PrivateSearchResult,
    query: string,
  ): PrivateSearchResult['openGuidanceTarget'] {
    const surahNumber = result.reference.surahNumber ?? result.target.surahNumber ?? null;
    const ayahNumber = result.reference.ayahNumber ?? result.target.ayahNumber ?? null;
    const verseKey = result.reference.verseKey ?? result.target.verseKey ?? null;
    const hadithRecordId = resultHadithRecordId(result);

    if (hadithRecordId) {
      return {
        entryPoint: 'hadith_record',
        input: result.title || query,
        domain: 'hadith',
        sourceResultId: result.resultId,
        hadithRecordId,
      };
    }

    if (surahNumber) {
      return {
        entryPoint: 'quran_ayah',
        input: verseKey ?? result.title ?? query,
        domain: 'quran',
        sourceResultId: result.resultId,
        quran: {
          surahNumber,
          ayahNumber: ayahNumber ?? undefined,
          verseKey: verseKey ?? undefined,
        },
      };
    }

    return {
      entryPoint: 'learn_theme',
      input: result.title || query,
      domain: result.domain,
      sourceResultId: result.resultId,
    };
  }

  private createSourceResultDeepLinks(
    result: PrivateSearchResult,
    query: string,
    guidanceTarget: PrivateSearchResult['openGuidanceTarget'],
  ): RafiqDeepLink[] {
    const sourceTarget = this.sourceDetailTargetForSearchResult(result);
    const sourceRoute = sourceDetailRoute(sourceTarget);
    const links: RafiqDeepLink[] = [
      {
        linkId: `${result.resultId}:open`,
        label: this.openLabelForSearchResult(result),
        kind: result.domain === 'hadith' ? 'open_narration' : result.domain === 'tafsir' ? 'open_tafsir' : 'read_ayah',
        route: result.target.route,
        sourceDetailTarget: sourceTarget,
        guidanceTarget,
      },
      {
        linkId: `${result.resultId}:guidance`,
        label: 'Open guidance',
        kind: 'open_guidance',
        route: '/search',
        sourceDetailTarget: sourceTarget,
        guidanceTarget,
      },
      {
        linkId: `${result.resultId}:sources`,
        label: 'Source detail',
        kind: 'source_detail',
        route: sourceRoute ?? result.target.route,
        sourceDetailTarget: sourceTarget,
        guidanceTarget: null,
      },
    ];

    if (result.domain === 'hadith') {
      links.push({
        linkId: `${result.resultId}:quran-connection`,
        label: 'Search Quran connection',
        kind: 'search_quran_connection',
        route: sourceSearchRoute(result.snippet || query, 'quran'),
        sourceDetailTarget: null,
        guidanceTarget: null,
      });
    } else {
      links.push({
        linkId: `${result.resultId}:sunnah-support`,
        label: 'Find Sunnah support',
        kind: 'find_sunnah',
        route: sourceSearchRoute(result.reference.verseKey ?? result.title ?? query, 'hadith'),
        sourceDetailTarget: null,
        guidanceTarget: null,
      });
    }

    return links;
  }

  private sourceDetailTargetForSearchResult(result: PrivateSearchResult): { entityType: string; entityId: string } | null {
    const hadithRecordId = resultHadithRecordId(result);
    if (hadithRecordId) return { entityType: 'hadith_record', entityId: hadithRecordId };
    if (result.domain === 'translation' && result.target.translationTextId) {
      return { entityType: 'translation_text', entityId: String(result.target.translationTextId) };
    }
    if (result.target.passageId) return { entityType: 'tafsir_passage', entityId: String(result.target.passageId) };
    if (result.target.topicId) return { entityType: 'source_topic', entityId: String(result.target.topicId) };
    if (result.target.themeGroupId) return { entityType: 'source_ayah_theme_group', entityId: String(result.target.themeGroupId) };
    if (result.reference.verseKey ?? result.target.verseKey) {
      return { entityType: 'quran_ayah_text', entityId: String(result.reference.verseKey ?? result.target.verseKey) };
    }
    return null;
  }

  private openLabelForSearchResult(result: PrivateSearchResult): string {
    if (result.domain === 'hadith') return 'Open narration';
    if (result.domain === 'tafsir') return 'Open tafsir';
    if (result.domain === 'topic') return 'Open topic';
    if (result.domain === 'ayah_theme') return 'Open theme';
    return 'Read ayah';
  }

  private filterSourceSearchResults(results: PrivateSearchResult[], domain: string): PrivateSearchResult[] {
    const normalized = domain.toLowerCase();
    if (normalized === 'all') return results;
    if (normalized === 'topics' || normalized === 'topic') return results.filter((result) => result.domain === 'topic');
    if (normalized === 'themes' || normalized === 'theme' || normalized === 'ayah_theme') {
      return results.filter((result) => result.domain === 'ayah_theme');
    }
    if (normalized === 'translation') {
      return results.filter((result) => result.domain === 'translation');
    }
    if (normalized === 'verification') {
      return results.filter((result) => result.domain === 'verification');
    }
    return results.filter((result) => result.domain === normalized);
  }

  private groupSourceSearchResults(results: PrivateSearchResult[]): PrivateSourceSearchGroup[] {
    const order: Array<{ groupKey: PrivateSourceSearchGroupKey; label: string }> = [
      { groupKey: 'quran', label: 'Quran' },
      { groupKey: 'translation', label: 'Translations' },
      { groupKey: 'tafsir', label: 'Tafsir' },
      { groupKey: 'hadith', label: 'Hadith' },
      { groupKey: 'topics', label: 'Topics' },
      { groupKey: 'themes', label: 'Themes' },
      { groupKey: 'verification', label: 'Verification' },
    ];

    return order
      .map((group) => {
        const groupResults = results.filter((result) => sourceGroupKeyForResult(result) === group.groupKey);
        return {
          ...group,
          total: groupResults.length,
          results: groupResults,
        };
      })
      .filter((group) => group.total > 0);
  }

  private facetsForSourceGroups(groups: PrivateSourceSearchGroup[]): Record<string, number> {
    return groups.reduce<Record<string, number>>((facets, group) => {
      facets[group.groupKey] = group.total;
      return facets;
    }, {});
  }

  private sourceSearchRank(result: PrivateSearchResult, requestedDomain: string): number {
    const requested = requestedDomain.toLowerCase();
    const domainMatch =
      requested === 'all' ||
      requested === result.domain ||
      (requested === 'topics' && result.domain === 'topic') ||
      (requested === 'themes' && result.domain === 'ayah_theme')
        ? 10
        : 0;
    const score = typeof result.score === 'number' ? result.score : 0;
    const routeWeight = result.target.route ? 1 : 0;
    const guidanceWeight = result.openGuidanceTarget ? 1 : 0;
    const domainWeight =
      result.domain === 'quran'
        ? 5
        : result.domain === 'tafsir'
          ? 4
          : result.domain === 'hadith'
            ? 3
            : 2;
    return domainMatch + score + routeWeight + guidanceWeight + domainWeight;
  }

  private enrichSourceDetailForStudy(response: PrivateSourceDetailResponse): PrivateSourceDetailResponse {
    const detail = response.sourceDetail;
    const provenance = detail.provenance.map((item) => {
      if (item.snapshot.attributionText) return item;
      if (detail.entityType === 'translation_text' || detail.entityType === 'translation_edition') {
        const sourceName = item.source.name ?? 'Quranic Universal Library';
        const snapshotKey = item.snapshot.snapshotKey ? ` (${item.snapshot.snapshotKey})` : '';
        const translator = detail.subtitle?.includes('sahih') ? 'Saheeh International translation' : 'Quran translation';
        return {
          ...item,
          snapshot: {
            ...item.snapshot,
            attributionText: `${translator} via ${sourceName}${snapshotKey}. Rights and publication approval remain pending.`,
          },
        };
      }
      return item;
    });

    return {
      ...response,
      sourceDetail: {
        ...detail,
        provenance,
      },
    };
  }

  private enrichHadithTextQuality(detail: HadithDetailResponse): HadithDetailResponse {
    const textVersions = detail.textVersions.map((version) => {
      const qualityFlags = qualityFlagsForHadithText(version.fullText, version.languageCode);
      const qualitySeverity = severityForHadithQuality(qualityFlags);
      return {
        ...version,
        qualityFlags,
        qualitySeverity,
        qualitySummary: hadithQualitySummary(qualityFlags, qualitySeverity),
      };
    });
    const flaggedTextVersionCount = textVersions.filter((version) => version.qualitySeverity !== 'ok').length;
    const withheldTextVersionCount = textVersions.filter((version) => version.qualitySeverity === 'withheld').length;
    const displayTextVersion =
      textVersions.find((version) => version.languageCode !== 'ar' && version.qualitySeverity !== 'withheld') ??
      textVersions.find((version) => version.qualitySeverity !== 'withheld') ??
      null;

    return {
      ...detail,
      textVersions,
      qualitySummary: {
        status: flaggedTextVersionCount > 0 ? 'review_needed' : 'ok',
        flaggedTextVersionCount,
        withheldTextVersionCount,
        displayTextVersionId: displayTextVersion?.textVersionId ?? null,
        summary:
          flaggedTextVersionCount > 0
            ? 'One or more meaning versions need text-quality review before public guidance use.'
            : 'Available text versions passed the automated meaning-quality scan.',
      },
    };
  }

  private createLearningPath(
    quranAnchor: GuidanceSessionQuranAnchor | null,
    sunnahSupport: GuidanceSessionSunnahSupport[],
    sessionId: string,
  ): GuidanceSessionLearningPath {
    const hasTafsir = Boolean(quranAnchor?.tafsirSummary);
    const firstSunnah = sunnahSupport[0] ?? null;

    return {
      title: quranAnchor ? `Learn from ${quranAnchor.verseKey}` : 'Learning path needs stronger evidence',
      summary: quranAnchor
        ? 'Move from Quran recitation to meaning, tafsir context, Sunnah support, reflection, and one action.'
        : 'RAFIQ could not open a learning path without a Quran anchor.',
      steps: [
        {
          stepId: `${sessionId}:quran`,
          kind: 'quran',
          label: 'Quran',
          title: quranAnchor ? `Read ${quranAnchor.verseKey}` : 'Quran anchor unavailable',
          body: quranAnchor?.simpleMeaning ?? 'No Quran anchor was selected for this session.',
          reference: quranAnchor?.verseKey ?? null,
          route: quranAnchor ? ayahStudyRoute(quranAnchor.surahNumber, quranAnchor.ayahNumber) : null,
          sourceDetailTarget: quranAnchor?.sourceDetailTarget ?? null,
          available: Boolean(quranAnchor),
        },
        {
          stepId: `${sessionId}:tafsir`,
          kind: 'tafsir',
          label: 'Tafsir',
          title: hasTafsir ? 'Open the context' : 'Tafsir context pending',
          body: quranAnchor?.tafsirSummary ?? 'No tafsir passage is attached to this anchor yet.',
          reference: quranAnchor?.verseKey ?? null,
          route: quranAnchor
            ? tafsirStudyRoute(quranAnchor.ayah?.tafsirPassages.find((passage) => !passage.blankText)?.passageId) ??
              ayahStudyRoute(quranAnchor.surahNumber, quranAnchor.ayahNumber)
            : null,
          sourceDetailTarget: quranAnchor?.ayah?.tafsirPassages.find((passage) => !passage.blankText)?.sourceDetailTarget ?? null,
          available: hasTafsir,
        },
        {
          stepId: `${sessionId}:sunnah`,
          kind: 'sunnah',
          label: 'Hadith',
          title: firstSunnah ? firstSunnah.title : 'Sunnah support pending',
          body: firstSunnah?.practiceConnection ?? 'No Sunnah support is attached to this session yet.',
          reference: firstSunnah?.reference ?? null,
          route: firstSunnah?.sourceDetailTarget?.entityId ? `/hadith/${firstSunnah.sourceDetailTarget.entityId}` : '/hadith',
          sourceDetailTarget: firstSunnah?.sourceDetailTarget ?? null,
          available: Boolean(firstSunnah),
        },
        {
          stepId: `${sessionId}:reflection`,
          kind: 'reflection',
          label: 'Reflect',
          title: 'Pause and notice',
          body: quranAnchor
            ? `What is ${quranAnchor.verseKey} asking me to notice today?`
            : 'What question should I bring back with clearer context?',
          reference: quranAnchor?.verseKey ?? null,
          route: null,
          sourceDetailTarget: null,
          available: true,
        },
        {
          stepId: `${sessionId}:action`,
          kind: 'action',
          label: 'Act',
          title: 'Carry one action',
          body: quranAnchor
            ? 'Read the Quran anchor once more, then choose one small act of obedience.'
            : 'Ask again with one clearer detail before acting.',
          reference: quranAnchor?.verseKey ?? null,
          route: quranAnchor ? ayahStudyRoute(quranAnchor.surahNumber, quranAnchor.ayahNumber) : '/answer',
          sourceDetailTarget: null,
          available: true,
        },
      ],
    };
  }

  private verificationSummary(
    responseState: GuidanceSession['verification']['status'],
    evidenceCount: number,
    quranAnchor: GuidanceSessionQuranAnchor | null,
    sunnahCount: number,
    expandedNeed?: ExpandedGuidanceNeed,
  ): string {
    if (responseState === 'blocked' || responseState === 'source_unavailable') {
      return 'RAFIQ blocked this session because evidence is insufficient.';
    }
    if (responseState === 'scholar_escalation') return 'This session requires scholar review before application.';
    if (responseState === 'safety_escalation') return 'This session requires safety or professional support before guidance.';
    if (!quranAnchor) return 'RAFIQ could not select a Quran anchor yet.';
    const expansion = expandedNeed?.confidence && expandedNeed.confidence >= 0.8
      ? ` Theme expansion: ${expandedNeed.theme}.`
      : '';
    return `RAFIQ selected a Quran anchor with ${evidenceCount} evidence item(s) and ${sunnahCount} Sunnah support item(s).${expansion}`;
  }

  private createGuidanceMessage(
    quranAnchor: GuidanceSessionQuranAnchor | null,
    sunnahSupport: GuidanceSessionSunnahSupport[],
    _fallback?: string | null,
  ): string {
    if (!quranAnchor) {
      return 'I could not find enough verified evidence for this guidance yet. Ask again with one clearer detail, or choose a Quran theme already available in the library.';
    }

    const tafsirLine =
      quranAnchor.tafsirSummary && quranAnchor.tafsirSummary !== quranAnchor.simpleMeaning
        ? `The tafsir opens this meaning: ${quranAnchor.tafsirSummary}`
        : null;
    const sunnahLine = sunnahSupport[0]
      ? `Sunnah support: ${sunnahSupport[0].practiceConnection}`
      : null;

    return [
      `Begin with ${quranAnchor.verseKey}.`,
      quranAnchor.simpleMeaning,
      tafsirLine,
      sunnahLine,
    ]
      .filter(Boolean)
      .join(' ');
  }

  getModelAdapterStatus(): PrivateModelAdapterStatusResponse {
    const providerEnabled = process.env.RAFIQ_MODEL_PROVIDER_ENABLED === 'true';
    const providerKey = process.env.RAFIQ_MODEL_PROVIDER ?? 'disabled';
    const modelName = process.env.RAFIQ_MODEL_NAME ?? 'not_configured';
    const executionMode = process.env.RAFIQ_MODEL_EXECUTION_MODE ?? 'disabled_dry_run';

    return {
      notice: {
        label: 'UNAPPROVED CONTENT - NOT FOR PUBLICATION',
        message:
          'Private RAFIQ development and testing only. Do not expose through public API, public app, exports, or AI answers until approval gates pass.',
        rightsStatus: 'pending',
        attributionStatus: 'pending',
        editorialStatus: 'unreviewed',
        scholarContentStatus: 'unreviewed',
        publicationStatus: 'private_only',
      },
      modelAdapter: {
        providerEnabled,
        providerKey,
        modelName,
        executionMode,
        liveExecutionAllowed: false,
        status: providerEnabled ? 'configured_dry_run' : 'disabled',
      },
    };
  }

  createModelAdapterRun(guidedAnswerId: string): Promise<PrivateModelAdapterRunResponse> {
    const status = this.getModelAdapterStatus().modelAdapter;
    return this.repository.createModelAdapterRun({
      guidedAnswerId,
      providerEnabled: status.providerEnabled,
      providerKey: status.providerKey,
      modelName: status.modelName,
      executionMode: status.executionMode,
    });
  }

  getModelAdapterRun(modelAdapterRunId: string): Promise<PrivateModelAdapterRunResponse> {
    return this.repository.getModelAdapterRun(modelAdapterRunId);
  }

  createAnswerValidationRun(
    options: AnswerValidationRunOptions,
  ): Promise<PrivateAnswerValidationRunResponse> {
    return this.repository.createAnswerValidationRun(options);
  }

  getAnswerValidationRun(
    answerValidationRunId: string,
  ): Promise<PrivateAnswerValidationRunResponse> {
    return this.repository.getAnswerValidationRun(answerValidationRunId);
  }

  updateAnswerValidationReviewerAction(options: {
    answerValidationRunId: string;
    action: string;
    notes?: string;
  }): Promise<PrivateAnswerValidationRunResponse> {
    return this.repository.updateAnswerValidationReviewerAction(options);
  }
}
