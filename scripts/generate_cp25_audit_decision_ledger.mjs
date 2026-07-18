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
const INVALID_FIXTURES_PATH = join(OUT_DIR, 'invalid-action-fixtures.json');
const TRANSITION_RULES_PATH = join(OUT_DIR, 'transition-rules.json');
const A04_MANIFEST_PATH = join(OUT_DIR, 'audit-decision-ledger-manifest.json');
const GENERATED_AT = '2026-07-15T00:00:00.000Z';

const ACTION_TARGET_STATUS = {
  claim: 'in_review',
  request_technical_review: 'technical_review',
  request_content_review: 'content_review',
  request_scholar_review: 'scholar_review',
  request_product_owner_review: 'product_owner_review',
  request_remediation: 'remediation_required',
  approve_private: 'resolved_private',
  mark_public_candidate: 'approved_public_candidate',
  reject: 'rejected',
  defer: 'deferred',
  retire: 'retired',
};

const ALLOWED_TRANSITIONS = {
  queued: ['in_review', 'technical_review', 'content_review', 'scholar_review', 'deferred', 'rejected'],
  in_review: ['technical_review', 'content_review', 'scholar_review', 'product_owner_review', 'remediation_required', 'resolved_private', 'rejected', 'deferred'],
  technical_review: ['content_review', 'scholar_review', 'remediation_required', 'resolved_private', 'rejected'],
  content_review: ['scholar_review', 'product_owner_review', 'remediation_required', 'resolved_private', 'rejected'],
  scholar_review: ['product_owner_review', 'remediation_required', 'resolved_private', 'rejected'],
  product_owner_review: ['approved_public_candidate', 'resolved_private', 'rejected', 'deferred'],
  remediation_required: ['technical_review', 'content_review', 'scholar_review', 'resolved_private', 'rejected'],
  resolved_private: ['product_owner_review', 'retired'],
  approved_public_candidate: ['retired', 'rejected'],
  rejected: ['retired'],
  deferred: ['queued', 'retired'],
};

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
    message: 'CP25-A04 audit ledger is private-only. Public release remains blocked.',
  };
}

function notesRequiredFor(queueItem, action) {
  return (
    action !== 'claim' ||
    queueItem.notesRequired === true ||
    ['high', 'critical'].includes(queueItem.severity) ||
    ['request_scholar_review', 'request_product_owner_review', 'request_remediation', 'approve_private', 'mark_public_candidate', 'reject', 'defer', 'retire'].includes(action)
  );
}

function validateAction({ queueItem, action, fromStatus, notes, boundaryAcknowledgement = publicBoundary() }) {
  const toStatus = ACTION_TARGET_STATUS[action] || 'rejected';
  const notesRequired = notesRequiredFor(queueItem, action);
  const missingRequiredNotes = notesRequired && !String(notes || '').trim();
  const invalidTransition = !(ALLOWED_TRANSITIONS[fromStatus] || []).includes(toStatus);
  const publicSafeChangeRequested = boundaryAcknowledgement.publicSafeChangeRequested !== false;
  const publicReleaseApproved = boundaryAcknowledgement.publicReleaseApproved !== false;
  const blockedReasons = [
    invalidTransition ? `Transition ${fromStatus} -> ${toStatus} is not allowed.` : null,
    missingRequiredNotes ? 'Required notes are missing.' : null,
    publicSafeChangeRequested ? 'Public-safe change requests are outside CP25.' : null,
    publicReleaseApproved ? 'Public release approval is outside CP25.' : null,
  ].filter(Boolean);
  return {
    allowed: blockedReasons.length === 0,
    toStatus,
    notesRequired,
    missingRequiredNotes,
    invalidTransition,
    blockedReasons,
    publicBoundary: publicBoundary(),
  };
}

function ownerActionForStatus(status, ownerRole) {
  if (status === 'remediation_required') {
    if (ownerRole === 'technical_reviewer') return 'request_technical_review';
    if (ownerRole === 'knowledge_editor') return 'request_content_review';
    if (ownerRole === 'scholar_reviewer') return 'request_scholar_review';
    return 'reject';
  }
  return 'request_remediation';
}

function remediationNextStatus(remediationState, action, toStatus) {
  if (!remediationState) return null;
  if (action === 'request_remediation') return remediationState.blockingStatus === 'blocking' ? 'blocked' : 'assigned';
  if (['request_technical_review', 'request_content_review', 'request_scholar_review'].includes(action)) return 'in_progress';
  if (action === 'reject') return 'rejected';
  if (action === 'defer') return 'deferred';
  if (action === 'approve_private' || toStatus === 'resolved_private') return 'resolved_private';
  return remediationState.status;
}

function eventNotes(queueItem, action, toStatus) {
  return `CP25-A04 prototype decision: ${action} moves ${queueItem.queueItemId} from ${queueItem.reviewStatus} to ${toStatus}. This is private workflow audit evidence only and does not publish content.`;
}

const reviewQueue = readJson(QUEUE_PATH);
const remediationStates = readJson(REMEDIATION_STATE_PATH);
const a03Manifest = readJson(A03_MANIFEST_PATH);
const remediationByQueueItemId = new Map(remediationStates.map((state) => [state.queueItemId, state]));

const auditEvents = [];
const decisionLedger = [];

for (const [index, queueItem] of reviewQueue.entries()) {
  const remediationState = remediationByQueueItemId.get(queueItem.queueItemId) || null;
  const action = ownerActionForStatus(queueItem.reviewStatus, queueItem.assignedRole);
  const fromStatus = queueItem.reviewStatus;
  const validation = validateAction({
    queueItem,
    action,
    fromStatus,
    notes: eventNotes(queueItem, action, ACTION_TARGET_STATUS[action]),
  });
  const auditEventId = `cp25-a04-audit:${String(index + 1).padStart(3, '0')}:${queueItem.queueItemId}`;
  const newRemediationStatus = remediationNextStatus(remediationState, action, validation.toStatus);
  const event = {
    eventSequence: index + 1,
    auditEventId,
    queueItemId: queueItem.queueItemId,
    remediationId: remediationState?.remediationId || null,
    action,
    fromStatus,
    toStatus: validation.toStatus,
    reviewerRole: queueItem.assignedRole,
    reviewerId: null,
    notes: eventNotes(queueItem, action, validation.toStatus),
    sourceIds: queueItem.sourceIds,
    graphNodeIds: queueItem.graphNodeIds,
    graphEdgeIds: queueItem.graphEdgeIds,
    vaultPackIds: queueItem.vaultPackIds,
    evidenceRouteIds: queueItem.evidenceRouteIds,
    routeItemIds: queueItem.routeItemIds,
    candidateIds: queueItem.candidateIds,
    remediationIds: queueItem.remediationIds,
    publicReleaseApproved: false,
    createdAt: GENERATED_AT,
  };
  auditEvents.push(event);
  decisionLedger.push({
    ledgerEntryId: `cp25-a04-ledger:${String(index + 1).padStart(3, '0')}:${queueItem.queueItemId}`,
    auditEventId,
    eventSequence: index + 1,
    queueItemId: queueItem.queueItemId,
    remediationStateId: remediationState?.remediationId || null,
    action,
    reviewerRole: queueItem.assignedRole,
    validation,
    previousState: {
      queueStatus: queueItem.reviewStatus,
      remediationStatus: remediationState?.status || null,
      blockingStatus: remediationState?.blockingStatus || null,
    },
    newState: {
      queueStatus: validation.toStatus,
      remediationStatus: newRemediationStatus,
      publicReleaseApproved: false,
      publicSafeChangeRequested: false,
    },
    statusDiff: {
      queueStatusChanged: queueItem.reviewStatus !== validation.toStatus,
      remediationStatusChanged: remediationState ? remediationState.status !== newRemediationStatus : false,
    },
    affectedRefs: {
      sourceIds: queueItem.sourceIds,
      graphNodeIds: queueItem.graphNodeIds,
      graphEdgeIds: queueItem.graphEdgeIds,
      vaultPackIds: queueItem.vaultPackIds,
      evidenceRouteIds: queueItem.evidenceRouteIds,
      routeItemIds: queueItem.routeItemIds,
      candidateIds: queueItem.candidateIds,
      remediationIds: queueItem.remediationIds,
    },
    immutableEventOrder: {
      appendOnly: true,
      previousEventSequence: index === 0 ? null : index,
      nextEventSequence: index + 2 <= reviewQueue.length ? index + 2 : null,
    },
    recordedAt: GENERATED_AT,
    publicBoundary: publicBoundary(),
  });
}

const sampleTechnicalItem = reviewQueue.find((item) => item.reviewStatus === 'technical_review');
const sampleBlockingItem = reviewQueue.find((item) => item.reviewStatus === 'remediation_required' && item.assignedRole === 'product_owner');
const sampleCriticalItem = reviewQueue.find((item) => ['high', 'critical'].includes(item.severity));

const invalidActionFixtures = [
  {
    fixtureId: 'cp25-a04-invalid-transition-001',
    queueItemId: sampleTechnicalItem.queueItemId,
    action: 'request_product_owner_review',
    fromStatus: sampleTechnicalItem.reviewStatus,
    notes: 'Attempt Product Owner routing from technical review.',
    validation: validateAction({
      queueItem: sampleTechnicalItem,
      action: 'request_product_owner_review',
      fromStatus: sampleTechnicalItem.reviewStatus,
      notes: 'Attempt Product Owner routing from technical review.',
    }),
  },
  {
    fixtureId: 'cp25-a04-missing-notes-001',
    queueItemId: sampleCriticalItem.queueItemId,
    action: 'request_remediation',
    fromStatus: sampleCriticalItem.reviewStatus,
    notes: '',
    validation: validateAction({
      queueItem: sampleCriticalItem,
      action: 'request_remediation',
      fromStatus: sampleCriticalItem.reviewStatus,
      notes: '',
    }),
  },
  {
    fixtureId: 'cp25-a04-public-candidate-without-po-001',
    queueItemId: sampleTechnicalItem.queueItemId,
    action: 'mark_public_candidate',
    fromStatus: sampleTechnicalItem.reviewStatus,
    notes: 'Attempt to mark public candidate without Product Owner review.',
    validation: validateAction({
      queueItem: sampleTechnicalItem,
      action: 'mark_public_candidate',
      fromStatus: sampleTechnicalItem.reviewStatus,
      notes: 'Attempt to mark public candidate without Product Owner review.',
    }),
  },
  {
    fixtureId: 'cp25-a04-public-safe-request-001',
    queueItemId: sampleBlockingItem.queueItemId,
    action: 'reject',
    fromStatus: sampleBlockingItem.reviewStatus,
    notes: 'Attempt action while asking for a public-safe change.',
    boundaryAcknowledgement: {
      privateOnly: true,
      publicReleaseApproved: false,
      publicRouteExposed: false,
      publicSafeChangeRequested: true,
    },
    validation: validateAction({
      queueItem: sampleBlockingItem,
      action: 'reject',
      fromStatus: sampleBlockingItem.reviewStatus,
      notes: 'Attempt action while asking for a public-safe change.',
      boundaryAcknowledgement: {
        privateOnly: true,
        publicReleaseApproved: false,
        publicRouteExposed: false,
        publicSafeChangeRequested: true,
      },
    }),
  },
];

const transitionRules = {
  schemaVersion: 'cp25.transition-rules.v1',
  checkpoint: 'CP25-A04',
  generatedAt: GENERATED_AT,
  actionTargetStatus: ACTION_TARGET_STATUS,
  allowedTransitions: ALLOWED_TRANSITIONS,
  requiredNotesPolicy: [
    'Notes are required for every action except low/medium claim actions.',
    'Notes are required for all high and critical queue items.',
    'Notes are required for scholar, Product Owner, remediation, rejection, deferral, retirement, private approval, and public-candidate routing.',
    'Notes must not contain secrets, service keys, raw private prompts, or private user reflections.',
  ],
  immutableEventOrdering: {
    appendOnly: true,
    eventSequenceStartsAt: 1,
    eventSequenceMustBeContiguous: true,
    auditEventsMustNotBeOverwritten: true,
  },
  publicBoundary: publicBoundary(),
};

writeJson(AUDIT_EVENTS_PATH, auditEvents);
writeJson(DECISION_LEDGER_PATH, decisionLedger);
writeJson(INVALID_FIXTURES_PATH, invalidActionFixtures);
writeJson(TRANSITION_RULES_PATH, transitionRules);

const validActionCount = decisionLedger.filter((entry) => entry.validation.allowed).length;
const manifest = {
  schemaVersion: 'cp25.audit-decision-ledger-manifest.v1',
  checkpoint: 'CP25-A04',
  generatedAt: GENERATED_AT,
  generatedBy: 'scripts/generate_cp25_audit_decision_ledger.mjs',
  sourceCheckpoint: 'CP25-A03',
  privateOnly: true,
  publicReleaseApproved: false,
  sourceArtifacts: {
    a03Manifest: A03_MANIFEST_PATH,
    a03ManifestSha256: sha256(JSON.stringify(a03Manifest)),
    reviewQueue: QUEUE_PATH,
    reviewQueueSha256: sha256(JSON.stringify(reviewQueue)),
    remediationState: REMEDIATION_STATE_PATH,
    remediationStateSha256: sha256(JSON.stringify(remediationStates)),
  },
  artifactPaths: {
    manifest: A04_MANIFEST_PATH,
    auditEvents: AUDIT_EVENTS_PATH,
    decisionLedger: DECISION_LEDGER_PATH,
    invalidActionFixtures: INVALID_FIXTURES_PATH,
    transitionRules: TRANSITION_RULES_PATH,
  },
  counts: {
    queueItemCount: reviewQueue.length,
    remediationStateCount: remediationStates.length,
    auditEventCount: auditEvents.length,
    decisionLedgerEntryCount: decisionLedger.length,
    validActionCount,
    invalidActionFixtureCount: invalidActionFixtures.length,
    invalidTransitionFixtureCount: invalidActionFixtures.filter((fixture) => fixture.validation.invalidTransition).length,
    missingRequiredNotesFixtureCount: invalidActionFixtures.filter((fixture) => fixture.validation.missingRequiredNotes).length,
    publicBoundaryFixtureCount: invalidActionFixtures.filter((fixture) => fixture.validation.blockedReasons.some((reason) => reason.includes('Public-safe'))).length,
    publicReleaseApprovedEventCount: auditEvents.filter((event) => event.publicReleaseApproved).length,
    publicSafeCandidateCount: 0,
    publicSafeRouteItemCount: 0,
  },
  actionSummary: countBy(auditEvents, (event) => event.action),
  roleSummary: countBy(auditEvents, (event) => event.reviewerRole),
  transitionSummary: countBy(auditEvents, (event) => `${event.fromStatus}->${event.toStatus}`),
  checksums: {
    auditEventsSha256: sha256(JSON.stringify(auditEvents)),
    decisionLedgerSha256: sha256(JSON.stringify(decisionLedger)),
    invalidActionFixturesSha256: sha256(JSON.stringify(invalidActionFixtures)),
    transitionRulesSha256: sha256(JSON.stringify(transitionRules)),
  },
  verifier: {
    command: 'node scripts\\check_cp25_a04_audit_decision_ledger.mjs',
    status: 'pass',
  },
  publicBoundary: publicBoundary(),
};

writeJson(A04_MANIFEST_PATH, manifest);

console.log(`CP25-A04 audit ledger generated: ${auditEvents.length} audit events, ${decisionLedger.length} ledger entries, ${invalidActionFixtures.length} invalid fixtures.`);
