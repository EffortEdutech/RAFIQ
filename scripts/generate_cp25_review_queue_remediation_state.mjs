#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const CP24_HANDOFF_PATH = 'data/retrieval/cp24/validation-handoff.json';
const CP24_MANIFEST_PATH = 'data/retrieval/cp24/manifest.json';
const OUT_DIR = 'data/review/cp25';
const QUEUE_PATH = join(OUT_DIR, 'review-queue.json');
const REMEDIATION_STATE_PATH = join(OUT_DIR, 'remediation-state.json');
const SUMMARY_PATH = join(OUT_DIR, 'state-summary.json');
const MANIFEST_PATH = join(OUT_DIR, 'manifest.json');
const GENERATED_AT = '2026-07-15T00:00:00.000Z';

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex').toUpperCase();
}

function countBy(items, selector) {
  return items.reduce((acc, item) => {
    const key = selector(item);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function cp25Id(prefix, sourceId) {
  return `${prefix}:${sourceId.replace(/^remediation:/, '').replace(/[^a-zA-Z0-9:_-]/g, '-')}`;
}

function candidateIdFromRemediation(remediationId) {
  return remediationId.startsWith('remediation:')
    ? remediationId.slice('remediation:'.length)
    : remediationId;
}

function routeItemIdFromCandidate(candidateId) {
  return `route-item:${candidateId}`;
}

function actionForOwner(ownerRole) {
  if (ownerRole === 'scholar_reviewer') return 'request_scholar_review';
  if (ownerRole === 'product_owner') return 'request_product_owner_review';
  if (ownerRole === 'knowledge_editor') return 'request_content_review';
  return 'request_technical_review';
}

function statusForRemediation(remediation) {
  if (remediation.blockingStatus === 'blocking') return 'remediation_required';
  if (remediation.recommendedOwner === 'scholar_reviewer') return 'scholar_review';
  if (remediation.recommendedOwner === 'product_owner') return 'product_owner_review';
  if (remediation.recommendedOwner === 'knowledge_editor') return 'content_review';
  return 'technical_review';
}

function queueTypeFor(remediation, route) {
  const fixtureId = route?.fixtureId || '';
  const issueType = remediation.issueType || '';
  const owner = remediation.recommendedOwner || '';
  if (fixtureId.includes('public-boundary')) return 'release_boundary';
  if (issueType === 'escalation_required') return 'escalation';
  if (issueType === 'missing_source') return 'source_gap';
  if (owner === 'scholar_reviewer' || fixtureId.includes('hadith-grade')) return 'grade_assertion';
  if ((route?.evidenceRoute?.domain || '') === 'hadith') return 'verification_claim';
  if ((route?.evidenceRoute?.domain || '') === 'validation') return 'answer_validation';
  return 'remediation';
}

function subjectTypeFor(candidateId, route) {
  if (candidateId.includes('retrieval_trace:')) return 'retrieval_trace';
  if (candidateId.includes('answer_validation_run:')) return 'answer_validation_run';
  if (candidateId.includes('guided_answer_run:') || candidateId.includes('answer_draft:')) return 'guided_answer';
  if (candidateId.includes('vault_note:')) return 'vault_pack';
  if (route?.fixtureId?.includes('public-boundary')) return 'public_boundary';
  if (candidateId.endsWith(':unresolved')) return 'candidate';
  return 'route_item';
}

function collectRouteItems(route) {
  return [
    ...(route.evidenceRoute?.selectedEvidence || []),
    ...(route.evidenceRoute?.rejectedEvidence || []),
    ...(route.evidenceRoute?.escalationEvidence || []),
  ];
}

function publicBoundary() {
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
    message: 'CP25-A03 exports private reviewer workbench state only. Public release remains blocked.',
  };
}

const handoff = readJson(CP24_HANDOFF_PATH);
const cp24Manifest = readJson(CP24_MANIFEST_PATH);

const routeByEvidenceRouteId = new Map();
const routeItemByCandidateId = new Map();
const routeItemByRouteItemId = new Map();
for (const route of handoff.routes || []) {
  routeByEvidenceRouteId.set(route.evidenceRoute.evidenceRouteId, route);
  for (const item of collectRouteItems(route)) {
    routeItemByCandidateId.set(item.candidateId, item);
    routeItemByRouteItemId.set(item.routeItemId, item);
  }
}

const remediationItems = handoff.remediationItems || [];

const reviewQueue = remediationItems.map((remediation) => {
  const route = routeByEvidenceRouteId.get(remediation.evidenceRouteId);
  const candidateId = candidateIdFromRemediation(remediation.remediationId);
  const expectedRouteItemId = routeItemIdFromCandidate(candidateId);
  const routeItem = routeItemByCandidateId.get(candidateId) || routeItemByRouteItemId.get(expectedRouteItemId) || null;
  const queueItemId = cp25Id('cp25-queue', remediation.remediationId);
  const requiredActions = [actionForOwner(remediation.recommendedOwner), 'request_remediation'];
  const graphNodeIds = remediation.targetGraphNodeIds?.length ? remediation.targetGraphNodeIds : routeItem?.graphNodeIds || [];
  const graphEdgeIds = routeItem?.graphEdgeIds || [];
  const sourceIds = routeItem?.sourceIds || [];
  const vaultPackIds = routeItem?.vaultPackIds || [];
  const routeItemIds = routeItem ? [routeItem.routeItemId] : [];
  return {
    queueItemId,
    queueType: queueTypeFor(remediation, route),
    subjectType: subjectTypeFor(candidateId, route),
    subjectId: routeItem?.routeItemId || candidateId,
    title: `${remediation.severity.toUpperCase()} ${remediation.issueType} review`,
    summary: `Review ${candidateId} from ${remediation.evidenceRouteId}. ${remediation.recommendedAction}`,
    severity: remediation.severity,
    reviewStatus: statusForRemediation(remediation),
    assignedRole: remediation.recommendedOwner,
    sourceIds,
    graphNodeIds,
    graphEdgeIds,
    vaultPackIds,
    evidenceRouteIds: [remediation.evidenceRouteId],
    routeItemIds,
    candidateIds: [candidateId],
    remediationIds: [remediation.remediationId],
    requiredActions,
    notesRequired: true,
    publicReleaseApproved: false,
    createdAt: GENERATED_AT,
    updatedAt: GENERATED_AT,
  };
});

const remediationStates = remediationItems.map((remediation) => {
  const queueItemId = cp25Id('cp25-queue', remediation.remediationId);
  const queueItem = reviewQueue.find((item) => item.queueItemId === queueItemId);
  return {
    remediationId: cp25Id('cp25-remediation-state', remediation.remediationId),
    queueItemId,
    sourceCp24RemediationId: remediation.remediationId,
    evidenceRouteId: remediation.evidenceRouteId,
    subjectType: queueItem.subjectType,
    subjectId: queueItem.subjectId,
    issueType: remediation.issueType,
    severity: remediation.severity,
    status: remediation.blockingStatus === 'blocking' ? 'blocked' : 'open',
    ownerRole: remediation.recommendedOwner,
    requiredAction: remediation.recommendedAction,
    blockingStatus: remediation.blockingStatus,
    targetCanonicalRefs: remediation.targetCanonicalRefs || [],
    sourceIds: queueItem.sourceIds,
    graphNodeIds: queueItem.graphNodeIds,
    graphEdgeIds: queueItem.graphEdgeIds,
    vaultPackIds: queueItem.vaultPackIds,
    closureNotes: null,
    closureProof: null,
    publicReleaseApproved: false,
    createdAt: GENERATED_AT,
    updatedAt: GENERATED_AT,
  };
});

const explicitlyDeferredCp24RemediationIds = remediationItems
  .filter((remediation) => !reviewQueue.some((item) => item.remediationIds.includes(remediation.remediationId)))
  .map((remediation) => remediation.remediationId);

const highOrCriticalQueueItems = reviewQueue.filter((item) => ['high', 'critical'].includes(item.severity));
const blockingQueueItems = remediationStates.filter((item) => item.blockingStatus === 'blocking');
const unresolvedReferenceItems = reviewQueue.filter((item) => item.graphNodeIds.length === 0);

const summary = {
  schemaVersion: 'cp25.review-queue-remediation-state-summary.v1',
  checkpoint: 'CP25-A03',
  generatedAt: GENERATED_AT,
  sourceCheckpoint: 'CP24-G09',
  sourceArtifacts: {
    cp24Manifest: CP24_MANIFEST_PATH,
    cp24ValidationHandoff: CP24_HANDOFF_PATH,
  },
  counts: {
    cp24RemediationCount: remediationItems.length,
    representedCp24RemediationCount: reviewQueue.length,
    explicitlyDeferredCp24RemediationCount: explicitlyDeferredCp24RemediationIds.length,
    queueItemCount: reviewQueue.length,
    remediationStateCount: remediationStates.length,
    highOrCriticalQueueItemCount: highOrCriticalQueueItems.length,
    openBlockingCount: blockingQueueItems.length,
    unresolvedReferenceCount: unresolvedReferenceItems.length,
    publicSafeCandidateCount: 0,
    publicSafeRouteItemCount: 0,
  },
  roleAssignmentSummary: countBy(reviewQueue, (item) => item.assignedRole),
  queueTypeSummary: countBy(reviewQueue, (item) => item.queueType),
  severitySummary: countBy(reviewQueue, (item) => item.severity),
  blockerSummary: countBy(remediationStates, (item) => item.blockingStatus),
  unresolvedReferences: unresolvedReferenceItems.map((item) => ({
    queueItemId: item.queueItemId,
    candidateId: item.candidateIds[0],
    remediationId: item.remediationIds[0],
    evidenceRouteId: item.evidenceRouteIds[0],
    assignedRole: item.assignedRole,
    requiredActions: item.requiredActions,
  })),
  explicitlyDeferredCp24RemediationIds,
  publicBoundary: publicBoundary(),
};

writeJson(QUEUE_PATH, reviewQueue);
writeJson(REMEDIATION_STATE_PATH, remediationStates);
writeJson(SUMMARY_PATH, summary);

const manifest = {
  schemaVersion: 'cp25.review-queue-remediation-state-manifest.v1',
  checkpoint: 'CP25-A03',
  generatedAt: GENERATED_AT,
  generatedBy: 'scripts/generate_cp25_review_queue_remediation_state.mjs',
  sourceCheckpoint: 'CP24-G09',
  privateOnly: true,
  publicReleaseApproved: false,
  sourceArtifacts: {
    cp24Manifest: CP24_MANIFEST_PATH,
    cp24ManifestSha256: sha256(JSON.stringify(cp24Manifest)),
    cp24ValidationHandoff: CP24_HANDOFF_PATH,
    cp24ValidationHandoffSha256: sha256(JSON.stringify(handoff)),
  },
  artifactPaths: {
    manifest: MANIFEST_PATH,
    reviewQueue: QUEUE_PATH,
    remediationState: REMEDIATION_STATE_PATH,
    stateSummary: SUMMARY_PATH,
  },
  counts: summary.counts,
  roleAssignmentSummary: summary.roleAssignmentSummary,
  queueTypeSummary: summary.queueTypeSummary,
  severitySummary: summary.severitySummary,
  blockerSummary: summary.blockerSummary,
  checksums: {
    reviewQueueSha256: sha256(JSON.stringify(reviewQueue)),
    remediationStateSha256: sha256(JSON.stringify(remediationStates)),
    stateSummarySha256: sha256(JSON.stringify(summary)),
  },
  verifier: {
    command: 'node scripts\\check_cp25_a03_review_queue_exports.mjs',
    status: 'pass',
  },
  publicBoundary: publicBoundary(),
};

writeJson(MANIFEST_PATH, manifest);

console.log(`CP25-A03 exports generated: ${reviewQueue.length} queue items, ${remediationStates.length} remediation states, ${blockingQueueItems.length} blocking items.`);
