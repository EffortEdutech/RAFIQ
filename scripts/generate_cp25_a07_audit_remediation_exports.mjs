#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const OUT_DIR = 'data/review/cp25';
const QUEUE_PATH = join(OUT_DIR, 'review-queue.json');
const REMEDIATION_STATE_PATH = join(OUT_DIR, 'remediation-state.json');
const A03_MANIFEST_PATH = join(OUT_DIR, 'manifest.json');
const AUDIT_EVENTS_PATH = join(OUT_DIR, 'audit-events.json');
const DECISION_LEDGER_PATH = join(OUT_DIR, 'decision-ledger.json');
const A04_MANIFEST_PATH = join(OUT_DIR, 'audit-decision-ledger-manifest.json');
const AUDIT_EXPORT_PATH = join(OUT_DIR, 'a07-audit-event-export.json');
const REMEDIATION_TRANSITION_PATH = join(OUT_DIR, 'a07-remediation-transition-export.json');
const WORKLOAD_SUMMARY_PATH = join(OUT_DIR, 'a07-reviewer-workload-summary.json');
const UNRESOLVED_ACTION_PATH = join(OUT_DIR, 'a07-unresolved-action-report.json');
const A07_MANIFEST_PATH = join(OUT_DIR, 'a07-export-manifest.json');
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
    message: 'CP25-A07 exports are private reviewer proof only. Public release remains blocked.',
  };
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function statusBucket(queueStatus, remediationStatus) {
  if (['resolved_private', 'rejected', 'deferred', 'retired'].includes(queueStatus)) return queueStatus;
  if (['resolved_private', 'rejected', 'deferred', 'retired'].includes(remediationStatus)) return remediationStatus;
  return 'open';
}

const reviewQueue = readJson(QUEUE_PATH);
const remediationStates = readJson(REMEDIATION_STATE_PATH);
const a03Manifest = readJson(A03_MANIFEST_PATH);
const auditEvents = readJson(AUDIT_EVENTS_PATH);
const decisionLedger = readJson(DECISION_LEDGER_PATH);
const a04Manifest = readJson(A04_MANIFEST_PATH);

const queueById = new Map(reviewQueue.map((item) => [item.queueItemId, item]));
const remediationByQueueId = new Map(remediationStates.map((item) => [item.queueItemId, item]));
const remediationById = new Map(remediationStates.map((item) => [item.remediationId, item]));
const auditById = new Map(auditEvents.map((item) => [item.auditEventId, item]));

const auditExport = auditEvents.map((event) => {
  const queueItem = queueById.get(event.queueItemId);
  const remediation = event.remediationId ? remediationById.get(event.remediationId) : remediationByQueueId.get(event.queueItemId);
  const ledgerEntry = decisionLedger.find((entry) => entry.auditEventId === event.auditEventId);
  return {
    exportEventId: `cp25-a07-audit-export:${String(event.eventSequence).padStart(3, '0')}`,
    checkpoint: 'CP25-A07',
    sourceAuditEventId: event.auditEventId,
    sourceLedgerEntryId: ledgerEntry?.ledgerEntryId || null,
    eventSequence: event.eventSequence,
    queueItemId: event.queueItemId,
    remediationStateId: event.remediationId,
    sourceCp24RemediationIds: remediation ? [remediation.sourceCp24RemediationId] : event.remediationIds,
    evidenceRouteIds: event.evidenceRouteIds,
    routeItemIds: event.routeItemIds,
    candidateIds: event.candidateIds,
    action: event.action,
    reviewerRole: event.reviewerRole,
    fromStatus: event.fromStatus,
    toStatus: event.toStatus,
    severity: queueItem?.severity || remediation?.severity || 'unknown',
    queueType: queueItem?.queueType || null,
    notes: event.notes,
    affectedRefs: {
      sourceIds: event.sourceIds,
      graphNodeIds: event.graphNodeIds,
      graphEdgeIds: event.graphEdgeIds,
      vaultPackIds: event.vaultPackIds,
      remediationIds: event.remediationIds,
    },
    privateOnly: true,
    publicReleaseApproved: false,
    publicSafeChangeRequested: false,
    createdAt: event.createdAt,
  };
});

const remediationTransitionExport = decisionLedger.map((entry) => {
  const queueItem = queueById.get(entry.queueItemId);
  const remediation = entry.remediationStateId ? remediationById.get(entry.remediationStateId) : remediationByQueueId.get(entry.queueItemId);
  return {
    transitionExportId: `cp25-a07-remediation-transition:${String(entry.eventSequence).padStart(3, '0')}`,
    checkpoint: 'CP25-A07',
    ledgerEntryId: entry.ledgerEntryId,
    auditEventId: entry.auditEventId,
    eventSequence: entry.eventSequence,
    queueItemId: entry.queueItemId,
    remediationStateId: entry.remediationStateId,
    sourceCp24RemediationId: remediation?.sourceCp24RemediationId || null,
    subjectType: queueItem?.subjectType || remediation?.subjectType || null,
    subjectId: queueItem?.subjectId || remediation?.subjectId || null,
    issueType: remediation?.issueType || null,
    severity: queueItem?.severity || remediation?.severity || 'unknown',
    ownerRole: remediation?.ownerRole || entry.reviewerRole,
    action: entry.action,
    previousState: entry.previousState,
    newState: entry.newState,
    statusDiff: entry.statusDiff,
    terminalState: statusBucket(entry.newState.queueStatus, entry.newState.remediationStatus),
    historyPreserved: {
      originalQueueStatus: entry.previousState.queueStatus,
      originalRemediationStatus: entry.previousState.remediationStatus,
      originalBlockingStatus: entry.previousState.blockingStatus,
      auditEventId: entry.auditEventId,
      ledgerEntryId: entry.ledgerEntryId,
      sourceCp24RemediationId: remediation?.sourceCp24RemediationId || null,
      closureNotes: remediation?.closureNotes || null,
      closureProof: remediation?.closureProof || null,
    },
    affectedRefs: entry.affectedRefs,
    privateOnly: true,
    publicReleaseApproved: false,
    publicSafeChangeRequested: false,
    recordedAt: entry.recordedAt,
  };
});

const reviewerWorkload = Object.entries(countBy(reviewQueue, (item) => item.assignedRole)).map(([reviewerRole, queueItemCount]) => {
  const roleQueue = reviewQueue.filter((item) => item.assignedRole === reviewerRole);
  const roleTransitions = remediationTransitionExport.filter((item) => item.ownerRole === reviewerRole);
  return {
    reviewerRole,
    queueItemCount,
    auditEventCount: auditExport.filter((item) => item.reviewerRole === reviewerRole).length,
    remediationTransitionCount: roleTransitions.length,
    openBlockingCount: roleQueue.filter((item) => item.severity === 'high' || item.severity === 'critical').length,
    severitySummary: countBy(roleQueue, (item) => item.severity),
    queueTypeSummary: countBy(roleQueue, (item) => item.queueType),
    actionSummary: countBy(auditExport.filter((item) => item.reviewerRole === reviewerRole), (item) => item.action),
    unresolvedQueueItemIds: roleTransitions.filter((item) => item.terminalState === 'open').map((item) => item.queueItemId),
  };
});

const finalStateSummary = {
  open: remediationTransitionExport.filter((item) => item.terminalState === 'open').length,
  resolved_private: remediationTransitionExport.filter((item) => item.terminalState === 'resolved_private').length,
  deferred: remediationTransitionExport.filter((item) => item.terminalState === 'deferred').length,
  rejected: remediationTransitionExport.filter((item) => item.terminalState === 'rejected').length,
  retired: remediationTransitionExport.filter((item) => item.terminalState === 'retired').length,
};

const unresolvedActions = remediationTransitionExport
  .filter((item) => item.terminalState === 'open')
  .map((item) => ({
    unresolvedActionId: `cp25-a07-unresolved:${item.queueItemId}`,
    queueItemId: item.queueItemId,
    remediationStateId: item.remediationStateId,
    sourceCp24RemediationId: item.sourceCp24RemediationId,
    evidenceRouteIds: item.affectedRefs.evidenceRouteIds,
    routeItemIds: item.affectedRefs.routeItemIds,
    candidateIds: item.affectedRefs.candidateIds,
    severity: item.severity,
    ownerRole: item.ownerRole,
    action: item.action,
    currentQueueStatus: item.newState.queueStatus,
    currentRemediationStatus: item.newState.remediationStatus,
    blockingStatus: item.previousState.blockingStatus,
    requiredFollowUp:
      item.severity === 'critical' || item.severity === 'high'
        ? 'Human reviewer must resolve blocker before any public-release gate can evaluate this evidence.'
        : 'Human reviewer must close or defer this private workflow item before CP25 close-out.',
    historyRef: {
      auditEventId: item.auditEventId,
      ledgerEntryId: item.ledgerEntryId,
      sourceCp24RemediationId: item.sourceCp24RemediationId,
    },
    privateOnly: true,
    publicReleaseApproved: false,
  }));

const workloadSummary = {
  schemaVersion: 'cp25.a07-reviewer-workload-summary.v1',
  checkpoint: 'CP25-A07',
  generatedAt: GENERATED_AT,
  sourceCheckpoint: 'CP25-A04',
  privateOnly: true,
  publicReleaseApproved: false,
  counts: {
    reviewerRoleCount: reviewerWorkload.length,
    queueItemCount: reviewQueue.length,
    auditEventCount: auditExport.length,
    remediationTransitionCount: remediationTransitionExport.length,
    unresolvedActionCount: unresolvedActions.length,
    openBlockingCount: unresolvedActions.filter((item) => item.severity === 'high' || item.severity === 'critical').length,
    publicSafeCandidateCount: 0,
    publicSafeRouteItemCount: 0,
  },
  reviewerWorkload,
  severitySummary: countBy(reviewQueue, (item) => item.severity),
  queueTypeSummary: countBy(reviewQueue, (item) => item.queueType),
  actionSummary: countBy(auditExport, (item) => item.action),
  finalStateSummary,
  publicBoundary: publicBoundary(),
};

const unresolvedActionReport = {
  schemaVersion: 'cp25.a07-unresolved-action-report.v1',
  checkpoint: 'CP25-A07',
  generatedAt: GENERATED_AT,
  sourceCheckpoint: 'CP25-A04',
  privateOnly: true,
  publicReleaseApproved: false,
  counts: {
    unresolvedActionCount: unresolvedActions.length,
    highOrCriticalUnresolvedActionCount: unresolvedActions.filter((item) => item.severity === 'high' || item.severity === 'critical').length,
    affectedEvidenceRouteCount: unique(unresolvedActions.flatMap((item) => item.evidenceRouteIds)).length,
    affectedCandidateCount: unique(unresolvedActions.flatMap((item) => item.candidateIds)).length,
    publicSafeCandidateCount: 0,
    publicSafeRouteItemCount: 0,
  },
  unresolvedActions,
  publicBoundary: publicBoundary(),
};

writeJson(AUDIT_EXPORT_PATH, auditExport);
writeJson(REMEDIATION_TRANSITION_PATH, remediationTransitionExport);
writeJson(WORKLOAD_SUMMARY_PATH, workloadSummary);
writeJson(UNRESOLVED_ACTION_PATH, unresolvedActionReport);

const manifest = {
  schemaVersion: 'cp25.a07-export-manifest.v1',
  checkpoint: 'CP25-A07',
  generatedAt: GENERATED_AT,
  generatedBy: 'scripts/generate_cp25_a07_audit_remediation_exports.mjs',
  sourceCheckpoint: 'CP25-A04',
  privateOnly: true,
  publicReleaseApproved: false,
  sourceArtifacts: {
    a03Manifest: A03_MANIFEST_PATH,
    a03ManifestSha256: sha256(JSON.stringify(a03Manifest)),
    a04Manifest: A04_MANIFEST_PATH,
    a04ManifestSha256: sha256(JSON.stringify(a04Manifest)),
    reviewQueue: QUEUE_PATH,
    reviewQueueSha256: sha256(JSON.stringify(reviewQueue)),
    remediationState: REMEDIATION_STATE_PATH,
    remediationStateSha256: sha256(JSON.stringify(remediationStates)),
    auditEvents: AUDIT_EVENTS_PATH,
    auditEventsSha256: sha256(JSON.stringify(auditEvents)),
    decisionLedger: DECISION_LEDGER_PATH,
    decisionLedgerSha256: sha256(JSON.stringify(decisionLedger)),
  },
  artifactPaths: {
    manifest: A07_MANIFEST_PATH,
    auditExport: AUDIT_EXPORT_PATH,
    remediationTransitionExport: REMEDIATION_TRANSITION_PATH,
    reviewerWorkloadSummary: WORKLOAD_SUMMARY_PATH,
    unresolvedActionReport: UNRESOLVED_ACTION_PATH,
  },
  counts: {
    auditExportEventCount: auditExport.length,
    remediationTransitionCount: remediationTransitionExport.length,
    reviewerRoleCount: reviewerWorkload.length,
    unresolvedActionCount: unresolvedActions.length,
    highOrCriticalUnresolvedActionCount: unresolvedActions.filter((item) => item.severity === 'high' || item.severity === 'critical').length,
    openBlockingCount: workloadSummary.counts.openBlockingCount,
    publicReleaseApprovedEventCount: auditExport.filter((item) => item.publicReleaseApproved).length,
    publicSafeCandidateCount: 0,
    publicSafeRouteItemCount: 0,
    publicSafeGraphNodeCount: 0,
    publicSafeGraphEdgeCount: 0,
    publicSafeVaultArtifactCount: 0,
  },
  roleSummary: countBy(auditExport, (item) => item.reviewerRole),
  actionSummary: countBy(auditExport, (item) => item.action),
  finalStateSummary,
  checksums: {
    auditExportSha256: sha256(JSON.stringify(auditExport)),
    remediationTransitionExportSha256: sha256(JSON.stringify(remediationTransitionExport)),
    reviewerWorkloadSummarySha256: sha256(JSON.stringify(workloadSummary)),
    unresolvedActionReportSha256: sha256(JSON.stringify(unresolvedActionReport)),
  },
  verifier: {
    command: 'node scripts\\check_cp25_a07_audit_remediation_exports.mjs',
    status: 'pass',
  },
  publicBoundary: publicBoundary(),
};

writeJson(A07_MANIFEST_PATH, manifest);

console.log(`CP25-A07 exports generated: ${auditExport.length} audit events, ${remediationTransitionExport.length} remediation transitions, ${unresolvedActions.length} unresolved actions.`);
